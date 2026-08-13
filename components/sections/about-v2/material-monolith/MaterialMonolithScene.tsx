"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { AboutV2Chapters } from "./AboutV2Chapters";
import type { MaterialMonolithHandles } from "./materialMonolith";
import styles from "./MaterialMonolithScene.module.css";

gsap.registerPlugin(useGSAP);

const stateLabels = [
  "Closed",
  "Direct view",
  "Judgment",
  "Continuity",
  "Ownership",
  "Resolved",
] as const;

export function MaterialMonolithScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const legendRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { motion } = context.conditions as { motion: boolean; reduced: boolean };
          const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);

          if (!motion) {
            gsap.set(reveals, { clearProps: "all" });
            return;
          }

          reveals.forEach((element) => {
            const headline = element.dataset.reveal === "headline";
            gsap.fromTo(
              element,
              { autoAlpha: 0, y: headline ? 34 : 18, clipPath: headline ? "inset(0 0 100% 0)" : "inset(0 0 0 0)" },
              {
                autoAlpha: 1,
                y: 0,
                clipPath: "inset(0 0 0% 0)",
                duration: headline ? 0.42 : 0.36,
                ease: headline ? "expo.out" : "power2.out",
                scrollTrigger: {
                  trigger: element,
                  start: headline ? "top 82%" : "top 86%",
                  once: true,
                },
              }
            );
          });
        }
      );

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!root || !stage || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let disposed = false;
    let handles: MaterialMonolithHandles | null = null;
    const cleanups: Array<() => void> = [];

    void (async () => {
      const { buildMaterialMonolith, buildMaterialTimeline } = await import("./materialMonolith");
      if (disposed) return;

      handles = buildMaterialMonolith(canvas, stage);
      const activeHandles = handles;
      const timeline = buildMaterialTimeline(activeHandles, window.innerWidth < 700);
      stage.dataset.ready = "true";

      const labels = Array.from(legendRef.current?.children ?? []) as HTMLElement[];
      const setActiveLabel = (index: number) => {
        labels.forEach((label, labelIndex) => {
          label.dataset.active = labelIndex === index ? "true" : "false";
        });
        stage.dataset.state = String(index);
      };
      setActiveLabel(0);

      const thresholds = [0.13, 0.31, 0.49, 0.67, 0.84];
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        animation: timeline,
        onUpdate: (self) => {
          const index = thresholds.reduce((value, threshold) => value + Number(self.progress >= threshold), 0);
          setActiveLabel(index);
          activeHandles.setMediaActive(self.progress >= 0.5 && self.progress < 0.84);
        },
      });

      const idle = gsap.to(activeHandles.monolith.position, {
        y: 0.045,
        duration: 6.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      let visible = true;
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) activeHandles.setMediaActive(false);
      });
      observer.observe(stage);

      const render = () => {
        if (visible && !document.hidden) activeHandles.render();
      };
      gsap.ticker.add(render);

      const resize = () => {
        activeHandles.resize();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", resize);

      cleanups.push(
        () => window.removeEventListener("resize", resize),
        () => observer.disconnect(),
        () => gsap.ticker.remove(render),
        () => idle.kill(),
        () => trigger.kill(),
        () => timeline.kill()
      );

      await activeHandles.loadOptionalMedia();
      if (!disposed) {
        activeHandles.render();
        ScrollTrigger.refresh();
      }
    })();

    return () => {
      disposed = true;
      cleanups.forEach((cleanup) => cleanup());
      handles?.dispose();
    };
  }, []);

  return (
    <HeaderZone theme="dark">
      <div className={styles.root} ref={rootRef}>
        <div
          className={styles.contract}
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html:
              "<!-- THESIS: One material object shows how two founders keep an idea intact; refuses a repeated services/work grid. OWN-WORLD: Convenium noir, cotton, cherry, editorial rules and tactile material plates. STORY: meet the founders, understand direct responsibility, trust the working model, start a project. FIRST VIEWPORT: centered monolith behind an oversized two-person claim, persistent project action in existing chrome. FORM: Material Monolith, user-selected Concept 1, Olympus Gate B 2026-08-09. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->",
          }}
        />

        <div className={styles.stage} ref={stageRef}>
          <div className={styles.fallback} aria-hidden="true">
            {stateLabels.map((label, index) => (
              <span key={label} data-material={index} />
            ))}
          </div>
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
          <ul className={styles.legend} ref={legendRef} aria-hidden="true">
            {stateLabels.map((label, index) => (
              <li key={label} data-active={index === 0 ? "true" : "false"}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.content}>
          <AboutV2Chapters />
        </div>
      </div>
    </HeaderZone>
  );
}
