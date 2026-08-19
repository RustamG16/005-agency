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
import {
  guideStore,
  loadPuckPos,
  useGuide,
  type GuideClipName,
  type GuideMode,
} from "./guide-state";
import { createIdleScheduler } from "./guide-idle";
import { createDragController } from "./guide-drag";
import {
  EYE_BASE,
  EYE_CTA,
  FACING_READER,
  REST_TURN,
  type GuideRimState,
  type GuideRobot,
} from "./guide-robot";
import styles from "./GuideScene.module.css";
import { withBasePath } from "@/lib/basePath";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const MODEL_URL = withBasePath("/models/repo_robot.glb");

/** Frames per second while asleep — he still breathes, just slowly. */
const SLEEP_FPS = 8;

/** How often the ground under the stage is re-sampled, in seconds. */
const GROUND_SAMPLE_INTERVAL = 0.25;

/** How long a one-shot clip is held at full weight before it releases. */
const CLIP_HOLD: Record<string, number> = { greet: 1.6, talk: 2.4, run: 1.2 };

/** "Do a trick" — one full turn, and how long before he'll do it again. */
const TRICK_SECONDS = 1.5;
const TRICK_COOLDOWN_MS = 6000;

/* Left alone for this long, away from home, and he walks back (guide-drag's
 * `returnHome`). Only interactions WITH HIM restart it — a click elsewhere on
 * the page is not him being used, and treating it as such would let a visitor
 * who is reading normally keep him stranded indefinitely, which is the whole
 * problem the return exists to fix. */
const RETURN_AFTER_MS = 12_000;

/** How far he lifts off his pad while carried, in model heights. */
const CARRY_LIFT = 0.06;

/* He appears once the first screen has scrolled past. FALLBACK ONLY: a route
 * whose opening section is pinned makes "one viewport" meaningless — the R6 hero
 * pins for 300% — so where a section declares `data-guide-reveal-after` the gate
 * measures that element instead. This number only applies to routes that do not. */
const REVEAL_AT = 0.98;

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

