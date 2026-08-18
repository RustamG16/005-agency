# /about-v3 — hero banner + WhatWeDo scroll sequence

**Single automated run.** Everything needed is in this folder. Do not stop to ask
questions; every decision below is already made. Where something is genuinely
unavailable, the fallback is specified — take the fallback and note it in the run
log rather than pausing.

Repo root: `C:\Users\Rustam Gurbanov\Desktop\DigitalAgency_Saas\lab\005-agency`
Route: `/about-v3` · dev server `http://localhost:3000/about-v3`

---

## 0. RUN THIS

```
Read .olympus/about-v3/media/whatwedo/implementation_aboutUs/IMPLEMENTATION-PLAN.md
and execute it end to end. Follow §1 preflight first. Do not ask questions —
take the specified fallback for anything blocked and record it in the run log.
```

---

## 1. Preflight — abort conditions

Verify before writing any code. If any **ABORT** line fails, stop and report; do
not attempt a workaround.

| Check | Expected | On failure |
|---|---|---|
| `public/media/journey/{consulting,lab,directions}.mp4` exist | 7.0 / 4.3 / 2.6 MB | **ABORT** |
| Each journey clip's GOP | ~4 (see §1.1) | **ABORT** — media is not scrubbable |
| `public/media/hero/about-hero.mp4` + `-m.mp4` exist | 4.7 MB / 988 KB | **ABORT** |
| `public/images/hero/{mask-a,mask-b,silhouette-a,silhouette-b}.png` | 900×1200 | **ABORT** |
| `public/images/hero/about-hero-last.webp` + `-mobile` | present | **ABORT** |
| `public/images/about-v3/{consulting,lab,directions}.webp` + `-mobile` | present | **ABORT** |
| `public/images/hero/portrait-a.webp`, `portrait-b.webp` | **absent — expected** | Use §4.6 fallback |
| `npm run build` on a clean checkout | passes | **ABORT** — fix baseline first |

### 1.1 GOP verification

```bash
for f in public/media/journey/*.mp4; do
  n=$(ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$f")
  k=$(ffprobe -v error -select_streams v:0 -skip_frame nokey -show_entries frame=pts_time -of csv=p=0 "$f" | grep -c .)
  echo "$(basename $f) frames=$n keyframes=$k GOP=$(python -c "print(round($n/$k,1))")"
done
```

All three must print `GOP=4.0`. A GOP above ~8 means seeking decodes too many
frames and the scrub will stutter regardless of how the JS is written.

### 1.2 Install `impeccable` as a project skill — do this first

The skill could not be written to `.claude/` remotely (that path is protected
against remote tools), so the run installs it locally as its first action:

```bash
mkdir -p .claude/skills/impeccable
cp ".olympus/about-v3/media/whatwedo/implementation_aboutUs/skills/impeccable.md" \
   ".claude/skills/impeccable/SKILL.md"
```

The file already carries valid frontmatter (`name: impeccable`), so Claude Code
discovers it alongside the `frontend-design` and `three-guide` skills already in
that folder. It also carries the ADAPTER NOTE header explaining that
`scripts/context.mjs` and `reference/*.md` are not bundled and what to read
instead — **do not strip that header when copying.**

If the copy fails for any reason, this is **not** an abort: read
`skills/impeccable.md` directly from this folder in Phase D instead. The skill
works either way; installing it only makes it auto-discoverable.

---

## 2. Skills — load these, in this order

All are in `./skills/`. Load each **at the point it is needed**, not upfront.

| Phase | Skill | Why |
|---|---|---|
| 3, 4 | `gsap-core.md` | `gsap.matchMedia()`, easing, `defaults`, reduced-motion contexts |
| 3, 4 | `gsap-scrolltrigger.md` | `scrub`, sticky/pin behaviour, `invalidateOnRefresh`, `refresh()` ordering |
| 4 | `gsap-timeline.md` | The hero's overlapping beats are one timeline with position parameters, not four triggers |
| 3, 4 | `gsap-react.md` | `useGSAP` scoping and cleanup under React 19 / Next 15 — **the folder was missing this; it is the one that prevents leaked triggers on route change** |
| D | `impeccable.md` | Art direction and **the stop rule**. Read its ADAPTER NOTE header first — `scripts/context.mjs` and `reference/*.md` are not bundled; substitutes are listed there |
| D.2 | `emil-design-eng.md` | Motion feel only. **Read its SCOPE NOTE header first** — half the file is component-level and does not transfer to a scrub |
| E | `gsap-performance.md` | Transform discipline, jank, the four-`<video>` memory question |

