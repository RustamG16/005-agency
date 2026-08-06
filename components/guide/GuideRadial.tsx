"use client";

/**
 * The Guide — radial menu (DESIGN-LOCK §4).
 *
 * 44px petals on a 148px radius, fanned across the locked 176°→276° arc in
 * screen convention (180 = left, 270 = up), with an always-visible
 * right-aligned label index outside the fan. Every number here is read off the
 * lock; none of it is re-decided.
 *
 * AMENDMENT 12 (2026-08-04, Russ). The four section-jump petals are REMOVED.
 * The ring is three things you can ask of him, not a table of contents the nav
 * already carries: Explain this section · Do a trick · Ask a question. They are
 * spaced evenly across the same arc — step 50°, chord 2·148·sin25° = 125px
 * against a 44px petal, so the fan is airier than the six ever were. `HOME_STOPS`
 * stays as the source for hints and for Explain; it just no longer feeds petals.
 *
 * Under reduced motion the trick petal is omitted rather than shown dead, and
 * the remaining two re-space across the same arc.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { guideStore, useGuide } from "./guide-state";
import { HOME_STOPS, stopExplain } from "./guide-content";
import styles from "./GuideRadial.module.css";

/** Has Cursor's Ask panel mounted yet? `GuideDock` renders it into the dock. */
const hasAskPanel = () => Boolean(document.querySelector("[data-guide-ask]"));

/* ---- locked geometry (§4) ---------------------------------------------- */
const RADIUS = 148;
const PETAL = 44;
const ARC_START = 176;
const ARC_END = 276;
/** Distance from the dock's right edge to the label index's right edge. */
const INDEX_RIGHT = RADIUS + PETAL / 2 + 34 + 180 / 2;

type PetalKind = "explain" | "trick" | "ask";

type Petal = {
  key: string;
  kind: PetalKind;
  mark: string;
  label: string;
};

export function GuideRadial() {
  const { mode, chapter } = useGuide();
  const pathname = usePathname();
  /* Homepage only for now — the stop list below is the homepage's. PROMPT-B
   * replaces this guard with the per-route config. */
  const enabled = pathname === "/";
  const open = enabled && mode === "menu";

  const rootRef = useRef<HTMLDivElement>(null);
  const [ground, setGround] = useState<"cotton" | "noir">("cotton");
  const [hovered, setHovered] = useState<string | null>(null);

  /* At and below 520px the lock drops the ring and the index alone becomes the
   * menu. Which half is interactive has to follow, or the compact layout would
   * leave every control keyboard-unreachable. */
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 520px)");
    setCompact(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCompact(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Reduced motion is read once here rather than passed down: it decides
   * whether the trick exists at all, and a control that does nothing is worse
   * than a control that is not there. */
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Ordered lowest petal first, so 01 pairs with the bottom of the fan (lock
   * §4). Only Ask breaks the numbering — the lock gives it a glyph and a paper
   * fill because it is the one that opens a panel rather than acting in place. */
  const petals = useMemo<Petal[]>(() => {
    const list: Petal[] = [{ key: "explain", kind: "explain", mark: "01", label: "Explain this section" }];
    if (!reduced) list.push({ key: "trick", kind: "trick", mark: "02", label: "Do a trick" });
    list.push({ key: "ask", kind: "ask", mark: "?", label: "Ask a question" });
    return list;
  }, [reduced]);

  const step = petals.length > 1 ? (ARC_END - ARC_START) / (petals.length - 1) : 0;

  /* The scene already decides which ground the stage sits over and publishes it
   * on the puck. Reusing that keeps one source of truth for both. */
  useEffect(() => {
    const root = rootRef.current;
    const puck = root?.parentElement?.querySelector<HTMLElement>("button[data-ground]");
    if (!puck) return;

    const read = () =>
      setGround(puck.dataset.ground === "noir" ? "noir" : "cotton");
    read();

    const mo = new MutationObserver(read);
    mo.observe(puck, { attributes: true, attributeFilter: ["data-ground"] });
    return () => mo.disconnect();
  }, []);

  const close = useCallback((restoreFocus: boolean) => {
    guideStore.closeMenu();
    if (restoreFocus) {
      const puck = rootRef.current?.parentElement?.querySelector<HTMLElement>("button[data-ground]");
      puck?.focus();
    }
  }, []);

  /* Escape closes and hands focus back; a click anywhere else closes without
   * stealing it. */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close(true);
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      const dock = root?.parentElement;
      if (dock && e.target instanceof Node && dock.contains(e.target)) return;
      close(false);
    };

    window.addEventListener("keydown", onKey);
    // Capture, so the close beats any handler that would swallow the event.
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open, close]);

  /* Focus lands on the first petal so the ring is usable from the keyboard the
   * moment it opens. */
  useEffect(() => {
    if (!open) return;
    const selector = compact ? `.${styles.indexButton}` : `.${styles.petal}`;
    rootRef.current?.querySelector<HTMLElement>(selector)?.focus();
  }, [open, compact]);

  const activate = useCallback(
    (petal: Petal) => {
      if (petal.kind === "trick") {
        // The scene owns the cooldown; a refused trick just closes the ring
        // rather than reporting a failure nobody asked about.
        close(false);
        guideStore.playTrick();
        return;
      }

      if (petal.kind === "explain") {
        // The section the reader is actually in, and its explanation rather
        // than its one-line arrival hint — replaying the hint is what made this
        // read as explaining nothing. Falls back up the page if a stop somehow
        // has no copy at all.
        const index = chapter >= 0 ? chapter : 0;
        for (let i = index; i >= 0; i -= 1) {
          const line = stopExplain(HOME_STOPS[i]);
          if (line) {
            close(false);
            guideStore.speak(line);
            return;
          }
        }
        close(false);
        return;
      }

      /* Ask: the panel is PROMPT-B's (`GuideAsk.tsx`) and has not landed. Until
       * it does he SAYS so rather than opening a mode with no UI, which is what
       * made the petal look broken. `openAsk()` is still called so the day the
       * panel mounts this becomes a no-op path. */
      close(false);
      if (hasAskPanel()) {
        guideStore.openAsk();
      } else {
        guideStore.speak({
          eyebrow: "GUIDE — ASK",
          text: "Ask isn't wired up yet. Until it is, try Explain this section.",
        });
      }
    },
    [chapter, close]
  );

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-open={open}
      data-ground={ground}
      role="menu"
      aria-label="Guide menu"
      aria-hidden={!open}
    >
      {petals.map((petal, i) => {
        const angle = ARC_START + i * step;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * RADIUS;
        const y = Math.sin(rad) * RADIUS;

        return (
          <button
            key={petal.key}
            type="button"
            role="menuitem"
            tabIndex={open && !compact ? 0 : -1}
            aria-hidden={compact}
            className={styles.petal}
            data-kind={petal.kind}
            data-lit={hovered === petal.key}
            style={
              {
                "--x": `${x.toFixed(1)}px`,
                "--y": `${y.toFixed(1)}px`,
                "--i": i,
              } as React.CSSProperties
            }
            onPointerEnter={() => setHovered(petal.key)}
            onPointerLeave={() => setHovered((h) => (h === petal.key ? null : h))}
            onFocus={() => setHovered(petal.key)}
            onBlur={() => setHovered((h) => (h === petal.key ? null : h))}
            onClick={() => activate(petal)}
          >
            <span className={styles.mark} aria-hidden="true">
              {petal.mark}
            </span>
            <span className="visually-hidden">{petal.label}</span>
          </button>
        );
      })}

      {/* Label index — always visible while the ring is open, right-aligned
          outside the fan, ordered so 01 pairs with the lowest petal. */}
      <ul className={styles.index} style={{ "--index-right": `${INDEX_RIGHT}px` } as React.CSSProperties}>
        {[...petals].reverse().map((petal, i) => (
          <li
            key={petal.key}
            className={styles.indexRow}
            data-kind={petal.kind}
            data-lit={hovered === petal.key}
            style={{ "--i": i } as React.CSSProperties}
          >
            <button
              type="button"
              role={compact ? "menuitem" : undefined}
              tabIndex={open && compact ? 0 : -1}
              aria-hidden={!compact}
              className={styles.indexButton}
              onPointerEnter={() => setHovered(petal.key)}
              onPointerLeave={() => setHovered((h) => (h === petal.key ? null : h))}
              onClick={() => activate(petal)}
            >
              <span className={styles.indexMark}>{petal.mark}</span>
              <span className={styles.indexLabel}>{petal.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
