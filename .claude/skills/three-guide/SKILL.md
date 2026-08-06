---
name: three-guide
description: Three.js patterns for this repo's 3D work — the corner guide robot (repo_robot.glb), texture recolor pipeline, bone projection, transparent puck canvas, perf gates. Use for ANY task touching WebGL, the robot, GLB loading, or 3D-DOM anchoring.
---

# Three.js — Convenium guide patterns

Authoritative values live in `homepage/design/DESIGN-LOCK.md` and
`homepage/design/uploads/homepage/HOME-GUIDE-SPEC.md` §1. This skill is the HOW;
those files are the WHAT. Never re-decide locked values.

## Canvas setup (puck)

- `WebGLRenderer({ alpha: true, antialias: true })`, `setClearColor(0x000000, 0)`,
  DPR capped at `Math.min(devicePixelRatio, 2)`.
- `outputColorSpace = SRGBColorSpace`. No shadow maps — lighting is locked to
  key `0xFFF1E0` @ 4.0 from (-3.2, 4.4, 3.4) + ambient `0x8D867D` @ 0.45.
- Frame the model by a kept-height SPAN (0.02→1.10 of model height), not a
  scale factor. Compute from the model's bounding box after load.
- Render loop: pause when `document.hidden` and between idle ticks in sleep
  state — `renderer.setAnimationLoop(null)` to stop, not a boolean in the loop.

## GLB loading

- `GLTFLoader`; load lazily after first paint (dynamic import of the scene
  component with `next/dynamic`, `ssr: false`).
- Clips: check `gltf.animations`; drive with `AnimationMixer`, crossfade with
  `clip.crossFadeTo(next, 0.3)`. Page-level travel is GSAP on the group
  transform, never clips.

## Recolor pipeline (locked — copy, don't reinvent)

Draw base-colour map to a 512² canvas → `getImageData` → per pixel RGB→HSL →
if `(h ≤ 26° || h ≥ 332°) && s ≥ 0.14 && 0.04 < l < 0.97`: rewrite hue/sat to
cherry `#810100`, lightness re-centred on 0.25, contrast ×1.18, γ 0.68 →
`CanvasTexture` with `flipY = false`, `colorSpace = SRGBColorSpace`.
Body: `MeshStandardMaterial` map=remapped, roughness 0.85, metalness 0.15,
normalScale 0.6. Parts: flat noir `#1B1717`, no map. Eyes: emissive sphere per
eye bone, paper `#F5F3E8`, intensity 1.35 (CTA step 1.9), `toneMapped: false`.
Working reference implementation: `homepage/design/robot-lab.js`.

## Bone → screen projection (bubble anchoring)

```js
const v = new THREE.Vector3();
bone.getWorldPosition(v).add(crownOffset);   // crownOffset measured ONCE at load
v.project(camera);
const x = (v.x * 0.5 + 0.5) * canvas.clientWidth  + canvasRect.left;
const y = (-v.y * 0.5 + 0.5) * canvas.clientHeight + canvasRect.top;
```
Run per frame only while a bubble is visible. Write to a store, position the
DOM bubble with `transform: translate(...)` — never top/left.

## Perf rules

- One renderer, one canvas, ever. Dispose geometries/materials/textures on
  unmount (`scene.traverse` + `dispose()`).
- No `MeshPhysicalMaterial`, no postprocessing, no env maps — the look is matte.
- Hit-testing for drag uses DOM pointer events on the puck div, not raycasting.
- `prefers-reduced-motion`: no mixer updates, no idle scheduler, static pose.
