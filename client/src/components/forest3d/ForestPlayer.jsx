import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";

const keys = { w: false, a: false, s: false, d: false, shift: false };

function bindKeyHandlers() {
  const down = (e) => {
    const k = e.key.toLowerCase();
    if (k === "w") keys.w = true;
    if (k === "a") keys.a = true;
    if (k === "s") keys.s = true;
    if (k === "d") keys.d = true;
    if (e.shiftKey) keys.shift = true;
  };
  const up = (e) => {
    const k = e.key.toLowerCase();
    if (k === "w") keys.w = false;
    if (k === "a") keys.a = false;
    if (k === "s") keys.s = false;
    if (k === "d") keys.d = false;
    if (!e.shiftKey) keys.shift = false;
  };
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
  };
}

export default function ForestPlayer() {
  const { camera } = useThree();
  const plRef = useRef(null);
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3(0, 1, 0));
  const move = useRef(new THREE.Vector3());

  useLayoutEffect(() => {
    camera.position.set(2.2, 1.65, 10.5);
    camera.rotation.order = "YXZ";
    camera.rotation.y = -0.25;
    camera.rotation.x = -0.08;
  }, [camera]);

  useLayoutEffect(() => bindKeyHandlers(), []);

  useFrame((_, delta) => {
    const pl = plRef.current;
    if (!pl?.isLocked) return;

    camera.getWorldDirection(forward.current);
    forward.current.y = 0;
    if (forward.current.lengthSq() < 1e-8) return;
    forward.current.normalize();

    right.current.crossVectors(forward.current, up.current).normalize();

    move.current.set(0, 0, 0);
    if (keys.w) move.current.add(forward.current);
    if (keys.s) move.current.sub(forward.current);
    if (keys.a) move.current.sub(right.current);
    if (keys.d) move.current.add(right.current);

    if (move.current.lengthSq() > 0) {
      move.current.normalize();
      const speed = keys.shift ? 16 : 8;
      camera.position.addScaledVector(move.current, speed * delta);
    }

    camera.position.y = 1.65;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -24, 24);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -24, 24);
  });

  return <PointerLockControls ref={plRef} selector="#forest-canvas" makeDefault />;
}
