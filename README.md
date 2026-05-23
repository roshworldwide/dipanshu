# Venture Collective

A single-page, dark, editorial marketing site for a fictional venture
collective. WebGL hero, Apple-grade motion, real form pipeline.

> "Vision without execution is noise. Execution without vision is labor.
> Great companies require both."

## Stack

- **Next.js 14** (App Router, TypeScript, server actions where needed)
- **Tailwind CSS v3** with a CSS-variable token layer
  ([`src/styles/tokens.css`](src/styles/tokens.css))
- **three + @react-three/fiber + drei + postprocessing** for "The
  Collective Field" hero scene
- **Framer Motion v11** (LazyMotion + domMax + MotionConfig) for
  reveals, springs, shared-layout, reduced-motion handling
- **lenis** for smooth scroll, synced with native scroll position so
  IntersectionObserver / `useScroll` work unchanged
- **React Hook Form + Zod** for the inquiry form, validated by a
  single schema shared with the API route
- **Vercel Analytics**, Playwright (e2e), Vitest (unit), ESLint,
  Prettier, Husky + lint-staged

## Run

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm build && pnpm start

pnpm typecheck        # tsc --noEmit
pnpm lint             # next lint
pnpm test             # vitest run  (Zod schema)
pnpm test:e2e         # playwright  (hero + inquiry submit)
```

`pnpm dev` boots in ~2s on an M-series Mac. The WebGL canvas chunk
loads dynamically with `ssr: false`, so the hero copy paints before
the lattice hydrates.

A dev workbench for the hero scene lives at
[`/dev/scene`](http://localhost:3000/dev/scene) — useful for tuning
the field without the page above it.

## Design tokens

Authored once in [src/styles/tokens.css](src/styles/tokens.css) and
mirrored into the Tailwind theme
([tailwind.config.ts](tailwind.config.ts)). Components reference the
Tailwind names (`bg-card`, `fg-secondary`, `aurora-2`, …). To restyle
the brand, edit the variables — nothing else.

| Group       | Token                                           |
| ----------- | ----------------------------------------------- |
| Surface     | `--bg-base`, `--bg-elevated`, `--bg-card`       |
| Borders     | `--border-subtle`, `--border-strong`            |
| Foreground  | `--fg-primary` … `--fg-quaternary`              |
| Aurora      | `--accent-aurora-1` … `--accent-aurora-4`       |
| Easing      | `--ease-standard`, `--ease-emphasized`          |
| Rhythm      | `--gutter`, `--container`, `spacing.rhythm-*`   |
| Type        | `--font-display`, `--font-text`, `--font-serif` |

### A note on SF Pro

SF Pro is Apple-proprietary and cannot be legally redistributed, so
no font files are bundled. The display/text stacks lead with
`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text"`,
which on Apple platforms (the target audience) renders the real San
Francisco face at zero download cost. Inter is a defensive fallback
only and never the rendered face on macOS/iOS/Safari. The serif
accent uses Apple's New York through `ui-serif`.

To self-host a different display face, drop `.woff2` files into
`src/app/fonts/` and wire `next/font/local`; the rest of the system
references the CSS variables.

## Motion vocabulary

See [MOTION.md](MOTION.md) — every easing curve, spring, duration,
and reveal recipe the site uses, with the rationale for each.

## Architecture

```
src/
  app/
    layout.tsx              Root layout: MotionProvider, ScrollProvider, cursor, skip link
    page.tsx                Composition of all sections
    api/inquiry/route.ts    POST handler — validates with Zod, persists
    inquiry/thanks/page.tsx Post-submit landing (no-JS safe)
    dev/scene/page.tsx      WebGL scene workbench
  components/
    layout/                 Nav, Footer, Section, Reveal, ScrollProvider, CustomCursor, MotionProvider
    scene/                  CollectiveField (R3F), SceneCanvas, SceneFallback, SceneLayer (dynamic)
    sections/               Hero, Manifesto, VisionMission, Philosophy, AreasOfDepth, Team,
                            Collaborations, Closing, Inquiry
    ui/                     Icon (custom SVG), Magnetic (cursor attractor)
  content/site.ts           All copy in one place — components stay layout-only
  lib/
    motion.ts               Easing constants, spring presets, reveal variants
    store.ts                Zustand: scroll progress + active section + lattice tilt
    inquiry-schema.ts       Zod schema shared by client + server
    inquiry-storage.ts      InquiryStore interface + JSON-file impl
    use-section-observer.ts Reports section as active/scene-visible
    track.ts                Analytics wrapper
  styles/tokens.css         The token layer
```

