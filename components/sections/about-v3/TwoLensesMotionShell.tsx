"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";

gsap.registerPlugin(useGSAP);

export function TwoLensesMotionShell({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const media = gsap.matchMedia();
      media.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = context.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
          const animated = "[data-hero-line], [data-hero-stage], [data-hero-copy], [data-about-arrival] [data-reveal-media], [data-dossier-reveal]";

          if (conditions.reduce) {
            gsap.set(animated, { clearProps: "all" });
            return;
          }

          const hero = gsap.timeline({ defaults: { ease: "power4.out", overwrite: "auto" } });
          hero
            .from("[data-hero-line]", { y: -10, autoAlpha: 0, duration: 0.45 })
            .from("[data-hero-stage]", { scale: 1.025, autoAlpha: 0, duration: 0.9 }, 0.05)
            .from("[data-hero-copy] h1", { yPercent: 9, autoAlpha: 0, duration: 0.72 }, 0.3)
            .from("[data-hero-copy] > div", { y: 14, autoAlpha: 0, duration: 0.5 }, 0.46);

          if (conditions.desktop) {
            gsap.to("[data-hero-stage]", {
              yPercent: 7,
              ease: "none",
              scrollTrigger: {
                id: "about-v3-hero-depth",
                trigger: "[data-about-hero]",
                start: "top top",
                end: "bottom top",
                scrub: 0.7,
              },
            });
          }

          const arrival = root.querySelector<HTMLElement>("[data-about-arrival]");
          if (arrival) {
            const arrivalMedia = arrival.querySelector<HTMLElement>("[data-reveal-media]");
            const arrivalCopy = arrival.querySelector<HTMLElement>("h2");
            const arrivalTimeline = gsap.timeline({
              defaults: { ease: "power4.out", overwrite: "auto" },
              scrollTrigger: {
                id: "about-v3-arrival-registration",
                trigger: arrival,
                start: conditions.mobile ? "top 86%" : "top 72%",
                once: true,
              },
            });
            if (arrivalMedia) {
              arrivalTimeline.from(arrivalMedia, {
                clipPath: conditions.mobile ? "inset(0 0 42% 0)" : "inset(0 46% 0 0)",
                scale: 1.025,
                duration: 0.86,
              });
            }
            if (arrivalCopy) arrivalTimeline.from(arrivalCopy, { y: 22, autoAlpha: 0, duration: 0.5 }, 0.34);
          }

          const dossierRows = gsap.utils.toArray<HTMLElement>("[data-dossier-reveal]");
          if (dossierRows.length) {
            gsap.from(dossierRows, {
              x: conditions.mobile ? 0 : 18,
              y: conditions.mobile ? 12 : 0,
              autoAlpha: 0,
              duration: 0.42,
              stagger: 0.08,
              scrollTrigger: {
                id: "about-v3-dossier-registration",
                trigger: dossierRows[0],
                start: "top 82%",
                once: true,
              },
            });
          }

          const refreshFrame = requestAnimationFrame(() => {
            ScrollTrigger.sort();
            ScrollTrigger.refresh();
          });
          return () => cancelAnimationFrame(refreshFrame);
        }
      );

      return () => media.revert();
    },
    { scope: rootRef }
  );

  return <div ref={rootRef}>{children}</div>;
}
