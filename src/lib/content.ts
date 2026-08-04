/**
 * Single source of truth for every word and figure on the site.
 * Firm details are taken from the practice's existing published contact card.
 */

/**
 * The practice is a partnership, not one accountant's firm. There is
 * deliberately no `managingPartner` field and no personal contact detail here:
 * the site carries the office line and the office address only, and the people
 * are introduced as partners in `team.ts`. Removing the fields rather than
 * blanking them means nothing can quietly reference them again.
 */
export const firm = {
  name: "TaxWise",
  legalName: "TaxWise",
  descriptor: "Finance and Tax Advisory",
  constitution: "Partnership",
  /** Where the head office is. The practice itself works worldwide. */
  city: "Bangalore",
  areaServed: "Worldwide",
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
  /** The office line and the office address. No personal numbers. */
  phone: "+919740540239",
  email: "info@twchartered.com",
  /**
   * The firm's own Google Maps link — its verified listing, supplied by the
   * practice. Preferred over a search-by-address URL, which only guesses at
   * the place from a text string.
   */
  mapsUrl: "https://maps.app.goo.gl/djf1imNEaAoifZmd9",
  /** Taken from the map embed on the firm's existing site. */
  coords: { lat: 13.0137413, lng: 77.5743894 },
} as const;

/**
 * Where "Get directions" goes.
 *
 * The firm's own listing rather than a coordinate route: opening the verified
 * place is guaranteed to be the right office, and Maps offers directions from
 * there in one tap. The coordinates below came from the previous site's embed
 * and have not been checked against this listing, so routing straight to them
 * would be trusting the older, less certain source.
 */
export const directionsUrl = firm.mapsUrl;

/**
 * The embed from the firm's existing site, which resolves to the office rather
 * than to a dropped pin. Only ever requested after the visitor asks for it —
 * see `Location`.
 */
export const mapEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.3441720941073!2d77.57438937484213!3d13.01374128730553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17ccfaa3dd93%3A0x768a45c4332b495d!2s307%2C%2014th%20Main%20Rd%2C%20Raj%20Mahal%20Vilas%20Extension%2C%20Armane%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560080!5e0!3m2!1sen!2sin!4v1729590026911!5m2!1sen!2sin";

/** Degrees-minutes for the placeholder. Set in mono, like everything numeric. */
export const coordsLabel = "13.0137° N · 77.5744° E";

export const location = {
  label: "Location",
  headline: "Where to find us.",
  standfirst:
    "The head office is in RMV Extension, off 14th Main. Most first meetings happen here; if you are elsewhere in India or abroad, we work remotely and meet where it suits you.",
} as const;

export const whatsappUrl = `https://wa.me/${firm.phone.replace(
  "+",
  ""
)}?text=${encodeURIComponent(
  `Hello — I'd like to arrange a consultation with ${firm.name}.`
)}`;

/** Formats +919590360434 as +91 95903 60434 */
export function displayPhone(e164: string) {
  const digits = e164.replace(/\D/g, "").slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export const hero = {
  eyebrow: `${firm.descriptor} · ${firm.city}`,
  headlineLead: "Where strategy",
  headlineEmphasis: "meets certainty.",
  standfirst:
    "TaxWise is a finance and tax advisory firm with its head office in Bangalore, working with clients worldwide. We handle tax, accounting and compliance for founders, family offices and companies that cannot afford to get it wrong.",
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
    body: "Your engagement is run by a partner who knows it, from the first call to the final filing. Nothing is passed down to an associate you have never met.",
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
    `${firm.name} is a finance and tax advisory firm run as a partnership, with its head office in ${firm.city} and clients across India and overseas. We have advised more than five hundred individuals and businesses over the past decade.`,
    "We are deliberately small. Every engagement is handled by a partner who knows your file, so you are never explaining your own business back to a new associate.",
    "The work is unglamorous and exact: a return that withstands scrutiny, a set of books that closes on time, a structure that still makes sense three years from now. That is what we are for.",
  ],
  credentials: [
    { label: "Practice", value: "Finance and tax advisory" },
    { label: "Practice since", value: "2015" },
    { label: "Head office", value: "RMV Extension, Bangalore" },
    { label: "Clients", value: "India and overseas" },
    { label: "Constitution", value: "Partnership firm" },
  ],
} as const;

export const finalCta = {
  label: "Start here",
  headline: "Tell us what you are planning.",
  body: "A first consultation is a conversation about your position and what it will cost you to get it wrong. No charge, no obligation.",
} as const;

/**
 * Root-relative so the same nav works from a service page as from home.
 *
 * The order follows the order the sections appear on the page, so the
 * scrollspy underline travels left to right as you read rather than jumping
 * back and forth.
 */
export const nav = [
  { label: "Services", href: "/#services" },
  { label: "Approach", href: "/#process" },
  { label: "Calendar", href: "/#calendar" },
  { label: "Firm", href: "/#about" },
  { label: "Team", href: "/#team" },
  { label: "Contact", href: "/#contact" },
] as const;
