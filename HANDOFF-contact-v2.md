# Handoff: /contact-v2 — "The Threshold"

## Overview

A new contact page for Convenium Studio at `/contact-v2`. It does not replace
`/contact`; nothing under `components/sections/contact/` or `app/(interior)/contact/`
may be edited.

The page has one job: get a qualified inquiry from a founder-led or mid-market
company, and — because `POST /api/inquiry` returns **503 DELIVERY_NOT_CONFIGURED**
for every valid submission today — hand that inquiry over to email without losing a
word of it when the form cannot deliver.

Three full-bleed bands, light → dark → light. The middle band splits into two tracks
with a 1px chili hairline standing at the exact centre of the composition: on the
left, what happens after you press send and by when; on the right, the form.

**1920 is the primary target.** Every number below was measured on a rendered comp
using the site's own font files, not estimated. Where a number is derived rather than
measured it says so.

---

## Files to create

| File | Kind | Notes |
|---|---|---|
| `app/(interior)/contact-v2/page.tsx` | server | metadata + composition only |
| `content/contact-v2.ts` | data | all page-specific copy; re-exports nothing, imports the shared values |
| `components/sections/contact-v2/ContactThreshold.tsx` + `.module.css` | server | section 1 |
| `components/sections/contact-v2/ContactAscent.tsx` + `.module.css` | server | section 2 shell: grid, seam, composes the two below |
| `components/sections/contact-v2/AscentLedger.tsx` + `.module.css` | server | the numbered timetable + fit statement |
| `components/sections/contact-v2/InquiryForm.tsx` + `.module.css` | **client** | `"use client"` |
| `components/sections/contact-v2/Seam.tsx` | **client** | the animated hairline; needs GSAP |
| `components/sections/contact-v2/DirectLine.tsx` + `.module.css` | server | section 3 |

Do **not** create a new validator, a new API route, or a new inquiry type.
`InquiryValues`, `InquiryErrors`, `initialInquiryValues` and `validateInquiry` are
imported from `@/components/sections/contact/inquiry` exactly as `/contact` does.

`app/(interior)/contact-v2/page.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Convenium Studio. We reply to every inquiry within two business days.",
};
```

The root template appends `— Convenium Studio`, so the tab reads
`Contact — Convenium Studio`. Do not write the suffix yourself.

---

## House rules this page must obey

- Every top-level section is wrapped in `<HeaderZone theme="light" | "dark">` from
  `components/chrome/HeaderZone.tsx`, or the fixed header keeps the previous
  section's theme. Themes are given per section below.
- `.wrap`, `.eyebrow` and `.visually-hidden` are global classes in
  `styles/globals.css`. **This page does not use `.wrap`** — it needs a container
  ceiling that `.wrap` does not provide (see Layout). It does use `.visually-hidden`.
  It defines its own eyebrow style because the global `.eyebrow` is coloured for
  cotton grounds and section 2 is noir.
- Reveals come from `components/motion/InteriorReveal.tsx`. The driver
  `InteriorReveals` is already mounted by `app/(interior)/layout.tsx`; the wrappers
  only emit `data-interior-reveal` attributes.
- Motion constants come from `components/motion/motion.ts`. GSAP is imported from
  `components/motion/gsap.ts`, never from the package.
- Icons come only from `components/ui/Icons.tsx`. This page uses **none of them** —
  see Assets.
- Styling is CSS Modules, flat class names, media queries appended at the foot of
  each file. There is no `Button`, `Input` or `Container` primitive.
- Nav and footer are root-level; the page renders inside `<main>`. Lenis smooth
  scroll, grain, cursor and the page-enter transition are supplied by the interior
  layout — do not re-add them.

---

## Design tokens

Every value comes from `styles/tokens.css`. **No raw colour value may appear in this
page's CSS.** Ratios below are computed by `apollo/lib/contrast.mjs`; the full run is
at `_apollo/evidence/contrast-report.txt`.

