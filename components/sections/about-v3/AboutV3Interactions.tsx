"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { aboutV3 } from "@/content/about-v3";
import styles from "./TwoLensesPage.module.css";

export function ProgramSelector() {
  const [activeKey, setActiveKey] = useState<(typeof aboutV3.programs)[number]["key"]>("restore");
  const active = aboutV3.programs.find((program) => program.key === activeKey) ?? aboutV3.programs[0];

  return (
    <div className={styles.programSelector}>
      <div className={styles.programTabs} role="tablist" aria-label="Three rehabilitation directions">
        {aboutV3.programs.map((program) => (
          <button
            type="button"
            role="tab"
            aria-selected={active.key === program.key}
            aria-controls="about-program-panel"
            id={`about-program-${program.key}`}
            tabIndex={active.key === program.key ? 0 : -1}
            key={program.key}
            className={active.key === program.key ? styles.programTabActive : undefined}
            onClick={() => setActiveKey(program.key)}
          >
            <span>{program.index}</span>
            <strong>{program.title}</strong>
            <small>{program.short}</small>
          </button>
        ))}
      </div>

      <div
        className={styles.programPanel}
        role="tabpanel"
        id="about-program-panel"
        aria-labelledby={`about-program-${active.key}`}
        key={active.key}
      >
        <Image
          src={active.image}
          alt={`Concept study for the ${active.title} direction, showing the same compact companion in a distinct rehabilitation state.`}
          fill
          sizes="(max-width: 767px) 100vw, 70vw"
        />
        <div className={styles.programPanelCopy} aria-live="polite">
          <span>Selected direction / {active.index}</span>
          <h3>{active.title}</h3>
          <p>{active.body}</p>
        </div>
      </div>
    </div>
  );
}

export function HandoffSequence() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className={styles.handoffSequence} data-handoff-complete={accepted ? "true" : "false"}>
      <div className={styles.handoffFrames}>
        <Image
          className={styles.handoffStart}
          src="/images/about-v3/handoff-start.webp"
          alt="Rustam presents the compact project companion and approved plan to Apollo, whose hands are open to receive them."
          fill
          sizes="100vw"
        />
        <Image
          className={styles.handoffEnd}
          src="/images/about-v3/handoff-end.webp"
          alt="Apollo carefully holds the compact companion and plan while Rustam remains present and accountable."
          fill
          sizes="100vw"
        />
        <span className={styles.handoffState} aria-live="polite">
          {accepted ? "Responsibility accepted" : "Approved direction ready"}
        </span>
      </div>
      <button
        type="button"
        className={styles.handoffControl}
        aria-pressed={accepted}
        onClick={() => setAccepted((current) => !current)}
      >
        <span>{accepted ? "Return to presentation" : "Complete the handoff"}</span>
      </button>
    </div>
  );
}

export function RecoveryMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const play = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused) {
      video.pause();
      setPlaying(false);
      return;
    }

    if (finished || video.ended) {
      video.currentTime = 0;
      setFinished(false);
    }
    await video.play();
    setPlaying(true);
  };

  return (
    <div className={styles.recoveryMedia}>
      <video
        ref={videoRef}
        muted
        playsInline
        preload="none"
        poster="/images/about-v3/recovery-poster.webp"
        onEnded={() => {
          setPlaying(false);
          setFinished(true);
        }}
        aria-label="A forward-only motion study in which the integration apparatus withdraws and reveals the compact companion in a coherent final state."
      >
        <source src="/images/about-v3/recovery-reveal-dev.mp4" type="video/mp4" />
      </video>
      <div className={styles.recoveryMeta}>
        <span>Motion study / development candidate</span>
        <button type="button" onClick={play} aria-label={playing ? "Pause recovery motion study" : "Play recovery motion study"}>
          {playing ? "Pause" : finished ? "Replay forward" : "Play once"}
        </button>
      </div>
    </div>
  );
}
