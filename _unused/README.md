# _unused — quarantined files

Moved 2026-08-01. **Nothing was deleted.** Tracked files were moved with `git mv`
(history preserved, reversible via `git restore` / `git mv` back).

Verification before moving: `npx tsc --noEmit` clean, and no remaining reference
to any moved path from `app/`, `components/`, `content/`, `styles/`, `public/`.
`npm run build` was not run (sandbox has no npm registry access) — run it locally
to confirm.

## components/ — dead code

Zero import sites anywhere in `app/`, `components/`, `content/`:

| File | Was in |
|---|---|
| `Intro.tsx` + `.module.css` | `components/sections/home/` |
| `Manifesto.tsx` + `.module.css` | `components/sections/home/` |
| `ServiceRow.tsx` + `.module.css` | `components/sections/services/` |
| `WorksGrid.tsx` + `.module.css` | `components/sections/works/` |

Note: `ContactIntro` is a *different*, live component and was not touched.

## public-assets/ — unreferenced by any component

- `images/still-team-45.jpg` — the other `still-team-*` frames are all referenced; this one is not
- `media/hero_autoplay.mp4.bak`, `media/team.mp4.bak` — pre-re-encode backups
- `media/newmedia/Dolly_push_revealing_painting_1080p_202607232001.mp4` — never wired up

## duplicates/

- `design_claude - Copy/` — byte-identical duplicate of `design_claude/` (17 MB). The original stays in place.
- `design_claude_homepage/` — empty directory, could not be removed from the sandbox (`Operation not permitted`). Delete it manually.

## docs/ — superseded

- `ABOUT-CLAUDE-PROMPT.md`, `ABOUT-REDESIGN-GUIDE.md` — both self-labelled `# SUPERSEDED`, replaced by `design_claude/`
- `MEDIA-GUIDE.md` — superseded by `MEDIA-GUIDE-R5.md`
- `HOMEPAGE-FIX-GUIDE.md`, `CURSOR-PLAN-PROMPT.md`, `CURSOR-AWWWARDS-PROMPT.md`, `designFixPlanCursor.txt`, `SELECTED-WORKS-CARD-GUIDE.md` — one-off prompt/fix guides, not referenced by `CLAUDE.md`

⚠️ `MEDIA-GUIDE-R5.md` and `PROJECT-PREVIEW-GUIDE.md` (both kept) contain prose
cross-references to some of these filenames. Nothing breaks, but the links now
point into `_unused/docs/`.

## logs/

`.dev-server.log`, `.dev-server.err.log`, `.dev-verify.out.log`, `.dev-verify.err.log`

## generated/ — regenerable, ~540 MB (gitignored)

`.next-build/`, `.next-dev/`, `.next-verify/`, `screenshots/`, `audit-shots/`,
`tsconfig.tsbuildinfo`

**Safe to delete outright** — `npm run build` and `npm run screenshot` recreate them.
`_unused/generated/` was added to `.gitignore`.

Note: `tsconfig.json` `include` still lists `.next-dev/types` and `.next-build/types`;
those regenerate on the next build. `_unused` was added to `exclude`.

## Kept deliberately

`assets/` (design PNG specs + raw video sources), `archive/`, `docs/`, `qa/`,
`scripts/` (3 are wired to npm scripts, rest are one-shot Playwright tools),
`audit-notes.json`, `symbol-studio-design-audit.md`.

## Undo

```sh
git status            # see what moved
git checkout -- .     # revert tracked moves
```
