# Motion — the choreography bible

Every easing curve, spring, duration and reveal recipe the site uses.
If you change motion anywhere, edit it here first, then in
[src/lib/motion.ts](src/lib/motion.ts).

---

## Easing language

There are exactly two named bezier curves on this site. Anything that
deviates either has a reason in this file or is a bug.

| Token              | Value                              | Use                                                    |
| ------------------ | ---------------------------------- | ------------------------------------------------------ |
| `EASE_STANDARD`    | `cubic-bezier(0.22, 1, 0.36, 1)`   | Everything UI: hover colour, fade, micro-interactions  |
| `EASE_EMPHASIZED`  | `cubic-bezier(0.16, 1, 0.3, 1)`    | Hero reveals, section reveals, drawn lines, big states |

These are the Apple HIG curves: fast-out, long-settle. They make
motion feel like a physical object decelerating, not a UI tween.

The `--ease-standard` and `--ease-emphasized` CSS variables expose
the same values to CSS transitions / `tailwind.config.ts`
`transitionTimingFunction`.

## Springs

Springs replace bezier easings when the motion's destination is
unknown or the user is steering it (a card, a button, a follower).

| Token                   | `{ stiffness, damping, mass }` | Use                                            |
| ----------------------- | ------------------------------ | ---------------------------------------------- |
| `SPRING_BASE`           | `{ 220, 28, 0.9 }`             | Cards, buttons, modals on whileHover/whileTap  |
| `SPRING_OVERSHOOT`      | `{ 320, 22 }`                  | "Snap into place" beats only — used sparingly  |
| `SPRING_CARD_ENTER`     | `{ 200, 26 }`                  | Philosophy / Depth card entrance               |
| `SPRING_FOLLOW`         | `{ 220, 28, 0.9 }`             | `useSpring()` followers (cursor, tilt, magnetic) |

`SPRING_BASE` and `SPRING_FOLLOW` carry the same numbers, but
`SPRING_FOLLOW` is a plain object (no `type: "spring"`) because
`useSpring` accepts `SpringOptions`, not `Transition`.

## Durations

Time-based motion only — springs ignore these.

| Token       | Seconds | Use                                          |
| ----------- | ------- | -------------------------------------------- |
| `DUR.micro` | 0.20    | Cursor dot, icon flip                        |
| `DUR.fast`  | 0.24    | Hover fills, button text invert              |
| `DUR.base`  | 0.60    | Fade reveals, scene crossfade                |
| `DUR.reveal`| 0.70    | Default `<Reveal>` recipe                    |
| `DUR.hero`  | 0.80    | Hero line lift + unblur                      |

## Reveal recipes

All reveals animate **transform + opacity + filter only.** Never
width/height/top/left — those force re-layout. The three named
variants live in [src/lib/motion.ts](src/lib/motion.ts) and are
exposed through the `<Reveal>` component
([src/components/layout/Reveal.tsx](src/components/layout/Reveal.tsx)).

| Variant | Hidden state                     | Show state | Default     |
| ------- | -------------------------------- | ---------- | ----------- |
| `rise`  | `opacity 0, y: 28`               | `opacity 1, y: 0` | ✓ default |
| `slide` | `opacity 0, x: -24`              | `opacity 1, x: 0` |             |
| `fade`  | `opacity 0`                      | `opacity 1`        |             |

All trigger via `useInView({ amount: 0.35, once: true })` on the
component's own ref. `<Stagger gap={0.08}>` wraps `<StaggerItem>`
children for sequential entry.

## Hero choreography

Mount sequence on `/`. Times are seconds from page paint.

| t     | Element                                | Recipe                                                      |
| ----- | -------------------------------------- | ----------------------------------------------------------- |
| 0.00  | WebGL canvas                           | Opacity fade 0 → 1, `DUR.base`                              |
| 0.20  | Line 1 — "Vision without execution..." | `y 24→0, blur 8px→0, opacity 0→1`, `DUR.hero`, EMPHASIZED   |
| 0.35  | Line 2 — "Execution without vision..." | Same recipe                                                 |
| 0.50  | Line 3 — "Great companies require..."  | Same + `scale 0.98 → 1`                                     |
| 0.75  | Body copy                              | Same recipe (no scale)                                      |
| 1.00  | Scroll cue (1px line)                  | Opacity 0 → 1, then `height 0 → 64px`, EMPHASIZED           |

After mount, the scroll cue loops a 24px aurora shimmer down the line
(`@keyframes scroll-shimmer`, 2.4s, STANDARD, infinite).

## Section reveals

