"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildField, NODE_COUNT } from "./field-data";
import { useSceneStore } from "@/lib/store";

/* -- Line shader: a sine "signal" travels along each connection. ---- */
const lineVertex = /* glsl */ `
  attribute float aProgress;
  attribute float aSeed;
  varying float vProgress;
  varying float vSeed;
  void main() {
    vProgress = aProgress;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lineFragment = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vProgress;
  varying float vSeed;
  void main() {
    // A pulse position cycling 0..1, offset per-edge by its seed.
    float t = fract(uTime * 0.16 + vSeed);
    float d = abs(vProgress - t);
    d = min(d, 1.0 - d);
    float pulse = smoothstep(0.18, 0.0, d);
    vec3 col = mix(uColorA, uColorB, vProgress);
    float alpha = 0.07 + pulse * 0.85;
    gl_FragColor = vec4(col * (0.45 + pulse * 1.1), alpha);
  }
`;

interface CollectiveFieldProps {
  /** "low" trims node count + skips per-node colour writes. */
  quality?: "high" | "low";
}

/**
 * "The Collective Field" — a slow-rotating lattice of luminous nodes
 * joined by signal-carrying lines. Camera dollies forward on scroll;
 * nodes near the cursor pulse and brighten.
 */
export function CollectiveField({ quality = "high" }: CollectiveFieldProps) {
  const count = quality === "low" ? 40 : NODE_COUNT;
  const field = useMemo(() => buildField(count), [count]);

  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lineMatRef = useRef<THREE.ShaderMaterial>(null);

  // Reusable scratch objects — never allocate inside useFrame.
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const baseColor = useMemo(() => new THREE.Color("#aab2ff"), []);
  const hotColor = useMemo(() => new THREE.Color("#f0f4ff"), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  // Line geometry attributes — 2 vertices per edge.
  const lineGeo = useMemo(() => {
    const e = field.edges.length;
    const positions = new Float32Array(e * 2 * 3);
    const progress = new Float32Array(e * 2);
    const seed = new Float32Array(e * 2);
    field.edges.forEach(([a, b], i) => {
      positions.set(field.nodes.subarray(a * 3, a * 3 + 3), i * 6);
      positions.set(field.nodes.subarray(b * 3, b * 3 + 3), i * 6 + 3);
      progress[i * 2] = 0;
      progress[i * 2 + 1] = 1;
      const s = (i % 100) / 100;
      seed[i * 2] = s;
      seed[i * 2 + 1] = s;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aProgress", new THREE.BufferAttribute(progress, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [field]);

  const lineUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#6e7bff") },
      uColorB: { value: new THREE.Color("#9ae6ff") },
    }),
    [],
  );

  // Seed instance matrices + colours once.
  const initialised = useRef(false);
  useFrame((state, delta) => {
    const group = groupRef.current;
    const mesh = meshRef.current;
    if (!group || !mesh) return;

    const t = state.clock.elapsedTime;
    const { scrollProgress, latticeTilt } = useSceneStore.getState();

    /* -- Field motion: Y-spin, breathing, scroll-driven expansion. -- */
    group.rotation.y += delta * 0.04;
    group.rotation.z = THREE.MathUtils.lerp(
      group.rotation.z,
      latticeTilt,
      0.04,
    );
    const breathe = 1.01 + Math.sin((t / 6) * Math.PI * 2) * 0.01;
    const expand = 1 + Math.min(scrollProgress * 2, 1) * 0.35;
    group.scale.setScalar(breathe * expand);
    group.updateMatrixWorld();

    /* -- Camera: dolly forward on scroll + damped cursor parallax. -- */
    const cam = state.camera;
    const dollyZ = THREE.MathUtils.lerp(
      11,
      -3,
      Math.min(scrollProgress * 2, 1),
    );
    cam.position.z += (dollyZ - cam.position.z) * 0.06;
    cam.position.x += (state.pointer.x * 0.5 - cam.position.x) * 0.06;
    cam.position.y += (state.pointer.y * 0.5 - cam.position.y) * 0.06;
    cam.lookAt(0, 0, 0);

    /* -- Nodes: breathing scale + cursor-proximity pulse/brighten. -- */
    for (let i = 0; i < field.count; i++) {
      projected
        .set(field.nodes[i * 3], field.nodes[i * 3 + 1], field.nodes[i * 3 + 2])
        .applyMatrix4(group.matrixWorld);
      projected.project(cam);
      // Screen-space distance from cursor — no raycasting.
      const dx = projected.x - state.pointer.x;
      const dy = projected.y - state.pointer.y;
      const near = 1 - THREE.MathUtils.clamp(Math.hypot(dx, dy) / 0.32, 0, 1);

      dummy.position.set(
        field.nodes[i * 3],
        field.nodes[i * 3 + 1],
        field.nodes[i * 3 + 2],
      );
      const flicker = 0.92 + Math.sin(t * 1.3 + i) * 0.08;
      dummy.scale.setScalar(flicker * (1 + near * 0.3));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      if (quality === "high" || !initialised.current) {
        tmpColor.copy(baseColor).lerp(hotColor, near);
        mesh.setColorAt(i, tmpColor);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    initialised.current = true;

    if (lineMatRef.current) lineMatRef.current.uniforms.uTime.value = t;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, field.count]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[0.075, 0]} />
        <meshBasicMaterial toneMapped={false} color="#aab2ff" />
      </instancedMesh>

      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <shaderMaterial
          ref={lineMatRef}
          vertexShader={lineVertex}
          fragmentShader={lineFragment}
          uniforms={lineUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
