/**
 * The statutory calendar.
 *
 * These are the standard due dates under Indian direct and indirect tax law and
 * the Companies Act. CBDT and CBIC extend them from time to time, and a few
 * move relative to a company's own AGM date rather than the calendar — so the
 * page states plainly that this is a reference, not a substitute for advice.
 */

export type Obligation = {
  /** Day of the month, or the date within the year. */
  day: string;
  form: string;
  detail: string;
  /** Which body the obligation runs to. */
  authority: "Income tax" | "GST" | "MCA" | "Labour" | "RBI";
};

/** Obligations that recur every month. */
export const monthly: readonly Obligation[] = [
  {
    day: "07",
    form: "TDS and TCS deposit",
    detail: "Tax deducted in the previous month, paid to the credit of the Government.",
    authority: "Income tax",
  },
  {
    day: "11",
    form: "GSTR-1",
    detail: "Outward supplies for the previous month, for monthly filers.",
    authority: "GST",
  },
  {
    day: "13",
    form: "IFF / GSTR-1",
    detail: "Invoice furnishing facility, and quarterly GSTR-1 for QRMP filers.",
    authority: "GST",
  },
  {
    day: "15",
    form: "Provident Fund and ESI",
    detail: "Employer and employee contributions for the previous month.",
    authority: "Labour",
  },
  {
    day: "20",
    form: "GSTR-3B",
    detail: "Summary return and payment of tax, for monthly filers.",
    authority: "GST",
  },
  {
    day: "25",
    form: "PMT-06",
    detail: "Monthly payment of tax for taxpayers under the QRMP scheme.",
    authority: "GST",
  },
];

export type YearEntry = {
  month: string;
  short: string;
  entries: readonly { date: string; form: string; note: string }[];
};

/** The annual cycle, running from the start of the financial year in April. */
export const year: readonly YearEntry[] = [
  {
    month: "April",
    short: "Apr",
    entries: [
      { date: "30", form: "TDS — Q4 deposit", note: "Deduction for March, paid by 30 April." },
    ],
  },
  {
    month: "May",
    short: "May",
    entries: [
      { date: "30", form: "LLP Form 11", note: "Annual return of an LLP for the year ended 31 March." },
      { date: "31", form: "TDS returns — Q4", note: "Forms 24Q, 26Q and 27Q for January to March." },
    ],
  },
  {
    month: "June",
    short: "Jun",
    entries: [
      { date: "15", form: "Advance tax — first instalment", note: "15 per cent of the estimated liability." },
      { date: "15", form: "Form 16", note: "Salary TDS certificates issued to employees." },
      { date: "30", form: "DPT-3", note: "Return of deposits and exempted receipts." },
    ],
  },
  {
    month: "July",
    short: "Jul",
    entries: [
      { date: "15", form: "FLA return", note: "Foreign liabilities and assets, to the Reserve Bank." },
      { date: "31", form: "Income tax return", note: "Non-audit cases, individuals and firms." },
      { date: "31", form: "TDS returns — Q1", note: "April to June." },
    ],
  },
  {
    month: "September",
    short: "Sep",
    entries: [
      { date: "15", form: "Advance tax — second instalment", note: "Cumulative 45 per cent." },
      { date: "30", form: "Tax audit report", note: "Form 3CA or 3CB with the 3CD annexure." },
      { date: "30", form: "Annual general meeting", note: "Last date for companies with a March year end." },
      { date: "30", form: "DIR-3 KYC", note: "Every director holding a DIN." },
    ],
  },
  {
    month: "October",
    short: "Oct",
    entries: [
      { date: "29", form: "AOC-4", note: "Financial statements, within 30 days of the AGM." },
      { date: "30", form: "LLP Form 8", note: "Statement of account and solvency." },
      { date: "31", form: "Income tax return", note: "Audit cases." },
      { date: "31", form: "Form 3CEB", note: "Transfer pricing report, where applicable." },
    ],
  },
  {
    month: "November",
    short: "Nov",
    entries: [
      { date: "28", form: "MGT-7", note: "Annual return, within 60 days of the AGM." },
      { date: "30", form: "Income tax return", note: "Cases with transfer pricing obligations." },
    ],
  },
  {
    month: "December",
    short: "Dec",
    entries: [
      { date: "15", form: "Advance tax — third instalment", note: "Cumulative 75 per cent." },
      { date: "31", form: "GSTR-9 and GSTR-9C", note: "Annual return and reconciliation statement." },
      { date: "31", form: "Belated and revised returns", note: "For the assessment year then current." },
    ],
  },
  {
    month: "January",
    short: "Jan",
    entries: [{ date: "31", form: "TDS returns — Q3", note: "October to December." }],
  },
  {
    month: "March",
    short: "Mar",
    entries: [
      { date: "15", form: "Advance tax — final instalment", note: "The full estimated liability." },
      { date: "31", form: "Financial year ends", note: "Books closed; updated returns under 139(8A) fall due." },
    ],
  },
];

export const calendarNote =
  "Standard statutory dates. Extensions are issued from time to time, and filings tied to the annual general meeting move with it. We track your actual dates against your own AGM and turnover.";
