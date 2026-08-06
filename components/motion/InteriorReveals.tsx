"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { MOTION, MQ } from "@/components/motion/motion";

type RevealKind = "line" | "block" | "media";

/**
 * The page-wide entrance driver. Anything carrying `data-interior-reveal` gets
 * an intentional arrival — masked line, block lift, or media wipe — on the one
 * vocabulary in `motion.ts`.
 *
 * Three contexts, because an entrance that reads as considered on a 1440px
 * screen reads as sluggish on a phone, and as an obstacle to someone who asked
 * for less motion:
 *   desktop — full travel
 *   mobile  — same curve, shorter throw (previously mobile got nothing at all)
 *   reduced — no tween; elements are simply present
 */
export function InteriorReveals() {
  useGSAP(() => {
    const media = gsap.matchMedia();

    const build = (distance: number, duration: number) => () => {
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>("#main [data-interior-reveal]")
      );

      const tweens = targets.map((target, index) => {
        delete target.dataset.revealComplete;
        const kind = target.dataset.interiorReveal as RevealKind;
        const animated =
          kind === "line"
            ? target.querySelector<HTMLElement>("[data-interior-reveal-inner]")
            : target;
        if (!animated) return null;

        if (kind === "line") {
          gsap.set(animated, { autoAlpha: 0, yPercent: MOTION.yPercentLine });
        } else {
          gsap.set(animated, { autoAlpha: 0, y: distance });
        }

        return gsap.to(animated, {
          autoAlpha: 1,
          y: 0,
          yPercent: 0,
          duration: kind === "media" ? MOTION.media : duration,
          ease: MOTION.ease,
          immediateRender: false,
          onComplete: () => {
            target.dataset.revealComplete = "true";
            gsap.set(animated, { clearProps: "opacity,transform,visibility" });
          },
          scrollTrigger: {
            trigger: target,
            id: `interior-reveal-${index}`,
            start: MOTION.start,
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
    };

    media.add(MQ.desktopMotion, build(MOTION.yBlock, MOTION.enter));
    media.add(MQ.mobileMotion, build(MOTION.yBlockMobile, MOTION.enter * 0.8));

    // Reduced motion: nothing is tweened, so nothing needs setting up — the
    // markup already renders visible. Registering the context anyway keeps the
    // three states explicit rather than implied by omission.
    media.add(MQ.reduced, () => undefined);

    return () => media.revert();
  }, []);

  return null;
}
