"use client";

import { useEffect, useRef } from "react";
import { m, useInView } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/layout/Reveal";
import { visionMission } from "@/content/site";
import { useSceneStore } from "@/lib/store";
import { EASE_EMPHASIZED } from "@/lib/motion";

const DEG4 = (4 * Math.PI) / 180;

export function VisionMission() {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { amount: 0.5, once: false });
  const setLatticeTilt = useSceneStore((s) => s.setLatticeTilt);

  // While centered, nudge the lattice 4° on Z — a felt shift in
  // perspective that pairs with the vision/mission idea.
  useEffect(() => {
    setLatticeTilt(inView ? DEG4 : 0);
    return () => setLatticeTilt(0);
  }, [inView, setLatticeTilt]);

  const columns = [visionMission.vision, visionMission.mission] as const;

  return (
    <Section id="vision" track="vision" scene rhythm="lg">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{visionMission.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-[16ch] font-display text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] tracking-[-0.035em] text-fg-primary">
            {visionMission.title}
          </h2>
        </Reveal>

        <div
          ref={gridRef}
          className="relative mt-16 grid gap-12 md:grid-cols-2 md:gap-0"
        >
          {/* Hairline that grows between the two columns. */}
          <m.div
            className="absolute left-1/2 top-0 hidden w-px origin-top bg-border-strong md:block"
            initial={{ scaleY: 0, height: "100%" }}
            animate={{ scaleY: inView ? 1 : 0 }}
            transition={{ duration: 0.9, ease: EASE_EMPHASIZED }}
          />
          {columns.map((col, i) => (
            <m.div
              key={col.label}
              className={i === 0 ? "md:pr-16" : "md:pl-16"}
              initial={{ opacity: 0, x: i === 0 ? -24 : 24 }}
              animate={
                inView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: i === 0 ? -24 : 24 }
              }
              transition={{ duration: 0.7, ease: EASE_EMPHASIZED }}
            >
              <h3 className="font-display text-headline-md font-medium text-fg-primary">
                {col.label}
              </h3>
              <p className="mt-4 text-body-lg text-fg-secondary">{col.body}</p>
            </m.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
