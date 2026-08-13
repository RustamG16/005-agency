# Approved build plan

## Scope

- Routes/components: New `/about-v2` route and new isolated `components/sections/about-v2/material-monolith/` implementation.
- Files expected to change: new page, chapter component, scene component, WebGL builder, CSS Modules, About-v2 asset manifest/fallback data, `.olympus` artifacts, and potentially the sitemap only after the route is verified.
- Out of scope: Changing `/about`; rewriting Homepage, Services, Work, or Contact; adding a service directory, work grid, contact form, fictional cases, testimonials, awards, or analytics implementation; installing dependencies; generating external media in this run.

## Static hierarchy

1. **Arrival:** “Convenium is two people.” A short supporting line defines the founder-owned studio without repeating services.
2. **Proximity:** “No layers between the conversation and the work.” Explain direct founder access.
3. **Judgment:** “The advantage is not doing more. It is losing less in translation.” Explain the studio’s integrated decision-making, not its service list.
4. **Continuity:** “No relay race.” Show that the same two people remain responsible from first question to final delivery.
5. **Founders:** Real/fallback portrait panels and concise ownership statements for Marija and Rustam.
6. **Close:** “The work stays intact.” One compact link to start a project; no contact form or repeated Contact page content.

## Design system decisions

- Type scale: Reuse `--font-hero`, `--font-display`, `--font-subhead`, `--font-body`, `--font-label`, and existing font-family tokens.
- Spacing/grid: Existing 12-column desktop bed and 6-column mobile bed; 40–48 px desktop content inset and 16–20 px mobile inset through existing container tokens.
- Color/contrast: `--color-noir` background, cotton/bone primary type, gray-on-noir metadata, cherry/chili only for seams, state indicators, and focus/CTA emphasis.
- Component states: DOM content is visible by default; WebGL fades in only after ready. Asset loading failure retains procedural material plates. Founder cards explicitly remain graphic placeholders until real portraits exist.

## Motion contract

| Interaction | Purpose | Trigger | Duration/easing | Interruptible | Reduced-motion behavior |
|---|---|---|---|---|---|
| Master monolith transformation | Make founder continuity and material judgment tangible | Root scroll progress | Scrub `0.35`, timeline ease `none` | Yes; bound to scroll | Canvas hidden; static fallback sheet/object shown |
| Chapter headline reveal | Establish hierarchy at each decision point | Headline enters 82% viewport | 420 ms, `expo.out`, short line stagger | Yes; once-only | 220 ms opacity only or no motion |
| Body reveal | Progressive disclosure without delaying reading | Body enters 86% viewport | 360 ms, `power2.out`, y 18 px | Yes; once-only | Content visible; no translation |
| Material index update | Explain the current object state | Scroll crosses chapter state | 180 ms opacity/transform | Yes | All labels visible in document flow |
| Founder-card hover/focus | Confirm interactivity and ownership | Pointer/focus | 180 ms border/seam response | Yes | Same static focus outline |
| Final CTA underline | Clear action feedback | Hover/focus | 260 ms sharp ease-out | Yes | Immediate underline/focus ring |

## WebGL contract

- **Activation verdict:** Go.
- **Communication value:** One object holds distinct materials without losing its structure, mirroring how two founders carry strategy, design, content, and engineering without handoff loss. It also demonstrates the real-time 3D product the target audience values.
- **Scene:** One Three.js group with a dark core, six material plates, hairline frame, internal cherry light plane, and minimal environment particles/lines. Camera remains controlled; no orbit controls or user navigation.
- **Input:** Native vertical scroll only. GSAP timeline maps page progress to rotation, plate separation, controlled fracture, material reveal, founder state, and final doorway/opening state.
- **DOM integration:** Canvas is `aria-hidden`; chapter copy, labels, names, roles, CTA, and fallback remain semantic DOM. ScrollTrigger controls both Three object properties and DOM state without inserting meaning into the canvas.
- **Asset formats:** Optional AVIF/WebP cover/plates and MP4/WebM loop from `media_guide.md`; procedural canvas textures and CSS fallback ship first.
- **Performance budget:** Dynamic Three.js import; DPR capped at 1.5 desktop and 1.25 mobile; low-poly boxes/planes; texture maximum 1024 per plate; no post-processing; render only while stage intersects and document is visible; pause video when inactive.
- **Quality tiers:** Desktop gets all six plates and controlled depth; mobile uses three grouped slabs and fewer decorative lines/particles; weak/reduced-motion devices receive the static fallback.
- **Loading/error fallback:** Reserve the stage immediately. Show CSS material object until WebGL is ready. Any texture/video failure keeps the procedural material instead of logging repeated requests or blanking the object.
- **Unsupported/no-JS fallback:** Semantic chapters and CSS monolith remain visible.
- **Cleanup:** Remove resize/visibility/intersection listeners; kill the local timeline and ScrollTrigger; dispose all geometries, materials, textures, video objects, and renderer on route unmount.
- **Removal condition:** Remove or simplify WebGL if it delays readable content/CTA, causes sustained mobile jank, exceeds the bounded asset budget, or produces runtime errors on representative devices.

## Implementation slices

1. Static hierarchy, route metadata, CSS fallback, and responsive shell.
2. Procedural material/founder fallback states and optional asset manifest contract.
3. Scoped React/GSAP copy and state motion.
4. Lazy-loaded bounded Three.js material monolith.
5. Desktop/mobile/reduced-motion/runtime verification, limited to two QA cycles.
