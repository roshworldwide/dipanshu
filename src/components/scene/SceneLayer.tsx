"use client";

import dynamic from "next/dynamic";

/**
 * Client boundary for the WebGL layer. The canvas chunk is lazy-loaded
 * with `ssr: false` so it never blocks first paint — the hero copy
 * renders, then the scene hydrates in behind it.
 */
const SceneCanvas = dynamic(
  () => import("./SceneCanvas").then((m) => m.SceneCanvas),
  {
    ssr: false,
    // The base background already matches; no flash while the chunk loads.
    loading: () => null,
  },
);

export function SceneLayer() {
  return <SceneCanvas />;
}
