"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/components/motion/gsap";
import styles from "./PageEnter.module.css";

/** Short enter-only choreography for App Router template remounts. */
export function PageEnter({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.dataset.ready = "true";
      return;
    }

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 18, clipPath: "inset(4% 0 0 0)" },
      {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0% 0 0 0)",
        duration: 0.45,
        ease: "power3.out",
        onComplete: () => {
          el.dataset.ready = "true";
          gsap.set(el, { clearProps: "clipPath,transform,opacity,visibility" });
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div ref={ref} className={styles.enter}>
      {children}
    </div>
  );
}
