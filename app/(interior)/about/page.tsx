import type { Metadata } from "next";
import { AboutPage } from "@/components/sections/about/AboutPage";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
};

export default function AboutRoute() {
  return <AboutPage />;
}
