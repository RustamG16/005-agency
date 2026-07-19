import styles from "./Grain.module.css";

/** Fixed SVG turbulence overlay — interior layout only. */
export function Grain() {
  return (
    <div className={styles.grain} aria-hidden="true">
      <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        <filter id="convenium-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#convenium-grain)" />
      </svg>
    </div>
  );
}
