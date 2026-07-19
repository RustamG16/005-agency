"use client";

import { useEffect, useRef } from "react";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./StudioFilm.module.css";

export function StudioFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35 && !playedRef.current) {
          playedRef.current = true;
          video.play().catch(() => {});
        }
      },
      { threshold: [0, 0.35, 1] }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <HeaderZone theme="dark">
      <section className={styles.section} aria-label="Inside the studio">
        <div className={styles.mediaWrap}>
          <video ref={videoRef} className={styles.video} muted playsInline poster="/images/poster-team.jpg">
            <source src="/media/team.mp4" type="video/mp4" />
          </video>
        </div>
        <div className={styles.copy}>
          <h2 className={styles.heading}>
            Small team.
            <br />
            Serious lift.
          </h2>
          <p className={styles.body}>
            Strategists, designers and makers working close enough to keep an idea intact from the
            first question to the final frame.
          </p>
        </div>
      </section>
    </HeaderZone>
  );
}
