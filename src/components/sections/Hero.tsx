"use client";

import { useRef } from "react";
import { m } from "framer-motion";
import { hero } from "@/content/site";
import { EASE_EMPHASIZED } from "@/lib/motion";
import { useSectionObserver } from "@/lib/use-section-observer";
import { Icon } from "@/components/ui/Icon";

/** Lift + unblur recipe — opacity + transform + filter only. */
const line = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
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
      // 80px nav above + roughly a screenful for the hero itself.
      className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-[var(--gutter)] py-rhythm-md text-center"
    >
      <m.h1
        variants={line}
        custom={0.2}
        initial="hidden"
        animate="show"
        className="font-display font-medium leading-[1.02] tracking-[-0.04em] text-fg-primary"
      >
        <span className="block text-[clamp(40px,9vw,84px)]">
          {hero.headline.before}
          <em className="serif-accent">{hero.headline.em}</em>
          {hero.headline.after}
        </span>
      </m.h1>

      <m.p
        variants={line}
        custom={0.45}
        initial="hidden"
        animate="show"
        className="mt-10 max-w-[620px] text-balance text-body-lg text-fg-secondary"
      >
        {hero.body}
      </m.p>

      {/* Scroll affordance — a 1px line that draws in, then shimmers. */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_EMPHASIZED, delay: 0.9 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <m.div
          initial={{ height: 0 }}
          animate={{ height: 64 }}
          transition={{ duration: 0.9, ease: EASE_EMPHASIZED, delay: 0.9 }}
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
