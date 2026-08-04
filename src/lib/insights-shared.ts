/**
 * The parts of the insights model that are safe on both sides of the wire.
 *
 * `insights.ts` reads the Markdown files, which means it imports `node:fs` —
 * and a client component importing anything from it drags that into the
 * browser bundle and fails the build. Types, the category list and the date
 * formatter live here instead, so the index's filter can use them without
 * pulling the file reader along with it.
 */

export const categories = ["Firm news", "Tax", "Finance", "Regulation"] as const;
export type Category = (typeof categories)[number];

export type Post = {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  category: Category;
  /** One or two sentences. Used on the index and as the meta description. */
  excerpt: string;
  /** A partner's name, as it appears in team.ts. Optional. */
  author?: string;
  /** Pins the post to the lead slot on the index regardless of date. */
  featured?: boolean;
  /** Minutes, rounded up. */
  readingTime: number;
  /** Sanitised HTML. */
  html: string;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/** "28 July 2026" — the form the rest of the site sets dates in. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
