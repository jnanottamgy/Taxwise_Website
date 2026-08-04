/**
 * The statutory calendar.
 *
 * One flat list of obligations, each either recurring monthly (no `month`) or
 * falling on one date in the year. Every view on the site — the month grid,
 * what is due next, the year at a glance, the calendar file you can download —
 * is derived from this list, so a date is corrected in exactly one place.
 *
 * These are the standard due dates under Indian direct and indirect tax law,
 * the Companies Act and the labour codes. CBDT and CBIC extend them from time
 * to time, and a few move relative to a company's own AGM date rather than the
 * calendar — so the page states plainly that this is a reference, not a
 * substitute for advice.
 */

export type Authority = "Income tax" | "GST" | "MCA" | "Labour" | "RBI";

/** Filter order, and the order tags appear in a list. */
export const authorities: readonly Authority[] = [
  "Income tax",
  "GST",
  "MCA",
  "Labour",
  "RBI",
];

export type Obligation = {
  /** Day of the month, 1-31. */
  day: number;
  /** 1-12. Omitted where the obligation falls every month. */
  month?: number;
  form: string;
  detail: string;
  authority: Authority;
};

export const obligations: readonly Obligation[] = [
  // ── Every month ─────────────────────────────────────────────────────
  {
    day: 7,
    form: "TDS and TCS deposit",
    detail: "Tax deducted in the previous month, paid to the credit of the Government.",
    authority: "Income tax",
  },
  {
    day: 11,
    form: "GSTR-1",
    detail: "Outward supplies for the previous month, for monthly filers.",
    authority: "GST",
  },
  {
    day: 13,
    form: "IFF and quarterly GSTR-1",
    detail: "Invoice furnishing facility, and quarterly GSTR-1 for filers under QRMP.",
    authority: "GST",
  },
  {
    day: 15,
    form: "Provident Fund and ESI",
    detail: "Employer and employee contributions for the previous month.",
    authority: "Labour",
  },
  {
    day: 20,
    form: "GSTR-3B",
    detail: "Summary return and payment of tax, for monthly filers.",
    authority: "GST",
  },
  {
    day: 25,
    form: "PMT-06",
    detail: "Monthly payment of tax for taxpayers under the QRMP scheme.",
    authority: "GST",
  },

  // ── April ───────────────────────────────────────────────────────────
  {
    day: 30,
    month: 4,
    form: "TDS deposit — March",
    detail: "Deduction for March is deposited by 30 April, not by the usual 7th.",
    authority: "Income tax",
  },

  // ── May ─────────────────────────────────────────────────────────────
  {
    day: 30,
    month: 5,
    form: "LLP Form 11",
    detail: "Annual return of an LLP, for the year ended 31 March.",
    authority: "MCA",
  },
  {
    day: 31,
    month: 5,
    form: "TDS returns — Q4",
    detail: "Forms 24Q, 26Q and 27Q for January to March.",
    authority: "Income tax",
  },

  // ── June ────────────────────────────────────────────────────────────
  {
    day: 15,
    month: 6,
    form: "Advance tax — first instalment",
    detail: "15 per cent of the estimated liability for the year.",
    authority: "Income tax",
  },
  {
    day: 15,
    month: 6,
    form: "Form 16",
    detail: "Salary TDS certificates issued to employees.",
    authority: "Income tax",
  },
  {
    day: 30,
    month: 6,
    form: "DPT-3",
    detail: "Return of deposits and exempted receipts held on 31 March.",
    authority: "MCA",
  },

  // ── July ────────────────────────────────────────────────────────────
  {
    day: 15,
    month: 7,
    form: "FLA return",
    detail: "Foreign liabilities and assets, filed with the Reserve Bank.",
    authority: "RBI",
  },
  {
    day: 31,
    month: 7,
    form: "Income tax return",
    detail: "Non-audit cases — individuals, firms and companies not subject to audit.",
    authority: "Income tax",
  },
  {
    day: 31,
    month: 7,
    form: "TDS returns — Q1",
    detail: "Forms 24Q, 26Q and 27Q for April to June.",
    authority: "Income tax",
  },

  // ── September ───────────────────────────────────────────────────────
  {
    day: 15,
    month: 9,
    form: "Advance tax — second instalment",
    detail: "Cumulative 45 per cent of the estimated liability.",
    authority: "Income tax",
  },
  {
    day: 30,
    month: 9,
    form: "Tax audit report",
    detail: "Form 3CA or 3CB with the 3CD annexure, under section 44AB.",
    authority: "Income tax",
  },
  {
    day: 30,
    month: 9,
    form: "Annual general meeting",
    detail: "Last date for a company with a 31 March year end. Several MCA filings run from it.",
    authority: "MCA",
  },
  {
    day: 30,
    month: 9,
    form: "DIR-3 KYC",
    detail: "Every director holding a DIN. A lapse deactivates the DIN.",
    authority: "MCA",
  },

  // ── October ─────────────────────────────────────────────────────────
  {
    day: 29,
    month: 10,
    form: "AOC-4",
    detail: "Financial statements, within 30 days of the AGM.",
    authority: "MCA",
  },
  {
    day: 30,
    month: 10,
    form: "LLP Form 8",
    detail: "Statement of account and solvency for an LLP.",
    authority: "MCA",
  },
  {
    day: 31,
    month: 10,
    form: "Income tax return",
    detail: "Audit cases.",
    authority: "Income tax",
  },
  {
    day: 31,
    month: 10,
    form: "TDS returns — Q2",
    detail: "Forms 24Q, 26Q and 27Q for July to September.",
    authority: "Income tax",
  },
  {
    day: 31,
    month: 10,
    form: "Form 3CEB",
    detail: "Transfer pricing report, where the provisions apply.",
    authority: "Income tax",
  },

  // ── November ────────────────────────────────────────────────────────
  {
    day: 28,
    month: 11,
    form: "MGT-7 or MGT-7A",
    detail: "Annual return, within 60 days of the AGM.",
    authority: "MCA",
  },
  {
    day: 30,
    month: 11,
    form: "Income tax return",
    detail: "Cases carrying transfer pricing obligations.",
    authority: "Income tax",
  },

  // ── December ────────────────────────────────────────────────────────
  {
    day: 15,
    month: 12,
    form: "Advance tax — third instalment",
    detail: "Cumulative 75 per cent of the estimated liability.",
    authority: "Income tax",
  },
  {
    day: 31,
    month: 12,
    form: "GSTR-9 and GSTR-9C",
    detail: "Annual return and reconciliation statement for the previous financial year.",
    authority: "GST",
  },
  {
    day: 31,
    month: 12,
    form: "Belated and revised returns",
    detail: "Last date for the assessment year then current.",
    authority: "Income tax",
  },

  // ── January ─────────────────────────────────────────────────────────
  {
    day: 31,
    month: 1,
    form: "TDS returns — Q3",
    detail: "Forms 24Q, 26Q and 27Q for October to December.",
    authority: "Income tax",
  },

  // ── March ───────────────────────────────────────────────────────────
  {
    day: 15,
    month: 3,
    form: "Advance tax — final instalment",
    detail: "The full estimated liability for the year.",
    authority: "Income tax",
  },
  {
    day: 31,
    month: 3,
    form: "Financial year ends",
    detail: "Books are closed, and updated returns under section 139(8A) fall due.",
    authority: "Income tax",
  },
];

