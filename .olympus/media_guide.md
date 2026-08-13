# Material Monolith media guide

## Purpose

This guide produces the optional media layer for `/about-v2`. The page must remain complete with its procedural fallbacks, so these assets add tactile specificity rather than carry essential text or navigation.

Do not generate logos, readable typography, client names, awards, properties presented as real client work, or images resembling identifiable luxury brands. Every generated output is an authored Convenium material study.

## Shared art direction

Use this block at the beginning of every Nano Banana still prompt:

> Original editorial material study for Convenium Studio, a two-person European digital design and engineering studio. Severe geometric composition, sculptural negative space, warm near-black #1B1717, bone #EDEBDD, blackened metal, smoked glass, dark natural stone, and one restrained cherry-red #810100 light response. Tactile real materials, soft highlight rolloff, preserved shadow detail, subtle 35mm grain, museum-grade product photography, controlled directional studio lighting, no people unless explicitly requested, no logos, no readable text, no watermark, no orange, cyan, purple, neon sci-fi glow, generic luxury props, gold ornament, gradients, floating UI, or fake branding.

Keep the same lighting direction across all assets: key light from upper left, dim bone bounce from lower right, narrow cherry reflection from behind. Use the same virtual lens language: 70–90 mm macro/product lens, no wide-angle distortion.

## Workflow

1. Generate MM01 first and select the material/lighting reference.
2. Upload the selected MM01 as the visual reference for MM02–MM07 so the set stays coherent.
3. Generate four candidates per first pass only where specified; reject any image with text-like artifacts or unrelated props.
4. Select one candidate per ID before upscaling.
5. Export a lossless PNG master, then create AVIF quality 55–65 and WebP quality 72–80 variants.
6. Do not sharpen generated grain. Check every asset at its actual on-page size and on a dark display.
7. Use the approved plates as visual references for MM08 so the video inherits the same materials.
8. Record model name/version, generation date, prompt, reference images, selected candidate number, edits, and commercial-use status in a provenance note.

## MM01 — monolith cover

Target: `public/images/about-v2/monolith-cover.avif` and `.webp`, 896 × 1160.

Nano Banana prompt:

> [SHARED ART DIRECTION] A single upright architectural monolith photographed straight-on, 4:5 portrait composition. The object is made from smoked black glass over dark charcoal travertine, with an impossibly precise vertical seam of brushed warm metal and a faint cherry-red reflection trapped behind the glass. It feels designed by a graphic designer and engineered like a high-end digital product: exact 2-by-3 panel proportions, hairline joints, subtle depth, no pedestal, no room context. The object occupies 72% of the frame with generous noir negative space. Upper-left key light reveals the glass edge and stone pores without lifting the background. No symbols, letters, screens, text, logos, or decorative objects.

Acceptance:

- Panel geometry reads clearly at 448 px wide.
- Blacks retain surface detail; the object cannot collapse into one rectangle.
- Cherry remains a reflected signal, not a glowing neon outline.
- No text-like scratches or accidental logos.

## MM02 — origin plate

Target: `plate-01-origin.avif/.webp`, 1024 × 1024.

Nano Banana prompt:

> [SHARED ART DIRECTION] Square macro material composition built from three layers of bone cotton paper, blind emboss without letters, a severe modular grid pressed into the surface, and one narrow black foil registration strip. Abstract identity-system energy without displaying a logo. Top-down camera, tiny realistic paper fibers, controlled shadow gaps, exact alignment, central composition with calm edges suitable for cropping.

## MM03 — judgment plate

Target: `plate-02-judgment.avif/.webp`, 1024 × 1024.

Nano Banana prompt:

> [SHARED ART DIRECTION] Square still life of one dark travertine slab intersected by a thin smoked-glass plane. A single precise cherry-red alignment line passes behind the glass and refracts slightly. The visual idea is selection and judgment: most of the frame is quiet, one decision is exact. No tools, no hands, no writing, no architecture, no extra objects.

## MM04 — making plate

Target: `plate-03-making.avif/.webp`, 1024 × 1024.

Nano Banana prompt:

> [SHARED ART DIRECTION] Extreme close-up of blackened brushed metal being resolved into a precise modular surface. Visible fine mill marks, one chamfered edge, one bone reflection, tiny evidence of fabrication but no machinery or hands. Strong diagonal structure from lower left to upper right, realistic metal anisotropy, deep controlled blacks, calm museum lighting.

## MM05 — continuity plate

Target: `plate-04-continuity.avif/.webp`, 1024 × 1024.

Nano Banana prompt:

> [SHARED ART DIRECTION] Six interlocking modules combining bone paper, smoked glass, and blackened metal, all governed by one continuous grid. The modules are slightly separated so their relationships are legible, but they clearly belong to one system. Orthographic top-down view, editorial precision, no icons, no letters, no interface components.

## MM06 — signal plate

Target: `plate-05-signal.avif/.webp`, 1024 × 1024.

Nano Banana prompt:

> [SHARED ART DIRECTION] A near-black lacquer plane with one narrow rectangular aperture cut through it. Controlled cherry-red light emerges from deep inside the aperture and softly catches one polished edge. Large negative space, physically plausible light, no cyberpunk atmosphere, no fog, no interface, no buttons, no symbols.

## MM07 — resolved plate

Target: `plate-06-resolved.avif/.webp`, 1024 × 1024.

Nano Banana prompt:

> [SHARED ART DIRECTION] Final unified material composition: dark travertine base, smoked-glass face, a warm brushed-metal seam, and one almost-hidden cherry reflection. Perfectly resolved square object, frontal orthographic view, calm and inevitable rather than ornate. Exact edges, no props, no text, no frame, no environment.

Acceptance for MM02–MM07:

- Each plate is distinct at thumbnail size but unmistakably part of one set.
- No generated text, glyphs, fake logos, or UI.
- Surfaces have enough contrast to remain visible on `#1B1717`.
- Important detail stays within the central 75% square.

## MM08 — embedded material loop

Target: `public/media/about-v2/material-loop.mp4` and `.webm`, 1080 × 1080, 6–8 seconds, 24 or 30 fps, silent.

### Recommended Flow method

1. Use the approved MM02, MM03, MM04, and MM06 stills as ordered visual references.
2. Choose image-to-video or frames-to-video with a locked square camera.
3. Generate three variants at 8 seconds.
4. Reject camera moves, zooms, dissolves, liquid morphs, and new objects.
5. The first and final 8–12 frames must be visually compatible for looping.

Flow video prompt:

> Fixed-camera macro product film, square frame. A precise material panel transforms through physical construction, not a magical dissolve: layered bone paper compresses into dark travertine; a smoked-glass plane slides mechanically across the face; the surface resolves into brushed blackened metal; a narrow aperture opens and reveals one controlled cherry-red light from within. Motions are slow, exact, architectural, and mechanically plausible. Preserve the same object position, lighting direction, framing, and scale throughout. Deep warm-black background, realistic glass refraction and metal anisotropy, subtle film grain, no people, no text, no logos, no extra objects, no camera movement, no zoom, no particles, no liquid morph, no smoke, no sci-fi interface. Finish on a composition close enough to the opening frame for a seamless loop.

Negative prompt:

> camera move, handheld movement, zoom, lens breathing, melting, liquid metal, exploding parts, particles, smoke, fog, glowing outlines, cyberpunk, purple or blue light, gold ornament, letters, captions, symbols, watermark, brand logo, sudden cuts, crossfade, changing background, malformed geometry, flicker

Video acceptance:

- Object does not drift more than 2% of frame width.
- No temporal flicker on seams or edges.
- Material changes are readable without audio.
- The loop point is not noticeable during three consecutive repeats.
- Export has no audio track.

Compression target:

- MP4 H.264 High Profile, 1080 × 1080, 24/30 fps, 3–5 Mbps, `faststart`, no audio.
- WebM VP9, 1080 × 1080, 2.5–4 Mbps, no audio.
- Keep each version under approximately 4 MB; if not achievable without artifacts, shorten to 6 seconds before reducing resolution.

## MM09/MM10 — founder portraits

These should use real supplied photographs, not generated identities. If the existing portraits need background extension or color treatment, use Nano Banana only as an edit with the original image attached.

Portrait edit prompt:

> Preserve the person’s identity, facial structure, skin texture, hair, clothing, and expression exactly. Extend the canvas to a 4:5 editorial portrait with quiet warm-black studio negative space. Match a restrained Convenium grade: deep neutral blacks with preserved detail, warm bone highlights, very subtle cherry bounce from behind, realistic skin color, soft directional key light from upper left, natural film grain. Do not beautify, reshape, age, de-age, change clothing, add jewelry, alter eye color, invent hands, or replace the background with a recognizable location. No text or logos.

Create two crops from each approved master:

- Desktop: 4:5, face centered between 35–45% from top.
- Mobile: 3:4, slightly wider torso crop, face inside central 60% safe area.

## MM11 — static fallback sheet

After MM02–MM07 are approved, create a 4:3 contact sheet in code or an image editor—not with generation. Arrange all six plates on a warm-noir field with 8 px gutters and no baked labels. This is used when WebGL or motion is unavailable.

## File checklist

```text
public/images/about-v2/
  monolith-cover.avif
  monolith-cover.webp
  plate-01-origin.avif
  plate-01-origin.webp
  plate-02-judgment.avif
  plate-02-judgment.webp
  plate-03-making.avif
  plate-03-making.webp
  plate-04-continuity.avif
  plate-04-continuity.webp
  plate-05-signal.avif
  plate-05-signal.webp
  plate-06-resolved.avif
  plate-06-resolved.webp
  fallback-sheet.avif
  fallback-sheet.webp
  marija.avif
  marija-mobile.avif
  rustam.avif
  rustam-mobile.avif

public/media/about-v2/
  material-loop.mp4
  material-loop.webm
```

Do not add an asset to the runtime manifest until the file exists and passes the acceptance checks.
