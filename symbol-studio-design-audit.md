# Symbol Studio Design Audit

> Read-only visual/interaction audit of [https://www.symbolstudio.pl/en/](https://www.symbolstudio.pl/en/)  
> Viewports: Desktop **1440×900**, Mobile **390×844**  
> Method: Puppeteer computed styles + viewport screenshots. No source, fonts, media, or tracking data downloaded.  
> Runtime: ~21s primary pass + ~19s remasure (~40s total, under 15-minute cap).  
> Evidence: `audit-shots/` (5 PNGs) · `audit-notes.json`

**Legend:** **Measured** = `getComputedStyle` / geometry · **Observed** = screenshot / live interaction · **Estimated** = inferred. Confidence: High / Medium / Low.

---

## 1. Executive summary

Symbol Studio’s English homepage is a **Framer-built branding-studio portfolio**: light gray canvas, black UI chrome, and a vivid orange-red accent (`rgb(254, 85, 46)` ≈ `#FE552E`). The first viewport is a **two-column hero** (value prop left, showreel right) under a **fixed center nav pill** with logo left and CTA / locale right. Below: oversized brand typography, a **projects grid** (stat tile + case cards), manifesto / process narrative, testimonials, FAQ, and services/footer.

Typography exposes **Rules** (Regular / Medium / Semibold) via `document.fonts` and computed stacks, with Inter registered but largely unloaded. Interaction language is **soft, rounded UI** (8–10px radii on buttons/cards) plus scroll-driven oversized type; many hover effects appear **JS/Framer-driven** (CSS `transition-duration` often `0s` on sampled nodes), so hover deltas were hard to capture from computed styles alone.

**Use for NOIR&CO:** borrow layout rhythm, nav chrome pattern, project-card proximity, and accent discipline — not the brand mark, orange identity, Rules font, or copy.

Overall confidence: **High** for structure/colors/geometry; **Medium** for type scale on nested Framer nodes; **Low–Medium** for animation timing and hover grammar.

---

## 2. Homepage section map

Page scroll height (desktop): **14084px** (Measured, High). Content width ≈ **1408px** with ~**16px** side inset (Measured, High).

| # | Section (paraphrased) | Approx. start Y | Approx. height | Width | Kind | Conf. |
|---|----------------------|-----------------|----------------|-------|------|-------|
| 1 | **Hero** — studio pitch + showreel | 180 | ~720px | Contained (~1408) | Measured | High |
| 2 | **Manifesto** — “we design brands…” + large type / marquee | 900 | ~2042px | Contained | Measured | High |
| 3 | Spacer / transition block | 1566 | ~300px | Contained | Measured | Medium |
| 4 | **Projects** — selected work grid + “100+” stat | 2942 | ~1167px+ | Contained | Measured | High |
| 5 | **Approach** — branding as advantage | 4109 | ~2797px | Contained | Measured | High |
| 6 | **Definition / method** statement | 6906 | ~1170px | Contained | Measured | High |
| 7 | **Testimonials** — “they trusted us” | 8076 | ~1753px | Contained | Measured | High |
| 8 | **Extra info** — “what else is worth knowing” | 9829 | ~1688px | Contained | Measured | High |
| 9 | **FAQ** | 11517 | ~1168px | Contained | Measured | High |
| 10 | **Services / about / footer cluster** | 12685 | ~1399px | Contained | Measured | Medium |

### Sticky / fixed / pinned (desktop)

| Element | Position | Size | Notes | Kind | Conf. |
|---------|----------|------|-------|------|-------|
| Center nav group | `fixed`, top ~20px, z-index 8 | 480×40 | Transform translateX(-240) centers the pill | Measured | High |
| Logo mark | `fixed`, top ~16px, z 7 | ~50×48 | Left chrome | Measured | High |
| “HOW TO START?” cluster | `fixed`, top ~20px, z 9 | ~205×40 | Right CTA | Measured | High |
| Cookie panel | `fixed`, bottom-right | ~400×192 | Persisted during session until accept | Measured | High |
| Full-viewport layer | `fixed`, z 10 | 1440×900 | Likely intro/overlay layer (“SYMBOLS DEFINE OUR WORLD”) | Measured | Medium |

### Desktop → mobile structural changes

| Aspect | Desktop 1440 | Mobile 390 | Kind | Conf. |
|--------|--------------|------------|------|-------|
| Hero layout | 2-column (~50/50 text \| showreel) | Stacked, **center-aligned** copy | Observed | High |
| Nav | Center segmented pill (5 items) | Logo + locale + CTA + **MENU** | Observed | High |
| Projects | ~3-column: intro/stat + 2 cards visible | Single-column stack (inferred) | Observed / Estimated | Medium |
| Brand title | Oversized edge-bleed type | Compact “SYMBOL STUDIO” kicker + stacked hero | Observed | High |
| Showreel | Rectangular rounded video tile + circular play | Irregular / masked media block | Observed | Medium |

---

## 3. Design tokens

### Core palette (computed)

| Role | Value | Hex (approx.) | Kind | Conf. |
|------|-------|---------------|------|-------|
| Page background | `rgb(236, 237, 239)` | `#ECEDEF` | Measured | High |
| Soft surface | `rgb(248, 248, 249)` | `#F8F8F9` | Measured | High |
| Primary text | `rgb(0, 0, 0)` | `#000000` | Measured | High |
| Body / muted ink | `rgb(27, 29, 34)` | `#1B1D22` | Measured | High |
| Secondary / meta gray | `rgb(116, 120, 129)` | `#747881` | Measured | High |
| Hairline / mute | `rgb(188, 190, 193)` | `#BCBEC1` | Measured | Medium |
| Accent (CTA / play) | `rgb(254, 85, 46)` | `#FE552E` | Measured | High |
| Nav / dark chrome | `rgb(0, 0, 0)` / `rgb(27, 29, 34)` | `#000` / `#1B1D22` | Measured + Observed | High |
| Card / light fill | `rgb(255, 255, 255)` | `#FFFFFF` | Measured | High |
| Overlay scrim | `rgba(0,0,0,0.16)` @ low opacity | — | Measured | Medium |
| Frosted / translucent | `rgba(255,255,255,0.42)` etc. | — | Measured | Medium |

**Note:** Unstyled `<a>` sampling sometimes returned browser default `rgb(0, 0, 238)` — **not** a brand token (Low confidence as intentional color).

### Light / dark transitions

| Zone | Surface feel | Kind | Conf. |
|------|--------------|------|-------|
| Hero / projects / FAQ | Light gray page | Observed | High |
| Project cards | White tiles on gray | Observed | High |
| Nav / play control | Near-black chrome | Observed | High |
| Accent moments | Orange CTAs only | Observed | High |

---

## 4. Typography

### Exposed families (`document.fonts` / computed — files not downloaded)

| Family | Weights seen | Status | Kind | Conf. |
|--------|--------------|--------|------|-------|
| **Rules Regular** | 400 | loaded | Measured | High |
| **Rules Medium** | 500 / normal | loaded | Measured | High |
| **Rules Semibold** | normal | loaded | Measured | High |
| **Rules Bold** | 700 | unloaded at capture | Measured | Medium |
| **Inter** | 400–900 | mostly unloaded | Measured | Medium |

Fallbacks in computed stacks: `"Rules Medium Placeholder", sans-serif`.

### Scale (desktop)

| Role | Sample | Size | Weight | Line-height | Transform | Color | Kind | Conf. |
|------|--------|------|--------|-------------|-----------|-------|------|-------|
| Hero statement | “We are a branding studio.” | **24px** | 400 (Medium face) | 31.2px (~1.3) | none | `#000` | Measured | High |
| Hero supporting | same face as hero | **24px** | 400 | 31.2px | none | `#000` | Measured | High |
| Section display (H2) | “WE DESIGN BRANDS…” | **40px** | 400 | 44px (~1.1) | **uppercase** | `#000` | Measured | High |
| Subhead (H3) | sample | **28px** | 400 | 36.4px | none | `#000` | Measured | Medium |
| Meta / labels | “SEE SHOWREEL”, timestamps | ~12px visual | — | — | **all-caps** (Observed) | black / gray | Observed + partial Measured | Medium |
| Nav / CTA labels | Home, HOW TO START? | ~12–14px visual | — | — | uppercase-ish labels | white/black on chrome | Observed | Medium |
| Cookie title | Cookie Settings | **16px** Rules Regular | 400 | 16px | none | `#000` | Measured | High |
| Mobile brand kicker | SYMBOL STUDIO | **12px** Rules Medium | 400 | 15.6px | **uppercase** | `#747881` | Measured | High |
| Mobile hero | We are a branding studio. | **14px** | 400 | 19.6px | none | `#000` | Measured | High |

**Capitalization rules (Observed, High):** Uppercase for manifesto / section titles and micro-labels; sentence case for hero pitch and body.

**Fluid type:** Clear step-down 24→14px hero between 1440 and 390 (Measured, High). Whether implemented via `clamp` vs breakpoints was **not** verified without source (Low).

---

## 5. Grid, spacing and proximity

| Measurement | Desktop | Mobile | Kind | Conf. |
|-------------|---------|--------|------|-------|
| Viewport | 1440×900 | 390×844 | Measured | High |
| Content width | ~1408px (~16px inset) | ~full width with ~24px gutters (Observed) | Measured / Observed | High / Medium |
| Body margin/padding | 0 | 0 | Measured | High |
| Hero text column | ~616px wide @ x≈48 | ~342px centered | Measured | High |
| Showreel video tile | ~392×221 | stacked below | Measured | High |
| Nav pill | 480×40 @ y=20 | replaced by MENU chrome | Measured | High |
| Project card | ~448×579–580, radius **10px** | stacked | Measured | High |
| Project media inset | ~432×269, radius **8px** | — | Measured | High |
| Page gutters | ~40px to first project column (x=40) | tighter | Measured | High |
| Card gap (projects) | ~8px between columns (496−40−448) | — | Measured | Medium |

**Proximity / grouping (Observed, High):**
- Hero: headline + supporting line share one left column; showreel label / time / play / thumbnail group on the right.
- Project cards: title + tagline + category **tight at top**; media centered below — not floating badges.
- Header: three clusters (logo \| nav pill \| locale+CTA) with clear separation.
- Hairline grid rules visible in hero (Observed) — thin light dividers, not heavy borders.

**Borders / radius:** Soft system — nav ~8px (Observed on black track), CTA **8px**, project cards **10px**, cookie card rounded (Observed ~12–16px). Sharp 0px on oversized type blocks.

**Overlap / crop:** Oversized “SYMBOLSTUDIO” type bleeds off-screen (Observed). Cookie card overlaps bottom-right content until dismissed. Mobile menu uses frosted overlay over page (Observed).

---

## 6. Navigation

### Desktop

| Property | Value | Kind | Conf. |
|----------|-------|------|-------|
| Placement | Fixed, top ~20px, horizontally centered | Measured | High |
| Track size | **480×40** | Measured | High |
| Track look | Black rounded pill; active segment white | Observed | High |
| Item size | ~**94×36**, radius ~6px, gap ~8px | Measured | High |
| Items | Home · Works · Services · About · Contact | Measured | High |
| Active | Home: white fill, dark text | Observed | High |
| Inactive | Dark fill, light text | Observed | High |
| Left | Logo mark ~50×48 fixed | Measured | High |
| Right | Locale circle + **HOW TO START?** orange CTA | Observed + Measured | High |
| Z-index | Nav 8, CTA 9, overlays 10 | Measured | High |
| Backdrop | none on sampled wrappers | Measured | Medium |

### Mobile

| Property | Value | Kind | Conf. |
|----------|-------|------|-------|
| Chrome | Logo left; locale + orange CTA + **MENU** right | Observed | High |
| MENU control | ~76×40 hit area | Measured | High |
| Open state | Near-full overlay; frosted stacked bars; large vertical links; orange **X** close | Observed | High |
| Link rows | ~370×78 hit targets | Measured | High |
| Close | Orange pill with X (replaces MENU) | Observed | High |

### Hover / selected

| State | Behavior | Kind | Conf. |
|-------|----------|------|-------|
| Active route | White segment in dark pill | Observed | High |
| Hover (nav/CTA) | No CSS property change on synthetic hover (`transition` 0s) — likely Framer/JS or pseudo not reflected | Measured miss | Low |
| Scroll | Fixed chrome stays pinned; no strong shrink detected in short scroll | Observed | Medium |

---

## 7. Component inventory

### Primary CTA — “HOW TO START?”

| Prop | Value | Kind | Conf. |
|------|-------|------|-------|
| Size | ~143–205×40 (wrapper vs fill) | Measured | High |
| Fill | `rgb(254, 85, 46)` | Measured | High |
| Text | black on orange (desktop fill sample) | Measured | High |
| Radius | **8px** | Measured | High |
| Padding | `0 16px` (fill node) | Measured | High |
| Leading mark | Dot / bullet before label | Observed | High |
| Position | Fixed top-right | Measured | High |
| Hover | Not captured via computed styles | — | Low |

### Nav segmented control

| Prop | Value | Kind | Conf. |
|------|-------|------|-------|
| Track | 480×40, black, ~8px radius (visual) | Measured + Observed | High |
| Segment | ~94×36, 6px radius, 8px gap | Measured | High |
| Active | White bg / dark text | Observed | High |
| Type | Compact sans / UI ~12px | Observed | Medium |

### Showreel control

| Prop | Value | Kind | Conf. |
|------|-------|------|-------|
| Label | “SEE SHOWREEL” + duration | Observed | High |
| Play button | Large dark circle, orange triangle | Observed | High |
| Media | Video ~392×221; rounded container (visual) | Measured + Observed | High |

### Project cards

| Prop | Value | Kind | Conf. |
|------|-------|------|-------|
| Size | ~**448×580** | Measured | High |
| Radius | **10px** | Measured | High |
| Surface | White `#fff` | Measured | High |
| Overflow | `hidden` on frame | Measured | High |
| Content | Title, tagline, category (e.g. FINANCE), media | Observed | High |
| Transform at rest | Near-identity matrix with tiny Y drift on some nodes | Measured | Medium |
| Stat tile | “100+” large translucent figure beside intro | Observed | High |

### Cookie card

| Prop | Value | Kind | Conf. |
|------|-------|------|-------|
| Size | ~400×192 desktop; floating bottom | Measured | High |
| Actions | Reject (light gray) + I accept (orange) | Observed | High |
| Accept fill | `rgb(254, 85, 46)`, radius 8px, white text on one sample | Measured | High |

### Pills / buttons language

Repeated **soft rectangle / pill** language for nav, CTA, locale, MENU, cookie actions — not sharp material design cards for chrome.

### Cursors

`auto` on body; `pointer` on links/media parents (Measured, High). No custom cursor file inspected.

---

## 8. Animation inventory

| Trigger | Elements | Direction / distance | Duration | Easing | Type | Kind | Conf. |
|---------|----------|----------------------|----------|--------|------|------|-------|
| Initial load | Hero + fixed chrome | Settle into place; possible intro overlay (“SYMBOLS DEFINE…”) | Not reliably timed | — | time-based | Observed | Medium |
| Scroll down | Oversized brand type, sections | Vertical reveal; type may translate/bleed | Stepped scroll ~1.5–2s in audit | — | scroll-linked | Observed | Medium |
| Scroll up | Same layers | Reverse reveal | — | — | scroll-linked | Observed | Medium |
| Hover nav / CTA | Segment / button | Visual affordance expected; **CSS delta not measured** | Framer/JS likely | — | hover | Estimated | Low |
| Hover project card | Card / media | Possible media shift (transform matrices present at rest) | Unknown (`0s` CSS) | — | hover | Estimated | Low |
| Mobile menu open | Overlay + link list + X | Fade/blur overlay; list appears | ~0.3–0.7s (wait-based) | soft | time-based | Observed | Medium |
| Mobile menu close | Overlay | Reverse; MENU returns | ~0.3–0.5s | — | time-based | Estimated | Low |
| Resize 1440→390 | Layout | Collapse columns; swap nav mode | Immediate reflow | — | responsive | Observed | High |

**Reduced motion:** Environment was `no-preference` at capture. Site-specific `prefers-reduced-motion` overrides **not verified** (Low).

**Staggering:** Not confirmed; Framer sites often stagger section entrances — treat as **Estimated / Low** without scrub instrumentation.

---

## 9. Responsive behavior

| Topic | Finding | Kind | Conf. |
|-------|---------|------|-------|
| Breakpoints | Only 1440 vs 390 tested; nav mode change implies a mid breakpoint (likely ~768–1024) | Estimated | Low |
| Hero | 2-col → 1-col centered | Observed | High |
| Type | 24px → 14px hero; display titles shrink / reflow | Measured | High |
| Nav | Pill → MENU overlay | Observed | High |
| Projects | Multi-column cards → expect single column | Estimated | Medium |
| Margins | Desktop ~16–40px inset; mobile tighter side padding | Measured / Observed | Medium |
| Touch | MENU + large ~78px-tall rows replace hover nav | Measured + Observed | High |
| Cookie | Remains a floating card on both viewports | Observed | High |

---

## 10. Adaptable patterns for NOIR&CO

Original reinterpretation — not a clone:

1. **Tripartite fixed header** — mark | primary nav | utility+CTA, with nav as one composed control.
2. **Hero split** — one thesis column + one media/proof column; keep first viewport free of stats strips.
3. **Accent scarcity** — one hot accent for primary actions only; page stays neutral.
4. **Soft radius scale** — pick ~8px controls / ~10–12px media frames and reuse everywhere.
5. **Project tiles** — white (or inverted) frames on a quieter field; title+meta tight above media; category as micro-label.
6. **Oversized brand type as scroll scenery** — large wordmark/phrase as atmospheric divider (own typeface, own wording).
7. **Mobile full-bleed menu** — frosted or solid takeover, large type rows, explicit close, keep CTA reachable.
8. **Showreel pattern** — duration + play affordance beside a single hero media plane.
9. **Section pacing** — alternate concise statements with denser work/proof blocks.
10. **Measure discipline** — keep reading columns ~600px-class on desktop even when the canvas is wide.

---

## 11. Elements that should not be copied directly

- Symbol Studio logo geometry and wordmark
- Orange accent as *their* brand signature (`#FE552E` pairing with Rules)
- Rules / proprietary webfont files (license separately or choose alternatives)
- Project photography, video showreel, client marks, case titles
- Verbatim slogans and section copy
- Framer structure, class names, or motion presets reverse-engineered from minified code
- Cookie/vendor tooling and any tracking payloads
- Exact nav label set presented as NOIR&CO IA without rewriting

---

## 12. Uncertainties and observations that could not be verified

- **Hover grammar:** Synthetic and real mouse moves often showed **no computed-style delta** (`transition-duration: 0s`). Visual hovers may be canvas/Framer overrides — confidence Low.
- **Exact animation curves / scrub timelines:** Not reverse-engineered from minified JS (by design).
- **Intermediate breakpoints:** Not swept between 390 and 1440.
- **Cookie accept:** Banner often remained in screenshots; dismissal selectors were unreliable — layout under the card may differ after accept.
- **Nested Framer nodes:** Parent wrappers frequently report `font-size: 12px` / `sans-serif` while text children use Rules — samples taken from text nodes where possible; some UI labels still Low confidence.
- **Custom cursors / WebGL:** Not confirmed beyond standard `pointer`.
- **Reduced-motion path:** Not toggled in OS preferences during the audit.
- **Intro fixed layer** (“SYMBOLS DEFINE OUR WORLD”): Present in fixed-node list; full choreography not timed.

### Artifacts

| File | Role |
|------|------|
| `audit-shots/01-desktop-initial.png` | Desktop first viewport |
| `audit-shots/02-desktop-projects.png` | Projects grid |
| `audit-shots/03-desktop-hover.png` | Hover attempt / hero chrome |
| `audit-shots/04-mobile-initial.png` | Mobile first viewport |
| `audit-shots/05-mobile-menu-open.png` | Mobile menu open |
| `audit-notes.json` | Machine measurements (not site source) |
| `scripts/audit-symbolstudio.mjs` | Primary 15-min capped auditor |
| `scripts/remasure-symbolstudio.mjs` | Focused Framer remasure |

---

*Prepared for original NOIR&CO design inspiration · 2026-07-17*
