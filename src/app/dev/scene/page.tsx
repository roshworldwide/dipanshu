import type { Metadata } from "next";
import { SceneLayer } from "@/components/scene/SceneLayer";

export const metadata: Metadata = {
  title: "Scene workbench",
  robots: { index: false, follow: false },
};

/**
 * Isolated workbench for "The Collective Field". Used during
 * development to tune the scene and verify 60fps before it is
 * composed behind the hero. Not linked from the site.
 */
export default function SceneDevPage() {
  return (
    <main className="relative h-screen w-screen">
      <SceneLayer />
      <div className="pointer-events-none absolute left-6 top-6 z-10">
        <p className="eyebrow">Scene Workbench</p>
        <p className="mt-2 max-w-xs text-body-sm text-fg-tertiary">
          The Collective Field, in isolation. Move the cursor to pulse nearby
          nodes; this route is dev-only.
        </p>
      </div>
    </main>
  );
}
