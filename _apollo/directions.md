# /contact-v2 — Direction

Three directions were developed. One is committed. The other two are recorded below
with the reason each lost. This is not a menu; if the user disagrees, they override.

---

## CHOSEN — "The Threshold"

**Concept.** The contact page is a doorway with a line drawn down the middle of it:
on the left, exactly what happens after you press send and by when; on the right,
the form — and because delivery is not connected, the page is built so that the
moment it fails, nothing the visitor wrote is lost.

**Why this and not a costume.** Two facts drove it, both measured, not assumed.

1. `POST /api/inquiry` returns **503 DELIVERY_NOT_CONFIGURED** for every valid
   submission (`app/api/inquiry/route.ts:29-36`). The most likely outcome of this
   page is failure. A contact page whose form cannot deliver must treat the direct
   email as a designed first-class path, not a consolation line under an error box.
2. `content/contact.ts:19-20` — `responseStatement` is not a paragraph, it is a
   **timetable**: reply in 2 business days, call within the week, proposal within
   5 business days of the call. That is genuinely a sequence with real durations,
   so numbering it encodes something true rather than decorating it. It is also,
   without any elevator iconography, the site's own metaphor: floors, in order,
   with time between them.

**Mood.** Severe, quiet, procedural. Confident enough to tell the visitor who this
studio is *not* for, on the same screen as the ask.

**Type roles.**
- `--font-family-display` (Archivo Black) — H1, ledger step labels, the section
  headings, the direct-line email, the handover heading. Uppercase. Line-height 0.88.
- `--font-family-serif` (Newsreader) — the deck, all four step durations, the fit
  statement, and **every input and textarea value**. Line-height 1.3.
- `--font-family-ui` (Inter) — micro-labels, field labels, the eyebrow, consent,
  the button, the verbatim `responseStatement` small print, the composed-inquiry
  preview. Uppercase micro-labels at 11–13px.

Newsreader italic 400/500 and Inter 400/500/600 are confirmed loaded on the running
site; Archivo Black ships 400 only, so no display weight other than 400 may be asked for.

**Colour tokens and their rules — six, each with one job.**

| Token | Value | Where it may appear | Where it may not |
|---|---|---|---|
| `--color-noir` | `#1b1717` | Ground of section 2 (ledger + form), full bleed | Never as text on any red |
| `--color-cotton` | `#edebdd` | Ground of sections 1 and 3; all text on noir; text on the cherry button; the focus ring **on noir** | Never as a ground inside section 2 |
| `--color-ink` | `#241f1f` | Body text on cotton (deck, section-3 copy) | Never on noir |
| `--color-gray-on-noir` | `#a8a29a` | Eyebrows, field labels, resting field rules, helper microcopy — all on noir | Never on cotton; never as an error colour |
| `--color-accent` (cherry `#810100`) | | The one solid field on the page: the primary button, carrying cotton text. Accent text on cotton in section 3. The focus ring **on cotton only** | Never a focus ring on noir (1.19:1 against noir — see self-check). Never a text colour on noir. Never used twice as a solid field at the same time |
| `--color-accent-deep` (maroon `#630000`) | | Hover/active fill of the cherry button only — the depth step it exists for | Never text. Never beside cherry as a peer |
| `--color-accent-graphic` (chili `#d73b3e`) | | The seam hairline; the step numbers at 32px display; the 2px invalid rule; the 2px rule above the handover block — all on noir, all graphic or ≥24px display | Never below 24px as text; never on cotton |
| `--color-accent-on-noir` (chili-300 `#e5595c`) | | Field error messages on noir at 13px; the invalid-field label | Never as a large graphic — chili owns that |

`--color-hairline` on cotton for section 1/3 rules. `--color-paper` is deliberately
**not used**: `#f5f3e8` on `#edebdd` is a 1.06:1 separation and is the reason v1's
form card reads as a printing artifact.

Gold does not appear. No raw colour value is written anywhere; the one SVG chevron
that cannot read a CSS variable is drawn with `mask-image` and coloured by
`background-color: var(--color-cotton)` instead of being baked into a data URI.

**Layout archetype.** Full-bleed horizontal bands, and inside the middle band a
two-track split with a 1px vertical chili seam standing at the exact centre of the
composition, running the full height of the band.

