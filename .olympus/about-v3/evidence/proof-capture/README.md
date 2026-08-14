# Section 09 — matched before/after capture attempt

Date: 2026-08-14
Script: `scripts/capture-proof-pair.mjs`

The About V3 handoff allows Sonnwerk to ship a real before/after slider once
matched captures of both states exist. `MEDIA-PLANNING-HANDOFF.md` §09 records
the two sources, so both were attempted at one identical 1440 × 900 viewport.

| Source | URL | Result |
|---|---|---|
| Sonnwerk — proposed | `https://rustamg16.github.io/002-sonnwerk/` | captured, `sonnwerk-proposed.png` |
| Sonnwerk — existing | `https://sonn-werk.at/` | **HTTP 403 Forbidden** — the host refuses headless requests |
| Meridian — existing | *none recorded* | no source documented anywhere |

The 403 response page was deleted rather than kept: it is a server error page,
not a capture of the client's site, and retaining it invites someone to mistake
it for one. The refusal itself is recorded here instead.

`sonnwerk-proposed.png` is kept as proof the pipeline works and that only the
existing half is missing. It is not used on the page — Section 09's "new
direction" panels use the existing deterministic captures under
`public/works/`, produced by `scripts/capture-preview.mjs`.

**Consequence:** neither project has verified matched evidence, so both rows on
`/about-v3` render the "Existing capture required / Matched viewport — pending
source" state. That is the state the confirmed lockup itself shows. No
fabricated before state ships.

To finish the comparison later, obtain a capture of the existing Sonnwerk site
through a route the host permits, drop it in as
`public/images/about-v3/proof-sonnwerk-existing.webp`, and point
`aboutV3.proof.projects[0].source.existing` at it. The slider in
`ProofComparison.tsx` is already built and will render as soon as that value
stops being `null`.
