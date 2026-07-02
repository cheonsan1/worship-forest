import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Tree, Flower, Settings } from '../types';

export function useFirebase() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [settings, setSettings] = useState<Settings>({ churchName: '우리의' });

  useEffect(() => {
    // Settings listener
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as Settings);
      } else {
        setDoc(doc.ref, { churchName: '우리의' }); // initialize if not exists
      }
    });

    // Trees listener
    const unsubTrees = onSnapshot(collection(db, 'trees'), (snapshot) => {
      const treeData: Tree[] = [];
      snapshot.forEach((doc) => {
        treeData.push({ id: doc.id, ...doc.data() } as Tree);
      });
      setTrees(treeData);
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
