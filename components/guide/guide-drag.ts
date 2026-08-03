/**
 * The Guide — in-stage drag.
 *
 * REVISED 2026-08-03 (Russ). The original model — puck drags along the viewport
 * edges, docks to an edge, position persisted, drop on a section to jump there
 * (DESIGN-LOCK §3, spec §4) — is RETIRED. The robot and his pad are locked to a
 * stage in the bottom-right corner. You can pick him up and nudge him around
 * inside that stage; on release he plays the Walking clip and returns to
 * standing on the pad. Nothing persists, because he always ends up home.
 *
 * Drop-to-jump goes with it: he cannot leave the corner, so he cannot be
 * dropped on a section. Navigation is the radial menu's job (Track B).
 *
 * NOTE ON POINTER CAPTURE — deliberately absent.
 * The design board calls `setPointerCapture()` on every `pointerdown`. That
 * redirects `pointerup` to the puck instead of the element actually under the
 * cursor, and a mousedown/mouseup pair landing on different elements suppresses
 * the browser's native `click` synthesis — silently breaking click-to-open for
 * every real click, not just drags. Synthetic `el.click()` tests never catch it
 * because they bypass the pointer pipeline entirely. Listening on `window`
 * gives the same "keep tracking outside the element" behavior, so capture is
 * not needed at all.
 */

import type { gsap as GsapType } from "gsap";
import type { GuidePose } from "./guide-robot";

/** Movement past this many px turns a press into a drag. */
const DRAG_THRESHOLD = 4;

/**
 * How far he may stray from the pad centre, in model heights. Kept small so he
 * stays inside the rendered frame — beyond this he would clip the canvas edge.
 */
const REACH_X = 0.42;
const REACH_UP = 0.3;
const REACH_DOWN = 0.1;

type Options = {
  gsap: typeof GsapType;
  pose: GuidePose;
  puck: HTMLElement;
  /** Stage size in px, used to convert pointer pixels into model heights. */
  getSize(): number;
  onDragStart(): void;
  onDragEnd(): void;
  /** Fired only for a genuine press with no drag. */
  onTap(): void;
  reduced: boolean;
};

export type DragController = {
  attach(): () => void;
};

export function createDragController(opts: Options): DragController {
  const { gsap, pose, puck, getSize, onDragStart, onDragEnd, onTap, reduced } = opts;

  const clampX = gsap.utils.clamp(-REACH_X, REACH_X);
  const clampY = gsap.utils.clamp(-REACH_DOWN, REACH_UP);

  /* Continuously written while the pointer moves, so one reused tween each
   * rather than a new tween per pointermove event. */
  const xTo = gsap.quickTo(pose, "offsetX", { duration: 0.18, ease: "power2.out" });
  const yTo = gsap.quickTo(pose, "offsetY", { duration: 0.18, ease: "power2.out" });

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const baseX = pose.offsetX;
    const baseY = pose.offsetY;
    let dragging = false;

    /** The rendered frame spans ~1.34 model heights across the stage box. */
    const perPixel = () => 1.34 / Math.max(getSize(), 1);

    const finish = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);

      if (!dragging) {
        // A press with no movement is a click. Let the native click through.
        onTap();
        return;
      }

      puck.style.willChange = "";

      // He walks himself back onto the pad.
      const distance = Math.hypot(pose.offsetX, pose.offsetY);
      const duration = reduced ? 0 : Math.min(1.1, 0.35 + distance * 1.6);
      gsap.to(pose, {
        offsetX: 0,
        offsetY: 0,
        duration,
        ease: "power2.inOut",
        overwrite: "auto",
        onComplete: onDragEnd,
      });
      if (reduced) onDragEnd();
    };

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      if (!dragging) {
        if (Math.hypot(dx, dy) <= DRAG_THRESHOLD) return;
        dragging = true;
        puck.style.willChange = "transform";
        onDragStart();
      }

      const k = perPixel();
      xTo(clampX(baseX + dx * k));
      // Screen y grows downward; model y grows upward.
      yTo(clampY(baseY - dy * k));
    };

    const onUp = () => finish();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return {
    attach() {
      puck.addEventListener("pointerdown", onPointerDown);
      return () => {
        puck.removeEventListener("pointerdown", onPointerDown);
        gsap.killTweensOf(pose);
      };
    },
  };
}
