/**
 * The Guide — idle life.
 *
 * "Always doing something": one weighted micro-behavior every 6–14s, plus two
 * continuous reactions (cursor glance, scroll brace) and a 90s sleep.
 *
 * The rig ships Greet / Run / Talk / Walking and NO idle or fidget clip, so the
 * small ambient beats here are procedural — head yaw/pitch on `Head_05`, group
 * sway, and an emissive dip for the blink.
 *
 * FIXED 2026-08-04. The scheduler used to be procedural and nothing else, and
 * nothing anywhere in the app called `playClip("greet")` — so the wave the model
 * ships had literally never played and he read as inert. The pool now draws from
 * the rig's own clips as well, and a counter guarantees a wave every 3–5 ticks
 * however the weighted draw falls, so you never go long without seeing him do
 * something unmistakably alive.
 *
 * Everything in this module is inert under `prefers-reduced-motion`.
 */

import type { gsap as GsapType } from "gsap";
import { EYE_BASE, EYE_SLEEP, type GuidePose } from "./guide-robot";
import type { GuideClipName } from "./guide-state";

/** No input for this long and he nods off. */
const SLEEP_AFTER_MS = 90_000;

/** Pointer inside this radius of the puck centre and he looks at it. */
const GLANCE_RADIUS = 160;

const LOOK_YAW = 0.28;
const GLANCE_YAW_MAX = 0.4;

/** A wave is forced if the draw has not produced one within this many ticks. */
const WAVE_EVERY_MIN = 3;
const WAVE_EVERY_MAX = 5;

export type IdleScheduler = {
  start(): void;
  stop(): void;
  /** Any input — resets the sleep timer and wakes him. */
  notifyInput(): void;
  notifyPointer(x: number, y: number): void;
  setBusy(busy: boolean): void;
  isAsleep(): boolean;
  destroy(): void;
};

type Options = {
  pose: GuidePose;
  gsap: typeof GsapType;
  /** Puck centre in viewport px, or null when the scene isn't mounted. */
  getPuckCentre(): { x: number; y: number } | null;
  onSleepChange(asleep: boolean): void;
  /** Plays one of the rig's clips. The scene owns weights and release. */
  playClip(name: GuideClipName): void;
  reduced: boolean;
};

