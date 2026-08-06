import Link from "next/link";
import { navItems } from "@/content/navigation";
import { site } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { HeaderZone } from "./HeaderZone";
import { FooterWordmark } from "./FooterWordmark";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <HeaderZone theme="dark">
      <footer className={styles.footer}>
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
            <div className={styles.contactBlock}>
              <nav className={styles.links} aria-label="Footer">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className={styles.contactBlock}>
              <ul className={styles.socials}>
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className={styles.link}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* `data-guide-avoid` keeps the corner guide off this row. The CC BY
            attribution is a licence condition, not decoration — it has to be
            readable, and he was standing on it. */}
        <div className={`wrap ${styles.bottom}`} data-guide-avoid>
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <div className={styles.bottomRight}>
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
            <Link href="/privacy" className={styles.link}>
              Privacy
            </Link>
          </div>
        </div>

        <FooterWordmark word="Convenium" />
      </footer>
    </HeaderZone>
  );
}
