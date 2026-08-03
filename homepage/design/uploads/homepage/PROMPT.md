# Build prompt — paste everything below the line into Claude

---

Build the home page (`/`) of a Next.js 15 project as "The Guide" — a scrubbed
hero film starring a small robot that walks out of the frame and continues as a
live Three.js object, guiding the visitor through the page with tutorial-style
callout pop-ups. Everything you need is in this folder; do not ask for more
context.

## Skills — invoke these, at these moments

- `/awwwards-web-design` — invoke FIRST. It governs the whole build:
  reference-level quality bar, implementation process, responsive polish, QA.
- `/frontend-design` — invoke immediately after, before any layout or CSS. Use
  it to keep the aesthetic direction intentional (editorial type, restraint,
  nothing templated). The robot is charming; the design around it must stay
  luxury-boutique noir. Bouncy/cartoon easing is a build failure.
- `/gsap-scrolltrigger` — before writing the pinned hero scrub, the Stage B
  master timeline, or any chapter trigger. The whole page hangs off two
  ScrollTriggers; get their architecture from this skill, not from memory.
- `/gsap-core` — when structuring timelines, easing and `gsap.matchMedia`
  (the ≤768px and `prefers-reduced-motion` variants in spec §7 are mandatory).
- `/gsap-plugins` — before implementing (a) the preloader→nav wordmark FLIP
  (Flip plugin) and (b) SplitText masked-line reveals for H1 + callouts.
- `/gsap-performance` — as the FINAL pass before verification: 60fps target,
  transforms-only in DOM, will-change discipline, single shared RAF, renderer
  budget from spec §7.

## Read, in this order, before writing any code

1. `HOME-GUIDE-SPEC.md` — the approved design. Follow it exactly: chapter
   timeline, robot recolor spec, relay handoff rule, callout system, copy
   inventory, accent budget, license credit.
2. `reference/CLAUDE.md` — project hard rules and verification protocol.
3. `reference/tokens.css` + `reference/globals.css` — the ONLY source of visual
   values (R7 cotton/cherry/noir set — note this supersedes any older
   oxblood/bone palette you may find in prior art).
4. `MEDIA-GUIDE-HOME.md` — film pipeline. The video does NOT exist at build
   time; you build the fallback state first and the first-frame capture helper.
5. `reference/` conventions: `gsap.ts` (registration + defaults),
   `SmoothScroll.tsx` (Lenis), `MonolithScene.tsx` (THE architecture to clone
   for the live canvas: dynamic three import, scrubbed master trigger, ticker
   render, IO gating, dispose), `video-scrub-pattern.md` (scrub-by-proxy,
   pinned timeline shape, stall fallback), `HeaderZone.tsx`, `fonts.ts`,
   `useReducedMotion.ts`, `useIsMobile.ts`, `home-page.tsx` (current page being
   replaced), `site.ts` + `services.ts` (real copy — use it verbatim),
   `package.json` (exact dependency versions; three@0.169 is already a dep).

## The robot asset

- `assets/repo_robot.glb` — PRESENT in this folder. Rigged, ~8.1k tris, 1k
  textures. Load with GLTFLoader (no DRACO needed). Recolor at runtime per
  spec §1 — the shipped red-rust skin must never render on screen. Inspect the
  model first (log mesh/material names) and key the material overrides on what
  you find, not on guessed names. Ship it to `public/models/repo_robot.glb`
  (copy step in INTEGRATION.md if output-mode).
- The recolored hero pose is the LOCKED look: the film gets generated later
  from your `hero-first-frame.png` capture, so the robot's on-page look must be
  final-quality before capture — treat the recolor + lighting as a deliverable,
  not a placeholder.
- License credit in the footer colophon is a HARD requirement (spec §0).

## Where to write code

- If the full repo is mounted (you can see `app/`, `components/`, `styles/` at
  the project root): write directly into the repo —
  `components/sections/home/guide/` (HeroFilm.tsx, GuideScene.tsx, guide.ts,
  GuideCallouts.tsx + module.css files), update `app/(home)/page.tsx`.
- If only this folder is mounted: write to `output/`, mirroring repo paths
  exactly, plus `output/INTEGRATION.md` — exact copy/install steps, including
  where `robot.glb` goes (`public/models/robot.glb`) and the callout copy's
  accessible fallback.

## Scope

1. No new dependencies. `three`, `gsap` (Flip, SplitText, ScrollTrigger),
   `lenis` are already installed.
2. Stage A — `HeroFilm.tsx`: preloader (wordmark + counter) → Flip into nav →
   pinned 200vh film scrub per `video-scrub-pattern.md`. Film file
   `public/videos/hero-guide-scrub.mp4` may be absent: render
   `assets/hero-first-frame.png` fallback (or ink panel) and keep the pin so
   the page rhythm is testable before the film exists.
3. Stage B — `GuideScene.tsx` + `guide.ts`: fixed transparent canvas cloned
   from `MonolithScene.tsx` architecture; robot load + recolor; ONE master
   scrubbed timeline driving chapter travel per spec §3; callout toggles on
   separate non-scrub triggers.
4. `GuideCallouts.tsx`: the pop-up system per spec §4, copy per spec §5,
   accessible hidden list included.
5. Existing sections (ServicesPreview, ProcessFilm, Principles, Faq, Footer)
   keep their content; restyle entrances only where the spec's chapters demand
   robot-adjacent choreography. `OpeningSequence` is retired from the page.
6. Dev helper: `window.__guideProgress(p)` stepper (clone of
   `__monolithProgress`) + a `?pose=hero` dev mode that positions the robot for
   the §2 first-frame capture at exactly 1920×1080.
7. Mobile + reduced-motion variants per spec §7 — not optional, not deferred.

## Constraints (non-negotiable)

- Accent budget: exactly 4 rendered red uses (spec §6). Grep to confirm.
- Tokens only; fonts via `reference/fonts.ts` setup; no gradients /
  glassmorphism / emoji icons / decorative shadows / blanket scroll-fades.
- Copy exactly from spec §5 + `site.ts`/`services.ts` — do not invent clients,
  numbers, or extra taglines.
- Robot never visible in film and canvas simultaneously (relay rule, spec §2).
- Scrub must be flawless in BOTH directions; never scrub a non-all-keyframe
  file; the page must build and run clean with zero media files present.
- No "SYMBOL STUDIO" strings, no `#FE552E`, no gold `#B18A46`, no oxblood
  `#9E2B2B` (superseded palette).

## Verification (spec §8)

If repo-mounted: `npm run build` clean → Playwright full-page 1440×900 +
390×844 → full scroll down AND up (robot + callouts correct both directions) →
console clean after scroll/hovers → accent-count grep → colophon credit grep
(`OscarLomas3D`) → fps sanity per gsap-performance → reduced-motion pass.
If output/-mode: `tsc --noEmit` against `reference/package.json` versions, the
two greps, and a written self-review against spec §3 chapter by chapter.
List every deviation; do not silently accept any.
