import { Anton, Archivo_Black, Newsreader, Inter } from "next/font/google";

/**
 * Route-scoped condensed display face for `/about-v3` only.
 *
 * The confirmed About V3 lockups set every heading in a very heavy, tightly
 * tracked condensed grotesque. Archivo Black is heavy but normal-width, so it
 * cannot reproduce those compositions — the headings would run two lines long
 * and the negative space the lockups depend on would collapse.
 *
 * The About V3 handoff names Bebas Neue as its preference. Bebas is condensed
 * but roughly a weight-and-a-half lighter than the lockups, which is the exact
 * kind of drift the rebuild exists to correct, so this ships Anton — the
 * closest Google-hosted match for the lockups' weight and width. `/about-v3`
 * applies `anton.variable` on its own root, so no other route loads it.
 * To switch back, change this export and `--av3-font-display`.
 */
export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

export const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
