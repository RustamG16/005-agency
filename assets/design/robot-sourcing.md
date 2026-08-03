# Where to get the 3D robot

Asset sourcing only. Selection criteria first, because the criteria eliminate most of the
internet before you start browsing.

---

## The honest constraint up front

**Free CC0 robots are almost all low-poly stylized game assets.** Quaternius, Kenney and most of
Poly Pizza are built for mobile games and voxel-ish art directions — flat colours, chunky forms,
no machined detail. They are excellent assets and completely wrong for Convenium, whose language
is matte ink, milled chamfers and industrial precision.

So the realistic outcome is one of two:

- **Sketchfab, filtered hard to CC0 + downloadable**, and you dig. Hit rate is low but non-zero.
- **Pay $30–150 on TurboSquid or CGTrader** for a hard-surface robot with clean part separation.

For a portfolio piece that carries the whole homepage, the paid route is likely the right call.
Budget it as the single asset purchase for the project.

---

## Selection checklist

Check these **before** downloading. All five are visible in the Sketchfab viewer without
downloading anything, which makes it the best place to browse even if you buy elsewhere.

| # | Check | Why | How to verify |
| --- | --- | --- | --- |
| 1 | **Separate named parts** | Non-negotiable if anything transforms, opens or hinges. A single fused mesh can only float and rotate. | Sketchfab model info panel lists mesh/object count. One mesh = reject. |
| 2 | **No baked albedo textures** | Colour painted into image maps can only be *tinted*, not replaced — the original palette bleeds through and you never reach the tokens. | Open the model inspector. Solid-colour materials recolour cleanly; photo-textured surfaces don't. |
| 3 | **Triangle count** | Target under ~40k after decimation, under 2MB with Draco/meshopt. Library models built for offline render arrive at hundreds of thousands with 4K maps. | Shown in the Sketchfab info panel. Anything under ~200k is comfortably decimatable. |
| 4 | **glTF / GLB available** | Native three.js format. FBX and OBJ need a conversion pass and often lose material setup. | Listed in download options. Sketchfab exports glTF for every downloadable model regardless of upload format. |
| 5 | **License** | See below. | Filter for it rather than checking after you fall in love with a model. |

**Two extras worth having:** a lens or single-eye head (matches the concept work already done), and
an asymmetric feature somewhere — a purely symmetrical robot gives the scene no rotational
anchor and reads as generic from every angle.

---

## Licensing — filter for this first

| License | Verdict |
| --- | --- |
| **CC0 / Public Domain** | Ideal. No attribution, no strings, commercial fine. Filter for this first. |
| **Paid royalty-free** (TurboSquid, CGTrader) | Cleanest for commercial work. Buy it and stop worrying. |
| **CC-BY** | Commercial use is allowed, but attribution must follow the asset *everywhere it is used*, and the app should display the license and author. A credit line for your hero object on a studio site is a real cost. Workable, not free. |
| **CC BY-NC / BY-ND** | Unusable. |

---

## Sources, ranked for this project

### 1. Sketchfab — best for browsing, best CC0 odds

Largest library, and the 3D preview plus model-info panel lets you run the entire checklist
before downloading. Filter to **Downloadable** + **CC0**, then search.

Status note: Sketchfab's paid store moved to Epic's **Fab**, and only CC-BY and Fab Standard
content migrated. **CC0, CC-BY-SA, CC-BY-NC and CC-BY-ND stayed on Sketchfab**, and as of
mid-2026 free downloads and the download API still work. So Sketchfab is now effectively *the*
CC0 destination, and Fab is where the commercial CC-BY catalogue went.

- Browse: <https://sketchfab.com/tags/robot>
- CC0 tag: <https://sketchfab.com/tags/cc0>
- License filter explainer: <https://sketchfab.com/blogs/community/refine-downloadable-model-searches-with-new-license-filters/>

### 2. TurboSquid — best hit rate for the actual aesthetic

17,000+ robot models, 700+ free glTF, royalty-free licensing with extended rights available.
This is where hard-surface industrial robots with proper part hierarchies actually live.

- <https://www.turbosquid.com/3d-model/robot/gltf>
- Rigged: <https://www.turbosquid.com/Search/3D-Models/rigged/robot>

### 3. CGTrader — second paid marketplace

Similar catalogue to TurboSquid, sometimes cheaper, same evaluation criteria. Worth a parallel
search rather than a first stop.

### 4. Poly Pizza / Quaternius / Kenney — CC0, but check the style fit

Thousands of low-poly models, free, no login, FBX + glTF, all CC0. Right licensing, usually wrong
aesthetic for this project — but free and instant, so worth five minutes to confirm.

- <https://poly.pizza/>
- Quaternius animated robot (CC0, glTF): <https://poly.pizza/m/QCm7qe9uNJ>

### 5. Fab (Epic)

Where Sketchfab's commercial catalogue went. Worth searching, but read the license per item — Fab
Standard is not the same as CC0.

---

## Candidates reviewed (2026-08-03)

All three failed on licence, not on looks. This is the pattern: on Sketchfab, the
free-and-beautiful robots are overwhelmingly NonCommercial.

### Sphere Bot — 3DHaupt — **best design, wrong licence**

<https://sketchfab.com/3d-models/sphere-bot-6c3a32958c2d43cdbf12a7109616bdbe>

- **6k triangles, 3.5k vertices.** Featherweight — the 40k budget is six times this.
- **Modelled, rigged and animated in Blender.** Ships with Rolling, Opening/Idle, Walk, Run,
  Attack, Jump/Fly.
