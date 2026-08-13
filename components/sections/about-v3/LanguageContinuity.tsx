import styles from "./TwoLensesPage.module.css";

export function LanguageContinuity() {
  return (
    <div className={styles.languageGrid}>
      <div className={styles.languageVisual} aria-hidden="true">
        <span className={styles.languageSource}>Structure</span>
        <svg viewBox="0 0 800 180" preserveAspectRatio="none">
          <path data-language-path d="M20 24 C230 24 210 90 400 90 C590 90 570 24 780 24" />
          <path data-language-path d="M20 90 C230 90 230 90 400 90 C570 90 570 90 780 90" />
          <path data-language-path d="M20 156 C230 156 210 90 400 90 C590 90 570 156 780 156" />
        </svg>
        <span className={styles.languageMeaning}>Meaning</span>
        <span className={styles.languageResult}>Understanding</span>
      </div>

      <div className={styles.languageRoles}>
        <div>
          <h3>Language-matched conversation</h3>
          <p>
            Founder language roles are intentionally withheld until both founders confirm which
            languages they can lead professionally and which they support conversationally.
          </p>
        </div>
        <ol className={styles.continuitySteps}>
          <li><span>1</span> Speak in the best-fit language.</li>
          <li><span>2</span> Write the interpretation down.</li>
          <li><span>3</span> Confirm intent before making.</li>
          <li><span>4</span> Keep one shared decision record.</li>
        </ol>
        <p className={styles.developmentNote} role="note">
          Development placeholder — verified language ownership is required before publication.
        </p>
      </div>
    </div>
  );
}
