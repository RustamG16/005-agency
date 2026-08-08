# MEDIA-BRIEF-R6

Every media asset touched or audited in R6. Rows are marked **GENERATED** (made
this run, verified against the house look and the hard rules, wired in) or
**PENDING** (not made — reason stated).

Balance check before generating: 932 credits, Plus plan. **Hard cap for this
run: 80 Higgsfield credits** (user instruction). Actual spend: **56 credits**
(2 videos × 25 + 3 stills × 2). No retries were needed.

**Model substitution, stated up front:** the R6 plan (§3) targets Seedance 2.5.
At spec length (≤15s, 720p) a single Seedance 2.5 clip costs **78 credits**
(confirmed via `get_cost`) — one video alone would have exhausted the budget.
Substituted **Seedance 2.0 Mini** (720p, no native audio) for both videos: same
house-look prompt grammar, ~2.5 credits/s vs ~6.5 credits/s. Both clips still
meet every other spec constraint (≤15s, 720p, single continuous camera motive,
no cuts). This is a cost substitution, not a quality compromise accepted
silently — reviewed frame-by-frame below.

House look enforced in every prompt: monochrome/desaturated warm-neutral grade
sitting on noir `#1B1717` and cotton `#EDEBDD`; architectural, editorial,
unhurried; single named light source per shot; no lens flare, no neon, no
colour cast fighting cherry `#810100`; no text, no logos, no readable signage,
no recognisable faces of real public figures; no gradients or glassmorphism.

---

## 1. `/works` hero film — GENERATED

| | |
|---|---|
| Filename | `works-hero.mp4` |
| Destination | `public/media/works-hero.mp4` |
| Poster | `public/images/poster-works-hero.jpg` |
| Model | Seedance 2.0 Mini |
| Settings | 10s, 720p, 3:4 native → center-cropped to 4:5 (960×1200) in the encode, no audio |
| Cost | 25 credits |

**Frame prompt (i2v not used — pure t2v):**
> SUBJECT: a dark rectangular architectural aperture cut into a deep charcoal
> wall, framing a long minimalist interior gallery corridor beyond it.
> ENVIRONMENT: bare polished concrete floor with soft reflections, walls in
> warm desaturated near-black, corridor leads to one deep recess at the far
> end. CAMERA: slow continuous forward dolly push, single straight axis,
> constant speed, no pan, no tilt, no handheld shake, ending closer to the
> recess. LIGHT: one soft warm-neutral source glowing from the far recess,
> gentle falloff, no other light sources, no lens flare. STYLE: architectural,
> editorial, unhurried, monochrome desaturated warm-neutral grade, subtle film
> grain.

**Negative:** no people, no text, no logos, no signage, no lens flare, no
neon, no colour cast, no gradients, no glassmorphism, no motion blur, no
camera shake.

