"use client";

import { Section } from "@/components/layout/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/layout/Reveal";
import { collective } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

export function Collective() {
  return (
    <Section
      id="collective"
      track="collective"
      rhythm="lg"
      className="bg-bg-base"
    >
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{collective.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-display text-[clamp(28px,4.5vw,56px)] font-medium leading-[1.04] tracking-[-0.035em] text-fg-primary">
            {collective.title}
          </h2>
        </Reveal>

        <Stagger
          gap={0.07}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {collective.members.map((member) => (
            <StaggerItem key={member.id}>
              <article className="surface-card group flex h-full flex-col rounded-card p-7 transition-colors duration-300 ease-standard hover:border-border-strong hover:bg-bg-card-hover">
                <h3 className="font-display text-headline-sm font-medium tracking-[-0.02em] text-fg-primary">
                  {member.name}
                </h3>
                <p className="eyebrow mt-3 leading-[1.7]">{member.role}</p>

                <a
                  href={member.linkedin}
                  target={member.linkedin === "#" ? undefined : "_blank"}
                  rel={
                    member.linkedin === "#" ? undefined : "noopener noreferrer"
                  }
                  className="mt-10 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-fg-tertiary transition-colors duration-200 ease-standard hover:text-fg-primary"
                >
                  LinkedIn
                  <Icon name="arrow-up-right" size={12} strokeWidth={1.5} />
                </a>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
