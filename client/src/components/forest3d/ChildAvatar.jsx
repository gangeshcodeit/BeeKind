import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Simple stylized child (kid proportions) — welcoming presence in My Forest.
 */
export default function ChildAvatar({ position = [2.6, 0.06, 5.8], rotationY = -0.55, finale = false }) {
  const bob = useRef(null);
  const armL = useRef(null);
  const armR = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (bob.current) bob.current.position.y = Math.sin(t * 1.8) * 0.018;
    if (armL.current) armL.current.rotation.x = Math.sin(t * 2.2) * 0.12;
    if (armR.current) armR.current.rotation.x = -Math.sin(t * 2.2) * 0.12;
  });

  const s = finale ? 0.92 : 0.88;

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={s}>
      <group ref={bob}>
      <mesh castShadow receiveShadow position={[0, 0.34, 0]}>
        <capsuleGeometry args={[0.14, 0.28, 6, 8]} />
        <meshStandardMaterial color="#f4c2a8" roughness={0.65} />
      </mesh>
      <mesh castShadow position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.22, 14, 12]} />
        <meshStandardMaterial color="#f5d4be" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0, 0.78, 0.18]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#2c1810" roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.52, 0]}>
        <boxGeometry args={[0.34, 0.26, 0.2]} />
        <meshStandardMaterial color="#5cb3d4" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[0.22, 0.2, 0.18]} />
        <meshStandardMaterial color="#3d6b9e" roughness={0.75} />
      </mesh>
      <mesh castShadow position={[-0.08, 0.12, 0.02]}>
        <boxGeometry args={[0.1, 0.14, 0.12]} />
        <meshStandardMaterial color="#2a5080" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.08, 0.12, 0.02]}>
        <boxGeometry args={[0.1, 0.14, 0.12]} />
        <meshStandardMaterial color="#2a5080" roughness={0.8} />
      </mesh>
      <group ref={armL} position={[-0.22, 0.58, 0]}>
        <mesh castShadow rotation={[0, 0, 0.35]} position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.04, 0.2, 4, 6]} />
          <meshStandardMaterial color="#f4c2a8" roughness={0.65} />
        </mesh>
      </group>
      <group ref={armR} position={[0.22, 0.58, 0]}>
        <mesh castShadow rotation={[0, 0, -0.35]} position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.04, 0.2, 4, 6]} />
          <meshStandardMaterial color="#f4c2a8" roughness={0.65} />
        </mesh>
      </group>
      </group>
    </group>
  );
}
