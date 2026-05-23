"use client";

import { useRef } from "react";
import type { SectionId } from "@/lib/store";
import { useSectionObserver } from "@/lib/use-section-observer";

interface SectionProps {
  id: SectionId | string;
  /** Vertical rhythm preset. */
  rhythm?: "xl" | "lg" | "md" | "sm";
  /** When centered, report this id as the active nav section. */
  track?: SectionId;
  /** Whether the WebGL scene should be visible behind this section. */
  scene?: boolean;
  className?: string;
  children: React.ReactNode;
}

const RHYTHM: Record<string, string> = {
  xl: "py-rhythm-xl",
  lg: "py-rhythm-lg",
  md: "py-rhythm-md",
  sm: "py-rhythm-sm",
};

/**
 * A page section. Reports itself as the active nav target when
 * centered and toggles the fixed WebGL canvas via `data-scene`.
 */
export function Section({
  id,
  rhythm = "lg",
  track,
  scene = false,
  className,
  children,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  useSectionObserver(ref, { track, scene });

  return (
    <section
      ref={ref}
      id={id}
      data-scene={scene ? "on" : "off"}
      className={`relative ${RHYTHM[rhythm]} ${className ?? ""}`}
    >
      {children}
    </section>
  );
}