Three sections, three `HeaderZone`s, light → dark → light, so the fixed 40px nav is
never straddling two grounds:

```
1920 — the primary target. Composition capped at 1920, centred, backgrounds full bleed.

 ┌───────────────────────────────────────────────────────────────────────────┐
 │  ▸ section 1 — THRESHOLD          HeaderZone light   ground: cotton       │
 │  CURRENTLY BOOKING PROJECTS STARTING Q4 2026.        ← eyebrow, verbatim   │
 │                                                                           │
 │  TELL US WHAT IS                                     ← 104px Archivo Black│
 │  NOT WORKING YET.                                       measured 1102px   │
 │                                                                           │
 │  One paragraph is enough. The brief comes after the call, not before it.  │
 ├───────────────────────────────────────────────────────────────────────────┤
 │  ▸ section 2 — THE ASCENT / THE FORM   HeaderZone dark   ground: noir     │
 │                                    ╎ ← 1px chili seam, x = viewport centre│
 │  WHAT HAPPENS NEXT                 ╎   PROJECT INQUIRY                    │
 │  01  YOU SEND                      ╎   Name ─────────  Email ─────────    │
 │      Now                           ╎   Company ──────  Project type ───   │
 │  02  WE REPLY                      ╎   Budget ───────                     │
 │      Within two business days      ╎   Message ─────────────────────────  │
 │  03  FIRST CALL                    ╎   ▢ consent                          │
 │      Within the week               ╎   ▐ SEND INQUIRY ▌  ← the one cherry │
 │  04  SCOPED PROPOSAL               ╎                                      │
 │      Within five business days …   ╎                                      │
 │  ───────────────────────────       ╎                                      │
 │  responseStatement, verbatim, 15px ╎                                      │
 │                                    ╎                                      │
 │  WHO THIS IS FOR                   ╎                                      │
 │  fitStatement, verbatim, 18px      ╎                                      │
 │  ◂── 560 max ──▸   ◂─ air ─▸       ╎ ◂──── 760 max ────▸  ◂─ 180 margin ─▸│
 ├───────────────────────────────────────────────────────────────────────────┤
 │  ▸ section 3 — THE DIRECT LINE    HeaderZone light   ground: cotton       │
 │  hello@convenium.studio     ← 56px display, cherry underline              │
 └───────────────────────────────────────────────────────────────────────────┘
```

The seam is at the exact centre of the composition at every width ≥1280 — a
checkable fact, not a feeling. The ledger sits *back* from it behind a band of air;
the form stands hard *against* it. The air is asymmetric on purpose: the seam belongs
to the form side, because it is the thing you cross to reach it.

**What the extra space at 1920 is actually for.** Three specific things, each
measured, none of them "wider margins":
1. The H1 continues from 88px to 104px. The token `--font-hero` freezes at 88px at
   1440 and never grows again; the page supplies a local clamp with the *same slope
   and the same 375/1440 values* and a raised ceiling, so up to 1440 it is
   byte-identical to the rest of the site and past 1440 it keeps thinking.
2. The form's fields go two-up with a hard 376px ceiling on any single-line input.
   v1 at 1920 renders a **938px-wide Company input** (measured); at 2560, 644px.
   No input on this page is ever wider than 376px at any breakpoint.
3. The ledger reaches its full 560px measure, where `fitStatement` sets in 4 lines
   rather than 5 or 6 (measured at 18px: 560→4, 432→5, 343→6).

**Surface.** None added. The interior layout already mounts `Grain` at 0.035 opacity
over everything; that is the whole surface treatment. No photography — the two 4:5
stills v1 places are decoration (`still-columns-15`, `still-team-55`), and the
imagery `DESIGN.md:348-353` actually calls for on contact — an open doorway and a
prepared meeting table — does not exist in `public/images`. Specifying images that
do not exist would hand the implementer an open question. The seam does the doorway's
work typographically instead.

**Motion — described, owned by GSAP via `InteriorReveal` wrappers.** Four moments,
all drawing timing from `components/motion/motion.ts`. Full spec in the handoff.
1. Section entrances — the existing `InteriorRevealLine` / `InteriorRevealBlock`
   grammar, `MOTION.enter` 0.62s, `expo.out`, `MOTION.start` "top 85%".
