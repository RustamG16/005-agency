"use client";

/* The Guide — shared state.
 *
 * This file is the ONLY coupling surface between Track A (scene, idle life,
 * drag, bubble shell) and Track B (radial menu, Ask panel, per-route content,
 * section hints). Track B consumes `GuideState` and the `useGuide()` hook and
 * should not reach into the scene modules directly.
 *
 * One shape note, deliberate: `crownScreen` updates every animation frame, so
 * it is NOT part of the snapshot React subscribes to — a 60fps snapshot would
 * re-render every consumer sixty times a second. It lives as a live property on
 * the store plus a `subscribeCrown()` channel, and the bubble positions itself
 * imperatively from it (DESIGN-LOCK §5: bubble position is written directly and
 * never transitioned, so it cannot lag the head mid-drag).
 */

import { useSyncExternalStore } from "react";

export type GuideMode =
  | "idle"
  | "hover"
  | "menu"
  | "dragging"
  | "armed"
  | "talking"
  | "ask"
  | "sleep";

/** Offset from the dock's CSS home corner, in px. Set by dragging. */
export type GuidePoint = { x: number; y: number };

export type GuidePuckPos = GuidePoint;

export type GuideLine = { eyebrow: string; text: string };

export type GuideCrown = { x: number; y: number };

/** The interface Track B codes against. */
export interface GuideState {
  mode: GuideMode;
  puckPos: GuidePuckPos; // persisted
  crownScreen: GuideCrown | null; // Head_05 + crown offset, per frame
  chapter: number; // 0..n on home, -1 elsewhere
  openMenu(): void;
  closeMenu(): void;
  openAsk(): void;
  closeAsk(): void;
  speak(line: GuideLine): void;
  dismissBubble(): void;
  setEyeStep(on: boolean): void; // 1.35 <-> 1.9
}

/** The slice React re-renders on. Excludes `crownScreen` on purpose. */
export type GuideSnapshot = {
  mode: GuideMode;
  puckPos: GuidePuckPos;
  chapter: number;
  line: GuideLine | null;
  eyeStep: boolean;
};

export const GUIDE_STORAGE_KEY = "convenium.guide.puck";

/** Where the puck sits before anyone has dragged it: at its CSS home. */
export const DEFAULT_PUCK_POS: GuidePuckPos = { x: 0, y: 0 };

/* ---- internals --------------------------------------------------------- */

type Listener = () => void;
type CrownListener = (crown: GuideCrown | null) => void;

/** Imperative hooks the scene registers so state changes reach three.js. */
export type GuideSceneBridge = {
  setEyeStep?(on: boolean): void;
  playClip?(name: GuideClipName): void;
  /** The whole trick — clip, turn, eye step, cooldown. Owned by the scene. */
  playTrick?(): boolean;
  /** Talk clip + turn to face the reader, held until the bubble retires. */
  setTalking?(on: boolean): void;
  wake?(): void;
};

export type GuideClipName = "greet" | "talk" | "walk" | "run";

const listeners = new Set<Listener>();
const crownListeners = new Set<CrownListener>();
let bridge: GuideSceneBridge = {};

let crown: GuideCrown | null = null;

let snapshot: GuideSnapshot = {
  mode: "idle",
  puckPos: DEFAULT_PUCK_POS,
  chapter: -1,
  line: null,
  eyeStep: false,
};

/* useSyncExternalStore compares snapshots by reference, so every mutation
 * produces a new frozen object and anything that did not change keeps its
 * identity. */
function commit(patch: Partial<GuideSnapshot>) {
  let changed = false;
  for (const key of Object.keys(patch) as (keyof GuideSnapshot)[]) {
    if (!Object.is(snapshot[key], patch[key])) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  snapshot = Object.freeze({ ...snapshot, ...patch });
  for (const l of listeners) l();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

/* Auto-retire (spec §6). It lives HERE rather than in `GuideHints` because the
 * radial speaks too — "Explain this section" and the Ask fallback both went up
 * and stayed up forever, since the only 6s timer on the page belonged to the
 * scroll hints. One bubble, one clock, whoever opened it. */
export const BUBBLE_MS = 6000;

let bubbleTimer: ReturnType<typeof setTimeout> | null = null;

function clearBubbleTimer() {
  if (bubbleTimer === null) return;
  clearTimeout(bubbleTimer);
  bubbleTimer = null;
}

/** Opening the ring or the Ask panel retires the bubble (DESIGN-LOCK §6). */
function retireBubble() {
  clearBubbleTimer();
  if (!snapshot.line) return;
  commit({ line: null });
  bridge.setTalking?.(false);
}

export const guideStore = {
  subscribe,
  getSnapshot,

  /** Live, frame-rate value — read it, do not subscribe React to it. */
  get crownScreen() {
    return crown;
  },

  subscribeCrown(listener: CrownListener) {
    crownListeners.add(listener);
    return () => {
      crownListeners.delete(listener);
    };
  },

  setCrown(next: GuideCrown | null) {
    const same =
      (next === null && crown === null) ||
      (next !== null && crown !== null && next.x === crown.x && next.y === crown.y);
    if (same) return;
    crown = next;
    for (const l of crownListeners) l(crown);
  },

  /* ---- mode ---- */
  get mode() {
    return snapshot.mode;
  },

  setMode(mode: GuideMode) {
    commit({ mode });
  },

  openMenu() {
    retireBubble();
    commit({ mode: "menu" });
  },

  closeMenu() {
    if (snapshot.mode === "menu") commit({ mode: "idle" });
  },

  openAsk() {
    retireBubble();
    commit({ mode: "ask" });
  },

  closeAsk() {
    if (snapshot.mode === "ask") commit({ mode: "idle" });
  },

  /* ---- bubble ---- */
  speak(line: GuideLine) {
    const talkable =
      snapshot.mode === "idle" || snapshot.mode === "hover" || snapshot.mode === "sleep";
    commit({ line, mode: talkable ? "talking" : snapshot.mode });
    bridge.wake?.();
    // Held for as long as the bubble is up, and he turns to face the reader
    // while he is saying it — a fixed-length clip stopped talking a third of
    // the way through the line.
    bridge.setTalking?.(true);

    clearBubbleTimer();
    if (typeof window !== "undefined") {
      bubbleTimer = setTimeout(() => {
        bubbleTimer = null;
        guideStore.dismissBubble();
      }, BUBBLE_MS);
    }
  },

  dismissBubble() {
    clearBubbleTimer();
    commit({ line: null, mode: snapshot.mode === "talking" ? "idle" : snapshot.mode });
    bridge.setTalking?.(false);
  },

  /* ---- eye ---- */
  setEyeStep(on: boolean) {
    commit({ eyeStep: on });
    bridge.setEyeStep?.(on);
  },

  /* ---- puck position ---- */
  get puckPos() {
    return snapshot.puckPos;
  },

  setPuckPos(puckPos: GuidePuckPos, persist = true) {
    commit({ puckPos });
    if (persist) savePuckPos(puckPos);
  },

  setChapter(chapter: number) {
    commit({ chapter });
  },

  /** Track B: play a rig clip without importing the scene. */
  playClip(name: GuideClipName) {
    bridge.playClip?.(name);
  },

  /** Returns false when the trick is on cooldown or the scene is not up yet. */
  playTrick() {
    return bridge.playTrick?.() ?? false;
  },

  /** Track A only — the scene registers itself here on mount. */
  connectScene(next: GuideSceneBridge) {
    bridge = next;
    return () => {
      if (bridge === next) bridge = {};
    };
  },
};

/* ---- persistence ------------------------------------------------------- */

export function loadPuckPos(): GuidePuckPos {
  if (typeof window === "undefined") return DEFAULT_PUCK_POS;
  try {
    const raw = window.localStorage.getItem(GUIDE_STORAGE_KEY);
    if (!raw) return DEFAULT_PUCK_POS;
    const parsed = JSON.parse(raw) as Partial<GuidePuckPos>;
    if (
      typeof parsed.x === "number" &&
      typeof parsed.y === "number" &&
      Number.isFinite(parsed.x) &&
      Number.isFinite(parsed.y)
    ) {
      // Not clamped here — the viewport may have changed since it was written,
      // so the drag controller re-clamps against the live one on mount.
      return { x: parsed.x, y: parsed.y };
    }
  } catch {
    /* private mode, disabled storage, or hand-edited junk — fall through */
  }
  return DEFAULT_PUCK_POS;
}

export function savePuckPos(pos: GuidePuckPos) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(pos));
  } catch {
    /* storage full or blocked — position just won't survive reload */
  }
}

/* ---- React ------------------------------------------------------------- */

export function useGuide(): GuideSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
