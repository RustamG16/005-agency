import type { Metadata } from "next";
import { ContactIntro } from "@/components/sections/contact/ContactIntro";
import { ContactMain } from "@/components/sections/contact/ContactMain";
import { ProjectFit } from "@/components/sections/contact/ProjectFit";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Convenium Studio. We reply to every inquiry within two business days.",
};

export default function ContactPage() {
  return (
    <>
      <ContactIntro />
      <ContactMain />
      <ProjectFit />
    </>
  );
}
