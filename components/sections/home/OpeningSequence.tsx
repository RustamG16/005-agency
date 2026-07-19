"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useIsMobile } from "@/components/motion/useIsMobile";
import { projects, type Project } from "@/content/projects";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { Hero } from "./Hero";
import { WorksFrameStatic } from "./WorksFrame";
import heroStyles from "./Hero.module.css";
import worksStyles from "./WorksFrame.module.css";
import styles from "./OpeningSequence.module.css";

type PlaybackPhase = "loading" | "playing" | "waiting" | "ended" | "stalled";

const OVERLAY_LINE = "Most brands are not underperforming. They are under-leveled.";
const QUESTION = "Are you ready to level up your design?";
const MANIFESTO_EXTRA = "Design that raises the floor — not the finish.";

const BEATS = [
  "Welcome to Convenium",
  "We do not decorate businesses",
  "We take them to another level",
] as const;

const DOOR_UNIT = 1;
const QUESTION_HOLD = 0.85;
const DOOR_OPEN = 1;
const SPLIT_UNITS = 2.8;
const ZOOM_UNITS = 2;
const CASE_UNIT = 1;
const LOOP_IDLE_MS = 1400;
const LOOP_HOVER_MS = 600;

const PRE_WORKS = DOOR_UNIT + QUESTION_HOLD + DOOR_OPEN + SPLIT_UNITS + ZOOM_UNITS;
const TOTAL_UNITS = PRE_WORKS + projects.length * CASE_UNIT;

function indexLabel(i: number) {
  return String(i + 1).padStart(2, "0");
}

function CaseText({ project, index }: { project: Project; index: number }) {
  return (
    <>
      <span className={styles.caseIndex}>{indexLabel(index)}</span>
      <h3 className={styles.caseName}>{project.name}</h3>
      <p className={styles.caseMeta}>
        {project.sector} — {project.scope}
      </p>
      <p className={styles.caseOutcome}>{project.outcome}</p>
    </>
  );
}

/**
 * Desktop: one pin — doors → question → split → zoom → plate showcase.
 * Mobile / reduced-motion: stacked Hero (question + manifesto) + WorksFrame static.
 */
export function OpeningSequence() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  if (reducedMotion || isMobile) {
    return (
      <>
        <Hero />
        <WorksFrameStatic variant={reducedMotion ? "grid" : "stack"} />
      </>
    );
  }

  return <OpeningSequencePinned />;
}

