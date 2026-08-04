/**
 * The people.
 *
 * Names, qualifications and biographical facts are taken from the firm's own
 * team page, and corrected where the firm has since told us otherwise. The
 * prose is tightened to match the rest of the site's voice — no fact is added,
 * removed or upgraded. In particular the qualifications are reproduced exactly
 * as the firm states them: "Chartered Accountant" and "Associate Chartered
 * Accountant" are not interchangeable, and neither is FCA. Vinay Karlagere is
 * an ACA, which the old site under-stated as the bare title.
 *
 * All four are partners - the practice is a partnership, not one accountant's
 * firm. Order follows the firm's own published order rather than seniority.
 */

export type Member = {
  name: string;
  /** Every one of them is a partner; the firm is a partnership. */
  role: string;
  /** As the firm states it. Not embellished. */
  credential: string;
  /** The disciplines this person actually works in. */
  focus: string;
  bio: string;
  /** 448×448 portrait in /public/team. */
  photo: string;
};

export const team: readonly Member[] = [
  {
    name: "Shabari K J",
    role: "Partner",
    credential: "M.Com",
    focus: "Operations · Human resources · Finance",
    bio: "Twenty years of professional experience across operational management, human resources and finance. Shabari oversees the functions that keep an engagement moving to schedule, and the practice running behind it.",
    photo: "/team/shabari-kj.webp",
  },
  {
    name: "Vinay Karlagere",
    role: "Partner",
    credential: "Associate Chartered Accountant",
    focus: "Income tax · Statutory and internal audit · Private equity",
    bio: "An associate chartered accountant advising on income tax matters, statutory and internal audit, and private equity investment, with a record of holding companies, partnership firms, trusts and individuals to their corporate law obligations. Holds a postgraduate degree in Investment and Risk Finance from the University of Westminster, London.",
    photo: "/team/vinay-karlagere.webp",
  },
  {
    name: "Akshay R. Jain",
    role: "Partner",
    credential: "Associate Chartered Accountant",
    focus: "Tax audit · Accounting · Company law",
    bio: "Substantial experience in tax audit and accounting, gained at Big Four firms and multinational corporations. Advises on income tax matters, statutory and internal audit, private equity investment, and company law compliance for companies, partnerships, trusts and individuals.",
    photo: "/team/akshay-r-jain.webp",
  },
  {
    name: "Vagdev M R",
    role: "Partner",
    credential: "Finance and accounts",
    focus: "Income tax · GST · TDS compliance",
    bio: "Over five years across income tax, GST and TDS compliance. His work on TDS covers accurate deduction and remittance within the statutory window — the obligation that accrues interest fastest when missed — alongside experience on the operational side.",
    photo: "/team/vagdev-mr.webp",
  },
] as const;

export const teamIntro = {
  label: "The team",
  headline: "The partners who will hold your file.",
  standfirst:
    "The firm is a partnership: the person you meet is the person on your file. These are the four partners, their qualifications, and the areas each one handles.",
} as const;
