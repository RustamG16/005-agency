/**
 * The Guide — drag.
 *
 * REWRITTEN 2026-08-04 (Russ). The previous model moved the FIGURE inside a
 * fixed 180px stage: "he does not walk to pointer currently, it disappears if
 * you drag it further than the invisible box". Both symptoms had one cause —
 * the canvas stayed put while the robot travelled, so past about 0.4 model
 * heights he was simply outside it and you were dragging an empty pad around.
 * Widening the reach in the previous pass made that worse, not better.
 *
 * Now the whole stage travels. The pointer moves the dock element itself, 1:1,
 * so he tracks your hand exactly and cannot leave his own frame by definition.
 * He is clamped to stay wholly on screen, he stays where you drop him, and the
 * position survives a reload.
 *
 * This retires the corner-lock from 2026-08-03 (walk back to the pad on
 * release) — he goes where he is put now.
 *
 * NOTE ON POINTER CAPTURE — deliberately absent.
 * `setPointerCapture()` on `pointerdown` redirects `pointerup` to the puck
 * instead of the element actually under the cursor, and a mousedown/mouseup
 * pair landing on different elements suppresses the browser's native `click`
 * synthesis — silently breaking click-to-open for every real click, not just
 * drags. Synthetic `el.click()` tests never catch it. Listening on `window`
 * gives the same "keep tracking outside the element" behaviour.
 */

import type { GuidePoint } from "./guide-state";

/** Movement past this many px turns a press into a drag. */
const DRAG_THRESHOLD = 4;

/** He never gets closer than this to a viewport edge. */
const EDGE_PAD = 8;

type Options = {
  /** The element that travels. */
  dock: HTMLElement;
  /** The handle. */
  puck: HTMLElement;
  /** Where he starts, restored from storage. */
  initial: GuidePoint;
  onDragStart(): void;
  onDragEnd(): void;
  /** Fired only for a genuine press with no drag. */
  onTap(): void;
  /** Fired once per drop, for persistence. */
  onSettle(pos: GuidePoint): void;
};

export type DragController = {
  attach(): () => void;
  /** Current offset from the dock's CSS home, in px. */
  position(): GuidePoint;
  /** Re-clamp after a viewport change. */
  reclamp(): void;
};

export function createDragController(opts: Options): DragController {
  const { dock, puck, initial, onDragStart, onDragEnd, onTap, onSettle } = opts;

  const pos: GuidePoint = { x: initial.x, y: initial.y };

  const write = () => {
    dock.style.setProperty("--guide-x", `${Math.round(pos.x)}px`);
    dock.style.setProperty("--guide-y", `${Math.round(pos.y)}px`);
  };

  /** Keep him wholly on screen, measured against his CSS home. */
  const clamp = () => {
    const r = dock.getBoundingClientRect();
    if (!r.width) return;
    // The rect already includes the current translate, so back it out to get
    // where the stylesheet parks him.
    const homeLeft = r.left - pos.x;
    const homeTop = r.top - pos.y;
    const minX = EDGE_PAD - homeLeft;
    const maxX = window.innerWidth - EDGE_PAD - r.width - homeLeft;
    const minY = EDGE_PAD - homeTop;
    const maxY = window.innerHeight - EDGE_PAD - r.height - homeTop;
    pos.x = Math.min(Math.max(pos.x, minX), Math.max(minX, maxX));
    pos.y = Math.min(Math.max(pos.y, minY), Math.max(minY, maxY));
  };

  write();

  /* The press being tracked. A second finger, or a stray `pointerdown` while a
   * gesture is already live, is ignored rather than quietly installing a second
   * set of window listeners over the first. */
  let activePointerId: number | null = null;

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    if (activePointerId !== null) return;
    activePointerId = e.pointerId;

    const startX = e.clientX;
    const startY = e.clientY;
    const baseX = pos.x;
    const baseY = pos.y;
    let dragging = false;
    let released = false;

    const finish = () => {
      if (released) return;
      released = true;
      activePointerId = null;

      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);

      if (!dragging) {
        // A press with no movement is a click. Let the native click through.
        onTap();
        return;
      }

      dock.style.willChange = "";
      onDragEnd();
      onSettle({ x: pos.x, y: pos.y });
    };

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== activePointerId) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      if (!dragging) {
        if (Math.hypot(dx, dy) <= DRAG_THRESHOLD) return;
        dragging = true;
        dock.style.willChange = "transform";
        onDragStart();
      }

      // 1:1 with the pointer, written straight to the transform. No tween —
      // any easing here reads as him lagging behind your hand.
      pos.x = baseX + dx;
      pos.y = baseY + dy;
      clamp();
      write();
    };

    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== activePointerId) return;
      finish();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return {
    attach() {
      puck.addEventListener("pointerdown", onPointerDown);
      return () => {
        puck.removeEventListener("pointerdown", onPointerDown);
        activePointerId = null;
      };
    },
    position: () => ({ x: pos.x, y: pos.y }),
    reclamp() {
      clamp();
      write();
    },
  };
}
