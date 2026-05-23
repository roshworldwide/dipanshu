"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/layout/Reveal";
import { manifesto } from "@/content/site";

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  // Progress marker fills as the section travels through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section id="manifesto" track="manifesto" scene rhythm="lg">
      <div ref={ref} className="container-x grid gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <Reveal>
            <p className="eyebrow">{manifesto.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-display text-[clamp(34px,5.5vw,56px)] font-medium leading-[1.05] tracking-[-0.04em] text-fg-primary">
              {manifesto.headline.before}
              <em className="serif-accent">{manifesto.headline.em}</em>
              {manifesto.headline.after}
            </h2>
          </Reveal>
        </div>

        <Stagger
          gap={0.06}
          className="flex flex-col gap-6 md:col-span-5 md:pt-2"
        >
          {manifesto.paragraphs.map((p, i) => (
            <StaggerItem key={i}>
              <p className="text-body-lg text-fg-secondary">{p}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Right-edge progress marker — fills with scroll, not time. */}
      <div className="absolute right-[max(16px,calc(var(--gutter)-24px))] top-1/2 hidden h-40 w-px -translate-y-1/2 bg-border-subtle lg:block">
        <m.div
          className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-aurora-1 to-aurora-2"
          style={{ scaleY: fill, height: "100%" }}
        />
      </div>
    </Section>
  );
}
