// HARD REQUIREMENT — spec §0. The robot model is CC Attribution; this credit
// must render in the footer colophon. Verification greps for "OscarLomas3D".
// Render it inside the existing footer colophon row (see output/INTEGRATION.md).

import styles from "./GuideColophon.module.css";

const MODEL_URL =
  "https://sketchfab.com/3d-models/repo-robot-d125b0dbd8854f75a7e1fb49cfd4ef14";

export function GuideColophon() {
  return (
    <p className={styles.credit}>
      Robot:{" "}
      <a className={styles.link} href={MODEL_URL} rel="noreferrer noopener" target="_blank">
        &ldquo;REPO Robot&rdquo; by OscarLomas3D (CC BY 4.0)
      </a>
    </p>
  );
}
