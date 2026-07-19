import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./HomeReveal.module.css";

export function RevealLine({ children }: { children: ReactNode }) {
  return (
    <span className={styles.lineMask} data-home-reveal="line">
      <span className={styles.lineInner} data-home-reveal-inner>
        {children}
      </span>
    </span>
  );
}

export function RevealMedia({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={`${styles.mediaMask} ${className}`.trim()}
      data-home-reveal="media"
    />
  );
}
