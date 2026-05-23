"use client";

import { useRef } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { SPRING_FOLLOW } from "@/lib/motion";

/**
 * Magnetic wrapper — pulls its child toward the cursor while the
 * pointer is within `radius` px of the element's edge. Offset is a
 * fraction (`strength`) of the cursor delta, spring-smoothed.
 *
 * Disabled implicitly on touch (no pointer hover events fire).
 */
export function Magnetic({
  children,
  radius = 24,
  strength = 0.25,
  className,
}: {
  children: React.ReactNode;
  radius?: number;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING_FOLLOW);
  const sy = useSpring(y, SPRING_FOLLOW);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // Only attract once the pointer is near the element.
    const within =
      e.clientX > r.left - radius &&
      e.clientX < r.right + radius &&
      e.clientY > r.top - radius &&
      e.clientY < r.bottom + radius;
    if (within) {
      x.set(dx * strength);
      y.set(dy * strength);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </m.div>
  );
}
