"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./Manifesto.module.css";

const WORDS = [
  { index: null, meta: null, label: "GOING UP." },
  { index: "01", meta: "ATTENTION", label: "LOUD." },
  { index: "02", meta: "MEANING", label: "PRECISE." },
  { index: "03", meta: "MEMORY", label: "UNFORGETTABLE." },
];

export function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const words = wordRefs.current.filter((w): w is HTMLDivElement => Boolean(w));
      if (words.length < 2) return;

      gsap.set(words, { yPercent: 100, autoAlpha: 0 });
      gsap.set(words[0], { yPercent: 0, autoAlpha: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${words.length * 100}%`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
      });

      words.forEach((word, i) => {
        if (i === 0) return;
        tl.to(words[i - 1], { yPercent: -100, autoAlpha: 0, duration: 0.18, ease: "power3.in" }, i - 0.18).fromTo(
          word,
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.18, ease: "power3.out" },
          i
        );
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <HeaderZone theme="dark">
      <section className={styles.manifesto} aria-label="Studio manifesto">
        {!reducedMotion ? (
          <div ref={containerRef} className={styles.pinContainer}>
            <div className={styles.stack}>
              {WORDS.map((w, i) => (
                <div
                  key={w.label}
                  ref={(el) => {
                    wordRefs.current[i] = el;
                  }}
                  className={styles.wordRow}
                >
                  {w.index && (
                    <span className={styles.level}>
                      <span className={styles.levelIndex}>{w.index}</span>
                      <span className={styles.levelMeta}>{w.meta}</span>
                    </span>
                  )}
                  <span className={styles.word}>{w.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`wrap ${styles.staticList}`}>
            <p className={styles.staticKicker}>Going Up.</p>
            {WORDS.slice(1).map((w) => (
              <div key={w.label} className={styles.staticRow}>
                <span className={styles.level}>
                  <span className={styles.levelIndex}>{w.index}</span>
                  <span className={styles.levelMeta}>{w.meta}</span>
                </span>
                <span className={styles.staticWord}>{w.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </HeaderZone>
  );
}
