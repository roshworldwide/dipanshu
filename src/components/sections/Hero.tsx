"use client";

import { useRef } from "react";
import { m } from "framer-motion";
import { hero } from "@/content/site";
import { EASE_EMPHASIZED } from "@/lib/motion";
import { useSectionObserver } from "@/lib/use-section-observer";
import { Icon } from "@/components/ui/Icon";

/** Lift + unblur recipe, shared by all three manifesto lines. */
const line = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_EMPHASIZED, delay },
  }),
};

/** Line three carries the resolution — add a subtle scale settle. */
const lineEmphatic = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)", scale: 0.98 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.8, ease: EASE_EMPHASIZED, delay },
  }),
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useSectionObserver(ref, { track: "hero", scene: true });

  return (
    <section
      ref={ref}
      id="hero"
      data-scene="on"
      className="relative flex min-h-screen flex-col items-center justify-center px-[var(--gutter)] text-center"
    >
      <h1 className="font-display font-medium text-fg-primary">
        <m.span
          variants={line}
          custom={0.2}
          initial="hidden"
          animate="show"
          className="block text-[clamp(32px,7vw,56px)] leading-[1.04] tracking-[-0.04em]"
        >
          {hero.lines[0]}
        </m.span>
        <m.span
          variants={line}
          custom={0.35}
          initial="hidden"
          animate="show"
          className="block text-[clamp(32px,7vw,56px)] leading-[1.04] tracking-[-0.04em]"
        >
          {hero.lines[1]}
        </m.span>
        <m.span
          variants={lineEmphatic}
          custom={0.5}
          initial="hidden"
          animate="show"
          className="mt-2 block text-[clamp(40px,9vw,72px)] font-semibold leading-[1.02] tracking-[-0.04em]"
        >
          {hero.lines[2]}
        </m.span>
      </h1>

      <m.p
        variants={line}
        custom={0.75}
        initial="hidden"
        animate="show"
        className="mt-8 max-w-[540px] text-balance text-body-lg text-fg-secondary"
      >
        {hero.body}
      </m.p>

      {/* Scroll affordance — a 1px line that draws in, then shimmers. */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_EMPHASIZED, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <m.div
          initial={{ height: 0 }}
          animate={{ height: 64 }}
          transition={{ duration: 0.9, ease: EASE_EMPHASIZED, delay: 1 }}
          className="relative w-px overflow-hidden bg-border-strong"
        >
          <span className="absolute inset-x-0 top-0 h-6 animate-scroll-shimmer bg-gradient-to-b from-transparent via-aurora-2 to-transparent" />
        </m.div>
        <Icon
          name="arrow-down"
          size={14}
          strokeWidth={1.25}
          className="mx-auto mt-2 text-fg-quaternary"
        />
      </m.div>
    </section>
  );
}
