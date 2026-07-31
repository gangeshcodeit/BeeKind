import { Cloud } from "@react-three/drei";

export default function Clouds() {
  return (
    <group>
      <Cloud position={[-6, 5, -8]} speed={0.25} opacity={0.85} segments={12} />
      <Cloud position={[8, 6, -6]} speed={0.18} opacity={0.75} segments={10} />
      <Cloud position={[2, 7, -12]} speed={0.2} opacity={0.7} segments={8} />
    </group>
  );
}
