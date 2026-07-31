import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function Deer({ position, rotationY = 0.4, scale = 1 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[0.45, 0.55, 0.85]} />
        <meshStandardMaterial color="#7a5c42" roughness={0.82} />
      </mesh>
      <mesh castShadow position={[0, 1.05, 0.35]}>
        <boxGeometry args={[0.22, 0.35, 0.35]} />
        <meshStandardMaterial color="#6b4f38" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 1.25, 0.62]}>
        <boxGeometry args={[0.18, 0.2, 0.28]} />
        <meshStandardMaterial color="#5a4330" roughness={0.78} />
      </mesh>
      <mesh castShadow position={[-0.12, 1.35, 0.72]} rotation={[0.2, 0, 0.3]}>
        <cylinderGeometry args={[0.02, 0.04, 0.35, 6]} />
        <meshStandardMaterial color="#4a3828" />
      </mesh>
      <mesh castShadow position={[0.12, 1.35, 0.72]} rotation={[0.2, 0, -0.3]}>
        <cylinderGeometry args={[0.02, 0.04, 0.35, 6]} />
        <meshStandardMaterial color="#4a3828" />
      </mesh>
    </group>
  );
}

export default function StaticWildlife() {
  const duck = useRef(null);

  useFrame(({ clock }) => {
    if (!duck.current) return;
    const t = clock.elapsedTime;
    duck.current.position.x = 4.2 + Math.sin(t * 0.7) * 0.25;
    duck.current.position.y = 0.12 + Math.sin(t * 2.2) * 0.03;
  });

  return (
    <group>
      <Deer position={[-5.2, 0, 2.8]} rotationY={0.55} scale={1.15} />
      <Deer position={[-4.5, 0, 2.2]} rotationY={0.35} scale={0.62} />
      <group position={[6.2, 0, 3.6]} rotation={[0, -0.6, 0]}>
        <mesh castShadow position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial color="#c4b4a4" roughness={0.75} />
        </mesh>
        <mesh castShadow position={[0.1, 0.22, 0.05]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.65} />
        </mesh>
      </group>
      <group position={[3.8, 0.18, -0.6]} rotation={[0, 0.2, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 8, 6]} />
          <meshStandardMaterial color="#4a6b4a" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0.12, 0.02, 0.08]}>
          <cylinderGeometry args={[0.12, 0.14, 0.08, 8]} />
          <meshStandardMaterial color="#5a7d5a" roughness={0.72} />
        </mesh>
      </group>
      <group ref={duck} position={[4.2, 0.12, 2.1]} rotation={[0, -0.3, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#6b5344" roughness={0.75} />
        </mesh>
        <mesh castShadow position={[0.14, 0.02, 0]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color="#5a4838" />
        </mesh>
      </group>
    </group>
  );
}
