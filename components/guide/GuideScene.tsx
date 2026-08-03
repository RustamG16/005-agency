"use client";

/**
 * The Guide — the robot and his platform.
 *
 * Owns the WebGL canvas, the idle scheduler and the in-stage drag. The DOM
 * shell (root, stage, slots) belongs to `GuideDock`.
 *
 * REVISED 2026-08-03 (Russ): no clipping disc, a real 3D pad, corner-locked
 * stage, and he stays hidden until you are past the hero.
 *
 * Render gating is `document.hidden` only — no IntersectionObserver. The stage
 * is fixed and always on screen, so IO would buy nothing, and it does not fire
 * in the harness's preview pane, which would make a working robot read as blank.
 */

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { guideStore, useGuide, type GuideMode } from "./guide-state";
import { createIdleScheduler } from "./guide-idle";
import { createDragController } from "./guide-drag";
import { EYE_BASE, EYE_CTA, type GuideRobot } from "./guide-robot";
import styles from "./GuideScene.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const MODEL_URL = "/models/repo_robot.glb";

/** Frames per second while asleep — he still breathes, just slowly. */
const SLEEP_FPS = 8;

/** How often the ground under the stage is re-sampled, in seconds. */
const GROUND_SAMPLE_INTERVAL = 0.25;

/** He appears once this much of the first screen has scrolled past. */
const REVEAL_AT = 0.85;

type RingState = "idle" | "hover" | "menu" | "dragging";

function ringState(mode: GuideMode): RingState {
  switch (mode) {
    case "dragging":
    case "armed":
      return "dragging";
    case "menu":
    case "ask":
      return "menu";
    case "hover":
      return "hover";
    default:
      return "idle";
  }
}

