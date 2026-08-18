"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { aboutV3 } from "@/content/about-v3";
import { MediaFrame } from "./Primitives";
import styles from "./AboutV3Page.module.css";

/* =============================================================================
   07 — orchestration sequence

   No pin. The atlas is several viewports tall, so pinning it would either trap
   the scroll or hide most of the diagram, and the handoff makes the pin
   optional. Instead one ScrollTrigger walks a highlight through the five
   stages as the strip crosses the viewport, and the matching lane lights up
   with it. The highlight is purely additive — nothing dims, nothing hides, and
   the whole architecture reads at full contrast without scrolling at all.

   `data-active` is written straight to the DOM rather than held in React
   state, so the atlas markup stays server-rendered.
   ========================================================================== */

export function AtlasSequence({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const media = gsap.matchMedia();
      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const strip = root.querySelector<HTMLElement>("[data-atlas-strip]");
        const stages = gsap.utils.toArray<HTMLElement>("[data-atlas-stage]", root);
        const lanes = gsap.utils.toArray<HTMLElement>("[data-atlas-lane]", root);
        if (!strip || !stages.length) return;

        const setActive = (index: number) => {
          stages.forEach((el, i) => {
            el.dataset.active = String(i === index);
          });
          lanes.forEach((el, i) => {
            el.dataset.active = String(i === index);
          });
        };

        const trigger = ScrollTrigger.create({
          id: "about-v3-atlas-sequence",
          trigger: strip,
          start: "top 85%",
          end: "bottom 45%",
          onUpdate: (self) => {
            setActive(Math.min(stages.length - 1, Math.floor(self.progress * stages.length)));
          },
        });

        setActive(0);

        return () => {
          trigger.kill();
          [...stages, ...lanes].forEach((el) => {
            delete el.dataset.active;
          });
        };
      });

      return () => media.revert();
    },
    { scope: rootRef }
  );

  return <div ref={rootRef}>{children}</div>;
}

/* =============================================================================
   08 — delivery

   The MP4 is a labelled development candidate, so it sits behind an explicit
   control and `preload="none"`: nothing downloads until the visitor asks. It
   plays forward once, never scrubs, never reverses, and pauses when it leaves
   the viewport or the tab goes to the background. Reduced motion never
   reaches the video at all — the endpoint still is the whole section.
   ========================================================================== */

export function DeliveryStage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const { delivery } = aboutV3;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !armed) return;

    const pause = () => {
      if (!video.paused) {
        video.pause();
        setPlaying(false);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) pause();
      },
      { threshold: 0.2 }
    );
    observer.observe(video);

    const onVisibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [armed]);

  const toggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    // First activation attaches the file and loads it. This is done on the
    // element rather than by rendering a <source>, because React would not
    // commit that child until after this handler returns — leaving `play()`
    // with nothing to play.
    if (!video.currentSrc && !video.src) {
      video.src = delivery.media.video;
      video.load();
      setArmed(true);
    }

    if (!video.paused) {
      video.pause();
      setPlaying(false);
      return;
    }

    // Forward only. A finished clip restarts from zero; it is never rewound
    // through its own frames.
    if (ended || video.ended) {
      video.currentTime = 0;
      setEnded(false);
    }

    try {
      await video.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <>
      <MediaFrame
        ratio="16 / 9"
        className={styles.deliveryStage}
        data-playing={playing || ended ? "true" : "false"}
      >
        <picture>
          <source media="(max-width: 900px)" srcSet={delivery.media.mobile} />
          <img
            src={delivery.media.src}
            alt={delivery.media.alt}
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <video
          ref={videoRef}
          muted
          playsInline
          preload="none"
          poster={delivery.media.poster}
          aria-label={delivery.media.videoAlt}
          onEnded={() => {
            setPlaying(false);
            setEnded(true);
          }}
        />
      </MediaFrame>

      <div className={styles.deliveryFoot}>
        <p className={styles.labelMuted}>
          {delivery.media.videoLabel} — {delivery.scaleNote}
        </p>
        <button type="button" className={styles.controlGhost} onClick={toggle}>
          {playing ? "Pause motion study" : ended ? "Play again" : "Play motion study"}
        </button>
      </div>
    </>
  );
}
