"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Smooth scroll synced to ScrollTrigger.
 * Disabled for prefers-reduced-motion; touch keeps Lenis off via syncTouch: false
 * so native touch scrolling stays the default feel.
 * Exposes `window.__lenis` for assistive jumpTo / screenshot tooling.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.2,
      // Keep finger-scroll native; Lenis still smooths wheel/trackpad.
      syncTouch: false,
    });

    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add("lenis");

    return () => {
      document.documentElement.classList.remove("lenis");
      gsap.ticker.remove(tick);
      if (window.__lenis === lenis) delete window.__lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
