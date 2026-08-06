/**
 * The service catalogue.
 *
 * Three practices, and they are nested rather than parallel: CFO Advisory
 * contains everything in Compliance & Reporting, and Startup Advisory contains
 * everything in CFO Advisory. That containment is the most useful thing about
 * the structure, so it is modelled here as data — `includes` names the tier
 * below — and the site renders the relationship rather than repeating the
 * lists three times over.
 *
 * Written against Indian statute — the Income-tax Act 1961, the Companies Act
 * 2013, the CGST Act 2017 and the LLP Act 2008 — because a practice is judged
 * on whether it names the right form, not on adjectives. Statutory dates are
 * the standard positions and move when CBDT or CBIC extends them; the site
 * says so wherever a date appears.
 */

export type ServiceSection = {
  title: string;
  body: string;
  items: readonly string[];
};

export type Service = {
  slug: string;
  name: string;
  /** 1, 2, 3 — the rung on the ladder, rendered as the tier index. */
  tier: number;
  /** Slug of the practice this one contains in full, if any. */
  includes?: string;
  /** One line, for the card on the homepage. */
  summary: string;
  /** The opening paragraph of the service page. */
  standfirst: string;
  /** Who this is actually for. */
  audience: string;
  /** Short list shown on the homepage card. */
  points: readonly string[];
  /** The full breakdown, shown on the service page. */
  sections: readonly ServiceSection[];
  /** What lands in the client's hands. */
  deliverables: readonly string[];
  /** The statutory basis, rendered as a reference block. */
  statute: readonly { label: string; value: string }[];
};