- **It transforms.** The artist's own description: "a robot which can transform into the most
  stable form (Sphere)." A built-in opening/closing mechanism with real part separation is
  precisely what an AI-generated mesh can never give you.
- **Licence: CC Attribution-NonCommercial-ShareAlike.** Unusable as-is. NonCommercial rules out a
  studio site; ShareAlike would force the same licence onto derivative work.

**Action: email the artist.** Dennis Haupt has a site at <https://3dhaupt.com/> and sells Rusty
and Wood variants of this same design elsewhere. Artists who publish NC on Sketchfab very often
sell a commercial licence directly. This design is close enough to the brief that a paid licence
is worth chasing before looking further.

### High Poly Female Cyborg Head — CGTrader, $24.50 — **reject**

- **Editorial Licence = non-commercial only.** CGTrader's own documentation: editorial-licensed
  products may be used only for educational, personal, or journalistic purposes. It is typically
  applied when a model contains copyrighted material the creator never cleared, and it *transfers
  copyright responsibility to the buyer*. Paying for it buys something you cannot ship.
- Formats are OBJ / ZTL / FBX — **no glTF**.
- It is a ZBrush ZTool sculpt: very high poly, one continuous surface, **no part separation**.
- Aesthetically a humanoid female cyborg — a different register from machined industrial minimal.

### Soulless — **moved to Fab**

The free Sketchfab download is gone; the page now redirects to Fab. Licence must be checked there.
Also an organic humanoid face rather than hard-surface machinery.

---

## Search by licence, not by looks

Reverse the order you're browsing in. On Sketchfab, open the search filters and set
**Downloadable** plus the licence *before* typing a query:

- **CC0** — take it, no strings.
- **CC-BY** — usable with attribution that must follow the asset everywhere, including in-app.
- **CC-BY-SA / NC / ND** — skip. NC and ND are unusable; SA infects your own work.

Also worth knowing: Sketchfab now flags **Human Created** vs **AI Generated**, and many artists
tag models **NoAI** (the Sphere Bot does). NoAI restricts use as generative-AI training input —
it does not affect rendering the model on a website, but read it alongside the licence.

---

## 3D printing libraries — the overlooked route

Worth a serious look for hard-surface robot heads, for three reasons that are specific to this
project:

1. **You don't need textures.** Every material comes from `tokens.css` at runtime, so a
   geometry-only STL loses you nothing. The thing that makes print models useless for game work
   is irrelevant here.
2. **They are modelled as separate parts by necessity** — they have to be printed and assembled.
   That part hierarchy is exactly what the choreography needs.
3. **Enormous supply of robot heads, helmets and mechanical faces**, much of it CC-BY or CC0.

| Source | Notes |
| --- | --- |
| [Printables](https://www.printables.com/) | Prusa's library. Good licence metadata, active community |
| [Cults3D](https://cults3d.com/) | Mixed free and paid; check per-model licence |
| [Thangs](https://thangs.com/) | Strong geometric search across other sites |
| [MyMiniFactory](https://www.myminifactory.com/) | Curated, every model print-verified |
| [Thingiverse](https://www.thingiverse.com/) | Largest and oldest; quality varies widely |

**Caveats:** STL carries no UVs or materials (fine here) but often arrives dense from CAD, so
budget a decimation pass. Some models are non-manifold and need a repair pass in Blender. And
STL needs converting to glTF.

## Two more guaranteed-clean sources

- **[Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)** — small
  set, permissively licensed, guaranteed-valid glTF. The `DamagedHelmet` model is a well-known
  sci-fi head and a useful placeholder while you shop.
- **[Fab](https://fab.com)** — Epic's store, where Sketchfab's commercial catalogue moved. Proper
  commercial licensing; read per item, since Fab Standard is not CC0.

---

## Search terms that actually work

Generic "robot" returns mostly humanoid game characters. These bias toward the machined,
hard-surface look:

`hard surface robot` · `mech` · `droid` · `industrial robot` · `robot head` · `camera head` ·
`sci-fi drone` · `robot bust` · `articulated arm` · `sentry` · `probe droid`

For the lens concept specifically: `camera lens housing` · `optical sensor` · `robot eye`.

---

## After you pick one

1. Decimate to **under 40k triangles**.
2. Compress with **Draco or meshopt**, target **under 2MB** over the wire.
3. Strip baked textures; assign materials from `styles/tokens.css` at runtime — body `--color-ink`
   `#241F1F`, chamfers `--color-hairline` `#D6D2C2`, detail `--color-cotton` `#EDEBDD`, LED ring
   `--red-chili` `#D73B3E`, seam `--red-chili-300` `#E5595C`, recesses `--red-maroon` `#630000`,
   scene ground `--color-noir` `#1B1717`.
4. Keep the part names — the choreography addresses parts by name.

---

## Sources

- [Refine Downloadable Model Searches with New License Filters — Sketchfab](https://sketchfab.com/blogs/community/refine-downloadable-model-searches-with-new-license-filters/)
- [An Introduction to Creative Commons Licenses — Sketchfab](https://sketchfab.com/blogs/community/an-introduction-to-creative-commons-licenses/)
- [Best Free 3D Model Sites for Games (2026) — Cinevva](https://app.cinevva.com/guides/free-3d-model-sites)
- [Robot 3D models — Sketchfab](https://sketchfab.com/tags/robot)
- [Download Free & Premium Robot 3D Models — TurboSquid](https://www.turbosquid.com/3d-model/robot/gltf)
- [Poly Pizza: Free 3D models for everyone](https://poly.pizza/)
- [Animated Robot by Quaternius — Poly Pizza](https://poly.pizza/m/QCm7qe9uNJ)
