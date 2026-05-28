"use client";

import { Section } from "@/components/layout/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/layout/Reveal";
import { approach } from "@/content/site";

export function Approach() {
  return (
    <Section id="approach" track="approach" scene rhythm="lg">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{approach.eyebrow}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-[22ch] font-display text-[clamp(30px,5vw,64px)] font-medium leading-[1.06] tracking-[-0.035em] text-fg-primary">
            {approach.headline.before}
            <em className="serif-accent">{approach.headline.em}</em>
            {approach.headline.after}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal delay={0.1} className="md:col-span-7">
            <p className="text-body-lg text-fg-secondary">{approach.intro}</p>
          </Reveal>

          <div className="md:col-span-12">
            <Reveal delay={0.14}>
              <h3 className="font-display text-headline-md font-medium tracking-[-0.02em] text-fg-primary">
                {approach.subTitle}
              </h3>
            </Reveal>

            <Stagger
              gap={0.08}
              className="mt-6 grid gap-6 md:grid-cols-3 md:gap-10"
            >
              {approach.paragraphs.map((para, i) => (
                <StaggerItem key={i}>
                  <p className="text-body-lg text-fg-secondary">{para}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </Section>
  );
}