| Token | Value | Role on this page | Rule — where it may NOT go |
|---|---|---|---|
| `--color-noir` | `#1b1717` | Ground of section 2 | Never as text on any red |
| `--color-cotton` | `#edebdd` | Ground of sections 1 and 3. All text on noir (14.84:1). Text on the cherry button (9.05:1) and on maroon (11.45:1). The focus ring inside section 2 | Never a ground inside section 2 |
| `--color-ink` | `#241f1f` | Body text on cotton — 13.58:1 | Never on noir |
| `--color-gray-on-noir` | `#a8a29a` | Eyebrows, field labels, resting field rules, helper microcopy, the preview border, the quiet-button rule — all on noir, 7.02:1 | Never on cotton. Never as an error colour |
| `--color-accent` (cherry) | `#810100` | The page's one solid colour field: the primary button. The 2px underline on the section-3 email. The `:focus-visible` ring on **cotton** grounds only | Never a focus ring on noir — cherry on noir computes to **1.64:1** against a 3.0 requirement. Never text on noir. Never two solid cherry fields at once |
| `--color-accent-deep` (maroon) | `#630000` | The hover, active and pending fill of the cherry button — the depth step it exists for | Never text. Never sitting beside cherry as a peer |
| `--color-accent-graphic` (chili) | `#d73b3e` | The seam. The step numbers at 32px display. The 2px invalid field rule. The 2px rule that opens the handover block. The consent link underline. All on noir, 3.88:1 — legal for graphics and ≥24px display | Never text below 24px. Never on cotton |
| `--color-accent-on-noir` (chili-300) | `#e5595c` | Field error messages at 13px and the label of an invalid field — 5.01:1 | Never as a large graphic; chili owns that |
| `--color-paper` | `#f5f3e8` | **Unused, deliberately.** Paper on cotton computes to 1.08:1 | Do not introduce it |
| `--color-hairline` | `#d6d2c2` | **Unused, deliberately.** 1.26:1 on cotton | Sections 1 and 3 use space, not rules |
| `--color-gray` | `#6e6963` | Unused | — |

Gold `#B18A46` does not appear. No Symbol Studio strings, marks, project names, the
Rules font, or `#FE552E`.

**Type tokens.** `--font-family-display` (Archivo Black, weight 400 only),
`--font-family-serif` (Newsreader, 400/500, roman and italic available),
`--font-family-ui` (Inter, 400/500/600). Never reference `--font-archivo-black`,
`--font-newsreader` or `--font-inter` in component CSS.

**Page-local tokens.** Declare these on the page's outermost element, not on `:root`:

```
--cv2-h1:           clamp(3rem, 2.07rem + 3.81vw, 6.5rem);
--cv2-step-label:   clamp(1.375rem, 1.19rem + 0.76vw, 1.75rem);
--cv2-email:        clamp(1.25rem, 0.4rem + 3.4vw, 3.5rem);
--cv2-ledger-max:   560px;
--cv2-form-max:     760px;
--cv2-control-max:  376px;
--cv2-page-max:     1920px;
```

`--cv2-h1` is `--font-hero` with the ceiling raised. It has the **same slope and the
same values at 375 and 1440** (48px and 87.98px), so up to 1440 this page's headline
matches every other interior H1 exactly; above 1440 it keeps growing to 104px, where
`--font-hero` freezes. That freeze is the measured reason `/contact` fails at 1920.

---

## Layout

### Container

`.wrap` carries padding only and no ceiling, which is why `/contact` renders a
938px-wide `Company` input at 1920 and a 644px one at 2560 (measured). This page uses
its own container, following the same shape as
`components/sections/about/monolith/AboutChapters.module.css:11-18`:

```
width: 100%;
max-width: var(--cv2-page-max);   /* 1920 */
margin-inline: auto;
padding-inline: var(--space-container);   /* 16px at 375 → 40px at ≥1440 */
```

Above 1920 the composition stops growing and centres; the section **grounds still
bleed to the viewport edge**, so put the background on the `<section>` and the
container on an inner `<div>`.

### Vertical rhythm

| Section | HeaderZone | Ground | Padding |
|---|---|---|---|
| 1 · Threshold | `light` | `--color-cotton` | top `clamp(120px, 18vh, 200px)`, bottom `clamp(56px, 7vh, 96px)` |
| 2 · Ascent + Form | `dark` | `--color-noir` | block `clamp(72px, 9vh, 120px)` |
| 3 · Direct line | `light` | `--color-cotton` | block `clamp(72px, 9vh, 120px)` |

The top padding of section 1 uses `vh`, so it varies with viewport height: 162px at
900px tall, 194px at 1080. That is intended — it keeps the headline clear of the
fixed nav (which occupies 20–60px from the top) on short laptop screens.

`light → dark → light` is not decoration: the fixed 40px nav must never straddle two
grounds, so each band is full-width and single-ground, and its `HeaderZone` theme is
unambiguous.

### Section 2 — the split

Below 1280 the two tracks stack. The form track carries
`border-top: 1px solid var(--color-accent-graphic)` and
`padding-top: clamp(48px, 6vw, 72px)`; the seam is that horizontal rule.

At **1280 and above**:

```
display: grid;
grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
column-gap: clamp(64px, 7vw, 160px);
align-items: start;
position: relative;
```

and the form track drops its border-top and top padding.

The seam is a **real element**, not a `::before`, because GSAP must be able to target
it: `<span className={styles.seam} aria-hidden="true" />` as the grid's first child,
`position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background:
var(--color-accent-graphic);`, hidden below 1280.

Because the container is centred, the grid's 50% is the viewport's 50%. Verified:
seam at x=713 vs viewport centre 712.5 at 1440; 953 vs 952.5 at 1920; 1273 vs 1272.5
at 2560.

