# /about-v3 — hero banner + WhatWeDo scroll integration

Plan of record, 2026-08-18. Assets in this bundle are produced and verified.
No application code has been changed yet.

---

## 0. The headline finding

**Most of this already exists.** `components/sections/about-v3/JourneySequence.tsx`
is a purpose-built, pinned, video-scrubbed **three-room** sequence, and
`content/about-v3.ts` carries `video: null` on all three rooms with the comment:

> `video: null` means that take has not been delivered yet. The room falls back
> to its still … so the sequence is complete and shippable at every stage of
> media production rather than only at the end of it.

The machine was built waiting for exactly these files. The WhatWeDo work is
therefore **wiring and re-pacing, not building**. The hero banner is the only
genuinely new construction.

Established site patterns this plan follows rather than reinvents:

| Pattern | Where it is defined |
|---|---|
| Sticky bed (`position:sticky; height:100svh; margin-bottom:-100svh`), never a pin | `ProcessFilm.tsx`, `MonolithScene.module.css` |
| Two independent rhythms — one continuous scrub + per-beat once-only copy reveals | `ProcessFilm.tsx` |
| Manifest-driven degradation: scrub → stills → poster → bare | `public/media/process/manifest.json` |
| Desktop-motion only; mobile/reduced gets one static plate | `MQ.desktopMotion` in `motion.ts` |
| Scrub encode `-g 4 -keyint_min 4 -sc_threshold 0 -crf 19 -an` | `MEDIA-BRIEF-R6.md` |
| `ScrollTrigger.refresh()` after fonts + load | `components/motion/gsap.ts` |

Stack: Next 15.5 · React 19 · GSAP 3.15 + `@gsap/react` + SplitText · Lenis.

---

## 1. Two blocking problems in the delivered media — both now fixed

### 1.1 The clips were not scrubbable

| File | Frames | Keyframes | GOP |
|---|---:|---:|---:|
| `part1.mp4` (raw) | 289 | **2** | ~144 |
| `part2.mp4` (raw) | 288 | **2** | ~144 |
| hero (raw) | 192 | **2** | ~96 |

A GOP of ~144 means every scrub seek decodes up to 144 frames. That is
unusable. For comparison, the site's existing `hero_scrub.mp4` measures
**91 keyframes over 361 frames — GOP ~4**, matching the documented contract.

### 1.2 The clips were ~3× the site's weight budget

`part1.mp4` was 17.3 MB and `part2.mp4` 15.7 MB, both at ~11 Mbps for 720p.
Site precedent: `hero_scrub.mp4` 4.6 MB / 15 s, `process-scrub.mp4` 4.8 MB / 10 s.

### 1.3 Result after re-encoding to the project recipe

```
ffmpeg -i raw.mp4 -an \
  -c:v libx264 -g 4 -keyint_min 4 -sc_threshold 0 -crf 19 \
  -pix_fmt yuv420p -movflags +faststart out.mp4
```

| Output | Duration | Size | Keyframes | GOP |
|---|---:|---:|---:|---:|
| `consulting.mp4` | 12.04 s | 7.0 MB | 73 / 289 | **4.0** ✓ |
| `lab.mp4` | 8.00 s | 4.3 MB | 48 / 192 | **4.0** ✓ |
| `directions.mp4` | 4.00 s | 2.6 MB | 24 / 96 | **4.0** ✓ |

**33 MB → 13.9 MB**, all three seekable.

The hero is *never scrubbed* (it plays once), so it keeps a normal GOP — that is
what keeps it at 4.7 MB instead of ~9 MB. Audio stripped (`-an`); the raw hero
carried an AAC track.

> If 7.0 MB for `consulting.mp4` is over budget, `-crf 21` takes roughly 25% off.
> It was left at 19 to match every other scrub master on the site.

---

## 2. Room mapping

`part2.mp4` is split at **8.0 s**, which is where its own prompt puts the beat
change (0–4 s travel, 4–8 s the board, 8–12 s the table). Splitting there means
each room keeps one whole beat, and the existing one-video-per-room contract in
`Plate()` needs no surgery.

| Room | Source | Clip | Content |
|---|---|---|---|
| 01 `consulting` | `part1.mp4` whole | `consulting.mp4` (12 s) | Corridor → consultation room → seated with Marija |
| 02 `lab` | `part2.mp4` 0–8 s | `lab.mp4` (8 s) | Threshold → turn → strategy lab → the board |
| 03 `apollo` → rename `directions` | `part2.mp4` 8–12 s | `directions.mp4` (4 s) | Down onto the table, three directions |

Room 03's key, copy and `meta` currently describe an Apollo handoff. It becomes
the **three directions** room. See §5.

---

## 3. The hero banner

New full-bleed section at the very top of `/about-v3`, above `FounderOpening`.

### 3.1 The sequence

