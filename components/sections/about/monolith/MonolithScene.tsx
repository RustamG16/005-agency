"use client";

import { useEffect, useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { AboutChapters } from "./AboutChapters";
import type { MonolithHandles } from "./monolith";
import styles from "./MonolithScene.module.css";

/**
 * Mounts the WebGL stage and wires two independent things onto the same root:
 *
 * 1. The object's master timeline — one scrubbed ScrollTrigger spanning the page
 *    (`buildObjectTimeline`, `monolith.ts`).
 * 2. Chapter copy reveals — per-element, once-only ScrollTriggers, NOT scrubbed
 *    (`.dc`'s `_copy()`). Headlines split into masked lines; bodies fade + rise.
 *
 * These stay separate on purpose: the .dc reference treats the object and the copy as
 * two different rhythms — the object is a single continuous take, the copy arrives in
 * discrete beats as each section crosses into view.
 *
 * Three.js is behind a dynamic import inside the effect: it never reaches the server
 * bundle and is never downloaded under `prefers-reduced-motion`, where the copy
 * reveals still run (opacity-only) but the canvas never mounts.
 */
export function MonolithScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!root || !stage || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let disposed = false;
    let handles: MonolithHandles | null = null;
    const cleanups: Array<() => void> = [];
    const splits: SplitText[] = [];

    const wireCopyReveals = () => {
      root.querySelectorAll<HTMLElement>("[data-head]").forEach((el) => {
        const trigger = { trigger: el, start: "top 82%", once: true };
        if (reduced) {
          gsap.from(el, { autoAlpha: 0, duration: 0.32, scrollTrigger: trigger });
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
              duration: 0.42,
              ease: "expo.out",
              stagger: 0.06,
              scrollTrigger: trigger,
            });
          },
        });
      });

      root.querySelectorAll<HTMLElement>("[data-body]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: reduced ? 0 : 24,
          duration: 0.42,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    };
    cleanups.push(() => splits.forEach((s) => s.revert()));

    void (async () => {
      await (document.fonts?.ready ?? Promise.resolve());
      if (disposed) return;
      wireCopyReveals();

      // Reduced motion: copy reveals are wired above; the WebGL stage never mounts.
      if (reduced) return;

      const { buildMonolith, buildObjectTimeline, buildArrival, SCREEN_WINDOW, ARRIVAL_WINDOW } =
        await import("./monolith");
      if (disposed) return;

      const m = buildMonolith(canvas, stage);
      handles = m;
      stage.dataset.ready = "true";

      // Chapter-1 arrival decoration. Concept is selectable so the three can be compared
      // on the real page; `?ch1=` wins, otherwise the default below.
      const param = Number(new URLSearchParams(window.location.search).get("ch1"));
      const initialConcept = param === 1 || param === 2 || param === 3 ? param : 1;

      let arrival = buildArrival(initialConcept, m.renderer, m.surfaceTex);
      m.scene.add(arrival.root);
      cleanups.push(() => arrival.dispose());

      const tl = buildObjectTimeline(m);
      const [screenStart, screenEnd] = SCREEN_WINDOW;
      const [arriveFadeStart, arriveFadeEnd] = ARRIVAL_WINDOW;

      // Arrival elements hold through chapter 1, then fade across chapter 2 so nothing
      // survives into the .28 fracture. Driven here rather than as a timeline tween —
      // same approach as the screen-video gate, and it leaves `buildObjectTimeline` alone.
      const applyArrival = (p: number) => {
        const t = 1 - gsap.utils.clamp(0, 1, (p - arriveFadeStart) / (arriveFadeEnd - arriveFadeStart));
        arrival.setOpacity(t);
      };
      applyArrival(0);

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        animation: tl,
        onUpdate: (self) => {
          m.setVideosActive(self.progress >= screenStart && self.progress < screenEnd);
          applyArrival(self.progress);
        },
      });
      cleanups.push(() => trigger.kill());
      cleanups.push(() => tl.kill());

      const float = gsap.to(m.group.position, {
        y: 0.045,
        duration: 6.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      cleanups.push(() => float.kill());

      // Dev-only deterministic stepper for QA capture — mirrors the .dc reference's
      // `__mono.probe`. Stripped by NODE_ENV in production.
      if (process.env.NODE_ENV !== "production") {
        const w = window as typeof window & {
          __monolithProgress?: (p: number) => void;
          __ch1?: (n: 1 | 2 | 3) => string;
          __ch1Tune?: (next: Record<string, number>) => void;
        };
        w.__monolithProgress = (p: number) => {
          float.pause();
          tl.progress(gsap.utils.clamp(0, 1, p));
          m.render();
        };

        // Swap chapter-1 concepts live, without a reload. Tears the old one down first,
        // so only the active concept is ever in the scene graph.
        w.__ch1 = (n) => {
          if (n !== 1 && n !== 2 && n !== 3) return "ch1: pass 1, 2 or 3";
          arrival.dispose();
          arrival = buildArrival(n, m.renderer, m.surfaceTex);
          m.scene.add(arrival.root);
          applyArrival(tl.progress());
          m.render();
          return `ch1: concept ${n}`;
        };

        // Dial values in live, e.g. __ch1Tune({ glow: 0.7, motes: 0.5 }).
        w.__ch1Tune = (next) => {
          arrival.tune(next);
          m.render();
        };

        cleanups.push(() => {
          delete w.__monolithProgress;
          delete w.__ch1;
          delete w.__ch1Tune;
        });
      }

      // Render on the ticker Lenis already drives — one RAF for the whole page.
      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(stage);
      cleanups.push(() => io.disconnect());

      const render = () => {
        if (visible && !document.hidden) m.render();
      };
      gsap.ticker.add(render);
      cleanups.push(() => gsap.ticker.remove(render));

      const onResize = () => {
        m.resize();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));

      m.loadOptionalMedia(tl);
      ScrollTrigger.refresh();
    })();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      handles?.dispose();
    };
  }, []);

  return (
    <HeaderZone theme="dark">
      <div className={styles.root} ref={rootRef}>
        <div className={styles.stage} ref={stageRef}>
          <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
        </div>
        <div className={styles.content}>
          <AboutChapters />
        </div>
      </div>
    </HeaderZone>
  );
}
