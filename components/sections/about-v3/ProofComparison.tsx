"use client";

import { useCallback, useRef, useState } from "react";
import type { ComparisonSource } from "@/content/about-v3";
import { aboutV3 } from "@/content/about-v3";
import styles from "./AboutV3Page.module.css";

const { labels } = aboutV3.proof;

/**
 * Section 09 — before/after comparison.
 *
 * The comparison is direct manipulation, never a scroll animation, and it only
 * appears when both halves of the evidence genuinely exist. Where no verified
 * capture of the client's existing site has been made, the module renders a
 * designed "Existing capture required" panel instead of inventing a before
 * state — which is exactly what the confirmed lockup itself shows.
 *
 * Pointer, touch and keyboard all drive the same value. The divider is a real
 * `role="slider"`, so Arrow keys step it, Home/End pin it to either edge, and
 * a screen reader announces the position as a percentage.
 */
export function ProofComparison({
  source,
  name,
}: {
  source: ComparisonSource;
  name: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);

  const setFromPointer = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    if (!rect.width) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(100, Math.max(0, next)));
  }, []);

  if (!source.existing) {
    return (
      <div className={styles.proofPending}>
        <p className={styles.proofPendingTitle}>{labels.pendingTitle}</p>
        <p className={styles.proofPendingBody}>{labels.pendingBody}</p>
      </div>
    );
  }

  const step = (delta: number) =>
    setSplit((current) => Math.min(100, Math.max(0, current + delta)));

  return (
    <div
      ref={trackRef}
      className={styles.proofSlider}
      style={{ ["--av3-split" as string]: `${split}%` }}
      role="slider"
      tabIndex={0}
      aria-label={`Compare the existing ${name} website with the new direction`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(split)}
      aria-valuetext={`${Math.round(split)}% new direction`}
      aria-orientation="horizontal"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setFromPointer(event.clientX);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          setFromPointer(event.clientX);
        }
      }}
      onKeyDown={(event) => {
        const shift = event.shiftKey ? 10 : 2;
        if (event.key === "ArrowLeft") step(-shift);
        else if (event.key === "ArrowRight") step(shift);
        else if (event.key === "Home") setSplit(0);
        else if (event.key === "End") setSplit(100);
        else return;
        event.preventDefault();
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-layer="existing"
        src={source.existing}
        alt={`The existing ${name} website, captured at ${source.viewport}.`}
        loading="lazy"
        decoding="async"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-layer="proposed"
        src={source.proposed}
        alt={`The proposed new direction for ${name}, captured at ${source.viewport}.`}
        loading="lazy"
        decoding="async"
      />
      <span className={styles.proofHandle} aria-hidden="true">
        <span className={styles.proofHandleGrip}>‹ ›</span>
      </span>
    </div>
  );
}
