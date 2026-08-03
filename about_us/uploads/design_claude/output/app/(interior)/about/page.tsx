import type { Metadata } from "next";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { MonolithScene } from "@/components/sections/about/monolith/MonolithScene";
import {
  ChapterArrival,
  ChapterPosition,
  ChapterIdentity,
  ChapterWeb,
  ChapterContent,
  ChapterGoingUp,
} from "@/components/sections/about/monolith/AboutChapters";

export const metadata: Metadata = {
  title: "About — Convenium Studio",
  description:
    "Convenium is two people. Small by design — strategy, identity, web, content and media, carried personally from first call to launch.",
};

/**
 * The one interior page that inverts: chapters 1–6 are all noir (spec §5).
 * StudioModel / StudioFilm / CapabilitiesList / ProcessSteps / Principles are
 * intentionally not mounted here; the files stay in the repo.
 */
export default function AboutPage() {
  return (
    <HeaderZone theme="dark">
      <MonolithScene>
        <ChapterArrival />
        <ChapterPosition />
        <ChapterIdentity />
        <ChapterWeb />
        <ChapterContent />
        <ChapterGoingUp />
      </MonolithScene>
    </HeaderZone>
  );
}
