import type { Metadata } from "next";
import { ServicesHero } from "@/components/sections/services/ServicesHero";
import { ServicesStack } from "@/components/sections/services/ServicesStack";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Branding, graphic design, web + app development, AI media creation and SMM — five connected Convenium Studio capabilities.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesStack />
    </>
  );
}
