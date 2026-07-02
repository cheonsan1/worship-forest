import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { Flower } from '../../types';

interface FlowerMeshProps {
  flower: Flower;
  onClick: () => void;
  position: [number, number, number];
}

export default function FlowerMesh({ flower, onClick, position }: FlowerMeshProps) {
  const [hovered, setHovered] = useState(false);

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
      <mesh 
        position={[0, 0.4, 0]} 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; e.stopPropagation(); setHovered(false); }}
      >
        <boxGeometry args={[1.0, 1.0, 1.0]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* 이름 라벨 */}
      <Html position={[0, 0.9, 0]} center style={{
        transition: 'all 0.2s ease-in-out',
        opacity: hovered ? 1 : 0.4,
        filter: hovered ? 'none' : 'blur(0.5px)',
        background: 'rgba(0,0,0,0.4)',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        transform: hovered ? 'scale(1.1)' : 'scale(1)'
      }}>
        {flower.name}
      </Html>
    </group>
  );
}
