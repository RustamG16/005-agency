"use client";

/**
 * The hero's full-bleed media slot.
 *
 * Today it renders a type-only noir ground: a flat field and one full-width
 * hairline horizon that travels with scroll progress. It is deliberately NOT a
 * card — DESIGN.md is explicit that the hero medium is full-bleed and never
 * framed — so when the film arrives it occupies exactly this box.
 *
 * DROPPING IN THE FILM IS ONE LINE: set `SCRUB_SRC` below. The component then
 * renders the <video> instead of the horizon and `setProgress` seeks it. No
 * other file changes.
 *
 * HARD RULE (root CLAUDE.md, IMPLEMENTATION-PLAN.md §17.1): only the
 * all-keyframe re-encode may ever be scrubbed. `/media/hero_autoplay.mp4` is a
 * normal encode — seeking it lands on the nearest keyframe and the scrub judders
 * and sticks. Never point SCRUB_SRC at it.
 */

import { useImperativeHandle, useRef, type Ref } from "react";
import styles from "./HeroMedia.module.css";

/** The all-keyframe hero re-encode. Empty until that file exists. */
const SCRUB_SRC = "";

export type HeroMediaHandle = {
  /** Called by the hero's pinned timeline, 0 → 1. */
  setProgress(p: number): void;
};

export function HeroMedia({ handleRef }: { handleRef?: Ref<HeroMediaHandle> }) {
  const horizonRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(
    handleRef,
    () => ({
      setProgress(p: number) {
        const video = videoRef.current;
        if (video) {
          const duration = video.duration;
          if (Number.isFinite(duration) && duration > 0) {
            try {
              video.currentTime = p * duration;
            } catch {
              /* seek before metadata is ready — the next frame will land it */
            }
          }
          return;
        }

        const horizon = horizonRef.current;
        if (horizon) {
          // The placeholder the progress drives until the film lands: the rule
          // rises through the hero's empty upper third. Small on purpose — it is
          // proof the plumbing runs, not a feature.
          horizon.style.transform = `translate3d(0, ${(-p * 6).toFixed(2)}vh, 0)`;
        }
      },
    }),
    []
  );

  return (
    <div className={styles.media} aria-hidden="true">
      {SCRUB_SRC ? (
        <video
          ref={videoRef}
          className={styles.video}
          muted
          playsInline
          preload="auto"
          poster="/images/poster-hero-start.jpg"
        >
          <source src={SCRUB_SRC} type="video/mp4" />
        </video>
      ) : (
        <span ref={horizonRef} className={styles.horizon} />
      )}
    </div>
  );
}