| Section            | Recipe                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| Manifesto          | Headline `rise`. Paragraphs `Stagger` with `gap: 0.06`. Right-edge marker `scaleY` driven by `useScroll`. |
| Vision & Mission   | Columns slide from opposite sides (`x: ∓24 → 0`). The dividing hairline grows `scaleY 0 → 1`. When centered, the WebGL lattice tilts `+4° on Z` via the Zustand store. |
| Philosophy         | Cards `Stagger` with `gap: 0.08` + `SPRING_CARD_ENTER`. Hover lifts `y: -6`, border `subtle → strong`, aurora bloom opacity `0 → 0.5`. |
| Areas of Depth     | Grid `Stagger` with `gap: 0.07`. Per-card 3D tilt via `useSpring` over normalised pointer (±6deg X/Y). Title pulled toward cursor with magnetic strength 4px. Click promotes the card via shared `layoutId` into the detail panel. |
| Team               | Portrait crossfades grayscale `1 → 0` and `scale 1 → 1.04` over `0.6s STANDARD`. Name `fg-secondary → fg-primary`. |
| Collaborations     | Card hover: aurora gradient sweeps the perimeter (`aurora-sweep` keyframe). Expand animates `height: 0 ↔ auto` over `0.4s STANDARD`. |
| Closing            | Hairline draws `width 0 → 80px`, EMPHASIZED. Quote and signature `rise` with stagger delays. |
| Inquiry            | Field focus: underline `scale-x 0 → 1` over `0.2s STANDARD` with aurora gradient. Submit button hover: white fill `scale-x 0 → 1` from left over `0.24s STANDARD`, text inverts via `color-mix` transition. Success state crossfade `0.6s EMPHASIZED`. |

## Global interactions

- **Smooth scroll** — Lenis v1, default `lerp: 0.1`, `wheelMultiplier: 1`. Programmatic scrolls (nav anchor clicks) use Lenis `scrollTo` with `duration: 1.2`, easing approximating EMPHASIZED (easeOutExpo).
- **Custom cursor** — 10px ring (mix-blend-mode: difference, 1px border), 3px dot. Ring spring-follows the dot (`stiffness: 520, damping: 40, mass: 0.6`). Over interactive elements (`a, button, input, [data-cursor-hover]`), ring grows to 36px and dot fades. Disabled on coarse pointers and reduced-motion.
- **Magnetic CTA** ([Magnetic.tsx](src/components/ui/Magnetic.tsx)) — pulls the wrapped child toward the cursor when within 24px, with `offset = 0.25 × delta`, smoothed by `SPRING_FOLLOW`.
- **Nav indicator** — a 1px underline sliding between active links via `layoutId="nav-indicator"`, spring `{ 320, 30 }`. Slides because two motion elements with the same `layoutId` are treated as one across the tree.

## WebGL motion

All baked into [CollectiveField.tsx](src/components/scene/CollectiveField.tsx):

| Motion              | Detail                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Y-rotation          | `0.04 rad/s` on the lattice group.                                                              |
| Breathing           | `scale = 1.01 + 0.01 × sin(2π·t / 6)` — 1.0 → 1.02 over 6s, applied to the group.               |
| Camera dolly        | Lerps `camera.position.z` from `+11 → -3` as `scrollProgress 0 → 0.5`, factor 0.06.             |
| Cursor parallax     | Camera `(x, y)` lerps toward `pointer * 0.5`, factor 0.06. `camera.lookAt(0, 0, 0)` each frame. |
| Field expansion     | Group scales `1 → 1.35` linearly with `scrollProgress`.                                         |
| Lattice Z-tilt      | Lerps `group.rotation.z` toward `latticeTilt` (set by VisionMission), factor 0.04.              |
| Node near-cursor    | Project each node to NDC; `near = 1 - clamp(distance / 0.32, 0, 1)`; node scale `× (1 + 0.3 × near)`; colour `lerp(base, hot, near)`. No raycaster. |
| Line pulse          | Fragment shader: `t = fract(uTime × 0.16 + aSeed); pulse = smoothstep(0.18, 0, |aProgress - t|)`. Additive blend. |

## Reduced motion

`MotionConfig reducedMotion="user"` in
[MotionProvider.tsx](src/components/layout/MotionProvider.tsx)
disables transform/layout animation while preserving opacity
crossfades. The global CSS at the bottom of
[globals.css](src/app/globals.css) drops CSS transition/animation
durations to near-zero. The WebGL canvas is replaced by
[SceneFallback](src/components/scene/SceneFallback.tsx), a baked SVG
of the same lattice.

## Rules of thumb

1. **Transform and opacity only.** If you find yourself animating
   layout, you are doing the wrong thing — change the structure.
2. **Spring for human-driven motion. Bezier for system-driven.**
   Hovers, drags, follows → springs. Reveals, mounts, transitions →
   beziers from the easing language above.
3. **Stagger 60–80ms.** Anything quicker reads as flicker. Anything
   slower reads as broken.
4. **No drop shadows.** Depth is borders + bloom, never `box-shadow`.
5. **Honour reduced motion by default.** Use `MotionConfig` /
   `useReducedMotion` rather than ad-hoc checks. If you bypass them,
   leave a comment explaining why.
