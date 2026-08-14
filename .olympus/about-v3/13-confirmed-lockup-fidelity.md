# `/about-v3` — confirmed-lockup fidelity rebuild

Date: 2026-08-14
Branch: `codex/about-v3-media-first`
Status: **rebuilt against the confirmed lockups; Gate C awaiting user review**

Supersedes the "implementation complete" claim in `12-implementation-qa.md`. That
record described a build the user rejected for visual inaccuracy, so its Gate C
readiness statement was stale rather than wrong-at-the-time.

## 1. What changed and why

The previous `/about-v3` was a ten-section narrative built to its own layout
language: alternating full-page dark and light sections, generic heading/eyebrow
blocks, a tabbed program selector, and Archivo Black headings. It carried the
right story but not the right composition.

This rebuild takes `.olympus/about-v3/media/confirmed-ui-lockups/` as the visual
authority and reconstructs the page as one continuous warm-ivory editorial canvas
with contained noir media stages, a hairline burgundy spine, registration
crosses, oversized condensed headings, Newsreader prose and Inter labels.

### Files

| File | Change |
|---|---|
| `components/sections/about-v3/AboutV3Page.tsx` | new — all ten sections, server-rendered |
| `components/sections/about-v3/AboutV3Page.module.css` | new — the route-scoped system |
| `components/sections/about-v3/Primitives.tsx` | new — index, registration cross, axis, heading, media frame, meta strip, ruled row |
| `components/sections/about-v3/FounderSilhouette.tsx` | new — drawn founder stage and portrait |
| `components/sections/about-v3/FounderOpening.tsx` | new — Section 01 and the 01→02 transition |
| `components/sections/about-v3/ProofComparison.tsx` | new — Section 09 slider and pending state |
| `components/sections/about-v3/AboutV3Interactions.tsx` | rewritten — dossier, intake, atlas sequence, delivery |
| `content/about-v3.ts` | rewritten — copy transcribed from the lockups, with the documented corrections |
| `app/(interior)/about-v3/page.tsx` | points at `AboutV3Page`, metadata from content |
| `app/fonts.ts` | adds the route-scoped condensed display face |
| `public/images/about-v3/lab.webp` | re-derived — see §4 |
| `scripts/capture-about-v3.mjs` | new — viewport and section evidence capture |
| `scripts/verify-about-v3.mjs` | new — behavioural QA |
| `scripts/capture-proof-pair.mjs` | new — matched before/after capture for §09 |
| `components/sections/about-v3/TwoLensesPage.tsx` `.module.css` `TwoLensesMotionShell.tsx` | deleted — fully superseded |

`ProgramSelector` is gone with `AboutV3Interactions`'s rewrite: Section 05 now
shows all three directions at once, so a selector has nothing to select.
`AboutInquiry` is untouched but no longer used on this route — Section 10 links
to `/contact` instead of embedding the form.

## 2. Lockup → section mapping

| Lockup | Section | Fidelity |
|---|---|---|
| `01a-opening-founder-walk` | 01 opening | composition matched: wide stage, founder labels ranged left/right on rules, centred two-line thesis, metadata and down cue on a hairline. Media is drawn, not filmed — §3.1 |
| `01b-opening-split-transition` | 01→02 transition | matched. Window geometry measured off the lockup: centres at 33% / 67%, 20% of stage width, 27:50 — encoded once in `--av3-window-*` |
| `02-founder-profile-endpoint` | 02 founders | matched: cherry heading top-left, two centred portraits, equal left/right columns, three ruled responsibility rows each, Newsreader statements, central divider |
| `03-your-idea-is-enough` | 03 arrival | matched: left heading and prose, cherry connector rule, wide right media, caption left / provenance right. Child subject replaced with the constant-scale robot |
| `04-idea-analysis-lab` | 04 analysis | matched: upper heading and prose, lower-left lab field, right `IDEA PROFILE / 01` with Core / Audience / Feeling / Tension, profile status, supporting field |
| `05-three-rehabilitation-programs` | 05 programs | matched as a simultaneous comparison. Three equal projections, none preselected |
| `06-apollo-system-intake` | 06 intake | matched: ivory heading band, wide dark stage, compact metadata strip with the handoff control |
| `07-apollo-orchestration-atlas` | 07 atlas | matched: dark hero band, `INSIDE THE SYSTEM` list, ivory diagram band, five specialist media, dark verb strip, integration band, principles row |
| `08-delivery-ui-composition` + `08a` | 08 delivery | matched, with 08a's compact robot replacing the humanoid child |
| `09-real-work-comparison` | 09 proof | matched, including the lockup's own "Existing capture required" state — §5 |
| `10-inquiry-requirement.md` | 10 CTA | typography-led ivory closing, CTA to `/contact`, no embedded form |

