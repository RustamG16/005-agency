# /about-v3 — run log

Single automated run against `IMPLEMENTATION-PLAN.md`, executed end to end.
Date: 2026-08-18. Repo: `lab/005-agency`, branch `main`.

---

## 1. Preflight (§1)

Every **ABORT** condition passed.

| Check | Result |
|---|---|
| `public/media/journey/{consulting,lab,directions}.mp4` | present — 6.97 / 4.24 / 2.53 MB |
| GOP of each journey clip | **4.0 / 4.0 / 4.0** — all scrubbable |
| `public/media/hero/about-hero.mp4` + `-m.mp4` | present — 4.62 MB / 985 KB |
| `public/images/hero/{mask-a,mask-b,silhouette-a,silhouette-b}.png` | present, all 900×1200 |
| `about-hero-last.webp` (1920×1080) + `-mobile` (1024×576) | present |
| `public/images/about-v3/{consulting,lab,directions}.webp` + `-mobile` | present |
| `portrait-a.webp` / `portrait-b.webp` | **absent, as expected** — §4.6 fallback taken |
| `npm run build` on clean checkout | passed |

Clip durations confirm §5.1: consulting 12.04 s, lab 8.00 s, directions 4.00 s,
all 1280×720 @ 24fps. `about-hero.mp4` is 1920×1080 @ 24fps, 8.00 s, GOP 96 —
irrelevant, it plays and never scrubs.

### Fallback taken — §1.2 skill install

`skills/impeccable.md` **was not in the bundle**. The folder contains only
`README.md` and `emil-design-eng.md`; the six GSAP files and `impeccable.md`
named in §2 are all missing, so the plan's stated fallback ("read
`skills/impeccable.md` directly from this folder") was also unavailable.

Second-order fallback taken: the canonical `impeccable` skill was located in the
local Claude plugin cache and installed to `.claude/skills/impeccable/SKILL.md`,
with the ADAPTER NOTE header **reconstructed** from §1.2's description — it
records that `scripts/context.mjs` and `reference/*.md` are not bundled, names
the repo documents to read instead (`CLAUDE.md`, `DESIGN.md`,
`styles/tokens.css`, `PRODUCT.md`), pins the mode to Persuade and the discipline
to refinement, and carries the stop rule. The harness confirmed discovery.

`emil-design-eng.md` was present and used. The GSAP skills were unavailable as
bundled files; `gsap-react` and `gsap-timeline` were read from the same plugin
cache. Their content is reflected in the build: one timeline with position
parameters (not four triggers), `useGSAP` with `scope`, and explicit
`ScrollTrigger.kill()` in every context teardown.

---

## 2. Phase A — content model (§3)

- `journey.rooms.apollo` → `journey.rooms.directions`, with the `<Plate>` and
  `<MetaStrip>` references and the room-03 comment updated.
- All three `video: null` fields wired to their clips, posters and mobile stills.
- `alt` and `meta` for all three rooms replaced **verbatim** from §3.3.
- Beat prose rewritten in `arrival`, `analysis`, `programs`, `intake`. Every
  field name and shape preserved; only string values changed.

Copy as shipped, against the §3.4 beat spine:

| Beat | Heading | Argument carried |
|---|---|---|
| `arrival` | "Your idea / is enough. / We'll help you / express it." *(unchanged)* | You talk first; nothing is proposed until you are understood |
| `analysis` | "We read / what you / already have." *(was "We read / between / the lines.")* | What exists is read honestly, on one board, in the open |
| `programs` | "One reading. / Three directions." *(was "One diagnosis. / Three ways forward.")* | Three genuinely different directions, none ranked |
| `intake` | "The one you choose / is what gets built." *(was "Meet the system / behind the work.")* | The one you choose is what gets built |

Rule compliance: no metrics, no outcome claims, no named clients; the three
directions are described as equally weighted with none recommended
(`programs.body` says so explicitly); Apollo is named nowhere in sections 03–06;
no device language ("repair what has cracked", "protective structure",
"silhouette" all removed). `intake.label` moved "System" → "Decision" and
`stageLabel` "Apollo / System intake" → "Chosen direction".

**Deviation:** `intake.media` was dead code (nothing rendered
`handoff-start/end.webp`) but sat inside a journey beat and named Apollo twice,
which §3.4 rule 3 forbids. Rather than delete fields, its `src`/`alt` were
repointed to the room-03 plate — shape preserved, Apollo gone from the sequence.
`handoff-start.webp` and `handoff-end.webp` are now referenced by nothing; they
were **not** deleted (§8).