The ledger is capped at 560px and the form at 760px, both left-aligned in their
tracks. **The air between the ledger's right edge and the seam is asymmetric on
purpose** — the seam belongs to the form side, because it is the thing you cross to
reach the form. Do not centre either column in its track.

### Focus order

Source order is focus order, and no `tabIndex` above 0 appears anywhere:
eyebrow (not focusable) → H1 → deck → ledger (not focusable) → Name → Email →
Company → Project type → Budget → Message → [honeypot, `tabindex="-1"`, skipped] →
consent checkbox → privacy link → Send → (after a failure) Copy inquiry → Try
sending again → mailto link → section-3 email link.

---

## Components

| Component | Props | Client? | Notes |
|---|---|---|---|
| `ContactThreshold` | none | no | Section 1. Wraps its own `HeaderZone theme="light"` |
| `ContactAscent` | none | no | Section 2 shell. `HeaderZone theme="dark"`, container, grid, `<Seam />`, `<AscentLedger />`, `<InquiryForm />` |
| `AscentLedger` | none | no | The four steps, `responseStatement`, the fit block |
| `Seam` | none | **yes** | One absolutely-positioned span plus one GSAP tween |
| `InquiryForm` | none | **yes** | The whole form and every state |
| `DirectLine` | none | no | Section 3. `HeaderZone theme="light"` |

Each section component owns its own `HeaderZone`; `page.tsx` just renders the three
in order inside a fragment.

---

## Responsive

Four named breakpoints carry real numbers. All figures are measured on the comp; the
layout width is the window width minus a 15px scrollbar, and both are given where
they differ.

### mobile — 375 (layout 375)

| | |
|---|---|
| Container | padding-inline 16px, content 343px |
| Columns | single, everything stacked |
| H1 | 41.83px, four forced line units, 147px tall, `-0.02em`, line-height 0.88 |
| Deck | serif 18px / 1.3, full width |
| Ledger | 343px wide (below its 560 cap), 766px tall |
| Step number | 32px chili; step label 22px; duration serif 18px |
| `fitStatement` | 18px, sets 6 lines |
| Seam | horizontal 1px chili rule above the form |
| Form | single column; every control 343px; textarea min-height 150px |
| Control height | 48px |
| Submit | 52 × 185px |
| Section 3 email | 20px display, link box 47px tall (padding-block 12px takes it over the 44px target minimum) |
| Section heights | 459 / 1865 / 302 · document 2626px |

### tablet — 768 (layout 753)

Changes from mobile: fields go **two-up at 640px** (`repeat(2, minmax(0,1fr))`, gap
28px row / 24px column); Message, consent and the actions row span both columns. The
H1 line units go inline at 768 and the headline wraps naturally to two lines against
`max-width: 11em`.

| | |
|---|---|
| Container | padding-inline 24.64px, content 704px |
| H1 | 62.38px, 2 lines, 110px tall |
| Ledger | 560px (cap reached), 644px tall |
| Form track | 704px; two-up controls 340px; textarea 704px |
| Control height | 50px |
| Section 3 email | 32.51px, box 60px |
| Section heights | 453 / 1599 / 357 · document 2409px |

### laptop — 1440 (layout 1425)

Changes from tablet: **the split turns on at 1280.** Two tracks, column-gap 100.8px
at this width, seam element visible, form track loses its horizontal rule.

| | |
|---|---|
| Container | padding-inline 40px, content 1345px |
| Grid | two equal tracks of 622px, gap 100.8px |
| Seam | x = 713 (viewport centre 712.5) |
| H1 | 87.98px, 2 lines, 155px tall, 968px wide |
| Ledger | 560px (capped), 694px tall |
| Form track | 622px; two-up controls 299px; textarea 622px |
| Control height | 54px |
| Section 3 email | 55.36px, box 84px |
| Section heights | 471 / 868 / 366 · document 1706px |

### desktop — 1920 and up (layout 1905) — the primary target

Changes from laptop, and what the extra width buys:

1. **The headline continues to 104px.** `--font-hero` stops at 88px; `--cv2-h1` does
   not. Two lines, longest 1102px, in a 1825px field.
2. **The ledger and the form both reach their caps** — 560px and 760px — so
   `fitStatement` sets in 4 lines instead of 5, and every single-line control is
   368px, comfortably under the 376px ceiling. No control on this page is ever wider
   than 376px at any width.
3. **The gap opens to 133px** and the air left of the seam becomes the composition.

| | |
|---|---|
| Container | padding-inline 40px, content 1825px |
| Grid | two tracks of 845.8px, gap 133.4px |
| Ledger | 560px at x=40, 695px tall — 285.8px of air to its right |
| Form track | 760px at x=1020, 707px tall — 125px of margin to its right |
| Seam | x = 953 (viewport centre 952.5) |
| H1 | 104px, 2 lines, 183px tall, max-width 1144px |
| Controls | 368px single-line, 760px textarea, 54px tall |
| Submit | 52 × 185px at x=1020 |
| Section 3 email | 56px display, 705px wide, box 85px |
| Section heights | 545 / 901 / 399 · document 1845px |

