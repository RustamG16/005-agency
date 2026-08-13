# `/about-v3` implementation and QA record

Date: 2026-08-13
Branch: `codex/about-v3-media-first`
Status: **implementation complete; awaiting user Gate C review**

## Delivered scope

- Replaced the earlier Two Lenses scaffold with the approved unified ten-section narrative.
- Kept the founder-walk hero, paired founder portraits and every Marija/joint-founder media region as explicit production holds.
- Implemented the locked arrival, laboratory, program, Apollo, orchestration and recovery media.
- Generated one Rustam/Apollo handoff start and one endpoint candidate; exact provenance and cost are recorded in `media/production/AV3-06-RUSTAM-APOLLO-HANDOFF/GENERATION-RECORD.md`.
- Implemented Restore / Adapt / Evolve as a keyboard-accessible tab selector.
- Implemented the handoff as a user-controlled still-to-still browser transition; no additional video spend was required.
- Implemented the orchestration map as semantic HTML with browser-owned labels and public-safe role descriptions.
- Retained `AV3-08-V01` as a labelled development motion study with user-controlled forward playback, no scrub/reverse, off-screen pause and a reduced-motion poster.
- Labelled Sonnwerk and Meridian as proposal-stage evidence without outcomes, testimonials or performance claims.
- Reused the shared inquiry form. Delivery remains governed by the existing `/api/inquiry` provider configuration; no provider or dependency was added in this phase.

## Media delivery

- Generation spend in this phase: 24 Higgsfield credits.
- Balance: 732 → 708 credits.
- Paid outputs: two 3840×2160 GPT Image 2 stills; one candidate per state; no retry.
- Additional video generation: none.
- Web delivery: 20 optimized WebP stills plus one 1280px-wide H.264 development proxy under `public/images/about-v3/`.
- Original PNG/MP4 authorities remain under `.olympus/about-v3/media/production/`.

## Automated checks

- Scoped ESLint: pass.
- Impeccable detector: no findings on the changed `/about-v3` UI targets.
- Next.js production build: pass.
- `/about-v3` output: static prerender; 4.3 kB route size; 163 kB first-load JavaScript in the final build report.

## Browser QA

Captured and inspected at:

- desktop: 1440×900;
- desktop FHD: 1920×1080;
- mobile: 390×844;
- reduced motion: 390×844.

Results:

- ten sections present in the authoritative order;
- one `h1`, semantic section headings and one existing page `main`;
- no horizontal overflow at desktop or mobile widths;
- no broken images, console errors or page errors;
- program selector and handoff control update their accessible state;
- recovery media is muted, plays at 1× forward only, pauses off-screen and remains stopped under reduced motion;
- reduced-motion mode leaves every essential element visible;
- focusable controls have names and no image is missing an `alt` attribute.

## Finish review

The independent Impeccable finish review initially returned `fix` for five bounded items: stale durable records, repeated heading kickers, uniform entrances, Unicode action glyphs and procedural SVG grain. All five were repaired and recaptured over the same screenshot paths.

Verdict pass: **5/5 resolved, no visible regressions, `disposition: ship`.**

## Open release decisions

- User Gate C review is still required before the redesign is called final.
- The founder film/banner, paired portraits and Marija evidence remain the approved next media phase.
- The two Rustam/Apollo handoff stills are implementation candidates for later identity/crop polish, not user-locked final authorities.
- `AV3-08-V01` remains a labelled development candidate rather than a locked release master.
