"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";

type RevealKind = "line" | "block" | "media";

export function HomepageReveals() {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>("#main [data-home-reveal]")
      );

      const tweens = targets.map((target, index) => {
        delete target.dataset.revealComplete;
        const kind = target.dataset.homeReveal as RevealKind;
        const animated =
          kind === "line"
            ? target.querySelector<HTMLElement>("[data-home-reveal-inner]")
            : target;
        if (!animated) return null;

        if (kind === "line") {
          gsap.set(animated, { autoAlpha: 0, yPercent: 110 });
        } else {
          gsap.set(animated, { autoAlpha: 0, y: 24 });
        }

        return gsap.to(animated, {
          autoAlpha: 1,
          y: 0,
          yPercent: 0,
          duration: kind === "media" ? 0.75 : 0.6,
          ease: "power4.out",
          immediateRender: false,
          onComplete: () => {
            target.dataset.revealComplete = "true";
            gsap.set(animated, { clearProps: "opacity,transform,visibility" });
          },
          scrollTrigger: {
            trigger: target,
            id: `home-reveal-${index}`,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
            refreshPriority: -10,
          },
        });
      });

      const refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });

      return () => {
        cancelAnimationFrame(refreshFrame);
        tweens.forEach((tween) => {
          tween?.scrollTrigger?.kill();
          tween?.kill();
        });
        targets.forEach((target) => delete target.dataset.revealComplete);
      };
    });

    return () => media.revert();
  }, []);

  return null;
}
