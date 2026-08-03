"use client";

/**
 * MonolithScene — canvas lifecycle, renderer, and the master ScrollTrigger scrub.
 * Spec: ABOUT-MONOLITH-SPEC.md §1, §3. Chapters are passed in as children and
 * scroll in front of the sticky stage.
 */

import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import {
  buildChapterTimeline,
  buildIdleFloat,
  buildMonolith,
  buildRig,
  buildScene,
} from "./monolith";
import styles from "./MonolithScene.module.css";

const MOBILE_PRERENDER = "/videos/monolith-mobile.mp4";
const POSTER = "/images/about/monolith-poster.jpg";
/** Optional per-chapter stills for reduced motion; any that are absent fall back. */
const CHAPTER_STILL = (n: number) => `/images/about/monolith-ch${n}.jpg`;

export function MonolithScene({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isDesktop, isMobile, reduced } = ctx.conditions as Record<string, boolean>;

        /* Reduced motion — per-chapter stills, no scrub, no WebGL. */
        if (reduced) {
          stage.dataset.mode = "still";
          const img = posterRef.current;
          if (!img) return;
          img.onerror = () => {
            if (!img.src.endsWith(POSTER)) img.src = POSTER;
          };
          const sections = Array.from(root.querySelectorAll("section"));
          const io = new IntersectionObserver(
            (entries) => {
              const top = entries.find((e) => e.isIntersecting);
              if (!top) return;
              const n = sections.indexOf(top.target as HTMLElement) + 1;
              if (n > 0) img.src = CHAPTER_STILL(n);
            },
            { rootMargin: "-45% 0px -45% 0px" }
          );
          sections.forEach((s) => io.observe(s));
          return () => io.disconnect();
        }

        /* Mobile — scrub the pre-rendered capture of this same timeline. */
        if (isMobile) {
          const video = videoRef.current;
          if (!video) {
            stage.dataset.mode = "still";
            return;
          }
          stage.dataset.mode = "video";
          let trigger: ScrollTrigger | undefined;

          const onReady = () => {
            if (!video.duration || !isFinite(video.duration)) return;
            /* All-keyframe re-encode only (media guide §4) — never the original. */
            const tween = gsap.to(video, {
              currentTime: video.duration,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3,
              },
            });
            trigger = tween.scrollTrigger;
          };
          const onError = () => {
            stage.dataset.mode = "still";
          };
          video.addEventListener("loadedmetadata", onReady);
          video.addEventListener("error", onError);
          if (video.readyState >= 1) onReady();

          return () => {
            video.removeEventListener("loadedmetadata", onReady);
            video.removeEventListener("error", onError);
            trigger?.kill();
          };
        }

        if (!isDesktop) return;

        /* Desktop — real-time WebGL. */
        const canvas = canvasRef.current;
        if (!canvas) return;

        let renderer: THREE.WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          });
        } catch {
          stage.dataset.mode = "still";
          return;
        }

        stage.dataset.mode = "webgl";
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.shadowMap.enabled = false;

        const monolith = buildMonolith();
        const { scene } = buildScene(monolith);
        const { rig, camera } = buildRig();
        scene.add(rig);

        const resize = () => {
          const w = stage.clientWidth;
          const h = stage.clientHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / Math.max(1, h);
          camera.updateProjectionMatrix();
        };
        resize();

        const tl = buildChapterTimeline({ monolith, rig, camera });
        const float = buildIdleFloat(monolith);

        const st = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          animation: tl,
          onUpdate: (self) => {
            /* Only decode video while the screen face is actually on screen. */
            monolith.screen.setPlaying(self.progress > 0.7 && self.progress < 0.93);
          },
          onToggle: (self) => {
            stage.style.willChange = self.isActive ? "transform" : "auto";
          },
        });

        /* One RAF for the page: render on the gsap ticker Lenis already drives. */
        let onScreen = true;
        let hidden = document.hidden;
        const render = () => {
          if (!onScreen || hidden) return;
          renderer.render(scene, camera);
        };
        gsap.ticker.add(render);

        const io = new IntersectionObserver(
          ([entry]) => {
            onScreen = entry.isIntersecting;
            if (!onScreen) monolith.screen.setPlaying(false);
          },
          { threshold: 0 }
        );
        io.observe(stage);

        const onVisibility = () => {
          hidden = document.hidden;
          if (hidden) monolith.screen.setPlaying(false);
        };
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("resize", resize);

        return () => {
          gsap.ticker.remove(render);
          io.disconnect();
          document.removeEventListener("visibilitychange", onVisibility);
          window.removeEventListener("resize", resize);
          st.kill();
          tl.kill();
          float.kill();
          monolith.dispose();
          scene.clear();
          renderer.dispose();
          renderer.forceContextLoss();
          stage.style.willChange = "auto";
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className={styles.root} data-monolith>
      <div ref={stageRef} className={styles.stage} data-mode="still" aria-hidden="true">
        <canvas ref={canvasRef} className={styles.canvas} />
        <video
          ref={videoRef}
          className={styles.video}
          src={MOBILE_PRERENDER}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={posterRef} className={styles.poster} src={POSTER} alt="" loading="lazy" />
      </div>
      <div className={styles.chapters}>{children}</div>
    </div>
  );
}
