import type { Metadata } from "next";
import { archivoBlack, newsreader, inter } from "./fonts";
import { HeaderThemeProvider } from "@/components/chrome/HeaderThemeContext";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import { GuideDock } from "@/components/guide/GuideDock";
import { site } from "@/content/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.supporting,
  openGraph: {
    title: site.name,
    description: site.supporting,
    url: site.url,
    siteName: site.name,
    images: ["/images/og-cover.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.supporting,
    images: ["/images/og-cover.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  description: site.supporting,
  email: site.email,
  sameAs: site.socials.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivoBlack.variable} ${newsreader.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <HeaderThemeProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <GuideDock />
        </HeaderThemeProvider>
      </body>
    </html>
  );
}