/** DESIGN-LOCK §3: hover and open share a state; dragging has its own. */
function rimState(ring: RingState): GuideRimState {
  if (ring === "dragging") return "dragging";
  if (ring === "hover" || ring === "menu") return "hover";
  return "rest";
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
      /** How far he is currently raised above his resting corner, in px. */
      let asideShift = 0;
      const sampleGround = () => {
        const c = stageCentre();
        const stack = document.elementsFromPoint(c.x, c.y);

        const under = stack.find((el) => el.closest("[data-header-theme]"));
        const zone = under?.closest("[data-header-theme]");
        const next = zone?.getAttribute("data-header-theme") === "dark" ? "noir" : "cotton";
        if (next !== groundRef.current) {
          groundRef.current = next;
          setGround(next);
        }

        /* Anything marked `data-guide-avoid` is something he should be looking
         * at, not standing on — today that is the footer wordmark, whose last
         * letter he was sitting on. He steps up just clear of its top edge.
         * Generic on purpose: any page can opt a box out of the corner.
         *
         * Queried rather than read off `elementsFromPoint`, because those boxes
         * are decoration and set `pointer-events: none`, which takes them out of
         * hit testing entirely. */
        /* Once he has been picked up and put somewhere, he stays there. Auto-
         * stepping aside from the footer wordmark is a courtesy for his default
         * corner, not something that should override where you left him. */
        const dragged =
          parseFloat(dock.style.getPropertyValue("--guide-x")) !== 0 ||
          parseFloat(dock.style.getPropertyValue("--guide-y")) !== 0;
        if (dragged) {
          if (dock.dataset.aside === "true") {
            delete dock.dataset.aside;
            asideShift = 0;
          }
          return;
        }

        const rect = dock.getBoundingClientRect();
        // Always solve from where he WOULD be at rest. Reading his current
        // lifted box instead would clear the overlap, drop him back onto it and
        // oscillate.
        const vh = window.innerHeight;
        const homeGap = vh - (rect.bottom + asideShift);
        const height = rect.height;

        const boxes = [...document.querySelectorAll<HTMLElement>("[data-guide-avoid]")].map((el) =>
          el.getBoundingClientRect()
        );

        /* Settle rather than test once: stepping clear of the wordmark can put
         * him on the colophon above it, which he then also has to clear. Each
         * pass can only raise him, so this converges — and always from home, so
         * the answer is the same every sample. */
        let gap = homeGap;
        for (let pass = 0; pass < 4; pass += 1) {
          let next = gap;
          const top = vh - gap - height;
          const bottom = vh - gap;
          for (const r of boxes) {
            const overlaps =
              r.bottom > top && r.top < bottom && r.right > rect.left && r.left < rect.right;
            if (overlaps) next = Math.max(next, Math.round(vh - r.top + 12));
          }
          if (next === gap) break;
          gap = next;
        }

        if (gap > homeGap) {
          dock.style.setProperty("--guide-aside-lift", `${gap}px`);
          dock.dataset.aside = "true";
          asideShift = gap - homeGap;
        } else if (dock.dataset.aside === "true") {
          delete dock.dataset.aside;
          asideShift = 0;
        }
      };

      /* He is absent over the hero and simply appears once it is behind you —
       * no relay choreography, per Russ. Implemented entirely on this side; the
       * hero's own scrub is not touched.
       *
       * This flag gets its OWN scroll listener, registered now rather than from
       * inside the render loop. `GuideHints` gates every bubble on it, and the
       * loop does not start until a 7 MB GLB has downloaded and parsed — so
       * while it lived in the loop, every hint you scrolled past during the load
       * was dropped silently and its once-per-direction trigger never fired
       * again on the way down. */
      let visible: boolean | null = null;
      const revealAfter = document.querySelector<HTMLElement>("[data-guide-reveal-after]");
      const syncVisible = () => {
        let next: boolean;
        if (revealAfter) {
          /* A pinned section is `position: fixed` while it is held, so its own
           * rect stops moving and would never satisfy this. ScrollTrigger's
           * pin-spacer is the box that actually occupies the scroll, so measure
           * that when it exists. */
          const box = revealAfter.closest<HTMLElement>(".pin-spacer") ?? revealAfter;
          next = box.getBoundingClientRect().bottom <= 0;
        } else {
          next = window.scrollY > window.innerHeight * REVEAL_AT;
        }
        if (next === visible) return;
        visible = next;
        dock.dataset.visible = next ? "true" : "false";
      };
      syncVisible();
      window.addEventListener("scroll", syncVisible, { passive: true });
      window.addEventListener("resize", syncVisible);
      cleanups.push(() => {
        window.removeEventListener("scroll", syncVisible);
        window.removeEventListener("resize", syncVisible);
      });

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

          /** Guards "Do a trick" against being spammed. */
          let lastTrickAt = -Infinity;

          /* One place that knows how a clip is faded in, held and released.
           * Both the idle scheduler and Track B's `guideStore.playClip` go
           * through it, so a clip can never be left pinned at full weight by one
           * caller while the other assumes it released. */
          const playClip = (name: GuideClipName) => {
            if (reduced) return;
            if (!built.clips.some((c) => new RegExp(name, "i").test(c))) return;
            gsap.to(built.pose, {
              [name]: 1,
              duration: 0.25,
              ease: "none",
              overwrite: "auto",
            });
            if (name === "walk") return; // held until the drag ends
            gsap.to(built.pose, {
              [name]: 0,
              duration: 0.4,
              delay: CLIP_HOLD[name] ?? 2.4,
              ease: "none",
            });
          };

          /* ---- idle life ---- */
          const idle = createIdleScheduler({
            pose: built.pose,
            gsap,
            getPuckCentre: stageCentre,
            reduced,
            playClip,
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
              playClip,
              /* Talking is a STATE, not a one-shot: the clip runs for as long
               * as the bubble is up, and he squares up to the reader while he
               * is saying it. The resting pose is a slight three-quarter, so
               * turning to 0 is a real, readable movement rather than a nudge. */
              setTalking: (on) => {
                if (reduced) return;
                gsap.to(built.pose, {
                  talk: on ? 1 : 0,
                  duration: on ? 0.2 : 0.4,
                  ease: "none",
                  overwrite: "auto",
                });
                gsap.to(built.pose, {
                  turn: on ? FACING_READER : REST_TURN,
                  headTurn: 0,
                  duration: on ? 0.45 : 0.7,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              },
              playTrick: () => {
                if (reduced) return false;
                if (!built.clips.some((c) => /run/i.test(c))) return false;
                const now = performance.now();
                if (now - lastTrickAt < TRICK_COOLDOWN_MS) return false;
                lastTrickAt = now;

                /* The rig has no spin, jump or flip — Run is the only clip left
                 * unused, so the trick is Run on the spot while the whole figure
                 * turns once, with the eye at its CTA step for the duration. */
                idle.setBusy(true);
                idle.notifyInput();
                const rest = built.pose.turn;
                gsap
                  .timeline({
                    onComplete: () => {
                      // Land exactly where he started; a full turn is a no-op
                      // visually, so this can be set rather than tweened.
                      gsap.set(built.pose, { turn: REST_TURN });
                      idle.setBusy(false);
                    },
                  })
                  .to(built.pose, { run: 1, duration: 0.22, ease: "none" }, 0)
                  .to(built.pose, { eye: EYE_CTA, duration: 0.22, ease: "power2.out" }, 0)
                  .to(
                    built.pose,
                    { turn: rest + Math.PI * 2, duration: TRICK_SECONDS, ease: "power2.inOut" },
                    0.1
                  )
                  .to(built.pose, { run: 0, duration: 0.3, ease: "none" }, TRICK_SECONDS - 0.1)
                  .to(built.pose, { eye: EYE_BASE, duration: 0.35, ease: "power2.inOut" }, TRICK_SECONDS);
                return true;
              },
              wake: () => idle.notifyInput(),
            })
          );

          /* ---- pick him up and put him anywhere ---- */

          /* The standby before he walks home. Only ever armed while he is away
           * from home, and only ever restarted by something the visitor did to
           * HIM — see RETURN_AFTER_MS. */
          let returnTimer: ReturnType<typeof setTimeout> | null = null;

          const clearReturnTimer = () => {
            if (returnTimer === null) return;
            clearTimeout(returnTimer);
            returnTimer = null;
          };

          const armReturn = () => {
            clearReturnTimer();
            if (drag.isHome()) return;
            returnTimer = setTimeout(() => {
              returnTimer = null;
              /* FIX (audit finding, R6): the timer used to fire unconditionally.
               * Opening the radial or Ask fires ONE `guideStore` notification —
               * `interrupt()` below arms this timer at that moment — but staying
               * open past RETURN_AFTER_MS produces no further notification, so
               * the original code walked the dock (and the radial anchored to
               * it) out from under a visitor still choosing an option. A mode
               * still counted as "occupied" re-arms instead of firing — the
               * return keeps deferring for as long as the surface stays open,
               * and only actually walks once the visitor is truly idle. */
              const occupied =
                guideStore.mode === "menu" || guideStore.mode === "ask" || guideStore.mode === "talking";
              if (occupied) {
                armReturn();
                return;
              }
              drag.returnHome();
            }, RETURN_AFTER_MS);
          };

          /* Anything the visitor does to him kills a walk in progress and puts
           * the clock back to zero. The return must never fight the user. */
          const interrupt = () => {
            drag.cancelReturn();
            armReturn();
          };

          const drag = createDragController({
            dock,
            puck,
            gsap,
            reduced,
            initial: loadPuckPos(),
            onDragStart: () => {
              clearReturnTimer();
              idle.setBusy(true);
              idle.notifyInput();
              guideStore.setMode("dragging");
              // He walks while he is being carried — the one clip that reads as
              // "in transit" rather than "standing somewhere else" — and lifts
              // clear of his pad, so he reads as picked up rather than slid.
              gsap.to(built.pose, { walk: 1, duration: 0.2, ease: "none", overwrite: "auto" });
              gsap.to(built.pose, { bob: CARRY_LIFT, duration: 0.22, ease: "power2.out" });
            },
            onDragEnd: () => {
              idle.setBusy(false);
              guideStore.setMode("idle");
              gsap.to(built.pose, { walk: 0, duration: 0.3, ease: "none", overwrite: "auto" });
              // He settles back onto the pad. `back.out` gives the landing a
              // little weight without becoming a bounce.
              gsap.to(built.pose, { bob: 0, duration: 0.34, ease: "back.out(1.6)" });
              armReturn();
            },
            onTap: () => {
              interrupt();
              idle.notifyInput();
              if (guideStore.mode === "menu") guideStore.closeMenu();
              else guideStore.openMenu();
            },
            onSettle: (p) => {
              guideStore.setPuckPos(p);
            },

            /* THE SLEEP RULE. The return deliberately does NOT call
             * `idle.notifyInput()`. That function means "the visitor did
             * something", and this is him moving on his own — crediting it as
             * input would let a robot left alone postpone his own 90s doze
             * forever, so he could never sleep once stranded. Instead the walk
             * runs inside the same `setBusy` bracket the drag and the trick use,
             * which suppresses ambient behaviours for its duration without
             * touching the sleep clock. The doze therefore keeps counting from
             * the visitor's last real input, and a return at 12s never defers
             * it. Nothing double-fires because `setBusy` is not a timer. */
            onReturnStart: () => {
              idle.setBusy(true);
              dock.dataset.returning = "true";
              gsap.to(built.pose, { walk: 1, duration: 0.25, ease: "none", overwrite: "auto" });
            },
            onReturnEnd: (arrived) => {
              idle.setBusy(false);
              delete dock.dataset.returning;
              gsap.to(built.pose, { walk: 0, duration: 0.3, ease: "none", overwrite: "auto" });
              if (!arrived) return;
              /* Home again, so the stored offset goes. Without this a reload
               * would put him straight back where he was stranded, which is the
               * exact state the walk just undid. */
              guideStore.setPuckPos({ x: 0, y: 0 });
            },
          });
          cleanups.push(drag.attach());
          cleanups.push(() => {
            clearReturnTimer();
            drag.cancelReturn();
          });
          drag.reclamp();

          /* He may already be away from home on mount, restored from storage —
           * that is the stranded case, and it must resolve itself without
           * needing a drag first. */
          armReturn();

          /* Opening the radial or a bubble is him being used, so a walk in
           * progress stops. Subscribing beats hooking each call site: `speak`
           * fires from Track B (hints, the radial's Explain) which by design
           * knows nothing about the scene. */
          cleanups.push(
            guideStore.subscribe(() => {
              const m = guideStore.mode;
              if (m === "menu" || m === "ask" || m === "talking") interrupt();
            })
          );

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
            // Reaching for him counts, so the walk stops and the clock resets.
            interrupt();
            idle.notifyInput();
            // Reaching for him is an interaction, so a hint he is still holding
            // retires (DESIGN-LOCK §5) — otherwise the puck reads as dead for
            // the six seconds a bubble happens to be up.
            if (guideStore.mode === "talking") guideStore.dismissBubble();
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
            // A window that got smaller must not leave him parked off-screen.
            drag.reclamp();
          };
          window.addEventListener("resize", onResize);
          cleanups.push(() => window.removeEventListener("resize", onResize));

          /* ---- ring states, on the pad's rim (DESIGN-LOCK §3) ---- */
          let lastRim = "";
          const syncRim = () => {
            const state = rimState(ringState(guideStore.mode));
            const key = `${groundRef.current}:${state}`;
            if (key === lastRim) return;
            lastRim = key;
            built.setRim(groundRef.current, state);
          };

          /* ---- the loop ---- */
          sampleGround();
          syncRim();

          if (reduced) {
            // Lock §7: reduced motion is a STATE — still rendered, just static.
            built.pose.sway = 0;
            built.render(0, 0);
            guideStore.setCrown(built.getCrown());
            // No ticker here, so the rim needs an explicit redraw on state change.
            cleanups.push(
              guideStore.subscribe(() => {
                syncRim();
                built.render(0, 0);
              })
            );
          } else {
            idle.start();

            let last = performance.now();
            let elapsed = 0;
            let sleepAcc = 0;
            let groundAcc = 0;

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

              /* Scroll used to drive a brace: tilt + head pitch scaled by scroll
               * velocity. Under continuous scrolling it re-fired every frame and
               * read as a shake, so it is gone (Russ, 2026-08-04). He is now
               * completely unaffected by the page moving under him — his life
               * comes from the idle scheduler, which is what makes it read as
               * his own behaviour rather than a reaction to your wheel. */
              groundAcc += dt;
              if (groundAcc >= GROUND_SAMPLE_INTERVAL) {
                groundAcc = 0;
                sampleGround();
              }

              syncRim();

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
            // Where he has been dragged to, in px from his home corner.
            (window as unknown as Record<string, unknown>).__guideOffset = () => drag.position();
            /* Fires the walk home now instead of after the 12s standby, so
             * verification can cover the arrival and the cancellation without
             * three separate 12-second waits. It drives the same `returnHome`
             * the timer does — the standby is what is skipped, not the
             * behaviour, so a test using this still proves the real path. */
            (window as unknown as Record<string, unknown>).__guideReturnNow = () => {
              drag.returnHome();
              return drag.isReturning();
            };
            // Pose readout for verification runs that need to prove a clip or a
            // turn actually happened rather than infer it from a screenshot.
            // Fields are copied one by one: GSAP hangs a circular `_gsap` record
            // off any object it has tweened, so a spread cannot be serialised.
            (window as unknown as Record<string, unknown>).__guidePose = () => {
              const p = built.pose;
              return {
                turn: p.turn,
                tilt: p.tilt,
                headTurn: p.headTurn,
                headPitch: p.headPitch,
                eye: p.eye,
                walk: p.walk,
                talk: p.talk,
                greet: p.greet,
                run: p.run,
                offsetX: p.offsetX,
                offsetY: p.offsetY,
                clips: built.clips,
              };
            };
            cleanups.push(() => {
              delete (window as unknown as Record<string, unknown>).__guideDebug;
              delete (window as unknown as Record<string, unknown>).__guideOffset;
              delete (window as unknown as Record<string, unknown>).__guideReturnNow;
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
