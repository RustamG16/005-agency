import type { Metadata } from "next";
import { HeroPreview } from "./HeroPreview";

/**
 * Development-only rig for the hero scroll animation (spec §4.5).
 *
 * It exists so both credit-spending decisions in that work land on evidence:
 * an anchor still is judged full-bleed, centre-cropped, graded and with the
 * real statement over it — never as a flat thumbnail — and the §4.4 seam
 * behaviour is measured before the 45-credit master is generated.
 *
 * NOT INDEXED. `app/robots.ts` allows `/` wholesale and `app/sitemap.ts` lists
 * its routes explicitly, so the exclusion has to live here, on the route.
 *
 * Nothing in production may import from this directory. The dependency runs one
 * way: this route imports the real `HeroMedia`, the real Hero CSS modules and
 * the real tokens, and production knows nothing about it.
 */
export const metadata: Metadata = {
  title: "Hero preview (dev)",
  robots: { index: false, follow: false },
};

export default function HeroPreviewPage() {
  return <HeroPreview />;
}
