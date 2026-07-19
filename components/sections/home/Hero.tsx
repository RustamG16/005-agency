"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useIsMobile } from "@/components/motion/useIsMobile";
import styles from "./Hero.module.css";

type PlaybackPhase = "loading" | "playing" | "waiting" | "ended" | "stalled";

const OVERLAY_LINE = "Most brands are not underperforming. They are under-leveled.";

const QUESTION = "Are you ready to level up your design?";

const BEATS = [
  "Welcome to Convenium",
  "We do not decorate businesses",
  "We take them to another level",
] as const;

/**
 * Static / mobile hero. Desktop pin + doors live in OpeningSequence.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackPhase, setPlaybackPhase] = useState<PlaybackPhase>("loading");
  const [fallbackCueVisible, setFallbackCueVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const stalled = playbackPhase === "stalled";
  const transitionReady = playbackPhase === "ended" || stalled;
  const scrollCueVisible = transitionReady || fallbackCueVisible;

  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    let indicatorTimer: ReturnType<typeof setTimeout> | undefined;
    let posterTimer: ReturnType<typeof setTimeout> | undefined;
    let waitCycle = 0;
    let terminalFallback = false;

    const clearStallTimers = () => {
      waitCycle += 1;
      clearTimeout(indicatorTimer);
      clearTimeout(posterTimer);
    };

    const onEnded = () => {
      clearStallTimers();
      terminalFallback = false;
      setFallbackCueVisible(false);
      setPlaybackPhase("ended");
    };

    const onWaiting = () => {
      if (terminalFallback) return;
      clearStallTimers();
      const activeWaitCycle = waitCycle;
      setPlaybackPhase("waiting");

      indicatorTimer = setTimeout(() => {
        if (activeWaitCycle === waitCycle) setFallbackCueVisible(true);
      }, 1000);

      posterTimer = setTimeout(() => {
        if (activeWaitCycle !== waitCycle) return;
        terminalFallback = true;
        setFallbackCueVisible(true);
        setPlaybackPhase("stalled");
      }, 2000);
    };

    const onPlaying = () => {
      clearStallTimers();
      if (terminalFallback) return;
      setFallbackCueVisible(false);
      setPlaybackPhase("playing");
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    if (!video.paused && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      onPlaying();
    } else {
      video.play().catch(() => {});
    }

    return () => {
      clearStallTimers();
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
    };
  }, [reducedMotion]);

  return (
    <>
      <section
        className={styles.hero}
        aria-label="Convenium Studio introduction"
        data-playback-phase={reducedMotion ? "reduced" : playbackPhase}
        data-scroll-cue-visible={scrollCueVisible}
      >
        <div className={styles.frame}>
          <div className={styles.bgLayer}>
            {reducedMotion ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/poster-hero-end.jpg" alt="" className={styles.video} aria-hidden="true" />
            ) : (
              <video
                ref={videoRef}
                className={styles.video}
                muted
                playsInline
                autoPlay
                preload="auto"
                poster="/images/poster-hero-start.jpg"
                aria-hidden="true"
              >
                <source src="/media/hero_autoplay_mobile.mp4" media="(max-width: 767px)" type="video/mp4" />
                <source src="/media/hero_autoplay.mp4" type="video/mp4" />
              </video>
            )}

            {stalled && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/poster-hero-end.jpg"
                alt=""
                className={`${styles.video} ${styles.fallbackPoster}`}
                aria-hidden="true"
              />
            )}

            <div className={styles.scrim} aria-hidden="true" />

            <div
              className={styles.overlayText}
              style={{ opacity: reducedMotion ? 1 : undefined }}
              aria-hidden="true"
            >
              {OVERLAY_LINE}
            </div>
          </div>

          {!reducedMotion && (
            <div
              className={styles.scrollCue}
              style={{ opacity: scrollCueVisible ? 1 : 0 }}
              aria-hidden="true"
            >
              <span className={styles.scrollLine} />
              Scroll to go up
            </div>
          )}
        </div>
      </section>

      {(reducedMotion || isMobile) && (
        <section className={styles.beatsStatic} aria-label="Studio manifesto">
          <div className="wrap">
            <p className={styles.staticQuestion}>{QUESTION}</p>
            {BEATS.map((beat) => (
              <p key={beat} className={styles.staticBeat}>
                {beat}
              </p>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
