import type { Metadata } from "next";
import { WorksHero } from "@/components/sections/works/WorksHero";
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
      <WorksGrid />
    </>
  );
}
