# Media Guide — Convenium Studio `/services`

Everything needed to produce the imagery for the Services page. Nothing here is a
suggestion about layout or code — the layout is fixed. What is open is **the five
images (or five three-frame sets) that sit inside it.**

Live page: `http://localhost:3000/services`

---

## 0. What's in this folder

| Folder | What it is |
| --- | --- |
| `01_screenshots/` | The page as it renders today. Full page at 1440 and 390, plus one crop per service panel and each media slot at true pixel size. |
| `02_current_placeholders/` | The five images currently in the build. These are placeholders — they are the thing being replaced. |
| `03_logo/` | The Convenium mark as SVG + PNG, light and dark, with and without the accent bar. |
| `04_brand/` | Colour token sheet and typeface sheet as PNGs. |
| `MEDIA-GUIDE-SERVICES.md` | This file. |

Start with `01_screenshots/services-desktop-full-1440.png` to see the whole page,
then read section 4 for the per-slot briefs.

Two small things about the screenshots: the current placeholder images were
composited back into the full-page shots (the raw capture lazy-loads them as grey
boxes), and the little dark circle near the `01` is the site's custom cursor, not a
design element.

---

## 1. The page in one paragraph

Services is a light page — warm cream ground, black type, hairline rules, one red
accent. It opens with a heading (**FIVE DISCIPLINES. ONE CONNECTED SYSTEM.**) and a
numbered index of the five capabilities. Below that, the five services stack
vertically. On desktop a giant numeral sits sticky on the left and changes as you
scroll; the copy and the image live in the right column. The panel you're reading is
at full opacity, the others sit at 55% — so images are seen dimmed as often as they
are seen at full strength. The page closes on a black footer.

The five services, in order:

| # | Service | Role line on the page |
| --- | --- | --- |
| 01 | Branding | Identity systems built to be recognized and remembered. |
| 02 | Graphic Design | Editorial, print and visual communication with a point of view. |
| 03 | Web + App Development | Digital products designed and engineered as one system. |
| 04 | Media Creation (AI) | Cinematic stills and film made with directed AI pipelines. |
| 05 | SMM | Social presence with the same standards as the brand itself. |

---

## 2. Hard specs — read this before making anything

### The slot

| Property | Value |
| --- | --- |
| Aspect ratio | **16 : 10** (not 16:9) |
| Rendered size, desktop 1440 | 794 × 496 px |
| Rendered size, desktop 1920 | 1091 × 682 px |
| Rendered size, mobile 390 | 358 × 224 px |
| **Deliver at** | **2400 × 1500 px** (covers 2× on a 1920 screen) |
| Corner radius | 8 px — applied in code, deliver square corners |
| File format | JPG, quality 82–88, sRGB. Target under 400 KB each. |

### What the code does to your image after you hand it over

Do not pre-apply any of this — it's already in the CSS and would double up:

- `object-fit: cover` — the image fills the slot and overflows are cropped
- `transform: scale(1.08)` — an 8% punch-in, so ~3.7% is lost from every edge
- `filter: grayscale(0.12) contrast(1.05)` — a light desaturation and contrast lift
- Desktop parallax: the image drifts 8% vertically as the panel scrolls past

**Safe area:** keep the subject inside the central **92% horizontally and 78%
vertically**. Anything near the top or bottom edge will be eaten by the parallax.

### Naming

```
01-branding-a.jpg      02-graphic-design-a.jpg      03-web-app-a.jpg
01-branding-b.jpg      02-graphic-design-b.jpg      03-web-app-b.jpg
01-branding-c.jpg      02-graphic-design-c.jpg      03-web-app-c.jpg

04-media-ai-a.jpg      05-smm-a.jpg
04-media-ai-b.jpg      05-smm-b.jpg
04-media-ai-c.jpg      05-smm-c.jpg
```

`-a` is the resting frame — the one that must work alone. If only one frame per
service ships, it's `-a`.

---

## 3. Multi-frame sets — how the animation is meant to work

Each slot takes **three frames that cross-fade in place**, not a video and not a
slideshow of unrelated pictures.

Rules for a set:

1. **Same place, same light, same lens.** The three frames are three moments of one
   scene, as if a camera sat still and something inside the frame changed. They are
   not three different subjects.
2. **One thing changes per step.** A hand moves, a sheet is turned, a light shifts, a
   screen state advances. If a viewer can't name what changed, the set is too subtle;
   if the frame jumps to a new location, it's too much.
