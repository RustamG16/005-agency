"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Options = {
  /** Intersection ratio a card must reach to claim playback on touch. Default 0.6. */
  threshold?: number;
};

type MediaActivation = {
  /** True when the card should be showing motion. Bind to `data-active` for CSS. */
  active: boolean;
  /** False on touch, where activation comes from the viewport instead of a pointer. */
  canHover: boolean;
  activate: () => void;
  deactivate: () => void;
};

/**
 * Decides when a project card's film should be running, and runs it.
 *
 * Two input modes, chosen by capability rather than by width: a real pointer activates on
 * hover and focus; everything else activates when the card is properly in view, because
 * "hover" on a touchscreen means a tap that should follow the link instead. The media query
 * is watched, not just read once — a laptop with a touchscreen can change answer mid-session,
 * and dragging a window between a trackpad and a touch display fires it for real.
 *
 * `prefers-reduced-motion` suppresses playback only. The caller still gets `active`, so
 * non-motion affordances (a label, a border) can keep responding to hover — a reduced-motion
 * reader has not asked for a dead interface, only a still one.
 *
 * Callers that have no video pass a ref that stays null; activation state still works.
 */
export function useMediaActivation(
  containerRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  options: Options = {}
): MediaActivation {
  const threshold = options.threshold ?? 0.6;
  const [canHover, setCanHover] = useState(true);
  const [hoverActive, setHoverActive] = useState(false);
  const [viewportActive, setViewportActive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = () => setCanHover(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (canHover) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setViewportActive(entry.isIntersecting && entry.intersectionRatio >= threshold),
      { threshold: [0, threshold, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [canHover, containerRef, threshold]);

  const active = canHover ? hoverActive : viewportActive;

  // Playback. Kept in a ref so the effect depends on `active` alone and a re-render caused
  // by something else cannot restart a clip that is already running.
  const playingRef = useRef(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (active && !playingRef.current) {
      playingRef.current = true;
      video.play().catch(() => {
        /* autoplay refused, or the source is absent — the cover stands in */
      });
    } else if (!active && playingRef.current) {
      playingRef.current = false;
      video.pause();
      // Rewind so the next hover opens on the frame the cover shows, not wherever the
      // last one stopped. cover.jpg is this clip's own frame 0, so the handover is exact.
      try {
        video.currentTime = 0;
      } catch {
        /* not seekable yet; it is already at 0 in that case */
      }
    }
  }, [active, videoRef]);

  return {
    active,
    canHover,
    activate: () => canHover && setHoverActive(true),
    deactivate: () => canHover && setHoverActive(false),
  };
}
