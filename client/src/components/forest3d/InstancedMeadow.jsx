import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const GRASS = 380;
const DAISIES = 140;

export default function InstancedMeadow() {
  const grassRef = useRef(null);
  const flowerRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const grassGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const grassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2f6b3a",
        roughness: 0.85,
      }),
    []
  );
  const flowerGeo = useMemo(() => new THREE.SphereGeometry(1, 6, 5), []);
  const flowerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fffef0",
        emissive: "#f5e6a8",
        emissiveIntensity: 0.12,
        roughness: 0.55,
      }),
    []
  );

  useLayoutEffect(() => {
    if (!grassRef.current) return;
    for (let i = 0; i < GRASS; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.8 + Math.random() * 16;
      dummy.position.set(Math.cos(a) * r, 0.22, Math.sin(a) * r);
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.35,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.25
      );
      dummy.scale.set(0.06 + Math.random() * 0.04, 0.35 + Math.random() * 0.35, 0.06 + Math.random() * 0.03);
      dummy.updateMatrix();
      grassRef.current.setMatrixAt(i, dummy.matrix);
    }
    grassRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useLayoutEffect(() => {
    if (!flowerRef.current) return;
    for (let i = 0; i < DAISIES; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.2 + Math.random() * 14;
      dummy.position.set(Math.cos(a) * r, 0.14, Math.sin(a) * r);
      dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
      dummy.scale.setScalar(0.22 + Math.random() * 0.18);
      dummy.updateMatrix();
      flowerRef.current.setMatrixAt(i, dummy.matrix);
    }
    flowerRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <group>
      <instancedMesh ref={grassRef} args={[grassGeo, grassMat, GRASS]} castShadow receiveShadow />
      <instancedMesh ref={flowerRef} args={[flowerGeo, flowerMat, DAISIES]} castShadow />
    </group>
  );
}
