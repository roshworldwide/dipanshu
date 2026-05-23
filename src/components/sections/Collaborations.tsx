"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/layout/Reveal";
import { collaborations } from "@/content/site";
import { EASE_STANDARD } from "@/lib/motion";
import { Icon } from "@/components/ui/Icon";

type Case = (typeof collaborations.cases)[number];

function CollabCard({ data }: { data: Case }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group relative rounded-card p-px">
      {/* Resting hairline — the gradient only reads on hover. */}
      <div className="pointer-events-none absolute inset-0 rounded-card border border-border-subtle transition-opacity duration-300 group-hover:opacity-0" />
      {/* Aurora border — a light sweeps the perimeter on hover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card opacity-0 transition-opacity duration-500 group-hover:animate-aurora-sweep group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(110deg, transparent 30%, var(--accent-aurora-1) 46%, var(--accent-aurora-2) 56%, transparent 72%)",
          backgroundSize: "220% 100%",
        }}
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-cursor-hover
        className="relative block w-full rounded-[11px] bg-bg-elevated px-8 py-9 text-left"
      >
        <div className="flex min-h-[120px] flex-col gap-4 md:min-h-[140px] md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="md:w-1/3">
            <h3 className="font-display text-headline-md font-medium tracking-[-0.02em] text-fg-primary">
              {data.name}
            </h3>
            <p className="eyebrow mt-3 leading-[1.7]">{data.tags}</p>
          </div>
          <div className="md:w-2/3">
            <p className="text-body-lg text-fg-secondary">{data.description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-fg-tertiary">
              {open ? "Close" : "Expand"}
              <m.span animate={{ rotate: open ? 90 : 0 }}>
                <Icon name="arrow-right" size={13} strokeWidth={1.5} />
              </m.span>
            </span>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_STANDARD }}
              className="overflow-hidden"
            >
              <dl className="mt-8 grid gap-6 border-t border-border-subtle pt-8 sm:grid-cols-3">
                {[
                  ["Scope", data.scope],
                  ["Outcome", data.outcome],
                  ["Duration", data.duration],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="eyebrow">{label}</dt>
                    <dd className="mt-3 text-body-sm text-fg-secondary">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </m.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

export function Collaborations() {
  return (
    <Section
      id="work"
      track="work"
      scene={false}
      rhythm="lg"
      className="bg-bg-base"
    >
      <div className="container-x">
        <Reveal>
          <h2 className="font-display text-[clamp(30px,4.5vw,44px)] font-medium tracking-[-0.035em] text-fg-primary">
            {collaborations.title}
          </h2>
        </Reveal>
        <Stagger gap={0.08} className="mt-12 flex flex-col gap-4">
          {collaborations.cases.map((c) => (
            <StaggerItem key={c.id}>
              <CollabCard data={c} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
