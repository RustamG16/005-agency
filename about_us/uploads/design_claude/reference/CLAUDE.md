# Convenium Studio — Project rules for Claude Code

## What this is

A production website for Convenium Studio (fictional-brand portfolio project). The layout language follows the reference PNGs in `assets/design/`; the identity, copy and assets are Convenium's own.

## Read before coding

1. `IMPLEMENTATION-PLAN.md` — the build plan. §0 is the execution protocol; follow it.
2. `STITCH-DESIGN.md` — design tokens (colors, type, spacing, components). The only source of visual values.
3. `symbol-studio-design-audit.md` + `audit-notes.json` — measured reference geometry (nav 480×40, cards ~448×580, radii 8/10px). These override guesses from PNGs.
4. `.claude/skills/frontend-design/` — design-quality skill; apply it to all UI work.

## Hard rules

- No Symbol Studio content may ship: no "SYMBOL STUDIO" strings, their logo, project names, images, copy, the Rules font, or orange `#FE552E`. Grep for these in Phase 5.
- Colors only from tokens: `#050505`, `#EEEDE8`, `#F8F7F2`, `#171717`, `#777771`, `#CAC8C0`, gold `#B18A46` (max three uses per page).
- Fonts: Archivo Black / Newsreader / Inter via `next/font` only.
- No gradients, glassmorphism, emoji icons, decorative shadows, or blanket scroll-fade animations.
- Reference PNGs are specs — never ship them as page images.
- The hero video scrub requires the all-keyframe re-encode (`IMPLEMENTATION-PLAN.md` §17.1) — do not scrub the original file.
- Don't fabricate clients, testimonials, awards, staff, addresses or phone numbers.

## Verification (every phase)

`npm run build` clean → Playwright full-page screenshots at 1440×900 and 390×844 → compare against `assets/design/` → console error check including after scroll/hover → then mark done. Deviations must be listed, not silently accepted.
