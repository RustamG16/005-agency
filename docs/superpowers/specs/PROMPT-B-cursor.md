# PROMPT B — Cursor Composer, run AFTER Track A's contract file exists

Track A (Claude Code) creates `components/guide/guide-state.ts` first. You only
need that file to exist — you can then work in parallel with the rest of Track A.

---

Read, in order, before planning:
1. `docs/superpowers/specs/2026-08-03-guide-corner-assistant-design.md` (approved spec — your scope is **Track B**)
2. `homepage/design/DESIGN-LOCK.md` §4 (radial), §6 (Ask panel), §7 (states/focus)
3. `homepage/design/uploads/homepage/HOME-GUIDE-SPEC.md` §3 (chapter hint lines table)
4. Root `CLAUDE.md` (hard rules + verification)

Reference: `homepage/design/guide-radial.js` (working radial geometry).
Consume `components/guide/guide-state.ts` — never modify it; if it's missing
something, stop and flag it.

## Your tasks (Track B only — do NOT touch GuideScene, drag, bubble anchoring, or the idle scheduler)

1. **Radial menu** (`components/guide/GuideRadial.tsx`): 6 × 44px petals,
   radius 148, arc 176°→276°, step 20°, always-visible right-aligned label
   index, Ask petal in paper with 8px extra separation, hover pairing, motion
   values — ALL exactly per lock §4. ≤520px: ring dropped, index becomes the
   44px-row stack. Petal action: home = scroll to chapter section; other routes
   = navigate. Opens/closes via `openMenu()/closeMenu()`; opening retires the
   bubble (lock §6 rule: bubble and panel never co-exist).
2. **Guide content config** (`components/guide/guide-content.ts`): per-route
   map — home: 6 chapters with hint lines #01–#06 from HOME-GUIDE-SPEC §3 and
   section anchors; every other page: its petal links + 1–2 hint lines written
   from that page's existing copy only. No invented copy.
3. **Section hints wiring**: ScrollTriggers at chapter thresholds, once per
   direction, call `speak()` with eyebrow `GUIDE — 0n/06`; auto-dismiss after
   6s or on any interaction; sessionStorage frequency cap (each hint max once
   per session per direction).
4. **Ask panel** (`components/guide/GuideAsk.tsx`) exactly per lock §6: 360px
   paper card geometry, chips, log, pinned input, ≤460px sheet behavior with
   the 28px robot mark. Scripted mode: curated chips + answers written ONLY
   from `site.ts` / `services.ts` / FAQ copy. LLM mode behind `GUIDE_LLM=1`:
   `app/api/guide/route.ts` → Anthropic Messages API (key from env, never
   client-side), system prompt embedding the same site copy, ~10 req/hr per IP
   in-memory rate limit, graceful fallback to scripted chips on error.
5. **Extras**: contact-CTA hover → `setEyeStep(true)`; one wave per session on
   first visit (call the store's speak/wave hooks if Track A exposed them,
   otherwise flag); look-at-footer omitted if no head-target API exists — flag,
   don't hack.
6. **Colophon**: footer must render
   `Robot: "REPO Robot" by OscarLomas3D (CC BY 4.0)` linked to
   `https://sketchfab.com/3d-models/repo-robot-d125b0dbd8854f75a7e1fb49cfd4ef14`.
7. **Verify** per CLAUDE.md: `npm run build` clean, Playwright screenshots
   1440×900 + 390×844 (menu open, ask open, mobile stack), console clean,
   grep `OscarLomas3D` passes, grep finds no Symbol Studio strings or `#FE552E`.

Rules: tokens only from `styles/tokens.css`; cherry-on-cotton / chili-300 text
on noir per CLAUDE.md red roles; Inter/Newsreader/Archivo Black via existing
`next/font` only; no gradients, shadows, emoji; focus states per lock §7.