Heading sizes, the 16:7 stage, the portrait proportion and the window insets
were all measured off the lockups rather than estimated. Anton needs 0.92 line
height to reproduce the lockups' near-touching leading; at 0.86 the caps of one
line collide with the periods of the line above.

## 3. Deviations from the handoff, and why

Each of these is a deliberate call, not an oversight.

### 3.1 Founder media is drawn, flat vector poster art

The handoff asks for "neutral black/red founder silhouettes" until real founder
media exists. They are built as flat cherry and maroon bands with near-black
figures and a mirrored floor reflection — not as an imitation of the lockups'
lit studio. Two reasons: the lockups' lighting is a photographic effect that
would need gradients, which the root rules forbid; and a near-photographic
silhouette risks being read as an actual portrait, which the handoff explicitly
forbids. The stage is labelled `FOUNDER STAGE / DRAWN PLACEHOLDER / PORTRAIT
MEDIA PENDING` and its `role="img"` label says the same.

### 3.2 Display face is Anton, not Bebas Neue

The handoff says "Prefer `Bebas Neue`", conditioned on matching the lockups.
Bebas is condensed but roughly a weight-and-a-half lighter than the lockups'
headings, which is the same kind of drift this rebuild exists to correct. Anton
is the closest Google-hosted match for the lockups' weight and width. It is one
token — `--av3-display` in `AboutV3Page.module.css`, fed by `anton` in
`app/fonts.ts` — so switching back is a two-line change. **Flagging this for
the Gate C decision.**

### 3.3 The atlas does not pin

The handoff permits a pinned desktop timeline ("may"). The atlas is several
viewports tall, so pinning it would either trap the scroll — which the motion
contract forbids — or hide most of the diagram behind the pinned frame. Instead
one non-pinning ScrollTrigger walks a highlight through `Decompose → Match →
Equip → Coordinate → Verify` as the strip crosses the viewport, and the matching
lane lights up with it. The highlight is purely additive: nothing dims, nothing
hides, and all five stages read at full contrast without scrolling at all.

Net effect: **nothing on the page pins.** Section 01's transition is autonomous
and time-based rather than scroll-linked, which is what its own motion contract
specifies ("plays autonomously and is not tied to scroll progress").

### 3.4 Media stages are 16:9; the lockups letterbox at roughly 2.3–2.9:1

The locked plates were generated at 16:9 with their subjects composed for that
frame. Cropping them to the mockups' letterbox would cut the companion in
Sections 03–05 and the figures' heads in 06 and 08. The mockups' media was
illustrative; the locked plates are the production authority, so the plates win.

### 3.5 Section 01 on mobile keeps the wide stage

Two 27:50 windows cannot sit side by side at a readable size in a 358px column —
each would be about 120px wide. Mobile therefore shows the full founder stage,
and Section 02 carries the portrait pair. The split transition is desktop-only,
which also satisfies "never pin mobile" trivially.

### 3.6 Copy corrections against the lockups

