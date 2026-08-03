# Hero transformation — feasibility research

**Date:** 2026-08-03
**Question:** Can the hero be a video where the "CONVENIUM" letters transform Transformers-style
into a robot, which then slides out of the banner and becomes the live 3D element?
**Verdict:** Not as a video. The same idea is straightforward as one WebGL scene, and comes out
better on every axis — sharpness, file size, scrub control, and the handoff.

---

## 1. Why the video route fails

Four independent blockers. Any one of them alone would be survivable; together they aren't.

### 1.1 Text is the worst case for AI video

Text requires pixel-level consistency across frames, which is in direct conflict with how
diffusion video models generate. Letters drift, logos morph, signs render as gibberish. This is
the single most-documented artifact class in the category.

The concept depends on "CONVENIUM" being **perfectly legible** for the first beat — it is the
studio wordmark. That is exactly the thing these models cannot hold stable.

### 1.2 Omni Flash's hard limits

Gemini Omni Flash (Google, 2026):

| Limit | Value |
| --- | --- |
| Duration | 3, 5 or 10 seconds — a fixed enum, not a range |
| Resolution | 720p only. 1280×720 landscape or 720×1280 vertical |
| Frame rate | 24fps |
| Sequential edits | ~3 before session context degrades |
| Video inputs | up to 3 clips, ≤3s each |
| Conditioning | first-frame pin, plus up to 10 reference images |

**720p is the one that kills it outright.** The hero is full-bleed at a 1440px design width, and
on a retina laptop that is a ~2880px buffer. A 1280×720 source upscales to roughly 2.25× on the
short axis before DPR. It will read as soft and compressed next to Archivo Black display type,
which is razor-sharp vector. Soft video beside crisp type looks like a mistake, not a style.

Other models trade around this but don't solve it: Kling 3 reaches 15s, Sora 2 Pro goes longer,
Veo 3.1 is the strongest all-around quality in 2026 and has better last-frame conditioning. None
of them fix 1.1 or 1.4.

### 1.3 Transformation choreography is not controllable

Precise transitions from a text prompt alone are not viable for brand work — the industry
workaround is start-and-end-frame conditioning, where you supply both endpoints and the model
interpolates. That helps a lot, and Omni Flash does support first-frame pinning plus reference
images.

But it gives you an *interpolation*, not a *mechanism*. A Transformers morph reads as convincing
because panels rotate on hinges and parts slide along axes in a way the eye can follow. An
interpolation dissolves one shape into another. It will look like a morph filter, not like
machinery.

### 1.4 The handoff cannot be made seamless — this is the real blocker

The concept ends with the robot "sliding out of the banner and becoming the 3D element." That
requires the last video frame to match the first WebGL frame in proportion, lighting, material,
lens and orientation — simultaneously.

It won't. A video-generated robot and a reconstructed mesh are two different objects that merely
resemble each other. At the cut you get a visible pop, and `CLAUDE.md` already rules on exactly
this class of problem: no cuts or dissolves inside scroll-scrub media, transitions hold a sharp
frame boundary.

Note the direction of the dependency, too: to generate a video of *this specific robot*, the
robot must already exist as a design. So the mesh comes first regardless. And once the mesh
exists, rendering the transformation in WebGL is strictly cheaper than describing it to a video
model and hoping.

---

## 2. What AI 3D generation can and cannot give you

### Current state of the tools

| Tool | Poly control | Topology | Textures | Rigging |
| --- | --- | --- | --- | --- |
| **Hunyuan3D 3.1** | 50k / 500k / 1.5M presets; docs list 40k–1.5M faces | Watertight, cleaner than 3.0; 8-view input | 4K PBR | None |
| **Meshy v6** | Target polycount 100–300k | Tri or quad, watertight; symmetry + pose modes; remesh | PBR | Auto-rig <30s, 600+ animations |
| **Tripo H3.1 / P1.0** | Face limit, auto size | Quad mesh; P1.0 notably cleaner and more stable | PBR | Basic skeletal only, no motion library |