export function createIdleScheduler(opts: Options): IdleScheduler {
  const { pose, gsap, getPuckCentre, onSleepChange, playClip, reduced } = opts;

  /* Reusable random generators rather than Math.random arithmetic. */
  /* 4–9s, tightened from the spec's 6–14s. At the slower cadence he could stand
   * still for a quarter of a minute at a time, which is what read as lifeless —
   * and with the scroll brace gone, the scheduler is now the only thing moving
   * him. */
  const nextDelay = gsap.utils.random(4, 9, true) as unknown as () => number;
  const nextWaveGap = gsap.utils.random(
    WAVE_EVERY_MIN,
    WAVE_EVERY_MAX,
    true
  ) as unknown as () => number;
  const clampGlance = gsap.utils.clamp(-GLANCE_YAW_MAX, GLANCE_YAW_MAX);

  let running = false;
  let asleep = false;
  let busy = false; // dragging / menu / ask — scheduler stands down
  let cursorActive = false;
  let timer: number | null = null;
  let sleepTimer: number | null = null;

  /* One paused timeline per behavior, restarted rather than rebuilt. */
  const lookTl = gsap.timeline({ paused: true });
  const blinkTl = gsap.timeline({ paused: true });
  const fidgetTl = gsap.timeline({ paused: true });
  const stretchTl = gsap.timeline({ paused: true });

  blinkTl
    .to(pose, { eye: 0.15, duration: 0.06, ease: "power2.in" })
    .to(pose, { eye: () => (asleep ? EYE_SLEEP : EYE_BASE), duration: 0.07, ease: "power2.out" });

  fidgetTl
    .to(pose, { turn: "+=0.12", duration: 0.5, ease: "power2.inOut" })
    .to(pose, { turn: "-=0.12", duration: 0.7, ease: "power2.inOut" })
    .to(pose, { headPitch: 0.06, duration: 0.4, ease: "power2.out" }, 0)
    .to(pose, { headPitch: 0, duration: 0.5, ease: "power2.inOut" }, 0.5);

  stretchTl
    .to(pose, { bob: 0.018, headPitch: -0.14, duration: 0.7, ease: "power2.out" })
    .to(pose, { bob: 0, headPitch: 0, duration: 0.9, ease: "power2.inOut" });

  /** Head yaw is written continuously while the cursor is near, so it gets a
   *  single reused tween instead of one per pointermove. */
  const yawTo = gsap.quickTo(pose, "headTurn", { duration: 0.5, ease: "power3.out" });

  const look = (dir: -1 | 1) => {
    lookTl.clear();
    lookTl
      .to(pose, { headTurn: LOOK_YAW * dir, duration: 0.42, ease: "power2.out" })
      .to(pose, { headTurn: 0, duration: 0.5, ease: "power2.inOut" }, ">0.9");
    lookTl.restart();
  };

  type Behavior = { run: () => void; weight: number; needsHead: boolean; isWave?: boolean };

  const wave = () => playClip("greet");

  const behaviors: Behavior[] = [
    { run: () => look(-1), weight: 3, needsHead: true },
    { run: () => look(1), weight: 3, needsHead: true },
    { run: () => blinkTl.restart(), weight: 5, needsHead: false },
    { run: () => fidgetTl.restart(), weight: 2, needsHead: true },
    { run: () => stretchTl.restart(), weight: 1, needsHead: true },
    // The rig's own clips. Greet is the wave; Run is a short burst on the spot,
    // rare enough that it stays a surprise rather than a tic.
    { run: wave, weight: 3, needsHead: false, isWave: true },
    { run: () => playClip("run"), weight: 1, needsHead: false },
  ];

  /* Expand the weights once into a flat pool so picking is a single
   * random-from-array rather than a cumulative-sum walk every tick. */
  const pool: Behavior[] = behaviors.flatMap((b) => Array<Behavior>(b.weight).fill(b));
  const pickBehavior = gsap.utils.random(pool, true) as unknown as () => Behavior;
  const waveBehavior = behaviors.find((b) => b.isWave)!;

  const clearTimer = () => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  const schedule = () => {
    clearTimer();
    if (!running || reduced) return;
    timer = window.setTimeout(tick, nextDelay() * 1000);
  };

  /* Ticks since he last waved, and the gap at which one is owed. Without this
   * the wave is just one weight among seven and you can watch him for two
   * minutes without seeing the one behaviour that reads as a greeting. */
  let sinceWave = 0;
  let waveDue = nextWaveGap();

  const tick = () => {
    timer = null;
    if (!running || reduced) return;
    if (!busy && !asleep) {
      const behavior = sinceWave >= waveDue ? waveBehavior : pickBehavior();
      // While the cursor owns the head, skip anything that would fight it.
      const skipped = cursorActive && behavior.needsHead;
      if (!skipped) behavior.run();

      // The counter tracks TICKS, not successful draws. Counting only the acts
      // that ran means leaving the cursor parked near him — the most likely
      // thing a reader does — starves the wave indefinitely.
      if (behavior.isWave && !skipped) {
        sinceWave = 0;
        waveDue = nextWaveGap();
      } else {
        sinceWave += 1;
      }
    }
    schedule();
  };

  /* ---- sleep ---- */

  const clearSleepTimer = () => {
    if (sleepTimer !== null) {
      window.clearTimeout(sleepTimer);
      sleepTimer = null;
    }
  };

  const fallAsleep = () => {
    if (asleep || reduced || !running) return;
    asleep = true;
    lookTl.pause();
    fidgetTl.pause();
    stretchTl.pause();
    gsap.to(pose, {
      eye: EYE_SLEEP,
      headTurn: 0,
      headPitch: 0.08,
      sway: 0.35,
      duration: 1.2,
      ease: "power2.inOut",
    });
    onSleepChange(true);
  };

  const armSleep = () => {
    clearSleepTimer();
    if (reduced || !running) return;
    sleepTimer = window.setTimeout(fallAsleep, SLEEP_AFTER_MS);
  };

  const wake = () => {
    if (!asleep) return;
    asleep = false;
    gsap.to(pose, {
      eye: EYE_BASE,
      headPitch: 0,
      sway: 1,
      duration: 0.45,
      ease: "power2.out",
    });
    onSleepChange(false);
  };

  /* ---- public ---- */

  return {
    start() {
      if (running || reduced) return;
      running = true;
      schedule();
      armSleep();
    },

    stop() {
      running = false;
      clearTimer();
      clearSleepTimer();
    },

    notifyInput() {
      wake();
      armSleep();
    },

    notifyPointer(x, y) {
      if (reduced || busy) return;
      const centre = getPuckCentre();
      if (!centre) return;
      const dx = x - centre.x;
      const dy = y - centre.y;
      const near = Math.hypot(dx, dy) <= GLANCE_RADIUS;
      if (near) {
        if (!cursorActive) {
          cursorActive = true;
          lookTl.pause();
        }
        // Screen-x maps to head yaw; the sign is flipped because he faces us.
        yawTo(clampGlance((dx / GLANCE_RADIUS) * GLANCE_YAW_MAX * -1));
      } else if (cursorActive) {
        cursorActive = false;
        yawTo(0);
      }
    },

    setBusy(next) {
      busy = next;
      if (next) {
        lookTl.pause();
        fidgetTl.pause();
        stretchTl.pause();
        cursorActive = false;
      }
    },

    isAsleep: () => asleep,

    destroy() {
      running = false;
      clearTimer();
      clearSleepTimer();
      lookTl.kill();
      blinkTl.kill();
      fidgetTl.kill();
      stretchTl.kill();
      gsap.killTweensOf(pose);
    },
  };
}
