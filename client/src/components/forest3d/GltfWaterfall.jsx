import { Clone, useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FOREST_MODELS } from "./forestModelUrls.js";

const vs = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
void main() {
  vUv = uv;
  vec3 p = position;
  p.x += sin(p.y * 2.0 + uTime * 2.2) * 0.06;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fs = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uShallow;
void main() {
  vec2 f = vUv * vec2(4.0, 8.0) + uTime * vec2(0.15, 0.55);
  float m = 0.5 + 0.5 * sin(f.x * 6.0) * cos(f.y * 3.0 + uTime);
  vec3 c = mix(uDeep, uShallow, m);
  gl_FragColor = vec4(c, 0.55);
}
`;

export default function GltfWaterfall() {
  const { scene } = useGLTF(FOREST_MODELS.rock);
  const foam = useRef(null);

  const fallMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uDeep: { value: new THREE.Color("#0a3550") },
          uShallow: { value: new THREE.Color("#6ec8f0") },
        },
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame(({ clock }) => {
    fallMat.uniforms.uTime.value = clock.elapsedTime;
    if (foam.current) foam.current.material.opacity = 0.32 + Math.sin(clock.elapsedTime * 2.4) * 0.1;
  });

  const rocks = useMemo(
    () => [
      { pos: [0, 0.85, 0], scale: [1.4, 1.1, 1.3], rotY: 0.2 },
      { pos: [0.95, 1.15, 0.35], scale: [1.1, 0.95, 1.05], rotY: -0.5 },
      { pos: [-0.6, 0.55, 0.5], scale: [0.85, 0.75, 0.9], rotY: 1.1 },
    ],
    []
  );

  return (
    <group position={[-13.5, 0, 2.2]}>
      {rocks.map((r, i) => (
        <group key={i} position={r.pos} rotation={[0, r.rotY, 0]}>
          <Clone object={scene} scale={r.scale} castShadow receiveShadow />
        </group>
      ))}
      <mesh position={[0, 2.35, 0.55]} rotation={[0, 0.15, 0]} material={fallMat}>
        <planeGeometry args={[2.6, 4.0, 12, 20]} />
      </mesh>
      <mesh ref={foam} position={[0, 0.32, 0.85]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 1.2]} />
        <meshStandardMaterial color="#eaf6ff" transparent opacity={0.45} roughness={0.35} depthWrite={false} />
      </mesh>
    </group>
  );
}
