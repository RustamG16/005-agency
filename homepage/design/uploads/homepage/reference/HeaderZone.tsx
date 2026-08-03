"use client";

import { useEffect, useRef } from "react";
import { useHeaderTheme, type ChromeTheme } from "./HeaderThemeContext";

type HeaderZoneProps = {
  theme: ChromeTheme;
  children: React.ReactNode;
  className?: string;
};

export function HeaderZone({ theme, children, className }: HeaderZoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { setTheme } = useHeaderTheme();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTheme(theme);
      },
      { rootMargin: "-72px 0px -85% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [theme, setTheme]);

  return (
    <div ref={ref} className={className} data-header-theme={theme}>
      {children}
    </div>
  );
}
