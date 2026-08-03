"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

/**
 * Chapter copy reveal — masked SplitText lines for the headline, opacity + 24px
 * for body text, once. Reduced motion collapses both to opacity only (spec §3).
 */
export function useChapterReveal(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = scope.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const body = gsap.utils.toArray<HTMLElement>("[data-chapter-body]");

      if (reduced) {
        gsap.from("[data-chapter-head], [data-chapter-body]", {
          autoAlpha: 0,
          duration: 0.32,
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        });
        return;
      }

      const heads = gsap.utils.toArray<HTMLElement>("[data-chapter-head]");
      heads.forEach((head) => {
        SplitText.create(head, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "chapterLine",
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 100,
              duration: 0.42, // --duration-manifesto
              ease: "expo.out", // --ease-out-sharp
              stagger: 0.06,
              scrollTrigger: { trigger: head, start: "top 82%", once: true },
            });
          },
        });
      });

      if (body.length) {
        gsap.from(body, {
          autoAlpha: 0,
          y: 24,
          duration: 0.42,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 72%", once: true },
        });
      }
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [scope]);
}
