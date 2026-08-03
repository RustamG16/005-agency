"use client";

// Stage B host — architecture cloned from reference/MonolithScene.tsx:
// dynamic three import, ONE scrubbed master ScrollTrigger, copy beats on
// separate non-scrub triggers, render on the shared gsap ticker, IO +
// document.hidden gating, full dispose on unmount.

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { services } from "@/content/services";
import { GUIDE_CHAPTERS, type GuideChapterId } from "./guide-copy";
import { GuideCallouts } from "./GuideCallouts";
import type { GuideHandles } from "./guide";
import styles from "./GuideScene.module.css";

type CalloutMode = "live" | "inview" | "flow";

const SERVICES = GUIDE_CHAPTERS[1].range;

export function GuideScene({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState<GuideChapterId | null>(null);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [mode, setMode] = useState<CalloutMode>("live");
  const [poses, setPoses] = useState<Array<{ id: string; top: number; side: "left" | "right" }>>([]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!root || !stage || !canvas) return;

    const mm = gsap.matchMedia();

    /** Callout toggles — NOT scrubbed. One trigger per chapter anchor, both directions. */
    const wireChapterTriggers = (kill: Array<() => void>) => {
      GUIDE_CHAPTERS.forEach((chapter) => {
        const anchor = root.querySelector<HTMLElement>(`[data-guide-chapter="${chapter.id}"]`);
        if (!anchor) return;
        // The page owns the surface, so the connector colour follows the section
        // it is actually drawn over (hairline on cotton, chili on noir).
        const surface = anchor.dataset.guideSurface;
        const card = layerRef.current?.querySelector<HTMLElement>(`[data-chapter="${chapter.id}"]`);
        if (surface && card) card.dataset.surface = surface;
        const t = ScrollTrigger.create({
          trigger: anchor,
          start: "top 62%",
          end: "bottom 38%",
          onToggle: (self) => setActive(self.isActive ? chapter.id : (prev) => (prev === chapter.id ? null : prev)),
        });
        kill.push(() => t.kill());
      });
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
        let disposed = false;
        let handles: GuideHandles | null = null;

        if (reduced) {
          setMode("flow");
          return () => {};
        }

        if (mobile) {
          // No canvas below 768px (FIX6). Two-to-three static robot renders,
          // captured from this same scene, are placed per chapter instead.
          setMode("inview");
          const picks: Array<[GuideChapterId, string, "left" | "right"]> = [
            ["services", "a", "right"],
            ["process", "b", "left"],
            ["cta", "c", "right"],
          ];
          const measure = () => {
            const rootTop = root.getBoundingClientRect().top + window.scrollY;
            setPoses(
              picks
                .map(([id, key, side]) => {
                  const anchor = root.querySelector<HTMLElement>(`[data-guide-chapter="${id}"]`);
                  if (!anchor) return null;
                  const top = anchor.getBoundingClientRect().top + window.scrollY - rootTop;
                  return { id: key, top: Math.round(top + 48), side };
                })
                .filter(Boolean) as Array<{ id: string; top: number; side: "left" | "right" }>
            );
          };
          measure();
          window.addEventListener("resize", measure);
          cleanups.push(() => window.removeEventListener("resize", measure));
          wireChapterTriggers(cleanups);
          return () => cleanups.forEach((fn) => fn());
        }

        if (!live) return () => {};
        setMode("live");
        wireChapterTriggers(cleanups);

        void (async () => {
          await (document.fonts?.ready ?? Promise.resolve());
          if (disposed) return;

          const { buildGuide, buildGuideTimeline } = await import("./guide");
          if (disposed) return;

          let g: GuideHandles;
          try {
            g = await buildGuide(canvas, stage);
          } catch (error) {
            // No model shipped yet: the page stays fully functional without it.
            if (process.env.NODE_ENV !== "production") {
              console.warn("[guide] robot model unavailable — running without the live canvas", error);
            }
            return;
          }
          if (disposed) {
            g.dispose();
            return;
          }
          handles = g;
          stage.dataset.ready = "true";

          const params = new URLSearchParams(window.location.search);
          const posing = process.env.NODE_ENV !== "production" && params.get("pose") === "hero";

          const tl = buildGuideTimeline(g);
          cleanups.push(() => tl.kill());

          let master: ScrollTrigger | null = null;
          if (posing) {
            // §2 first-frame capture rig: 1920×1080 stage, locked hero pose.
            stage.dataset.pose = "hero";
            g.setPoseMode(true);
          } else {
            master = ScrollTrigger.create({
              trigger: root,
              id: "home-guide-stage-b",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.3,
              animation: tl,
              refreshPriority: 40,
              onUpdate: (self) => {
                if (self.progress < SERVICES[0] || self.progress >= SERVICES[1]) return;
                const span = (SERVICES[1] - SERVICES[0]) / services.length;
                const i = Math.min(services.length - 1, Math.floor((self.progress - SERVICES[0]) / span));
                setServiceIndex((prev) => (prev === i ? prev : i));
              },
            });
            cleanups.push(() => master?.kill());
          }

          if (process.env.NODE_ENV !== "production") {
            const w = window as typeof window & { __guideProgress?: (p: number) => void };
            w.__guideProgress = (p: number) => {
              tl.progress(gsap.utils.clamp(0, 1, p));
              g.render();
            };
            cleanups.push(() => {
              delete w.__guideProgress;
            });
          }

          // One RAF for the whole page — the ticker Lenis already drives.
          let visible = true;
          const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            stage.dataset.visible = String(visible);
          });
          io.observe(root);
          cleanups.push(() => io.disconnect());

          const layer = layerRef.current;
          const render = () => {
            if (!visible || document.hidden) return;
            g.render();
            if (!layer) return;
            const card = layer.querySelector<HTMLElement>('[data-guide-card][data-active="true"]');
            const conn = card?.querySelector<HTMLElement>("[data-guide-conn]");
            if (!card || !conn) return;
            const eye = g.getEyeScreen();
            const anchor = conn.getBoundingClientRect();
            if (!eye) {
              conn.style.setProperty("--conn-len", "0px");
              return;
            }
            const dx = eye.x - anchor.left;
            const dy = eye.y - anchor.top;
            conn.style.setProperty("--conn-len", `${Math.round(Math.hypot(dx, dy))}px`);
            conn.style.setProperty("--conn-angle", `${(Math.atan2(dy, dx) * 180) / Math.PI}deg`);
          };
          gsap.ticker.add(render);
          cleanups.push(() => gsap.ticker.remove(render));

          const onResize = () => {
            g.resize();
            ScrollTrigger.refresh();
          };
          window.addEventListener("resize", onResize);
          cleanups.push(() => window.removeEventListener("resize", onResize));

          ScrollTrigger.refresh();
        })();

        return () => {
          disposed = true;
          cleanups.forEach((fn) => fn());
          handles?.dispose();
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div className={styles.root} ref={rootRef}>
      {/* Relay handoff: one scroll beat of absence between the film exit and the
          live entry. It doubles as the Arrival chapter anchor. */}
      <div
        className={styles.beat}
        data-guide-chapter="arrival"
        data-guide-surface="noir"
        aria-hidden="true"
      />

      <div className={styles.stage} ref={stageRef} aria-hidden="true">
        <canvas className={styles.canvas} ref={canvasRef} />
      </div>

      {poses.map((pose) => (
        <img
          key={pose.id}
          className={styles.pose}
          data-side={pose.side}
          style={{ top: `${pose.top}px` }}
          src={`/images/guide-pose-${pose.id}.png`}
          alt=""
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ))}

      <div className={styles.content}>{children}</div>

      <GuideCallouts
        ref={layerRef}
        active={active}
        mode={mode}
        serviceLine={services[serviceIndex]?.role}
      />
    </div>
  );
}
