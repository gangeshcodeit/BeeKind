import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const BIRDS = [
  { r: 7, y: 3.2, speed: 0.45, phase: 0 },
  { r: 9, y: 4.1, speed: 0.38, phase: 1.2 },
  { r: 5.5, y: 2.6, speed: 0.52, phase: 2.4 },
  { r: 8.2, y: 3.8, speed: 0.4, phase: 0.8 },
];

export default function FinaleBirds() {
  const group = useRef(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((bird, i) => {
      const b = BIRDS[i % BIRDS.length];
      const ang = t * b.speed + b.phase;
      bird.position.set(Math.cos(ang) * b.r, b.y + Math.sin(t * 1.5 + i) * 0.15, Math.sin(ang) * b.r * 0.75);
      bird.rotation.y = -ang + Math.PI / 2;
    });
  });

  return (
    <group ref={group}>
      {BIRDS.map((_, i) => (
        <group key={i}>
          <mesh castShadow>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshStandardMaterial color="#f4d03f" emissive="#c9a227" emissiveIntensity={0.15} roughness={0.45} />
          </mesh>
          <mesh castShadow position={[-0.12, 0, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.22, 0.04, 0.1]} />
            <meshStandardMaterial color="#7eb8d6" roughness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
