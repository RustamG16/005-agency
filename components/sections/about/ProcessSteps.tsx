"use client";

import { useEffect, useRef } from "react";
import { processSteps } from "@/content/process";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { gsap } from "@/components/motion/gsap";
import styles from "./ProcessSteps.module.css";

export function ProcessSteps() {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>(`.${styles.item}`));
    if (!items.length) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      items.forEach((item) => {
        const line = item.querySelector<HTMLElement>(`.${styles.progress}`);

        const st = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 70%",
            end: "bottom 45%",
            scrub: true,
            onUpdate: (self) => {
              item.dataset.active = self.progress > 0.15 && self.progress < 0.95 ? "true" : "false";
            },
          },
        });

        if (line) {
          st.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
        }

        st.fromTo(item, { opacity: 0.4 }, { opacity: 1, ease: "none" }, 0);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Process">
        <p className="eyebrow">Process</p>
        <h2 className={styles.heading}>Five steps, in order, every time.</h2>

        <ol className={styles.list} ref={listRef}>
          {processSteps.map((step) => (
            <li key={step.index} className={styles.item} data-active="false">
              <span className={styles.progress} aria-hidden="true" />
              <span className={styles.index}>{step.index}</span>
              <span className={styles.title}>{step.title}</span>
              <span className={styles.body}>{step.body}</span>
            </li>
          ))}
        </ol>
      </section>
    </HeaderZone>
  );
}
