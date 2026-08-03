# INTEGRATION.md — About / The Monolith

Generated in `output/`-mode: the repo was not mounted, so these files mirror repo
paths exactly. Copy them in, install one dependency, then run the repo verification
in `ABOUT-MONOLITH-SPEC.md` §6.

## 1. Dependency

```bash
npm i three @types/three
```

Then **pin** the resolved version in `package.json` (this environment is offline, so
the exact latest-stable number could not be resolved here — see deviation D1).
No R3F, no drei. Nothing else was added.

## 2. Files

| From `output/` | To repo |
|---|---|
| `components/sections/about/monolith/monolith.ts` | same path |
| `components/sections/about/monolith/MonolithScene.tsx` | same path |
| `components/sections/about/monolith/MonolithScene.module.css` | same path |
| `components/sections/about/monolith/AboutChapters.tsx` | same path |
| `components/sections/about/monolith/AboutChapters.module.css` | same path |
| `components/sections/about/monolith/useChapterReveal.ts` | same path |
| `app/(interior)/about/page.tsx` | **replaces** the current About page |

Imports assumed to already exist (all used elsewhere in the repo):
`@/components/motion/gsap`, `@/components/chrome/HeaderZone`.
`SplitText` is imported from `gsap/SplitText` — free in gsap 3.13+, no auth token,
no `.npmrc` change.

The old About sections (`StudioModel`, `StudioFilm`, `CapabilitiesList`,
`ProcessSteps`, `Principles`) are simply no longer mounted; their files stay put.

If the site's `Grain` overlay is mounted per-page rather than in the interior layout,
add it inside `<MonolithScene>`'s stage (spec §1 wants grain from the existing overlay,
not a shader) — see deviation D4.

## 3. Media — all optional, page builds and runs clean without every file

| Path | Used by | Missing → |
|---|---|---|
| `public/videos/loops/loop-a|b|c.mp4` | ch.5 screen face (VideoTexture) | ink panel CanvasTexture, no error |
| `public/images/team/marija.jpg`, `rustam.jpg` | ch.5 duo cards | neutral ink card, name/roles unchanged |
| `public/videos/monolith-mobile.mp4` | <768px scrub | poster + static chapters |
| `public/images/about/monolith-poster.jpg` | mobile poster + reduced motion | stage stays noir |
| `public/images/about/monolith-ch1…ch6.jpg` | reduced-motion per-chapter stills | falls back to the poster |

The mobile MP4 must be the all-keyframe re-encode (media guide §4 / plan §17.1). The
chapter-5 loops are **never** scrubbed — normal encode, muted, `loop`, autoplayed only
while progress is inside .70–.93 and the canvas is on screen.

## 4. What the code does (spec §2, chapter by chapter)

One `gsap.timeline({paused:true})` of duration exactly **1**, driven by a single
`ScrollTrigger` (`start: "top top"`, `end: "bottom bottom"`, `scrub: 0.3`) on the page
root — so master progress *is* spec progress.

- **.00–.12 Arrival** — whole, idle float (independent tween), rig 0→0.06 rad, object
  +2°.
- **.12–.28 Position** — rig orbits to 0.61 rad (35°), object untouched, camera drifts
  the object right of frame for the manifesto column.
- **.28–.50 Fracture** — 24 pre-split shards (3×4×2) translate to a strict exploded
  grid (×2.05, ×1.5, ×5.2 on the rest lattice, no tumbling), 2.2 ms-per-shard stagger,
  `power3.out`; camera pulls to z 6.4; six shard faces cross-fade in CanvasTexture
  brand artifacts; a slow settle holds .40–.50.
- **.50–.72 Web & 3D** — shards return to rest, artifacts fade out, surface cross-fades
  to the 3×4×2 wireframe (body opacity → .05, hairline lines → .85) and re-materialises.
- **.72–.90 Content** — rig returns to 0, camera moves the object to the left third,
  the front-face screen plane fades up and steps through loops A→B→C by progress
  (direction-safe: index derived from a tweened value, not `.call()`).
- **.90–1.0 Going up** — camera returns to arrival framing (x 0, z 4.2) and the oxblood
  seam scales down the front-right edge of the front face and ignites (`power2.in`).

## 5. Accent budget

Grepped `output/` for `accent|c1554d|9e2b2b|b18a46|FE552E|Symbol`:

1. `monolith.ts` — `ACCENT_ON_NOIR = 0xc1554d`, the ch.6 seam material. **Render #1.**
2. `AboutChapters.module.css` — `.email::after`, hover/focus only. **Render #3.**

Render #2 (nav-active underline) is site chrome and untouched by this page. No other
accent, no gold, no `#FE552E`, no Symbol strings. Note that `globals.css` already uses
`--color-accent` for `::selection`, `.skip-link` and `:focus-visible` — pre-existing
chrome, not introduced here.

