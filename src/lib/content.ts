/**
 * Single source of truth for every word and figure on the site.
 * Firm details are taken from the practice's existing published contact card.
 */

export const firm = {
  name: "TaxWise Consultants",
  legalName: "TaxWise Consultants",
  descriptor: "Chartered Accountants",
  city: "Bangalore",
  managingPartner: "HK Vinay",
  managingPartnerTitle: "Managing Partner",
  founded: "2015",
  url: "https://twchartered.com",
  address: {
    street: "307, 1st Floor, 14th Main Road",
    locality: "RMV Extension, Sadhashivnagar",
    region: "Karnataka",
    city: "Bangalore",
    postalCode: "560080",
    country: "IN",
  },
  phonePartner: "+919590360434",
  phoneFirm: "+919740540239",
  emailPartner: "cavinaykarlagere@twchartered.com",
  emailFirm: "taxxwiseconsultants@gmail.com",
  mapsUrl:
    "https://maps.google.com/?q=307+1st+Floor+14th+Main+Road+RMV+Extension+Sadhashivnagar+Bangalore",
} as const;

export const whatsappUrl = `https://wa.me/${firm.phonePartner.replace(
  "+",
  ""
)}?text=${encodeURIComponent(
  "Hello — I'd like to arrange a consultation with TaxWise Consultants."
)}`;