2. The seam draws down from the top of section 2 on entry — `MOTION.media` 0.78s.
   It is the only new tween on the page.
3. Field rule transitions — CSS only, `--duration-nav-hover` 180ms, `--ease-out-sharp`.
4. The handover block arriving on 503 — CSS only, 240ms, no travel, focus moved to it.

Reduced motion: the seam is drawn at full height with no tween; every reveal resolves
to final state; nothing else changes. `globals.css:112-124` already clamps all
transitions to 0.01ms under `prefers-reduced-motion`, so a CSS-only fallback is free.

**Signature — "Nothing you wrote is lost."** On the 503 that every real visitor gets
today, the form does not clear and does not apologise in a toast. A rule in chili
opens a handover block, the **cherry moves off the Send button and onto a COPY
INQUIRY button**, Send demotes to a quiet text link, and the visitor's own words are
shown back to them, composed and intact, beside `hello@convenium.studio`. The colour
literally hands over. That single move is the page.

Everything else stays quiet: one hairline, one solid colour field, one numbered
sequence, no photography.

**What this direction is bad at.**
- It is severe. A visitor who wants warmth from a contact page will not find it here;
  the page's friendliness is entirely in its precision.
- The signature only fires on submit. Most visitors will never see it, so the page's
  first impression rests on composition and type alone and has no spectacle.
- The wide-screen air between the ledger and the seam (≈286px at 1920) is genuinely
  empty. It is a composed emptiness, but a reviewer who counts pixels rather than
  reads the layout will call it waste.
- A dark form is harder to fill on a bright screen than a light one. The direction
  buys narrative rhythm (light → dark → light) at a small legibility cost, mitigated
  by putting every text pair above 4.9:1 and the field rules at 7.02:1.

---

## REJECTED — "The Call Sheet"

Cotton throughout. The form as a printed intake sheet: fields numbered 01–06,
hairline rules, and a margin that composes the visitor's answers into a running
prose summary as they type ("Marija, at Acme, wants a full rebrand, starting Q4").

**Why it lost.** Three reasons, in order of weight.
1. It gives the 1920 problem no structural answer. A dossier at 1920 is a dossier at
   1440 with wider margins — exactly the failure the evidence caught v1 committing.
2. It keeps paper-on-cotton, a 1.06:1 separation, as the form surface.
3. Broadsheet-with-hairlines is one of the three named AI-default looks. It is a
   legitimate choice for some briefs; here nothing in the subject demanded it, so
   picking it would have been spending a free axis on a default.

Its margin-summary idea was genuinely good and is the reason the chosen direction
shows the composed inquiry back to the visitor on 503 — the same insight, spent
where it pays.

## REJECTED — "The Shaft"

Full-page noir. Fields numbered as floors on a single vertical cherry rail, with a
filled marker travelling down the rail as the form completes.

**Why it lost.** `DESIGN.md:25` forbids literal elevator icons and floor-button
decorations outright: *"Express the metaphor through pacing, vertical motion,
numbering, doors, thresholds and copy."* A marker travelling down a numbered rail is
a floor indicator in everything but name. Secondly it makes the form the page's only
content, which starves `fitStatement` and `responseStatement` — the two pieces of
copy that qualify the lead before the studio spends a call on it. Its vertical rail
survives, demoted to a static seam that divides rather than tracks.

---

## Self-check applied before committing

- **One numbered sequence, not two.** The form's fields were numbered 01–06 in an
  earlier pass. Cut: a form is only weakly ordered, the timetable is genuinely
  temporal, and two numbered sequences on one page cancel each other out.
- **One solid colour field.** Cherry appears as a filled surface exactly once at any
  moment — and the signature is that the once *moves*.
- **The removed thing:** all photography. See Surface.
- **The risk taken:** a dark form panel and no imagery on a page whose job is
  conversion. Justified because the page's honest problem is not warmth, it is that
  the form does not deliver, and severity plus a designed failure path is a better
  answer to that than a friendly photograph.
- **A defect fixed, not inherited:** `globals.css:62-65` sets a global cherry
  `:focus-visible` ring. Cherry against noir is very low contrast, so on the dark
  section the global ring would be close to invisible. The spec overrides it to a
  cotton ring on noir. Confirmed by measurement in stage 5.
