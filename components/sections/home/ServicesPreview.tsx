"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { services } from "@/content/services";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { InteriorRevealLine } from "@/components/motion/InteriorReveal";
import { gsap } from "@/components/motion/gsap";
import styles from "./ServicesPreview.module.css";

export function ServicesPreview() {
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;

      const rows = list.querySelectorAll<HTMLElement>(`.${styles.row}`);
      if (!rows.length) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(rows, { autoAlpha: 0, y: 28 });
        const tween = gsap.to(rows, {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: "power4.out",
          scrollTrigger: {
            trigger: list,
            start: "top 82%",
            once: true,
            invalidateOnRefresh: true,
            refreshPriority: -10,
          },
          onComplete: () => {
            gsap.set(rows, { clearProps: "opacity,transform,visibility" });
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: listRef }
  );

  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Services overview">
        <div className={styles.head}>
          <div>
            <p className="eyebrow">Capabilities</p>
            <h2 className={styles.heading}>
              <InteriorRevealLine>One practice.</InteriorRevealLine>
              <InteriorRevealLine>Five ways in.</InteriorRevealLine>
            </h2>
          </div>
          <Link href="/services" className={styles.cta} data-cursor="link">
            View all services
            <ArrowRightIcon />
          </Link>
        </div>

        <ul className={styles.list} ref={listRef}>
          {services.map((service) => (
            <li key={service.index}>
              <Link href={`/services#${service.slug}`} className={styles.row} data-cursor="link">
                <span className={styles.index}>{service.index}</span>
                <span className={styles.name}>{service.name}</span>
                <span className={styles.role}>{service.role}</span>
                <span className={styles.arrow} aria-hidden="true">
                  <ArrowRightIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </HeaderZone>
  );
}
