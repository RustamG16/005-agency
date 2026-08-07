# Convenium Studio — Project rules for Claude Code

## What this is

A production website for Convenium Studio (fictional-brand portfolio project). The layout language follows the reference PNGs in `assets/design/`; the identity, copy and assets are Convenium's own.

**Selected Works is the exception: those four projects are real and shipped.** Sonn'werk, The Meridian, SR Urologie and Education4Students each link out to their live site, and their preview media is deterministic capture of those sites — real pixels, never a mockup or a generated approximation. Two consequences:

- Copy about them must stay checkable. Describe what was built; no invented metrics, no outcome claims we cannot stand behind. Where a line reads like a claim it should be the client's own positioning carried over (Sonn'werk's "from the field to the bottle" is their tagline, translated).
- The Meridian is a **concept build**, not a booked hotel client, and is labelled as such in its `sector`. Do not quietly promote it.

See `content/projects.ts` for the media contract and `PROJECT-PREVIEW-GUIDE.md` for how the captures are made.

## Read before coding

1. `IMPLEMENTATION-PLAN.md` — the build plan. §0 is the execution protocol; follow it.
2. `DESIGN.md` — design tokens (colors, type, spacing, components). The only source of visual values. `styles/tokens.css` is its executable form.
3. `symbol-studio-design-audit.md` + `audit-notes.json` — measured reference geometry (nav 480×40, cards ~448×580, radii 8/10px). These override guesses from PNGs.
4. `.claude/skills/frontend-design/` — design-quality skill; apply it to all UI work.

## Hard rules

- No Symbol Studio content may ship: no "SYMBOL STUDIO" strings, their logo, project names, images, copy, the Rules font, or orange `#FE552E`. Grep for these in Phase 5.
- Colors only from tokens: noir `#1B1717`, cotton `#EDEBDD`, paper `#F5F3E8`, ink `#241F1F`, gray `#6E6963` (`#A8A29A` on noir), hairline `#D6D2C2`, cherry `#810100`, maroon `#630000`, chili `#D73B3E`, chili-300 `#E5595C`.
- Red roles are fixed (see `DESIGN.md` → Red rule): cherry is the only red that carries cotton text or acts as text on cotton; maroon is a depth step only, never text and never a peer to cherry; chili is graphic-only on noir (≥24px display, rules, marks) and body-size accent text on noir uses chili-300. Gold `#B18A46` is retired.
- Fonts: Archivo Black / Newsreader / Inter via `next/font` only.
- No gradients, glassmorphism, emoji icons, decorative shadows, or blanket scroll-fade animations.
- Reference PNGs are specs — never ship them as page images.
- Don't fabricate clients, testimonials, awards, staff, addresses or phone numbers.

## Verification (every phase)

`npm run build` clean → Playwright full-page screenshots at 1440×900 and 390×844 → compare against `assets/design/` → console error check including after scroll/hover → then mark done. Deviations must be listed, not silently accepted.
