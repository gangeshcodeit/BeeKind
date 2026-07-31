import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Animal({ index = 0, radius = 5 }) {
  const group = useRef(null);
  const base = (index / 5) * Math.PI * 2;

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime * 0.35 + base;
    const r = radius + Math.sin(t * 2) * 0.4;
    group.current.position.x = Math.cos(t) * r;
    group.current.position.z = Math.sin(t) * r * 0.85;
    group.current.position.y = 1.8 + Math.sin(t * 3 + index) * 0.15;
    group.current.rotation.y = -t + Math.PI / 2;
  });

  return (
    <group ref={group}>
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.22, 0.5]} />
        <meshStandardMaterial color="#6b4f2a" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0.22, 0.05, 0]}>
        <coneGeometry args={[0.12, 0.25, 6]} />
        <meshStandardMaterial color="#f4a742" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[-0.28, 0.12, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.45, 0.08, 0.12]} />
        <meshStandardMaterial color="#3d6b8f" roughness={0.55} />
      </mesh>
    </group>
  );
}
