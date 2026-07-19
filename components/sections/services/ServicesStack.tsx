"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { services, type Service } from "@/content/services";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { gsap } from "@/components/motion/gsap";
import styles from "./ServicesStack.module.css";

function ServicePanel({ service }: { service: Service }) {
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    const img = el.querySelector("img");
    if (!img) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.to(img, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <article id={service.slug} className={styles.panel} data-service={service.slug}>
      <header className={styles.mobileHead}>
        <span className={styles.mobileIndex}>{service.index}</span>
        <h2 className={styles.mobileName}>{service.name}</h2>
      </header>
      <p className={styles.role}>{service.role}</p>
      <p className={styles.description}>{service.description}</p>
      <ul className={styles.scope}>
        {service.scope.map((item) => (
          <li key={item} className={styles.scopeItem}>
            {item}
          </li>
        ))}
      </ul>
      <div className={styles.media} ref={mediaRef}>
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(max-width: 899px) 100vw, 55vw"
          className={styles.mediaImg}
        />
      </div>
    </article>
  );
}

export function ServicesStack() {
  const rootRef = useRef<HTMLElement>(null);
  const railIndexRef = useRef<HTMLSpanElement>(null);
  const railNameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const panels = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.panel}`));
    if (!panels.length) return;

    const setActive = (index: number) => {
      const service = services[index];
      if (!service) return;
      if (railIndexRef.current) railIndexRef.current.textContent = service.index;
      if (railNameRef.current) railNameRef.current.textContent = service.name;
      panels.forEach((p, i) => {
        p.dataset.active = i === index ? "true" : "false";
      });
    };

    setActive(0);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const triggers = panels.map((panel, index) =>
        gsap.to(panel, {
          scrollTrigger: {
            trigger: panel,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActive(index),
            onEnterBack: () => setActive(index),
          },
        })
      );

      return () => {
        triggers.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      };
    });

    // Mobile / reduced-motion: IntersectionObserver for active state without sticky rail drama
    mm.add("(max-width: 899px), (prefers-reduced-motion: reduce)", () => {
      const io = new IntersectionObserver(
        (entries) => {
          const best = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!best) return;
          const idx = panels.indexOf(best.target as HTMLElement);
          if (idx >= 0) setActive(idx);
        },
        { threshold: [0.35, 0.55, 0.75] }
      );
      panels.forEach((p) => io.observe(p));
      return () => io.disconnect();
    });

    return () => mm.revert();
  }, []);

  return (
    <HeaderZone theme="light">
      <section className={styles.section} aria-label="Service capabilities" ref={rootRef}>
        <div className={`wrap ${styles.layout}`}>
          <aside className={styles.rail} aria-hidden="true">
            <span className={styles.railIndex} ref={railIndexRef}>
              {services[0].index}
            </span>
            <span className={styles.railName} ref={railNameRef}>
              {services[0].name}
            </span>
          </aside>
          <div className={styles.column}>
            {services.map((service) => (
              <ServicePanel key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>
    </HeaderZone>
  );
}