`ai-video-director.md` and `higgsfield-character-sheet.md` are **not** used in
this run — media is already produced.

### Repo documents that outrank taste

Read before Phase 3: `CLAUDE.md` (hard rules), `DESIGN.md` (tokens),
`styles/tokens.css`, `PRODUCT.md`.

`CLAUDE.md` rules that bind this run absolutely:

- Colours from tokens only. Cotton `#EDEBDD`, paper `#F5F3E8`, noir `#1B1717`,
  ink `#241F1F`, cherry `#810100`. The scarlet in the footage is **not** a token
  colour — it lives inside the video frame only and must never leak into layout.
- Fonts via `next/font` only: Archivo Black / Newsreader / Inter.
- No gradients, glassmorphism, emoji icons, decorative shadows, blanket
  scroll-fade animations.
- Don't fabricate clients, testimonials, awards, staff, addresses, phone numbers,
  metrics or outcome claims.
- **Never spend Higgsfield credits or generate media in this run.**

---

## 3. Phase A — content model

### 3.1 Rename room 03

`journey.rooms.apollo` → `journey.rooms.directions` in `content/about-v3.ts`,
with matching updates in `components/sections/about-v3/JourneySequence.tsx` and
any `aria-labelledby` / element ids that reference it. Apollo leaves this
sequence entirely — it belongs to a later section.

### 3.2 Wire the media

Replace the three `video: null` fields:

```ts
consulting: { video: "/media/journey/consulting.mp4",
              poster: "/images/about-v3/consulting.webp",
              mobile: "/images/about-v3/consulting-mobile.webp", … }
lab:        { video: "/media/journey/lab.mp4",
              poster: "/images/about-v3/lab.webp",
              mobile: "/images/about-v3/lab-mobile.webp", … }
directions: { video: "/media/journey/directions.mp4",
              poster: "/images/about-v3/directions.webp",
              mobile: "/images/about-v3/directions-mobile.webp", … }
```

### 3.3 Media `alt` and `meta` — use verbatim

The current strings describe an ivory-and-brass companion device that appears
nowhere in this footage. Replace with:

```ts
consulting: {
  alt: "First-person view from a seated consultation chair in a dark room lit by vertical red light panels; a consultant sits opposite in a black swivel chair with an open notepad.",
  meta: ["Room 01", "Consulting", "Section 03"],
}
lab: {
  alt: "First-person view entering a dark strategy room where two consultants stand at a large illuminated wall board, studying a website analysis and talking to each other.",
  meta: ["Room 02", "Analysis", "Sections 04–05"],
}
directions: {
  alt: "First-person view looking down at a dark table where three framed website design directions lie side by side, equally lit.",
  meta: ["Room 03", "Directions", "Section 06"],
}
```

### 3.4 Prose rewrite — directive, not free rein

Rewrite the beat prose in `arrival`, `analysis`, `programs` and `intake` so it
describes what the footage shows. **Preserve every field name and shape** — only
string values change. Rules:

1. Describe what happens in the room. No metrics, no outcome claims, no named
   clients. This is the same rule the Selected Works copy runs under.
2. The three directions are **equally weighted and none is recommended.** Copy
   that ranks them contradicts the section's argument and the interaction.
3. Apollo is not named or explained anywhere in this sequence.
4. No physical-device language — nothing is repaired, opened, or carried.
5. Keep the existing voice and sentence rhythm. This is a re-skin of the words,
   not a new tone.

Beat spine to write against:

| Beat | Argument |
|---|---|
| `arrival` | You arrive with an idea and are listened to before anything is proposed |
| `analysis` | What you already have is read honestly, on one board, in the open |
| `programs` | Three genuinely different directions, none of them ranked |
| `intake` | The one you choose is what gets built |

---

## 4. Phase B — the hero banner

New component. Full-bleed, top of `/about-v3`, **above** `FounderOpening`.

Create:
- `components/sections/about-v3/AboutHero.tsx`
- `components/sections/about-v3/AboutHero.module.css`

Mount it as the first child inside `AboutV3Page.tsx`, before the existing
`<HeaderZone theme="light">` block.

### 4.1 The sequence

1. On load, `about-hero.mp4` autoplays once, `muted playsInline`, and holds its
   final frame. 8 s. No scroll involvement.