For comparison, `/contact` at this width is 2923px tall with a 1018px form card.

### 1024 and 2560 — confirmation only

**1024 (layout 1009):** still the tablet layout, stacked, since the split starts at
1280. Container content 948px, H1 72.13px on 2 lines, ledger at its 560 cap, form at
its 760 cap with 188px of unused track to its right. Nothing overflows; document
2433px.

**2560 (layout 2545):** the composition is capped at 1920 and centred — container
starts at x=352.5 — while the section grounds still bleed to both edges. Every inner
measurement is byte-identical to 1920, and the seam lands at x=1273 against a
viewport centre of 1272.5. Nothing stretches, nothing overflows.

---

## States and interactions

### Text fields, selects and the textarea

| State | Appearance | Behaviour |
|---|---|---|
| idle | 1px bottom rule `--color-gray-on-noir`. Value in Newsreader at `--font-body`, `--color-cotton`. Label above in Inter at `--font-label`, uppercase, `0.08em`, `--color-gray-on-noir` | — |
| hover | bottom rule → `--color-cotton` | 180ms, `--ease-out-sharp`. Nothing moves |
| focus-visible | **2px `--color-cotton` outline, offset 4px**, plus rule → cotton and `box-shadow: 0 1px 0 0 var(--color-cotton)` | The box-shadow doubles the rule without changing border-width, so nothing reflows. Do **not** inherit the global cherry ring here: cherry on noir is 1.64:1 |
| filled | rule stays `--color-cotton` after blur | Drive with a `data-filled` attribute from the value's truthiness, so a completed form reads as a column of solid rules |
| invalid | rule and its box-shadow → `--color-accent-graphic` (2px effective). Label → `--color-accent-on-noir`. Message below the control, Inter 13px/500, `--color-accent-on-noir` | `aria-invalid="true"`; `aria-describedby="{idPrefix}-{field}-error"` pointing at the message's `id`. Clearing the field's error on change removes both |
| disabled | not used — no field is ever disabled | — |

Control padding `12px 2px`, `border-radius: 0`, transparent background. Heights are a
consequence of `--font-body`: 48px at 375, 50px at 768, 54px at ≥1440 — all above the
44px minimum.

**The select chevron** must not be a coloured SVG data URI, because a data URI cannot
read a CSS variable and this page allows no raw colour values. Use a 12×8 wrapper
pseudo-element with `mask-image` carrying the path and
`background-color: var(--color-cotton)` supplying the colour, so the chevron recolours
with its state for free. `appearance: none` on the select, `padding-right: 32px`, and
`select option { color: var(--color-noir) }` so the native dropdown list stays legible.

### Consent checkbox

Visually hide the native input (`opacity: 0`, absolutely positioned, 20×20) and draw
a 20×20 box beside it. Idle: 1px `--color-gray-on-noir` border. Checked: filled
`--color-cotton` with a noir check mark — **cherry is not spent here**, because cherry
is a solid field exactly once on this page. Focus-visible: 2px cotton outline, offset
3px, on the box. Invalid: box border → `--color-accent-graphic`, message below in
chili-300, `aria-invalid` and `aria-describedby` on the input.

The whole row is the `<label>`, so the hit area is the full column at ~48px tall even
though the visual box is 20px. The inline privacy link inside the sentence is 18px
tall; that is allowed under WCAG 2.2 SC 2.5.8's inline exception.

### Primary button

| State | Appearance |
|---|---|
| idle | `--color-accent` field, `--color-cotton` label, 52px tall, `padding: 0 var(--space-4)`, `--radius-control` (8px), Inter 13px/600 uppercase `0.08em`. 9.05:1 |
| hover / active | fill → `--color-accent-deep`. 180ms. **No transform** — `/contact` lifts 2px and it reads as a web-app tic |
| focus-visible | 2px `--color-cotton` outline, offset 3px |
| pending | fill stays maroon, `disabled`, `aria-busy="true"`, `cursor: wait`, label `Sending`, preceded by a static 8×8 cotton square. 11.45:1 |
| demoted (after a failed send) | becomes a quiet text button: no fill, cotton label, 1px `--color-gray-on-noir` bottom rule, cotton on hover |

### Submit lifecycle

One state machine:

```
type SubmitState = "idle" | "pending" | "invalid" | "undelivered" | "success";
type Undelivered = "not-configured" | "rejected" | "network";
```

On submit: `event.preventDefault()`, run `validateInquiry(values)`.

- **Errors present** → `invalid`. Set errors, render the alert line, move focus to the
  first invalid control via `formRef.current?.querySelector('[name="…"]')?.focus()`
  inside a `requestAnimationFrame`. No request is sent.
- **Clean** → `pending`, then
  `fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) })`.

