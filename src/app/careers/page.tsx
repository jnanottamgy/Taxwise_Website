import type { Metadata } from "next";
import { roles, careersIntro, whatWeLookFor } from "@/lib/careers";
import { firm } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Container } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import LightCard from "@/components/LightCard";
import ApplicationForm from "@/components/ApplicationForm";

const description =
  "Open positions at TaxWise, and how to apply. A small practice in Bangalore where an engagement is led by a partner and the work is not divided into segments.";

export const metadata: Metadata = {
  title: "Careers",
  description,
  alternates: { canonical: "/careers" },
  openGraph: { title: `Careers — ${firm.name}`, description, url: `${firm.url}/careers` },
};

export default function CareersPage() {
  const open = roles.map(({ slug, title }) => ({ slug, title }));

  return (
    <>
      <Nav />
      <main id="main">
        {/* ── Masthead ─────────────────────────────────────────────── */}
        <header className="ledger-ground relative isolate overflow-hidden border-b border-paper-12 pt-40 pb-16 lg:pt-48 lg:pb-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(90% 70% at 20% 0%, rgba(34,50,80,0.7), transparent 65%), radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(14,27,47,0.9) 100%)",
            }}
          />
          <Container>
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
              <div>
                <p className="label flex items-center gap-3">
                  <span aria-hidden="true" className="inline-block h-px w-6 shrink-0 bg-gold" />
                  {careersIntro.label}
                </p>
              </div>
              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                <SplitHeading
                  as="h1"
                  delay={0.08}
                  step={0.055}
                  text={careersIntro.headline}
                  className="max-w-[16ch] font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.94] tracking-[-0.03em] text-paper"
                />
                <Reveal delay={0.22} className="mt-10">
                  <p className="max-w-[56ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.65] text-paper-80">
                    {careersIntro.standfirst}
                  </p>
                  <a
                    href="#apply"
                    className="btn-sheen mt-10 inline-flex min-h-[3.25rem] items-center gap-3 rounded-full border border-paper-12 px-7 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper transition duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-gold hover:text-gold-lit"
                  >
                    Apply now
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.25">
                      <path d="M8 2v11m0 0-4-4m4 4 4-4" strokeLinecap="square" />
                    </svg>
                  </a>
                </Reveal>
              </div>
            </div>
          </Container>
        </header>

        {/* ── Open positions ───────────────────────────────────────── */}
        <section aria-labelledby="open-heading" className="py-[var(--spacing-section)]">
          <Container>
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <Reveal>
                  {/* A real h2, not a styled paragraph: the role titles below are
                      h3, and without a level 2 above them this was the only page
                      on the site whose outline jumped h1 → h3. `.label` is a
                      utility, so it still wins over the base heading styles. */}
                  <h2 className="label flex items-center gap-3" id="open-heading">
                    <span aria-hidden="true" className="inline-block h-px w-6 shrink-0 bg-gold" />
                    Open positions
                  </h2>
                  <p className="mt-8 max-w-[22ch] text-sm leading-relaxed text-paper-64">
                    {roles.length
                      ? `${roles.length} ${roles.length === 1 ? "post" : "posts"} open. Applications are read by a partner.`
                      : "Nothing open at present. Applications are still read."}
                  </p>
                </Reveal>
              </div>

              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                {roles.length ? (
                  <ol className="border-t border-paper-12">
                    {roles.map((role, i) => (
                      <Reveal key={role.slug} delay={Math.min(i, 3) * 0.06} as="li">
                        <LightCard
                          as="article"
                          className="grid gap-x-12 gap-y-5 border-0 border-b border-paper-12 py-9 lg:grid-cols-[minmax(0,1fr)_15rem]"
                        >
                          <div>
                            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mist">
                              <span className="text-gold">{role.practice}</span>
                              <span aria-hidden="true">·</span>
                              <span>{role.type}</span>
                              <span aria-hidden="true">·</span>
                              <span>{role.experience}</span>
                            </p>
                            <h3 className="mt-4 max-w-[24ch] font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] text-paper">
                              <a
                                href={`/careers/${role.slug}`}
                                className="after:absolute after:inset-0 after:content-['']"
                              >
                                {role.title}
                              </a>
                            </h3>
                            <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-[1.7] text-paper-64">
                              {role.summary}
                            </p>
                          </div>
                          <p className="font-mono text-[0.625rem] uppercase leading-[1.8] tracking-[0.14em] text-mist lg:self-center lg:text-right">
                            {role.location}
                          </p>
                        </LightCard>
                      </Reveal>
                    ))}
                  </ol>
                ) : (
                  <Reveal>
                    <p className="max-w-[54ch] text-[1.0625rem] leading-[1.7] text-paper-80">
                      There is no post open at the moment. That changes without much notice, and we
                      keep speculative applications on file — if the work below sounds like yours,
                      send it anyway.
                    </p>
                  </Reveal>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* ── What we look for ─────────────────────────────────────── */}
        <section aria-labelledby="look-heading" className="border-t border-paper-12 py-[var(--spacing-section)]">
          <Container>
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <Reveal>
                  <h2 className="label flex items-center gap-3" id="look-heading">
                    <span aria-hidden="true" className="inline-block h-px w-6 shrink-0 bg-gold" />
                    What we look for
                  </h2>
                </Reveal>
              </div>
              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                <dl className="grid gap-x-14 gap-y-10 sm:grid-cols-2">
                  {whatWeLookFor.map((item, i) => (
                    <Reveal key={item.title} delay={(i % 2) * 0.06}>
                      <dt className="font-display text-[1.375rem] leading-[1.15] text-paper">
                        {item.title}
                      </dt>
                      <dd className="mt-4 max-w-[44ch] text-[0.9375rem] leading-[1.75] text-paper-64">
                        {item.body}
                      </dd>
                    </Reveal>
                  ))}
                </dl>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Apply ────────────────────────────────────────────────── */}
        <section
          id="apply"
          aria-labelledby="apply-heading"
          className="ledger-ground relative isolate overflow-hidden border-t border-paper-12 py-[var(--spacing-section)]"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(70% 55% at 50% 105%, rgba(34,50,80,0.7), transparent 70%), radial-gradient(100% 80% at 50% 0%, rgba(14,27,47,0.9), transparent 60%)",
            }}
          />
          <Container>
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <Reveal>
                  <p className="label flex items-center gap-3">
                    <span aria-hidden="true" className="inline-block h-px w-6 shrink-0 bg-gold" />
                    Apply
                  </p>
                </Reveal>
              </div>
              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                <SplitHeading
                  id="apply-heading"
                  text="One form, whichever post you are after."
                  className="max-w-[18ch] font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.0] tracking-[-0.025em] text-paper"
                />
                <Reveal delay={0.14} className="mt-8">
                  <p className="max-w-[52ch] text-[1.0625rem] leading-[1.7] text-paper-80">
                    Name the position if one fits, or apply generally. Applications are read by a
                    partner, and you will hear back either way.
                  </p>
                  <div className="mt-12">
                    <ApplicationForm roles={open} />
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
