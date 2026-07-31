import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Waterfall() {
  const foam = useRef(null);
  const mist = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (foam.current) foam.current.material.opacity = 0.35 + Math.sin(t * 2.5) * 0.12;
    if (mist.current) mist.current.rotation.y = t * 0.08;
  });

  /* Upstream end of the main river strip (river runs mostly along ±X near z≈2). */
  return (
    <group position={[-13.5, 0, 2.2]}>
      <mesh castShadow position={[0, 0.9, 0]}>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#5c4a3a" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0.9, 1.2, 0.4]}>
        <dodecahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial color="#4d4034" roughness={0.92} />
      </mesh>
      <mesh position={[0, 2.4, 0.6]} rotation={[0, 0.2, 0]}>
        <planeGeometry args={[2.8, 4.2]} />
        <meshStandardMaterial
          color="#8fd4f0"
          transparent
          opacity={0.45}
          metalness={0.05}
          roughness={0.15}
          emissive="#3a7ca8"
          emissiveIntensity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={foam} position={[0, 0.35, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.4]} />
        <meshStandardMaterial color="#eaf8ff" transparent opacity={0.5} roughness={0.4} />
      </mesh>
      <mesh ref={mist} position={[0, 2.8, 1.2]}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshStandardMaterial color="#fff8e8" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}
