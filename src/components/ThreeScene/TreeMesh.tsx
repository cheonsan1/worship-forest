import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Tree } from '../../types';
import * as THREE from 'three';

interface TreeMeshProps {
  tree: Tree;
  onClick: () => void;
}

export default function TreeMesh({ tree, onClick }: TreeMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const count = tree.logs.length;

  useFrame(() => {
    // 황금 띠 회전 애니메이션
    if (groupRef.current && count >= 7) {
      groupRef.current.children.forEach(mesh => {
        if ((mesh as any).geometry?.type === 'RingGeometry') {
          mesh.rotation.z += 0.01;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[tree.x || 0, 0, tree.z || 0]}>
      {/* 나무 기둥 */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.32, 1.5, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.95} />
      </mesh>

      {/* 나무 잎사귀 (성장 단계별) */}
      {count === 1 && (
        <>
          <mesh position={[0.18, 1.2, 0]} rotation={[0, 0, 0.4]} scale={[1.4, 0.55, 0.55]}>
            <sphereGeometry args={[0.32, 8, 8]} />
            <meshStandardMaterial color="#10b981" roughness={0.6} />
          </mesh>
          <mesh position={[-0.18, 1.2, 0]} rotation={[0, 0, -0.4]} scale={[1.4, 0.55, 0.55]}>
            <sphereGeometry args={[0.32, 8, 8]} />
            <meshStandardMaterial color="#10b981" roughness={0.6} />
          </mesh>
        </>
      )}

      {count === 2 && (
        <mesh position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[0.55, 12, 12]} />
          <meshStandardMaterial color="#4ade80" roughness={0.7} />
        </mesh>
      )}

      {count >= 3 && count <= 4 && (
        <>
          <mesh position={[0, 1.7, 0]} castShadow>
            <coneGeometry args={[0.9, 1.4, 8]} />
            <meshStandardMaterial color="#0f766e" roughness={0.8} />
          </mesh>
          <mesh position={[0, 2.35, 0]} castShadow>
            <coneGeometry args={[0.65, 1.1, 8]} />
            <meshStandardMaterial color="#0f766e" roughness={0.8} />
          </mesh>
        </>
      )}

      {count >= 5 && count <= 6 && (
        <>
          <mesh position={[0, 1.9, 0]} castShadow>
            <sphereGeometry args={[1.1, 16, 16]} />
            <meshStandardMaterial color="#15803d" roughness={0.85} />
          </mesh>
          <mesh position={[0.35, 2.45, 0.18]} castShadow>
            <sphereGeometry args={[0.75, 16, 16]} />
            <meshStandardMaterial color="#15803d" roughness={0.85} />
          </mesh>
          <mesh position={[-0.35, 2.35, -0.25]} castShadow>
            <sphereGeometry args={[0.75, 16, 16]} />
            <meshStandardMaterial color="#15803d" roughness={0.85} />
          </mesh>
        </>
      )}

      {count >= 7 && (
        <>
          <mesh position={[0, 2.2, 0]} castShadow>
            <sphereGeometry args={[1.6, 16, 16]} />
            <meshStandardMaterial color="#166534" roughness={0.8} />
          </mesh>
          {/* 사과 */}
          {[
            [0.7, 2.4, 0.7], [-0.7, 2.0, 0.9], [0, 2.9, 0.7],
            [0.9, 1.6, -0.7], [-0.9, 2.6, -0.7], [0.4, 2.2, -1.1]
          ].map((pos, idx) => (
            <mesh key={idx} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.16, 8, 8]} />
              <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.1} />
            </mesh>
          ))}
          {/* 황금 띠 */}
          <mesh position={[0, 2.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.1, 2.2, 32]} />
            <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </>
      )}

      {/* 클릭 판정용 투명 메시 */}
      <mesh 
        position={[0, 1.6, 0]} 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; e.stopPropagation(); setHovered(false); }}
      >
        <cylinderGeometry args={[1.3, 1.3, 3.2, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* 이름 라벨 */}
      <Html position={[0, count >= 7 ? 4.0 : count >= 5 ? 3.3 : count >= 3 ? 3.0 : 2.0, 0]} center style={{
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
        {tree.familyName}
      </Html>
    </group>
  );
}
