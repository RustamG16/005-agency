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
          <Link href="/contact" className={styles.headlineLink}>
            <span className={styles.headline}>{site.footerHeadline}</span>
            <ArrowRightIcon className={styles.arrow} />
          </Link>
          <a href={`mailto:${site.email}`} className={styles.email}>
            {site.email}
          </a>
        </div>

        <div className={`wrap ${styles.meta}`}>
          <nav className={styles.links} aria-label="Footer">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ))}
          </nav>
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

        <div className={`wrap ${styles.bottom}`}>
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <Link href="/privacy" className={styles.link}>
            Privacy
          </Link>
        </div>
      </footer>
    </HeaderZone>
  );
}
