import type { Metadata } from "next";
import { services } from "@/content/services";
import { ServicesHero } from "@/components/sections/services/ServicesHero";
import { ServiceRow } from "@/components/sections/services/ServiceRow";
import { HeaderZone } from "@/components/chrome/HeaderZone";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Strategy, brand identity, digital experiences, campaigns and motion — five connected Convenium Studio capabilities.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <HeaderZone theme="light">
        <div style={{ background: "var(--color-bone)", paddingBottom: "var(--space-7)" }}>
          {services.map((service) => (
            <ServiceRow key={service.slug} service={service} />
          ))}
        </div>
      </HeaderZone>
    </>
  );
}
