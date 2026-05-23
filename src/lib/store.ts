/**
 * Global scroll + scene state. Kept deliberately small — only values
 * the WebGL scene and nav need to share live here.
 */
import { create } from "zustand";

export type SectionId =
  | "hero"
  | "manifesto"
  | "vision"
  | "philosophy"
  | "depth"
  | "team"
  | "work"
  | "inquiry";

interface SceneState {
  /** 0 → 1 progress through the document. Drives camera dolly. */
  scrollProgress: number;
  /** Whether the WebGL canvas should render behind the current section. */
  sceneVisible: boolean;
  /** Section currently centered in the viewport — drives the nav indicator. */
  activeSection: SectionId;
  /** Extra Z-rotation applied to the lattice (radians). */
  latticeTilt: number;
  setScrollProgress: (v: number) => void;
  setSceneVisible: (v: boolean) => void;
  setActiveSection: (v: SectionId) => void;
  setLatticeTilt: (v: number) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  scrollProgress: 0,
  sceneVisible: true,
  activeSection: "hero",
  latticeTilt: 0,
  setScrollProgress: (v) => set({ scrollProgress: v }),
  setSceneVisible: (v) => set({ sceneVisible: v }),
  setActiveSection: (v) => set({ activeSection: v }),
  setLatticeTilt: (v) => set({ latticeTilt: v }),
}));
