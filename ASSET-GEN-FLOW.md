# Asset generation plan — Google Flow (/about monolith)

Flow outputs **16:9 or 9:16 only** — every asset below is generated oversized in one of
those frames, then center-cropped to its final ratio with ffmpeg. Videos are made with
**Frames to Video**: generate the frame image first, download it, feed it back as first
AND last frame (identical frame = seamless loop).

Grade rule for everything (from MEDIA-BRIEF-ABOUT.md): monochrome, blacks toward
`#171717`, paper whites toward `#EEEDE8`, no red, no faces, no colour.

---

## A. Images

| # | Asset | Final path | Final size | Generate as | Crop |
|---|---|---|---|---|---|
| 1 | Front cover | `public/images/about/monolith-cover.jpg` | 896×1160 (448:580) | 9:16 | center, keep width, trim height |
| 2–7 | Fracture plates 01–06 | `public/images/about/plates/plate-0N.jpg` | 1024×1024 | 16:9 | center square |
| 8–9 | Portal layers ×2 | `public/images/about/portal/layer-01.jpg`, `layer-02.jpg` | 1024×1024 | 16:9 | center square |

(Portal front layer = code-drawn type slab, no asset needed.)

### Prompts (short, guide-conformant)

**1 · Cover**
> Monochrome wordmark composition printed book-cover style on matte near-black ground, warm off-white letterforms catching one raking light from upper right, no people, no colour, premium and minimal.

**2 · Plate 01 — type specimen**
> Printed type specimen sheet flat on seamless backdrop, bold display alphabet at three sizes, near-black ink on warm off-white paper, straight-down shot, soft even light, monochrome, no hands, premium and minimal.

**3 · Plate 02 — folded poster**
> Large poster folded into quarters, visible creases, bold geometric layout, near-black ink on warm off-white stock, straight-down shot, soft even light, monochrome, no hands, minimal.

**4 · Plate 03 — card stack**
> Neat stack of business cards fanned at one corner, minimal printed mark on top card, near-black ink on warm off-white stock, straight-down shot, soft even light, monochrome, no hands, minimal.

**5 · Plate 04 — embossed swatch book**
> Bound swatch book of heavy cotton paper fanned open, blind-embossed geometric mark, no ink, one low raking light, warm off-white, monochrome, no hands, premium and minimal.

**6 · Plate 05 — brand manual spread**
> Open printed brand-guidelines spread flat on seamless backdrop, dense grid of diagrams and captions, near-black ink on warm off-white paper, straight-down shot, monochrome, no hands, minimal.

**7 · Plate 06 — packaging flat**
> Flattened cardboard packaging die-line, visible score lines, minimal printed mark, near-black ink on warm off-white board, straight-down shot, soft even light, monochrome, no hands, minimal.

**8 · Portal layer 01 — deep still**
> Oversized near-black letterforms cropped off the edges of a warm off-white ground, flat graphic poster, monochrome, no people, minimal.

**9 · Portal layer 02 — mid still**
> Sparse architectural line drawing, thin near-black rules on warm off-white paper, generous empty space, monochrome, flat, minimal.

### Post-process (per image)

```bash
# plates / portal layers → 1024 square + grade
ffmpeg -i in.png -vf "crop='min(iw,ih)':'min(iw,ih)',scale=1024:1024,format=gray,eq=contrast=1.06" -q:v 3 plate-0N.jpg

# cover → 448:580 portrait + grade (from a 1080×1920 source)
ffmpeg -i in.png -vf "crop=1080:1398,scale=896:1160,format=gray,eq=contrast=1.06" -q:v 3 monolith-cover.jpg
```

---

## B. Video — screen loop (fallback / optional portal motion layer)

Only one video slot: `public/videos/loops/loop-a.mp4` — 1080×1080, 6–8 s, seamless,
muted. It backs the ch5 screen until the portal ships, and can later be mapped onto a
portal layer for subtle interior motion.

**Flow workflow (first + last frame):**

1. **Generate the frame** (image, 16:9):
   > Macro of heavy black sans-serif letterforms resting on a bone-white paper surface, flat even light, subtle paper texture, monochrome, no hands, minimal.
2. Download the frame. In **Frames to Video**, set it as **first frame AND last frame**
   (identical endpoints = the loop closes seamlessly).
3. **Motion prompt:**
   > Letterforms slide slowly sideways and lock into place, constant speed, camera static, no cuts, no flicker, monochrome.
4. Generate 8 s, 16:9, 1080p. If the midpoint drifts off-brand, regenerate — don't grade
   colour back out in post.

**Post-process:**

```bash
ffmpeg -i flow-out.mp4 -an -vf "crop=1080:1080,scale=1080:1080,format=gray,eq=contrast=1.05" \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart loop-a.mp4
```

Never scrubbed → normal encode, no all-keyframe pass.

---

## C. General first/last-frame recipe (for any future non-loop video)

1. Generate the **first frame** as an image with the scene prompt.
2. Generate the **last frame** by re-running the same prompt with only the end-state
   changed (same backdrop, light, palette wording — change one clause).
3. Frames to Video with both frames + a motion prompt describing only the transition.
4. 16:9 for landscape slots, 9:16 for portrait slots; crop in post, grade with
   `format=gray,eq=contrast=1.0x`.

Checklist per output before shipping: no colour cast, no faces, no red, no baked
text/logos beyond the intended graphic, blacks ≈ `#171717`, whites ≈ `#EEEDE8`.
