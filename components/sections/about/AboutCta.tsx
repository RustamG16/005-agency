"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { InteriorRevealBlock } from "@/components/motion/InteriorReveal";
import styles from "./AboutCta.module.css";

export function AboutCta() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = btnRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
  }

  function onLeave() {
    const el = btnRef.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  }

  return (
    <HeaderZone theme="dark">
      <section className={`wrap ${styles.section}`} aria-label="Contact call to action">
        <InteriorRevealBlock as="h2" className={styles.heading}>
          Let&rsquo;s find your next floor.
        </InteriorRevealBlock>
        <Link
          href="/contact"
          className={styles.cta}
          ref={btnRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          Start a Project
        </Link>
      </section>
    </HeaderZone>
  );
}
