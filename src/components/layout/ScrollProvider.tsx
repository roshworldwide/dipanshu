"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { useSceneStore } from "@/lib/store";

interface ScrollApi {
  /** Smooth-scroll to an element id or absolute offset. */
  scrollTo: (target: string | number, opts?: { offset?: number }) => void;
}

const ScrollContext = createContext<ScrollApi>({ scrollTo: () => {} });
export const useSmoothScroll = () => useContext(ScrollContext);

/**
 * apple-emphasized as a Lenis easing function (t → eased t).
 * easeOutExpo closely tracks cubic-bezier(0.16, 1, 0.3, 1): a fast
 * departure that decelerates into a long, soft settle.
 */
const emphasizedEasing = (t: number): number =>
  t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [api] = useState<ScrollApi>(() => ({
    scrollTo: (target, opts) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, {
          offset: opts?.offset ?? 0,
          duration: 1.2,
          easing: emphasizedEasing,
        });
        return;
      }
      // Reduced-motion / no-Lenis fallback: native jump.
      if (typeof target === "string") {
        document
          .querySelector(target)
          ?.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        window.scrollTo(0, target);
      }
    },
  }));

  const setScrollProgress = useSceneStore((s) => s.setScrollProgress);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Reduced motion: skip Lenis entirely, keep native scroll.
    if (reduced) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(max > 0 ? window.scrollY / max : 0);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    document.documentElement.classList.add("lenis");

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      setScrollProgress(progress);
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("lenis");
    };
  }, [setScrollProgress]);

  return (
    <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
  );
}