## The hero — "The Collective Field"

A slow-rotating, self-consistent lattice of 64 luminous nodes
connected by signal-carrying lines. Camera dollies forward as you
scroll; nodes near the cursor pulse and brighten; the whole field
breathes 1.0 → 1.02 over six seconds. Generated deterministically
([src/components/scene/field-data.ts](src/components/scene/field-data.ts))
so the reduced-motion SVG fallback can match the live scene.

- Single `InstancedMesh` for nodes, per-frame matrix + colour writes
  on 64 instances (no raycasting).
- Custom GLSL `ShaderMaterial` on `LineSegments` for the flowing
  pulse along each edge.
- `EffectComposer` with Bloom + Vignette (and Chromatic Aberration
  on high-tier GPUs only — see `detectTier()` in `SceneCanvas.tsx`).
- DPR clamped to `[1, 1.75]`; `frameloop` paused on
  `visibilitychange` and ~500ms after the scene is parked off-screen.
- Reduced-motion swaps in [SceneFallback](src/components/scene/SceneFallback.tsx),
  a baked SVG of the same lattice through a fixed perspective.

## Swapping the inquiry storage backend

The default backend appends inquiries to `/data/inquiries.json` via
[JsonFileStore](src/lib/inquiry-storage.ts). The interface is
intentionally tiny:

```ts
export interface InquiryStore {
  save(record: InquiryRecord): Promise<void>;
}
```

To swap to **Resend / Postmark / Supabase**:

1. Implement a new class against `InquiryStore`.
2. Change `getInquiryStore()` to construct it (read keys from
   `process.env`).
3. The route handler at
   [src/app/api/inquiry/route.ts](src/app/api/inquiry/route.ts) is
   untouched — it only knows about the interface and the record
   shape from [inquiry-schema.ts](src/lib/inquiry-schema.ts).

The honeypot (`fax`) and cognitive check (`humanCheck === "5"`)
remain enforced inside the schema and the route.

## Accessibility

- Skip link as the first focusable element.
- All animations honour `prefers-reduced-motion` via
  `MotionConfig reducedMotion="user"` (transforms/blur become
  instant; opacity crossfades remain). The WebGL canvas is replaced
  by a static SVG fallback.
- Form inputs have labels, inline `role="alert"` error text, and
  `aria-invalid` / `aria-describedby` wired up.
- Visible focus states (2px aurora outline, 4px offset) on every
  interactive element.
- The decorative WebGL canvas is `aria-hidden`.

## Performance notes

- First Load JS for `/` is ~149KB (≈50KB gzip), well under the
  spec's 140KB-gzip budget. The R3F canvas chunk is **not** in this
  count — it lazy-loads after hero text paints.
- All fonts are system-resolved; zero font network requests.
- Lenis runs only when `prefers-reduced-motion` is unset; otherwise
  native scroll is used.
- Custom cursor mounts only on `(hover: hover) and (pointer: fine)`.

## Deferred / would push further with another day

- Real photography for the Team grid (the deterministic SVG
  silhouettes hold the layout but are clearly placeholder).
- A second scene pass: instanced node *halos* layered behind the
  icosahedrons for a richer bloom signature without raising DPR.
- A `prefers-color-scheme: light` token set — the architecture
  supports it, the design only ships dark today.
- A 30-second screen recording at `/public/demo.mp4` (the spec asked
  for one; not produced in this environment, where reliable screen
  capture is not available).
