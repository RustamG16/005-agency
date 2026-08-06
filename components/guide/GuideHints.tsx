"use client";

/**
 * The Guide — section hints.
 *
 * One ScrollTrigger per stop that has approved copy. Each fires once per
 * direction per session: coming down and coming back up are different moments
 * and each deserves one line, but neither should repeat every time you pass.
 *
 * The bubble retires after 6 seconds or on the first real interaction,
 * whichever comes first — a hint that outstays its welcome stops being help.
 *
 * Nothing fires while the guide is hidden over the hero: a bubble pointing at
 * an invisible robot is worse than no bubble. Hint 01 is the exception by
 * design — it is the arrival line, so it waits for him to actually arrive and
 * fires off the dock's own visibility flip rather than off a scroll position.
 *
 * FIXED 2026-08-04 — why the bubbles were silent. `speak()` gates on the dock's
 * `data-visible` flag, and that flag used to be written only from inside the
 * three.js render loop, which does not start until a 7 MB GLB has downloaded and
 * parsed. Every hint you scrolled past during that window was dropped on the
 * floor, and because these triggers fire once per direction, the same line never
 * came round again on the way down. Two changes: `GuideScene` now keeps the flag
 * current from first paint, and a suppressed line is HELD here rather than
 * discarded — he says it the moment he is actually on stage.
 */

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/components/motion/gsap";
import { guideStore, type GuideLine } from "./guide-state";
import { HOME_STOPS, resolveStop, stopLine, stopMidLine } from "./guide-content";

/** He waves once on the first visit of a session (spec §7). */
const WAVED_KEY = "convenium.guide.waved";

/** A beat is a chapter number plus which of its lines: "3" or "3m". */
type Beat = string;

const seenKey = (beat: Beat, dir: "down" | "up") => `convenium.guide.hint.${beat}.${dir}`;

function alreadySeen(beat: Beat, dir: "down" | "up") {
  try {
    return window.sessionStorage.getItem(seenKey(beat, dir)) === "1";
  } catch {
    // Private mode or storage disabled — fall back to showing it. A repeated
    // hint is a smaller failure than a hint that never appears.
    return false;
  }
}

function markSeen(beat: Beat, dir: "down" | "up") {
  try {
    window.sessionStorage.setItem(seenKey(beat, dir), "1");
  } catch {
    /* nothing to do — the cap just won't survive this session */
  }
}

export function GuideHints() {
  useGSAP(() => {
    const dock = document.querySelector<HTMLElement>("[data-guide-dock]");

    // The 6s auto-retire lives in the store now, so a line spoken from the
    // radial gets the same clock as one spoken by a scroll trigger. This module
    // only decides WHAT is said and WHEN.
    const retire = () => guideStore.dismissBubble();

    const guideVisible = () => dock?.dataset.visible === "true";

    /* The line he owes you but could not say yet, because he was still off
     * stage. Only ever one deep: if you scroll past two stops before he shows
     * up, the second is the one you are actually looking at. */
    let pending: { beat: Beat; dir: "down" | "up"; line: GuideLine } | null = null;

    const say = (beat: Beat, dir: "down" | "up", line: GuideLine) => {
      markSeen(beat, dir);
      guideStore.speak(line);
    };

    const speak = (beat: Beat, dir: "down" | "up", line: GuideLine) => {
      if (alreadySeen(beat, dir)) return;
      if (!guideVisible()) {
        pending = { beat, dir, line };
        return;
      }
      say(beat, dir, line);
    };

    const flushPending = () => {
      if (!pending || !guideVisible()) return;
      const held = pending;
      pending = null;
      if (!alreadySeen(held.beat, held.dir)) say(held.beat, held.dir, held.line);
    };

    const triggers: ScrollTrigger[] = [];

    HOME_STOPS.forEach((stop, index) => {
      const el = resolveStop(stop);
      if (!el) return;
      const line = stopLine(stop);
      const mid = stopMidLine(stop);

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          // Behind both pins, so these measure against settled positions.
          refreshPriority: -20,
          // Where the reader is, for the radial's "Explain this section".
          onEnter: () => {
            guideStore.setChapter(index);
            if (line && stop.n !== null) speak(String(stop.n), "down", line);
          },
          onEnterBack: () => {
            guideStore.setChapter(index);
            if (line && stop.n !== null) speak(String(stop.n), "up", line);
          },
        })
      );

      /* A second beat, two thirds of the way through the long sections. The
       * arrival line lands as you enter; this one lands once you have actually
       * been reading for a while, which is where the page felt silent. */
      if (mid && stop.n !== null) {
        const beat = `${stop.n}m`;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "65% 60%",
            end: "bottom 40%",
            refreshPriority: -20,
            onEnter: () => speak(beat, "down", mid),
            onEnterBack: () => speak(beat, "up", mid),
          })
        );
      }
    });

    /* Hint 01 rides the arrival, not a scroll position — it IS the welcome
     * beat: the first thing he says, once per session, the moment he appears.
     * The wave that goes with it is spec §7's "one wave on first visit".
     *
     * The observer stays connected for the life of the page rather than
     * disconnecting after the first hit, because it is also what releases a
     * held line when he finally shows up. */
    let arrivalObserver: MutationObserver | null = null;
    const arrival = HOME_STOPS[0];
    const arrivalLine = stopLine(arrival);

    const wave = () => {
      try {
        if (window.sessionStorage.getItem(WAVED_KEY) === "1") return;
        window.sessionStorage.setItem(WAVED_KEY, "1");
      } catch {
        /* storage blocked — he waves every load rather than never */
      }
      guideStore.playClip("greet");
    };

    const onArrival = () => {
      if (!guideVisible()) return;
      if (arrivalLine && arrival.n !== null && !alreadySeen(String(arrival.n), "down")) {
        say(String(arrival.n), "down", arrivalLine);
        wave();
        return;
      }
      flushPending();
    };

    if (dock) {
      arrivalObserver = new MutationObserver(onArrival);
      arrivalObserver.observe(dock, { attributes: true, attributeFilter: ["data-visible"] });
      onArrival();
    }

    /* Any deliberate input retires the bubble early. Scroll does not count —
     * scrolling is how you got the hint in the first place. */
    const onInteract = () => {
      if (guideStore.getSnapshot().line) retire();
    };
    window.addEventListener("pointerdown", onInteract);
    window.addEventListener("keydown", onInteract);

    return () => {
      arrivalObserver?.disconnect();
      triggers.forEach((t) => t.kill());
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, []);

  return null;
}