export const services: readonly Service[] = [
  {
    slug: "compliance",
    name: "Compliance & Reporting",
    tier: 1,
    summary:
      "The recurring obligations every business carries — books, returns and financial statements, run to a calendar rather than against a deadline.",
    standfirst:
      "Compliance is not difficult work. It is unforgiving work. A return filed late, a credit claimed after its window has closed, a statement that does not reconcile — each costs materially more to remedy than it would have cost to complete on time. This practice therefore runs to a calendar, and a due date is never the first occasion on which anyone examines it.",
    audience:
      "Companies, LLPs, partnership firms and proprietors that require the statutory year administered properly — and any business that needs a lender-ready set of numbers.",
    points: [
      "Bookkeeping and accounting",
      "GST and TDS compliance",
      "Statements and returns",
      "Audit and projections",
    ],
    sections: [
      {
        title: "Bookkeeping and accounting",
        body: "Recorded and closed monthly rather than assembled at year end. It is what allows an audit to begin from a finished set of accounts, and it is the difference between identifying a problem in March and discovering it the following December.",
        items: [
          "Recording, classification and ledger scrutiny",
          "Bank, vendor and customer reconciliation",
          "Monthly close on an agreed calendar",
          "Books maintained under Accounting Standards or Ind AS",
        ],
      },
      {
        title: "GST — monthly and annual",
        body: "Input tax credit is lost more often to reconciliation failure than to any deliberate act. Section 16(4) sets a hard deadline and GSTR-2B sets the ceiling, so the books are matched against 2B before any credit is claimed.",
        items: [
          "GSTR-1 and GSTR-3B, monthly or under the QRMP scheme",
          "GSTR-2B reconciliation against the purchase register, with vendor follow-up",
          "GSTR-9 annual return and GSTR-9C reconciliation statement",
          "Registration, amendment and letters of undertaking for exports",
        ],
      },
      {
        title: "TDS — quarterly and annual",
        body: "Deducted at the correct rate, deposited by the 7th and reported each quarter. These are the liabilities that accrue interest fastest when missed, and the first item a buyer's due diligence examines.",
        items: [
          "Monthly deduction and deposit, including section 192 on salary",
          "Quarterly returns in Forms 24Q, 26Q and 27Q",
          "Form 16 and Form 16A issued on time",
          "Lower or nil deduction certificates under section 197",
        ],
      },
      {
        title: "Financial statements",
        body: "The year-end set, prepared in the form the Companies Act prescribes rather than the form the accounting package happens to produce.",
        items: [
          "Financial statements in Schedule III format",
          "Consolidation where the group requires it",
          "Notes and disclosures written to be read, not to be counted",
          "Depreciation under Schedule II, and the fixed asset register behind it",
        ],
      },
      {
        title: "Income tax returns",
        body: "Filed across every ITR form, with the computation reconciled to Form 26AS and the Annual Information Statement before anything is submitted — an AIS mismatch is the single most common trigger for a notice.",
        items: [
          "ITR-1 to ITR-7, as the entity and its income require",
          "Reconciliation against Form 26AS, AIS and TIS",
          "Quarterly advance tax computation before each instalment",
          "Revised and updated returns, including ITR-U under section 139(8A)",
        ],
      },
      {
        title: "Audit reports",
        body: "Prepared and reported where statute requires, in accordance with the Standards on Auditing — together with a management letter setting out what we found in your controls, whether or not the law obliged us to raise it.",
        items: [
          "Statutory audit reporting under section 143, with CARO 2020",
          "Tax audit under section 44AB — Form 3CA or 3CB with the 3CD annexure",
          "Internal and stock audit, physical count and reconciliation",
          "A management letter on control gaps, ranked by exposure",
        ],
      },
      {
        title: "Provisional and projected statements",
        body: "The statements a bank's credit team requires, in the form they expect, with the assumptions set out beside the figures rather than buried three tabs into a spreadsheet.",
        items: [
          "Provisional financial statements for the current year",
          "Projected statements across the sanction period",
          "CMA data for working capital and term loan proposals",
          "The ratio analysis the credit note will be built on",
        ],
      },
    ],
    deliverables: [
      "A closed set of books each month, to a calendar agreed at the start of the year",
      "Every return filed within its window, with the acknowledgement on file",
      "Financial statements in Schedule III format, audit-ready",
      "A compliance calendar for the year, issued before the year begins",
    ],
    statute: [
      { label: "Governing Acts", value: "Income-tax Act 1961 · CGST Act 2017" },
      { label: "GSTR-3B", value: "20th of the following month" },
      { label: "TDS deposit", value: "7th of the following month" },
      { label: "Return due date", value: "31 July · 31 October if audited" },
    ],
  },
  {
    slug: "cfo-advisory",
    name: "CFO Advisory",
    tier: 2,
    includes: "compliance",
    summary:
      "A finance function you do not have to build — structure, controls, cash and capital, with the full compliance cycle running beneath it.",
    standfirst:
      "There comes a point at which the question is no longer whether the returns were filed, but whether the business can account for its own numbers. That requires a finance function, and most companies need one well before they can justify appointing one. We provide it — structure, controls, cash, capital — with everything in Compliance & Reporting continuing beneath.",
    audience:
      "Companies beyond the point at which a founder keeps the books, groups requiring restructuring, and businesses raising, deploying or defending capital.",
    points: [
      "An end-to-end finance team",
      "Structuring and restructuring",
      "Cash and working capital",
      "Valuation and fundraising",
      "Internal control audit",
    ],
    sections: [
      {
        title: "Incorporation, structuring and restructuring",
        body: "Which vehicle, held by whom, in what order — with the tax and compliance consequence of each option quantified before you commit to any of them. These decisions are, in practice, irreversible.",
        items: [
          "Choice of vehicle: company, LLP, firm or trust",
          "Holding and subsidiary structures, and group reorganisation",
          "Conversion between forms, and its tax consequence",
          "Succession and family arrangement planning",
        ],
      },
      {
        title: "An end-to-end finance team",
        body: "Deployed rather than described. The people, the calendar and the reporting operate as your finance function — and transfer cleanly to an in-house team when there is one to receive it.",
        items: [
          "Accounts, compliance and reporting run as a single function",
          "A monthly pack written for the person making the decision",
          "Board and investor reporting, built once and reused each quarter",
          "Documented handover when you bring the function in-house",
        ],
      },
      {
        title: "Payroll advisory and compliance",
        body: "Salary processing with withholding and statutory contributions computed and deposited on time, and the structuring advice that sits behind the payslip.",
        items: [
          "Payroll processing, payslips and Form 130",
          "TDS on salary under section 392, deposited by the 7th",
          "Provident Fund and ESI computation and deposit by the 15th",
          "Salary structuring and professional tax registration",
        ],
      },
      {
        title: "Cash, receivables and payables",
        body: "The working capital cycle managed as a cycle: what is owed to you, what you owe, and what is in the account this week. Profitable businesses run short of cash for want of exactly this.",
        items: [
          "Cash flow forecasting, weekly and monthly",
          "Receivable ageing, follow-up and a credit policy that is enforced",
          "Payable scheduling against available cash",
          "Banking relationships and facility utilisation",
        ],
      },
      {
        title: "Internal control audit",
        body: "Testing whether the controls you believe exist are the controls in operation. Commissioned by the board rather than required by statute, which is precisely what makes it useful.",
        items: [
          "Process walkthroughs and control testing",
          "Segregation of duties and authorisation limits",
          "Concurrent audit of high-volume processes",
          "A findings report ranked by exposure rather than by page order",
        ],
      },
      {
        title: "Valuation and fundraising",
        body: "Valuation prepared on the basis the relevant law prescribes rather than the one that flatters, together with the file a funding round will expect to see.",
        items: [
          "Fair market value under Rule 11UA for issues and transfers",
          "Discounted cash flow, comparable company and net asset approaches",
          "Financial modelling and scenario analysis",
          "Data room, diligence support and investor reporting",
        ],
      },
      {
        title: "Mergers and acquisitions",
        body: "The work on either side of a transaction: understanding what is in the numbers before the other party does.",
        items: [
          "Financial and tax due diligence, buy side and sell side",
          "Deal structuring and the tax cost of each alternative",
          "Schemes of arrangement under sections 230 to 232",
          "Post-transaction integration of books and compliance",
        ],
      },
    ],
    deliverables: [
      "A finance function running to a calendar you can see",
      "A monthly board pack: profit and loss, balance sheet, cash flow, ageing",
      "Valuation and diligence reports in the form the relevant law requires",
      "A financial model you keep, and can run yourself",
    ],
    statute: [
      { label: "Valuation", value: "Rule 11UA, Income-tax Rules 1962" },
      { label: "Registered valuers", value: "Companies (Registered Valuers) Rules, 2017" },
      { label: "Reorganisation", value: "Companies Act 2013 · sections 230-232" },
      { label: "Cross-border", value: "FEMA 1999 and the NDI Rules" },
    ],
  },
  {
    slug: "startup-advisory",
    name: "Startup Advisory",
    tier: 3,
    includes: "cfo-advisory",
    summary:
      "From incorporation to the data room — recognition, capitalisation table, ESOPs and the legal file, with the full CFO function behind it.",
    standfirst:
      "A round is won or delayed in the data room. Capitalisation tables that do not reconcile, ESOP grants without board approval, share issues without a valuation report on file — none is difficult to get right at the time, and each is expensive to remedy under a term sheet. We establish it correctly on day one and maintain it between rounds.",
    audience:
      "Founders at incorporation, companies preparing to raise, and startups already holding institutional capital.",
    points: [
      "Incorporation and structure",
      "DPIIT and grant assistance",
      "Capital structuring and ESOPs",
      "Legal assistance",
    ],
    sections: [
      {
        title: "Incorporation and organisation structure",
        body: "Placing the company on the register with the registrations it will require in its first year, and settling the founder arrangements while everyone is still in agreement.",
        items: [
          "SPICe+ incorporation, with PAN, TAN, EPFO and ESIC in the same form",
          "Memorandum and articles drafted for the structure you intend",
          "Founders' and shareholders' agreement, vesting and reverse vesting",
          "Advice on the holding structure before the first round, not after it",
        ],
      },
      {
        title: "DPIIT recognition and grant assistance",
        body: "The recognitions and schemes a startup is entitled to, applied for properly. Most applications are refused on documentation rather than on merit.",
        items: [
          "DPIIT startup recognition",
          "Section 80-IAC deduction, where eligible",
          "Startup India Seed Fund and state scheme applications",
          "Angel tax position under section 56(2)(viib), and the exemption route",
        ],
      },
      {
        title: "Capital structuring and ESOP management",
        body: "Every issue of shares and every grant of options is a compliance event with a documentary trail. We keep that trail complete, so due diligence finds it already assembled.",
        items: [
          "Cap table maintenance across rounds, on a fully diluted basis",
          "ESOP scheme drafting, board and shareholder approval, grant letters",
          "Rule 11UA valuation on file before each allotment",
          "PAS-3, share certificates, and FC-GPR within 30 days of receipt",
        ],
      },
      {
        title: "Legal assistance",
        body: "The agreements and filings a young company enters into before it has a general counsel — prepared with the tax and compliance consequences already considered, and referred to counsel where a matter requires it.",
        items: [
          "Term sheet and shareholders' agreement review",
          "Commercial contracts, employment and consultancy agreements",
          "ROC filings, statutory registers and minute books kept current",
          "Coordination with external counsel on matters that require it",
        ],
      },
    ],
    deliverables: [
      "The incorporation file: certificate, PAN, TAN, every registration",
      "A capitalisation table that reconciles to the register of members, maintained",
      "An ESOP scheme with every grant documented and approved",
      "A data room index, kept current between rounds",
    ],
    statute: [
      { label: "Incorporation", value: "Companies Act 2013 · SPICe+" },
      { label: "Recognition", value: "DPIIT · Startup India" },
      { label: "Angel tax", value: "Section 56(2)(viib), Income-tax Act" },
      { label: "FC-GPR", value: "30 days from receipt of funds" },
    ],
  },
] as const;

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

/**
 * The practices this one contains, outermost first. Startup Advisory contains
 * CFO Advisory, which contains Compliance & Reporting — so a page can say what
 * it carries without the catalogue having to repeat itself.
 */
export function containedBy(service: Service): readonly Service[] {
  const chain: Service[] = [];
  let current = service.includes ? getService(service.includes) : undefined;
  while (current) {
    chain.push(current);
    current = current.includes ? getService(current.includes) : undefined;
  }
  return chain;
}
