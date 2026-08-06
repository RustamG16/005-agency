"use client";

/**
 * The giant footer wordmark.
 *
 * REBUILT 2026-08-04. Three things were wrong with the CSS-only version.
 *
 * 1. The word was cropped along the BOTTOM. `line-height: 0.75` plus a 14% push
 *    down inside an `overflow: hidden` box cut the feet off every glyph. The
 *    crop was described as intentional; Russ read it as damage, and he is right —
 *    a wordmark that loses its baseline reads as a rendering fault, not a
 *    treatment. The mask now trims leading only and never crosses the ink.
 * 2. It was sized from a hand-measured advance ratio (6.82). Measured live it is
 *    6.7629, so the word did fit — but only by 0.8%, which is inside the error of
 *    a fallback face. One frame of "Arial Black" before Archivo Black swaps in
 *    and it overflows, and `overflow: hidden` turns that into exactly the
 *    clipping that was reported. The ratio is now read off the rendered text and
 *    re-read on font load and on resize, so the fit is a fact rather than a
 *    constant somebody has to remember to maintain.
 * 3. It had no entrance. It rises from below its own baseline as the footer
 *    arrives — transform only, inside the mask the fit already needs.
 *
 * The token `--wordmark-ratio` stays as the server-rendered seed, so the first
 * paint is right before any of this runs.
 */

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { MOTION } from "@/components/motion/motion";
import styles from "./FooterWordmark.module.css";

export function FooterWordmark({ word }: { word: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);

  /* ---- fit by measurement ---- */
  useEffect(() => {
    const wrap = wrapRef.current;
    const ink = inkRef.current;
    if (!wrap || !ink) return;

    const range = document.createRange();
    let applied = 0;

    const fit = () => {
      const size = parseFloat(getComputedStyle(ink).fontSize);
      if (!size) return;
      range.selectNodeContents(ink);
      const advance = range.getBoundingClientRect().width;
      if (!advance) return;

      /* Advance per em, so the value does not depend on the size it happened to
       * be measured at — one pass converges. Writing only on a real change also
       * keeps the ResizeObserver from chasing its own tail: the ratio sets the
       * font size, which sets the wrap's height, which the observer sees. */
      const ratio = advance / size;
      if (Math.abs(ratio - applied) < 0.001) return;
      applied = ratio;
      wrap.style.setProperty("--wordmark-ratio", ratio.toFixed(4));
    };

    fit();
    void document.fonts?.ready.then(fit);

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  /* ---- entrance ---- */
  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const ink = inkRef.current;
      if (!wrap || !ink) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(ink, { yPercent: 100 });
      const tween = gsap.to(ink, {
        yPercent: 0,
        duration: MOTION.media,
        ease: MOTION.ease,
        scrollTrigger: {
          trigger: wrap,
          start: "top 95%",
          // Once per direction: it plays coming in and resets going out, so
          // arriving at the footer a second time is not a dead frame.
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
          refreshPriority: -10,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: wrapRef }
  );

  return (
    /* `data-guide-avoid` asks the corner guide to stand off this box rather than
       on it — spec §7 has him LOOK at the wordmark on reveal, and he was sitting
       on the last letter instead. The guide reads the attribute; nothing here
       knows he exists. */
    <div ref={wrapRef} className={styles.wrap} aria-hidden="true" data-guide-avoid>
      <span ref={inkRef} className={styles.ink}>
        {word}
      </span>
    </div>
  );
}
