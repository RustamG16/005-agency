"use client";

/**
 * The Guide — speech bubble shell (DESIGN-LOCK §5).
 *
 * Track A ships the shell and the anchoring only. Content comes from
 * `guideStore.speak()`; the lines themselves are Track B's.
 *
 * The bubble tracks the projected crown of `Head_05` every frame, so its
 * position is written directly rather than through React state or a transition.
 */

import { useEffect, useRef, type RefObject } from "react";
import { guideStore, useGuide } from "./guide-state";
import styles from "./GuideBubble.module.css";

/** Gap between the crown and the bubble's bottom edge. */
const CROWN_GAP = 12;

/** Gap below the puck when the bubble flips under it. */
const FLIP_GAP = 14;

/** Keep the bubble this far from the viewport edges. */
const EDGE_PAD = 14;

/** The tail never comes closer than this to either end of the bubble. */
const TAIL_CLAMP = 18;

export function GuideBubble({ dockRef }: { dockRef: RefObject<HTMLDivElement | null> }) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const { line } = useGuide();

  useEffect(() => {
    const anchor = anchorRef.current;
    const bubble = bubbleRef.current;
    if (!anchor || !bubble) return;

    const place = (crown: { x: number; y: number } | null) => {
      if (!crown) {
        anchor.style.visibility = "hidden";
        return;
      }
      anchor.style.visibility = "";

      const bw = bubble.offsetWidth || 200;
      const bh = bubble.offsetHeight || 72;
      const vw = window.innerWidth;

      // Within one bubble-height of the top edge, flip below the puck — the
      // tail moves to the top edge and still points at the head.
      const flip = crown.y - bh - CROWN_GAP < EDGE_PAD;

      const maxLeft = Math.max(EDGE_PAD, vw - EDGE_PAD - bw);
      const left = Math.min(Math.max(crown.x - bw / 2, EDGE_PAD), maxLeft);

      let top: number;
      if (flip) {
        const dockRect = dockRef.current?.getBoundingClientRect();
        top = (dockRect ? dockRect.bottom : crown.y) + FLIP_GAP;
      } else {
        top = crown.y - CROWN_GAP - bh;
      }

      anchor.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
      bubble.dataset.flip = flip ? "below" : "above";

      // Past the clamp the bubble has already shifted, so the tail pins.
      const tailX = Math.min(Math.max(crown.x - left, TAIL_CLAMP), Math.max(TAIL_CLAMP, bw - TAIL_CLAMP));
      bubble.style.setProperty("--tail-x", `${tailX.toFixed(1)}px`);
    };

    place(guideStore.crownScreen);
    return guideStore.subscribeCrown(place);
  }, [dockRef]);

  return (
    <>
      <div ref={anchorRef} className={styles.anchor} aria-hidden="true">
        <div ref={bubbleRef} className={styles.bubble} data-open={line ? "true" : "false"} data-flip="above">
          {line ? (
            <>
              <p className={styles.eyebrow}>{line.eyebrow}</p>
              <p className={styles.line}>{line.text}</p>
            </>
          ) : null}
          <span className={styles.tail} />
        </div>
      </div>
      {/* The bubble itself is decoration; this carries the same copy for
          screen readers (HOME-GUIDE-SPEC §4). */}
      <p className="visually-hidden" role="status" aria-live="polite">
        {line ? `${line.eyebrow}. ${line.text}` : ""}
      </p>
    </>
  );
}