In a blind ELO benchmark on top3d.ai (82,000+ community votes, February 2026), Hunyuan3D v3.1 and
Hitem3D ranked in the top three overall.

Hunyuan3D 3.0 reached 1536³ voxel resolution; 3.1 added 8-view input, watertight meshes and 4K
PBR textures.

### The limits that actually matter here

**A generated robot is a statue.** It comes out as one fused watertight shell. There is no part
hierarchy — no separate forearm, no hinge, no panel that can rotate independently. A
Transformers-style transformation needs precisely that hierarchy, and no image-to-3D tool
produces it.

**Auto-rigging does not rescue it.** Meshy's auto-rig is biped-only, has no facial joints and no
IK chain pre-setup. Reported failure modes include over-smoothed weight painting on shoulders and
chest, with visible mesh slumping on arm raises for characters with broad shoulder pads — which
describes a boxy robot exactly. High-poly or irregular meshes (i.e. most AI output) skin poorly
and need a retopology pass first. Tripo's output is primarily geometry and needs additional
processing before it's animation-ready.

**Skeletal rigging is the wrong tool anyway.** Skinning deforms a continuous mesh — it bends
flesh. Hard-surface machinery doesn't bend; it hinges. A transforming robot wants rigid parts
parented in a hierarchy and rotated, which is a *modelling* decision made at build time, not
something derivable from a finished mesh.

**So:** AI 3D is good for a single hero object that floats, rotates, tracks the cursor and lights
up. It is the wrong pipeline for anything that comes apart on hinges.

---

## 3. Your instinct about a ready-made robot is the right one

It solves the exact thing AI generation cannot: a library model is **already built as separate
named parts with a hierarchy**, because a human modelled it that way. That is the whole
transformation, handed to you.

### Sourcing

| Source | Notes |
| --- | --- |
| **Sketchfab** | 800k+ free models under Creative Commons; glTF is the standard export for every downloadable model |
| **TurboSquid** | 17,000+ robot models, 700+ free glTF; royalty-free licensing with extended rights available |
| **CGTrader, Quaternius, Poly Pizza, Kenney** | Worth checking; Quaternius and Kenney are CC0, which removes the attribution problem entirely |

### Licensing — read this before downloading anything

- **CC0** — no attribution, no strings. Ideal. Prefer it.
- **CC-BY** — commercial use is fine, but attribution must follow the asset *everywhere it is
  used*, and the app should display the license and the author. On a client-facing studio site,
  a credit line for your hero object is a real cost. Workable, not free.
- **CC BY-NC** — non-commercial only. Unusable here.
- **TurboSquid royalty-free** — cleanest for commercial work; paid.

### Recolouring to tokens

Trivial *if* the model is right, and impossible if it isn't:

- **Solid-colour PBR materials** → traverse the glTF, set `material.color` from tokens, done. Any
  number of materials is fine as long as colour lives in the material, not in a map.
- **Baked albedo textures** → the colour is painted into image files. Setting `material.color`
  only tints them, and the model's original palette bleeds through. Avoid these.

So the selection criteria are: **glTF/GLB, separate named parts, few materials, no baked albedo,
CC0 or paid royalty-free, and under ~40k triangles after decimation.**

Library models are frequently built for offline rendering and arrive at hundreds of thousands of
triangles with 4K maps. Budget a decimation and compression pass regardless of source.

---

## 4. Recommendation — do the whole thing in WebGL

The transformation, the letters, and the handoff are one scene. No video anywhere.

1. **Letters as real geometry.** "CONVENIUM" extruded from the actual Archivo Black glyph paths.
   Vector-sharp at any DPR, no 720p ceiling, a few kilobytes.
2. **Letters break into panels.** Each glyph splits into slabs that rotate and translate — the
   mechanism reads as hinged, because it *is* hinged.