The `media` objects on `arrival`, `analysis` and `programs` are also dead and
still describe the retired ivory companion. They were left alone: they
accurately describe the files they point at, nothing renders them, and
rewriting them was not asked for. Listed as follow-up.

All 25 media paths in `content/about-v3.ts` resolve on disk.

---

## 3. Phase B — the hero banner (§4)

New: `components/sections/about-v3/AboutHero.tsx` + `.module.css`, mounted as
the first child of `AboutV3Page`. New `hero` object in `content/about-v3.ts`.

Sticky bed, `scrub: 0.4`, one timeline with position parameters,
`invalidateOnRefresh: true`, `gsap.matchMedia()` for all three contexts.
**`pin: true` is not used anywhere.** Scroll length 260vh (measured: root is
2340px at a 900px viewport).

Beat map as shipped — matches §4.4 exactly:

| Progress | Beat |
|---|---|
| 0.00 – 0.30 | Film dissolves to cotton |
| 0.20 – 0.50 | Cards travel from in-frame to layout position (`power2.inOut`) |
| 0.45 – 0.70 | Fill crossfade with blur bridge (no-op while portraits are null) |
| 0.52 – 0.72 | Each name arrives just after its own card lands |
| 0.60 – 0.94 | Editorial layer builds in (`expo.out`, stagger 0.07) |

Registration is by construction: `.frame` reproduces the `object-fit: cover`
rect in CSS, the §4.3 percentages live only in the stylesheet as
`--in-left/-top/-width`, and the component reads them back and measures the
travel against the untransformed layout box on every refresh.

### Fallback taken — §4.6 portraits

`HERO_PORTRAITS` (as `hero.portraits`) is `{ a: null, b: null }`. The cards hold
the noir silhouette fill and the crossfade beat is absent from the timeline.
Dropping the two files in and setting the two strings is the entire change.

The crossfade path was still verified: the portraits were **temporarily** wired
to the existing silhouette PNGs, the beat was captured at progress 0.50 and
0.70, the blur bridge was confirmed to apply mid-transition and clear at both
ends with the mask outline identical throughout, and the wiring was reverted.
No media was generated and no credits were spent.

### Deviation — mask files are luminance, not alpha

§4.2 specifies `mask-image: url(mask-a.png)`. Measured, `mask-a/b.png` have a
**fully opaque alpha channel** and encode the figure as luminance (64% black /
34% white, ~1.4% midtone edge). Used as written they would have masked nothing
and each card would have rendered as a solid noir rectangle.

Shipped: the plan's named files with `mask-mode: luminance`, plus an
`@supports not (mask-mode: luminance)` block that swaps to `silhouette-a/b.png`,
which carry the same shape as a real alpha channel. The card cannot fail open to
a rectangle on any engine.

### Deviations — defects found and fixed during verification

1. **Editorial visible at progress 0.** A `from` tween positioned at 0.6 is not
   rendered by a scrubbed timeline until it is reached, so ink type sat at full
   opacity over the near-black film. Replaced with an explicit `gsap.set` plus
   `to` tweens.
2. **Film played on while the cards were registered to its last frame.** §4.1
   gives the film 8 s with "no scroll involvement", but a visitor can scroll
   sooner, and the cards then hand off out of register. On the first scroll the
   film now jumps to its final frame — the same contract the retired Section 01
   opening ran under. (The lookup is lazy: the element is mounted by React state
   one tick after the GSAP context builds, and an eager reference captured null.)
3. **Cards nested inside the cover rect.** `.cards` was a child of `.frame`,
   which is wider than the stage (1600px vs 1440px, offset −80px), so their
   resting position was measured from the frame's edge and both cards sat
   partly off-screen. `.cards` is now a sibling in stage coordinates; only the
   *opening* position is registered to the frame.
4. **`margin-bottom: -100svh` left the bed painting over the next section.**
   Copied from `ProcessFilm`, where it is correct because the plate is meant to
   sit alongside content in the same root. Here it zeroed the bed's margin box,
   so sticky released only when the bed's *top* reached the root's bottom and
   the hero went on painting a full viewport over the section beneath it.
   Dropped; a `.spacer` supplies the scroll instead, and the bed now releases at
   exactly the point the timeline ends. Measured overlap at the seam: **0px** at
   every sampled scroll position.
