/**
 * The service catalogue.
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
  feature?: boolean;
};

export const services: readonly Service[] = [
  {
    slug: "taxation",
    name: "Taxation",
    feature: true,
    summary:
      "Direct tax planning and filing for individuals, firms and companies. We structure your position before the year closes, not after it.",
    standfirst:
      "Most tax is decided by choices made months before a return is filed — how income is characterised, when an asset is sold, which entity holds what. We work on those choices. The filing is the last step, not the service.",
    audience:
      "Founders and promoters, resident and non-resident individuals with Indian income, partnership firms, LLPs and private companies.",
    points: [
      "Income tax returns",
      "Advance tax planning",
      "Capital gains structuring",
      "Assessments and appeals",
    ],
    sections: [
      {
        title: "Returns and computation",
        body: "Filing across every ITR form, with the computation reconciled to Form 26AS and the Annual Information Statement before anything is submitted — mismatches between AIS and the return are the single most common trigger for a notice.",
        items: [
          "ITR-1 to ITR-7, as the entity and income sources require",
          "Reconciliation against Form 26AS, AIS and TIS",
          "Revised and updated returns, including ITR-U under section 139(8A)",
          "Foreign asset and income reporting in Schedule FA",
        ],
      },
      {
        title: "Advance tax and withholding",
        body: "Advance tax falls in four instalments under sections 208 to 211, and interest under 234B and 234C accrues quietly when they are missed. We forecast the liability each quarter rather than reconstructing it in March.",
        items: [
          "Quarterly advance tax computation — 15 June, 15 September, 15 December, 15 March",
          "TDS and TCS compliance, deposit and quarterly returns in Forms 24Q, 26Q and 27Q",
          "Lower or nil deduction certificates under section 197",
          "Section 195 determinations on payments to non-residents",
        ],
      },
      {
        title: "Capital gains",
        body: "The difference between a well-timed disposal and a careless one is usually a year of holding period and a correctly claimed exemption. We model the outcome before the transaction, not after.",
        items: [
          "Holding period and indexation analysis, listed and unlisted",
          "Exemptions under sections 54, 54F and 54EC",
          "Slump sale and business transfer under section 50B",
          "ESOP taxation at exercise and at sale",
        ],
      },
      {
        title: "Assessment and litigation",
        body: "When a notice arrives, the reply is a drafting exercise with a deadline. We prepare the submission, assemble the evidence and appear on the faceless portal on your behalf.",
        items: [
          "Responses to intimations under section 143(1) and scrutiny under 143(2)",
          "Reassessment proceedings under sections 148 and 148A",
          "Appeals before the Commissioner (Appeals) in Form 35",
          "Rectification under section 154 and refund follow-up",
        ],
      },
    ],
    deliverables: [
      "A computation sheet showing every position taken and its basis",
      "Filed returns with acknowledgement and e-verification",
      "A quarterly advance tax memo before each instalment",
      "A written note on any position that could reasonably be questioned",
    ],
    statute: [
      { label: "Governing Act", value: "Income-tax Act, 1961" },
      { label: "Return due date", value: "31 July · non-audit cases" },
      { label: "Audit cases", value: "31 October" },
      { label: "Transfer pricing", value: "30 November" },
    ],
  },
  {
    slug: "audit",
    name: "Audit",
    summary:
      "Statutory, internal and tax audits conducted to ICAI standards, with findings written so you can act on them.",
    standfirst:
      "An audit that produces only an opinion has done half the job. We conduct the engagement to the Standards on Auditing and then tell you, in plain terms, what we found in your controls that you would want to fix whether or not the law required us to mention it.",
    audience:
      "Private and public companies, LLPs crossing the audit threshold, and businesses whose turnover brings them within section 44AB.",
    points: ["Statutory audit", "Tax audit", "Internal and stock audit"],
    sections: [
      {
        title: "Statutory audit",
        body: "The audit required of every company under the Companies Act, conducted under the Standards on Auditing issued by the ICAI, with reporting under section 143 and the Companies (Auditor's Report) Order.",
        items: [
          "Appointment and Form ADT-1 filing under section 139",
          "Audit report under section 143, with CARO 2020 reporting",
          "Verification of the accounting software audit trail, mandatory since FY 2023-24",
          "Reporting under Ind AS or Accounting Standards, as applicable",
        ],
      },
      {
        title: "Tax audit",
        body: "Required under section 44AB once turnover crosses the threshold — one crore for business, or ten crore where cash receipts and payments each stay within five per cent, and fifty lakh for a profession.",
        items: [
          "Form 3CA or 3CB with the Form 3CD annexure",
          "Clause-by-clause verification, including disallowances under section 40(a) and 43B",
          "Section 44AD and 44ADA presumptive scheme analysis where it applies",
          "Reconciliation of turnover reported under income tax and GST",
        ],
      },
      {
        title: "Internal and specialised audit",
        body: "Work commissioned by the board rather than required by statute: testing whether the controls you believe exist are the controls actually operating.",
        items: [
          "Internal audit under section 138 where prescribed",
          "Stock and fixed asset verification, physical count and reconciliation",
          "Concurrent audit of high-volume processes",
          "Management letter on control gaps, ranked by exposure",
        ],
      },
    ],
    deliverables: [
      "The signed audit report and annexures in the prescribed form",
      "A management letter listing control gaps, ranked by exposure",
      "The audit working papers file, retained and available on request",
      "A closing meeting with the board or promoters before anything is signed",
    ],
    statute: [
      { label: "Governing Acts", value: "Companies Act 2013 · Income-tax Act 1961" },
      { label: "Standards", value: "Standards on Auditing, ICAI" },
      { label: "Tax audit report", value: "30 September" },
      { label: "Business threshold", value: "₹1 crore · ₹10 crore where cash ≤ 5%" },
    ],
  },
  {
    slug: "gst",
    name: "GST",
    summary:
      "Registration, monthly and annual returns, input reconciliation and representation before the department.",
    standfirst:
      "Input tax credit is lost more often to reconciliation failure than to any deliberate act. Section 16(4) sets a hard deadline, GSTR-2B sets the ceiling, and credit that falls outside either is simply gone. We reconcile monthly so nothing expires unnoticed.",
    audience:
      "Registered businesses filing monthly or under QRMP, multi-state operations, exporters, and marketplace sellers reconciling TCS.",
    points: ["Registration", "GSTR-1, 3B and 9", "Input tax reconciliation"],
    sections: [
      {
        title: "Registration and structure",
        body: "Getting the registration footprint right at the start — which states, which place of business, whether composition or regular — avoids a restructuring exercise later.",
        items: [
          "New registration, amendment and additional place of business",
          "Composition scheme evaluation under section 10",
          "Letter of Undertaking for zero-rated export supply",
          "Input Service Distributor registration where the structure needs it",
        ],
      },
      {
        title: "Returns and reconciliation",
        body: "The monthly cycle, run on our calendar. GSTR-1 by the 11th, GSTR-3B by the 20th, and a full reconciliation of books against GSTR-2B before credit is claimed.",
        items: [
          "GSTR-1 and GSTR-3B, monthly or under the QRMP scheme",
          "GSTR-2B reconciliation against purchase register, with vendor follow-up",
          "GSTR-9 annual return and GSTR-9C reconciliation statement",
          "E-invoicing and e-way bill compliance where turnover requires it",
        ],
      },
      {
        title: "Refunds and department matters",
        body: "Refund claims and notices are both drafting exercises against a clock. We prepare the file, respond within the window, and appear where appearance is needed.",
        items: [
          "Refund of accumulated credit on exports and inverted duty structure",
          "Replies to ASMT-10 scrutiny and DRC-01 demand notices",
          "Departmental audit under section 65, and assistance through it",
          "Appeals before the Appellate Authority in Form APL-01",
        ],
      },
    ],
    deliverables: [
      "Filed returns with acknowledgement, every cycle",
      "A monthly reconciliation statement showing credit claimed against GSTR-2B",
      "A vendor exception list — who has not filed, and what it is costing you",
      "Notice replies drafted, filed and tracked to closure",
    ],
    statute: [
      { label: "Governing Act", value: "CGST Act, 2017" },
      { label: "GSTR-1", value: "11th of the following month" },
      { label: "GSTR-3B", value: "20th of the following month" },
      { label: "Annual return", value: "31 December" },
    ],
  },
  {
    slug: "accounting",
    name: "Accounting",
    summary:
      "Books kept to audit-ready standard and closed every month, with management reporting you can actually read.",
    standfirst:
      "Books that are only assembled at year end cost more to audit and tell you nothing while the year is running. We close monthly, which means the audit finds a finished set of accounts and you find out about a problem in March rather than the following December.",
    audience:
      "Companies and LLPs without an in-house finance team, and founders who want a monthly number they can trust.",
    points: ["Monthly close", "Payroll and TDS", "Management reporting"],
    sections: [
      {
        title: "Bookkeeping and monthly close",
        body: "A defined close calendar, run the same way every month, ending in a set of accounts that would survive an audit if one began that day.",
        items: [
          "Recording, classification and ledger scrutiny",
          "Bank, vendor and customer reconciliation",
          "Provisions, prepayments, depreciation under Schedule II",
          "Books maintained under Accounting Standards or Ind AS as applicable",
        ],
      },
      {
        title: "Payroll and statutory dues",
        body: "Salary processing with the withholding and contributions computed and deposited on time, because these are the dues that attract interest fastest.",
        items: [
          "Payroll processing, payslips and Form 16",
          "TDS on salary under section 192, deposited by the 7th",
          "Provident Fund and ESI computation and deposit by the 15th",
          "Professional tax registration and remittance",
        ],
      },
      {
        title: "Reporting",
        body: "A monthly pack written for the person who has to make a decision, not for the person who prepared it.",
        items: [
          "Profit and loss, balance sheet and cash flow",
          "Budget against actual, with variance explained in words",
          "Receivable and payable ageing",
          "Financial statements in Schedule III format at year end",
        ],
      },
    ],
    deliverables: [
      "A closed set of books within an agreed number of days each month",
      "A management pack: P&L, balance sheet, cash flow, ageing",
      "All statutory dues computed, deposited and evidenced",
      "Year-end financials in Schedule III format, audit-ready",
    ],
    statute: [
      { label: "Framework", value: "Companies Act 2013 · Schedule III" },
      { label: "Standards", value: "Ind AS or Accounting Standards" },
      { label: "TDS deposit", value: "7th of the following month" },
      { label: "PF and ESI", value: "15th of the following month" },
    ],
  },
  {
    slug: "business-advisory",
    name: "Business Advisory",
    summary:
      "Structuring, valuation and financial planning for owners making decisions with long consequences.",
    standfirst:
      "Some decisions are effectively irreversible: how the group is held, what a share is worth on the day it is issued, what a buyer finds when they look. These are the ones worth getting a second opinion on before they are made rather than after.",
    audience:
      "Promoters restructuring a group, companies raising or deploying capital, and buyers and sellers in a transaction.",
    points: ["Entity structuring", "Valuation", "Financial modelling"],
    sections: [
      {
        title: "Structuring",
        body: "Choosing and arranging the entities — which vehicle, held by whom, in which order — with the tax and compliance consequence of each option quantified before you commit.",
        items: [
          "Choice of vehicle: company, LLP, firm or trust",
          "Holding and subsidiary structures, and group reorganisation",
          "Conversion between forms, and its tax consequence",
          "Succession and family arrangement planning",
        ],
      },
      {
        title: "Valuation",
        body: "Valuation reports for the purposes that require one, prepared on the basis the relevant law prescribes rather than the one that flatters.",
        items: [
          "Fair market value under Rule 11UA for share issues and transfers",
          "Valuation for FEMA compliance on inbound and outbound investment",
          "Discounted cash flow, comparable company and net asset approaches",
          "Coordination with a registered valuer where the Companies Act requires one",
        ],
      },
      {
        title: "Transaction support",
        body: "The work either side of a deal: knowing what is in the numbers before the other party does.",
        items: [
          "Financial and tax due diligence, buy side and sell side",
          "Financial modelling and scenario analysis",
          "Deal structuring and the tax cost of each alternative",
          "Post-transaction integration of books and compliance",
        ],
      },
    ],
    deliverables: [
      "A written recommendation with each option costed in rupees",
      "Valuation reports in the form the relevant law requires",
      "A diligence report with findings ranked by materiality",
      "A financial model you keep, and can run yourself",
    ],
    statute: [
      { label: "Valuation", value: "Rule 11UA, Income-tax Rules 1962" },
      { label: "Registered valuers", value: "Companies (Registered Valuers) Rules, 2017" },
      { label: "Cross-border", value: "FEMA, 1999 and the NDI Rules" },
      { label: "Reorganisation", value: "Companies Act 2013 · sections 230-232" },
    ],
  },
  {
    slug: "roc-compliance",
    name: "ROC Compliance",
    summary:
      "Annual filings, board resolutions and statutory registers kept current with the Companies Act, 2013.",
    standfirst:
      "Registrar compliance is unglamorous and it is where penalties accumulate fastest — late filing fees run per day, without ceiling, and a lapsed director KYC deactivates the DIN. We keep the calendar so this becomes something you never think about.",
    audience:
      "Private and public companies, LLPs, and directors who need their own filings kept current.",
    points: [
      "Annual filings",
      "Board and shareholder resolutions",
      "Statutory registers",
    ],
    sections: [
      {
        title: "Annual filings",
        body: "The yearly cycle that follows the annual general meeting, each form with its own window measured from the date of that meeting.",
        items: [
          "AOC-4 — financial statements, within 30 days of the AGM",
          "MGT-7 or MGT-7A — annual return, within 60 days of the AGM",
          "ADT-1 — auditor appointment, within 15 days",
          "LLP Form 11 by 30 May and Form 8 by 30 October",
        ],
      },
      {
        title: "Event-based filings",
        body: "The filings triggered by something happening — an allotment, a charge, a change in the board — each with a short window that is easy to miss.",
        items: [
          "PAS-3 on allotment of shares",
          "CHG-1 and CHG-4 on creation and satisfaction of charges",
          "DIR-12 on appointment, resignation or change in the board",
          "MGT-14 for resolutions requiring filing",
        ],
      },
      {
        title: "Secretarial records",
        body: "The registers and minutes a company is required to maintain, kept properly rather than reconstructed the week before a diligence.",
        items: [
          "Statutory registers under section 88 — members, directors, charges",
          "Board and general meeting notices, agenda and minutes",
          "DIR-3 KYC for every director, by 30 September",
          "DPT-3 return on deposits and exempted receipts, by 30 June",
        ],
      },
    ],
    deliverables: [
      "Every form filed within its window, with the challan on file",
      "Registers and minute books maintained and current",
      "A compliance calendar for the year, shared at the start of it",
      "A diligence-ready secretarial file, available on demand",
    ],
    statute: [
      { label: "Governing Act", value: "Companies Act, 2013" },
      { label: "AOC-4", value: "30 days from the AGM" },
      { label: "MGT-7", value: "60 days from the AGM" },
      { label: "DIR-3 KYC", value: "30 September" },
    ],
  },
  {
    slug: "startup-advisory",
    name: "Startup Advisory",
    summary:
      "Incorporation, founder agreements, ESOP structuring and the diligence readiness your first institutional round will demand.",
    standfirst:
      "A round is won or delayed in the data room. Cap tables that do not reconcile, ESOP grants without board approval, share issues without a valuation report on file — none of these are hard to get right at the time, and all of them are expensive to fix under a term sheet.",
    audience:
      "Founders incorporating, companies preparing to raise, and startups already holding institutional capital.",
    points: ["Incorporation", "ESOP schemes", "Diligence readiness"],
    sections: [
      {
        title: "Incorporation and setup",
        body: "Getting the company on the register with the registrations it will need in its first year, rather than discovering them one at a time.",
        items: [
          "SPICe+ incorporation, with PAN, TAN, EPFO and ESIC in the same form",
          "Drafting the memorandum and articles for the intended structure",
          "Founder and shareholders' agreement, vesting and reverse vesting",
          "DPIIT startup recognition, and section 80-IAC deduction where eligible",
        ],
      },
      {
        title: "Equity and ESOPs",
        body: "Every issue of shares and every grant of options is a compliance event with a paper trail. We keep the trail complete so diligence finds it already assembled.",
        items: [
          "ESOP scheme drafting, board and shareholder approval, grant letters",
          "Cap table maintenance across rounds, with fully diluted working",
          "Rule 11UA valuation for each issue, on file before allotment",
          "Section 56(2)(viib) analysis — angel tax exposure and the exemption route",
        ],
      },
      {
        title: "Raising and reporting",
        body: "The filings a funding round triggers, including the foreign exchange reporting that catches most first-time founders.",
        items: [
          "PAS-3 and share certificates on allotment",
          "Form FC-GPR within 30 days of receiving foreign investment",
          "Annual FLA return to the Reserve Bank by 15 July",
          "Investor reporting pack, built once and reused each quarter",
        ],
      },
    ],
    deliverables: [
      "The incorporation file: certificate, PAN, TAN, registrations",
      "A cap table that reconciles to the register of members, maintained",
      "An ESOP scheme with every grant documented and approved",
      "A data room index, kept current between rounds",
    ],
    statute: [
      { label: "Incorporation", value: "Companies Act 2013 · SPICe+" },
      { label: "Angel tax", value: "Section 56(2)(viib), Income-tax Act" },
      { label: "FC-GPR", value: "30 days from receipt of funds" },
      { label: "FLA return", value: "15 July" },
    ],
  },
] as const;

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