/** Formats +919590360434 as +91 95903 60434 */
export function displayPhone(e164: string) {
  const digits = e164.replace(/\D/g, "").slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export const hero = {
  eyebrow: "Chartered Accountants · Bangalore",
  headlineLead: "Where strategy",
  headlineEmphasis: "meets certainty.",
  standfirst:
    "TaxWise Consultants is a chartered accountancy practice in Bangalore. We handle audit, tax and compliance for founders, family offices and companies that cannot afford to get it wrong.",
  primaryCta: "Book a consultation",
  secondaryCta: "Explore services",
} as const;

export const stats = [
  { figure: "10", suffix: "+", label: "Years in practice", detail: "Established 2015" },
  { figure: "500", suffix: "+", label: "Clients advised", detail: "Individuals and companies" },
  { figure: "50", prefix: "₹", suffix: "Cr+", label: "Tax lawfully saved", detail: "Across all engagements" },
  { figure: "100", suffix: "%", label: "Compliance record", detail: "No filing missed to date" },
] as const;

/**
 * Reasons, each carrying one figure. Deliberately different figures from the
 * hero band so the page never states the same number twice.
 */
export const why = [
  {
    figure: "1",
    unit: "partner on every file",
    body: "Your engagement is run by a chartered accountant who knows it, from the first call to the final filing. Nothing is passed down to an associate you have never met.",
  },
  {
    figure: "8",
    unit: "sectors in active practice",
    body: "From SaaS ESOPs to joint development agreements, we have already met the problem your sector produces — and know which position survives an assessment.",
  },
  {
    figure: "0",
    unit: "deadlines missed since 2015",
    body: "Statutory dates sit on our calendar with reminders that start weeks out. In ten years of practice we have not filed a single return late.",
  },
  {
    figure: "24h",
    unit: "reply, on working days",
    body: "Questions get answered the same or next working day. If something needs longer, you are told when to expect it rather than left waiting.",
  },
] as const;

export type Service = {
  slug: string;
  name: string;
  summary: string;
  detail: string;
  points: readonly string[];
  feature?: boolean;
};

export const services: readonly Service[] = [
  {
    slug: "taxation",
    name: "Taxation",
    summary:
      "Direct tax planning and filing for individuals, firms and companies. We structure your position before the year closes, not after it.",
    detail:
      "Most tax is decided by choices made months before the return is filed. We work on the decision, not the paperwork that follows it.",
    points: ["Income tax returns", "Advance tax planning", "Capital gains structuring", "Assessments and appeals"],
    feature: true,
  },
  {
    slug: "audit",
    name: "Audit",
    summary:
      "Statutory, internal and tax audits conducted to ICAI standards, with findings written so you can act on them.",
    detail: "",
    points: ["Statutory audit", "Tax audit", "Internal and stock audit"],
  },
  {
    slug: "gst",
    name: "GST",
    summary:
      "Registration, monthly and annual returns, input reconciliation and representation before the department.",
    detail: "",
    points: ["Registration", "GSTR-1, 3B and 9", "Input tax reconciliation"],
  },
  {
    slug: "accounting",
    name: "Accounting",
    summary:
      "Books kept to audit-ready standard and closed every month, with management reporting you can actually read.",
    detail: "",
    points: ["Monthly close", "Payroll and TDS", "Management reporting"],
  },
  {
    slug: "business-advisory",
    name: "Business Advisory",
    summary:
      "Structuring, valuation and financial planning for owners making decisions with long consequences.",
    detail: "",
    points: ["Entity structuring", "Valuation", "Financial modelling"],
  },
  {
    slug: "roc-compliance",
    name: "ROC Compliance",
    summary:
      "Annual filings, board resolutions and statutory registers kept current with the Companies Act, 2013.",
    detail: "",
    points: ["Annual filings", "Board and shareholder resolutions", "Statutory registers"],
  },
  {
    slug: "startup-advisory",
    name: "Startup Advisory",
    summary:
      "Incorporation, founder agreements, ESOP structuring and the diligence readiness your first institutional round will demand.",
    detail: "",
    points: ["Incorporation", "ESOP schemes", "Diligence readiness"],
  },
] as const;

export const process = [
  {
    step: "01",
    name: "Consultation",
    body: "We start with your position — what you own, what you owe, and what you are planning next.",
  },
  {
    step: "02",
    name: "Assessment",
    body: "We review filings, books and structure to find both exposure and opportunity, and tell you which is urgent.",
  },
  {
    step: "03",
    name: "Strategy",
    body: "You receive a written plan with the tax and compliance impact of each option quantified in rupees.",
  },
  {
    step: "04",
    name: "Execution",
    body: "We file, register and represent. Deadlines sit on our calendar, not yours.",
  },
  {
    step: "05",
    name: "Review",
    body: "Quarterly reviews keep the plan intact as the law, and your business, keep moving.",
  },
] as const;

export const industries = [
  { name: "Technology & SaaS", note: "ESOPs, transfer pricing, export benefits" },
  { name: "Manufacturing", note: "Input credit, stock audit, capex planning" },
  { name: "Real Estate", note: "Joint development, capital gains, RERA accounts" },
  { name: "Healthcare", note: "Professional income, clinic structuring" },
  { name: "Professional Services", note: "Partnership structuring, presumptive taxation" },
  { name: "Retail & E-commerce", note: "Marketplace GST, TCS reconciliation" },
  { name: "Hospitality", note: "Multi-outlet compliance, licensing" },
  { name: "Trusts & Non-Profit", note: "12A and 80G, FCRA, annual returns" },
] as const;

/**
 * Placeholder testimonials — attributed by role and sector only.
 * Replace with real, approved client quotes before launch.
 */
export const testimonials = [
  {
    quote:
      "They found a restructuring option our previous auditor never raised. It changed what we owed that year, and every year since.",
    role: "Founder",
    context: "SaaS company · Bangalore",
  },
  {
    quote:
      "Three entities, two states, one GST mess. It took them a quarter to clean up and it has stayed clean for four years.",
    role: "Finance Director",
    context: "Manufacturing group · Karnataka",
  },
  {
    quote:
      "Our diligence pack was ready before the term sheet arrived. The round closed without a single accounting query.",
    role: "Co-founder",
    context: "Series A startup · Bangalore",
  },
] as const;

export const about = {
  label: "The firm",
  headline: "A practice built on being right the first time.",
  body: [
    `${firm.name} is a chartered accountancy practice in ${firm.city}, led by ${firm.managingPartner}, ${firm.managingPartnerTitle}. We have advised more than five hundred individuals and businesses over the past decade.`,
    "We are deliberately small. Every engagement is handled by a qualified chartered accountant who knows your file, so you are never explaining your own business back to a new associate.",
    "The work is unglamorous and exact: a return that withstands scrutiny, a set of books that closes on time, a structure that still makes sense three years from now. That is what we are for.",
  ],
  credentials: [
    { label: "Institute", value: "ICAI member firm" },
    { label: "Practice since", value: "2015" },
    { label: "Office", value: "RMV Extension, Bangalore" },
    { label: "Engagement lead", value: `${firm.managingPartner}, FCA` },
  ],
} as const;

export const finalCta = {
  label: "Start here",
  headline: "Tell us what you are planning.",
  body: "A first consultation is a conversation about your position and what it will cost you to get it wrong. No charge, no obligation.",
} as const;

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#process" },
  { label: "Firm", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;