2. On scroll, everything except the two figures dissolves to cotton.
3. The figures resolve into two 3:4 half-body portrait cards.
4. Each silhouette fills with the photographic portrait.
5. Editorial elements build in around them.

### 4.2 Registration — one alpha mask, two fills

Do **not** try to align a generated portrait to a silhouette by eye. Each card is
one element with `mask-image: url(/images/hero/mask-a.png)`; inside it sit two
stacked fills — a flat `noir #1B1717` and the photographic portrait. The reveal
crossfades the fills *inside the same mask*, so the outline is identical in both
states by construction.

### 4.3 Layer stack

```
z0  cotton #EDEBDD                                (always)
z1  card A — mask-a.png — [ noir fill ⇄ portrait-a.webp ]
z1  card B — mask-b.png — [ noir fill ⇄ portrait-b.webp ]
z2  about-hero-last.webp                          (opacity 1 → 0)
z3  editorial layer                               (heading, index, rules, meta)
```

**The cards start at their exact measured position inside the still**, so while
z2 is opaque they are invisible; as z2 fades they are already in register, then
they travel to layout position. Measured from the 1920×1080 last frame:

| Card | left | top | width | height |
|---|---:|---:|---:|---:|
| A (Rustam, left) | 19.32% | 10.56% | 17.34% | 41.20% |
| B (Marija, right) | 63.54% | 11.57% | 17.14% | 40.65% |

### 4.4 Scroll choreography

Sticky bed — `position: sticky; top: 0; height: 100svh; margin-bottom: -100svh` —
**never `pin: true`**. This matches `ProcessFilm.tsx` and `MonolithScene.module.css`
and is the reason a dead pin is structurally impossible here. Scroll length
`~260vh`. One `ScrollTrigger`, `scrub: 0.4`, `invalidateOnRefresh: true`, driving
one GSAP timeline (see `gsap-timeline.md`).

| Progress | Beat |
|---|---|
| 0.00 – 0.30 | Still fades out; cotton arrives behind it |
| 0.20 – 0.50 | Cards travel from in-frame position to layout position |
| 0.45 – 0.70 | Fill crossfade: noir silhouette → photographic portrait |
| 0.60 – 1.00 | Editorial elements build in |

Overlaps are deliberate. A gap between beats becomes a stretch of scroll where
nothing moves.

**Motion values — use the repo's vocabulary, not new ones.**

| Decision | Value | Source |
|---|---|---|
| Easing, anything arriving | `MOTION.ease` (`expo.out`) / `--ease-out-sharp` | `motion.ts`, `tokens.css` |
| Easing, the card travel (on-screen movement) | `MOTION.easeInOut` (`power2.inOut`) | `motion.ts` — "scrubbed / two-way motion, where an out-only curve reads wrong in reverse" |
| Stagger, editorial build-in | `MOTION.stagger` (0.07 = 70 ms) | `motion.ts`; inside Emil's 30–80 ms band |
| Animated properties | **transform and opacity only** | `gsap-performance.md`, `emil-design-eng.md` |
| Never | `ease-in` on anything entering; `transition: all`; animating from `scale(0)` | `emil-design-eng.md` |

**The crossfade at 0.45–0.70 is the one to get right.** A straight opacity
crossfade between the noir fill and the photograph will read as two distinct
objects overlapping, because that is exactly what it is. Apply Emil's fix: add
`filter: blur(2px)` on both fills through the middle of the transition, easing
back to `blur(0)` at each end. Blur bridges the gap so the eye reads one
transformation instead of a swap. Keep it under 20px — heavy blur is expensive
in Safari.

### 4.5 Degradation

- **Mobile / reduced motion** (`MQ.mobileMotion`, `MQ.reduced`): no video, no
  sticky bed, no scrub. `about-hero-last-mobile.webp` as a static plate, cards in
  their final state. Same rule `ProcessFilm` and `Hero` follow — **with one
  refinement**: reduced motion means *fewer and gentler* animations, not zero.
  Keep the opacity and colour transitions that aid comprehension; remove only
  movement and position animation. So the editorial layer still fades in; it just
  does not travel.
- **No JS**: still renders, copy renders. The markup is a plain `<section>`.
- Use `gsap.matchMedia()` for all three contexts. Never a bare `window.innerWidth`.

### 4.6 Portraits — fallback is the expected path this run

`portrait-a.webp` and `portrait-b.webp` **do not exist and must not be generated
in this run** (credit spend requires explicit human approval per `CLAUDE.md`).

