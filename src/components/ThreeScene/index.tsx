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
  // 숲 크기 동적 스케일링 공식
  const totalElements = trees.length + flowers.length;
  const baseRadius = 8;
  const radiusExpansion = Math.min(10, totalElements * 0.8);
  const gardenRadius = baseRadius + radiusExpansion;
  const dynamicCamDist = 18 + (gardenRadius * 0.8);

  // 나무와 꽃의 위치를 계산하여 캐싱
  const { positionedTrees, positionedFlowers } = useMemo(() => {
    const pTrees = trees.map((tree, idx) => {
      let tx = tree.x;
      let tz = tree.z;
      
      if (tx === undefined || tz === undefined) {
        const angle = (idx * Math.PI * 2.3) + Math.random();
        const dist = 1.5 + (Math.random() * (gardenRadius * 0.45));
        tx = Math.cos(angle) * dist;
        tz = Math.sin(angle) * dist;
      } else {
        const originalDist = Math.hypot(tx, tz);
        if (originalDist > gardenRadius * 0.6) {
          const angle = Math.atan2(tz, tx);
          const newDist = (gardenRadius * 0.4) + (Math.random() * 2);
          tx = Math.cos(angle) * newDist;
          tz = Math.sin(angle) * newDist;
        }
      }
      return { ...tree, x: tx, z: tz };
    });

    const pFlowers = flowers.map((flower, idx) => {
      let fx = 0;
      let fz = 0;

      if (pTrees.length > 0) {
        const targetTree = pTrees[idx % pTrees.length];
        const tX = targetTree.x || 0;
        const tZ = targetTree.z || 0;

        const flowerAngle = Math.random() * Math.PI * 2;
        const distFromTree = 1.2 + (Math.random() * 1.6);
        fx = tX + Math.cos(flowerAngle) * distFromTree;
        fz = tZ + Math.sin(flowerAngle) * distFromTree;

        const distFromCenter = Math.hypot(fx, fz);
        if (distFromCenter > gardenRadius - 1.2) {
          fx *= (gardenRadius - 1.5) / distFromCenter;
          fz *= (gardenRadius - 1.5) / distFromCenter;
        }
      } else {
        const flowerAngle = (idx * Math.PI * 2.5) + Math.random();
        const distFromCenter = 1.0 + (Math.random() * (gardenRadius * 0.4));
        fx = Math.cos(flowerAngle) * distFromCenter;
        fz = Math.sin(flowerAngle) * distFromCenter;
      }
      return { ...flower, x: fx, z: fz };
    });

    return { positionedTrees: pTrees, positionedFlowers: pFlowers };
  }, [trees, flowers, gardenRadius]);

  return (
    <Canvas
      camera={{ position: [0, dynamicCamDist * 0.7, dynamicCamDist * 1.0], fov: 45 }}
      shadows
    >
      <color attach="background" args={['#f0fdf4']} />
      
      {/* Lights */}
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[20, 35, 15]} 
        intensity={0.85} 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
      />
      <hemisphereLight intensity={0.5} groundColor="#8d9b9c" />

      {/* Garden Platform */}
      <mesh position={[0, -0.75, 0]} receiveShadow>
        <cylinderGeometry args={[gardenRadius, gardenRadius + 1, 1.5, 64]} />
        <meshStandardMaterial color="#86efac" roughness={0.85} metalness={0.05} />
      </mesh>
      
      {/* Garden Border */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[gardenRadius, 0.25, 12, 64]} />
        <meshStandardMaterial color="#22c55e" roughness={0.5} />
      </mesh>

      {/* Contact Shadows for realism */}
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={gardenRadius * 2.5} blur={2} far={10} />

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
          position={[flower.x, 0, flower.z]}
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
      />
    </Canvas>
  );
}
