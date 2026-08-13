# Evidence audit

## Scope and evidence

- Routes/states inspected: live `http://localhost:3000/about`; top, Web/3D, founder, and mobile-menu states. `/about-v2` is reserved for the later selected implementation and was not created.
- Breakpoints: 1440 × 900 desktop and 390 × 844 mobile.
- Evidence locations: `.olympus/evidence/about-desktop-top.png`, `about-desktop-web.png`, `about-desktop-studio.png`, `about-mobile-top.png`, `about-mobile-studio.png`, and `about-mobile-menu.png`; five user-supplied current-page screenshots; relevant About source and public asset inventory.
- Analytics available: none found in the app source or dependency list. The privacy page also describes analytics coverage as incomplete.
- Runtime evidence: no console errors or warnings during inspected desktop/mobile states. The live page contained two canvases: the About monolith and the global guide character.
- Limits of this audit: no production traffic, conversion data, user research, Figma, asset-rights records, or supplied final portrait files. Reduced-motion behavior was verified in source, not through an emulated browser session. Performance risk is source-informed rather than a production Lighthouse measurement.

## Current experience in one sentence

The page is a coherent, technically considered scroll-driven studio manifesto whose strongest promise—“this page is the portfolio”—currently feels under-proven because its dominant monolith, supporting media, and founder portraits are intentionally incomplete.

## Highest-leverage findings

| Priority | Observation | Evidence | User/business effect | Severity | Confidence |
|---|---|---|---|---|---|
| 1 | **Observed:** the central media object is structurally present but visually under-resolved. The optional About manifest contains no assets, while the monolith requests a cover, six plates, and a loop only when supplied. Large surfaces therefore remain near-black canvas textures or wireframes. | `public/images/about/manifest.json` has `"available": []`; `monolith.ts` defines `monolith-cover.jpg`, six plate paths, and optional video; desktop screenshots show a large dark slab/wireframe occupying the focal area. | The visual centerpiece does not yet substantiate the claim “This page is the portfolio,” reducing perceived craft and premium differentiation for luxury buyers. | High | High |
| 2 | **Observed:** the copy explains the two-person model and broad capability groups, but not why luxury hotels, real-estate brands, or other premium businesses should choose the studio. **Inferred:** the lack of sector cues, outcomes, selectivity, and proof will make high-budget visitors work too hard to assess fit. | Live headings/body copy cover identity, Web/3D/motion, and content/social. No luxury-sector examples, client evidence, delivery outcomes, engagement framing, or differentiating proof appear in the About DOM. | Qualified prospects may admire the interaction but leave without enough commercial confidence to start a project. | High | High |
| 3 | **Observed:** the founder chapter promises personal delivery but contains no portraits. The two files in `public/images/team/` are “portrait pending” graphics and rendering is explicitly disabled with `SHOW_REAL_PORTRAITS = false`. | Live DOM contains no `<img>` elements on About; the founder cards show M/R initials; local image inspection confirms both JPGs are placeholder cards. | This weakens trust and human connection at the exact moment the page says clients work directly with the founders. | High | High |
| 4 | **Observed:** the page uses roughly 9,900 px of desktop scroll and 9,284 px on mobile, with six chapters ranging from 1–2.2 viewport heights while delivering limited new evidence. **Inferred:** without richer media or proof, the deliberate pacing reads as emptiness rather than luxury restraint. | Measured desktop chapter heights: 1080, 1440, 1980, 1980, 1620, and 900 px. Mobile remains similarly long. User screenshots and captured states show substantial unoccupied areas around the object. | The experience demands significant attention before the final CTA, which may reduce completion and qualified-contact intent. | Medium | High |
| 5 | **Observed:** mobile collapses the founder cards to one column, but persistent chrome competes with the content. In the captured founder state, the fixed header overlays the chapter’s opening lines and the 130 px guide character obscures part of Rustam’s card/name area. | `.olympus/evidence/about-mobile-studio.png`; measured guide canvas 130 × 130 at the lower-right of a 390 × 844 viewport. | Key trust content becomes harder to read on a major viewport, diminishing polish and accessibility. | Medium | High |

## What already works

- The Archivo Black / Newsreader / Inter hierarchy, warm noir/cotton/cherry palette, grid, marginal folios, and strong typographic scale form a distinctive system worth preserving.
- The continuous monolith gives the page a memorable organizing device, and the split between scrubbed object motion and discrete copy reveals creates clear rhythm.
- The page has a semantic heading structure, a skip link, an accessible mobile-menu dialog, a persistent project CTA, and a direct email CTA.
- Runtime code shows thoughtful guardrails: Three.js is dynamically imported, device pixel ratio is capped at 1.5, rendering pauses offscreen/when hidden, resources are disposed, and optional media is manifest-gated to avoid failed requests.
- Reduced-motion source behavior removes the WebGL stage and sticky chapter heights, returning the content to normal flow.
- No browser console warnings/errors or horizontal overflow were observed in the inspected states.

## Reference principles worth transferring

| Principle | Why it works | How to transform it for this brand | Copying risk |
|---|---|---|---|
| One persistent object carries the narrative | Creates continuity and demonstrates interactive capability | Give the object concept-specific meaning: a luxury-material artifact, modular evidence cabinet, or spatial signal system rather than a generic dark slab | Low; this is the project’s existing expression |
| Alternating text/object composition | Produces strong scanning rhythm and makes negative space intentional | Keep the 12-column tension while letting proof, portraits, and media occupy selected chapters | Low |
| Display sans + editorial serif + restrained UI face | Balances impact, culture, and clarity | Preserve the exact font system; distinguish concepts through scale, density, and sequencing rather than font replacement | Low |
| Warm noir with cherry light | Feels cinematic and consistent with the rest of the site | Use controlled highlights and material response, avoiding a generic red-glow treatment on every asset | Low |
| Scroll as demonstration | Lets capability be experienced, not merely claimed | Tie each motion beat to a specific capability, proof point, or founder responsibility and provide a quiet reduced-motion equivalent | Low |

## Unanswered questions and missing media

- The final original portraits of Marija and Rustam have not been supplied.
- Analytics and a conversion baseline are unavailable; “contact-start intent” is currently the proposed success signal.
- Asset rights/provenance must be recorded for every generated or supplied file.
- Exact media, video, and WebGL needs should remain undecided until one of the three concepts is selected at Gate B.

## Design problem to solve

Create a separate `/about-v2` experience that preserves Convenium’s established typography, warm dark palette, grid, and high-end scroll language while converting the empty monolith into meaningful proof, making the two founders credible and visible, signaling clear fit for luxury businesses, and reaching a qualified project CTA without mobile obstruction or unjustified performance cost.
