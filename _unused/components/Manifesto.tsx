"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useIsMobile } from "@/components/motion/useIsMobile";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./Manifesto.module.css";

const WORDS = [
  { id: "welcome", label: "Welcome to Convenium" },
  { id: "decorate", label: "We do not decorate businesses" },
  { id: "level", label: "We take them to another level" },
] as const;

export function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const showStatic = reducedMotion || isMobile;

  useGSAP(
    () => {
      if (showStatic) return;
      const words = wordRefs.current.filter((word): word is HTMLDivElement => Boolean(word));
      if (words.length !== WORDS.length) return;

      gsap.set(words, { yPercent: 120, autoAlpha: 0 });
      gsap.set(words[0], { yPercent: 0, autoAlpha: 1 });

      const beats = words.length - 1;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          id: "manifesto-master",
          start: "top top",
          end: `+=${beats * 100}%`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          refreshPriority: 20,
          snap: {
            snapTo: 1 / beats,
            duration: 0.42,
            ease: "power4.in",
          },
        },
      });

      tl.addLabel(WORDS[0].id, 0);

      words.forEach((word, index) => {
        if (index === 0) return;

        const settleAt = index;
        const hiddenBoundary = settleAt - 0.2;
        const exitAt = hiddenBoundary - 0.15;

        // The prior state is fully gone before the incoming state can render. Hiding the complete
        // stack at the boundary makes the no-overlap invariant hold in both scroll directions.
        tl.to(
          words[index - 1],
          { yPercent: -20, autoAlpha: 0, duration: 0.15, ease: "power4.in" },
          exitAt
        )
          .set(words, { autoAlpha: 0 }, hiddenBoundary)
          .set(word, { yPercent: 120, autoAlpha: 0 }, hiddenBoundary)
          .to(
            word,
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.2,
              ease: "power4.in",
              immediateRender: false,
            },
            hiddenBoundary
          )
          .addLabel(WORDS[index].id, settleAt);
      });

      const refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });

      return () => {
        cancelAnimationFrame(refreshFrame);
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [showStatic], revertOnUpdate: true }
  );

  return (
    <HeaderZone theme="dark">
      <section className={styles.manifesto} aria-label="Studio manifesto">
        {!showStatic ? (
          <div ref={containerRef} className={styles.pinContainer}>
            <div className={styles.stack}>
              {WORDS.map((word, index) => (
                <div
                  key={word.id}
                  ref={(element) => {
                    wordRefs.current[index] = element;
                  }}
                  className={styles.wordRow}
                  data-manifesto-state={word.id}
                >
                  <span className={styles.word}>{word.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`wrap ${styles.staticList}`}>
            {WORDS.map((word) => (
              <div key={word.id} className={styles.staticRow}>
                <span className={styles.staticWord}>{word.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </HeaderZone>
  );
}
