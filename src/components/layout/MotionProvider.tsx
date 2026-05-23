"use client";

import { LazyMotion, MotionConfig } from "framer-motion";

/**
 * Loads Framer Motion's feature bundle lazily.
 *
 * We use `domMax` rather than `domAnimation` deliberately: the nav
 * indicator and the expanding cards rely on `layoutId` / shared-layout
 * animation, which `domAnimation` does not include. `domMax` is the
 * smallest bundle that still ships layout animations + drag.
 *
 * All animated components in the app use the `m.*` primitives so the
 * heavy `motion.*` bundle is never pulled into the client graph.
 */
const loadFeatures = () => import("framer-motion").then((mod) => mod.domMax);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {/* `reducedMotion="user"` strips transform/layout animation under
          prefers-reduced-motion, leaving opacity crossfades intact. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
