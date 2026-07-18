"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import styles from "./Hero.module.css";

const STAGES = [
  { from: 0, to: 0.12 },
  { from: 0.1, to: 0.42 },
  { from: 0.4, to: 0.74 },
  { from: 0.72, to: 0.9 },
] as const;

function stageOpacity(progress: number, stage: { from: number; to: number }) {
  const fadeIn = stage.from + (stage.to - stage.from) * 0.25;
  const fadeOut = stage.to;
  if (progress < stage.from || progress > fadeOut + 0.06) return 0;
  if (progress < fadeIn) return (progress - stage.from) / (fadeIn - stage.from);
  if (progress > fadeOut) return Math.max(0, 1 - (progress - fadeOut) / 0.06);
  return 1;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doorLeftRef = useRef<HTMLDivElement>(null);
  const doorRightRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const thesisRef = useRef<HTMLParagraphElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    function onLoaded() {
      if (!video) return;
      durationRef.current = video.duration;
      setReady(true);
    }
    video.addEventListener("loadedmetadata", onLoaded);
    video.preload = "metadata";
    video.load();
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  useEffect(() => {
    if (!ready || reducedMotion) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const applyProgress = (progress: number) => {
      targetTimeRef.current = progress * durationRef.current;

      const doorStart = 0.9;
      const doorProgress = Math.min(1, Math.max(0, (progress - doorStart) / (1 - doorStart)));
      if (doorLeftRef.current) {
        doorLeftRef.current.style.transform = `translateX(${-100 + doorProgress * 100}%)`;
      }
      if (doorRightRef.current) {
        doorRightRef.current.style.transform = `translateX(${100 - doorProgress * 100}%)`;
      }

      if (eyebrowRef.current) eyebrowRef.current.style.opacity = String(stageOpacity(progress, STAGES[0]));
      if (thesisRef.current) thesisRef.current.style.opacity = String(stageOpacity(progress, STAGES[1]));
      if (wordmarkRef.current) {
        const o = stageOpacity(progress, STAGES[2]);
        wordmarkRef.current.style.opacity = String(o);
        wordmarkRef.current.style.transform = `translateY(${(1 - o) * 16}px)`;
      }
      if (scrollCueRef.current) {
        scrollCueRef.current.style.opacity = String(progress < 0.05 ? 1 - progress / 0.05 : 0);
      }
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, total > 0 ? scrolled / total : 0));
      applyProgress(progress);
    };

    const tick = () => {
      const diff = targetTimeRef.current - currentTimeRef.current;
      if (Math.abs(diff) > 0.004) {
        currentTimeRef.current += diff * 0.25;
        try {
          video.currentTime = currentTimeRef.current;
        } catch {
          // seeking not ready yet
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      style={reducedMotion ? { height: "100svh" } : undefined}
      aria-label="Convenium Studio introduction"
    >
      <div className={styles.sticky}>
        {!reducedMotion ? (
          <video
            ref={videoRef}
            className={styles.video}
            muted
            playsInline
            preload="metadata"
            poster="/images/poster-hero-start.jpg"
            aria-hidden="true"
          >
            <source src="/media/hero_scrub_mobile.mp4" media="(max-width: 767px)" type="video/mp4" />
            <source src="/media/hero_scrub.mp4" type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/images/poster-hero-end.jpg" alt="" className={styles.video} aria-hidden="true" />
        )}

        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.copy}>
          <p ref={eyebrowRef} className={`${styles.eyebrow} eyebrow`} style={{ opacity: reducedMotion ? 0 : undefined }}>
            Independent Brand Studio
          </p>
          <p ref={thesisRef} className={styles.thesis} style={{ opacity: 0 }}>
            Your brand is not stuck.
            <br />
            It is waiting for the right floor.
          </p>
          <h1 ref={wordmarkRef} className={styles.wordmark} style={{ opacity: reducedMotion ? 1 : 0 }}>
            CONVENIUM
          </h1>
        </div>

        {reducedMotion && (
          <p className={styles.reducedSupporting}>
            Convenium Studio designs brands for companies that refuse to stay where they are.
          </p>
        )}

        <div ref={scrollCueRef} className={styles.scrollCue} aria-hidden="true">
          <span />
          Scroll
        </div>

        {!reducedMotion && (
          <>
            <div ref={doorLeftRef} className={`${styles.door} ${styles.doorLeft}`} aria-hidden="true" />
            <div ref={doorRightRef} className={`${styles.door} ${styles.doorRight}`} aria-hidden="true" />
          </>
        )}
      </div>
    </section>
  );
}