**Encode:**
```bash
ffmpeg -i works-hero-raw.mp4 -an -vf "crop=834:1042:0:35,scale=960:1200:flags=lanczos" \
  -c:v libx264 -crf 19 -pix_fmt yuv420p -movflags +faststart public/media/works-hero.mp4
ffmpeg -i public/media/works-hero.mp4 -frames:v 1 -q:v 2 public/images/poster-works-hero.jpg
```
Normal encode (plays once on scroll into view, loops — matches the retired
`columns.mp4`'s behaviour) — this clip is never scrubbed, so no `-g 4`.

**Review:** matches the brief precisely — a framed dark aperture, moving, one
soft source, deep recess. One finding: a faint wall-mounted plaque with
illegible smudge-line "text" (not actual letterforms) is visible in the first
~1.5s on the left wall, gone by frame at t=2s as the push-in clears it. Checked
at 4× crop — no readable characters, just density lines simulating a label.
Judged compliant with "no readable signage" (nothing is readable) but noted
here rather than silently passed. If flagged in review, the fix is a 1.5s trim
from the head of the source before crop, which loses nothing — the interesting
motion is entirely in the back 8.5s.

Replaces `/media/columns.mp4` (7.36 MB) and `/images/poster-columns.jpg`,
both deleted — zero remaining source references confirmed by repo-wide grep.

---

## 2. Principles stills (three) — GENERATED

| | |
|---|---|
| Destination | `public/images/principles/01.jpg`, `02.jpg`, `03.jpg` |
| Model | `nano_banana_2` (server-resolved from requested `nano_banana_pro`) |
| Settings | 16:9, 1k resolution (model default), still image |
| Cost | 2 credits each, 6 total |
| Wired in | `components/sections/home/Principles.tsx` — `next/image` inside `.plate`, exactly the change the prior docblock predicted. Empty-plate fallback (noir background) stays in CSS for any missing file. |

### 01 — Strategy before style.
> SUBJECT: a blank sheet of bone-white paper on a dark wooden desk with a
> single ruled pencil line drawn across it, a plain metal ruler resting
> beside it. ENVIRONMENT: small studio desk, nothing else on the surface, warm
> desaturated near-black background. CAMERA: static angled-overhead
> composition. LIGHT: one raking source from a single side window, warm
> neutral, long soft shadow. STYLE: architectural, editorial, unhurried,
> monochrome desaturated warm-neutral grade, subtle 35mm film grain.

### 02 — Systems, not one-offs.
> SUBJECT: a precise grid of nine identical dark ceramic vessels, each with a
> subtle variation in form, arranged in three even rows. ENVIRONMENT: neutral
> matte tabletop, warm desaturated near-black background, nothing else in
> frame. CAMERA: straight-on static composition, centered, frontal. LIGHT: one
> soft overhead source, even falloff across the whole grid. STYLE:
> architectural, editorial, unhurried, monochrome desaturated warm-neutral
> grade, subtle 35mm film grain.

### 03 — Direct access.
> SUBJECT: two people seated close together at a small table, reviewing a
> printed layout sheet between them, hands and shoulders visible, heads turned
> down toward the work rather than toward the camera, no eye contact with the
> camera. ENVIRONMENT: small quiet studio room, warm desaturated tones, one
> window, nothing branded on the table. CAMERA: static medium composition,
> slightly off to the side. LIGHT: one soft window source from the side, warm
> neutral. STYLE: architectural, editorial, unhurried, monochrome desaturated
> warm-neutral grade, subtle 35mm film grain.

**Negative (all three):** no text, no logos, no readable signage, no
gradients, no glassmorphism, no neon, no lens flare; (03 additionally) no eye
contact with camera, no close-up recognisable faces.

**Encode:** resized to 1600px wide, quality 3 JPEG, no other processing — the
raw grade already sat in the noir/cotton register, confirmed against the
`.plate` aspect measured in `Principles.module.css` (3:2 mobile, 16:9 from
900px; `object-fit: cover` on the `<img>` handles both from one 16:9 source).

**Review:** all three land cleanly. 03 shows two generated people's faces —
these are fictional, generated illustrations of "how we work," not a claim
about Convenium's actual staff (who appear, named, on `/about` via
`/images/team/marija.jpg` and `rustam.jpg`). Not a violation of "don't
fabricate staff" — nothing here is presented as Marija or Rustam or any real
person.

---

## 3. Process film — GENERATED

| | |
|---|---|
| Destination (scrub master) | `public/media/process/process-scrub.mp4` |
| Poster | `public/images/process/poster.jpg` |
| Beat stills (4) | `public/images/process/still-{0.00,0.20,0.50,0.80}.jpg` |
| Model | Seedance 2.0 Mini |
| Settings | 10s, 720p, 16:9, no audio |
| Cost | 25 credits |

**Frame prompt:**
> SUBJECT: two people's hands and forearms working together over a physical
> object on a shared table — one hand adjusting a printed layout sheet, the
> other holding a small material sample — faces and heads entirely out of
> frame. ENVIRONMENT: a small quiet studio work room, one shared wooden table,
> a monitor softly out of focus in the background showing an abstract grid
> form, warm desaturated neutral tones throughout. CAMERA: slow continuous
> push toward the table, single straight axis, constant speed, no pan, no
> tilt, no handheld shake. LIGHT: one soft directional source from a side
> window, warm neutral tone, gentle soft shadows. STYLE: architectural,
> editorial, unhurried, monochrome desaturated warm-neutral grade, subtle film
> grain.

**Negative:** no faces, no heads, no text, no logos, no readable screen
content, no third person, no lens flare, no neon, no gradients, no
glassmorphism, no motion blur.

**Note on submission:** this prompt was first intercepted by the platform's
own preset recommendation ("IN THE DARK") rather than submitted — declined via
`declined_preset_id` on resubmit so the authored prompt, not the suggested
preset, is what generated.

**Review — the one real finding of this phase.** The raw generation matched
the brief for subject and composition (two people's hands, one object, one
room, an abstract wireframe visible on the monitor — never readable text) but
rendered **significantly warmer and brighter** than the house grade: daylight
through windows, tan wood, far outside the noir/cotton neutral register every
other asset on the site sits in. Not shipped as generated. Corrected with a
grade pass baked into the same encode that produces the tight-GOP scrub
master:

```bash
GRADE="eq=saturation=0.55:contrast=1.08:brightness=-0.02,\
colorbalance=rs=-0.06:gs=0.00:bs=0.10:rm=-0.05:gm=0.00:bm=0.08:rh=-0.03:gh=0.00:bh=0.06"

ffmpeg -i process-raw.mp4 -an -vf "$GRADE" \
  -c:v libx264 -g 4 -keyint_min 4 -sc_threshold 0 -crf 19 -pix_fmt yuv420p \
  -movflags +faststart public/media/process/process-scrub.mp4

ffmpeg -i public/media/process/process-scrub.mp4 -frames:v 1 -q:v 2 \
  public/images/process/poster.jpg

# four beat-boundary stills for the manifest's "stills" tier — same beat
# fractions Phase 4 uses for the timeline (Brief .00 / Make .20 / Test .50 /
# Handover .80 of the 10.04s clip):
for P in 0.00 0.20 0.50 0.80; do
  T=$(awk "BEGIN{printf \"%.3f\", $P*10.0417}")
  ffmpeg -ss $T -i public/media/process/process-scrub.mp4 -frames:v 1 -q:v 3 \
    "public/images/process/still-$P.jpg"
done
```

Result verified: 4.84 MB, 60 keyframes over 241 frames (confirms `-g 4` at
24fps), matches the `-g 4` contract every other scrub master on the site uses.
This encode is **tight-GOP** because Phase 4 (`AboutChapters`-pattern rebuild
of "Inside the process") scrubs it; it is a different contract from the
`/works` hero film above, which plays once and is a normal encode.

---

## 4. Site-wide media gap audit (§3.4)

Beyond the three assets above, every media reference in the app was grepped
and checked against disk:

| Path | Status |
|---|---|
| `/images/about/manifest.json` | `{"available": []}` — **intentional**, not a gap. The comment in the file is explicit: the monolith is canvas-drawn and complete with zero images; this is a working default, not a placeholder. No action. |
| `/images/team/marija.jpg`, `rustam.jpg` | Present on disk, referenced correctly from `AboutChapters.tsx`. Not a gap. |
| `/images/still-columns-{05,15,25,45,65}.jpg` | Present, referenced from `content/services.ts` and `ContactInfo.tsx`. Not a gap. |
| `/images/still-team-{05,25,55,65}.jpg` | Present, referenced from `content/services.ts` and `ProjectFit.tsx`. Not a gap. |
| `Principles.tsx` three plates | Was a gap — **filled**, see §2 above. |
| `/works` hero | Was a generic placeholder (`columns.mp4`, unrelated project-gallery footage repurposed as the hero) — **replaced**, see §1 above. |

**Orphaned files found (not missing media — the opposite: unused media),
flagged for `AUDIT-R6.md` rather than deleted in this pass** since deletion
wasn't in scope for a media-generation phase and each deserved a reference
check first:

| File | Repo-wide reference check |
|---|---|
| `public/images/poster-hero-start.jpg` | Zero references in live source. Referenced only in `archive/`, `_unused/`, and `qa/` historical docs. |
| `public/images/poster-hero-end.jpg` | Same — zero live references. |
| `public/images/gallery_final.jpg` | Same — zero live references. |
| `public/images/works_plate.jpg` | Same — zero live references. Was the R5 "centered masterpiece" concept's canonical still (`MEDIA-GUIDE-R5.md`); that concept was superseded before this run. |
| `public/media/team.mp4`, `public/images/poster-team.jpg` | **Will become orphaned by Phase 4** (this run rebuilds `ProcessFilm.tsx` onto `public/media/process/process-scrub.mp4`). Not deleted here — Phase 4 removes them once the new section is verified working, so there is never a moment where a route references a file that doesn't exist. |

Recommend all five for deletion in the P1/P2 backlog of `AUDIT-R6.md`, not
here — a media brief is the wrong place to make a deletion call on files this
brief didn't touch.

---

## Budget summary

| Item | Credits |
|---|---|
| `/works` hero video (Seedance 2.0 Mini, 10s) | 25 |
| Process film video (Seedance 2.0 Mini, 10s) | 25 |
| 3 Principles stills (nano_banana_2, 1k) | 6 |
| **Total spent** | **56** |
| Cap | 80 |
| Headroom (unused, left for manual generation per user instruction) | 24 |
