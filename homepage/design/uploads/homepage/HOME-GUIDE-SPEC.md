# Home page — "The Guide" design spec (approved direction)

A small robot guide is the home page protagonist. It stars in a scroll-scrubbed
hero film, walks out of the frame at the end of the scrub (relay handoff), then
reappears as a live Three.js object that accompanies the visitor down the page,
stopping at each section with a tutorial-style "guide callout" pop-up. The page
demonstrates the studio's craft (film + 3D + motion) by literally guiding you
through it.

Positioning stays: luxury boutique, two people by design. The robot is charming
but the treatment is premium — matte, noir, restrained. Never cartoonish colors,
never bouncy easing.

## 0. Non-negotiables (from repo `CLAUDE.md`)

- Colors only from `reference/tokens.css` (R7 set): noir `#1B1717`, cotton
  `#EDEBDD`, paper `#F5F3E8`, ink `#241F1F`, gray `#6E6963` (`#A8A29A` on
  noir), hairline `#D6D2C2`, cherry `#810100`, maroon `#630000`, chili
  `#D73B3E`, chili-300 `#E5595C`.
- Red roles are fixed: cherry = solid red field / accent text on cotton.
  Maroon = depth only, never text. Chili = graphic-only on noir (≥24px display,
  rules, marks); body-size accent text on noir uses chili-300.
- Fonts: Archivo Black / Newsreader / Inter via existing `next/font` only.
- No gradients, glassmorphism, emoji icons, decorative shadows, blanket
  scroll-fades. Grain via the existing `Grain` overlay.
- Never scrub a non-all-keyframe video (see `MEDIA-GUIDE-HOME.md` §4).
- No fabricated clients/testimonials/awards/staff/numbers. Copy comes from
  `reference/site.ts`, `reference/services.ts` and §5 below.
- **License (hard rule):** the robot model is "REPO Robot" by OscarLomas3D
  (Sketchfab), CC Attribution. The footer colophon MUST render:
  `Robot: "REPO Robot" by OscarLomas3D (CC BY 4.0)` linked to the model page
  `https://sketchfab.com/3d-models/repo-robot-d125b0dbd8854f75a7e1fb49cfd4ef14`.
  Grep for `OscarLomas3D` in verification — the build fails review without it.

## 1. The robot — asset + recolor spec

- Source: `assets/repo_robot.glb` (binary glTF, 1k textures, ~8.1k tris, rigged).
- **REVERSED 2026-08-03 — see `DESIGN-LOCK.md` item 1.** The shipped base-colour
  map IS kept. It is not dropped, and the robot is NOT recolored to flat
  ink/noir. Only the red family inside the map is remapped, at runtime, on a
  canvas (draw texture → walk pixels → HSL → rewrite the red band → CanvasTexture):
  - Body/shell: the GLB's own base-colour map with the red band (h ≤ 26° or
    h ≥ 332°, s ≥ 0.14) rewritten to cherry `#810100` hue + saturation, per-pixel
    lightness re-centred on 0.25 with contrast × 1.18 then γ 0.68 — the lifted
    curve. `MeshStandardMaterial`, roughness 0.85, metalness 0.15, normalMap kept
    at normalScale 0.6. Measured on the rendered pixels: body Y 0.085 = 6.47:1 on
    cotton, 2.29:1 on noir (flat cherry is 1.79:1 on noir and fails there).
    Surface detail, wear and panel work all survive; nothing outside the red band
    is touched.
  - Joints/parts: held flat at noir `#1B1717`, roughness 0.9 — their base-colour
    map is NOT used, so the red reads as the accent instead of the whole robot.
  - THE EYE: one emissive sphere per eye bone (radius 3.4% of robot height,
    forward offset 24.4%, baked per bone — the bones are mirrored). Emissive
    paper `#F5F3E8`, emissiveIntensity 1.35, CTA step 1.9, `toneMapped: false`.
    The eye is no longer chili and no longer red: against a red body, chili at
    intensity 1 measures 4px² above Y 0.45 — it stops being a mark. §6's accent
    budget is amended accordingly (DESIGN-LOCK.md deviation 01).
