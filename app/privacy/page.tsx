import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Convenium Studio handles information submitted through this site.",
};

export default function PrivacyPage() {
  return (
    <section className="wrap" style={{ paddingTop: "160px", paddingBottom: "160px", maxWidth: 720 }}>
      <h1
        style={{
          fontFamily: "var(--font-family-display)",
          fontSize: "var(--font-display)",
          textTransform: "uppercase",
          lineHeight: 0.94,
          color: "var(--color-noir)",
        }}
      >
        Privacy
      </h1>
      <div
        style={{
          marginTop: "var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          fontFamily: "var(--font-family-serif)",
          fontSize: "var(--font-body)",
          lineHeight: 1.5,
          color: "var(--color-ink)",
        }}
      >
        <p>
          Information submitted through the contact form on this site — name, email, company,
          project details and message — is used only to respond to your inquiry. It is not sold
          or shared with third parties for marketing purposes.
        </p>
        <p>
          This page is a placeholder. A complete privacy policy, covering data retention,
          analytics and your rights under applicable law, will be published here before{" "}
          {site.name} takes on client work through this site.
        </p>
        <p>
          Questions in the meantime can be sent directly to{" "}
          <a href={`mailto:${site.email}`} style={{ textDecoration: "underline" }}>
            {site.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
