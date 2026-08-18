import Link from "next/link";
import { navItems } from "@/content/navigation";
import { site } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { HeaderZone } from "./HeaderZone";
import { FooterWordmark } from "./FooterWordmark";
import styles from "./Footer.module.css";

/**
 * The teaser band above the primary footer — two large linked columns
 * pointing further into the site. Real Convenium copy and real routes only;
 * this borrows a layout rhythm (big linked column, one-line body, dark
 * ground), never any Symbol Studio string, mark, or color per `CLAUDE.md`.
 */
const TEASERS = [
  {
    key: "work",
    label: "Work",
    body: "See what got built, not just what got pitched.",
    href: "/works",
  },
  {
    key: "services",
    label: "Services",
    body: "Identity, web, motion, content — under one roof, not four vendors.",
    href: "/services",
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <HeaderZone theme="dark">
      <footer className={styles.footer}>
        <nav className={`wrap ${styles.teaser}`} aria-label="Explore Convenium">
          {TEASERS.map((item) => (
            <Link key={item.key} href={item.href} className={styles.teaserCol}>
              <span className={styles.teaserHead}>
                {item.label}
                <ArrowRightIcon className={styles.teaserArrow} />
              </span>
              <p className={styles.teaserBody}>{item.body}</p>
            </Link>
          ))}
        </nav>

        {/* Headline, arrow and email — unchanged. Real phone/address land here
            in a follow-up once they exist; nothing is fabricated to fill the
            gap in the meantime. */}
        <div className={`wrap ${styles.top}`}>
          <div className={styles.headlineCol}>
            <Link href="/contact" className={styles.headlineLink}>
              <span className={styles.headline}>{site.footerHeadline}</span>
              <ArrowRightIcon className={styles.arrow} />
            </Link>
          </div>

          <div className={styles.contactCol}>
            <div className={styles.contactBlock}>
              <a href={`mailto:${site.email}`} className={styles.email}>
                {site.email}
              </a>
            </div>
          </div>
        </div>

        <div className={`wrap ${styles.columns}`}>
          <div className={styles.column}>
            <p className={styles.columnHead}>{site.shortName}</p>
            <p className={styles.columnBody}>{site.tagline}</p>
          </div>

          <div className={styles.column}>
            <nav className={styles.columnLinks} aria-label="Footer">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* `data-guide-avoid` keeps the corner guide off this column — the CC
              BY attribution is a licence condition, not decoration, and he was
              standing on it. */}
          <div className={styles.column} data-guide-avoid>
            <ul className={styles.columnLinks}>
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className={styles.link}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className={styles.legal}>
              <Link href="/privacy" className={styles.link}>
                Privacy
              </Link>
              <span>
                © {year} {site.name}. All rights reserved.
              </span>
              {/* CC BY 4.0 attribution for the guide's model — required, not optional. */}
              <span className={styles.colophon}>
                Robot:{" "}
                <a
                  href="https://sketchfab.com/3d-models/repo-robot-d125b0dbd8854f75a7e1fb49cfd4ef14"
                  target="_blank"
                  rel="noreferrer"
                >
                  &ldquo;REPO Robot&rdquo; by OscarLomas3D
                </a>{" "}
                (CC BY 4.0)
              </span>
            </div>
          </div>
        </div>

        <FooterWordmark word="Convenium" />
      </footer>
    </HeaderZone>
  );
}
