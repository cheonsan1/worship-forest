import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import type { Tree, Flower } from '../../types';
import TreeMesh from './TreeMesh';
import FlowerMesh from './FlowerMesh';

interface ThreeSceneProps {
  trees: Tree[];
  flowers: Flower[];
  onSelect: (type: 'tree' | 'flower', id: string) => void;
}

export default function ThreeScene({ trees, flowers, onSelect }: ThreeSceneProps) {
  const totalElements = trees.length + flowers.length;
  // 숲 스케일 동적 확장 공식
  const gardenRadius = 10 + Math.min(20, Math.sqrt(totalElements) * 1.5);
  const dynamicCamDist = 20 + gardenRadius * 0.9;

  // 수학적 자연 알고리즘(Phyllotaxis - 피보나치 나선)을 적용한 좌표 계산
  const { positionedTrees, positionedFlowers } = useMemo(() => {
    const PHI = Math.PI * (3 - Math.sqrt(5)); // 황금각 (Golden Angle) ~137.5도

    // 1. 나무 나선형 배치
    const pTrees = trees.map((tree, idx) => {
      let tx = tree.x;
      let tz = tree.z;
      
      // 이미 저장된 좌표가 없거나 너무 외곽에 벗어난 경우 나선형 알고리즘으로 (재)배치
      if (tx === undefined || tz === undefined || Math.hypot(tx, tz) > gardenRadius * 0.8) {
        // 중심을 비워두기 위해 idx + 2 부터 시작
        const r = 2.0 * Math.sqrt(idx + 2); // 퍼지는 반경 계수 c=2.0
        const theta = idx * PHI;
        tx = Math.cos(theta) * r;
        tz = Math.sin(theta) * r;
      }
      return { ...tree, x: tx, z: tz };
    });

    // 2. 꽃 클러스터링 배치 (나무 주변 군락)
    const pFlowers = flowers.map((flower, idx) => {
      let fx = flower.x;
      let fz = flower.z;

      if (fx === undefined || fz === undefined || Math.hypot(fx, fz) > gardenRadius * 0.9) {
        if (pTrees.length > 0) {
          // 꽃을 나무들에게 균등하게 할당하되, 나무 주위에 모여 피어나도록(클러스터링) 설정
          const targetTreeIndex = idx % pTrees.length;
          const targetTree = pTrees[targetTreeIndex];
          
          // 해당 나무 주변에 작은 나선형(또는 무작위)으로 배치
          // 여기서는 꽃의 순서(idx)에 기반해 작은 황금각 회전 적용
          const flowerRadius = 1.0 + (Math.random() * 1.5); // 나무로부터 1~2.5 떨어진 거리
          const flowerTheta = idx * PHI;
          
          fx = (targetTree.x || 0) + Math.cos(flowerTheta) * flowerRadius;
          fz = (targetTree.z || 0) + Math.sin(flowerTheta) * flowerRadius;
        } else {
          // 나무가 아예 없을 경우 중앙 나선형 배치
          const r = 1.5 * Math.sqrt(idx + 1);
          const theta = idx * PHI;
          fx = Math.cos(theta) * r;
          fz = Math.sin(theta) * r;
        }
      }
      return { ...flower, x: fx, z: fz };
    });

    return { positionedTrees: pTrees, positionedFlowers: pFlowers };
  }, [trees, flowers, gardenRadius]);

  return (
    <Canvas
      camera={{ position: [0, dynamicCamDist * 0.6, dynamicCamDist * 1.0], fov: 45 }}
      shadows
    >
      <color attach="background" args={['transparent']} />
      
      {/* Lights */}
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[20, 35, 15]} 
        intensity={0.85} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.001}
      />
      <hemisphereLight intensity={0.5} groundColor="#8d9b9c" />

      {/* Garden Platform (부드러운 디자인) */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <cylinderGeometry args={[gardenRadius, gardenRadius * 1.1, 1.2, 64]} />
        <meshStandardMaterial color="#a7f3d0" roughness={0.9} metalness={0.0} />
      </mesh>
      
      {/* Garden Border */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[gardenRadius, 0.15, 12, 64]} />
        <meshStandardMaterial color="#34d399" roughness={0.5} />
      </mesh>

      {/* Contact Shadows for realism */}
      <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={gardenRadius * 2.5} blur={2.5} far={15} resolution={512} />

      {/* Trees */}
      {positionedTrees.map((tree) => (
        <TreeMesh 
          key={tree.id} 
          tree={tree} 
          onClick={() => onSelect('tree', tree.id)} 
        />
      ))}

      {/* Flowers */}
      {positionedFlowers.map((flower) => (
        <FlowerMesh 
          key={flower.id} 
          flower={flower} 
          position={[flower.x || 0, 0, flower.z || 0]}
          onClick={() => onSelect('flower', flower.id)} 
        />
      ))}

      {/* Controls */}
      <OrbitControls 
        makeDefault
        enablePan={false}
        minDistance={10}
        maxDistance={80}
        maxPolarAngle={Math.PI / 2 - 0.05}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