- If the GLB rig has usable clips (idle/walk), they may drive subtle life
  (idle sway); all page-level travel is GSAP on the group transform, not clips.

## 2. Page architecture

- Structure: one continuous scrollytelling page, ≈600–700vh desktop.
- Two stages, one story:
  - **Stage A — Hero film (pinned, ≈200vh of scroll):** fullscreen `<video>`
    scrubbed 0→1 by a pinned ScrollTrigger (patterns in
    `reference/video-scrub-pattern.md`). The film ends with the robot walking
    out through the bottom frame edge (see `MEDIA-GUIDE-HOME.md`).
  - **Stage B — Live guide (rest of the page):** fixed transparent WebGL canvas
    (architecture cloned from `reference/MonolithScene.tsx`), z-indexed between
    the section backgrounds and the DOM copy. The recolored robot enters from
    the top and travels/parks per chapter on ONE master scrubbed timeline.
- Relay handoff rule: the robot is never visible in both media at once. Film
  exit (bottom edge) → one scroll beat of absence → live entry (top of Stage B).
  The absence beat is what sells the cut.
- Preloader → hero (locked decision): noir screen, "CONVENIUM" wordmark +
  counter 0→100; wordmark FLIPs (gsap Flip) into the nav position as the film's
  first frame fades up beneath. No white flash anywhere in the sequence.
- Existing sections are the content backbone — do not invent new content.
  Redesign their entrances, keep their copy/data: ServicesPreview (from
  `services.ts`), ProcessFilm, Principles, Faq, Footer. `OpeningSequence` is
  replaced by Stage A. (If only this folder is mounted, treat the section names
  as slots and style per §4; their content files exist in the repo.)

## 3. Chapter timeline (master progress 0→1, Stage B)

| Progress | Chapter | Robot state (live canvas) | Guide callout |
|---|---|---|---|
| .00–.08 | Arrival | Drops in from top edge, lands beside the H1 block, brief idle | #01 — "I'll walk you through." |
| .08–.30 | Services | Walks down the left gutter, parks at each service row as it reveals; head turns toward the active row | #02 — one line per active service (from `services.ts` `role`) |
| .30–.50 | Process | Robot follows the process film band; points (arm raise) at the playing band | #03 — "This is how a project actually runs." |
| .50–.70 | Principles | Robot sits/perches on the principles block edge, idle sway | #04 — "The rules we don't break." |
| .70–.85 | FAQ | Robot shrugs / tilts head at the FAQ list | #05 — "Ask anything. These come up a lot." |
| .85–1.0 | CTA / Footer | Robot walks to center, faces viewer, waves once; eye brightens one step as the footer wordmark reveals | #06 — "Your turn." + link to `/contact` |

Rules: robot travel is scrubbed (both directions must be clean). Callouts are
NOT scrubbed — they toggle at chapter thresholds with once-per-direction
ScrollTriggers, matching the "object continuous / copy in beats" split from
`reference/MonolithScene.tsx`.

## 4. Guide callout system (the pop-ups)

- **REVERSED 2026-08-03 — see `DESIGN-LOCK.md` item 5.** The docked paper card
  and the 1px connector rule are retired. The callout is a speech bubble
  anchored above the robot's head, and nowhere else. The connector no longer
  exists in any state.
- Bubble: paper `#F5F3E8`, 1px hairline `#D6D2C2`, radius 2px (NOT
  `--radius-card` — 10px belongs to the Ask panel, and the two must not read as
  the same object), padding 12px 14px, min-width 176px, max-width 264px,
  `box-sizing: border-box`. NO shadow. On noir sections the bubble stays paper —
  a lit slip of paper in the dark.
- Anchor: project the `Head_05` bone with `camera.project` every frame and add a
  crown offset (bone → top of model) measured once at load, because the bone
  sits low inside the dome. Never anchor to the puck's bounding box.
