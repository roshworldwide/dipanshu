"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { CollectiveField } from "./CollectiveField";
import { SceneFallback } from "./SceneFallback";
import { useSceneStore } from "@/lib/store";

type Tier = "high" | "low";

/** Coarse GPU-tier probe via WEBGL_debug_renderer_info. */
function detectTier(): Tier {
  if (typeof window === "undefined") return "high";
  try {
    const gl = document
      .createElement("canvas")
      .getContext("webgl") as WebGLRenderingContext | null;
    if (!gl) return "low";
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg
      ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
      : "";
    if (/swiftshader|llvmpipe|software|mali-4|adreno 3/i.test(renderer)) {
      return "low";
    }
    return (navigator.hardwareConcurrency ?? 8) < 4 ? "low" : "high";
  } catch {
    return "low";
  }
}

/**
 * Fixed background layer hosting "The Collective Field".
 *
 * - Crossfades opacity (200ms) as sections toggle `sceneVisible`.
 * - Pauses the render loop when the tab is hidden or the scene is
 *   parked off-screen for the lower sections.
 * - Falls back to a baked static SVG under prefers-reduced-motion.
 */
export function SceneCanvas() {
  const sceneVisible = useSceneStore((s) => s.sceneVisible);
  const [reduced, setReduced] = useState(false);
  const [tier, setTier] = useState<Tier>("high");
  const [paused, setPaused] = useState(false);
  const parkTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setTier(detectTier());

    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Park the render loop ~half a second after the scene fades out.
  useEffect(() => {
    clearTimeout(parkTimer.current);
    if (sceneVisible) {
      setPaused(document.hidden);
    } else {
      parkTimer.current = setTimeout(() => setPaused(true), 500);
    }
    return () => clearTimeout(parkTimer.current);
  }, [sceneVisible]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ opacity: sceneVisible ? 1 : 0 }}
    >
      {reduced ? (
        <SceneFallback className="absolute inset-0" />
      ) : (
        <Canvas
          frameloop={paused ? "never" : "always"}
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 11], fov: 50, near: 0.1, far: 60 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
        >
          <color attach="background" args={["#07070a"]} />
          <CollectiveField quality={tier} />
          {/* Chromatic aberration is dropped on low-tier GPUs. */}
          {tier === "high" ? (
            <EffectComposer enableNormalPass={false}>
              <Bloom
                intensity={0.6}
                luminanceThreshold={0.15}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={new THREE.Vector2(0.0005, 0.0005)}
                radialModulation={false}
                modulationOffset={0}
              />
              <Vignette eskil darkness={0.6} offset={0.3} />
            </EffectComposer>
          ) : (
            <EffectComposer enableNormalPass={false}>
              <Bloom
                intensity={0.6}
                luminanceThreshold={0.15}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              <Vignette eskil darkness={0.6} offset={0.3} />
            </EffectComposer>
          )}
        </Canvas>
      )}
    </div>
  );
}
