"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { aboutV3 } from "@/content/about-v3";
import { FounderStage } from "./FounderSilhouette";
import { Heading, MetaStrip } from "./Primitives";
import styles from "./AboutV3Page.module.css";

const { opening } = aboutV3;

/**
 * Section 01 — the founder stage, and its transition into the profile pair.
 *
 * Three points about how this is built:
 *
 *  1. **The endpoint is the resting state.** The stylesheet paints the two
 *     portrait windows by default and only shows the wide stage while
 *     `data-state="wide"` is set. So with JavaScript disabled, GSAP failed, or
 *     reduced motion on, the section renders the completed layout with no work
 *     — exactly what the contract asks for, rather than being animated into
 *     existence.
 *
 *  2. **Masks do the work, not movement.** The stage is rendered three times.
 *     One wide copy fades out; the other two are clipped down to portrait
 *     windows. The figures never move a pixel, which is what "the camera and
 *     people remain visually stationary" means in practice.
 *
 *  3. **It is autonomous, forward-only and skippable.** It plays once on
 *     mount, is not tied to scroll, never reverses, and a deliberate scroll,
 *     swipe or the Skip button jumps it to the end. Nothing here has to finish
 *     for the section to be readable — every word is present from the start.
 */
export function FounderOpening() {
  const rootRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [running, setRunning] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // Desktop only. A phone-width stage cannot hold two 27:50 windows side by
      // side at a readable size, so mobile keeps the wide stage and Section 02
      // carries the portrait pair — see the stylesheet's 900px block.
      if (!window.matchMedia("(min-width: 901px)").matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const stage = root.querySelector<HTMLElement>("[data-opening-stage]");
      const wide = root.querySelector<HTMLElement>('[data-role="wide"]');
      const left = root.querySelector<HTMLElement>('[data-role="left"]');
      const right = root.querySelector<HTMLElement>('[data-role="right"]');
      const axis = root.querySelector<HTMLElement>("[data-opening-axis]");
      if (!stage || !wide || !left || !right || !axis) return;

      // Read the two window shapes from the stylesheet so the clip geometry has
      // exactly one home (`--av3-window-*`) instead of being duplicated in JS.
      const cs = getComputedStyle(root);
      const windowL = cs.getPropertyValue("--av3-window-l").trim();
      const windowR = cs.getPropertyValue("--av3-window-r").trim();
      if (!windowL || !windowR) return;

      stage.dataset.state = "wide";
      setRunning(true);

      const timeline = gsap.timeline({
        defaults: { ease: "power3.inOut", overwrite: "auto" },
        delay: 1.1,
        onComplete: () => {
          // Hand the endpoint back to CSS so nothing stays under inline styles.
          delete stage.dataset.state;
          gsap.set([wide, left, right, axis], { clearProps: "all" });
          setRunning(false);
        },
      });

      timeline
        .to(left, { clipPath: windowL, duration: 1.05 }, 0)
        .to(right, { clipPath: windowR, duration: 1.05 }, 0)
        .to(wide, { autoAlpha: 0, duration: 0.6 }, 0.2)
        .fromTo(axis, { scaleY: 0 }, { scaleY: 1, duration: 0.55 }, 0.55);

      timelineRef.current = timeline;

      // A second deliberate scroll or swipe skips to the completed state. The
      // listeners are passive and removed as soon as the timeline is done.
      const skip = () => timelineRef.current?.progress(1);
      const options = { passive: true, once: true } as const;
      window.addEventListener("wheel", skip, options);
      window.addEventListener("touchmove", skip, options);

      return () => {
        window.removeEventListener("wheel", skip);
        window.removeEventListener("touchmove", skip);
        timelineRef.current = null;
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className={styles.opening}
      aria-labelledby="about-v3-thesis"
    >
      <div
        className={styles.openingStage}
        data-opening-stage
        role="img"
        aria-label="Two anonymous drawn founder figures standing on a flat red and near-black stage. A placeholder graphic, not a photograph."
      >
        <div className={styles.openingLayer} data-role="wide">
          <FounderStage />
        </div>
        <div className={styles.openingLayer} data-role="left">
          <FounderStage />
        </div>
        <div className={styles.openingLayer} data-role="right">
          <FounderStage />
        </div>
        <span className={styles.openingStageAxis} data-opening-axis aria-hidden="true" />
      </div>

      <div className={styles.openingBand}>
        <div className={styles.openingSide} data-side="left">
          <span className={styles.openingName}>{opening.left.name}</span>
          <span className={styles.openingDiscipline}>{opening.left.discipline}</span>
        </div>

        <Heading id="about-v3-thesis" lines={opening.thesis} level={1} size="hero" />

        <div className={styles.openingSide} data-side="right">
          <span className={styles.openingName}>{opening.right.name}</span>
          <span className={styles.openingDiscipline}>{opening.right.discipline}</span>
        </div>
      </div>

      <div className={styles.openingFoot}>
        <MetaStrip items={opening.status} />

        <a
          className={styles.openingCue}
          href="#about-v3-founders"
          aria-label="Skip to the founder profiles"
        >
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
            <path d="M7 0v14M1 8.5 7 15l6-6.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </a>

        {/* Mounted only while the transition is actually running. Leaving it in
            the DOM at `opacity: 0` would put an invisible control in the tab
            order for the whole page. */}
        {running ? (
          <button
            type="button"
            className={styles.openingSkip}
            onClick={() => timelineRef.current?.progress(1)}
          >
            Skip intro
          </button>
        ) : null}
      </div>
    </section>
  );
}
