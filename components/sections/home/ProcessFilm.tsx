"use client";

import { useEffect, useRef } from "react";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./ProcessFilm.module.css";

export function ProcessFilm() {
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
      <section className={styles.section} aria-label="Inside the process">
        <div className={styles.mediaWrap}>
          <video ref={videoRef} className={styles.video} muted playsInline poster="/images/poster-team.jpg">
            <source src="/media/team.mp4" type="video/mp4" />
          </video>
        </div>
        <div className={`wrap ${styles.copy}`}>
          <h2 className={styles.heading}>The work stays close to the idea.</h2>
          <p className={styles.body}>
            Convenium runs small, direct teams around every brand. Strategists, designers and makers
            work in the same room, close enough to keep an idea intact from the first question to the
            final frame. The people in this film are part of that process — not a roster, not a
            department.
          </p>
        </div>
      </section>
    </HeaderZone>
  );
}
