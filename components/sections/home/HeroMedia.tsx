"use client";

/**
 * The hero's full-bleed media slot.
 *
 * It renders the scroll-scrubbed film, whose playhead is `Hero.tsx`'s pin
 * progress. It is deliberately NOT a card — DESIGN.md is explicit that the hero
 * medium is full-bleed and never framed.
 *
 * THE FILM CHANGED 2026-08-08 (R6). It is no longer a dark architectural ascent;
 * it is the Convenium ident — the extruded ink wordmark building on a paper
 * ground, with the striped mark carrying the single red rule that MEDIA-GUIDE-R5
 * calls the slash of light. Measured mean luma across the 15.04s clip:
 *
 *   0.00–0.38  cotton ground, YAVG 207–218   the wordmark types in
 *   0.40–0.57  noir, YAVG 27–75              a hard cut to the inverted passage
 *   0.58–0.65  rising back, YAVG 95–155
 *   0.66–1.00  cotton, YAVG 195–208          the settled mark, easing out
 *
 * Two consequences, both load-bearing. The hero inverted from dark to light
 * (`Hero.tsx` sets the type in ink on cotton, and flips the chrome across the
 * film's own inversion at the two measured thresholds). And THE GRADE IS GONE:
 * `brightness(0.78) saturate(0.78) contrast(1.08)` existed to push a bright film
 * down far enough to hold cotton type, and to ramp back off so the travelling
 * seam closed on cotton. Neither job exists now — the type is ink, and the film
 * ends on cotton by itself — so the ident is shown as authored rather than
 * pushed around by a grade written for a different film.
 *
 * THE CONTRACT IS ONE METHOD. `Hero.tsx` owns scroll and knows nothing about
 * media; this file owns media and knows nothing about scroll. Everything below
 * lives behind `HeroMediaHandle.setProgress`, which is what keeps the seek path
 * replaceable — including by the canvas frame-sequence upgrade in the design
 * spec §8, where only the "paint at t" primitive changes.
 *
 * WHY THE SEEK PATH IS NOT `video.currentTime = p * duration`. Five failure
 * modes, each fixed below and each independently observable (spec §2.1):
 *
 *   1. A host that does not serve byte ranges leaves `seekable = [0, 0]` and the
 *      video freezes on frame 0. So the master is fetched to a Blob first.
 *   2. Seeks issued while one is in flight queue up and the playhead lurches.
 *      So an in-flight seek keeps only the LATEST requested time and applies it
 *      on `seeked`. This is what removes flick-stutter.
 *   3. Device tiering is by SCREEN SHORT SIDE, never pointer type or UA —
 *      iPadOS reports a coarse pointer and a desktop Mac UA, so both signals
 *      put iPads on the blurry mobile encode.
 *   4. iOS Safari will not paint a seeked frame on a muted video that has never
 *      played. So the poster is held until the first real painted frame, and the
 *      element is primed with a muted `play()` on first touch.
 *   5. iOS Low Power Mode rejects even that muted `play()`, and `currentTime`
 *      scrubbing does not work either. No video technique survives it, so the
 *      rejection is caught and the session falls back to the still.
 *
 * ONLY THE TIGHT-GOP (`-g 4`) RE-ENCODE IS SCRUBBABLE. This is physics, not
 * policy: a normal encode's keyframes sit ~2s apart, so a seek lands on the
 * nearest one and the scrub visibly sticks. `-g 4` puts a keyframe every ~0.17s
 * at 24fps, which lands a seek within three frames and is imperceptible under
 * `scrub: 0.3`. Verified on the shipping encode: 90 keyframes across 361 frames.
 * Never point the constants below at a normally-encoded file.
 *
 * If the encodes are absent the component degrades to the poster, and if that is
 * absent too, to the cotton ground and its horizon rule. Nothing throws.
 */

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { MQ } from "@/components/motion/motion";
import styles from "./HeroMedia.module.css";

/* The tight-GOP hero re-encode: the 15.04s Convenium ident, 1280×720 at 24fps,
 * `-g 4`, CRF 18 → 4.58 MB (the whole file is fetched to a Blob before the first
 * seek, so this number is a budget, not a detail). Setting this to "" disables
 * the film entirely and leaves the cotton ground and its horizon rule, which is
 * a valid state — nothing below throws when the encodes are absent. */
const SCRUB_SRC: string = "/media/hero_scrub.mp4";
/** 540p encode for phones, chosen by screen short side — never by UA. 2.08 MB. */
const SCRUB_SRC_MOBILE = "/media/hero_scrub-m.mp4";
/** The ENCODED clip's extracted first frame. A re-rendered still pops on handover. */
const POSTER_SRC = "/images/poster-hero-scrub.jpg";

/* One poster, deliberately, and it is frame 0 for BOTH paths. The scrub path
 * needs frame 0 or the handover pops. The no-scrub path — mobile, reduced
 * motion, save-data, Low Power Mode — wants it too, for a different reason: the
 * ident opens on a near-empty paper ground, so frame 0 is a clean cotton plate
 * for the statement to sit on, whereas the settled mark would put a second
 * CONVENIUM wordmark directly behind the <h1>. The blank-looking frame is the
 * correct still, not a compromise. */

/** Short side at or below this is a phone and gets the smaller encode (spec §7). */
const MOBILE_SHORT_SIDE = 600;

type Mode = "pending" | "scrub" | "still";