3. **Panels resolve into the robot.** Parts fly to the library model's part positions.
4. **The robot persists.** It doesn't "become" the 3D element. It already is one, and always was.
   There is no handoff, so there is no seam.

**The codebase already proves this pattern.** `monolith.ts` splits a body into a 24-shard lattice
and drives every shard's position from one paused GSAP timeline of duration 1, scrubbed by a
single ScrollTrigger. Letters-to-robot is the same technique with a different target layout. The
performance envelope is known: ~25 draw calls, no shadow map, DPR capped at 1.5, rendering only
while an `IntersectionObserver` reports the stage visible, on the ticker Lenis already drives.

What this buys over the video route:

| | AI video | WebGL |
| --- | --- | --- |
| Wordmark legibility | Drifts, unreliable | Exact — it's the real font |
| Resolution | 720p ceiling | Vector-sharp at any DPR |
| Duration | 10s hard cap | Unbounded |
| Scroll scrub | Frame seeking, decode-bound | Native, frame-accurate |
| Reversible on scroll-up | No | Yes, free |
| Handoff to 3D | Visible seam | Doesn't exist |
| Colour control | Baked at generation | Tokens at runtime |
| Weight | ~2–5MB per clip | Font paths + one mesh |
| Iteration cost | Regenerate and re-cut | Change a number |

The one thing video wins on is **surface realism** — reflections, subsurface, atmospheric
lighting. Given the Convenium palette is matte ink on noir with a single warm key, that advantage
is close to zero here.

---

## 5. Open risks

- **Extruded display type is a cliché** if handled carelessly. It works when the letters read as
  machined panels in the same material language as the robot, and fails when they read as
  chrome 3D lettering. Worth a look-dev pass before committing.
- **Library model quality is a lottery.** Budget time to reject several before finding one with
  clean part separation and no baked albedo.
- **Part count drives the choreography.** A robot split into 12 parts animates very differently
  from one split into 60. Pick the model with the transformation in mind, not just the silhouette.

---

## Sources

- [Generate and edit videos with Gemini Omni Flash — Google AI for Developers](https://ai.google.dev/gemini-api/docs/omni)
- [Gemini Omni Flash: Google Video Model, API, Pricing & Limits](https://coursiv.io/blog/gemini-omni-flash)
- [Start building with Nano Banana 2 Lite and Gemini Omni Flash — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni-flash-nano-banana-2-lite/)
- [Best AI Video Models 2026: Seedance 2 vs Veo 3.1 vs Kling 3](https://www.teamday.ai/blog/best-ai-video-models-2026)
- [Why Your AI Videos Look Fake: 7 Fixes for Common AI Artifacts](https://genra.ai/blog/why-ai-videos-look-fake-how-to-fix)
- [Start and End Frame AI Video Generation Explained in 2026 — Dreamina](https://dreamina.capcut.com/ai-video/ai-video-motion-control)
- [Hunyuan 3D Models — The Essentials, Scenario](https://help.scenario.com/articles/5886286147-hunyuan-3d-models-the-essentials)
- [Comparing Generative 3D Models — Scenario](https://help.scenario.com/articles/1263568892-comparing-generative-3d-models)
- [Meshy vs Tripo: Best AI 3D Model Generator (2026)](https://www.meshy.ai/compare/meshy-vs-tripo)
- [AI Auto-Rigging Showdown 2026 — StraySpark](https://www.strayspark.studio/blog/ai-auto-rigging-showdown-2026-tripo-meshy-cascadeur-mixamo)
- [How to AI Auto-Rig a 3D Character — Meshy](https://www.meshy.ai/tutorials/character-auto-rigging-workflow)
- [An Introduction to Creative Commons Licenses — Sketchfab](https://sketchfab.com/blogs/community/an-introduction-to-creative-commons-licenses/)
- [Sketchfab Download API Guidelines](https://sketchfab.com/developers/download-api/guidelines)
- [Rigged Robot 3D Models — TurboSquid](https://www.turbosquid.com/3d-model/rigged/robot/girl/gltf)