3. **Frame the same.** Horizon, table edge, wall line and the main mass stay within a
   few pixels between frames. A cross-fade exposes any misalignment brutally.
4. **Loop-safe.** `c` should be able to fade back to `a` without a visible jump.

Intended timing (for the developer, so you know what you're cutting for):

| Property | Value |
| --- | --- |
| Hold per frame | 2.8 s |
| Cross-fade | 600 ms |
| Trigger | Only while the panel is the active one and in view |
| Reduced motion | Frame `a` only, no cycling |

> **Note for the dev handoff:** the build currently renders **one static `<Image>`**
> per service (`components/sections/services/ServicesStack.tsx`). Cycling three
> frames needs a small component change. Producing the sets is not wasted work —
> frame `a` drops straight into the current build either way.

---

## 4. The five briefs

### Shared photographic language — applies to all five

Photorealistic European creative-studio art direction. Controlled, editorial,
tactile. Materials: deep black, warm bone white, dark natural wood, brushed metal,
concrete, uncoated paper. Strong negative space and one clear subject per frame.
Directional daylight or a single hard key — never flat overhead office light. Subtle
35mm grain. Rich blacks that keep detail; soft highlight rolloff.

Never: orange, cyan, magenta or teal casts. Gradients, glows, lens flares, bokeh
hearts. Glossy sci-fi styling. Stock-photo smiles or eye contact with the camera.
Watermarks, captions, fake logos, or any legible text — **all typography on this site
is set in the interface, never baked into a picture.** Any lettering that appears in
frame must be abstract and unreadable.

The images run under a `grayscale(0.12)` filter, so anything that depends on colour
to read will lose it. Compose for tone and shape first.

Colour discipline: cream, bone, black, warm grey, wood, steel. **Red appears only as
a single small object at most, and in at most two of the five sets** — it's the brand
accent and it stops working if it's everywhere. If the shot doesn't need red, leave
it out.

---

### 01 — Branding

*Identity systems built to be recognized and remembered.*
Scope shown on the page: positioning and naming · logo and mark · identity systems ·
brand guidelines.

**What it has to say:** a system being applied, not a logo being admired.

**Scene:** a pin-up wall or long studio table with an identity system laid out — a
grid of bone-white sheets carrying abstract, unreadable typographic forms and black
geometric marks at varying scale. One person, seen from behind or cropped at the
shoulder, adjusts a sheet. Hard side light from a window off-frame left.

| Frame | What changes |
| --- | --- |
| `a` | Wide, all sheets aligned, person's hand just leaving the top-right sheet |
| `b` | Same frame, person has stepped half a pace left, one sheet now hangs slightly proud |
| `c` | Same frame, person out of shot, wall settled and still — the system left standing on its own |

**Prompt:**

> Photorealistic editorial photograph of a design studio pin-up wall, a precise grid
> of bone-white A3 sheets showing abstract unreadable typographic forms and black
> geometric marks at varying scale, one person seen from behind at the left edge
> adjusting a sheet, hard directional daylight raking from off-frame left, warm cream
> and deep black palette, concrete floor, matte uncoated paper texture, 35mm film
> grain, shallow but controlled depth of field, 16:10, no legible text, no logos, no
> watermark

---

### 02 — Graphic Design

*Editorial, print and visual communication with a point of view.*
Scope: editorial layout · print collateral · packaging · visual communication.

**What it has to say:** print you can feel — weight, ink, edge.

**Scene:** a table top, near-overhead, of finished printed matter: a large-format
book lying open with a stark black-and-bone spread, a stack of uncoated cards with
visible edge, folded paper with a crisp crease, a black box. Hands enter frame.
Single hard key from upper left, deep shadow at lower right.

| Frame | What changes |
| --- | --- |
| `a` | Book closed, everything squared to the table edge |
| `b` | A hand turns the book open to a full-bleed black spread |
| `c` | Hand withdrawn, spread open and flat, one card slid slightly out of the stack |

**Prompt:**

> Photorealistic overhead editorial photograph of a design studio table, a
> large-format book open to a stark black-and-bone spread with abstract unreadable
> typographic composition, a stack of uncoated bone cards showing raw paper edge, a
> crisply folded sheet and a matte black box, two hands entering frame from the
> bottom, single hard key light from upper left with deep shadow lower right, warm
> cream and deep black palette, tactile uncoated paper, 35mm film grain, 16:10, no
> legible text, no logos, no watermark

---

### 03 — Web + App Development

*Digital products designed and engineered as one system.*
Scope: websites and products · design systems · front-end engineering · Webflow /
Framer builds.

**What it has to say:** design and engineering at the same table. This one has
people in it — it's the human beat in the sequence.

**Scene:** two people at a long dark working table reviewing a layout on a large
matte display, observed from a step behind and to the side. Screen content is
abstract: bone and black rectangles, a visible grid, no readable UI copy. Cool
window light from the left, a warm practical lamp on the right. Neither person looks
at the camera.

| Frame | What changes |
| --- | --- |
| `a` | Both seated, one pointing at the upper region of the screen |
| `b` | The screen has advanced to a denser layout state, second person leaning in |
| `c` | Screen settled, both leaned back, hands off the table |

**Prompt:**

> Photorealistic candid editorial photograph of two designers at a long dark wood
> table in a minimal studio, reviewing an abstract bone-and-black wireframe layout on
> a large matte display, seen from behind and slightly to the side, no eye contact
> with the camera, cool daylight from a tall window at left and a single warm
> practical lamp at right, warm cream and deep black palette, brushed metal and
> concrete, 35mm film grain, natural unposed posture, 16:10, screen shows abstract
> rectangles and grid only with no legible text, no logos, no watermark

---

### 04 — Media Creation (AI)

*Cinematic stills and film made with directed AI pipelines.*
Scope: directed AI pipelines · cinematic stills · film and motion · post-production.

**What it has to say:** direction, not magic. A person deciding what the machine
makes. This is the one that most wants to become a robot-with-glowing-eyes cliché —
it must not.

**Scene:** a dark grading or review room. A single figure in silhouette against a
large display carrying an abstract, cinematic, unreadable frame — deep shadow, one
warm highlight. Physical objects present: a colour chart, a lens, a printed
contact-sheet on the desk. The light source is the screen itself.

| Frame | What changes |
| --- | --- |
| `a` | Figure still, screen holding a dark frame |
| `b` | Screen frame has changed — brighter, different composition; light on the figure shifts with it |
| `c` | Figure has turned toward the printed contact sheet on the desk, screen dim |

**Prompt:**

> Photorealistic cinematic photograph of a dark colour-grading room, one person in
> near-silhouette facing a large display that shows an abstract unreadable cinematic
> frame, the screen is the only light source and rims the figure warmly, a colour
> reference chart, a camera lens and a printed contact sheet on the desk in
> foreground, deep rich blacks with preserved shadow detail, warm bone highlights, no
> blue or cyan cast, 35mm film grain, 16:10, no legible text on screen, no interface
> elements, no logos, no watermark, not science fiction

---

### 05 — SMM

*Social presence with the same standards as the brand itself.*
Scope: channel strategy · content systems · community management · platform-native
formats.

**What it has to say:** a content system run with the same rigour as print. Not
phones-and-emojis.

**Scene:** a content planning surface — a wall or table grid of small printed
frames pinned in rows, each an abstract crop of the same visual world, arranged like
a publishing calendar. One phone lies face-down or shows an abstract bone-and-black
image with no interface. A hand repositions one frame in the grid.

| Frame | What changes |
| --- | --- |
| `a` | Grid complete and even |
| `b` | A hand lifts one frame out, leaving a gap in the row |
| `c` | The frame is back, placed in a different position — the grid re-ordered |

**Prompt:**

> Photorealistic editorial photograph of a content planning wall, small printed
> square frames pinned in even rows like a publishing calendar, each frame an
> abstract black-and-bone image, one hand entering from the right repositioning a
> single frame, a phone lying on the shelf below showing an abstract image with no
> interface, warm cream wall, matte black shelf, hard directional daylight from the
> left, uncoated paper texture, 35mm film grain, 16:10, no legible text, no app
> interfaces, no logos, no watermark

---

## 5. Colour

See `04_brand/colour-tokens.png`. Never sample a colour from a screenshot — JPEG and
the page's grain overlay shift the values.

| Token | Hex | Where it lives |
| --- | --- | --- |
| Noir | `#1B1717` | Dark sections, footer, headings on cream |
| Cotton | `#EDEBDD` | The ground of this whole page |
| Paper | `#F5F3E8` | Lifted light surface |
| Ink | `#241F1F` | Body copy on cotton |
| Gray | `#6E6963` | Metadata, secondary copy on cotton |
| Gray on noir | `#A8A29A` | Eyebrows inside dark sections |
| Hairline | `#D6D2C2` | Every rule and divider on the page |
| **Cherry** | `#810100` | The accent. Solid red field; accent text on cotton. The "Capabilities" eyebrow and the logo accent bar are this. |
| Maroon | `#630000` | Depth only — hover fills, borders. **Never text.** |
| Chili | `#D73B3E` | Graphic-only on noir; display type 24px and up |
| Chili 300 | `#E5595C` | Accent text at body size on noir |

The red rule, in short: **cherry is the red.** Maroon is a shadow of it and never
sits next to it as an equal. Chili only exists on black. Gold is retired — if you
see gold anywhere in older files, ignore it.

---

## 6. Typography

See `04_brand/typefaces.png`. All three are free on Google Fonts.

| Role | Face | Used on this page for |
| --- | --- | --- |
| Display | **Archivo Black** | `FIVE DISCIPLINES...`, the giant numerals, `BRANDING`, the footer wordmark |
| Editorial serif | **Newsreader** | Body copy, the italic role line, the scope lists |
| UI / metadata | **Inter** | Nav, the `CAPABILITIES` eyebrow, service names in the index |

Working values, if you need to mock anything up:

- Display line-height `0.9`, uppercase, tracking `-0.02em` to `-0.03em`
- Serif body line-height `1.35`, 18 px mobile → 22 px desktop
- Eyebrows 12–14 px, uppercase, restrained tracking
- Radii: media `8px`, cards `10px`, controls `8px`
- Spacing scale is base-8: 8 / 16 / 24 / 40 / 48 / 80 / 120

---

## 7. Logo

`03_logo/` contains the Convenium mark. It's a **density ramp** — twelve bars whose
heights follow a 1.18 geometric progression with a constant gap. Read bottom-up it's
raw input refining into systematic output; read top-down it's one hairline
accumulating into full weight. It isn't decorative, so don't redraw or restyle it.

| File | Use |
| --- | --- |
| `mark-full-*.svg` | 12 bars. For 32 px and above. |
| `mark-compact-*.svg` | 5 bars. For 18–32 px — this is what's in the site header. |
| `mark-micro-noir.svg` | 3 bars. Survives a 16 px favicon. |
| `*-accent.svg` | One bar (the 4th from top) carries the accent — cherry on cream, chili-300 on black. |
| `lockup-on-cotton-4x.png` | The header lockup as it actually renders, at 4× — reference for mark-to-wordmark proportion. |
| `*-512.png` | 512 px PNG of each, for anything that can't take SVG. |

Rules:

- Clear space around the mark = **half the mark's width** on every side.
- Wordmark is Archivo Black, uppercase, at `0.62×` the mark's height, tracking
  `+0.015em`, horizontally scaled to `94%`.
- The mark is monochrome plus **at most one** accent bar. Never multi-coloured.
- On cream use noir; on black use cotton. No outlines, no shadows, no gradients.
- Don't place the mark over a photograph — it's a fine horizontal stripe pattern and
  it disappears.

---

## 8. Absolute no-list

- No readable text, numbers, logos or UI copy baked into any image
- No gradients, glassmorphism, glow, lens flare or decorative shadow
- No orange, cyan, magenta or teal — and no gold
- No stock-photo eye contact or performed smiles
- No literal elevator imagery, arrows or "level" icons
- Don't pre-apply the crop, the 1.08 punch-in, or the grayscale/contrast filter
- Don't hand back 16:9 — the slot is 16:10 and the difference gets cropped off the
  top and bottom
- Anything invented as fact (a client, an award, a real place) is out — these are
  studio-world images, not documentary claims

---

## 9. Delivery checklist

- [ ] 15 files (5 services × 3 frames) — or 5 files if shipping `-a` only
- [ ] 2400 × 1500 px, JPG, sRGB, under 400 KB each
- [ ] Named per section 2
- [ ] Within each set: identical framing, one clear change per step, `c` loops to `a`
- [ ] Subject inside the central 92% × 78% safe area
- [ ] No legible text anywhere in frame
- [ ] Red used in at most two of the five sets, one small object at most
- [ ] Checked at 55% opacity — the images sit dimmed whenever the panel isn't active
- [ ] Checked small: at mobile the slot is only 358 × 224
