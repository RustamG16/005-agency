"use client";

/**
 * The Guide — site-wide mount point.
 *
 * Mounted once in the root layout so the puck persists across navigation.
 * Track A ships the puck and the bubble; the `menu` and `panel` slots are where
 * Track B's radial menu and Ask panel attach without either track editing the
 * other's files.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { GuideScene } from "./GuideScene";
import { GuideBubble } from "./GuideBubble";
import { guideStore, useGuide } from "./guide-state";
import styles from "./GuideDock.module.css";

type GuideDockProps = {
  /** Rendered inside the dock, behind the puck — Track B's radial ring. */
  menu?: ReactNode;
  /** Rendered in the viewport layer — Track B's Ask panel. */
  panel?: ReactNode;
  children?: ReactNode;
};

export function GuideDock({ menu, panel, children }: GuideDockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const { mode } = useGuide();
  const hasPanel = Boolean(panel ?? children);

  /* The Ask petal is wired ahead of its panel: `GuideAsk` is PROMPT-B's, and
   * until it lands there is nothing to render for `mode === "ask"`. Without
   * this the guide would sit in a mode with no UI and no way out. */
  useEffect(() => {
    if (mode === "ask" && !hasPanel) guideStore.closeAsk();
  }, [mode, hasPanel]);

  return (
    <div className={styles.root}>
      <div ref={dockRef} className={styles.dock} data-guide-dock>
        {menu}
        <GuideScene />
      </div>
      <GuideBubble dockRef={dockRef} />
      {panel ?? children}
    </div>
  );
}
