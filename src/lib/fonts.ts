import {
  Inter,
  Inter_Tight,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";

/**
 * Type system.
 *
 * Four families, each with a job:
 *  - Inter          body + UI (variable)
 *  - Inter Tight    display headings (variable, tighter fit at large sizes)
 *  - Instrument Serif  editorial accents only — the alchemy formula, pull quotes
 *  - JetBrains Mono    eyebrows, labels, technical metadata
 *
 * All are self-hosted by next/font (no render-blocking request to Google) and
 * emit `font-display: swap` with a size-adjusted fallback to keep CLS at zero.
 */

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const fontVariables = [
  inter.variable,
  interTight.variable,
  instrumentSerif.variable,
  jetbrainsMono.variable,
].join(" ");
