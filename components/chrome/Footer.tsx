import Link from "next/link";
import { navItems } from "@/content/navigation";
import { site } from "@/content/site";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { HeaderZone } from "./HeaderZone";
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

        <div className={`wrap ${styles.bottom}`}>
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <Link href="/privacy" className={styles.link}>
            Privacy
          </Link>
        </div>

        <div className={styles.wordmarkWrap} aria-hidden="true">
          <span className={styles.wordmark}>Convenium</span>
        </div>
      </footer>
    </HeaderZone>
  );
}