1. **On load** — `about-hero.mp4` autoplays once, muted, and holds its final
   frame. 8 s, no scroll involvement.
2. **On scroll** — everything except the two figures dissolves to cotton.
3. The two figures resolve into two **3:4 half-body portrait cards**.
4. Each silhouette **fills with the real photographic portrait**.
5. Editorial elements build in around them.

### 3.2 How the fill is registered

The naive approach — generate a portrait and try to line it up with the
silhouette — is fragile. Instead:

**One alpha mask, two fills.** The extracted silhouette becomes a CSS
`mask-image`. Underneath it sit two stacked layers: a flat `noir #1B1717` fill
and the photographic portrait. The reveal crossfades between the two fills
*inside the same mask*, so the outline is identical in both states by
construction. The generated portrait only has to be roughly the same pose and
framing; the mask guarantees the edge.

### 3.3 Layer stack

```
z0  cotton #EDEBDD                      (always)
z1  portrait card A  ── mask-a.png ── [ noir fill  ⇄  portrait-a.webp ]
z1  portrait card B  ── mask-b.png ── [ noir fill  ⇄  portrait-b.webp ]
z2  about-hero-last.webp                (opacity 1 → 0 on scroll)
z3  editorial layer                     (heading, index, rules, meta)
```

The trick that makes step 2 seamless: **the cards start at exactly their
position and scale inside the still**, so while `z2` is opaque they are
invisible. As `z2` fades, the cards are already in register; they then travel to
their layout positions.

Measured from the last frame (1920×1080), as percentages for the initial state:

| Card | left | top | width | height |
|---|---:|---:|---:|---:|
| A (Rustam) | 19.32% | 10.56% | 17.34% | 41.20% |
| B (Marija) | 63.54% | 11.57% | 17.14% | 40.65% |

### 3.4 Scroll choreography

Sticky bed, `~260vh` of scroll, single `ScrollTrigger` with `scrub: 0.4`.

| Progress | Beat |
|---|---|
| 0.00 – 0.30 | Still fades out; cotton arrives behind it |
| 0.20 – 0.50 | Cards travel from in-frame position to layout position |
| 0.45 – 0.70 | Fill crossfade: noir silhouette → photographic portrait |
| 0.60 – 1.00 | Editorial elements build in (SplitText lines, rules, index) |

Overlaps are deliberate — nothing waits for the previous beat to finish, so
there is no dead zone in the scrub.

### 3.5 Degradation

- **Mobile / reduced motion**: no video, no sticky bed. `about-hero-last-mobile.webp`
  as a static plate, portraits already in their photographic state, elements
  static. Same rule `ProcessFilm` and `Hero` already follow.
- **No JS**: the still renders, the copy renders. Markup is a plain section.

---

## 4. WhatWeDo — rewiring `JourneySequence`

### 4.1 `content/about-v3.ts`

Set the three `video` fields, currently `null`:

```ts
journey: {
  rooms: {
    consulting: { video: "/media/journey/consulting.mp4",
                  poster: "/images/about-v3/consulting.webp",
                  mobile: "/images/about-v3/consulting-mobile.webp", … },
    lab:        { video: "/media/journey/lab.mp4",
                  poster: "/images/about-v3/lab.webp",
                  mobile: "/images/about-v3/lab-mobile.webp", … },
    directions: { video: "/media/journey/directions.mp4",
                  poster: "/images/about-v3/directions.webp",
                  mobile: "/images/about-v3/directions-mobile.webp", … },
  },
}
```

`alt` text must be rewritten — the current strings describe an ivory-and-brass
companion device that appears nowhere in this footage.

### 4.2 Re-pace the `PLAN` array

`JourneySequence.tsx` carries `holdRatio` values authored against 8-second takes
(3.5/8, 4.5/8, 3.5/8) — "the second the orbit begins ÷ the clip length". The new
clips are 12 s / 8 s / 4 s and have no orbit; each is a continuous forward move
that settles at the end.

New ratios, taken from where each clip actually stops moving:

| Room | Clip | Motion ends | `holdRatio` |
|---|---:|---:|---:|
| consulting | 12 s | 11 s (camera settles, Marija writes) | **0.92** |
| lab | 8 s | 8 s (continuous throughout) | **1.00** |
| directions | 4 s | 3 s (settles on the tabletop) | **0.75** |

`UNIT_VH` stays at `0.055`. Beat `hold` lengths get re-weighted so room 01 —
12 seconds of footage — gets proportionally more scroll than room 03's 4.

### 4.3 The transition between rooms

The existing design uses "orbital transitions, darkness as the cut", driven by
`[data-journey-veil]`. Our clips do not orbit and do not end in darkness. The
veil stays but its job changes: a short cotton-to-noir wipe at each room
boundary, timed to the `holdRatio` handoff. **Rooms 02 and 03 are contiguous
frames of the same take**, so that boundary should get a much shorter veil than
01→02 — otherwise it inserts a cut where the footage has none.

