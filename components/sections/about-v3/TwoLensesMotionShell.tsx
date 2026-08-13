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
          desktop: "(min-width: 1100px)",
          tablet: "(min-width: 768px) and (max-width: 1099px)",
          mobile: "(max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = context.conditions as {
            desktop: boolean;
            tablet: boolean;
            mobile: boolean;
            reduce: boolean;
          };

          if (conditions.reduce) {
            gsap.set("[data-about-seam], [data-founder-opening], [data-shared-thesis], [data-origin-milestone], [data-brief-reading], [data-duet-row], [data-inquiry-column]", {
              clearProps: "all",
            });
            return;
          }

          const entry = gsap.timeline({ defaults: { overwrite: "auto" } });
          entry
            .from("[data-about-seam]", { scaleY: 0, transformOrigin: "top", duration: 0.65, ease: "power4.out" })
            .from(
              "[data-founder-opening='rustam']",
              { x: conditions.mobile ? 0 : -24, autoAlpha: 0, duration: 0.56 },
              0.08
            )
            .from(
              "[data-founder-opening='marija']",
              { x: conditions.mobile ? 0 : 24, autoAlpha: 0, duration: 0.56 },
              conditions.mobile ? 0.22 : 0.16
            )
            .from("[data-shared-thesis]", { y: 20, autoAlpha: 0, duration: 0.5 }, 0.3);

          if (conditions.desktop || conditions.tablet) {
            gsap.fromTo(
              "[data-shared-thesis] h1",
              { xPercent: -2 },
              {
                xPercent: 2,
                ease: "none",
                scrollTrigger: {
                  id: "about-v3-thesis-convergence",
                  trigger: "[data-about-hero]",
                  start: "65% top",
                  end: "bottom top",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                },
              }
            );
          }

          ScrollTrigger.batch("[data-origin-milestone]", {
            start: "top 78%",
            once: true,
            batchMax: 3,
            onEnter: (elements) =>
              gsap.from(elements, {
                y: conditions.mobile ? 8 : 12,
                autoAlpha: 0,
                duration: conditions.mobile ? 0.26 : 0.34,
                stagger: 0.07,
                overwrite: "auto",
              }),
          });

          const reel = root.querySelector<HTMLElement>("[data-showreel]");
          if (reel) {
            gsap.from(reel, {
              scale: 0.985,
              autoAlpha: 0,
              duration: 0.5,
              scrollTrigger: {
                id: "about-v3-reel-reveal",
                trigger: reel,
                start: "top 78%",
                once: true,
              },
            });
          }

          const readings = gsap.utils.toArray<HTMLElement>("[data-brief-reading]");
          readings.forEach((reading, index) => {
            const voices = reading.querySelectorAll(":scope > div:last-child > div");
            gsap.from(voices, {
              x: conditions.mobile ? 0 : index % 2 === 0 ? 16 : -16,
              y: conditions.mobile ? 10 : 0,
              autoAlpha: 0,
              duration: 0.36,
              stagger: 0.08,
              scrollTrigger: {
                id: `about-v3-reading-${index}`,
                trigger: reading,
                start: "top 72%",
                once: true,
              },
            });
          });

          if (!conditions.mobile) {
            const languagePaths = gsap.utils.toArray<SVGPathElement>("[data-language-path]");
            gsap.fromTo(
              languagePaths,
              { strokeDasharray: 1000, strokeDashoffset: 1000 },
              {
                strokeDashoffset: 0,
                duration: 0.7,
                stagger: 0.06,
                ease: "power2.out",
                scrollTrigger: {
                  id: "about-v3-language-paths",
                  trigger: languagePaths[0],
                  start: "top 65%",
                  once: true,
                },
              }
            );
          }

          ScrollTrigger.batch("[data-duet-row]", {
            start: "top 80%",
            once: true,
            batchMax: 3,
            onEnter: (elements) =>
              gsap.from(elements, {
                y: 12,
                autoAlpha: 0,
                duration: 0.3,
                stagger: 0.06,
                overwrite: "auto",
              }),
          });

          if (!conditions.mobile) {
            gsap.from("[data-inquiry-column='left']", {
              x: -24,
              autoAlpha: 0,
              duration: 0.5,
              scrollTrigger: {
                id: "about-v3-inquiry-left",
                trigger: "[data-inquiry-column='left']",
                start: "top 76%",
                once: true,
              },
            });
            gsap.from("[data-inquiry-column='right']", {
              x: 24,
              autoAlpha: 0,
              duration: 0.5,
              scrollTrigger: {
                id: "about-v3-inquiry-right",
                trigger: "[data-inquiry-column='right']",
                start: "top 76%",
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