Build the crossfade so the photographic layer reads its src from one place and
degrades exactly like the project's own `video: null` pattern:

```ts
const HERO_PORTRAITS = {
  a: null as string | null,   // "/images/hero/portrait-a.webp"
  b: null as string | null,   // "/images/hero/portrait-b.webp"
};
```

When `null`, the card holds the noir silhouette fill and beat 0.45–0.70 becomes a
no-op — the section is complete and shippable, exactly as `journey.rooms` was
before its takes landed. Dropping the two files in and setting these strings is
then the entire change; no component edit.

---

## 5. Phase C — re-pace `JourneySequence`

### 5.1 `holdRatio`

The existing values (3.5/8, 4.5/8, 3.5/8) were authored against 8-second takes
with an orbital move. The new clips are 12 s / 8 s / 4 s, are continuous forward
moves, and settle at the end rather than orbiting.

| Room | Clip | Motion ends | `holdRatio` |
|---|---:|---:|---:|
| consulting | 12 s | 11 s | **0.92** |
| lab | 8 s | 8 s | **1.00** |
| directions | 4 s | 3 s | **0.75** |

Keep `UNIT_VH = 0.055`. Re-weight beat `hold` lengths proportionally to clip
length — room 01 carries 12 s of footage and must get proportionally more scroll
than room 03's 4 s. Currently they are weighted for three equal takes.

### 5.2 The veil

`[data-journey-veil]` was written for "orbital transitions, darkness as the cut".
These clips do not orbit and do not end in darkness. Keep the element; change its
timing:

- **01 → 02** is a real location change. Full veil.
- **02 → 03** is **contiguous frames of the same take.** Give it a much shorter
  veil, or none. A full cut here inserts a break the footage does not have.

### 5.3 Do not touch

`createSeeker()` and `arm()` are already written for tight-GOP media. Leave them
alone unless verification in §6 fails.

---

## 6. Phase D — design pass

Load `skills/impeccable.md`, starting with its ADAPTER NOTE header.

Scope: the new hero and the re-paced sequence only. **Do not redesign the rest of
`/about-v3`** — this is refinement, not replacement, so the incumbent identity,
copy and everything out of scope is preserved.

Specific items:

- The moment cotton arrives, the palette must hand back to tokens cleanly. No
  scarlet outside the video frame and no red-tinted cotton.
- The left 45% stays the quiet copy column across the whole sequence — this is
  `JourneySequence`'s own rule 2 and the plates were art-directed for it.
- The gap between the two hero cards is wide and empty by construction. It is the
  natural home for the heading; use it deliberately rather than centring type
  over a figure.
- Respect impeccable's bounded-verify rule: build fully, inspect once in a
  batched desktop+mobile round, fix in one batch, confirm with at most one more
  round, then **stop**.

### 6.2 Phase D.2 — motion feel

Load `skills/emil-design-eng.md`, **starting with its SCOPE NOTE header.**

`impeccable` owns direction and, critically, the stop rule — it is the only one
of the two with an explicit termination condition, and this run is unattended.
`emil-design-eng` owns nothing but how the motion feels. It does not get to
redesign anything.

**In scope for D.2 — apply all of these:**

| Rule | Where it bites here |
|---|---|
| Blur to mask an imperfect crossfade | The noir → photograph fill swap (§4.4) |
| Never animate from `scale(0)` | Any card or element entrance — start at `0.95` + opacity |
| `transform` and `opacity` only | Everything; four `<video>` elements share this route |
| Never `transition: all` | Name every property |
| Never `ease-in` on anything entering | Nothing arrives on an in-curve |
| Stagger 30–80 ms | The editorial build-in — repo's `MOTION.stagger` is 0.07, already inside the band |
| Asymmetric enter/exit | Exits faster than entrances |
| `clip-path: inset()` reveals | An alternative to opacity for the cotton wipe if the crossfade fights |
| CSS beats JS under main-thread load | The scrub competes with video decode; prefer CSS-driven where the motion is predetermined |
| Slow-motion and frame-by-frame inspection | Phase E |
| The Before/After review table | Report D.2 findings in that format |

**Out of scope — do NOT apply:**

The duration tables (`<300ms`, "modals 200–500ms" and so on). **A scrub has no
duration — scroll position is the clock**, so a millisecond budget is
meaningless here and applying it will make someone shorten a scroll distance for
the wrong reason. Also out: the frequency table, button `:active` scale,
tooltip delays, popover `transform-origin`, keyboard-action rules, drag and
gesture momentum, pointer capture, and the Sonner component-library principles.
None of them describe a page-level cinematic sequence.