- Tail: an 11px square rotated 45°, paper fill, hairline on the two exposed
  sides, straddling the bubble's bottom edge. It slides along that edge to sit
  under the crown, clamped 18px from either end; past the clamp the bubble
  shifts sideways and the tail pins — no rubber-banding, no rotation. Within one
  bubble-height of the viewport's top edge the bubble flips below the puck and
  the tail moves to the top edge, still pointing at the head. Bubble position is
  written directly, never transitioned, so it cannot lag the head mid-drag.
- Anatomy: eyebrow (Inter, `--font-eyebrow`, uppercase, `GUIDE — 02/06`) + one
  Newsreader line at 17px. The longer "brief" paragraph does NOT fit at 264px
  without dropping under the readable floor — it moves into the Ask panel.
- Reveal: opacity + clip-path inset(0 0 100% 0) → inset(0) + a 4px rise, 320ms
  `--ease-out-sharp`; exit 200ms. One overlay at a time — opening the radial ring
  or the Ask panel retires the bubble first (160ms).
- Reveal: card clips in (clip-path inset), text via SplitText masked lines —
  identical grammar to the About chapter heads. Exit: reverse, faster (0.2s).
- Callouts are `aria-hidden="true"` decoration; the same copy must exist in an
  accessible visually-hidden list for screen readers.

## 5. Copy inventory (final unless Marija edits)

| Slot | Copy |
|---|---|
| Preloader | CONVENIUM + counter |
| Hero H1 (over film, arrives at scrub ~.15) | We take businesses to the level their ambition deserves. |
| Hero support (scrub ~.45) | Watch how — or scroll and let the guide show you. |
| Callout 01 | I'll walk you through. |
| Callout 02 | Five crafts. One system. |
| Callout 03 | This is how a project actually runs. |
| Callout 04 | The rules we don't break. |
| Callout 05 | Ask anything. These come up a lot. |
| Callout 06 | Your turn. |
| CTA head (Archivo, `--font-footer`) | TAKE IT HIGHER. |
| CTA line | One conversation. Both founders. — hello@convenium.studio |
| Colophon | Robot: "REPO Robot" by OscarLomas3D (CC BY 4.0) |

## 6. Accent budget (rendered red, whole page)

Exactly 4 uses: (1) robot eye emissive (chili, in film AND live — counts once,
it is the same eye), (2) nav-active underline (site chrome), (3) callout
connector rule on noir sections (chili graphic), (4) CTA email hover underline
(cherry on cotton). Grep/audit to confirm nothing else renders red.

## 7. Motion & perf rules

- All robot/camera motion on the master timeline; DOM animates transforms/
  opacity/clip only. Lenis is already global (`reference/SmoothScroll.tsx`).
- Renderer: pixelRatio ≤1.5, no shadow maps, `powerPreference:
  "high-performance"`, transparent clear. Render on the shared gsap ticker,
  gated by IntersectionObserver + `document.hidden` (clone MonolithScene).
  Dispose geometry/materials/textures/renderer on unmount.
- Robot is 8.1k tris — no LOD needed; one directional warm key + low ambient.
- `will-change` only while a section is active. Target 60fps at 1440×900,
  never below 30 on mid mobile.
- `gsap.matchMedia`:
  - `<768px`: NO pinned Stage A (FIX6 rule) — hero film becomes a poster +
    short autoplay (non-scrub) intro; live canvas replaced by 2–3 static robot
    renders (captured from the scene) placed per chapter; callouts become
    simple in-view reveals.
  - `prefers-reduced-motion`: no canvas, no film scrub — posters + opacity
    reveals only; callout copy still present.
- Film absent at build time is a supported state: Stage A renders
  `assets/hero-first-frame.png` (or an ink panel before that exists) with the
  H1; Stage B works fully. The page must build and run clean with no video.

## 8. Verification

`npm run build` clean → Playwright full-page at 1440×900 and 390×844 → scrub
down AND up through the full page — robot position/callouts must be correct in
both directions → console clean after scroll + hovers → accent-count audit (§6)
→ colophon credit present (§0) → fps sanity per gsap-performance → reduced-
motion pass → list every deviation from this spec, chapter by chapter.
