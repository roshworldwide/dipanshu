"use client";

import { useEffect, useState } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor — a 10px ring (mix-blend difference) with a 3px dot.
 * Over interactive elements the ring grows to 36px; the dot stays put
 * and brightens slightly so the cursor never feels "lost" inside the
 * larger ring (a common gripe with the original Apple-style recipe).
 * Position is driven via translate3d only; never top/left.
 *
 * Disabled entirely on coarse pointers and under reduced-motion —
 * those users keep the native OS cursor.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Light spring — the cursor leads, the ring follows with a touch of drag.
  const ringX = useSpring(x, { stiffness: 520, damping: 40, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 520, damping: 40, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    setEnabled(true);
    document.documentElement.dataset.cursor = "custom";

    const interactiveSelector =
      'a, button, input, textarea, select, label, [role="button"], [data-cursor-hover]';

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setActive(!!(e.target as Element)?.closest?.(interactiveSelector));
    };
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      delete document.documentElement.dataset.cursor;
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      {/* Ring — springs toward the pointer. */}
      <m.div
        className="absolute left-0 top-0 rounded-full border border-fg-primary"
        style={{
          x: ringX,
          y: ringY,
          mixBlendMode: "difference",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: active ? 36 : 10,
          height: active ? 36 : 10,
          opacity: active ? 0.9 : 0.7,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      />
      {/* Dot — tracks the raw pointer with no lag. Always visible;
          over interactive elements it scales up subtly so the cursor
          reads inside the larger ring rather than vanishing. */}
      <m.div
        className="absolute left-0 top-0 h-[3px] w-[3px] rounded-full bg-fg-primary"
        style={{
          x,
          y,
          mixBlendMode: "difference",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: 1, scale: active ? 1.4 : 1 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
