import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import type { Tree, Flower } from '../../types';
import TreeMesh from './TreeMesh';
import FlowerMesh from './FlowerMesh';
import * as THREE from 'three';

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

  // 부드러운 숲 바닥(자연스러운 페이드 아웃) 텍스처 생성
  const groundTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, 'rgba(110, 231, 183, 0.7)'); // emerald-300
      gradient.addColorStop(0.5, 'rgba(167, 243, 208, 0.4)'); // emerald-200
      gradient.addColorStop(1, 'rgba(167, 243, 208, 0)'); // fade out completely
      context.fillStyle = gradient;
      context.fillRect(0, 0, 512, 512);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

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

      {/* Natural Soft Ground (원형 테두리 제거 후 자연스러운 그라데이션) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[gardenRadius * 3, gardenRadius * 3]} />
        <meshStandardMaterial 
          map={groundTexture} 
          transparent={true} 
          depthWrite={false}
          roughness={1} 
        />
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