- Section 03's `A LITTLE LIKE THERAPY.` → `Nothing arrives too early.` The
  handoff requires the message of safe reception without therapy or medical
  language.
- Section 03's film-study provenance → `Arrival plate / Still / Section 03`;
  the asset is a still, and labelling it as film would be false.
- Section 04's `LAB STUDY / 06–08 SEC / SILENT LOOP` → `Lab plate / Still /
  Section 04`, same reason.
- Section 07's "idea-creature" → "the same idea"; "Integrated care" →
  "Integrated work".
- Section 01's `FILM / 00:10 / SILENT LOOP` → the production-hold strip in §3.1.

## 4. Media provenance

Every image on the page traces to a locked production authority under
`.olympus/about-v3/media/production/`. No media was generated in this phase and
no credits were spent.

One derivative was rebuilt: **`public/images/about-v3/lab.webp`** was the
*clean* lab plate — the empty cradle, no companion — while its mobile
counterpart `lab-mobile.webp` showed the companion. Desktop and mobile therefore
told different stories, and Section 04's narrative requires the companion to be
visible under analysis. It is now re-derived from
`AV3-04-LAB-CLEAN-PLATE/AV3-04-lab-companion-plate-v1.png`, the locked
companion-in-cradle authority, at 1920×1080 WebP q82. Local preparation only.

Section 09's "new direction" panels use `/works/sonnwerk/cover.jpg` and
`/works/meridian/cover.jpg` — the existing deterministic captures of the live
proposal builds produced by `scripts/capture-preview.mjs`, per
`PROJECT-PREVIEW-GUIDE.md`. Real pixels, never mockups.

The recovery MP4 remains a labelled development candidate. It is behind an
explicit control with `preload="none"`, so it is not downloaded unless a visitor
asks for it.

## 5. Open truth gaps, stated rather than filled

- **Founder identity media.** No founder photography or film exists. Sections 01
  and 02 use the drawn placeholder described in §3.1 and say so on the page.
- **Marija's biography.** Not confirmed, so not written. Her column carries
  `Biography pending confirmation` in the same slot where Rustam's carries his
  public-record link, keeping the two columns symmetrical without inventing
  content.
- **Section 09 before/after evidence.** `ProofComparison` implements a full
  pointer / touch / keyboard slider (Arrow keys step, Home/End pin to the edges,
  `role="slider"` with `aria-valuenow`), but it only renders when both halves of
  the evidence exist. Neither project has a verified capture of its existing
  site:
  - **Sonnwerk** — the old source documented in `MEDIA-PLANNING-HANDOFF.md` §09
    (`https://sonn-werk.at/`) returns **HTTP 403 Forbidden** to headless
    capture. `scripts/capture-proof-pair.mjs` records the attempt and is the
    documented path to producing the pair if the source becomes reachable.
  - **Meridian** — no old source is documented at all.

  Both rows therefore show the polished `Existing capture required / Matched
  viewport — pending source` panel, which is exactly the state the confirmed
  lockup itself shows. No fabricated before state ships.
- **No results claimed.** Both projects are labelled at their real commercial
  stage — Sonnwerk "Proposal-stage redesign", Meridian "Concept build",
  consistent with `content/projects.ts`. No metrics, testimonials, approvals or
  launch claims appear anywhere on the page.
- **Apollo internals.** The atlas shows role categories, skills and handoffs
  only. No prompts, routing criteria, model configuration or private
  instructions are exposed, and the section says so in its own boundary line.

## 6. Verification

### Automated

| Check | Result |
|---|---|
| Scoped ESLint (`components/sections/about-v3`, `content/about-v3.ts`, `app/fonts.ts`, the route) | **pass**, 0 errors 0 warnings |
| `npm run build` | **pass** — `/about-v3` 10.6 kB, 167 kB first load, static prerender |
| `node scripts/verify-about-v3.mjs` | **28/30 pass, 2 skipped** — see below |
| `node scripts/capture-about-v3.mjs` | evidence written, audit clean |