/** Defer the 7 MB model until the page has painted. */
function afterFirstPaint(run: () => void) {
  const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
  if (typeof w.requestIdleCallback === "function") {
    const id = w.requestIdleCallback(run);
    return () =>
      (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(run, 200);
  return () => window.clearTimeout(id);
}

export function GuideScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puckRef = useRef<HTMLButtonElement>(null);
  const [ground, setGround] = useState<"cotton" | "noir">("cotton");
  const { mode } = useGuide();

  // Read inside the ticker; a ref keeps the loop from being rebuilt.
  const groundRef = useRef<"cotton" | "noir">("cotton");
  useEffect(() => {
    groundRef.current = ground;
  }, [ground]);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const puck = puckRef.current;
      // Resolved from the DOM, not from `dockRef`: useGSAP runs as a LAYOUT
      // effect, and React attaches refs bottom-up, so a parent's ref is still
      // null when a child's layout effect fires.
      const dock = puck?.closest<HTMLElement>("[data-guide-dock]") ?? null;
      if (!canvas || !puck || !dock) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cleanups: Array<() => void> = [];
      let disposed = false;

      const sizeOf = () => dock.offsetWidth || 180;

      const stageCentre = () => {
        const r = puck.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      };

      /* Which ground is he standing over? Sections already declare this for the
       * header via `data-header-theme`, so reuse it rather than adding a second
       * source of truth. The header context itself tracks the TOP of the
       * viewport, which is the wrong region for a bottom-corner stage. */
      const sampleGround = () => {
        const c = stageCentre();
        const under = document
          .elementsFromPoint(c.x, c.y)
          .find((el) => el.closest("[data-header-theme]"));
        const zone = under?.closest("[data-header-theme]");
        const next = zone?.getAttribute("data-header-theme") === "dark" ? "noir" : "cotton";
        if (next !== groundRef.current) {
          groundRef.current = next;
          setGround(next);
        }
      };

      /* He is absent over the hero and simply appears once it is behind you —
       * no relay choreography, per Russ. Implemented entirely on this side; the
       * hero's own scrub is not touched. */
      let visible: boolean | null = null;
      const syncVisible = () => {
        const next = window.scrollY > window.innerHeight * REVEAL_AT;
        if (next === visible) return;
        visible = next;
        dock.dataset.visible = next ? "true" : "false";
      };
      syncVisible();

      const cancelIdle = afterFirstPaint(() => {
        void (async () => {
          let built: GuideRobot;
          try {
            const { buildGuideRobot } = await import("./guide-robot");
            built = await buildGuideRobot(canvas, MODEL_URL);
          } catch (err) {
            // A missing or corrupt model must not take the page down.
            console.error("[guide] model failed to load", err);
            return;
          }
          if (disposed) {
            built.dispose();
            return;
          }
          cleanups.push(() => built.dispose());
          built.resize(sizeOf());

          /* ---- idle life ---- */
          const idle = createIdleScheduler({
            pose: built.pose,
            gsap,
            getPuckCentre: stageCentre,
            reduced,
            onSleepChange: (asleep) => guideStore.setMode(asleep ? "sleep" : "idle"),
          });
          cleanups.push(() => idle.destroy());

          cleanups.push(
            guideStore.connectScene({
              setEyeStep: (on) => {
                gsap.to(built.pose, {
                  eye: on ? EYE_CTA : EYE_BASE,
                  duration: reduced ? 0 : 0.24,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              },
              playClip: (name) => {
                if (!built.clips.some((c) => new RegExp(name, "i").test(c))) return;
                gsap.to(built.pose, {
                  [name]: 1,
                  duration: reduced ? 0 : 0.25,
                  ease: "none",
                  overwrite: "auto",
                });
                if (name !== "walk") {
                  gsap.to(built.pose, {
                    [name]: 0,
                    duration: 0.4,
                    delay: name === "greet" ? 1.6 : 2.4,
                    ease: "none",
                  });
                }
              },
              wake: () => idle.notifyInput(),
            })
          );

          /* ---- nudge him around the stage ---- */
          const drag = createDragController({
            gsap,
            pose: built.pose,
            puck,
            reduced,
            getSize: sizeOf,
            onDragStart: () => {
              idle.setBusy(true);
              idle.notifyInput();
              guideStore.setMode("dragging");
              gsap.to(built.pose, { walk: 1, duration: 0.2, ease: "none", overwrite: "auto" });
            },
            onDragEnd: () => {
              idle.setBusy(false);
              guideStore.setMode("idle");
              gsap.to(built.pose, { walk: 0, duration: 0.3, ease: "none", overwrite: "auto" });
            },
            onTap: () => {
              idle.notifyInput();
              if (guideStore.mode === "menu") guideStore.closeMenu();
              else guideStore.openMenu();
            },
          });
          cleanups.push(drag.attach());

          /* ---- input ---- */
          const onPointerMove = (e: PointerEvent) => idle.notifyPointer(e.clientX, e.clientY);
          const onInput = () => idle.notifyInput();
          window.addEventListener("pointermove", onPointerMove, { passive: true });
          window.addEventListener("keydown", onInput);
          window.addEventListener("pointerdown", onInput);
          cleanups.push(() => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("keydown", onInput);
            window.removeEventListener("pointerdown", onInput);
          });

          const onEnter = () => {
            idle.notifyInput();
            if (guideStore.mode === "idle" || guideStore.mode === "sleep")
              guideStore.setMode("hover");
          };
          const onLeave = () => {
            if (guideStore.mode === "hover") guideStore.setMode("idle");
          };
          puck.addEventListener("pointerenter", onEnter);
          puck.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            puck.removeEventListener("pointerenter", onEnter);
            puck.removeEventListener("pointerleave", onLeave);
          });

          const onResize = () => {
            built.resize(sizeOf());
            syncVisible();
          };
          window.addEventListener("resize", onResize);
          cleanups.push(() => window.removeEventListener("resize", onResize));

          /* ---- the loop ---- */
          sampleGround();

          if (reduced) {
            // Lock §7: reduced motion is a STATE — still rendered, just static.
            built.pose.sway = 0;
            built.render(0, 0);
            guideStore.setCrown(built.getCrown());
            const onScrollStatic = () => syncVisible();
            window.addEventListener("scroll", onScrollStatic, { passive: true });
            cleanups.push(() => window.removeEventListener("scroll", onScrollStatic));
          } else {
            idle.start();

            let last = performance.now();
            let elapsed = 0;
            let sleepAcc = 0;
            let groundAcc = 0;
            let lastScrollY = window.scrollY;

            const render = () => {
              if (document.hidden) return;
              const now = performance.now();
              const dt = Math.min((now - last) / 1000, 0.1);
              last = now;

              if (idle.isAsleep()) {
                sleepAcc += dt;
                if (sleepAcc < 1 / SLEEP_FPS) return;
                sleepAcc = 0;
              }

              elapsed += dt;

              const y = window.scrollY;
              if (y !== lastScrollY) {
                if (dt > 0) idle.notifyScroll((y - lastScrollY) / dt);
                lastScrollY = y;
                syncVisible();
              }

              groundAcc += dt;
              if (groundAcc >= GROUND_SAMPLE_INTERVAL) {
                groundAcc = 0;
                sampleGround();
              }

              built.render(dt, elapsed);
              guideStore.setCrown(built.getCrown());
            };

            gsap.ticker.add(render);
            cleanups.push(() => gsap.ticker.remove(render));
          }

          if (process.env.NODE_ENV !== "production") {
            (window as unknown as Record<string, unknown>).__guideDebug = (
              patch: Partial<typeof built.pose> & { mode?: GuideMode; visible?: boolean }
            ) => {
              if (patch.mode) guideStore.setMode(patch.mode);
              if (patch.visible !== undefined) dock.dataset.visible = patch.visible ? "true" : "false";
              Object.assign(built.pose, patch);
              built.render(0, 0);
              guideStore.setCrown(built.getCrown());
            };
            (window as unknown as Record<string, unknown>).__guideOffset = () => ({
              x: Number(built.pose.offsetX.toFixed(3)),
              y: Number(built.pose.offsetY.toFixed(3)),
            });
            cleanups.push(() => {
              delete (window as unknown as Record<string, unknown>).__guideDebug;
              delete (window as unknown as Record<string, unknown>).__guideOffset;
            });
          }

          dock.dataset.ready = "true";
        })();
      });

      return () => {
        disposed = true;
        cancelIdle();
        cleanups.forEach((fn) => fn());
        guideStore.setCrown(null);
      };
    },
    { scope: puckRef }
  );

  return (
    <button
      ref={puckRef}
      type="button"
      className={styles.puck}
      data-ground={ground}
      data-state={ringState(mode)}
      aria-label="The guide — open chapter menu"
      aria-expanded={mode === "menu"}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </button>
  );
}
