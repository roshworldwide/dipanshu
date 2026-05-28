"use client";

import { Section } from "@/components/layout/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/layout/Reveal";
import { work } from "@/content/site";

export function Work() {
  return (
    <Section id="work" track="work" scene rhythm="lg">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{work.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-[16ch] font-display text-[clamp(28px,4.5vw,56px)] font-medium leading-[1.04] tracking-[-0.035em] text-fg-primary">
            {work.title}
          </h2>
        </Reveal>

        <Stagger gap={0.08} className="mt-16 flex flex-col">
          {work.items.map((item, i) => (
            <StaggerItem key={item.id}>
              <article
                className={`group grid grid-cols-1 gap-3 py-8 md:grid-cols-12 md:gap-10 md:py-10 ${
                  // Hairline between rows, not above the first one.
                  i === 0 ? "" : "border-t border-border-subtle"
                }`}
              >
                <h3 className="font-display text-headline-md font-medium tracking-[-0.015em] text-fg-primary md:col-span-4">
                  {item.title}
                </h3>
                <p className="text-body-lg text-fg-secondary md:col-span-8">
                  {item.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
