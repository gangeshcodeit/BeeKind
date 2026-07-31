export default function Ground({ clean = false, finale = false }) {
  const patches = clean
    ? []
    : [
        [2.2, 0.01, -1.8],
        [-3.5, 0.01, 2.4],
        [1.0, 0.01, 4.2],
        [-5.0, 0.01, -3.0],
      ];

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[48, 48, 24, 24]} />
        <meshStandardMaterial
          color={finale ? "#3d6f3f" : clean ? "#3f7d46" : "#2d5a32"}
          roughness={finale ? 0.88 : 0.92}
          metalness={0.02}
          emissive={finale ? "#2a4d22" : clean ? "#1a4d22" : "#0f2d14"}
          emissiveIntensity={finale ? 0.22 : clean ? 0.18 : 0.08}
        />
      </mesh>
      {finale && (
        <mesh rotation={[-Math.PI / 2, 0, 0.35]} position={[2.4, 0.015, 0]} receiveShadow>
          <planeGeometry args={[2.2, 38, 1, 1]} />
          <meshStandardMaterial color="#6b5344" roughness={0.94} metalness={0.03} />
        </mesh>
      )}
      {patches.map((pos, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={pos} receiveShadow>
          <circleGeometry args={[1.1 + (i % 2) * 0.35, 16]} />
          <meshStandardMaterial color="#1f3d24" roughness={0.98} transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}
