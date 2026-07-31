import { Suspense } from "react";
import { Sky, OrbitControls } from "@react-three/drei";
import Ground from "./Ground.jsx";
import Tree from "./Tree.jsx";
import PineTree from "./PineTree.jsx";
import River from "./River.jsx";
import Clouds from "./Clouds.jsx";
import Animal from "./Animal.jsx";
import AirParticles from "./AirParticles.jsx";
import Flowers from "./Flowers.jsx";
import ForestPlayer from "./ForestPlayer.jsx";
import FinaleAtmosphere from "./FinaleAtmosphere.jsx";
import InstancedMeadow from "./InstancedMeadow.jsx";
import Waterfall from "./Waterfall.jsx";
import StaticWildlife from "./StaticWildlife.jsx";
import FinaleBirds from "./FinaleBirds.jsx";
import ChildAvatar from "./ChildAvatar.jsx";

const GOLDEN = 2.39996322972865332;

function treePositions(n, finale) {
  const spread = finale ? 1.5 : 1;
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const angle = i * GOLDEN + 0.6;
    const r = (1.4 + Math.sqrt(i + 1) * 1.05) * spread;
    out.push([Math.cos(angle) * r, 0, Math.sin(angle) * r]);
  }
  return out;
}

export default function ForestScene({ forest }) {
  const f = forest || {
    land: true,
    airParticles: false,
    treeCount: 0,
    foliageBoost: 1,
    river: false,
    clouds: false,
    cleanGround: false,
    animalCount: 0,
    treeScaleBoost: 1,
    finale: false,
    flowerCount: 0,
    sunBoost: 1,
  };

  const positions = treePositions(f.treeCount, f.finale);
  const dirIntensity = (0.85 + (f.finale ? 0.55 : 0)) * (f.sunBoost || 1);
  const sunPos = f.finale ? [80, 22, 120] : [50, 80, 30];

  return (
    <>
      <color attach="background" args={[f.finale ? "#f0c9a0" : "#6eb5d9"]} />
      <Sky
        sunPosition={sunPos}
        turbidity={f.finale ? 4.5 : 8}
        rayleigh={f.finale ? 0.8 : 2}
        mieCoefficient={f.finale ? 0.018 : 0.005}
        mieDirectionalG={f.finale ? 0.88 : 0.8}
      />
      <ambientLight intensity={f.finale ? 0.42 : 0.38} color={f.finale ? "#ffe8d0" : "#ffffff"} />
      <directionalLight
        castShadow
        position={f.finale ? [18, 26, 12] : [12, 22, 14]}
        intensity={dirIntensity}
        color={f.finale ? "#ffd4a8" : "#ffffff"}
        shadow-mapSize-width={f.finale ? 2048 : 1024}
        shadow-mapSize-height={f.finale ? 2048 : 1024}
        shadow-camera-far={f.finale ? 70 : 50}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
      />
      {f.finale && (
        <directionalLight position={[-28, 14, -18]} intensity={0.28} color="#9ec9ff" castShadow={false} />
      )}
      {f.finale && (
        <directionalLight position={[-12, 36, -8]} intensity={0.42} color="#ffc878" castShadow={false} />
      )}

      {f.finale ? (
        <ForestPlayer />
      ) : (
        <OrbitControls makeDefault minPolarAngle={0.35} maxPolarAngle={Math.PI / 2.05} maxDistance={28} minDistance={4} />
      )}

      {f.finale && (
        <Suspense fallback={null}>
          <FinaleAtmosphere />
        </Suspense>
      )}

      <Ground clean={f.cleanGround} finale={f.finale} />
      <ChildAvatar finale={f.finale} position={f.finale ? [2.4, 0.06, 6.2] : [2.6, 0.06, 5.8]} rotationY={f.finale ? -0.45 : -0.55} />
      {f.finale && <InstancedMeadow />}
      {f.airParticles && !f.finale && <AirParticles />}
      {positions.map((pos, i) =>
        f.finale && i % 2 === 1 ? (
          <PineTree key={i} position={pos} scale={f.treeScaleBoost} swayOffset={i * 0.7} />
        ) : (
          <Tree
            key={i}
            position={pos}
            scale={f.treeScaleBoost}
            foliageBoost={f.foliageBoost}
            swayOffset={i * 0.7}
          />
        )
      )}
      {f.river && <River finale={f.finale} />}
      {f.river && f.finale && <Waterfall />}
      {f.clouds && <Clouds />}
      {f.finale ? (
        <>
          <StaticWildlife />
          <FinaleBirds />
        </>
      ) : (
        f.animalCount > 0 &&
        Array.from({ length: f.animalCount }).map((_, i) => <Animal key={i} index={i} radius={5.5 + (i % 3) * 0.4} />)
      )}
      {f.flowerCount > 0 && <Flowers count={f.finale ? Math.max(f.flowerCount, 28) : f.flowerCount} />}
    </>
  );
}
