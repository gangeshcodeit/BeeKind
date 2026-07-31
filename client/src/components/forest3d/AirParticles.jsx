import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const COUNT = 42;

export default function AirParticles() {
  const ref = useRef(null);
  const phases = useMemo(() => Array.from({ length: COUNT }, () => Math.random() * Math.PI * 2), []);

  const bases = useMemo(() => {
    const arr = [];
    for (let i = 0; i < COUNT; i += 1) {
      const a = (i / COUNT) * Math.PI * 2;
      const r = 3 + Math.random() * 6;
      arr.push([Math.cos(a) * r, 1 + Math.random() * 2, Math.sin(a) * r]);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.children.forEach((mesh, i) => {
      const p = phases[i];
      const [bx, , bz] = bases[i];
      mesh.position.x = bx + Math.sin(t * 0.35 + p) * 0.35;
      mesh.position.y = 1.2 + Math.sin(t * 0.6 + p) * 0.85;
      mesh.position.z = bz + Math.cos(t * 0.28 + p) * 0.25;
    });
  });

  return (
    <group ref={ref}>
      {bases.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06 + (i % 4) * 0.02, 6, 6]} />
          <meshStandardMaterial color="#b8e8ff" emissive="#6ec8ff" emissiveIntensity={0.35} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}
