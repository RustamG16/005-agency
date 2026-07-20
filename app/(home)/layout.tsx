import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Grain } from "@/components/motion/Grain";
import { Cursor } from "@/components/motion/Cursor";
import { InteriorReveals } from "@/components/motion/InteriorReveals";

/**
 * Homepage route-group layout. Same motion surface as interiors:
 * Lenis + grain + cursor + unified reveals. Elevator journey stays untouched.
 */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <Grain />
      <Cursor />
      <InteriorReveals />
      {children}
    </SmoothScroll>
  );
}
