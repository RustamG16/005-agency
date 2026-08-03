# Block-word face — design

**Date:** 2026-08-03
**Decision:** The blocks that form the shell migrate into the dark void at the centre of the
face and resolve into one word at a time. No display, no texture, no HTML. The word is made of
the same instanced objects as the head.

---

## Why this can't look layered

One `InstancedMesh`. One material. One draw call. The blocks spelling a word are literally the
same instances that were sitting on the skull a moment earlier — same lights, same render pass,
same shading. There is no compositing step, so there is no seam to give it away.

This is the pattern `monolith.ts` already uses: `rest[]` and `exploded[]` position arrays tweened
on one paused GSAP timeline. Here it's `shell[]` and `word[]`, and the targets come from
letterforms instead of a lattice.

---

## Where the blocks come from

**Only the inner rim of the face opening.** The blocks bordering the void migrate inward; the
outer silhouette never thins.

This matters for two reasons. The silhouette is what makes the render read at a glance — losing
blocks from the outer edge would soften it. And the rim is already the densest, most fragmented
region in the generated image, so drawing from there looks intentional rather than like damage.

The read is: **the face opens, and the opening becomes speech.**

---

## The hard constraint: the void is portrait

The dark area is a tall ovoid, roughly 40% of the head height and narrower than it is tall. That
geometry favours short words.

| Word | Chars | Read |
| --- | --- | --- |
| `WORK` | 4 | Excellent |
| `INDEX` | 5 | Excellent |
| `STUDIO` | 6 | Good |
| `CONTACT` | 7 | Acceptable |
| `CONVENIUM` | 9 | **Hardest case** — letters get small |

Design around ≤6 characters. `CONVENIUM` is the one word that will fight the space, and it's the
one you most want. Two options if it doesn't read: set it noticeably smaller and accept it as a
texture-like signature rather than a legible word, or break it across two lines. Test before
committing to it as the hero beat.

**Use Archivo Black for the sampling font.** Heavy strokes yield more sampled pixels per glyph,
which is the whole game at this resolution. A light font would fall apart.

---

## Sampling

1. Draw the word to an offscreen 2D canvas in Archivo Black, white on black.
2. Read `getImageData`, walk it with a stride (start at 4px, tune).
3. For every pixel above threshold, emit a target position.
4. Map canvas x/y → 3D x/y on a plane inside the void.
5. **Add per-block random z jitter of ±2–3% of head depth.**

Step 5 is not optional. If every letter block lands on one flat plane, the word reads as a decal
stuck to his face. The jitter is what makes it read as his own particles occupying space.

Budget roughly 250–400 blocks for a word. At 9 characters that's ~35 per glyph, which is chunky
but legible in a heavy face.

---

## Instance budget

| Pool | Count | Notes |
| --- | --- | --- |
| Shell | ~3,000–4,000 | Matches the density in the generated render |
| Word (drawn from rim) | 250–400 | Subset of the above, not additional |
| **Total** | **~4,000** | One `InstancedMesh`, one draw call |

Per-instance colour via `setColorAt`. Changing colour is far cheaper than moving matrices, so
colour-only states are effectively free.

---

## Colour states

| State | Token | Value |
| --- | --- | --- |
| Shell blocks | ink | `#241F1F` |
| Letter blocks | cherry | `#810100` |
| Leading edge during transition | chili | `#D73B3E` |
| Chamfer highlight | hairline | `#D6D2C2` |

Chili only on blocks currently in motion — it cools to cherry as each block lands. The word
arrives hot and settles. Costs nothing, and it makes the transition legible.

---

## Transition

Blocks must never teleport.

- GSAP stagger from the rim inward, ~0.4–0.6s total
- Arc the paths slightly rather than moving in straight lines
- Ease `power3.out` on arrival — same language as the monolith fracture

**Word-to-word switching: move only the delta.** Blocks whose target is occupied in both words
stay put. Only blocks that need to relocate move. This is cheaper *and* it reads better — the
word morphs rather than fully dissolving and rebuilding.

Blocks not needed for the current word stay on the shell. They're never hidden or destroyed.

---

## Expressive vocabulary

One system, and it gives the character a full range without any extra machinery:

| Beat | Behaviour |
| --- | --- |
| Idle | Blocks at rest on the skull, slow drift |
| About to speak | Rim blocks lift and hover |
| Speaking | Word resolves in the void |
| Emphasis | Word blocks pulse chili, then settle |
| Done | Blocks return to the shell |

---

## Constraints carried forward

- **The faceplate stays a dark void permanently.** Nothing is ever projected onto it. This
  supersedes the earlier plan to blank it *so we could* project on it — now it's blank because
  the void is where the word lives.
- **Reduced motion:** blocks snap to the word position with no travel, or the word never forms
  and the copy appears in the DOM instead.
- **Mobile:** at 390px the void is small. Test `CONVENIUM` there first — if it fails on mobile it
  fails, regardless of how it reads on desktop.

---

## What Rodin still provides

The blocks are procedural, so Rodin is generating the **smooth inner skull** and the **tendrils**
only. The block shell in the reference render is a guide for density and distribution, not
geometry to be reconstructed.

This lowers the bar on the mesh considerably: a smooth ovoid with tendrils is a far easier
reconstruction than a few thousand small blocks, and it will decimate cleanly.
