# Media generation brief — /about monolith

Four optional media slots for the `/about` page's WebGL monolith. The page ships
complete without any of this — `public/images/about/manifest.json` gates every
slot, and an unlisted path costs zero requests and logs zero errors. Nothing here
is required; each slot only activates once its file exists **and** its manifest
line is added.

Tools: **Nano Banana** for the four still-image slots (six plates, cover,
two portraits), **Seedance 2.5** for the one video slot.

**Manifest lines below all carry a leading `/`.** The code (`monolith.ts`)
compares each path against the manifest's `available` array with an exact
`Set.has()` match — no leading slash, no match, and the slot silently stays on
its canvas-drawn fallback with no error to tell you why.

Colour tokens (from `DESIGN.md` — ignore any hex in `ABOUT-MONOLITH-SPEC.md`,
those are stale): noir `#1B1717`, cotton `#EDEBDD`, paper `#F5F3E8`,
ink `#241F1F`, hairline `#D6D2C2`, cherry `#810100`. Cherry is used freely in
the cover and portrait prompts below (§2b, §4) — no cap on it here. The six
fracture plates (§1) are a different subject — printed matter, unrelated to
the reference image — and stay monochrome; say the word if you want cherry
there too.

## Art direction — the "silhouette against light" reference

A reference image was supplied: dramatic red-lit team silhouettes on backlit
panels, reflective floor. Staging and colour both carry through — lone
figure(s), one hard directional light source, deep negative space, a dark
reflective plane underfoot, **cherry `#810100`** as the lit colour (the
project's actual red token, not a generic red). Ground stays noir `#1B1717`
/ ink `#241F1F`; cherry is the light source and glow, not a wash over
everything.

Two craft notes that apply to every prompt below:

- **Hex codes are for your grading pass, not the model.** Nano Banana can't
  reliably hit a literal `#810100` from text. Prompts describe colour in
  words the model can actually act on ("deep wine-red," "oxblood glow"); the
  hex stays in the doc as the target for the ffmpeg grade afterward.
- **Portrait-ratio frames (448:580, 3:4) default to centering the subject.**
  Every prompt that uses one says explicitly where the subject sits and how
  much empty ground surrounds them — that negative space is what makes the
  reference image read as dramatic rather than just dark.

---

## 1. Six fracture plates — real work, not invented mockups

**Path:** `public/images/about/plates/plate-01.jpg` … `plate-06.jpg`
**Spec:** 1024×1024 px · JPG · ≤250 KB each · square 1:1

Changed direction from the first draft: instead of six generic abstract
"printed matter" subjects, all six plates now come from **actual Convenium
work** — two real crops from the shipped Sonn'werk brand, two generated
plates grounded in the real Meridian project, two generated plates in
Convenium's own identity. This is what `MEDIA-BRIEF-ABOUT.md` recommended
from the start ("real crops from Convenium projects... beat anything
generated") — now actually done.

Every plate still ends up graded the same way regardless of source (real
photo or generated): fully desaturated, blacks toward ink `#241F1F`, paper
whites toward cotton `#EDEBDD`/paper `#F5F3E8`, no vignette, no red. That
grade is what makes six different sources read as one coherent set once
they're riding the exploded shards.

```bash
ffmpeg -i in.jpg -vf "crop='min(iw,ih)':'min(iw,ih)':X:Y,scale=1024:1024,format=gray,eq=contrast=1.06" -q:v 3 plate-01.jpg
```

(`X:Y` is the crop offset — set per plate below; omit for a centred crop.)

### Plate 01 & 02 — real Sonn'werk posters (crop, don't generate)

The two "SONNWERK" posters you shared are real, shipped brand work — exactly
the "your own work" case the brief called out as the best source. Save each
at full resolution, then:

- **Plate 01 ("Warum SONNWERK?"):** crop a square from the **top two-thirds**
  — the sunburst mark, "SONNWERK" wordmark, and "Warum SONNWERK?" headline.
  Leave out the bottom field-photo band; the plate should read as a graphic
  mark/wordmark, not a landscape photo. Roughly `crop='min(iw,ih*0.75)':ih*0.75:0:0`
  as a starting offset — adjust once you see your actual source dimensions.
- **Plate 02 ("Welches CBD-Öl passt zu dir?"):** crop a square centred on the
  **six-bottle product row**, including the headline just above it. This is
  the strongest "proof of graphic design work" element in that poster.

Both go through the same grade command above — the colour lineup (gold,
sage, olive, teal, terracotta, plum bottle labels) desaturates to a clean
tonal spread, which is genuinely more interesting on the plate than a flat
mono source would be.

### Plate 03 — Meridian, wordmark & coordinates (Nano Banana)

Grounded in the real Meridian site (`rustamg16.github.io/003-meridian-mvp`):
elegant serif wordmark, real elevation/coordinate line lifted directly from
the live site copy — not invented.

```
A single printed sheet lying flat on a plain seamless backdrop — an elegant
high-contrast serif wordmark "THE MERIDIAN" set large near the top, below it
one line of survey coordinates in a small condensed sans caption face:
"ELEV 1,450 M · N 46°11'24" · E 7°58'12"" — printed in near-black ink on
warm off-white paper. Shot straight down, even soft studio light, no
shadows falling across the sheet. Monochrome only — near-black ink on warm
off-white paper, square 1:1 frame, no hands, no people, no colour, no red,
no watermarks, premium and minimal editorial photography style.
```

### Plate 04 — Meridian, materials board (Nano Banana)

Grounded in the real suite copy: "warm oak," "raw stone," "circular
freestanding fireplace," lake-facing glazing.

```
A small flat-lay materials specification board on a plain seamless
backdrop — a raw stone fragment, a strip of oak wood grain, and a folded
paper swatch printed with a fine water-ripple texture, arranged in a neat
row with small printed captions beneath each reading "STONE", "OAK",
"WATER" in a condensed sans face. Shot straight down, even soft studio
light, no shadows falling across the objects. Monochrome only — near-black
ink on warm off-white paper, square 1:1 frame, no hands, no people, no
colour, no red, no watermarks, premium and minimal editorial photography
style.
```

### Plate 05 — Convenium, manifesto poster (Nano Banana)

Uses the studio's own established line from this exact page's copy.

```
A single printed poster lying flat on a plain seamless backdrop — large
bold display type reading "SMALL BY DESIGN" in a wide grotesk/brutalist
sans typeface, filling most of the sheet, printed in near-black ink on warm
off-white stock. Shot straight down, even soft studio light, no shadows
falling across the poster. Monochrome only — near-black ink on warm
off-white paper, square 1:1 frame, no hands, no people, no colour, no red,
no watermarks, premium and minimal editorial photography style.
```

### Plate 06 — Convenium, capability index (Nano Banana)

Uses the studio's real service list (Marija/Rustam's actual roles, per
`content/site.ts` and this page's own copy).

```
A single printed index card lying flat on a plain seamless backdrop — a
short numbered list in a condensed sans caption face: "01 STRATEGY",
"02 IDENTITY", "03 WEB & 3D", "04 CONTENT", each line separated by a thin
printed rule, near-black ink on warm off-white card stock. Shot straight
down, even soft studio light, no shadows falling across the card.
Monochrome only — near-black ink on warm off-white paper, square 1:1
frame, no hands, no people, no colour, no red, no watermarks, premium and
minimal editorial photography style.
```

### Manifest lines (add one per plate once placed)

```json
"/images/about/plates/plate-01.jpg"
"/images/about/plates/plate-02.jpg"
"/images/about/plates/plate-03.jpg"
"/images/about/plates/plate-04.jpg"
"/images/about/plates/plate-05.jpg"
"/images/about/plates/plate-06.jpg"
```

Leading slash matters: the code compares against `PLATE_SRC(i) = \`/images/about/plates/plate-0${i+1}.jpg\``
(`monolith.ts`) with a `Set.has()` exact-string match — no slash, no match, silent no-op.

---

## 2. Front cover (Nano Banana)

**Path:** `public/images/about/monolith-cover.jpg`
**Spec:** 896×1160 px (448:580 ratio = 0.772) · JPG · ≤400 KB

**Aspect ratio to generate at: 3:4 (0.75).** Of 16:9 / 4:3 / 1:1 / 3:4 / 9:16,
3:4 is the closest standard ratio to 448:580 — off by about 3%, close enough
that Nano Banana's native 3:4 output crops cleanly to the exact target with
no stretching. Generate at 3:4, then:

```bash
ffmpeg -i in.jpg -vf "scale=896:-1,crop=896:1160" -q:v 3 monolith-cover.jpg
```

(If the 3:4 output comes back shorter than 1160px tall after scaling to
896 wide, scale to `-1:1160` and crop the width instead — whichever
dimension the source falls short on.)

Off by default — this slot doesn't exist in the reference build; it's an
optional addition. If present, it appears on the monolith's front face during
chapters 1–2 and fades out as the object fractures in chapter 3.

Two directions — pick one, or generate both and compare on the actual page:

**2a — abstract wordmark (original direction, no people):**

```
A monochrome wordmark composition on a matte near-black ground, abstract
bold letterforms catching a single raking light from the upper right,
printed book-cover style — near-black ink ground `#1B1717`, warm off-white
type `#EDEBDD`, portrait 448:580 frame. No hands, no people, no colour, no
red, no legible specific words — treat the type as graphic mark-making, not
as a sentence to be read. Premium, minimal, editorial.
```

**2b — silhouette staging, cherry-lit (borrows the reference image's staging and colour):**

```
A single figure standing fully in silhouette, in profile, facing toward the
light — a flat black shape with no visible facial detail, no rim-light edge
glow. Behind the figure, a tall panel glows like a light box: a deep
wine-red / oxblood light, the single light source in the frame. Matte
near-black ground fills the space above and around the figure; a faint
red-tinted reflection of the silhouette sits on a dark polished floor at the
bottom edge. Portrait frame, figure occupying roughly the lower two-thirds
of the height, generous empty ground in the upper third. No visible face,
no logos, no text, no colour besides the red glow and near-black. Cinematic,
high-contrast editorial studio photography.
```

Figure stays anonymous (no visible face) here since it's mood/staging, not a
likeness of anyone specific — that's a different call from the portraits in
§4, which are deliberately identifiable. Grade target for the glow:
cherry `#810100`; ground toward noir `#1B1717`.

### Manifest line

```json
"/images/about/monolith-cover.jpg"
```

---

## 3. Screen loop (Seedance 2.5)

### What this actually is, on the page

The monolith spends roughly the last fifth of the scroll (chapter 5, "Content
& the two of us") with its front face turned into a screen. The object stops
fracturing and reassembling for this stretch; instead, a video plays inside a
thin scanline/crop-mark frame already drawn in code — like a monitor built
into the object's surface, not a separate video element floating on the page.
It's muted, loops continuously, and only plays while that chapter is actually
in view (paused the rest of the time, for performance). With no file present
the frame shows a static placeholder pattern instead — the page works either
way, this is pure enhancement.

The concept for what plays inside it is **abstract kinetic typography** —
bold letterforms sliding and locking into place, no people, no faces. That
choice is deliberate: it's the one media slot where content *in motion*
would otherwise raise the same real-person question as the portraits, but
harder, since motion implies likeness and behavior, not just a still. If you
want a different visual concept for the loop, it needs to stay in that same
lane (abstract, no people) unless you want to open that question here too —
say so and I'll draft an alternative prompt.

**Path:** `public/videos/loops/loop-a.mp4`
**Spec (final file):** 1080×1080 px · 1:1 · 6–8 s · seamless loop · audio
stripped · constant motion speed · no cuts, no flicker, no baked text or
logos, no faces, no red · monochrome (near-black ink on warm off-white)

> `public/videos/` does not exist yet in this repo. Create
> `public/videos/loops/` before placing the final file.

### Generation instruction (Seedance-specific)

Seedance 2.5 supports generations up to ~15s, longer than the 6-8s the slot
needs. **Do not ask it for a "perfect loop" directly** — instead generate
~10s of continuous, unhurried, unidirectional motion, then find and trim a
clean 6-8s loop window yourself in post (ffmpeg recipe below). A single
constant-speed pass gives you more candidate loop points to choose from than
trying to force an exact loop in the generation itself.

### Prompt (target ~10s generation)

```
Macro shot of heavy black sans-serif letterforms sliding laterally across a
bone-white paper surface and locking into place, one continuous unidirectional
motion, constant unhurried speed, no acceleration or deceleration. Camera
static, locked-off macro framing (or an extremely slow, barely perceptible
macro push-in if a fully static camera isn't available) — no handheld motion,
no camera shake, no zoom pulses. Flat even studio lighting, subtle visible
paper texture, monochrome only — near-black ink on warm off-white paper, no
colour, no red. No text should be legible as words, only bold abstract
letterform shapes in motion. No people, no hands, no faces, no logos, no
watermarks. Square 1:1 frame. Clean, premium, editorial motion graphics
style. Duration approximately 10 seconds.
```

### Trim to a seamless loop + reformat

Scrub the ~10s output for a window where the motion reads as continuous
(same apparent speed and direction at the cut-in and cut-out points), then:

```bash
ffmpeg -i seedance_output.mp4 -ss 00:00:01.500 -t 7 -an \
  -vf "crop='min(iw,ih)':'min(iw,ih)',scale=1080:1080" \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart loop-a.mp4
```

Adjust `-ss` (start point) and `-t` (duration, 6-8) to whichever segment of
the source has the cleanest seam. This file is never scrubbed by the site
(chapter-5 playback is a normal muted/looped `<video>`/`VideoTexture`) — a
standard encode is correct, no all-keyframe pass needed.

### Manifest line

```json
"/videos/loops/loop-a.mp4"
```

---

## 4. Portraits (Nano Banana, from a reference photo)

**Path:** `public/images/team/marija.jpg`, `public/images/team/rustam.jpg`

AI-stylized from a real reference photo of Rustam and Marija — same lighting
language as the reference image, their actual likeness preserved.

**One practical note:** the site's CSS already applies `grayscale(1)
contrast(1.06)` to these images on render (`.duoImg` in
`AboutChapters.module.css`), so whatever colour the source file has gets
stripped in-browser regardless. Cherry lighting in the prompt still matters
for tonal separation/contrast pre-filter, but don't expect it to show as red
on the live page — if you want visible cherry here, that filter needs
removing separately (say so and I'll point to the exact line).

### Prompt template (fill in once the reference photo is attached)

This is a **relight-and-background pass, not a regeneration** — the more the
prompt asks the model to change at once (background, lighting, colour), the
more likeness tends to drift. Keep the ask narrow.

```
[Reference: attached photo of Rustam / Marija — @<filename>]

Relight this exact person for a high-contrast editorial studio portrait.
Keep their facial geometry, expression, and pose unchanged — this is a
relighting and background pass, not a new photo. Single hard directional
light source from [upper-left/upper-right — match the reference's actual
light direction], warm deep red glow (oxblood/wine-red). Darken the
background toward near-black, kept simple and uncluttered rather than
replaced with an invented scene. Portrait 3:4 frame, no text, no logos.
```

Grade target for the glow: cherry `#810100`; background toward noir
`#1B1717`. **Generate both with the same light direction and framing** —
Marija's and Rustam's cards sit side by side on the page, and mismatched
lighting between them will read as an error, not a stylistic choice.

Send the reference photo (one per person, or one combined) and I'll fill in
the bracketed light-direction detail and drop the final prompt in per person.

### Spec for the photos, once available

3:4 ratio · **1200×1600 px** · JPG · ≤400 KB · black-and-white ink-duotone
(blacks toward `#241F1F`, whites toward `#EDEBDD`) · matte · no heavy
vignette. The site's CSS already applies `grayscale(1) contrast(1.06)` on
top of the source image, so grade the source to a neutral, evenly-exposed
starting point — don't pre-crush it to black and white.

```bash
ffmpeg -i in.jpg -vf "crop='min(iw,ih*0.75)':'min(ih,iw/0.75)',scale=1200:1600,format=gray,eq=contrast=1.04" -q:v 3 marija.jpg
```

Repeat for `rustam.jpg`. Overwrite the existing placeholder files in place at
the paths above once real photos are available — no manifest line needed for
portraits (they aren't manifest-gated; check
`components/sections/about/monolith/monolith.ts` if that assumption ever
changes).

---

## Workflow

1. Generate the still images in Nano Banana (§1, §2) and the ~10s clip in
   Seedance 2.5 (§3).
2. Grade / trim per the ffmpeg recipe in that slot's section.
3. Place the file at the exact path given.
4. Add that slot's one line to the `available` array in
   `public/images/about/manifest.json`.
5. Refresh the page — no rebuild or redeploy needed, the manifest gate reads
   at runtime.

Portraits (§4) skip steps 1-2 for generation — source real photographs, grade
them with the given recipe, then do steps 3 and 5 only (no manifest entry).
