"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Site-wide baseline; mechanical arrivals (manifesto beats, elevator doors) override with power4.in.
  gsap.defaults({ ease: "power4.out", duration: 0.6 });
  // Fonts, images and videos below the fold can still be loading when a section's ScrollTrigger
  // first measures its position. One refresh once everything has settled keeps every trigger's
  // start/end accurate instead of quietly drifting from late layout shifts.
  window.addEventListener("load", () => ScrollTrigger.refresh());
  // `load` is not enough on its own: Archivo Black is the tallest thing on the page and it can
  // swap in after the load event, moving every measured start by the difference between the
  // fallback's line box and its own.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger };
