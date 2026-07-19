"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Cursor.module.css";

/**
 * Interior custom cursor. Native cursor is never removed (a11y fallback).
 * Hidden on touch devices and prefers-reduced-motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<"default" | "link" | "view">("default");
  const [visible, setVisible] = useState(false);
  const enabledRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    enabledRef.current = true;
    const dot = dotRef.current;
    if (!dot) return;

    let x = 0;
    let y = 0;
    let raf = 0;

    const render = () => {
      if (dot) {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);

      const target = (e.target as Element | null)?.closest?.(
        "a, button, [data-cursor], input, textarea, select, label"
      ) as HTMLElement | null;

      if (!target) {
        setMode("default");
        setLabel("");
        return;
      }

      const cursorAttr = target.getAttribute("data-cursor");
      if (cursorAttr === "view") {
        setMode("view");
        setLabel(target.getAttribute("data-cursor-label") || "View");
        return;
      }

      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.getAttribute("role") === "button"
      ) {
        setMode("link");
        setLabel("");
        return;
      }

      setMode("default");
      setLabel("");
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      enabledRef.current = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className={styles.cursor}
      data-mode={mode}
      data-visible={visible}
      aria-hidden="true"
    >
      <span className={styles.disc}>
        {mode === "view" && <span className={styles.label}>{label}</span>}
      </span>
    </div>
  );
}
