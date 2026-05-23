"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/layout/Reveal";
import { depth } from "@/content/site";
import { SPRING_FOLLOW } from "@/lib/motion";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/track";

type Card = (typeof depth.cards)[number];

/* ------------------------------------------------------------------ *
 *  Grid card — cursor-driven 3D tilt + a title that leans toward the
 *  pointer. Click promotes it into the shared-layout detail panel.
 * ------------------------------------------------------------------ */
function DepthCard({
  card,
  active,
  onOpen,
}: {
  card: Card;
  active: boolean;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  // Pointer position within the card, normalised to -0.5..0.5.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), SPRING_FOLLOW);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), SPRING_FOLLOW);
  // Magnetic title — pulled up to 4px toward the cursor.
  const titleX = useSpring(
    useTransform(px, [-0.5, 0.5], [-4, 4]),
    SPRING_FOLLOW,
  );
  const titleY = useSpring(
    useTransform(py, [-0.5, 0.5], [-4, 4]),
    SPRING_FOLLOW,
  );

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <button
      ref={ref}
      type="button"
      onPointerMove={onMove}
      onPointerLeave={reset}
      onClick={onOpen}
      aria-label={`${card.title} — open details`}
      className="group block aspect-[1/0.6] w-full text-left [perspective:1000px]"
    >
      {active ? (
        // Placeholder holds the grid slot while the card is promoted.
        <div className="h-full w-full rounded-card border border-dashed border-border-subtle" />
      ) : (
        <m.div
          layoutId={`depth-${card.id}`}
          style={{
            rotateX: rotX,
            rotateY: rotY,
            transformStyle: "preserve-3d",
          }}
          className="surface-card relative h-full w-full overflow-hidden rounded-card p-7 transition-colors duration-300 ease-standard group-hover:border-border-strong group-hover:bg-bg-card-hover"
        >
          {/* Inner radial highlight, top-left, screen-blended. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-60 [mix-blend-mode:screen]"
            style={{
              background:
                "radial-gradient(circle, rgba(154,230,255,0.18) 0%, transparent 70%)",
            }}
          />
          <div className="flex h-full flex-col">
            <m.h3
              style={{ x: titleX, y: titleY }}
              className="font-display text-headline-sm font-medium tracking-[-0.02em] text-fg-primary"
            >
              {card.title}
            </m.h3>
            <p className="mt-3 max-w-[34ch] text-body-sm text-fg-tertiary">
              {card.blurb}
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-fg-quaternary transition-colors duration-300 group-hover:text-fg-secondary">
              Open
              <Icon name="arrow-up-right" size={13} strokeWidth={1.5} />
            </span>
          </div>
        </m.div>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 *  Detail panel — the promoted card. Shares its layoutId with the
 *  grid card so Framer morphs one surface into the other.
 * ------------------------------------------------------------------ */
function DetailPanel({ card, onClose }: { card: Card; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <m.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-[var(--gutter)]"
      initial={{ backgroundColor: "rgba(7,7,10,0)" }}
      animate={{ backgroundColor: "rgba(7,7,10,0.6)" }}
      exit={{ backgroundColor: "rgba(7,7,10,0)" }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={card.title}
    >
      <m.div
        layoutId={`depth-${card.id}`}
        onClick={(e) => e.stopPropagation()}
        className="surface-card relative w-full max-w-[640px] overflow-hidden rounded-card-lg p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 rounded-full p-1.5 text-fg-tertiary transition-colors hover:text-fg-primary"
        >
          <Icon name="close" size={18} />
        </button>
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
        >
          <p className="eyebrow">{depth.eyebrow}</p>
          <h3 className="mt-4 font-display text-headline-lg font-medium tracking-[-0.02em] text-fg-primary">
            {card.title}
          </h3>
          <p className="mt-4 text-body-lg text-fg-secondary">{card.detail}</p>
          <ul className="mt-7 flex flex-col gap-3">
            {card.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-body-sm text-fg-tertiary">
                <span
                  aria-hidden
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-aurora-2"
                />
                {b}
              </li>
            ))}
          </ul>
        </m.div>
      </m.div>
    </m.div>
  );
}

export function AreasOfDepth() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeCard = depth.cards.find((c) => c.id === activeId) ?? null;

  return (
    <Section id="depth" track="depth" scene rhythm="lg">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{depth.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-display text-[clamp(28px,4vw,44px)] font-medium tracking-[-0.035em] text-fg-primary">
            {depth.title}
          </h2>
        </Reveal>

        <Stagger
          gap={0.07}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {depth.cards.map((card) => (
            <StaggerItem key={card.id}>
              <DepthCard
                card={card}
                active={activeId === card.id}
                onOpen={() => {
                  setActiveId(card.id);
                  track("depth_card_open", { card: card.id });
                }}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <AnimatePresence>
        {activeCard && (
          <DetailPanel card={activeCard} onClose={() => setActiveId(null)} />
        )}
      </AnimatePresence>
    </Section>
  );
}
