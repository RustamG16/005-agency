"use client";

import { useEffect, useRef } from "react";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./WorksHero.module.css";

export function WorksHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Works introduction">
        <div className={styles.grid}>
          <div className={styles.left}>
            <p className="eyebrow">Selected Work</p>
            <h1 className={styles.heading}>
              We do not decorate businesses.
              <br />
              We change the level at which they compete.
            </h1>
            <p className={styles.supporting}>
              Four engagements, four industries, one method: strategy first, system second,
              expression third.
            </p>
          </div>

          <div className={styles.frame}>
            <video
              ref={videoRef}
              className={styles.video}
              muted
              playsInline
              loop
              preload="metadata"
              poster="/images/poster-columns.jpg"
              aria-hidden="true"
            >
              <source src="/media/columns.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
    </HeaderZone>
  );
}