5. **Static layout assumed a phone.** The `max-width: 768px` and
   `prefers-reduced-motion` rules share one block, so a 1440-wide reduced-motion
   visitor got a 900px-tall card and an empty 810px plate box. Rewritten with
   capped sizes; verified at both 390px and 1440px.
6. **Header theme.** The hero opens near-black and ends on cotton, so one
   `HeaderZone` is wrong for one half. Two out-of-flow trip-wires split at
   **63vh** — arithmetic, not taste: the dissolve ends at 48vh of a 160vh scroll
   and the observer fires 15vh further down. Verified flipping between progress
   0.28 and 0.32.

### Consequential change outside the hero

`FounderOpening`'s thesis was `level={1}`; the hero now carries the page's `h1`,
so it was stepped to `h2`. That component was subsequently deleted (below).

---

## 4. Phase C — re-pacing `JourneySequence` (§5)

`UNIT_VH` unchanged at 0.055. `createSeeker()` and `arm()` untouched (§5.3).

### `holdRatio` and beat weights as shipped

| Room | Clip | `holdRatio` | `enter` | `hold` | `swap` | `orbit` | `veilOut` |
|---|---:|---:|---:|---:|---:|---:|---:|
| consulting | 12 s | **0.92** | 4 | **26** | 0 | 8 | 0.15 |
| lab | 8 s | **1.00** | 4 | **17** | 2 | 5 | 0.15 |
| directions | 4 s | **0.75** | 4 | **13** | 0 | 12 | 1 |

`holdRatio` values are the plan's. Measured frame deltas corroborate them: lab
is still moving at its final frame (1.00 correct) and directions stops at ~70%
(0.75 correct). Consulting stops moving at ~86% rather than 92%, so the last 6%
of its hold is static — harmless, and the plan's value was kept.

`hold` is weighted by clip length. 26 : 17 is exactly the 12 : 8 of the first
two clips. Room 03 is floored at 13 instead of the proportional 8.7, because one
beat of copy needs a minimum dwell to be readable — strict proportionality would
have given it ~0.7 s of reading time.

### Deviation — the veil, and which seam is actually a cut

§5.2 states that 01 → 02 is "a real location change" wanting a full veil, and
that 02 → 03 is "contiguous frames of the same take" wanting a short one.

**Frame extraction shows both seams are contiguous.** The three clips are one
continuous first-person take split across three files: corridor → consultation
room → seated consultant → strategy room → board → table. `consulting.mp4`'s
last frame and `lab.mp4`'s first frame are the same shot of the seated
consultant, continuing a slight push-in; `lab.mp4`'s last and
`directions.mp4`'s first are likewise the same board framing.

(An early read of mean-luma suggested 01 → 02 was a fade to black. That was
wrong — every frame in these clips averages luma 0–3 because the rooms are
near-black, so the mean is not a usable discriminator. The frame comparison is
what settled it.)

§5.2's *reasoning* — "a full cut here inserts a break the footage does not
have" — is correct and was applied to both seams: `veilOut` 0.15 on each, a
blink that masks the swap between two `<video>` elements without inventing a
fade the camera never makes. The final veil stays at **1**: that one is not a
seam in the footage, it is the handover into Section 07's dark band.

### Other Phase C changes

