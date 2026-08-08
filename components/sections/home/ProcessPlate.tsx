"use client";

/**
 * The process section's media plate.
 *
 * THE CONTRACT IS ONE METHOD, same discipline as `HeroMedia.tsx`:
 * `ProcessFilm.tsx` owns scroll and knows nothing about media; this file owns
 * media and knows nothing about scroll. Everything lives behind
 * `ProcessPlateHandle.setProgress`.
 *
 * FOUR TIERS, READ FROM A MANIFEST — same pattern `monolith.ts` uses for
 * `/images/about/manifest.json`: the manifest lists only files that actually
 * exist, so a missing asset costs no request and logs no 404, and the plate
 * quietly steps down instead of failing loud.
 *
 *   scrub   tight-GOP video, seeked by scroll progress. Desktop motion only.
 *   stills  four frames at the beat boundaries, swapped as progress crosses
 *           each threshold. Used when scrub is unavailable but stills are, or
 *           when the device is not scrubbing (see below).
 *   poster  one static frame. No progress response at all.
 *   bare    no media file. A plain noir plate — Principles.tsx already ships
 *           this exact fallback for its own three plates, so an unfilled
 *           process plate reads as composed, not broken.
 *
 * The scrub tier only ever runs under desktop motion, same gate `HeroMedia`
 * uses — mobile and reduced-motion sessions never fetch the video, and fall
 * to stills/poster/bare instead.
 *
 * WHY THE VIDEO AND STILL <img> ARE ALWAYS MOUNTED, not rendered only once
 * their tier wins. The first version of this file rendered `<video>` only when
 * `tier === "scrub"` — but the fetch handler that PROMOTES the tier to
 * "scrub" needs `videoRef.current` to already exist to attach the blob to it.
 * That is circular: nothing ever set the tier, because the ref the fetch
 * needed was never there to find. `HeroMedia.tsx` avoids exactly this by
 * mounting its `<video>` unconditionally and using state only to control what
 * is VISIBLE, never what EXISTS. This file now does the same: every element a
 * tier might need is mounted from the first render, gated by manifest data
 * (a build-time constant) rather than by the tier state that depends on it,
 * and `data-active` — not conditional rendering — decides what shows.
 */

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { MQ } from "@/components/motion/motion";
import manifest from "@/public/media/process/manifest.json";
import styles from "./ProcessPlate.module.css";

const BASE = "/media/process/";
const IMG_BASE = "/images/process/";

const STILL_STEPS = (manifest.stills ?? []).map((file) => {
  // "still-0.20.jpg" -> progress threshold 0.20
  const match = /still-([0-9.]+)\.jpg$/.exec(file);
  return { p: match ? Number(match[1]) : 0, src: IMG_BASE + file };
});

type Tier = "pending" | "scrub" | "stills" | "poster" | "bare";

export type ProcessPlateHandle = {
  setProgress(p: number): void;
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export function ProcessPlate({ handleRef }: { handleRef?: Ref<ProcessPlateHandle> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const [tier, setTier] = useState<Tier>("pending");
  const tierRef = useRef<Tier>("pending");
  useEffect(() => {
    tierRef.current = tier;
  }, [tier]);

  const progressRef = useRef(0);
  const seekingRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);
  const lastStillIndex = useRef(-1);

  /** Latest-wins seek coalescing — identical policy to `HeroMedia.applySeek`. */
  const applySeek = useCallback((p: number) => {
    const video = videoRef.current;
    if (!video) return;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    const time = clamp01(p) * duration;
    if (seekingRef.current) {
      pendingSeekRef.current = time;
      return;
    }
    seekingRef.current = true;
    try {
      video.currentTime = time;
    } catch {
      seekingRef.current = false;
    }
  }, []);

  const onSeeked = useCallback(() => {
    seekingRef.current = false;
    const queued = pendingSeekRef.current;
    if (queued !== null) {
      pendingSeekRef.current = null;
      const video = videoRef.current;
      const duration = video?.duration ?? 0;
      if (video && duration > 0) applySeek(queued / duration);
    }
  }, [applySeek]);

  const applyStill = useCallback((p: number) => {
    if (!STILL_STEPS.length) return;
    // The still whose threshold is the last one at or before p.
    let idx = 0;
    for (let i = 0; i < STILL_STEPS.length; i += 1) {
      if (p >= STILL_STEPS[i].p) idx = i;
    }
    if (idx === lastStillIndex.current) return;
    lastStillIndex.current = idx;
    const img = stillRef.current;
    if (img) img.src = STILL_STEPS[idx].src;
  }, []);

  useImperativeHandle(
    handleRef,
    () => ({
      setProgress(p: number) {
        progressRef.current = p;
        if (tierRef.current === "scrub") applySeek(p);
        else if (tierRef.current === "stills") applyStill(p);
        // poster and bare take no progress input — they are flat states.
      },
    }),
    [applySeek, applyStill]
  );

  /* Tier resolution, once, on mount. Desktop-motion gate mirrors HeroMedia: no
   * pin exists below it, so there is nothing to seek and nothing worth
   * fetching several MB for. The <video>/<img> nodes these callbacks reach for
   * are already in the DOM by the time this runs — see the docblock above. */
  useEffect(() => {
    const desktopMotion = window.matchMedia(MQ.desktopMotion).matches;
    const fallback = () => setTier(STILL_STEPS.length ? "stills" : manifest.poster ? "poster" : "bare");

    if (desktopMotion && manifest.scrub) {
      const connection = (
        navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
      ).connection;
      const cheapLink = connection?.saveData || /^[23]g$/.test(connection?.effectiveType ?? "");
      if (!cheapLink) {
        let objectUrl: string | null = null;
        let cancelled = false;
        const controller = new AbortController();

        fetch(BASE + manifest.scrub, { signal: controller.signal })
          .then((res) => {
            if (!res.ok) throw new Error(String(res.status));
            return res.blob();
          })
          .then((blob) => {
            if (cancelled) return;
            const video = videoRef.current;
            if (!video) return; // element unmounted before the fetch settled
            objectUrl = URL.createObjectURL(blob);
            video.src = objectUrl;
            video.load();
            setTier("scrub");
          })
          .catch(() => {
            if (!cancelled) fallback();
          });

        return () => {
          cancelled = true;
          controller.abort();
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
      }
    }

    if (STILL_STEPS.length) {
      lastStillIndex.current = 0;
      const img = stillRef.current;
      if (img) img.src = STILL_STEPS[0].src;
      setTier("stills");
      return;
    }
    fallback();
  }, []);

  return (
    <div className={styles.plate} aria-hidden="true">
      {manifest.scrub && (
        <video
          ref={videoRef}
          className={styles.media}
          data-active={tier === "scrub"}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => applySeek(progressRef.current)}
          onSeeked={onSeeked}
        />
      )}
      {STILL_STEPS.length > 0 && (
        // eslint-disable-next-line @next/next/no-img-element -- must be pixel-identical to the encoded frames, no optimizer re-encode
        <img ref={stillRef} className={styles.media} data-active={tier === "stills"} alt="" />
      )}
      {manifest.poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.media}
          data-active={tier === "poster"}
          src={IMG_BASE + manifest.poster}
          alt=""
        />
      )}
      {/* tier === "bare": nothing is active — the section's own noir plate
          background (ProcessPlate.module.css) is the whole state. */}
    </div>
  );
}