Response handling, in this order:

| Condition | Next state | Treatment |
|---|---|---|
| `response.ok && result.delivered === true` | `success` | Replace the form with the success block |
| `result.errors` present (the 422) | `invalid` | Merge server errors into field state, render each below its control, focus the first |
| `result.code === "REJECTED"` (400) | `undelivered` / `rejected` | Handover block, rejected copy |
| `result.code === "DELIVERY_NOT_CONFIGURED"` (503) | `undelivered` / `not-configured` | Handover block, delivery copy |
| anything else, or `fetch` throws | `undelivered` / `network` | Handover block, network copy |

**Success is reachable only through the first row.** A 2xx with `delivered !== true`
is not success. Against today's API, `not-configured` is the state a real visitor
gets — build it first and build it properly.

### The handover block — the signature

Rendered below the actions row whenever the state is `undelivered`. **The form is not
cleared and not disabled.**

Composition, top to bottom:

1. A 2px `--color-accent-graphic` rule across the form column, `padding-top:
   var(--space-3)`.
2. Heading, Archivo Black 28px uppercase `--color-cotton`, `tabIndex={-1}`, focus
   moved to it on arrival.
3. Body, Newsreader 18px/1.35 `--color-cotton`, `max-width: 52ch`.
4. The composed inquiry, in a 1px `--color-gray-on-noir` box, `padding:
   var(--space-2)`, Inter 14px/1.65 cotton, `white-space: pre-wrap`, `max-height:
   260px`, `overflow: auto`. It is selectable text, not a disabled textarea.
5. Actions: **`Copy inquiry` takes the cherry field** and `Send inquiry` demotes to
   the quiet ruled text button labelled `Try sending again`. The colour literally
   hands over. There is never more than one cherry field on screen.
6. The mailto link: `Open hello@convenium.studio`, Inter 15px/500 cotton with a 1px
   chili bottom rule, `padding-block: 12px 10px` so its box clears 44px.
7. A closing note in Inter 13px `--color-gray-on-noir`.

**The mailto carries a subject and nothing else:**
`mailto:hello@convenium.studio?subject=New%20project%20inquiry`. Do not put the name,
email, company or message into the URL. Personal data does not belong in a query
string, and mail clients truncate long `body` parameters anyway — which would silently
destroy exactly the thing this block exists to protect.

**Composed inquiry format**, produced by a pure `composeInquiry(values)` helper in
`content/contact-v2.ts` so it is testable and used by both the preview and the clipboard:

```
Name: {name}
Email: {email}
Company: {company || "—"}
Project type: {projectType}
Budget range: {budget || "—"}

Message:
{message}
```

**Copy behaviour.** `navigator.clipboard.writeText(composeInquiry(values))`. On
resolve, swap the button label to `Copied` for 2000ms and announce
`Inquiry copied to clipboard.` in a `role="status" aria-live="polite"` region; then
revert. If the API is missing or the promise rejects, leave the label alone and
replace the closing note with `Select the text above and copy it, then paste it into
an email to hello@convenium.studio.` Never claim a copy that did not happen.

### Success block

Replaces the form in place. 2px chili rule, Archivo Black 28px uppercase heading,
Newsreader 18px body, `max-width: 46ch`. Container `role="status"`, focus moved to
the heading. Unreachable against today's API; it exists so the page is already correct
the day a transport is wired up.

### Live regions

- Pending: `role="status" aria-live="polite"` — `Sending your inquiry…`
- Client or server validation: `role="alert"` — the alert line, once, above the
  actions row.
- Handover and success: focus moves to the block's heading, which is enough; do not
  also wrap them in `aria-live`, or screen readers announce twice.

### Honeypot

