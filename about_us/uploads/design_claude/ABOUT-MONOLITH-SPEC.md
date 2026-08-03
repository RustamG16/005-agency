# About page — "The Monolith" design spec (final, approved)

One WebGL object lives through the entire `/about` page. It never cuts — it becomes
each chapter. The page demonstrates the studio's core service (scroll-animated 3D web)
instead of describing it. Positioning: luxury boutique, two people by design.

## 0. Non-negotiables (from repo `CLAUDE.md` + `MEDIA-GUIDE-R5.md`)

- Colors only from `styles/tokens.css`: noir `#050505`, bone `#EEEDE8`, paper `#F8F7F2`,
  ink `#171717`, gray `#777771`, hairline `#CAC8C0`, accent oxblood `#9E2B2B` /
  `#C1554D` on noir. Gold is retired.
- Accent budget: **exactly 3 rendered uses** — (1) the monolith's edge seam (ch. 6),
  (2) nav-active underline (site chrome), (3) CTA email hover underline.
- Fonts: Archivo Black / Newsreader / Inter via existing `next/font` only.
- No gradients, glassmorphism, emoji icons, decorative shadows, blanket scroll-fades.
- No Symbol Studio content, no `#FE552E`, no fabricated clients/awards/staff/numbers.
- Real names only: **Marija** (graphic design, brand applications, content, social) and
  **Rustam** (direction & strategy, web & 3D, motion, marketing & ads). Titles:
  "Co-founder" only.

## 1. Architecture

- Fixed full-viewport `<canvas>` (Three.js, vanilla — no R3F), z-index behind content.
- DOM chapters scroll in front. Total page height ≈ 650vh desktop.
- One GSAP master timeline scrubbed by a single ScrollTrigger spanning the page
  (`scrub: true`, smoothed ~0.3 lerp). Chapter DOM reveals use their own triggers.
- Lenis smooth scroll already wired (`components/motion/SmoothScroll.tsx`).
- The monolith: box at **448:580 face ratio** (matches `--card-w/--card-h` — the object
  and the site's project cards share geometry), depth ≈ 0.25× width. Matte ink
  surfaces (`#171717` family), scene bg noir, one warm key light + low ambient.
  Subtle film grain via existing `Grain` overlay, not a shader.

## 2. Chapter timeline (master progress 0→1)

| Progress | Chapter | Monolith state | DOM copy |
|---|---|---|---|
| .00–.12 | 1 Arrival | Floating, near-imperceptible rotation (~2°/chapter) | H1: **Convenium is two people.** Nothing else. |
| .12–.28 | 2 Position | Slow camera orbit ~35°; object whole, untouched | Manifesto (Newsreader, `--measure`): "Small by design. The people you meet are the people who make the work — strategy, identity, web, content and media, carried personally from first call to launch." |
| .28–.50 | 3 Identity & graphic design | **Fracture**: splits into 24 shards (3×4×2 pre-split group) that ease outward into a strict exploded grid; 6–8 shard faces carry bone-type brand artifacts (CanvasTexture) | Eyebrow `Identity · Graphic design` + "Systems, not one-offs." + 2 lines |
| .50–.72 | 4 Web & 3D | Shards re-assemble → surface crossfades to wireframe → re-materializes (visible construction) | Eyebrow `Web · 3D · Motion` + "This page is the portfolio." + 2 lines |
| .72–.90 | 5 Content & the two of us | Front face becomes a **screen**: VideoTexture cycling 2–3 AI-generated content loops (see MEDIA-GUIDE-ABOUT.md) | Duo block: two portrait cards (DOM, B&W ink-duotone, `--radius-card`), names Archivo `--font-card-title`, role lists Inter eyebrow. Kicker: "Everything above was made by the two of us." |
| .90–1.0 | 6 Going up | Camera pulls back to arrival framing; thin **oxblood seam** ignites down the front-right edge (emissive plane, `#C1554D`, ~2px apparent width) — accent use #1 | H2 (Archivo, `--font-footer`): **Going up?** + "One conversation. Both founders." + email link (hover: oxblood underline draws left→right — accent use #3) |

Chapter headlines reveal via SplitText masked lines (`yPercent 100→0`,
`--ease-out-sharp`, `--duration-manifesto`), no bounce. Body text: opacity + 24px y,
once. Between chapters 2→3 the first fracture must feel like a decision, not a
transition — hold the whole object until .28, then break with weight.

## 3. Motion & perf rules

- All object/camera animation on the master timeline; transforms only in DOM.
- Fracture shards: one merged group, per-shard matrix tweens; no physics lib.
- Renderer: pixelRatio clamped ≤1.5, no shadow maps, textures ≤1024px,
  `powerPreference: "high-performance"`; pause RAF when canvas fully offscreen
  and when tab hidden; dispose geometry/textures/renderer on unmount.
- `will-change` only while the section is active. Target 60fps at 1440×900;
  never below 30 on mid mobile.
- `gsap.matchMedia`:
  - `<768px`: canvas removed; a pre-rendered MP4 of the same timeline is scroll-scrubbed
    (all-keyframe re-encode, `IMPLEMENTATION-PLAN.md` §17.1 — never scrub the original).
    Capture method in MEDIA-GUIDE-ABOUT.md §4.
  - `prefers-reduced-motion`: static poster stills per chapter, opacity-only reveals.

## 4. Copy inventory (final)

| Slot | Copy |
|---|---|
| H1 | Convenium is two people. |
| Manifesto | Small by design. The people you meet are the people who make the work — strategy, identity, web, content and media, carried personally from first call to launch. |
| Ch.3 head | Systems, not one-offs. |
| Ch.3 body | Identity and graphic design built to extend — a brand should get stronger with use, not need a redesign in a year. |
| Ch.4 head | This page is the portfolio. |
| Ch.4 body | Scroll-driven, real-time 3D, built in-house. What you are watching is what we ship. |
| Ch.5 head | Made, not sourced. |
| Ch.5 body | Content, campaigns and social — produced in the studio, tuned per platform. |
| Duo kicker | Everything above was made by the two of us. |
| Marija roles | Graphic design · Brand applications · Content · Social |
| Rustam roles | Direction & strategy · Web & 3D · Motion · Marketing & ads |
| CTA | Going up? — One conversation. Both founders. — hello@convenium.studio |

## 5. Page assembly

`app/(interior)/about/page.tsx`: replace current section list with
`MonolithScene` (canvas + chapters as children/slots). Keep `HeaderZone` theming:
chapters 1–6 are all noir (`theme="dark"`); the page opens dark — this is the one
interior page that inverts, which is deliberate. Remove StudioModel / StudioFilm /
CapabilitiesList / ProcessSteps / Principles from this page (files stay in repo).

## 6. Verification (mark nothing done before all pass)

`npm run build` clean → Playwright full-page 1440×900 + 390×844 → console clean after
full scroll down AND up + hovers → grep: no Symbol strings / `#FE552E` / `#B18A46`;
accent renders exactly 3× → fps trace ≥30 mid-scroll (use gsap-performance skill
checklist) → mobile scrub both directions → reduced-motion shows stills.
List every deviation from this spec explicitly.