**Easing conflict — this is a guardrail, not a preference.** Do not adopt Emil's
literal curve values (`cubic-bezier(0.23, 1, 0.32, 1)` etc.). `motion.ts` exists
so that "a visitor scrolling the page reads ONE motion language, not six sections
each with their own idea of how fast an entrance is." `--ease-out-sharp` and
`MOTION.ease` already satisfy Emil's *principle* — custom curve, never a weak
built-in, never `ease-in`. Adding a second set of curves breaks the thing the
file was written to protect.

---

## 7. Phase E — verification

Per `CLAUDE.md`, every phase: `npm run build` clean → Playwright full-page
screenshots at **1440×900** and **390×844** → compare → console error check
**including after scroll and hover** → then mark done.

```bash
npm run build && npm run lint
npm run screenshot          # existing harness, scripts/screenshot.mjs
```

Sequence-specific gates — all must pass:

1. **Forward and reverse scrub** on both sections. Reverse is where seeking
   breaks first.
2. **Motion continuity.** Sample each clip's frame-to-frame delta; max/min under
   ~2×. This was the acceptance test through media production and the raw
   footage's first take failed it at 17×.
3. **Hero registration at progress 0.30** — no visible jump as the still hands
   off to the cards. Screenshot at 0.28 and 0.32 and diff.
4. **Resize and orientation change mid-sequence.** `invalidateOnRefresh: true`
   plus a debounced `ScrollTrigger.refresh()`.
5. **`prefers-reduced-motion: reduce`** on both sections — no video element
   instantiated at all, not merely hidden.
6. **Memory** across a full scroll cycle. Four `<video>` elements now live on one
   route; confirm no growth on repeat cycles and that triggers are killed on
   route change (`useGSAP` scope — see `gsap-react.md`).
7. **No 404s.** Every path in `content/about-v3.ts` resolves.
8. **Slow-motion pass.** Temporarily scale the hero timeline 3–5× (or use the
   DevTools Animations panel) and step the crossfade frame by frame. Check: do
   the two fills read as one transformation or as two objects overlapping; are
   opacity, transform and blur in sync; is `transform-origin` right on the cards.
   Timing faults in a crossfade are invisible at full speed and obvious at 4×.

---

## 8. Guardrails

Do not, in this run:

- Touch `/about`, `/about-v2`, the homepage, or any route other than `/about-v3`.
- Generate media, spend Higgsfield credits, or call any image or video API.
- Delete or overwrite anything in `public/media/` or `public/images/` that this
  plan did not create.
- Introduce a dependency. GSAP 3.15, `@gsap/react`, Lenis, Next 15, React 19 are
  already present and are the whole toolkit.
- Replace `DESIGN.md` or change design tokens.
- Use `pin: true`. The sticky bed is the site's pattern.
- Ship any readable text baked into an image — all typography is live HTML.

---

## 9. Definition of done

- `npm run build` and `npm run lint` clean.
- `/about-v3` renders the hero banner, then founders, then the three-room
  sequence, then the rest of the page unchanged.
- All three rooms scrub forward and backward on desktop; mobile and
  reduced-motion show static plates with no video fetched.
- Hero plays once on load, then scroll dissolves to cotton and builds the
  editorial layer. Cards hold the noir fill (portraits pending).
- Zero console errors during and after a full scroll cycle in both directions.
- A run log at `.olympus/about-v3/media/whatwedo/implementation_aboutUs/RUN-LOG.md`
  recording: fallbacks taken, `holdRatio` and veil values as shipped, copy
  rewritten, screenshots captured, and anything deviating from this plan.

---

## 10. Follow-up, explicitly out of scope here

1. **Photographic portraits.** Two images from the registered `Rustam` and
   `Marija` Elements, half body, 3:4, facing camera, arms low, matte black,
   plain background, even light. Background removed, then masked by
   `mask-a/b.png` — so pose only needs to be approximately right. Requires a
   fresh cost quote and human approval.
2. **Mask edge quality.** Cut-outs are upscaled from a 333 px-wide region of a
   1080p frame to 900×1200. Correct at the intended ~450 CSS px display size; if
   the cards are ever shown larger, trace the alpha to an SVG path.
3. **`consulting.mp4` weight.** 7.0 MB at `-crf 19`. `-crf 21` takes ~25% off if
   the budget needs it.
