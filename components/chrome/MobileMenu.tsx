"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { navItems, ctaLabel } from "@/content/navigation";
import { site } from "@/content/site";
import { CloseIcon } from "@/components/ui/Icons";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  activeIndex: number;
};

export function MobileMenu({ open, onClose, activeIndex }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      firstLinkRef.current?.focus();
    }, 60);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      className={styles.overlay}
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      ref={panelRef}
    >
      <div className={styles.topRow}>
        <span className={styles.mark}>{site.monogram}</span>
        <button
          type="button"
          ref={closeRef}
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
        >
          <CloseIcon />
          <span>Close</span>
        </button>
      </div>

      <nav className={styles.rows} aria-label="Mobile primary">
        {navItems.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            ref={i === 0 ? firstLinkRef : undefined}
            className={styles.row}
            data-active={i === activeIndex}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
          >
            <span className={styles.rowIndex}>{String(i + 1).padStart(2, "0")}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link href="/contact" className={styles.cta} onClick={onClose} tabIndex={open ? 0 : -1}>
        {ctaLabel}
      </Link>
    </div>
  );
}