The build initially failed on stale generated types under `.next-check/` and
`.next-devsrv/` for a `contact-v2` route that no longer exists in the source
tree. Both are gitignored build caches and were removed; they regenerate. This
failure predates the rebuild and is unrelated to it.

### The two skipped checks

Playwright's bundled Chromium ships without proprietary codecs and cannot decode
the H.264 recovery clip — it reports `MEDIA_ERR_SRC_NOT_SUPPORTED`. This is a
harness limitation, not a page defect, so the suite reports it as `SKIP` rather
than a false failure. Playback was verified end to end in a browser that has the
decoder:

- attaches its source only on the first click, then reaches `readyState 4`;
- plays forward to `8.04 / 8.04` at rate 1, then reports `ended` and the control
  relabels to "Play again";
- replaying restarts from zero rather than rewinding through its own frames;
- scrolling away pauses it and freezes the playhead.

### Behavioural results

Founder transition begins on the wide stage, completes forward unattended,
offers a skip control only while it is running, and clips to the measured
portrait geometry. Handoff control reports `aria-pressed` and a live status
line. Atlas presents five lanes and five stages, none dimmed. Recovery video is
inert until requested. Proof shows two pending panels and zero sliders. Focus is
visible. No console or page errors at any viewport.

Reduced motion opens directly on the completed founder pair with the wide layer
removed and the central rule at full height, leaves the dossier rules drawn,
never autoplays the video and offers no skip control.

Mobile has no horizontal overflow, never pins, keeps each founder's name before
their portrait, stacks all three programs with no tabs or carousel, and meets
44px on every interactive target.

### Viewports captured

`.olympus/about-v3/evidence/confirmed-lockup-fidelity/`

| Viewport | Full page | Per-section |
|---|---|---|
| 1680 × 945 (lockup-native) | yes | yes |
| 1920 × 1080 | yes | — |
| 1440 × 900 | yes | — |
| 1024 × 768 | yes | — |
| 390 × 844 | yes | yes |
| 390 × 844 reduced motion | yes | — |
| 1440 × 900 reduced motion | yes | — |
| 720 × 450 (≈200% zoom at 1440) | yes | — |

At 200% zoom: no horizontal overflow, no clipped headings, no broken images.

### Accessibility

One `h1`, one `main`, ten `section`s, headings in order with no skipped levels.
Every image carries alt text; decorative marks are `aria-hidden`. Text colours
come from the locked token roles, whose contrast ratios are recorded in
`DESIGN.md` — ink 13.5:1 and gray 4.53:1 on cotton, cotton 9.03:1 on cherry,
`gray-on-noir` 7.02:1 and `chili-300` 4.97:1 on noir. Body-size accent text on
noir uses `chili-300`; `chili` appears only as rules and marks.

## 7. Performance notes

`/about-v3` is a static prerender at 10.6 kB with 167 kB first-load JS. Most
section markup is server-rendered; five bounded client components cover the
founder transition, the dossier entrance, the handoff crossfade, the atlas
sequence and the recovery player. No dependency was added — GSAP, `@gsap/react`,
ScrollTrigger and Lenis were already present.

Every media box declares an explicit `aspect-ratio`, so nothing shifts on load.
Below-the-fold images are lazy; the video is `preload="none"` with no source
attached until requested, so only one video can ever be active and none is
eagerly downloaded.

## 8. Gate C

**Awaiting user review.** Specific decisions worth making at review:

1. Anton versus Bebas Neue for the condensed display face (§3.2).
2. Whether the drawn founder placeholder is acceptable until real media exists,
   or whether Sections 01–02 should hold until the founder packs land (§3.1).
3. Whether the 16:9 media stages should stay, or the locked plates should be
   re-cropped to the lockups' letterbox and lose subject headroom (§3.4).

No critical or high defect is outstanding. The remaining gaps in §5 are missing
source material, not implementation debt.
