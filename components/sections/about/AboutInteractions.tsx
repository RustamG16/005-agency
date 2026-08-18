"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";

/* =============================================================================
   07 — orchestration sequence

   No pin. The atlas is several viewports tall, so pinning it would either trap
   the scroll or hide most of the diagram, and the handoff makes the pin
   optional. Instead one ScrollTrigger walks a highlight through the five
   stages as the strip crosses the viewport, and the matching lane lights up
   with it. The highlight is purely additive — nothing dims, nothing hides, and
   the whole architecture reads at full contrast without scrolling at all.

   `data-active` is written straight to the DOM rather than held in React
   state, so the atlas markup stays server-rendered.
   ========================================================================== */

export function AtlasSequence({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const media = gsap.matchMedia();
      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const strip = root.querySelector<HTMLElement>("[data-atlas-strip]");
        const stages = gsap.utils.toArray<HTMLElement>("[data-atlas-stage]", root);
        const lanes = gsap.utils.toArray<HTMLElement>("[data-atlas-lane]", root);
        if (!strip || !stages.length) return;

        const setActive = (index: number) => {
          stages.forEach((el, i) => {
            el.dataset.active = String(i === index);
          });
          lanes.forEach((el, i) => {
            el.dataset.active = String(i === index);
          });
        };

        const trigger = ScrollTrigger.create({
          id: "about-atlas-sequence",
          trigger: strip,
          start: "top 85%",
          end: "bottom 45%",
          onUpdate: (self) => {
            setActive(Math.min(stages.length - 1, Math.floor(self.progress * stages.length)));
          },
        });

        setActive(0);

        return () => {
          trigger.kill();
          [...stages, ...lanes].forEach((el) => {
            delete el.dataset.active;
          });
        };
      });

      return () => media.revert();
    },
    { scope: rootRef }
  );

  return <div ref={rootRef}>{children}</div>;
}