export type HeroMediaHandle = {
  /** Called by the hero's pinned timeline, 0 → 1. */
  setProgress(p: number): void;
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export function HeroMedia({ handleRef }: { handleRef?: Ref<HeroMediaHandle> }) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const [posterOk, setPosterOk] = useState(true);

  /* Server and first client render must agree, so this starts at "pending" for
   * everyone and only the effects below move it. */
  const [mode, setMode] = useState<Mode>(SCRUB_SRC ? "pending" : "still");
  const [painted, setPainted] = useState(false);

  /* `setProgress` runs on every scroll frame and must not be rebuilt when mode
   * changes, so it reads the mode from a ref rather than closing over state. */
  const modeRef = useRef<Mode>(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const progressRef = useRef(0);
  const seekingRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);

  /** Behaviour 2: latest-wins coalescing. One seek in flight, one time queued. */
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
      // Seek before metadata is ready; onLoadedMetadata lands the current value.
      seekingRef.current = false;
    }
  }, []);

  const onSeeked = useCallback(() => {
    seekingRef.current = false;
    setPainted(true);
    const queued = pendingSeekRef.current;
    if (queued !== null) {
      pendingSeekRef.current = null;
      const video = videoRef.current;
      const duration = video?.duration ?? 0;
      if (video && duration > 0) applySeek(queued / duration);
    }
  }, [applySeek]);

  useImperativeHandle(
    handleRef,
    () => ({
      setProgress(p: number) {
        progressRef.current = p;

        if (modeRef.current === "scrub") {
          applySeek(p);
          return;
        }

        const horizon = horizonRef.current;
        if (horizon) {
          // The ground that shows through when there is no film — no encode on
          // disk, a narrow viewport, save-data, or Low Power Mode. The rule
          // rises through the hero's empty upper third, which is exactly what
          // this hero did before the film existed. Small on purpose.
          horizon.style.transform = `translate3d(0, ${(-p * 6).toFixed(2)}vh, 0)`;
        }
      },
    }),
    [applySeek]
  );

  /* A missing poster must uncover the ground below, and a bare `onError` will
   * not do it: the browser starts fetching the image from the server-rendered
   * HTML and can fail before React hydrates, so the synthetic handler never
   * fires. Checking `complete && naturalWidth === 0` on mount catches the
   * already-failed case; the listener catches the rest. */
  useEffect(() => {
    const poster = posterRef.current;
    if (!poster) return;
    if (poster.complete && poster.naturalWidth === 0) {
      setPosterOk(false);
      return;
    }
    const onError = () => setPosterOk(false);
    poster.addEventListener("error", onError);
    return () => poster.removeEventListener("error", onError);
  }, []);

  /** Behaviours 1 and 3: tier by short side, fetch to a Blob, revoke on unmount. */
  useEffect(() => {
    if (!SCRUB_SRC) return;

    // Below 769px there is no pin and no scrub, so there is nothing to fetch —
    // downloading several MB to never seek it is the worst of both worlds.
    if (!window.matchMedia(MQ.desktopMotion).matches) {
      setMode("still");
      return;
    }

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData || /^[23]g$/.test(connection?.effectiveType ?? "")) {
      setMode("still");
      return;
    }

    const shortSide = Math.min(window.screen.width, window.screen.height);
    const src = shortSide <= MOBILE_SHORT_SIDE ? SCRUB_SRC_MOBILE : SCRUB_SRC;

    let objectUrl: string | null = null;
    let cancelled = false;
    const controller = new AbortController();

    fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status}`);
        return response.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const video = videoRef.current;
        if (!video) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();
        setMode("scrub");
      })
      .catch(() => {
        // Abort, 404 or offline — all of them mean "no film this session".
        if (!cancelled) setMode("still");
      });

    return () => {
      cancelled = true;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  /** Behaviours 4 and 5: prime with a muted play on first touch; LPM opts out. */
  useEffect(() => {
    if (mode !== "scrub") return;

    let primed = false;
    const prime = () => {
      if (primed) return;
      primed = true;
      const video = videoRef.current;
      if (!video) return;
      const started = video.play();
      if (!started) return;
      started
        .then(() => {
          video.pause();
          applySeek(progressRef.current);
        })
        .catch(() => {
          // iOS Low Power Mode. Nothing video-based survives it, so stop trying.
          setMode("still");
        });
    };

    window.addEventListener("touchstart", prime, { passive: true, once: true });
    return () => window.removeEventListener("touchstart", prime);
  }, [mode, applySeek]);

  const showPoster = mode !== "scrub" || !painted;

  return (
    <div ref={mediaRef} className={styles.media} aria-hidden="true">
      {/* The floor of the stack. Covered opaquely whenever a film or poster is
          actually painting, so it only ever shows when neither is — which keeps
          a checkout with no encodes on disk looking exactly like this hero did
          before the film existed, rather than like a bug. */}
      <span ref={horizonRef} className={styles.horizon} />

      {SCRUB_SRC ? (
        <>
          <video
            ref={videoRef}
            className={styles.video}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => applySeek(progressRef.current)}
            onSeeked={onSeeked}
          />
          {/* Held until the first painted frame, then dropped. iOS Safari will
              not paint a seeked frame on a video that has never played, so
              without this the hero is blank until first touch.

              Deliberately a plain <img>, not next/image: this has to be the
              encoded clip's first frame pixel for pixel, and an optimiser that
              re-encodes it would reintroduce exactly the pop the poster exists
              to prevent. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={posterRef}
            className={[
              styles.poster,
              showPoster ? "" : styles.posterOut,
              posterOk ? "" : styles.posterGone,
            ]
              .filter(Boolean)
              .join(" ")}
            src={POSTER_SRC}
            alt=""
            aria-hidden="true"
          />
        </>
      ) : null}
    </div>
  );
}
