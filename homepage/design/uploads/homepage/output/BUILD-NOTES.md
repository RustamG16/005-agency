# Build notes — locked decisions from the model inspection (2026-08-03)

Everything below was read off `assets/repo_robot.glb` in a live three.js harness
(`Robot Recolor Lab.dc.html` + `robot-lab.js` at the project root), not guessed.
Ported into `output/components/sections/home/guide/guide.ts`.

## What the GLB actually contains

| Thing | Real value |
|---|---|
| Meshes | `BODY_Body_0` (material `Body`), `PARTS_parts_0` (material `parts`) — 2 skinned meshes, one skeleton |
| PARTS covers | eye domes, pupil nubs, arms, legs, back panel strips |
| BODY covers | dome shell + belt band |
| Eye bones | `eyeR_06`, `eyeL_08` (mirrored local axes) · head bone `Head_05` |
| Clips | `Armature|action_Greet`, `Armature|Run`, `Armature|Talk`, `Armature|Walking` |
| Base colour maps | red rust — dropped (and disposed) |
| Emissive map | **green, and it lights the BACK PANEL strips, not the eye** — dropped |
| Normal maps | kept at `normalScale 0.6` (surface, no colour) |

## Locked recolor + eye rig

- `Body` → ink `#241F1F`, roughness 0.85, metalness 0.15.
- `parts` → noir `#1B1717`, roughness 0.9, metalness 0.1.
- Eye: own sphere per eye bone, `emissive` chili `#D73B3E`, `emissiveIntensity 1`
  (`toneMapped: false`). Radius = 3.4% of robot height; forward offset = 24.4%
  of robot height, applied in world space then baked into each bone's local
  frame (the bones are mirrored — a shared local offset sends one pupil into the
  back of the head). CTA step: intensity → 1.55.
- Light: one warm key `0xFFF1E0` @ 4.0 from (-3.2, 4.4, 3.4) + ambient
  `0x8D867D` @ 0.45. No shadow maps.
- Gestures come from the rig, not fake bone rotation: `Talk` for the process
  point and the FAQ shrug, `action_Greet` for the CTA wave, `Walking` keyed to
  travelled distance (deterministic, so the scrub is identical in both
  directions). Head yaw is applied after `mixer.update(0)`.

## Where the review lives

Copy steps, the accent audit, the chapter-by-chapter self-review and the full
deviation list are in `INTEGRATION.md`. The harness that produced these numbers
(`Robot Recolor Lab.dc.html` + `robot-lab.js`, at the project root) is a design
tool, not part of the ship — it loads the GLB straight from `uploads/` and
applies the same overrides so the look can be re-judged after any change.
