import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";

/**
 * Main water strip — centered so orbit (0,5,10→origin) and FPS spawn (z≈10.5) see it clearly.
 * Sits slightly above the grass plane to avoid z-fighting.
 */
export default function River({ finale = false }) {
  const mesh = useRef(null);

  const span = finale ? 28 : 22;
  const width = finale ? 5.5 : 4.5;
  const baseY = finale ? 0.09 : 0.07;

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    mesh.current.position.y = baseY + Math.sin(t * 1.2) * 0.012;
    mesh.current.rotation.z = Math.sin(t * 0.4) * 0.015;
  });

  return (
    <group position={[0, 0, finale ? 2.2 : 2]}>
      <mesh ref={mesh} position={[0, baseY, 0]} rotation={[-Math.PI / 2, 0, 0.1]} receiveShadow>
        <planeGeometry args={[span, width, finale ? 28 : 20, finale ? 12 : 8]} />
        {finale ? (
          <MeshDistortMaterial
            color="#1f7aab"
            metalness={0.22}
            roughness={0.2}
            transparent
            opacity={0.96}
            emissive="#0f4a6e"
            emissiveIntensity={0.28}
            distort={0.26}
            speed={1.25}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-1}
          />
        ) : (
          <meshStandardMaterial
            color="#1a6fa5"
            metalness={0.18}
            roughness={0.22}
            transparent
            opacity={0.95}
            emissive="#082d48"
            emissiveIntensity={0.22}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-1}
          />
        )}
      </mesh>
      {/* Shallow banks so the water reads as a channel */}
      <mesh rotation={[-Math.PI / 2, 0, 0.1]} position={[0, -0.02, width / 2 + 0.08]} receiveShadow>
        <planeGeometry args={[span + 2, 0.55, 1, 1]} />
        <meshStandardMaterial color="#4a7a48" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0.1]} position={[0, -0.02, -width / 2 - 0.08]} receiveShadow>
        <planeGeometry args={[span + 2, 0.55, 1, 1]} />
        <meshStandardMaterial color="#4a7a48" roughness={0.95} />
      </mesh>
    </group>
  );
}
