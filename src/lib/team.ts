/**
 * The people.
 *
 * Names, qualifications and biographical facts are taken from the firm's own
 * team page. The prose is tightened to match the rest of the site's voice —
 * no fact is added, removed or upgraded. In particular the qualifications are
 * reproduced exactly as the firm states them: "Chartered Accountant" and
 * "Associate Chartered Accountant" are not interchangeable, and neither is
 * FCA.
 *
 * Order follows the firm's own published order rather than seniority or title,
 * because the source page carried no titles to rank by.
 */

export type Member = {
  name: string;
  /** As the firm states it. Not embellished. */
  credential: string;
  /** The disciplines this person actually works in. */
  focus: string;
  bio: string;
  /** 400×400 duotone portrait in /public/team. */
  photo: string;
};

export const team: readonly Member[] = [
  {
    name: "Shabari K J",
    credential: "M.Com",
    focus: "Operations · Human resources · Finance",
    bio: "Twenty years of professional experience across operational management, human resources and finance. Shabari manages the functions that keep an engagement moving on time, and the practice running behind them.",
    photo: "/team/shabari-kj.webp",
  },
  {
    name: "Vinay Karlagere",
    credential: "Chartered Accountant",
    focus: "Income tax · Statutory and internal audit · Private equity",
    bio: "A qualified chartered accountant working on income tax matters, statutory and internal audits, and private equity investments, with a record of holding companies, partnership firms, trusts and individuals to their corporate law obligations. Holds a postgraduate degree in Investment and Risk Finance from the University of Westminster, London.",
    photo: "/team/vinay-karlagere.webp",
  },
  {
    name: "Akshay R. Jain",
    credential: "Associate Chartered Accountant",
    focus: "Tax audit · Accounting · Company law",
    bio: "Significant experience in tax audit and accounting, gained at Big Four firms and multinational corporations. Handles income tax matters, statutory and internal audits, private equity investments, and company law compliance for companies, partnerships, trusts and individuals.",
    photo: "/team/akshay-r-jain.webp",
  },
  {
    name: "Vagdev M R",
    credential: "Finance and accounts",
    focus: "Income tax · GST · TDS compliance",
    bio: "Over five years across income tax, GST and TDS compliance. His work on TDS covers accurate deduction and remittance within the statutory window — the obligation that attracts interest fastest when it slips — alongside experience on the operations side.",
    photo: "/team/vagdev-mr.webp",
  },
] as const;

export const teamIntro = {
  label: "The team",
  headline: "The people who will actually do the work.",
  standfirst:
    "A small practice means the person you meet is the person on your file. These are the four of them, what they are qualified in, and what they handle.",
} as const;