/** An obligation resolved onto a real date. */
export type Occurrence = Obligation & {
  year: number;
  /** 1-12, resolved. */
  onMonth: number;
  /** True where this is one of the monthly recurring obligations. */
  recurring: boolean;
  /** Local midnight on the due date. */
  date: Date;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function monthName(month: number) {
  return MONTHS[month - 1];
}

/** Days in a month, with the leap year handled by the Date constructor. */
export function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function toOccurrence(o: Obligation, year: number, month: number): Occurrence {
  // Only relevant defensively: no recurring obligation falls after the 25th.
  const day = Math.min(o.day, daysInMonth(year, month));
  return {
    ...o,
    year,
    onMonth: month,
    recurring: o.month === undefined,
    date: new Date(year, month - 1, day),
  };
}

/**
 * Every obligation falling in one month, in date order. Recurring obligations
 * appear in every month, which is the honest rendering — a monthly return is
 * genuinely due in August as well as in April.
 */
export function occurrencesIn(year: number, month: number): Occurrence[] {
  return obligations
    .filter((o) => o.month === undefined || o.month === month)
    .map((o) => toOccurrence(o, year, month))
    .sort((a, b) => a.date.getTime() - b.date.getTime() || a.form.localeCompare(b.form));
}

/**
 * The next `count` obligations falling on or after `from`. Scans forward a
 * month at a time so a date in late December still finds January.
 */
export function nextFrom(from: Date, count: number, filter?: Authority | null): Occurrence[] {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const out: Occurrence[] = [];
  let year = start.getFullYear();
  let month = start.getMonth() + 1;

  for (let step = 0; step < 14 && out.length < count; step++) {
    for (const occ of occurrencesIn(year, month)) {
      if (occ.date < start) continue;
      if (filter && occ.authority !== filter) continue;
      out.push(occ);
      if (out.length === count) break;
    }
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return out;
}

/** Whole days from `from` to `to`, both taken at local midnight. */
export function daysUntil(from: Date, to: Date) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** "Today", "Tomorrow", "In 9 days" — the phrasing a reader actually wants. */
export function countdownLabel(days: number) {
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

export const calendarNote =
  "Standard statutory dates. Extensions are issued from time to time, and filings tied to the annual general meeting move with it. We track your actual dates against your own AGM and turnover.";