```
<div className="visually-hidden" aria-hidden="true">
  <label htmlFor={`${idPrefix}-website`}>Website</label>
  <input id={`${idPrefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" … />
</div>
```

`.visually-hidden` from `styles/globals.css` — absolutely positioned, 1px, clipped.
**Never `display: none`**, which many bots skip. It is part of `InquiryValues` and
must be posted with the rest.

---

## Motion

Four moments. Everything else on this page is still.

| Element | Trigger | Effect | Duration | Easing | Reduced motion | Owner |
|---|---|---|---|---|---|---|
| Section 1 eyebrow, H1, deck | scroll, `MOTION.start` (`"top 85%"`) | block reveal — `MOTION.yBlock` (24px, 14px on mobile) rise with opacity, staggered by `MOTION.stagger` (0.07) | `MOTION.enter` (0.62) | `MOTION.ease` (`expo.out`) | final state, no travel | `InteriorRevealBlock`, already wired |
| Ledger and form track | scroll, `MOTION.start` | the same block reveal, one per column | `MOTION.enter` | `MOTION.ease` | final state | `InteriorRevealBlock` |
| **The seam** | section 2 entering, `MOTION.start` | draws downward: `scaleY` 0 → 1 from `transform-origin: top` | `MOTION.media` (0.78) | `MOTION.ease` | rendered at `scaleY(1)` with no tween | **GSAP + ScrollTrigger**, in `Seam.tsx`, importing from `components/motion/gsap.ts` |
| Handover block arrival | state → `undelivered` | opacity 0 → 1 in place, no travel | 240ms | `--ease-out-sharp` | instant | CSS |

Field rules, button fills and link underlines are CSS transitions at
`--duration-nav-hover` (180ms) on `--ease-out-sharp`.

The seam is the **only** new tween on the page — write it with `MOTION.media` and
`MOTION.ease`, not invented numbers, and guard it with the `MQ.reduced` matchMedia
context the rest of the site uses. `globals.css:112-124` already clamps every CSS
transition to 0.01ms under `prefers-reduced-motion`, so the CSS fallbacks are free.

No blanket scroll-fade, no parallax, no gradients, no glassmorphism, no decorative
shadows.

---

## Microcopy

`availability`, `responseStatement` and `fitStatement` are **locked** — reproduce them
verbatim from `content/contact.ts`, and import them rather than retyping. So are the
`projectTypes` and `budgetRanges` option lists and every string returned by
`validateInquiry`. Everything else below is new and belongs in `content/contact-v2.ts`.

### Section 1

- Eyebrow: `Currently booking projects starting Q4 2026.` *(locked — `availability`)*
- H1: `TELL US WHAT IS NOT WORKING YET.` Set as four line units:
  `Tell us ` / `what is ` / `not working ` / `yet.` — each a `<span className={styles.line}>`.
  Uppercase comes from `text-transform`, so the accessible name stays sentence case.
- Deck: `One paragraph is enough. The brief comes after the call, not before it.`

### Section 2 — ledger

- Eyebrow: `What happens next`
- `01` / `You send` / `Now — this form, or straight to the mailbox below.`
- `02` / `We reply` / `Within two business days.`
- `03` / `First call` / `Within the week.`
- `04` / `Scoped proposal` / `Within five business days of that call.`
- Small print, below a 1px rule: the full `responseStatement`, verbatim.
- Eyebrow: `Who this is for`
- Body: the full `fitStatement`, verbatim.

Every duration in the ledger is taken from `responseStatement` — the ledger is that
sentence indexed, not a claim added on top of it. If `responseStatement` ever changes,
these four lines change with it.

The numbers are `aria-hidden="true"`: the list is an `<ol>` and a screen reader
already numbers it.

### Section 2 — form

Labels: `Name`, `Email`, `Company (optional)`, `Project type`, `Budget range
(optional)`, `Message`. The `(optional)` runs in a nested span at normal case and
tracking.

- Project type placeholder option: `Select one` (`value=""`, `disabled`)
- Budget first option: `Prefer not to say` (`value=""`, selectable)
- Message placeholder: `What is not working yet — one paragraph is enough.`
- Consent: `I agree to be contacted about this inquiry. See our privacy policy.`
  with `privacy policy` linking to `/privacy`
- Submit: `Send inquiry` → `Sending`

Field errors are `validateInquiry`'s own strings, unchanged: `Enter your name.`,
`Enter a valid email address.`, `Select a project type.`, `Add a little more detail
(at least 20 characters).`, `Consent is required to send this inquiry.` and the rest.

Alert line on validation failure: `Check the highlighted fields and try again.`
Pending status: `Sending your inquiry…`

### The handover, by reason

**`not-configured` (503 — today's live response):**
- Heading: `DELIVERY ISN'T LIVE YET.`
- Body: `The form is built; the mailbox behind it is not connected yet. Nothing you wrote has been lost — copy it below and send it to us directly. It reaches us the same way, on the same reply window.`

**`rejected` (400 REJECTED):**
- Heading: `THIS ONE DIDN'T GO THROUGH.`
- Body: `The inquiry wasn't accepted. Nothing you wrote has been lost — copy it below and send it to us directly.`

This is the honeypot rejection, and a real person can trigger it if a password manager
fills the hidden field. The copy never accuses anyone and the direct path is identical
to the 503's. A dead end here would cost a real client.

**`network`:**
- Heading: `THAT DIDN'T REACH US.`
- Body: `The request failed before it arrived. Nothing you wrote has been lost — copy it below and send it directly, or try again.`

Shared by all three: buttons `Copy inquiry` / `Copied` and `Try sending again`; link
`Open hello@convenium.studio`; note `Paste the inquiry into the email body. Nothing
above has been sent anywhere.`; clipboard-failure note `Select the text above and copy
it, then paste it into an email to hello@convenium.studio.`; copy announcement
`Inquiry copied to clipboard.`

### Success

- Heading: `INQUIRY DELIVERED.`
- Body: `It's with us. You'll hear back within two business days, from a person who has read it.`

### Section 3

- Eyebrow: `The direct line`
- The email `hello@convenium.studio`, from `site.email` in `content/site.ts` — do not
  hardcode it — as a display-size `mailto:` link
- Note: `Email reaches us whatever the form is doing, and the same reply window applies.`

### One judgement call left to you

The H1 is the page's voice and the one string worth a second opinion:

1. **`TELL US WHAT IS NOT WORKING YET.`** — recommended. Severe, specific, and it is
   an instruction that makes the Message field easy to answer. Matches the register of
   `We do not decorate businesses.` and the studio's stated fit.
2. `ONE SENTENCE IS ENOUGH TO START.` — warmer, lowers the barrier, but reads like
   every other agency contact page.
3. `THE BRIEF COMES LATER.` — shortest, sets 2 lines at every width, but it answers a
   question the visitor has not asked yet.

If you swap it, re-measure: the line-unit sizing rule below is tuned to the string.

---

## Edge cases

| Case | Behaviour |
|---|---|
| H1 at 375 | The natural wrap puts `not` alone on a line — measured, 5 lines. Fixed with four explicit line units plus `font-size: min(var(--cv2-h1), calc((100vw - 2 * var(--space-container)) / 8.2))` below 768. `NOT WORKING` measures 7.96em in Archivo Black at `-0.02em`; 8.2 leaves ~8px of slack at 375 so the Arial Black fallback shown before the webfont swaps does not overflow. At ≥768 the units go `display: inline` and `max-width: 11em` produces two lines |
| Longest ledger duration | `Within five business days of that call.` is 331px at 22px Newsreader. A single-line `label … duration` row needs 734px and the ledger never exceeds 560, so the duration always stacks under its label. Do not right-align it |
| `fitStatement`, the longest locked string | 4 lines at 560px, 5 at 432, 6 at 343. All fit; the 560px ledger cap is what buys the 4-line setting |
| Message at 5000 characters | Textarea is `resize: vertical` with `min-height: 150px`; the composed-inquiry preview caps at `max-height: 260px` with `overflow: auto`, so a long message cannot push the actions row off screen |
| A 254-character email | Controls cap at 376px and the value scrolls inside the input. No wrapping, no overflow |
| Empty optional fields | `composeInquiry` prints `—` for an empty Company or Budget, so the pasted email is never a ragged list of blank labels |
| Clipboard blocked (non-secure origin, Safari gesture rules, permissions) | Label does not change; the note becomes the select-and-copy instruction. Never announce a copy that did not happen |
| JS disabled | The form cannot submit — it is a client component posting JSON. Section 3's `mailto:` link is plain HTML and still works, which is why the direct line is its own section rather than a line inside the form |
| Very short viewport (e.g. 1440×720) | Section 1's top padding is `18vh` = 129.6px, still clear of the nav's 60px |
| 320px width | Below the stated range but does not break: the H1 cap resolves to ~35px and controls fill the column |
| Slow font load | `next/font` is used site-wide with `font-display: swap`; the H1's `min()` cap is sized so the Arial Black fallback also fits |

---

## Assets

**None.** No images, no video, no icons.

`/contact` places two 4:5 stills (`/images/still-columns-15.jpg`,
`/images/still-team-55.jpg`) as decoration — at 375 the first alone is 429px tall.
This page drops both. The contact imagery `DESIGN.md:348-353` actually calls for — an
open architectural doorway and a prepared meeting table — does not exist in
`public/images`, and specifying assets that have to be generated first would block the
build. The seam does the doorway's work typographically.

If imagery is added later, the natural slot is the air left of the seam at ≥1600,
which is currently the composition's breathing room — not the ledger or the form.

---

## Build sequence

Structure before motion. One breakpoint correct, then work down.

**Step 1 — Route, container, three empty bands.**
Build `page.tsx`, the three section components, each with its `HeaderZone` and its own
ground and padding.
*Done when:* `/contact-v2` renders three full-bleed bands, cotton / noir / cotton, in
that order; `npm run build` is clean; scrolling through the page flips the header
theme dark then light again; at 2560 the grounds still reach both viewport edges while
the inner container measures 1920.

**Step 2 — Section 1 at 1920.**
Eyebrow, H1 with its four line units, deck.
*Done when:* at a 1920 window the H1 computes to 104px, sets exactly 2 lines, and its
`max-width` computes to 1144px; at 1440 it computes to 87.98px and still sets 2 lines;
the section measures 545px tall at 1920×1080.

**Step 3 — Section 1 down to 375.**
Add the `min()` size cap and the `display: block` line units below 768.
*Done when:* at 375 the H1 computes to 41.83px and renders exactly 4 visual lines
reading `Tell us / what is / not working / yet.`, with `document.documentElement.scrollWidth === 375`.

**Step 4 — The ledger.**
Four steps, the `responseStatement` small print, the fit block.
*Done when:* the ledger element measures exactly 560px at ≥768; step numbers compute
to `rgb(215, 59, 62)` at 32px; `fitStatement` sets 4 lines at 560px; no element under
`<main>` crosses the viewport edge at 375, 768 or 1920.

**Step 5 — The form, idle only.**
All seven controls including the honeypot, consent, submit. No submit handler yet.
*Done when:* at 1920 every single-line control measures 368px and none exceeds 376px
at any of the six widths; control heights are 48 / 50 / 54 at 375 / 768 / 1440; the
honeypot input exists in the DOM, is not `display: none`, and is unreachable by Tab;
tabbing from Name to the submit button visits exactly the order given under Focus
order.

**Step 6 — The split and the seam.**
Grid at ≥1280, the `Seam` element, the horizontal rule below 1280.
*Done when:* at 1440, 1920 and 2560 the seam's `getBoundingClientRect().x` is within
1px of half the layout width; at 1024 and below the seam element is not rendered and
the form track carries a 1px chili top rule instead.

**Step 7 — Field states.**
Hover, focus-visible, filled, invalid, plus the `aria-invalid` / `aria-describedby`
wiring.
*Done when:* focusing any control with the keyboard shows a 2px cotton outline (not
cherry — verify the computed `outline-color` is `rgb(237, 235, 221)`); an invalid
field's rule computes to `rgb(215, 59, 62)`, its label and message to
`rgb(229, 89, 92)`, and its `aria-describedby` resolves to the message's `id`.

**Step 8 — Submit lifecycle and the handover.**
The state machine, `validateInquiry`, the fetch, all five states.
*Done when:* submitting an empty form sends no request, renders the alert line, and
moves focus to the Name input; submitting a valid form against the live API lands in
`undelivered / not-configured`, keeps every typed value in place, moves the cherry
from Send to Copy inquiry, demotes Send to the quiet button, and renders the composed
inquiry with the typed message intact; `Copy inquiry` puts that same text on the
clipboard and announces it; the mailto href contains a subject and no other parameter.

**Step 9 — Section 3.**
*Done when:* the email link's box measures ≥44px tall at 375 and the underline
computes to `rgb(129, 1, 0)`.

**Step 10 — Motion.**
`InteriorReveal` wrappers, then the seam tween.
*Done when:* the seam draws from top to bottom once on entry using `MOTION.media` and
`MOTION.ease`; with `prefers-reduced-motion: reduce` forced, the seam is full height
immediately and every revealed block is at its final position on load; the console is
clean after a full scroll and after hovering every control.

**Step 11 — Compliance sweep.**
*Done when:* `grep -rniE "symbol ?studio|#fe552e|#b18a46|rules" components/sections/contact-v2 app/\(interior\)/contact-v2` returns nothing meaningful; no hex literal appears in this page's CSS except inside the chevron `mask-image` path, which carries no colour; `npm run build` is clean; Playwright full-page shots at 1920×1080, 1440×900 and 390×844 show no overflow and no console errors.

---

## Out of scope

- Any change to `/contact`, `components/sections/contact/*`, `content/contact.ts`,
  `components/sections/contact/inquiry.ts` or `app/api/inquiry/route.ts`. This page
  consumes them read-only.
- Wiring an email transport. The 503 is the designed-for state, not a bug to fix here.
- Nav, footer, cursor, grain, Lenis, the page-enter transition — all root-level.
- Any new token in `styles/tokens.css`. The page-local `--cv2-*` variables live on
  this page's own root element.
- Imagery. See Assets.
- A shared form component for `/contact` and `/contact-v2`. Two independent
  implementations is the point; refactoring them together would edit v1.

---

## Open questions — 3

Counted honestly, as the ones an implementer could reasonably still ask.

1. **Does `/contact-v2` stay, or eventually replace `/contact`?** The spec builds it
   as a parallel route and touches nothing of v1. If it is meant to become `/contact`,
   the migration — redirects, sitemap, the shared-form question under Out of scope —
   is not covered here.
2. **Is the H1 approved?** Three options are given under Microcopy with a
   recommendation. The recommended string is what every measurement in this document
   is tuned to; a different string needs the line-unit breaks and the `8.2` divisor
   re-measured.
3. **No screenshot of this design exists.** The Browser pane would not composite
   frames during this run, so the comp at `_apollo/comp/index.html` was verified by
   measuring the rendered DOM at all six widths rather than by looking at it. Every
   number here is real; the *balance* — the ledger column against the form column
   across 285px of air at 1920 — has not been seen by a human or by me. Serve
   `_apollo/comp/index.html` and look at it at 1920 before Step 4.

---

*Comp: `_apollo/comp/index.html` (page) and `_apollo/comp/states.html` (all twelve form
states), self-contained, using the site's own font files. Direction and the two
rejected alternatives: `_apollo/directions.md`. Measurements: `_apollo/evidence/`.
Contrast run: `_apollo/evidence/contrast-report.txt` — 15 declared pairs, 0 failures.*
