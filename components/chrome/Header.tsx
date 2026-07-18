"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems, ctaLabel } from "@/content/navigation";
import { site } from "@/content/site";
import { useHeaderTheme } from "./HeaderThemeContext";
import { MobileMenu } from "./MobileMenu";
import { ArrowUpIcon } from "@/components/ui/Icons";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const { theme } = useHeaderTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const trackRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  const activeIndex = navItems.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );

  useEffect(() => {
    function measure() {
      const activeEl = itemRefs.current[activeIndex];
      const trackEl = trackRef.current;
      if (!activeEl || !trackEl) return;
      const trackRect = trackEl.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setIndicator({
        left: itemRect.left - trackRect.left,
        width: itemRect.width,
        ready: true,
      });
    }
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready?.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex, pathname]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className={styles.header} data-theme={theme}>
        <div className={styles.side}>
          <Link href="/" className={styles.mark} aria-label={`${site.name} — home`}>
            {site.monogram}
          </Link>
        </div>

        <nav className={styles.track} ref={trackRef} aria-label="Primary">
          <span
            className={styles.indicator}
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: `${indicator.width}px`,
              opacity: indicator.ready ? 1 : 0,
            }}
            aria-hidden="true"
          />
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={styles.item}
              data-active={i === activeIndex}
              aria-current={i === activeIndex ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={`${styles.side} ${styles.sideRight}`}>
          <button
            type="button"
            className={styles.upButton}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            <ArrowUpIcon />
          </button>
          <Link href="/contact" className={styles.cta}>
            {ctaLabel}
          </Link>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen(true)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            Menu
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeIndex={activeIndex} />
    </>
  );
}
