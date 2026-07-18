"use client";

import { useEffect, useRef } from "react";
import styles from "./FeaturedMotion.module.css";

export function FeaturedMotion() {
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
    <div className={`wrap ${styles.wrap}`}>
      <div className={styles.frame}>
        <video
          ref={videoRef}
          className={styles.video}
          muted
          playsInline
          loop
          preload="metadata"
          poster="/images/poster-columns.jpg"
        >
          <source src="/media/columns.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