### 4.4 Verify before trusting the scrub

`createSeeker()` in `JourneySequence.tsx` is already written for tight-GOP media.
Confirm on low-end hardware that scrubbing `consulting.mp4` (12 s, 289 frames)
holds — that is the longest clip on the site and the real pass mark.

---

## 5. Copy

Approved: rewrite to match the footage.

The current `journey`, `arrival`, `analysis`, `programs` and `intake` copy
describes repairing a physical companion device and handing it to Apollo, "a tall
marble-and-brass figure". The footage is a first-person client consultation about
a website. Every media `alt`, every `meta` triple and the beat prose need
rewriting.

Bound by the project's own rules: describe what is shown, no invented metrics,
no outcome claims. Room 03 is the **choice** beat — three directions, equally
weighted, none recommended — which is also the section's argument.

Draft copy will be delivered for approval before it lands in `content/about-v3.ts`.

---

## 6. Design pass

`impeccable` runs over the finished hero and sequence, against `DESIGN.md`:

- Colours from tokens only. Cotton `#EDEBDD`, noir `#1B1717`, cherry `#810100`.
  Note the footage is scarlet-red, which is **not** a token colour — it lives
  inside the video frame, and the moment the cotton arrives the palette must
  hand back to tokens cleanly rather than carrying red into the layout.
- Left 45% stays the quiet copy column throughout the sequence, per the existing
  `JourneySequence` rule 2.
- Type: Archivo Black / Newsreader / Inter via `next/font` only.
- No gradients, glassmorphism, decorative shadows or blanket scroll-fades.

---

## 7. Verification

Per `CLAUDE.md`, every phase: `npm run build` clean → Playwright full-page
screenshots at 1440×900 and 390×844 → console error check including after scroll
and hover → then mark done.

Sequence-specific:

- Forward **and reverse** scrub, both sections.
- Frame-to-frame motion ratio on each clip — the acceptance test used throughout
  media production was **max/min under ~2×**.
- Hero: card registration at progress 0.30 (no visible jump as the still hands
  off to the cards).
- Resize and orientation change mid-sequence; `invalidateOnRefresh: true`.
- `prefers-reduced-motion: reduce` on both sections.
- Memory growth over a full scroll cycle — four `<video>` elements now live on
  one route.

---

## 8. What is in this bundle

Commit to `public/`:

```
public/media/journey/consulting.mp4        7.0 MB   12.04s  GOP 4
public/media/journey/lab.mp4               4.3 MB    8.00s  GOP 4
public/media/journey/directions.mp4        2.6 MB    4.00s  GOP 4
public/media/hero/about-hero.mp4           4.7 MB    8.00s  linear, -an
public/media/hero/about-hero-m.mp4         988 KB    1280w
public/images/about-v3/consulting.webp      24 KB   + -mobile
public/images/about-v3/lab.webp             40 KB   + -mobile
public/images/about-v3/directions.webp      44 KB   + -mobile
public/images/hero/about-hero-last.webp     80 KB   + -mobile
public/images/hero/mask-a.png               28 KB   alpha mask, 900×1200
public/images/hero/mask-b.png               28 KB   alpha mask, 900×1200
public/images/hero/silhouette-a.png         44 KB   noir fill, 900×1200
public/images/hero/silhouette-b.png         44 KB   noir fill, 900×1200
```

**Total 20 MB.**

---

## 9. Open items

### 9.1 The photographic portraits — needs approval before spend

Not produced. Two images required, generated from the registered Higgsfield
Elements so identity matches the rest of the site:

- `portrait-a.webp` — Rustam, half body, 3:4, facing camera, arms low and
  clasped, matte-black suit and turtleneck, plain background, even light.
- `portrait-b.webp` — Marija, half body, 3:4, facing camera, hands low at her
  sides, fitted matte-black wrap blazer dress, plain background, even light.

Both get their background removed and are then masked by `mask-a/b.png`, so
pose only needs to be approximately right — the mask fixes the outline.

Per `CLAUDE.md`: **no credits spent without explicit approval and a fresh cost
quote.** Prompts and quote to be supplied for sign-off.

### 9.2 Mask edge quality

The cut-outs are upscaled from a 333 px-wide region of a 1080p frame to
900×1200. At the intended display size (~450 CSS px, 2× DPR) this is correct,
but if the cards are ever shown larger the edges will stair-step. Fix if needed:
trace the alpha to an SVG path and mask with that instead of a raster.

### 9.3 Room 03 rename

`journey.rooms.apollo` → `journey.rooms.directions`, with matching updates in
`JourneySequence.tsx` and any `aria-labelledby` ids. Apollo moves out of this
sequence entirely.
