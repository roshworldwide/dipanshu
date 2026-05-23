"use client";

import { useRef } from "react";
import { m, useInView, type Variants } from "framer-motion";
import { revealVariants, EASE_EMPHASIZED, DUR } from "@/lib/motion";

type RevealVariant = keyof typeof revealVariants;

interface RevealProps {
  children: React.ReactNode;
  /** Motion recipe — `rise` (default), `slide`, or `fade`. */
  variant?: RevealVariant;
  /** Seconds of delay before the reveal begins. */
  delay?: number;
  /** Fraction of the element that must be in view to trigger. */
  amount?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "p";
}

/**
 * Section-reveal primitive. Fires once when `amount` of the element
 * enters the viewport. All variants animate transform + opacity only.
 */
export function Reveal({
  children,
  variant = "rise",
  delay = 0,
  amount = 0.35,
  className,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount, once: true });
  const MotionTag = m[as] as typeof m.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={revealVariants[variant]}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ *
 *  STAGGER — a parent that releases its <StaggerItem> children in
 *  sequence as the group enters the viewport.
 * ------------------------------------------------------------------ */
const staggerParent = (gap: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
});

export function Stagger({
  children,
  gap = 0.08,
  amount = 0.3,
  className,
}: {
  children: React.ReactNode;
  /** Seconds between each child. */
  gap?: number;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount, once: true });
  return (
    <m.div
      ref={ref}
      className={className}
      variants={staggerParent(gap)}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {children}
    </m.div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.reveal, ease: EASE_EMPHASIZED },
  },
};

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const MotionTag = m[as] as typeof m.div;
  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
