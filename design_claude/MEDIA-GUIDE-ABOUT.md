# Media guide — About page (Monolith concept)

What to generate, with which tool, and how to process it. The real-time 3D replaces
the old scroll-scrubbed hero film; AI video now lives in **chapter 5** (loops on the
monolith's screen face) and in the **mobile pre-render**.

## 1. Tools

- **Gemini Omni Flash** (Gemini app / Flow / AI Studio; included in Google AI plans):
  10s takes, conversational edit turns — best for iterating a loop until it's seamless.
- **Veo 3.1 Lite** (Gemini API, $0.05–0.08/s): 4/6/8s, 720/1080p, i2v — best for cheap
  deterministic re-rolls. No extension in Lite.

Either works. Strip audio from everything.

## 2. Chapter-5 screen-face loops (2–3 clips)

Specs: generate **9:16 (1080×1920), 6–8s, seamless loop**, constant motion speed, no
cuts, no flicker, no baked text or logos, no people's faces, no red (accent is
code-only, R5). Keep the subject centered — the crop trims ~27% of the height.
The monolith's screen face is portrait (448:580), so center-crop each master:

```bash
ffmpeg -i loop.mp4 -an -vf "crop=1080:1398:0:261,scale=1024:-2" \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart loop-a.mp4
```

These read as "content the studio produces" — abstract, premium, platform-shaped
(the uncropped 9:16 masters double as social content later).

> **Loop A — kinetic type proof:** Macro of heavy black sans-serif letterforms sliding
> and locking across a bone-white paper surface, flat even lighting, subtle paper
> texture, constant slow lateral motion, seamless loop, no cuts, no flicker.
> Monochrome only: near-black ink on warm off-white.

> **Loop B — product still-life:** Studio still-life of a matte black cosmetic bottle
> on warm off-white seamless backdrop, single soft key light slowly sweeping left to
> right at constant speed, seamless loop, no cuts, no label text, monochrome palette,
> premium and minimal.

> **Loop C — print in motion:** Overhead macro of thick off-white paper sheets with
> blind-embossed geometric marks, sheets sliding over each other at constant slow
> speed, soft raking light, seamless loop, monochrome, no text, no hands.

Post: trim to the cleanest loop point first, then run the crop/encode above.
These autoplay (muted, loop) as VideoTextures — normal encode is fine, **no** all-keyframe
needed (they are not scrubbed).

## 3. Portraits (chapter 5 DOM cards)

Real photos of Marija and Rustam — not AI-generated. 3:4, consistent grade: B&W,
ink-duotone (crush blacks toward `#171717`, paper whites toward `#EEEDE8`), matte, no
heavy vignette. Export 1200×1600 JPG ≤400KB each →
`public/images/team/marija.jpg`, `public/images/team/rustam.jpg`.

## 4. Mobile pre-render (the scrubbed fallback)

Not AI-generated — it's a capture of the real WebGL timeline, so mobile is
pixel-identical to desktop:

1. Add a dev-only route/flag that steps the master timeline `progress 0→1` in N steps
   (e.g. 450 frames), rendering the canvas at 810×1080 (3:4) per frame.
2. Capture frames with the repo's Playwright/Puppeteer setup (`canvas.toDataURL`
   per step) → `frames/%04d.png`.
3. Assemble + all-keyframe encode (this one IS scrubbed — §17.1 rules apply):

```bash
ffmpeg -framerate 30 -i frames/%04d.png -an -g 1 -keyint_min 1 \
  -pix_fmt yuv420p -c:v libx264 -crf 20 -movflags +faststart monolith-mobile.mp4
```

4. Export frame 0 as `monolith-poster.jpg` (reduced-motion + `poster` attr).
Target ≤25MB; if over, drop to `-crf 23` or 360 frames.

## 5. Optional extras

- Fracture displacement/noise texture: 1024px grayscale Perlin still (any image tool,
  or one Omni Flash still) if the fracture shader wants variation — optional, the
  pre-split shard approach in the spec doesn't require it.
- Chapter-3 shard faces use **CanvasTexture type artifacts drawn in code** (grid
  sheets, spec fragments) — not AI images; keeps them crisp and token-true.
