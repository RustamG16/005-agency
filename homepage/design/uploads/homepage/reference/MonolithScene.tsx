"use client";

// REFERENCE — components/sections/about/monolith/MonolithScene.tsx (shipped /about page).
// This is the repo's WebGL convention: dynamic-import three, one scrubbed master
// ScrollTrigger, copy reveals on separate once-only triggers, render on the shared
// gsap ticker, IntersectionObserver + document.hidden gating, full dispose on unmount.
// The home GuideScene must follow this exact architecture.

import { useEffect, useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { AboutChapters } from "./AboutChapters";
import type { MonolithHandles } from "./monolith";
import styles from "./MonolithScene.module.css";

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

      const { buildMonolith, buildObjectTimeline, SCREEN_WINDOW } = await import("./monolith");
      if (disposed) return;

      const m = buildMonolith(canvas, stage);
      handles = m;
      stage.dataset.ready = "true";

      const tl = buildObjectTimeline(m);
      const [screenStart, screenEnd] = SCREEN_WINDOW;
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        animation: tl,
        onUpdate: (self) => {
          m.setVideosActive(self.progress >= screenStart && self.progress < screenEnd);
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

      if (process.env.NODE_ENV !== "production") {
        const w = window as typeof window & { __monolithProgress?: (p: number) => void };
        w.__monolithProgress = (p: number) => {
          float.pause();
          tl.progress(gsap.utils.clamp(0, 1, p));
          m.render();
        };
        cleanups.push(() => {
          delete w.__monolithProgress;
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
