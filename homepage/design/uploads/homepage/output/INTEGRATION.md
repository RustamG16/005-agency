# INTEGRATION.md — "The Guide" home page

Output-mode build: only `homepage/` was mounted, so everything is written here
mirroring repo paths. No dependencies added (`three`, `gsap` + Flip/SplitText/
ScrollTrigger, `lenis` are already in `reference/package.json`).

## 1. License step — do this first (blocking, spec §0)

`components/chrome/GuideColophon.tsx` + `.module.css` render the CC credit:

    Robot: "REPO Robot" by OscarLomas3D (CC BY 4.0)   → linked to the model page

Render `<GuideColophon />` inside the existing footer colophon row (the row that
already holds the legal / copyright line). The build fails review without it —
`grep -r OscarLomas3D` must hit a **rendered** component, not just this folder.

## 2. Copy in

| From | To |
|---|---|
| `output/app/(home)/page.tsx` | `app/(home)/page.tsx` (replaces current) |
| `output/components/sections/home/guide/*` | `components/sections/home/guide/` |
| `output/components/chrome/GuideColophon.*` | `components/chrome/` |
| `output/scripts/capture-hero-frame.mjs` | `scripts/` |
| `output/public/models/repo_robot.glb` | `public/models/repo_robot.glb` |

Files: `HeroFilm.tsx(+css)`, `GuideScene.tsx(+css)`, `guide.ts`, `guide-copy.ts`,
`GuideCallouts.tsx(+css)`, `GuideCta.tsx(+css)`.

