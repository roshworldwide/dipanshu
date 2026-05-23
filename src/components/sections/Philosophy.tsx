"use client";

import { useRef } from "react";
import { m, useInView, type Variants } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/layout/Reveal";
import { philosophy } from "@/content/site";
import { SPRING_CARD_ENTER, SPRING_BASE } from "@/lib/motion";

const parent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const card: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING_CARD_ENTER },
};

export function Philosophy() {
  const listRef = useRef<HTMLDivElement>(null);
  const inView = useInView(listRef, { amount: 0.25, once: true });

  return (
    <Section id="philosophy" track="philosophy" scene rhythm="lg">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{philosophy.eyebrow}</p>
        </Reveal>

        <m.div
          ref={listRef}
          variants={parent}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mt-12 flex flex-col gap-3"
        >
          {philosophy.principles.map((p, i) => (
            <m.div
              key={i}
              variants={card}
              whileHover={{ y: -6 }}
              transition={SPRING_BASE}
              data-cursor-hover
              className="group relative"
            >
              {/* Aurora bloom behind the card surface. */}
              <div
                aria-hidden
                className="bloom-aurora pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 opacity-0 blur-[80px] transition-opacity duration-500 ease-standard group-hover:opacity-50"
              />
              <div className="surface-card relative flex min-h-[64px] items-center rounded-card px-7 py-5 transition-colors duration-300 ease-standard group-hover:border-border-strong group-hover:bg-bg-card-hover">
                <span className="font-display text-[clamp(18px,2.4vw,24px)] font-medium tracking-[-0.02em] text-fg-primary">
                  {p.before}
                  <em className="serif-accent">{p.em}</em>
                  {p.after}
                </span>
                <span className="ml-auto pl-6 font-display text-[13px] tabular-nums text-fg-quaternary">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </Section>
  );
}
