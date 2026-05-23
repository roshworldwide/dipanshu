"use client";

import { useEffect, type RefObject } from "react";
import { useSceneStore, type SectionId } from "./store";

/**
 * Reports a section as the active nav target when it crosses the
 * vertical middle of the viewport, and toggles whether the WebGL
 * scene should be visible behind it.
 */
export function useSectionObserver(
  ref: RefObject<HTMLElement>,
  { track, scene }: { track?: SectionId; scene: boolean },
) {
  const setActiveSection = useSceneStore((s) => s.setActiveSection);
  const setSceneVisible = useSceneStore((s) => s.setSceneVisible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (track) setActiveSection(track);
        setSceneVisible(scene);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, track, scene, setActiveSection, setSceneVisible]);
}
