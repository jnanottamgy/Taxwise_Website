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
    "Our head office is in RMV Extension, off 14th Main. Most first meetings are held here; for clients elsewhere in India or overseas, we work remotely and meet wherever is convenient.",
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
    "TaxWise is a finance and tax advisory firm headquartered in Bangalore, advising clients in India and internationally. Founders, family offices and companies retain us for end-to-end finance, tax and fundraising advisory — and for compliance that holds up under examination.",
  primaryCta: "Arrange a consultation",
  secondaryCta: "Explore our practices",
} as const;

export const stats = [
  { figure: "10", suffix: "+", label: "Years in practice", detail: "Established 2015" },
  { figure: "500", suffix: "+", label: "Clients advised", detail: "Individuals, firms and companies" },
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
    unit: "partner leads every engagement",
    body: "Every engagement is led by a partner, from the first conversation to the final filing. No part of it is delegated to an associate you have not met.",
  },
  {
    figure: "8",
    unit: "sectors in active practice",
    body: "From SaaS ESOPs to joint development agreements, we have met the questions your sector raises before — and know which positions withstand assessment.",
  },
  {
    figure: "0",
    unit: "deadlines missed since 2015",
    body: "Statutory dates sit on our calendar, with reminders that begin weeks in advance. In ten years of practice, not one return has been filed late.",
  },
  {
    figure: "24h",
    unit: "response, on working days",
    body: "Questions are answered the same or the next working day. Where a matter requires longer, you are told when to expect an answer rather than left to follow up.",
  },
] as const;

export const process = [
  {
    step: "01",
    name: "Consultation",
    body: "We begin with your position: what you own, what you owe, and what you intend to do next.",
  },
  {
    step: "02",
    name: "Assessment",
    body: "We review filings, books and structure to identify both exposure and opportunity, and tell you which requires attention first.",
  },
  {
    step: "03",
    name: "Strategy",
    body: "You receive a written plan setting out each option, with its tax and compliance consequences quantified in rupees.",
  },
  {
    step: "04",
    name: "Execution",
    body: "We file, register and represent you before the authorities. Deadlines sit on our calendar, not yours.",
  },
  {
    step: "05",
    name: "Review",
    body: "Quarterly reviews keep the plan current as the law changes and the business grows.",
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
    `${firm.name} is a partnership rather than a practice built around a single name. Four partners carry the work between them, and more than five hundred individuals and businesses have been advised over the past decade.`,
    "The practice is deliberately small. The partner you meet is the partner who does the work, so you are never required to explain your own business to someone new.",
    "The work is unglamorous and exact: a return that withstands scrutiny, a set of books that closes on time, a structure that still makes sense three years from now. That is what we are for.",
  ],
  credentials: [
    { label: "Practice", value: "Finance and tax advisory" },
    { label: "Practice since", value: "2015" },
    { label: "Head office", value: "RMV Extension, Bangalore" },
    { label: "Client base", value: "India and overseas" },
    { label: "Constitution", value: "Partnership firm" },
  ],
} as const;

export const finalCta = {
  label: "Start here",
  headline: "Tell us what you are planning.",
  body: "A first consultation is a conversation about your position, the options open to you, and the exposures worth addressing now. There is no charge and no obligation.",
} as const;

/**
 * Root-relative so the same nav works from a service page as from home.
 *
 * The order follows the order the sections appear on the page, so the
 * scrollspy underline travels left to right as you read rather than jumping
 * back and forth.
 */
export type NavItem = {
  label: string;
  href: string;
  /** The route subtree this item is responsible for, if any. */
  owns?: string;
  /**
   * Kept out of the desktop rail, which is the one surface with a hard width
   * limit — eight links and a button wrapped the call to action onto two lines
   * at 1024. It still appears in the mobile panel and the footer, both of
   * which have vertical room, so nothing is actually lost.
   */
  secondary?: boolean;
};

export const nav: readonly NavItem[] = [
  /**
   * `owns` is the route subtree an item is responsible for, so the top bar can
   * say "you are here" on a page as well as in a homepage section. Without it
   * nothing was ever marked current outside the homepage: a reader on a
   * service page or an article had no indication in the nav of where they
   * were.
   */
  { label: "Services", href: "/#services", owns: "/services" },
  { label: "Approach", href: "/#process" },
  { label: "Calendar", href: "/#calendar" },
  { label: "Insights", href: "/insights", owns: "/insights" },
  { label: "Firm", href: "/#about" },
  // Firm and Team are adjacent sections about the same subject, and Firm
  // lands a reader immediately above Team. Careers is a destination people
  // arrive looking for, so it takes the rail slot.
  { label: "Team", href: "/#team", secondary: true },
  { label: "Careers", href: "/careers", owns: "/careers" },
  { label: "Contact", href: "/#contact" },
];

/** True when `pathname` is the item's route, or a page inside it. */
export function navOwnsRoute(item: NavItem, pathname: string) {
  if (!item.owns) return false;
  return pathname === item.owns || pathname.startsWith(`${item.owns}/`);
}
