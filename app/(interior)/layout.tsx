import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Grain } from "@/components/motion/Grain";
import { Cursor } from "@/components/motion/Cursor";
import { InteriorReveals } from "@/components/motion/InteriorReveals";

/**
 * Interior route-group layout. Homepage stays outside this group —
 * Lenis / grain / cursor / reveals never mount on `/`.
 */
export default function InteriorLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <Grain />
      <Cursor />
      <InteriorReveals />
      {children}
    </SmoothScroll>
  );
}
