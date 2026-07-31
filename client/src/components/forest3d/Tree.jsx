import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Tree({ position = [0, 0, 0], scale = 1, foliageBoost = 1, swayOffset = 0 }) {
  const group = useRef(null);
  const foliageScale = 0.85 * foliageBoost;

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime + swayOffset;
    group.current.rotation.z = Math.sin(t * 0.8) * 0.06;
    group.current.rotation.x = Math.sin(t * 0.5 + swayOffset) * 0.02;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 2, 8]} />
        <meshStandardMaterial color="#5c3d1e" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 2.1, 0]}>
        <sphereGeometry args={[foliageScale, 12, 10]} />
        <meshStandardMaterial color="#2d7a3e" roughness={0.65} />
      </mesh>
      <mesh castShadow position={[0.35, 2.35, 0.1]}>
        <sphereGeometry args={[foliageScale * 0.55, 8, 8]} />
        <meshStandardMaterial color="#3a9d4f" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[-0.3, 2.25, -0.15]}>
        <sphereGeometry args={[foliageScale * 0.45, 8, 8]} />
        <meshStandardMaterial color="#348f47" roughness={0.62} />
      </mesh>
    </group>
  );
}
