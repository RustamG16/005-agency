import Image from "next/image";
import styles from "./ConversationReel.module.css";

const reelFrames = [
  {
    key: "urologie-wide",
    src: "/works/sr-urologie/cover.jpg",
    alt: "SR Urologie website interface, shown as selected independent work.",
    label: "SR Urologie",
    className: "notes",
  },
  {
    key: "education-portrait",
    src: "/works/education4students/cover-portrait.jpg",
    alt: "Education4Students website interface, shown as selected independent work.",
    label: "Education4Students",
    className: "archive",
  },
  {
    key: "sonnwerk-wide",
    src: "/works/sonnwerk/cover.jpg",
    alt: "Sonn'Werk website interface, shown as selected independent work.",
    label: "Sonn'Werk",
    className: "marks",
  },
  {
    key: "meridian-left",
    src: "/works/meridian/cover.jpg",
    alt: "The Meridian website interface, shown as selected independent work.",
    label: "The Meridian",
    className: "landscapeLeft",
  },
  {
    key: "meridian-right",
    src: "/works/meridian/cover.jpg",
    alt: "",
    label: "",
    className: "landscapeRight",
  },
  {
    key: "urologie-portrait",
    src: "/works/sr-urologie/cover-portrait.jpg",
    alt: "",
    label: "",
    className: "board",
  },
  {
    key: "sonnwerk-portrait",
    src: "/works/sonnwerk/cover-portrait.jpg",
    alt: "",
    label: "",
    className: "hands",
  },
  {
    key: "education-wide",
    src: "/works/education4students/cover.jpg",
    alt: "",
    label: "",
    className: "profile",
  },
] as const;

export function ConversationReel() {
  return (
    <div className={styles.player} data-showreel>
      <div className={styles.visual} aria-label="Selected founder and independent work previews">
        <p className={styles.mediaPlanBadge}>A13 · final showreel poster from external edit</p>
        {reelFrames.map((frame) => (
          <figure className={`${styles.reelFrame} ${styles[frame.className]}`} key={frame.key}>
            <Image
              className={styles.reelImage}
              src={frame.src}
              alt={frame.alt}
              fill
              loading="eager"
              sizes="(max-width: 767px) 50vw, 18vw"
            />
            {frame.label ? <figcaption>{frame.label}</figcaption> : null}
          </figure>
        ))}
        <span className={styles.reelSeam} aria-hidden="true" />
      </div>

      <div className={styles.controls}>
        <div>
          <p className={styles.title}>Conversation showreel</p>
          <p className={styles.meta}>Target 00:52–00:58 / intentional playback</p>
        </div>
        <button className={styles.play} type="button" disabled>
          Showreel media required
        </button>
      </div>
      <p className={styles.placeholderNote} role="note">
        Current proof-media placeholder. The external edit will combine cleared project recordings
        with V01/V02/V04 founder and process clips; this page will receive the final A13 poster and
        preview, not additional generated mood imagery.
      </p>
    </div>
  );
}
