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
 * THE RETURN, ADDED 2026-08-08 (R6). "Goes where he is put" left him strandable:
 * park him over a heading and he stays there, across reloads, forever. So he now
 * comes home on his own after a spell of being left alone — see `returnHome`.
 * This is NOT the 2026-08-03 corner-lock coming back. That fired on release and
 * made the drag feel like it had been undone; this fires only after a standby
 * with no interaction at all, and any touch cancels it outright. The difference
 * that matters: the corner-lock fought the user, this one waits for them to
 * finish.
 *
 * The tween writes the SAME `pos` object the pointer path writes, which is what
 * lets a drag interrupt a return mid-flight and continue from wherever he had
 * got to, rather than snapping back to where the tween started.
 *
 * NOTE ON POINTER CAPTURE — deliberately absent.
 * `setPointerCapture()` on `pointerdown` redirects `pointerup` to the puck
 * instead of the element actually under the cursor, and a mousedown/mouseup
 * pair landing on different elements suppresses the browser's native `click`
 * synthesis — silently breaking click-to-open for every real click, not just
 * drags. Synthetic `el.click()` tests never catch it. Listening on `window`
 * gives the same "keep tracking outside the element" behaviour.
 */

import type { gsap as GsapType } from "gsap";
import type { GuidePoint } from "./guide-state";

/** Movement past this many px turns a press into a drag. */
const DRAG_THRESHOLD = 4;

/** He never gets closer than this to a viewport edge. */
const EDGE_PAD = 8;

/** Closer to home than this in both axes and he counts as already there. */
const HOME_EPSILON = 0.5;

/* The walk home is paced by DISTANCE, not given a fixed duration: a nudge and a
 * cross-screen trek taking the same time is exactly what makes a walk cycle read
 * as a slide. ~320px/s is slow enough to look deliberate, and the clamp keeps a
 * tiny correction from being instant or a corner-to-corner trip from being a
 * journey. */
const RETURN_SPEED_PX_PER_S = 320;
const RETURN_MIN_S = 0.9;
const RETURN_MAX_S = 2.6;

type Options = {
  /** The element that travels. */
  dock: HTMLElement;
  /** The handle. */
  puck: HTMLElement;
  /** Where he starts, restored from storage. */
  initial: GuidePoint;
  gsap: typeof GsapType;
  reduced: boolean;
  onDragStart(): void;
  onDragEnd(): void;
  /** Fired only for a genuine press with no drag. */
  onTap(): void;
  /** Fired once per drop, for persistence. */
  onSettle(pos: GuidePoint): void;
  /** He has started walking home. */
  onReturnStart(): void;
  /** He arrived, or was interrupted. `arrived` says which. */
  onReturnEnd(arrived: boolean): void;
};

export type DragController = {
  attach(): () => void;
  /** Current offset from the dock's CSS home, in px. */
  position(): GuidePoint;
  /** Re-clamp after a viewport change. */
  reclamp(): void;
  /** Walk him back to the dock's CSS home. No-op if he is already there. */
  returnHome(): void;
  /** Kill an in-flight return. Safe to call when none is running. */
  cancelReturn(): void;
  isHome(): boolean;
  isReturning(): boolean;
};

export function createDragController(opts: Options): DragController {
  const {
    dock,
    puck,
    initial,
    gsap,
    reduced,
    onDragStart,
    onDragEnd,
    onTap,
    onSettle,
    onReturnStart,
    onReturnEnd,
  } = opts;

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

  /* ---- the walk home ---- */

  let returnTween: ReturnType<typeof GsapType.to> | null = null;

  const isHome = () => Math.abs(pos.x) < HOME_EPSILON && Math.abs(pos.y) < HOME_EPSILON;

  const endReturn = (arrived: boolean) => {
    returnTween = null;
    dock.style.willChange = "";
    onReturnEnd(arrived);
  };

  const cancelReturn = () => {
    if (!returnTween) return;
    returnTween.kill();
    endReturn(false);
  };

  const returnHome = () => {
    // Already home, mid-return, or being carried — all three mean "not now".
    if (isHome() || returnTween || activePointerId !== null) return;

    onReturnStart();

    /* Reduced motion: an instant, unanimated snap. Travelling him across the
     * viewport is precisely the vestibular trigger the media query exists to
     * suppress, and the docblock in GuideScene calls reduced motion a STATE —
     * he is still rendered, he just does not move. */
    if (reduced) {
      pos.x = 0;
      pos.y = 0;
      write();
      endReturn(true);
      return;
    }

    const duration = gsap.utils.clamp(
      RETURN_MIN_S,
      RETURN_MAX_S,
      Math.hypot(pos.x, pos.y) / RETURN_SPEED_PX_PER_S
    );

    dock.style.willChange = "transform";
    returnTween = gsap.to(pos, {
      x: 0,
      y: 0,
      duration,
      /* `power2.inOut` and not the house `expo.out`: an out-only curve leaves at
       * full speed and creeps in, which reads as him being dragged by a string.
       * Something walking accelerates and decelerates at both ends. */
      ease: "power2.inOut",
      onUpdate: () => {
        // Still clamped on the way home — a viewport that shrinks mid-walk must
        // not let the path cut through an edge.
        clamp();
        write();
      },
      onComplete: () => {
        write();
        endReturn(true);
      },
    });
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    if (activePointerId !== null) return;

    /* Before anything else. A return in flight is still writing `pos` every
     * frame, and the drag below snapshots `pos` as its base — so leaving the
     * tween alive would have the two fighting over the same two numbers, and he
     * would crawl toward home while you carried him away. */
    cancelReturn();

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
        // A tween left running past teardown keeps writing to a detached node
        // on every frame of the next route.
        if (returnTween) {
          returnTween.kill();
          returnTween = null;
        }
      };
    },
    position: () => ({ x: pos.x, y: pos.y }),
    reclamp() {
      clamp();
      write();
    },
    returnHome,
    cancelReturn,
    isHome,
    isReturning: () => returnTween !== null,
  };
}
