import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Tree, Flower, Settings } from '../types';

export function useFirebase() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [settings, setSettings] = useState<Settings>(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('churchName') : null;
    return { churchName: cached || '천산중앙교회' };
  });

  useEffect(() => {
    // Settings listener
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as Settings;
        setSettings(data);
        if (data.churchName) {
          localStorage.setItem('churchName', data.churchName);
        }
      } else {
        setDoc(doc.ref, { churchName: '천산중앙교회' }); // initialize if not exists
      }
    });

    // Trees listener with automatic deduplication and merging
    const unsubTrees = onSnapshot(collection(db, 'trees'), async (snapshot) => {
      const treeData: Tree[] = [];
      snapshot.forEach((doc) => {
        treeData.push({ id: doc.id, ...doc.data() } as Tree);
      });

      // 동일한 가정 이름(familyName) 중복 검사 및 자동 병합
      const familyMap = new Map<string, Tree[]>();
      treeData.forEach((tree) => {
        const name = (tree.familyName || '').trim();
        if (!familyMap.has(name)) familyMap.set(name, []);
        familyMap.get(name)!.push(tree);
      });

      const mergedTrees: Tree[] = [];
      for (const [, dupList] of familyMap.entries()) {
        if (dupList.length > 1) {
          // 중복이 발견된 경우 첫 번째 문서에 모든 logs를 합치고 날짜 역순 정렬
          const primary = dupList[0];
          const allLogs = [...(primary.logs || [])];
          const seenLogIds = new Set(allLogs.map(l => l.id));

          for (let i = 1; i < dupList.length; i++) {
            (dupList[i].logs || []).forEach(log => {
              if (!seenLogIds.has(log.id)) {
                seenLogIds.add(log.id);
                allLogs.push(log);
              }
            });
          }

          allLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          const unifiedTree: Tree = {
            ...primary,
            logs: allLogs
          };
          mergedTrees.push(unifiedTree);

          // Firestore에 대표 문서 업데이트 및 중복 문서 삭제 비동기 동기화
          try {
            await updateDoc(doc(db, 'trees', primary.id), { logs: allLogs });
            for (let i = 1; i < dupList.length; i++) {
              await deleteDoc(doc(db, 'trees', dupList[i].id));
            }
          } catch (err) {
            console.error('Error auto-merging duplicate trees in Firestore:', err);
          }
        } else {
          mergedTrees.push(dupList[0]);
        }
      }

      setTrees(mergedTrees);
    });

    // Flowers listener
    const unsubFlowers = onSnapshot(collection(db, 'flowers'), (snapshot) => {
      const flowerData: Flower[] = [];
      snapshot.forEach((doc) => {
        flowerData.push({ id: doc.id, ...doc.data() } as Flower);
      });
      setFlowers(flowerData);
    });

    return () => {
      unsubSettings();
      unsubTrees();
      unsubFlowers();
    };
  }, []);

  // Actions
  const updateChurchName = async (name: string) => {
    await updateDoc(doc(db, 'settings', 'global'), { churchName: name });
  };

  const addFlower = async (flower: Omit<Flower, 'id'>) => {
    await addDoc(collection(db, 'flowers'), flower);
  };

  const updateFlower = async (id: string, data: Partial<Flower>) => {
    await updateDoc(doc(db, 'flowers', id), data);
  };

  const addTree = async (tree: Omit<Tree, 'id'>) => {
    await addDoc(collection(db, 'trees'), tree);
  };

  const updateTree = async (id: string, data: Partial<Tree>) => {
    await updateDoc(doc(db, 'trees', id), data);
  };

  const resetAllData = async () => {
    // Delete all flowers
    flowers.forEach(async (f) => {
      await deleteDoc(doc(db, 'flowers', f.id));
    });
    // Delete all trees
    trees.forEach(async (t) => {
      await deleteDoc(doc(db, 'trees', t.id));
    });
  };

  return {
    trees,
    flowers,
    settings,
    updateChurchName,
    addFlower,
    updateFlower,
    addTree,
    updateTree,
    resetAllData
  };
}
