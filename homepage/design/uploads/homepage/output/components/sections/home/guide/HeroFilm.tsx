"use client";

// Stage A — the hero film.
// preloader (wordmark + counter) → Flip into the nav → pinned 200vh scrub.
// Scrub patterns are lifted from reference/video-scrub-pattern.md verbatim:
// proxy object, never a direct currentTime tween; all-keyframe file only.
//
// The film does not exist at build time. That is a supported state: the poster
// (or an ink panel) renders, the pin stays, and the page rhythm is testable.

import { useEffect, useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { site } from "@/content/site";
import styles from "./HeroFilm.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(Flip, SplitText);

const SCRUB_FILE = "/videos/hero-guide-scrub.mp4";
const MOBILE_FILE = "/videos/hero-guide-mobile.mp4";
const POSTER = "/images/poster-hero-guide.jpg";

/** 200vh of scroll for the film (spec §2). */
const TOTAL_UNITS = 2;
/** Copy beats, in master progress (spec §5). */
const H1_AT = 0.15;
const SUPPORT_AT = 0.45;
/** The frame empties before the robot walks out — the handoff needs a clean exit. */
const COPY_OUT_AT = 0.78;

const SUPPORT_LINE = "Watch how — or scroll and let the guide show you.";

export function HeroFilm() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const durationRef = useRef(8);

  const [film, setFilm] = useState<"idle" | "ready" | "missing" | "stalled">("idle");
  const [posterOk, setPosterOk] = useState(true);
  const [source, setSource] = useState<string | null>(null);

  /* ---- Preloader → nav wordmark FLIP ---------------------------------- */
  useEffect(() => {
    const pre = preRef.current;
    const word = wordRef.current;
    const count = countRef.current;
    if (!pre || !word || !count) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(pre, { autoAlpha: 0, display: "none" });
      return;
    }

    const lenis = window.__lenis;
    lenis?.stop();
    document.documentElement.dataset.preloading = "true";

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        delete document.documentElement.dataset.preloading;
        lenis?.start();
        ScrollTrigger.refresh();
      },
    });

    tl.to(counter, {
      v: 100,
      duration: 1.15,
      ease: "power2.inOut",
      onUpdate: () => {
        count.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
    })
      .to(count, { autoAlpha: 0, duration: 0.22, ease: "power2.in" }, ">-0.1")
      .add(() => {
        // The wordmark travels to wherever the site chrome keeps it. If the slot
        // is not there, it simply fades — no layout guessing.
        const slot = document.querySelector<HTMLElement>("[data-site-wordmark]");
        if (!slot) {
          gsap.to(word, { autoAlpha: 0, duration: 0.32, ease: "power2.inOut" });
          return;
        }
        const state = Flip.getState(word);
        slot.style.visibility = "hidden";
        slot.appendChild(word);
        Flip.from(state, {
          duration: 0.72,
          ease: "expo.inOut",
          absolute: true,
          scale: true,
          onComplete: () => {
            slot.style.visibility = "";
            word.remove();
          },
        });
      })
      // Noir to noir — the film's first frame comes up underneath, no white flash.
      .to(pre, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.36")
      .set(pre, { display: "none" });

    return () => {
      tl.kill();
      delete document.documentElement.dataset.preloading;
      lenis?.start();
    };
  }, []);

  /* ---- Film + copy ----------------------------------------------------- */
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const copy = copyRef.current;
    if (!root || !stage || !copy) return;

    const mm = gsap.matchMedia();

    const revealCopy = (reduced: boolean) => {
      const heads = copy.querySelectorAll<HTMLElement>("[data-head]");
      const splits: SplitText[] = [];
      heads.forEach((el) => {
        if (reduced) {
          gsap.from(el, { autoAlpha: 0, duration: 0.32, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          return;
        }
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            splits.push(self);
            return gsap.from(self.lines, {
              yPercent: 100,
              duration: 0.5,
              ease: "expo.out",
              stagger: 0.06,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          },
        });
      });
      return () => splits.forEach((s) => s.revert());
    };

    mm.add(
      {
        live: "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 768px) and (prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { live, mobile, reduced } = ctx.conditions as Record<string, boolean>;
        const cleanups: Array<() => void> = [];

        if (reduced) {
          setSource(null);
          cleanups.push(revealCopy(true));
          return () => cleanups.forEach((fn) => fn());
        }

        if (mobile) {
          // FIX6: no pinned section at or below 768px. Short autoplay intro,
          // never scrubbed.
          setSource(MOBILE_FILE);
          const video = videoRef.current;
          if (video) {
            video.muted = true;
            video.autoplay = true;
            video.loop = false;
            const start = () => void video.play().catch(() => setFilm("missing"));
            const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : video.pause()));
            io.observe(video);
            cleanups.push(() => io.disconnect());
          }
          cleanups.push(revealCopy(false));
          return () => cleanups.forEach((fn) => fn());
        }

        if (!live) return () => {};
        setSource(SCRUB_FILE);

        const proxy = { t: 0 };
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            id: "home-guide-hero",
            start: "top top-=1",
            end: `+=${TOTAL_UNITS * 100}%`,
            scrub: 0.3,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            refreshPriority: 30,
          },
        });

        tl.to(
          proxy,
          {
            t: 1,
            duration: TOTAL_UNITS,
            ease: "none",
            onUpdate: () => {
              const video = videoRef.current;
              if (!video) return;
              try {
                video.currentTime = proxy.t * durationRef.current;
              } catch {
                // seek not ready
              }
            },
          },
          0
        );

        // Copy beats ride the same scrubbed timeline (spec §5).
        const heads = copy.querySelectorAll<HTMLElement>("[data-head]");
        const splits: SplitText[] = [];
        heads.forEach((el, index) => {
          const at = (index === 0 ? H1_AT : SUPPORT_AT) * TOTAL_UNITS;
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            onSplit(self) {
              splits.push(self);
              tl.from(
                self.lines,
                { yPercent: 100, duration: 0.28, ease: "expo.out", stagger: 0.05 },
                at
              );
              return undefined;
            },
          });
        });
        tl.to(copy, { autoAlpha: 0, duration: 0.22, ease: "power2.in" }, COPY_OUT_AT * TOTAL_UNITS);

        cleanups.push(() => splits.forEach((s) => s.revert()));
        cleanups.push(() => tl.scrollTrigger?.kill());
        cleanups.push(() => tl.kill());

        return () => cleanups.forEach((fn) => fn());
      }
    );

    return () => mm.revert();
  }, []);

  /* ---- Stall discipline (video-scrub-pattern §3) ----------------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;

    let waiting: number | undefined;
    let terminal: number | undefined;

    const onMeta = () => {
      durationRef.current = video.duration || 8;
      setFilm("ready");
    };
    const onWaiting = () => {
      waiting = window.setTimeout(() => setFilm("stalled"), 1000);
      terminal = window.setTimeout(() => setFilm("missing"), 3000);
    };
    const onPlayable = () => {
      window.clearTimeout(waiting);
      window.clearTimeout(terminal);
      setFilm("ready");
    };
    const onError = () => setFilm("missing");

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onPlayable);
    video.addEventListener("seeked", onPlayable);
    video.addEventListener("error", onError);
    return () => {
      window.clearTimeout(waiting);
      window.clearTimeout(terminal);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onPlayable);
      video.removeEventListener("seeked", onPlayable);
      video.removeEventListener("error", onError);
    };
  }, [source]);

  const showFilm = source !== null && film !== "missing";

  return (
    <HeaderZone theme="dark">
      <section className={styles.root} ref={rootRef} data-screen-label="01 Hero film">
        <div className={styles.stage} ref={stageRef} data-film={film}>
          {/* Ink panel — the floor of the fallback chain, always beneath. */}
          <div className={styles.ink} aria-hidden="true" />

          {posterOk ? (
            <img
              className={styles.poster}
              src={POSTER}
              alt=""
              aria-hidden="true"
              onError={() => setPosterOk(false)}
            />
          ) : null}

          {showFilm ? (
            <video
              className={styles.film}
              ref={videoRef}
              src={source ?? undefined}
              poster={posterOk ? POSTER : undefined}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          ) : null}

          <div className={styles.copy} ref={copyRef}>
            <h1 className={styles.h1} data-head="">
              {site.tagline}
            </h1>
            <p className={styles.support} data-head="">
              {SUPPORT_LINE}
            </p>
          </div>
        </div>
      </section>

      <div className={styles.preloader} ref={preRef} aria-hidden="true">
        <span className={styles.wordmark} ref={wordRef}>
          {site.shortName.toUpperCase()}
        </span>
        <span className={styles.counter} ref={countRef}>
          000
        </span>
      </div>
    </HeaderZone>
  );
}