Note the model path: `public/models/repo_robot.glb` (the original filename, as
the PROMPT's asset section requires — not `robot.glb`). It is the third argument
of `buildGuide(canvas, stage, modelUrl)` if you move it.

Add to `package.json` scripts:

    "capture:hero": "node scripts/capture-hero-frame.mjs"

`OpeningSequence` is retired from the page. Leave the component in the repo (the
scrub pattern doc references it) — just stop rendering it.

## 3. One optional chrome hook

The preloader wordmark FLIPs into the nav. It looks for `[data-site-wordmark]`
on the nav's wordmark element. Add that attribute in `HeaderZone`/the nav
component. Without it the wordmark simply cross-fades — no layout guessing, no
error.

## 4. Media, when it exists

Nothing is required to build or run. Drop-in order (MEDIA-GUIDE-HOME):

1. `npm run capture:hero` → `homepage/assets/hero-first-frame.png` (1920×1080).
2. Omni Flash image-to-video → re-encode all-keyframe (`-g 1`) →
   `public/videos/hero-guide-scrub.mp4` (+ `hero-guide-mobile.mp4`).
3. `public/images/poster-hero-guide.jpg` — poster and reduced-motion hero.
4. `public/images/guide-pose-{a,b,c}.png` — the ≤768px chapter stills.

**Before you generate the film:** MEDIA-GUIDE §3's prompt says "one glowing red
eye". The asset has two eyes and both are lit (see Deviations 1). Change that
phrase to "its two glowing red eyes" or the film will not match the still.

## 5. Accessible fallback for the callout copy

`GuideCallouts` renders the cards `aria-hidden="true"` and, next to them, a
`visually-hidden` ordered list carrying all six lines in order — chapter 06's
line is the `/contact` link. `.visually-hidden` already exists in `globals.css`.
Under `prefers-reduced-motion` the cards drop into the page flow instead
(`data-mode="flow"`), so the copy is visible with nothing moving.

## 6. Dev helpers

- `window.__guideProgress(p)` — steps the Stage B master timeline (clone of
  `__monolithProgress`). Dev only.
- `?pose=hero` — locks the robot in the §2 capture pose, sizes the stage to
  exactly 1920×1080, adds the unlit noir floor + contact shadow, skips the
  master trigger. Dev only.
- `console.info("[guide] model inventory", …)` logs mesh/material/clip/eye-bone
  names on load, dev only.

## 7. Verification run (spec §8)

- [ ] `npx tsc --noEmit` — run in the repo after copy-in (there is no tsconfig
      in this folder; the code targets `next 15.5.20` / `react 19.2.7` /
      `three ^0.169` / `gsap 3.15.0` from `reference/package.json`).
- [ ] `npm run build` clean.
- [ ] Playwright full-page at 1440×900 and 390×844.
- [ ] Scroll the whole page **down and up** — robot position and callouts must
      match on the way back (see the scrub note in Self-review, chapter 0).
- [ ] Console clean after scroll + hovers.
- [ ] Accent count = 4 (audit below).
- [ ] `grep -r OscarLomas3D` hits the rendered footer.
- [ ] fps sanity at 1440×900; reduced-motion pass.

### Accent audit (spec §6) — exactly 4

| # | Use | Where |
|---|---|---|
| 1 | Robot eye emissive, chili | `guide.ts` → `EYE_EMISSIVE` (film + live = the same eye) |
| 2 | Nav-active underline | existing site chrome, untouched |
| 3 | Callout connector rule on noir, chili | `GuideCallouts.module.css` → `.card[data-surface="noir"] .connLine` |
| 4 | CTA email hover underline, cherry on cotton | `GuideCta.module.css` → `.email:hover` |

Grepped: no other red token, no `#FE552E`, no `#B18A46`, no `#9E2B2B`, no
"SYMBOL STUDIO", no gradients, no shadows, no emoji.

---

# Self-review against spec §3, chapter by chapter

**0. Architecture / scrub.** Two ScrollTriggers, as specified: `home-guide-hero`
(pinned, `+=200%`, scrub 0.3, `refreshPriority: 30`) and `home-guide-stage-b`
(`top top` → `bottom bottom`, scrub 0.3, `refreshPriority: 40`, animation = the
one master timeline). Timeline total duration is exactly 1, so its progress *is*
the §3 progress column. Every chapter step is a tween on a plain `state` object
(position, yaw, tilt, head, clip weights, eye) — no `set()`-only jumps, no
one-way callbacks — so reverse scrub retraces the same values. Clip time is
derived from accumulated travel and from the gesture weights, never from frame
deltas, which is what keeps the walk cycle identical in both directions.

| §3 | Built | Notes |
|---|---|---|
| .00–.08 Arrival | Drops from `y -0.22` to `0.46` beside the H1 block, then a head turn and sway-on | ✔ |
| .08–.30 Services | Five parks down the left gutter (`x 0.13`, `y 0.30 → 0.54`), head turns to the active row at each park; callout 02 speaks the active service's `role` from `services.ts`, index derived from scrub progress | Row positions are evenly spaced, not measured off the live rows — see Deviation 4 |
| .30–.50 Process | Travels to `x 0.74`, `Talk` clip as the point, rises with the band, settles | Gesture is the rig's `Talk` clip rather than a hand-rolled arm raise — better than fake bone rotation |
| .50–.70 Principles | Perches at `x 0.16 / y 0.60`, `tilt 0.06`, full idle sway | "Sits on the block edge" is a park + tilt, not a seated pose (no sit clip in the rig) |
| .70–.85 FAQ | Head tilt + `Talk` at half weight as the shrug | ✔ |
| .85–1.0 CTA | Walks to centre, `turn → 0` (faces viewer), one `action_Greet` wave, eye 1 → 1.55 | ✔ |
| Callouts | Six cards, one non-scrub `ScrollTrigger` per chapter anchor with `onToggle` (fires in both directions), clip-path reveal + SplitText masked lines, 0.2s reverse exit, connector draws in with `scaleX` | ✔ |
| Relay rule | Stage A pin ends → 55vh noir absence beat → Stage B timeline starts the robot off-screen (`y -0.22`, `opacity 0`) and the canvas only renders while the guide root intersects | ✔ — the robot cannot be in both media at once |
| §7 mobile | `gsap.matchMedia`: ≤768px has no pin, no canvas; poster + non-scrub autoplay intro; static `guide-pose-{a,b,c}.png` placed per chapter; callouts are in-view reveals with no connector | ✔ |
| §7 reduced motion | No canvas, no scrub, no preloader animation; poster only; callout copy in the flow | ✔ |
| §7 perf | pixelRatio ≤1.5, no shadow maps, `powerPreference: high-performance`, transparent clear, render on the shared gsap ticker gated by IntersectionObserver + `document.hidden`, full dispose (geometries, materials, textures, renderer + `forceContextLoss`), original 7MB PBR texture set disposed after recolor, `will-change` only on the active callout card | ✔ |

## Deviations — every one of them

1. **Two lit pupils, not one.** Spec §1 says "THE EYE… single emissive accent"
   and MEDIA-GUIDE §3 says "one glowing red eye". The asset has two eyes
   (`eyeR_06`, `eyeL_08`); one lit pupil on a two-eyed robot reads as damage.
   Both are lit from **one** chili material, so the accent budget is unchanged.
   Needs the film-prompt wording fix in §4 above. Flag if you disagree — it is a
   one-line change (`eyeBones.slice(0, 1)`).
2. **The shipped emissive map is dropped.** It is green and it lights the robot's
   **back panel strips**, not the eye — keeping it (even converted to a
   luminance mask) would have put four glowing marks on the robot's back. The eye
   is built as a sphere on each eye bone instead. Verified in a live harness, not
   assumed.
3. **No hairline trim lines** (spec §1 lists them as optional). The GLB has two
   materials and no separate trim geometry, so there is nothing to key them to.
4. **Service row parks are evenly spaced**, not aligned to each rendered row's
   Y. `ServicesPreview`'s internals were not mounted, so the five parks are
   `y 0.30 → 0.54`. If you want true alignment, add `data-guide-service` to each
   row and drive `state.y` from `getBoundingClientRect()` on refresh.
5. **The canvas sits above the section backgrounds *and* their copy** (z-index 3,
   callouts 4). Spec §2 wants it between the two; that is only possible if the
   sections have transparent backgrounds, and they do not. Mitigated by keeping
   the robot in the gutters. One-line fix once sections go transparent: move
   `.stage` to `z-index: 0` and `.content` to `1`.
6. **`guide-copy.ts` is a fifth file** beyond the four named in the PROMPT. The
   chapter map and callout copy are shared by the DOM layer and by `guide.ts`,
   which is dynamically imported with three — the copy cannot live in there
   without dragging three into the first paint.
7. **A CTA section was added** (`GuideCta.tsx`) to carry the §5 CTA head + line,
   because chapter 06 needs something on the page to walk to. It uses
   `site.footerHeadline` verbatim. If the site footer already renders that
   headline you will see it twice — drop one.
8. **Callout 06's `/contact` link lives in the accessible list**, not on the
   card. The cards are `aria-hidden` decoration (spec §4); a link inside them
   would be unreachable.
9. **Hero copy fades out at scrub .78.** Not in the spec. The film's last beat is
   the robot leaving through the bottom edge, and the absence beat only reads if
   the frame is empty. Delete the last `tl.to(copy, …)` if you want the copy held.
10. **`assets/repo_robot.glb` was absent at the start of the build** and arrived
    mid-session; it is now in `assets/` and shipped to
    `output/public/models/repo_robot.glb`.
11. **`npm run build` / Playwright / fps were not run** — output mode, no repo,
    no node. The §7 checklist above is unticked on purpose.
