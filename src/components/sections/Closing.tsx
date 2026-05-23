"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/layout/Reveal";
import { closing } from "@/content/site";
import { EASE_EMPHASIZED } from "@/lib/motion";

export function Closing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6, once: true });

  return (
    <Section id="closing" scene={false} rhythm="lg" className="bg-bg-base">
      <div
        ref={ref}
        className="container-x flex flex-col items-center text-center"
      >
        {/* Hairline drawn from 0 → 80px on enter. */}
        <m.div
          className="h-px bg-border-strong"
          initial={{ width: 0 }}
          animate={{ width: inView ? 80 : 0 }}
          transition={{ duration: 0.8, ease: EASE_EMPHASIZED }}
        />
        <Reveal delay={0.12} className="mt-12">
          <p className="max-w-[720px] text-balance text-[clamp(18px,2.2vw,21px)] leading-[1.5] text-fg-secondary">
            {closing.quote}
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="eyebrow mt-10">{closing.signature}</p>
        </Reveal>
      </div>
    </Section>
  );
}
