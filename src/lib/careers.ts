/**
 * Open positions.
 *
 * Edited like the insights posts: opening a role means adding an entry here,
 * closing one means deleting it. The page is written so that an empty list is
 * a valid state — it falls back to the speculative application rather than
 * showing an empty shelf — so a position can be taken down the day it is
 * filled without leaving a dead link or a blank section behind.
 *
 * THE THREE BELOW ARE EXAMPLES. They are written as the firm would write them,
 * but no one has told us these posts are actually open. Edit them to the roles
 * you are hiring for, or delete them and let the page run on the speculative
 * application alone.
 */

export type Role = {
  slug: string;
  title: string;
  /** Core CA Practice, CFO Advisory, Startup Advisory, or All practices. */
  practice: string;
  /** "Full time", "Articleship", "Contract". */
  type: string;
  location: string;
  /** Free text: "2-4 years", "Newly qualified", "Article registration". */
  experience: string;
  /** One or two sentences for the list. */
  summary: string;
  /** The opening paragraph of the role page. */
  standfirst: string;
  /** What the person would actually do. */
  responsibilities: readonly string[];
  /** What we are looking for. */
  requirements: readonly string[];
  /** What the firm offers in return — specific, not benefits-page filler. */
  offer: readonly string[];
};

export const roles: readonly Role[] = [
  {
    slug: "article-assistant",
    title: "Article Assistant",
    // Not "Practice": the value is printed against a "Practice" label and in the
    // breadcrumb, where it read "Practice / Practice". An article rotates
    // through all three, which is the honest answer and the better one.
    practice: "All practices",
    type: "Articleship",
    location: "Bangalore · In office",
    experience: "IPCC or Intermediate cleared",
    summary:
      "Three years across direct tax, GST, audit and company law, on live files from the first month rather than on photocopying.",
    standfirst:
      "An articleship is three years you do not get back, and where you spend them determines what you are worth at the end of them. We are a small practice, which means an article here is on live files early, sits in client meetings, and is told why a position was taken rather than only what to file.",
    responsibilities: [
      "Preparing income tax computations and returns across ITR forms",
      "GSTR-1, GSTR-3B and GSTR-2B reconciliation on live client files",
      "Statutory and tax audit fieldwork under a partner's supervision",
      "Drafting responses to notices, with the reasoning explained to you first",
      "Maintaining statutory registers and preparing ROC filings",
    ],
    requirements: [
      "CA Intermediate — both groups, or one group with the second attempted",
      "Eligible to register for articleship with the ICAI",
      "Able to read a statute and follow it to the relevant sub-section",
      "Careful with figures, and willing to say when something does not reconcile",
    ],
    offer: [
      "Exposure across all three practices rather than one desk for three years",
      "A partner who explains the position, not only the deadline",
      "Study leave to the ICAI's requirement, taken properly and not grudgingly",
      "Stipend above the prescribed minimum, reviewed annually",
    ],
  },
  {
    slug: "audit-and-assurance-associate",
    title: "Associate — Audit and Assurance",
    practice: "Core CA Practice",
    type: "Full time",
    location: "Bangalore · Hybrid",
    experience: "1-3 years",
    summary:
      "Statutory and tax audit fieldwork for companies and LLPs, with the working papers and the management letter written to a standard that survives review.",
    standfirst:
      "An audit that produces only an opinion has done half the job. This role runs the fieldwork on statutory and tax audits, assembles the working paper file, and drafts the findings the client is going to act on — the part of the engagement that is worth more than the signature.",
    responsibilities: [
      "Statutory audit fieldwork under the Standards on Auditing, with CARO reporting",
      "Tax audit under section 63 — Form 26 preparation and clause-level verification",
      "Verification of the accounting software audit trail",
      "Drafting the management letter, with findings ranked by exposure",
      "Reconciling turnover reported under income tax against GST",
    ],
    requirements: [
      "Qualified or semi-qualified, with audit experience in practice",
      "Working knowledge of the Companies Act 2013 and the Standards on Auditing",
      "Comfortable with Tally, and with whatever the client happens to use",
      "Able to write a finding in a sentence a promoter will understand",
    ],
    offer: [
      "A portfolio you know end to end rather than a segment of someone else's",
      "Direct contact with promoters and finance heads from the first engagement",
      "Support toward the remaining groups, if you are still sitting them",
      "Compensation benchmarked annually against Bangalore practice",
    ],
  },
  {
    slug: "manager-direct-tax",
    title: "Manager — Direct Tax",
    practice: "CFO Advisory",
    type: "Full time",
    location: "Bangalore · Hybrid",
    experience: "4-7 years",
    summary:
      "Owning direct tax positions for a portfolio of companies and promoters, from the planning conversation through to representation before the authorities.",
    standfirst:
      "Most tax is decided by choices made months before a return is filed. This role sits in those conversations: structuring the position, quantifying the alternatives, and then defending what was done when an assessment asks about it.",
    responsibilities: [
      "Direct tax planning for companies, promoters and family offices",
      "Capital gains structuring, including section 84 exemptions and slump sale",
      "Assessment and reassessment proceedings on the faceless portal",
      "Appeals in Form 99 before the Commissioner (Appeals)",
      "Section 393 determinations and transfer pricing coordination",
    ],
    requirements: [
      "Qualified chartered accountant with four or more years in direct tax",
      "A record of positions taken and defended, not only returns filed",
      "Able to quantify an option in rupees before recommending it",
      "Comfortable being the person in the room the client asks",
    ],
    offer: [
      "Your own portfolio, with the partner relationship rather than a reporting line to one",
      "A practice small enough that a good idea is implemented the same week",
      "A path to partnership that is discussed openly rather than implied",
      "Compensation benchmarked annually against Bangalore practice",
    ],
  },
];

export function getRole(slug: string) {
  return roles.find((r) => r.slug === slug);
}

/** What the firm looks for in anyone, whichever post they are applying to. */
export const careersIntro = {
  label: "Careers",
  headline: "Small practice. Serious files.",
  standfirst:
    "We are deliberately small, which changes what working here is like. There is no layer between you and the partner, no file you only see one page of, and no month where the interesting work goes to someone more senior. It also means we hire slowly and carefully.",
} as const;

export const whatWeLookFor = [
  {
    title: "Precision before speed",
    body: "The work is exact. A figure that does not reconcile is a question, not a rounding difference, and we would rather you raised it than closed it.",
  },
  {
    title: "The reasoning, not the form",
    body: "Anyone can be taught which form to file. We are looking for people who want to know why the position is defensible, and who will say so when it is not.",
  },
  {
    title: "Plain writing",
    body: "Findings, notices and advice all end up in writing, in front of someone who is not an accountant. Being able to write a clear sentence is a technical skill here.",
  },
  {
    title: "Ownership of a file",
    body: "You will be the person who knows an engagement best. That is the point of a small practice, and it is only worth anything if you take it seriously.",
  },
] as const;
