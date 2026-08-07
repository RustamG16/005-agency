"use client";

import { useEffect, useRef } from "react";

type ActiveVideoLockOptions = {
  /** Intersection ratio required to claim play */
  threshold?: number;
};

/**
 * Ensures only one video plays at a time within a container (interior media).
 * Returns a cleanup function from the effect.
 */
export function useSingleActiveVideo(
  containerRef: React.RefObject<HTMLElement | null>,
  options: ActiveVideoLockOptions = {}
) {
  const threshold = options.threshold ?? 0.45;
  const activeRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("video[data-single-active]"));
    if (!videos.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio >= threshold)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const next = (visible[0]?.target as HTMLVideoElement | undefined) ?? null;

        videos.forEach((video) => {
          if (video === next) {
            if (activeRef.current !== video) {
              activeRef.current?.pause();
              activeRef.current = video;
            }
            // Only re-seek when a video actually declares an offset. Reading a missing
            // attribute as 0 would mean "drifted from 0" is true for every clip past the
            // first third of a second, so every intersection change yanked it back to the
            // start. Projects now carry their own film and declare no offset at all.
            const raw = video.dataset.videoOffset;
            if (raw !== undefined) {
              const offset = Number(raw);
              if (!Number.isNaN(offset) && Math.abs(video.currentTime - offset) > 0.35) {
                try {
                  video.currentTime = offset;
                } catch {
                  /* ignore */
                }
              }
            }
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });

        if (!next) {
          activeRef.current?.pause();
          activeRef.current = null;
        }
      },
      { threshold: [0, threshold, 0.75, 1] }
    );

    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [containerRef, threshold]);
}
