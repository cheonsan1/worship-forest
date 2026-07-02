import React from 'react';
import { Flower } from '../../types';

interface FlowerMeshProps {
  flower: Flower;
  onClick: () => void;
  position: [number, number, number];
}

export default function FlowerMesh({ flower, onClick, position }: FlowerMeshProps) {
  let petalColor = '#fc6c85';
  if (flower.emoji === '🌸') petalColor = '#ffb7c5';
  if (flower.emoji === '🌷') petalColor = '#f43f5e';
  if (flower.emoji === '🌻') petalColor = '#eab308';
  if (flower.emoji === '🌼') petalColor = '#facc15';
  if (flower.emoji === '🌹') petalColor = '#dc2626';

  return (
    <group position={position}>
      {/* 줄기 */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>

      {/* 꽃술 (중앙) */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color={petalColor} roughness={0.6} />
      </mesh>

      {/* 꽃잎 5개 */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        const x = Math.sin(angle) * 0.16;
        const z = Math.cos(angle) * 0.16;
        return (
          <mesh key={i} position={[x, 0.5, z]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.1, 0.07, 0.3]} />
            <meshStandardMaterial color={petalColor} roughness={0.5} />
          </mesh>
        );
      })}

      {/* 클릭 판정용 투명 박스 */}
      <mesh position={[0, 0.4, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <boxGeometry args={[1.0, 1.0, 1.0]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