- `swap` 5 → **2**, and the beat fade split into `BEAT_IN = 3` / `BEAT_OUT = 2`.
  At the original values room 02 had a stretch of scroll with no copy on screen;
  at `swap: 2` with a symmetric 3-unit fade the two beats double-exposed. With
  the exit faster than the entrance (Emil's asymmetry rule) and `swap` set to
  exactly `BEAT_OUT`, the arriving beat starts on the frame the departing one
  finishes.
- The component's header narrative and rule 1 were rewritten: they described
  orbital transitions and darkness as the cut, which this footage does not have.
- Removed a stale `eslint-disable` that the baseline build was already warning
  about.

---

## 5. Phase D / D.2 — design and motion (§6)

Scope held to the new hero and the re-paced sequence. `DESIGN.md` untouched, no
tokens changed, the rest of `/about-v3` not redesigned.

Colour: the hero uses only `--color-cotton`, `--color-noir`, `--color-ink`,
`--color-gray`, `--color-hairline` and `--color-accent` (cherry, for the 24px
label rule). The scarlet in the footage never leaves the video frame. No
gradients were added to the hero; no glassmorphism, emoji, decorative shadows or
blanket scroll-fades anywhere.

The heading sits in the gap between the two cards, which is wide and empty by
construction — deliberately, rather than centred over a figure. The left 45%
stays the quiet copy column across the whole journey sequence.

### D.2 — Before / After

| Rule | Before | After |
|---|---|---|
| Blur to mask an imperfect crossfade | straight opacity swap | `blur(2px)` bridge in, `blur(0)` out at both ends, well under the 20px Safari ceiling |
| Never animate from `scale(0)` | — | cards travel from a measured scale ≈0.93, never from 0 |
| `transform` and `opacity` only | — | audited: no width/height/top/left animated anywhere in the hero |
| Never `transition: all` | — | zero occurrences in either touched component |
| Never `ease-in` on anything entering | — | the only `power2.in` uses are the beat exit and the veil close, both departures |
| Stagger 30–80 ms | — | `MOTION.stagger` (0.07) on both build-in groups |
| Asymmetric enter/exit | beat in 3 / out 3 | in 3 / out 2 |
| Easing vocabulary | — | `MOTION.ease` and `MOTION.easeInOut` only; **no** Emil cubic-beziers introduced |
| Duration tables, frequency table, button/tooltip/popover/gesture rules | — | **not applied** — out of scope per §6.2; a scrub has no duration |

### Legibility fix — the plate grade

Room 03 settles on a table of three lit website panels, the leftmost directly
under the heading. The incumbent `.plate::after` grade — already documented as
existing "so type always has contrast, even if a take drifts brighter than its
reference" — was tuned for takes whose left third was near-black.

Measured behind the copy column at that beat, with the copy hidden:

| | brightest plate pixel | cotton contrast |
|---|---:|---:|
| Before | luma 109 | **4.35:1** — under the 4.5:1 floor |
| After | luma 56 | **9.85:1** (median 16.3:1) |

The existing device was re-tuned rather than a new one added, so the no-gradient
rule is not touched: this gradient is part of the incumbent composition.

---

## 6. Phase E — verification (§7)

`npm run build` clean. `npm run lint` clean across every file this run touched
(`npx eslint components/sections/about-v3/ content/about-v3.ts` → 0 problems).
`npx tsc --noEmit` clean.

> Repo-wide `npm run lint` reports 1046 errors, **all pre-existing** and all in
> generated `.next-build` / `.next-guide` / `.next-live` output directories plus
> one stray root file. ESLint is scanning build output — a pre-existing config
> gap, untouched here.

Harness added: `scripts/verify-about-v3-hero.mjs`, matching the repo's existing
`verify-hero.mjs` / `verify-guide.mjs` convention. It drives scroll to exact
progress values and runs the gates below at any viewport / reduced-motion combo.
No dependency was introduced — Playwright was already a devDependency.

> **Mistake made and corrected during this run:** the harness was first written
> as `scripts/verify-about-v3.mjs`, which overwrote the existing 277-line
> behavioural QA script of that name. The original was restored from HEAD
> untouched and the new harness renamed. The two are complementary: the
> incumbent covers behaviour (focus order, tap targets, on-demand media), this
> one covers driven scroll state.
>
> Separately: the incumbent `verify-about-v3.mjs` checks "the founder transition
> completes and can be skipped" and "the handoff control changes accessible
> state". Both target UI removed in §7 below, so those checks now have nothing
> to bind to and need updating. Listed as a follow-up.

| # | Gate | Result |
|---|---|---|
| 1 | Forward and reverse scrub, both sections | **Pass** — no errors in either direction |
| 2 | Motion continuity | **See note below** |
| 3 | Hero registration at 0.30 | **Pass** — film fully dissolved by 0.28; verified in register at 0.15, where the masked cards sit exactly on the film's figures |
| 4 | Resize / orientation mid-sequence | **Pass** — 1440×900 → 1024×1400 → back, survived in all three contexts |
| 5 | `prefers-reduced-motion: reduce` | **Pass** — 0 hero `<video>` elements in the DOM and **0 media requests** on the whole page |
| 6 | Memory across full cycles | **Pass** — desktop 86→91→86 MB, mobile 89→89→88, reduced 84→84→84. No growth |
| 7 | No 404s | **Pass** — 0 responses ≥400; all 25 content paths resolve |
| 8 | Slow-motion crossfade pass | **Partial** — see §4.6 note above |

Console errors during and after a full scroll cycle in both directions, at
1440×900, 390×844 and reduced motion: **zero**, including after the hover pass.

### Gate 2 — reported honestly, not as a pass

The literal criterion ("max/min frame-to-frame delta under ~2×") **fails** on all
three clips: consulting 24×, lab 4.9×, directions 949× when measured across each
clip's moving portion.

The criterion cannot be met by footage that deliberately eases in and settles —
`holdRatio` exists precisely because these takes stop moving before they end, and
a settled frame has a near-zero delta, which drives the ratio arbitrarily high.

What the gate exists to catch — the erratic first take that failed at 17× — is
absent. Bucketed delta profiles show smooth continuous ramps with no stall or
lurch in any clip: consulting ramps 0.7 → 6.2 → steady 1.7–3.0 → settle; lab
holds 1.5–6.4 throughout and is still moving at its last frame; directions
decelerates monotonically 4.7 → 0.04. Judgement: acceptable. Flagged rather than
silently passed.

### Gate 8 — partial

With `HERO_PORTRAITS` null the crossfade is absent from the timeline, so there is
nothing to step through frame by frame. The mechanism was verified with a
temporary stand-in (above): blur bridge in and out, mask outline identical in
both states, `transform-origin` correct. Whether the two fills read as *one
transformation* rather than two objects overlapping cannot be judged until real
photographs exist — that judgement is deferred with the portraits.

---

## 7. Changes requested mid-run

Both duplicate founder treatments were removed at the user's request once the
hero landed:

- **Section 01 `FounderOpening`** — the drawn placeholder stage. Unmounted and
  `FounderOpening.tsx` deleted.
- **Section 02 `FoundersSection`** — "Two disciplines. One standard." with the
  drawn portrait pair. Component and mount removed from `AboutV3Page.tsx`.
- `FounderSilhouette.tsx` (`FounderStage` + `FounderPortrait`) became entirely
  unreferenced and was deleted.
- The `founders` destructure was dropped; `opening.left` / `opening.right` are
  still read by the hero for the two card labels.

`/about-v3` is now: hero → journey sequence (03–06) → orchestration (07) →
delivery, proof, CTA. Verified: journey starts at exactly 2340px, the hero's
full height — no gap, no overlap.

`aboutV3.opening.thesis` and `.status`, and the whole `aboutV3.founders` object,
are now unused content. Left in place rather than deleted.

---

## 8. Definition of done (§9)

- [x] `npm run build` and lint clean
- [x] `/about-v3` renders hero → three-room sequence → rest of page unchanged
- [x] All three rooms scrub forward and backward on desktop; mobile and reduced
      motion show static plates with **no video fetched**
- [x] Hero plays once on load, scroll dissolves to cotton and builds the
      editorial layer; cards hold the noir fill, portraits pending
- [x] Zero console errors during and after a full scroll cycle, both directions
- [x] This run log

---

## 9. Follow-ups (not done here)

1. **Photographic portraits** — §10.1 stands. Set the two strings in
   `hero.portraits`; no component edit. Gate 8 completes when they land.
2. **A fabricated statistic is baked into the footage.** The wall board in
   `lab.mp4` and `directions.mp4` reads "YOUR WEBSITE FORMS TRUST … 46.1%".
   `CLAUDE.md` forbids invented metrics and §3.4 rule 1 forbids them in copy;
   this one is inside the video frame, where no copy rule reaches it and where
   §8 forbids re-encoding. It is legible at 1440×900. **Worth a human decision**
   — it cannot be fixed without regenerating or recropping the media.
3. **Dead content fields.** `arrival.media`, `analysis.media`, `programs.media`
   and `programs.items[].image` still describe and point at the retired ivory
   companion; `aboutV3.founders`, `opening.thesis` and `opening.status` are
   unused since section 01/02 were removed. `handoff-start.webp` and
   `handoff-end.webp` are now referenced by nothing.
4. **Mask edge quality** — §10.2 stands. Cards display at ~300 CSS px, inside the
   intended ~450px budget.
5. **`consulting.mp4` weight** — §10.3 stands, 6.97 MB at `-crf 19`.
6. **Repo-wide lint** scans `.next-*` build output; 1046 pre-existing errors are
   entirely from generated files.
7. **`scripts/verify-about-v3.mjs` is now partly stale.** Its founder-transition
   and handoff-control checks target components deleted in §7. They should be
   dropped or repointed at the hero; the rest of that script (reduced motion,
   focus order, 44px targets, on-demand recovery video) is still valid.
