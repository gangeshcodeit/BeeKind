import { useMemo } from "react";

const COLORS = ["#f472b6", "#fbbf24", "#a78bfa", "#34d399", "#fb7185"];

export default function Flowers({ count = 12 }) {
  const items = useMemo(() => {
    const out = [];
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2 + 0.4;
      const r = 3.5 + (i % 3) * 0.6;
      out.push({
        pos: [Math.cos(a) * r, 0.12, Math.sin(a) * r],
        color: COLORS[i % COLORS.length],
        rot: Math.random() * Math.PI,
      });
    }
    return out;
  }, [count]);

  return (
    <group>
      {items.map((f, i) => (
        <group key={i} position={f.pos} rotation={[0, f.rot, 0]}>
          <mesh castShadow position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.16, 6]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
          <mesh castShadow position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[0.12, 8, 6]} />
            <meshStandardMaterial color={f.color} emissive={f.color} emissiveIntensity={0.12} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
