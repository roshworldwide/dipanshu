/**
 * MOTION VOCABULARY — the choreography bible in code form.
 * Every easing curve, spring and duration the site uses lives here.
 * See MOTION.md for the prose rationale.
 */
import type { Transition, Variants } from "framer-motion";

/* -- Bezier easings (UI) -------------------------------------------- */
export const EASE_STANDARD = [0.22, 1, 0.36, 1] as const; // everything UI
export const EASE_EMPHASIZED = [0.16, 1, 0.3, 1] as const; // hero reveals

/* -- Springs -------------------------------------------------------- */
export const SPRING_BASE: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 28,
  mass: 0.9,
}; // cards, buttons, modals

export const SPRING_OVERSHOOT: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 22,
}; // "snap into place" beats only

export const SPRING_CARD_ENTER: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 26,
}; // philosophy / depth card entry

/** Plain spring config for `useSpring()` — no `type` field. */
export const SPRING_FOLLOW = {
  stiffness: 220,
  damping: 28,
  mass: 0.9,
} as const;

/* -- Durations (seconds) -------------------------------------------- */
export const DUR = {
  micro: 0.2,
  fast: 0.24,
  base: 0.6,
  reveal: 0.7,
  hero: 0.8,
} as const;

/* -- Shared reveal variants ----------------------------------------- *
 * Consumed by <Reveal>. Animate transform + opacity + filter only.    */
export const revealVariants: Record<string, Variants> = {
  rise: {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: DUR.reveal, ease: EASE_EMPHASIZED },
    },
  },
  slide: {
    hidden: { opacity: 0, x: -24 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: DUR.reveal, ease: EASE_EMPHASIZED },
    },
  },
  fade: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: DUR.base, ease: EASE_STANDARD },
    },
  },
};

/* Hero-line recipe: lift + unblur. */
export const heroLine: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DUR.hero, ease: EASE_EMPHASIZED, delay },
  }),
};
