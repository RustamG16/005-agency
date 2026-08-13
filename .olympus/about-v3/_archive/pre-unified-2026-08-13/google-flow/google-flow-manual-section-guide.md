# Google Flow manual section guide — About V3

## Status and reason for reset

The 2026-08-13 all-at-once batch is rejected as production media. Flow treated the office and red reveal studio as one location, reconstructed the office, and propagated the invented room into later assets.

Rejected office-family outputs: `O00`, `D00`, `I00`, `J00`.

Rejected reveal-family outputs: `R00`, `R01-R-F0`, `R01-R-F1`, `F01` because they use the office as the reveal location.

Do not delete the rejected batch; retain it as failure evidence. Do not use any rejected output as a reference for a new generation.

## Add these separate Flow Agent instructions

Create five instruction cards in Flow. Enable the title field and use the titles and contents below.

### Instruction 1 title: `01 — CREDIT GATE AND MANUAL APPROVAL`

```text
Never generate automatically. Before every generation, state the asset ID, output type, aspect ratio, model, candidate count, credit cost and exact references that will be used. Wait for explicit human approval. Generate only the one requested asset or candidate family. Do not continue to the next asset.
```

### Instruction 2 title: `02 — TWO LOCATIONS MUST NEVER MERGE`

```text
This project contains two unrelated physical locations. LOCATION A is the warm daylight Convenium office defined only by office-environment-reference. LOCATION B is an independent black-and-red founder reveal studio defined only by reveal-lighting-reference. The reveal studio is not the office at night and is not a transformed office. Never transfer architecture, furniture, windows, blinds, wall boards, shelves, plants, logos, props or lighting between the two locations. If a prompt concerns one location, ignore and do not use the other location's reference.
```

### Instruction 3 title: `03 — OFFICE MASTER IS PIXEL-LOCKED`

```text
office-environment-reference is the single approved office master. For office work, perform an image edit of that exact image; do not generate a new room from it. Preserve the original camera position, crop, perspective, wall dimensions, left window and black blinds, radiator, central black presentation board, its existing Convenium mark and pinned content, two black desks, monitors, laptops, black mesh chairs, right shelving, existing shelf sign, books, plants, floor, rug, daylight direction and shadows. Existing signage and board content must remain exactly as inherited. Do not redesign, simplify, erase, replace, retype or approximate them. Change only the specifically named movable foreground objects or people. If the requested change would require inventing unseen architecture or another camera angle, stop and report OFFICE-ANGLE-NOT-SUPPORTED.
```

### Instruction 4 title: `04 — RUSTAM AND MARIJA CAST RULES`

```text
Invoke @rustam only when the current asset explicitly requires Rustam. Preserve the approved Character identity, proportions and wardrobe. This production phase excludes Marija: never depict, infer, approximate or substitute her, and never place another woman in her reserved position. Do not add anonymous staff, clients or background people unless the current asset explicitly authorizes them.
```

### Instruction 5 title: `05 — REFERENCES AND REJECTED OUTPUTS`

```text
Use only the references explicitly listed in the current asset prompt. Do not add references because they appear elsewhere in the project. Never use anything in a REJECTED collection or any asset whose filename contains REJECTED or SELECT-PENDING-HUMAN-APPROVAL as an input. After generation, report every reference actually used and wait for human selection. A selected candidate does not become a continuity reference until the human explicitly marks it APPROVED-CONTINUITY-MASTER.
```

## Section 1 — establish the office master

### Decision

Do **not** regenerate `O00`. The supplied `office-environment-reference` already is the approved 16:9 office master. Rename or copy it inside Flow as:

`O00-OFFICE-MASTER-APPROVED-CONTINUITY`

This prevents a generated approximation from replacing the source of truth.

### Manual Flow steps

1. Create a collection titled `10_OFFICE_APPROVED`.
2. Put only `office-environment-reference` in it.
3. Rename a copy to `O00-OFFICE-MASTER-APPROVED-CONTINUITY`.
4. Do not add `reveal-lighting-reference`, `hero-composition-reference`, `@rustam`, or any rejected output.
5. Do not press Generate for O00. The source image itself is O00.

### Office-master validation checklist

- The left window has the same number, scale and position of panes and the same black blinds.
- The warm wall proportions and central black presentation board are unchanged.
- The existing Convenium wall mark and all pinned presentation elements remain visible in their original locations.
- The two-desk island, monitor arrangement, laptops, chairs and under-desk cabinets remain unchanged.
- The right shelf, its existing sign, books and plants remain unchanged.
- The original daylight, shadows, floor and rug remain unchanged.

If all six pass, the office master is approved without generation.

## Next manual asset after approval: D00 consultation plate

Do not run this yet. We will create D00 by editing `O00-OFFICE-MASTER-APPROVED-CONTINUITY`, changing only a small, explicitly selected foreground area. We will not erase the presentation board, change the camera, move the walls, or rebuild the room.

## Reveal studio rule for later

When we reach the founder reveal, start a separate collection titled `20_REVEAL_STUDIO`. Use `reveal-lighting-reference` only. Do not include the office master. First generate and approve an empty black-and-red stage master; only then add `@rustam` in separate start/end frames.
