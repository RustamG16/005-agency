"use client";

import { useEffect, useRef } from "react";
import { services } from "@/content/services";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { gsap } from "@/components/motion/gsap";
import styles from "./ServicesHero.module.css";

export function ServicesHero() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const rows = nav.querySelectorAll(`.${styles.indexRow}`);
    if (!rows.length) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(rows, {
        autoAlpha: 0,
        y: 16,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.15,
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Services introduction">
        <div className={styles.grid}>
          <div className={styles.left}>
            <p className={`eyebrow ${styles.eyebrowAccent}`}>Capabilities</p>
            <h1 className={styles.heading}>
              Five disciplines.
              <br />
              One connected system.
            </h1>
            <p className={styles.supporting}>
              Every engagement draws from the same five capabilities, combined to the scope a brand
              actually needs — not a fixed package.
            </p>
          </div>

          <nav className={styles.index} aria-label="Jump to service" ref={navRef}>
            {services.map((s) => (
              <a key={s.slug} href={`#${s.slug}`} className={styles.indexRow}>
                <span className={styles.indexNum}>{s.index}</span>
                <span className={styles.indexName}>{s.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>
    </HeaderZone>
  );
}
