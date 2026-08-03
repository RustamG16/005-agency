import type { ElementType, ReactNode } from "react";
import styles from "./InteriorReveal.module.css";

export function InteriorRevealLine({ children }: { children: ReactNode }) {
  return (
    <span className={styles.lineMask} data-interior-reveal="line">
      <span className={styles.lineInner} data-interior-reveal-inner>
        {children}
      </span>
    </span>
  );
}

type BlockProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export function InteriorRevealBlock({ children, className = "", as: Tag = "div" }: BlockProps) {
  return (
    <Tag className={`${styles.block} ${className}`.trim()} data-interior-reveal="block">
      {children}
    </Tag>
  );
}

export function InteriorRevealMedia({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.mediaMask} ${className}`.trim()} data-interior-reveal="media">
      {children}
    </div>
  );
}
