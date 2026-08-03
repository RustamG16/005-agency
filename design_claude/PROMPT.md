# Build prompt — paste everything below the line into Claude

---

Build the `/about` page of a Next.js 15 project as "The Monolith" — one WebGL object
that lives through the entire page and transforms per chapter. Everything you need is
in this folder; do not ask for more context.

## Skills — invoke these, at these moments

- `/awwwards-web-design` — invoke FIRST. It governs the whole build: reference-level
  quality bar, implementation process, responsive polish, QA.
- `/gsap-scrolltrigger` — before writing the master scrub, pins, or chapter triggers.
- `/gsap-core` — for timeline structure, easing, and `gsap.matchMedia` (mobile +
  prefers-reduced-motion variants).
- `/gsap-plugins` — before implementing SplitText chapter headlines.
- `/gsap-performance` — as the FINAL pass before verification: 60fps target,
  transforms-only, will-change discipline, texture/draw-call budget.

## Read, in this order, before writing any code

1. `ABOUT-MONOLITH-SPEC.md` — the approved design. Follow it exactly: chapter
   timeline, monolith states, copy inventory, accent budget.
2. `reference/CLAUDE.md` — project hard rules and verification protocol.
3. `reference/tokens.css` + `reference/globals.css` — the only source of visual values.
4. `MEDIA-GUIDE-ABOUT.md` — which media files exist vs. need placeholders.
5. `reference/` code conventions: `gsap.ts` (plugin registration), `SmoothScroll.tsx`
   (Lenis), `InteriorReveal.tsx`, `HeaderZone.tsx`, `fonts.ts`, `useReducedMotion.ts`,
   `useIsMobile.ts`, and `AboutHero.tsx` + `AboutHero.module.css` (file + CSS-module
   style to imitate). `package.json` shows exact dependency versions.

## Where to write code

- If the full repo is mounted (you can see `app/`, `components/`, `styles/` at the
  project root): write directly into the repo per spec §5.
- If only this folder is mounted: write to `output/`, mirroring repo paths exactly
  (`output/components/sections/about/monolith/...`, `output/app/(interior)/about/page.tsx`)
  plus `output/INTEGRATION.md` — the exact copy/install steps to merge into the repo.

## Scope

1. One new dependency: `three` (pin latest stable). No R3F, no drei.
2. `components/sections/about/monolith/`:
   - `MonolithScene.tsx` — canvas lifecycle, renderer, master ScrollTrigger scrub.
   - `monolith.ts` — object build (448:580 face ratio box, 24-shard pre-split group),
     chapter state functions on one GSAP timeline (spec §2).
   - Chapter DOM components with copy from spec §4.
3. `app/(interior)/about/page.tsx` per spec §5.
4. Media: use `public/videos/loops/loop-a.mp4` etc. and `public/images/team/*.jpg`
   if present; otherwise ship graceful placeholders (ink panels / neutral blocks) —
   the page must build and run clean without any of these files.
5. Mobile (<768px): scrubbed pre-render per spec §3 if `public/videos/monolith-mobile.mp4`
   exists; otherwise poster + static chapters. Reduced motion: stills + opacity reveals.

## Constraints (non-negotiable)

- Accent oxblood renders exactly 3×: monolith edge seam (ch. 6), nav-active underline,
  CTA hover underline. Grep to confirm nothing else.
- Tokens only; fonts via the `next/font` setup in `reference/fonts.ts`; no
  gradients/glassmorphism/emoji icons/decorative shadows/blanket scroll-fades;
  no "SYMBOL STUDIO" strings, no `#FE552E`, no gold `#B18A46`.
- Copy exactly from spec §4 — do not invent titles, bios, clients or numbers.
- Never scrub a non-all-keyframe video; scrub must work in both directions.

## Verification (spec §6)

If repo-mounted: `npm run build` clean → Playwright full-page 1440×900 + 390×844 →
console clean after full scroll down/up + hovers → accent-count grep → fps sanity per
gsap-performance → reduced-motion pass. If output/-mode: TypeScript must compile
standalone (`tsc --noEmit` against the versions in `reference/package.json`), plus the
accent grep and a written self-review against spec §2 chapter by chapter.
List every deviation from the spec; do not silently accept any.
