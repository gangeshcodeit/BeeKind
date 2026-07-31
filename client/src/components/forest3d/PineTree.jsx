import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function PineTree({ position = [0, 0, 0], scale = 1, swayOffset = 0 }) {
  const group = useRef(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime + swayOffset;
    group.current.rotation.z = Math.sin(t * 0.65) * 0.04;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.14, 0.2, 2.8, 8]} />
        <meshStandardMaterial color="#4a3520" roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0, 2.25, 0]}>
        <coneGeometry args={[0.92, 1.15, 10]} />
        <meshStandardMaterial color="#1e4d2a" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0, 2.95, 0]}>
        <coneGeometry args={[0.72, 0.95, 10]} />
        <meshStandardMaterial color="#2a6b38" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 3.5, 0]}>
        <coneGeometry args={[0.48, 0.75, 8]} />
        <meshStandardMaterial color="#347844" roughness={0.68} />
      </mesh>
    </group>
  );
}