function OpeningSequencePinned() {
  const stageRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const doorLeftRef = useRef<HTMLDivElement>(null);
  const doorRightRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const manifestoBeatRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const manifestoExtraRef = useRef<HTMLParagraphElement>(null);
  const manifestoColRef = useRef<HTMLDivElement>(null);
  const zoomFrameRef = useRef<HTMLDivElement>(null);
  const galleryVideoRef = useRef<HTMLVideoElement>(null);
  const galleryPlateRef = useRef<HTMLImageElement>(null);
  const frameSlotRef = useRef<HTMLDivElement>(null);
  const wallCtaRef = useRef<HTMLDivElement>(null);
  const caseLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const caseTextRefs = useRef<Array<HTMLDivElement | null>>([]);
  const loopFrameRefs = useRef<Array<Array<HTMLImageElement | null>>>(
    projects.map(() => [])
  );
  const navVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const durationRef = useRef(8);
  const activeCaseRef = useRef(-1);
  const loopTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loopIndexRef = useRef(0);
  const hoverRef = useRef(false);

  const [playbackPhase, setPlaybackPhase] = useState<PlaybackPhase>("loading");
  const [fallbackCueVisible, setFallbackCueVisible] = useState(false);
  const stalled = playbackPhase === "stalled";
  const transitionReady = playbackPhase === "ended" || stalled;
  const scrollCueVisible = transitionReady || fallbackCueVisible;

  const stopLoop = useCallback(() => {
    if (loopTimerRef.current) {
      clearInterval(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    const nav = navVideoRefs.current[activeCaseRef.current];
    if (nav) {
      nav.pause();
      gsap.set(nav, { autoAlpha: 0 });
    }
  }, []);

  const paintLoopFrame = useCallback((caseIndex: number, frameIndex: number) => {
    const frames = loopFrameRefs.current[caseIndex];
    if (!frames?.length) return;
    frames.forEach((img, i) => {
      if (!img) return;
      gsap.set(img, { autoAlpha: i === frameIndex ? 1 : 0 });
    });
  }, []);

  const startLoop = useCallback(
    (caseIndex: number) => {
      stopLoop();
      activeCaseRef.current = caseIndex;
      loopIndexRef.current = 0;
      const project = projects[caseIndex];
      if (!project?.loop.length) return;

      paintLoopFrame(caseIndex, 0);

      const tick = () => {
        const frames = project.loop;
        loopIndexRef.current = (loopIndexRef.current + 1) % frames.length;
        paintLoopFrame(caseIndex, loopIndexRef.current);
      };

      const ms = hoverRef.current ? LOOP_HOVER_MS : LOOP_IDLE_MS;
      loopTimerRef.current = setInterval(tick, ms);
    },
    [paintLoopFrame, stopLoop]
  );

  const onFrameEnter = useCallback(() => {
    const i = activeCaseRef.current;
    if (i < 0) return;
    hoverRef.current = true;
    const project = projects[i];
    const nav = navVideoRefs.current[i];

    if (project.nav && nav) {
      stopLoop();
      const frames = loopFrameRefs.current[i];
      frames?.forEach((img) => img && gsap.set(img, { autoAlpha: 0 }));
      gsap.set(nav, { autoAlpha: 1 });
      nav.currentTime = 0;
      nav.play().catch(() => {});
      return;
    }

    // Restart at hover speed
    startLoop(i);
  }, [startLoop, stopLoop]);

  const onFrameLeave = useCallback(() => {
    const i = activeCaseRef.current;
    hoverRef.current = false;
    if (i < 0) return;
    const nav = navVideoRefs.current[i];
    if (nav) {
      nav.pause();
      gsap.set(nav, { autoAlpha: 0 });
    }
    startLoop(i);
  }, [startLoop]);

  // Hero film: play once and hold final frame; stall → poster + cue.
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    let indicatorTimer: ReturnType<typeof setTimeout> | undefined;
    let posterTimer: ReturnType<typeof setTimeout> | undefined;
    let waitCycle = 0;
    let terminalFallback = false;

    const clearStallTimers = () => {
      waitCycle += 1;
      clearTimeout(indicatorTimer);
      clearTimeout(posterTimer);
    };

    const onEnded = () => {
      clearStallTimers();
      terminalFallback = false;
      setFallbackCueVisible(false);
      setPlaybackPhase("ended");
    };

    const onWaiting = () => {
      if (terminalFallback) return;
      clearStallTimers();
      const activeWaitCycle = waitCycle;
      setPlaybackPhase("waiting");

      indicatorTimer = setTimeout(() => {
        if (activeWaitCycle === waitCycle) setFallbackCueVisible(true);
      }, 1000);

      posterTimer = setTimeout(() => {
        if (activeWaitCycle !== waitCycle) return;
        terminalFallback = true;
        setFallbackCueVisible(true);
        setPlaybackPhase("stalled");
      }, 2000);
    };

    const onPlaying = () => {
      clearStallTimers();
      if (terminalFallback) return;
      setFallbackCueVisible(false);
      setPlaybackPhase("playing");
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    if (!video.paused && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      onPlaying();
    } else {
      video.play().catch(() => {});
    }

    return () => {
      clearStallTimers();
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
    };
  }, []);

  useEffect(() => {
    const video = galleryVideoRef.current;
    if (!video) return;
    const onLoaded = () => {
      durationRef.current = video.duration || 8;
    };
    video.addEventListener("loadedmetadata", onLoaded);
    video.preload = "metadata";
    video.load();
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  useEffect(() => () => stopLoop(), [stopLoop]);

  const startLoopRef = useRef(startLoop);
  const stopLoopRef = useRef(stopLoop);
  startLoopRef.current = startLoop;
  stopLoopRef.current = stopLoop;

  useGSAP(
    () => {
      const stage = stageRef.current;
      const layerA = layerARef.current;
      const layerB = layerBRef.current;
      const heroVideo = heroVideoRef.current;
      const galleryVideo = galleryVideoRef.current;
      const galleryPlate = galleryPlateRef.current;
      const zoomFrame = zoomFrameRef.current;
      const question = questionRef.current;
      const manifestoCol = manifestoColRef.current;
      if (!stage || !layerA || !layerB || !galleryVideo || !galleryPlate || !zoomFrame || !question) {
        return;
      }

      const beats = manifestoBeatRefs.current.filter((el): el is HTMLParagraphElement => Boolean(el));
      const extra = manifestoExtraRef.current;

      gsap.set(doorLeftRef.current, { xPercent: -100, x: 0 });
      gsap.set(doorRightRef.current, { xPercent: 100, x: 0 });
      gsap.set(question, { autoAlpha: 0 });
      gsap.set(layerA, { autoAlpha: 1 });
      gsap.set(layerB, { autoAlpha: 0 });
      gsap.set(galleryPlate, { autoAlpha: 0 });
      gsap.set(galleryVideo, { autoAlpha: 1 });
      gsap.set(beats, { autoAlpha: 0, y: 20 });
      if (extra) gsap.set(extra, { autoAlpha: 0, y: 12 });
      if (manifestoCol) gsap.set(manifestoCol, { autoAlpha: 1 });
      gsap.set(zoomFrame, { scale: 1, x: 0, y: 0, borderRadius: 10, borderColor: "rgba(202,200,192,1)" });
      caseLayerRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 0 }));
      caseTextRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 0 }));
      if (wallCtaRef.current) gsap.set(wallCtaRef.current, { autoAlpha: 0 });
      projects.forEach((_, ci) => {
        loopFrameRefs.current[ci]?.forEach((img) => {
          if (img) gsap.set(img, { autoAlpha: 0 });
        });
        const nav = navVideoRefs.current[ci];
        if (nav) gsap.set(nav, { autoAlpha: 0 });
      });

      const seekHeroToEnd = () => {
        if (!heroVideo) return;
        if (heroVideo.ended) return;
        try {
          if (Number.isFinite(heroVideo.duration) && heroVideo.duration > 0) {
            heroVideo.pause();
            heroVideo.currentTime = heroVideo.duration;
          }
        } catch {
          // seek not ready
        }
      };

      const measureZoom = () => {
        const stageRect = stage.getBoundingClientRect();
        const frameRect = zoomFrame.getBoundingClientRect();
        const targetW = Math.min(stageRect.width, stageRect.height * (16 / 9));
        const scale = targetW / Math.max(frameRect.width, 1);
        const frameCenterX = frameRect.left + frameRect.width / 2;
        const frameCenterY = frameRect.top + frameRect.height / 2;
        const targetCenterX = stageRect.left + stageRect.width / 2;
        const targetCenterY = stageRect.top + stageRect.height / 2;
        return {
          scale,
          x: targetCenterX - frameCenterX,
          y: targetCenterY - frameCenterY,
        };
      };

      const t0 = 0;
      const doorsShutAt = DOOR_UNIT;
      const questionDoneAt = doorsShutAt + QUESTION_HOLD;
      const doorsOpenAt = questionDoneAt;
      const splitStart = doorsOpenAt + DOOR_OPEN;
      const zoomStart = splitStart + SPLIT_UNITS;
      const plateLand = zoomStart + ZOOM_UNITS;
      const casesStart = plateLand;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          id: "opening-sequence",
          start: "top top-=1",
          end: `+=${TOTAL_UNITS * 100}%`,
          scrub: 0.3,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 30,
        },
      });

      tl.addLabel("heroHold", t0);

      tl.to(scrollCueRef.current, { autoAlpha: 0, duration: 0.2 }, t0)
        .to(doorLeftRef.current, { xPercent: 0, duration: DOOR_UNIT, ease: "power4.in" }, t0)
        .to(doorRightRef.current, { xPercent: 0, duration: DOOR_UNIT, ease: "power4.in" }, t0)
        .addLabel("doorsShut", doorsShutAt)
        .call(seekHeroToEnd, undefined, doorsShutAt);

      tl.fromTo(
        question,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, ease: "power2.out", immediateRender: false },
        doorsShutAt
      )
        .addLabel("questionHold", doorsShutAt + 0.4)
        .to(question, { autoAlpha: 0, duration: 0.25, ease: "power2.in", immediateRender: false }, questionDoneAt - 0.25);

      tl.to(layerA, { autoAlpha: 0, duration: 0.12, ease: "none", immediateRender: false }, doorsOpenAt - 0.15).to(
        layerB,
        { autoAlpha: 1, duration: 0.12, ease: "none", immediateRender: false },
        doorsOpenAt - 0.15
      );

      tl.to(doorLeftRef.current, { xPercent: -100, duration: DOOR_OPEN, ease: "power2.inOut" }, doorsOpenAt)
        .to(doorRightRef.current, { xPercent: 100, duration: DOOR_OPEN, ease: "power2.inOut" }, doorsOpenAt)
        .addLabel("doorsOpen", splitStart);

      const proxy = { t: 0 };
      tl.addLabel("splitScrub", splitStart).to(
        proxy,
        {
          t: 1,
          duration: SPLIT_UNITS,
          ease: "none",
          onUpdate: () => {
            try {
              galleryVideo.currentTime = proxy.t * durationRef.current;
            } catch {
              // seek not ready
            }
          },
        },
        splitStart
      );

      beats.forEach((beat, i) => {
        const at = splitStart + (i / beats.length) * (SPLIT_UNITS * 0.75);
        tl.to(
          beat,
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out", immediateRender: false },
          at
        );
      });
      if (extra) {
        tl.to(
          extra,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
            immediateRender: false,
          },
          splitStart + SPLIT_UNITS * 0.8
        );
      }

      tl.addLabel("zoomStart", zoomStart);
      const zoomProxy = { p: 0 };
      let zoomCached = { scale: 1, x: 0, y: 0 };

      tl.call(
        () => {
          gsap.set(zoomFrame, { scale: 1, x: 0, y: 0 });
          zoomCached = measureZoom();
        },
        undefined,
        zoomStart
      )
        .to(
          zoomProxy,
          {
            p: 1,
            duration: ZOOM_UNITS,
            ease: "power2.inOut",
            onUpdate: () => {
              const p = zoomProxy.p;
              gsap.set(zoomFrame, {
                scale: 1 + (zoomCached.scale - 1) * p,
                x: zoomCached.x * p,
                y: zoomCached.y * p,
                borderRadius: 10 * (1 - p),
                borderColor: `rgba(202,200,192,${1 - p})`,
              });
            },
          },
          zoomStart
        );

      if (manifestoCol) {
        tl.to(
          manifestoCol,
          { autoAlpha: 0, duration: 0.4, ease: "power2.in", immediateRender: false },
          zoomStart
        );
      }

      tl.to(galleryVideo, { autoAlpha: 0, duration: 0.35, ease: "none", immediateRender: false }, zoomStart + ZOOM_UNITS - 0.4)
        .to(galleryPlate, { autoAlpha: 1, duration: 0.35, ease: "none", immediateRender: false }, zoomStart + ZOOM_UNITS - 0.4)
        .addLabel("plateLand", plateLand);

      projects.forEach((_project, i) => {
        const start = casesStart + i * CASE_UNIT;
        const end = start + CASE_UNIT;
        const layer = caseLayerRefs.current[i];
        const text = caseTextRefs.current[i];
        const isLast = i === projects.length - 1;

        tl.addLabel(`case${indexLabel(i)}`, start);

        if (layer) {
          tl.to(layer, { autoAlpha: 1, duration: 0.25, ease: "power2.out", immediateRender: false }, start).call(
            () => startLoopRef.current(i),
            undefined,
            start + 0.05
          );
          if (!isLast) {
            tl.to(layer, { autoAlpha: 0, duration: 0.2, ease: "power2.in", immediateRender: false }, end - 0.2).call(
              () => {
                if (activeCaseRef.current === i) stopLoopRef.current();
              },
              undefined,
              end - 0.2
            );
          }
        }
        if (text) {
          tl.to(text, { autoAlpha: 1, duration: 0.25, ease: "power2.out", immediateRender: false }, start + 0.05);
          if (!isLast) {
            tl.to(text, { autoAlpha: 0, duration: 0.2, ease: "power2.in", immediateRender: false }, end - 0.2);
          }
        }
        if (i === 0 && wallCtaRef.current) {
          tl.to(
            wallCtaRef.current,
            { autoAlpha: 1, duration: 0.25, ease: "power2.out", immediateRender: false },
            start + 0.1
          );
        }
      });

      const refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });

      return () => {
        cancelAnimationFrame(refreshFrame);
        stopLoopRef.current();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    {
      scope: stageRef,
      dependencies: [],
      revertOnUpdate: true,
    }
  );

  const jumpToCase = (i: number) => {
    const st = ScrollTrigger.getById("opening-sequence");
    if (!st) return;
    const progress = (PRE_WORKS + i * CASE_UNIT + 0.3) / TOTAL_UNITS;
    const y = st.start + (st.end - st.start) * progress;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <HeaderZone theme="dark">
      <section
        aria-label="Convenium Studio introduction and selected work"
        data-playback-phase={playbackPhase}
        data-scroll-cue-visible={scrollCueVisible}
      >
        <div ref={stageRef} className={styles.stage}>
          {/* Layer A — hero media */}
          <div ref={layerARef} className={`${styles.layer} ${heroStyles.bgLayer}`}>
            <video
              ref={heroVideoRef}
              className={heroStyles.video}
              muted
              playsInline
              autoPlay
              preload="auto"
              poster="/images/poster-hero-start.jpg"
              aria-hidden="true"
            >
              <source src="/media/hero_autoplay.mp4" type="video/mp4" />
            </video>

            {stalled && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/poster-hero-end.jpg"
                alt=""
                className={`${heroStyles.video} ${heroStyles.fallbackPoster}`}
                aria-hidden="true"
              />
            )}

            <div className={heroStyles.scrim} aria-hidden="true" />

            <div className={heroStyles.overlayText} aria-hidden="true">
              {OVERLAY_LINE}
            </div>

            <div
              ref={scrollCueRef}
              className={heroStyles.scrollCue}
              style={{ opacity: scrollCueVisible ? 1 : 0 }}
              aria-hidden="true"
            >
              <span className={heroStyles.scrollLine} />
              Scroll to go up
            </div>
          </div>

          {/* Layer B — split manifesto + zoomable frame → plate showcase */}
          <div ref={layerBRef} className={`${styles.layer} ${styles.layerSplit}`}>
            <div className={styles.splitLayout}>
              <div ref={manifestoColRef} className={styles.manifestoCol}>
                {BEATS.map((beat, index) => (
                  <p
                    key={beat}
                    ref={(el) => {
                      manifestoBeatRefs.current[index] = el;
                    }}
                    className={styles.manifestoBeat}
                  >
                    {beat}
                  </p>
                ))}
                <p ref={manifestoExtraRef} className={styles.manifestoExtra}>
                  {MANIFESTO_EXTRA}
                </p>
              </div>

              <div className={styles.zoomAnchor}>
                <div ref={zoomFrameRef} className={styles.zoomFrame}>
                  <video
                    ref={galleryVideoRef}
                    className={styles.frameMedia}
                    muted
                    playsInline
                    preload="metadata"
                    poster="/images/poster-columns.jpg"
                    aria-hidden="true"
                  >
                    <source src="/media/gallery_scrub.mp4" type="video/mp4" />
                  </video>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={galleryPlateRef}
                    src="/images/works_plate.jpg"
                    alt=""
                    className={styles.frameMedia}
                    aria-hidden="true"
                  />

                  <div
                    ref={frameSlotRef}
                    className={styles.frameSlot}
                    aria-hidden="true"
                    onPointerEnter={onFrameEnter}
                    onPointerLeave={onFrameLeave}
                  >
                    {projects.map((project, i) => (
                      <div
                        key={project.slug}
                        ref={(el) => {
                          caseLayerRefs.current[i] = el;
                        }}
                        className={styles.caseLayer}
                      >
                        {project.loop.map((src, fi) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={`${project.slug}-${fi}`}
                            ref={(el) => {
                              if (!loopFrameRefs.current[i]) loopFrameRefs.current[i] = [];
                              loopFrameRefs.current[i][fi] = el;
                            }}
                            src={src}
                            alt=""
                            className={styles.loopFrame}
                            style={{ objectPosition: project.objectPosition }}
                          />
                        ))}
                        {project.nav ? (
                          <video
                            ref={(el) => {
                              navVideoRefs.current[i] = el;
                            }}
                            className={styles.navVideo}
                            muted
                            playsInline
                            loop
                            preload="metadata"
                            aria-hidden="true"
                          >
                            <source src={project.nav} type="video/mp4" />
                          </video>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  <div className={styles.wallText} aria-hidden="true">
                    {projects.map((project, i) => (
                      <div
                        key={project.slug}
                        ref={(el) => {
                          caseTextRefs.current[i] = el;
                        }}
                        className={styles.caseText}
                      >
                        <CaseText project={project} index={i} />
                      </div>
                    ))}
                  </div>

                  <div ref={wallCtaRef} className={styles.wallCtaWrap}>
                    <Link href="/works" className={styles.wallCta}>
                      See my works
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Doors */}
          <div ref={doorLeftRef} className={`${styles.door} ${styles.doorLeft}`} aria-hidden="true" />
          <div ref={doorRightRef} className={`${styles.door} ${styles.doorRight}`} aria-hidden="true" />

          {/* Single question on shut doors */}
          <div ref={questionRef} className={styles.question} aria-hidden="true">
            <p className={styles.questionLine}>{QUESTION}</p>
          </div>
        </div>

        <nav className={worksStyles.srList} aria-label="Selected work">
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/works#${project.slug}`}
              className={worksStyles.srLink}
              onFocus={() => jumpToCase(i)}
            >
              {indexLabel(i)} — {project.name}
            </Link>
          ))}
        </nav>
      </section>
    </HeaderZone>
  );
}
