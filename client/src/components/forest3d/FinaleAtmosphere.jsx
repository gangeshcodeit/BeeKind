import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { FogExp2 } from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export default function FinaleAtmosphere() {
  const { scene, camera } = useThree();

  useLayoutEffect(() => {
    const prevFog = scene.fog;
    const prevFar = camera.far;
    scene.fog = new FogExp2("#d8b88c", 0.022);
    camera.far = 200;
    return () => {
      scene.fog = prevFog;
      camera.far = prevFar;
    };
  }, [scene, camera]);

  return (
    <>
      <Environment preset="sunset" background={false} />
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom luminanceThreshold={0.45} mipmapBlur intensity={0.55} radius={0.42} />
        <Vignette eskil={false} offset={0.08} darkness={0.5} />
      </EffectComposer>
    </>
  );
}