## 6. Performance (gsap-performance pass)

- One RAF: the renderer draws on the `gsap.ticker` Lenis already drives — no second loop.
- `pixelRatio ≤ 1.5`, `powerPreference: "high-performance"`, shadow maps off, all
  textures 512px (budget 1024).
- Draw calls: 24 shards share one `MeshStandardMaterial` and one `BoxGeometry`; six
  artifact planes share one geometry; plus wireframe, screen, seam ≈ 33 objects.
- RAF is skipped when the stage is off-screen (IntersectionObserver) or the tab is
  hidden; the ch.5 videos are paused in the same conditions.
- `will-change: transform` is set on the stage only while the ScrollTrigger is active
  and reset to `auto` on toggle and unmount.
- Full teardown on unmount: timeline, ScrollTrigger, idle tween, geometries, materials,
  textures, video elements, renderer + `forceContextLoss()`.
- DOM motion is transforms and opacity only; the copy reveals are `once: true`, so
  nothing re-runs on scroll-back.

## 7. Verification status

Run in the repo (not possible here): `npm run build`, Playwright 1440×900 + 390×844,
console after full scroll down **and** up + hovers, fps trace, mobile scrub both
directions, reduced-motion pass.

Done here instead — the scene was ported to a standalone browser page
(`Monolith Preview.dc.html`, review artefact only, not for merge) running the same
geometry, materials and timeline, and probed with `gl.readPixels` at 12 progress
values:

- object is centred at .00 (bbox centre 49.9% of frame), right of centre through
  .12–.50 (57–62%), left third at .72–.90 (26%), centred again at 1.0 (49.9%);
- the exploded bbox is 30% wider than the whole object at .34, and the artifact
  textures register (4,090 bone-value pixels at .45, zero before .35 and after .54);
- the wireframe pass registers (5,916 hairline pixels at .66, body opacity 0.05,
  wire 0.85) and re-materialises to body 1 / wire 0 by .72;
- the seam renders as a 2px column at exactly `#c1554d` (max channel 193, 765 px)
  from ~.95, zero before .92, and nowhere else in the frame at any other progress;
- copy reveals: SplitText line masks build, lines settle to identity transform, and
  chapter panels are on screen for their whole span at every scroll offset tested.

## 8. Deviations from the spec — every one, listed

**D1 — `three` version not literally pinned.** No registry access here. Install and
pin the resolved version; the code uses only stable APIs
(`WebGLRenderer`, `BoxGeometry`, `WireframeGeometry`, `CanvasTexture`, `VideoTexture`,
`SRGBColorSpace`), so any r15x–r17x works.

**D2 — page height is 1000svh, not ≈650svh.** At 650svh, chapters 1 (.12) and 6 (.10)
are shorter than one viewport, so their copy panel cannot hold — text overlapped the
next chapter's and left blank stretches between panels (observed, not theoretical).
Spans are exactly proportional to the spec §2 progress boundaries
(120/160/220/220/180/100), so **every progress number in §2 is unchanged**; the page is
just longer. Shortening it means moving the chapter boundaries instead — your call.

**D3 — the canvas is a sticky full-viewport stage inside the page, not
`position: fixed`.** Same visual result, but it cannot outlive the page or fight the
fixed site chrome for stacking. Change `.stage` in `MonolithScene.module.css` if the
repo prefers a fixed canvas.

**D4 — the `Grain` overlay is not mounted.** The component was not in `reference/`, so
its import path could not be verified. Spec §1 wants it; add one line inside the stage.

**D5 — chapter 5 has no eyebrow.** §2 gives eyebrows for chapters 3 and 4 only and §4
lists no ch.5 eyebrow, so none was invented.

**D6 — six artifact faces, not eight.** §2 allows 6–8; six front-layer shards fall on
the checkerboard that keeps the artifacts from clustering. Raise the cap in
`buildMonolith` if you want eight.

**D7 — `tsc --noEmit` was not run.** No Node toolchain in this environment. Types were
written against the versions in `reference/package.json` and reviewed by hand; the two
external imports (`@/components/motion/gsap`, `@/components/chrome/HeaderZone`) match
their reference files' signatures. Treat the first `npm run build` as the real check.

**D8 — reduced motion uses one still per chapter, sourced from optional files.** Until
`monolith-ch1…6.jpg` are exported from the pre-render, every chapter shows
`monolith-poster.jpg`, and if that is absent the stage is plain noir. §3 asks for
per-chapter stills; the mechanism is in place, the assets are not.

**D9 — the ch.5 loop cycle is driven by a tweened index, not discrete callbacks.**
Spec says "cycling 2–3 loops"; a tweened index is the only version that behaves
identically when the user scrubs upward.
