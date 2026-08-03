import type { Metadata } from "next";
import { MonolithScene } from "@/components/sections/about/monolith/MonolithScene";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Convenium is two people. Strategy, identity, web, content and media — carried personally from first call to launch.",
};

/**
 * The Monolith. One WebGL object carries all six chapters, so the page demonstrates the
 * studio's core service instead of describing it. This is the one interior page that
 * opens dark; that inversion is deliberate.
 */
export default function AboutPage() {
  return <MonolithScene />;
}
