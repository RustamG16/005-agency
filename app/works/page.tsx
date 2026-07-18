import type { Metadata } from "next";
import { WorksHero } from "@/components/sections/works/WorksHero";
import { FeaturedMotion } from "@/components/sections/works/FeaturedMotion";
import { WorksGrid } from "@/components/sections/works/WorksGrid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected Convenium Studio engagements across cultural platforms, hospitality, artificial intelligence and architecture.",
};

export default function WorksPage() {
  return (
    <>
      <WorksHero />
      <FeaturedMotion />
      <WorksGrid />
    </>
  );
}
