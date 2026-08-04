import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getService, containedBy } from "@/lib/services";
import { firm, whatsappUrl, displayPhone } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Container, Label } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import LightCard from "@/components/LightCard";
import SplitHeading from "@/components/SplitHeading";
import Magnetic from "@/components/Magnetic";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.name,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} — ${firm.name}`,
      description: service.summary,
      url: `${firm.url}/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  // The practices this one carries whole, outermost first.
  const carried = containedBy(service);

  return (
    <>
      <Nav />
      <main id="main">
        {/* ── Masthead ─────────────────────────────────────────────── */}
        <header className="ledger-ground relative isolate overflow-hidden border-b border-paper-12 pt-40 pb-20 lg:pt-48 lg:pb-28">
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
                <nav aria-label="Breadcrumb">
                  {/* -my-3 against the link's py-3: an 11px line is a 14px tap
                      target, and the negative margin buys the height back
                      without moving the breadcrumb a pixel. */}
                  <ol className="-my-3 flex flex-wrap items-center gap-x-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist">
                    <li>
                      <a
                        href="/#services"
                        className="block py-3 transition-colors hover:text-paper"
                      >
                        Services
                      </a>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li className="py-3 text-paper-80" aria-current="page">
                      {service.name}
                    </li>
                  </ol>
                </nav>

                {/* Which rung. The catalogue is a ladder, and a reader who
                    lands here from search has not seen the ladder. */}
                <p className="mt-8 font-mono text-[0.625rem] uppercase leading-[1.8] tracking-[0.16em] text-mist">
                  <span data-figure className="text-gold">
                    {String(service.tier).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true"> · </span>
                  Practice {service.tier} of {services.length}
                </p>
              </div>

              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                {/* The masthead arrives in three beats — name, then what it is,
                    then the statute it answers to — rather than all at once. */}
                <SplitHeading
                  as="h1"
                  delay={0.08}
                  step={0.06}
                  text={service.name}
                  className="max-w-[16ch] font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-paper"
                />
                <Reveal delay={0.22} className="mt-10">
                  <p className="max-w-[54ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.65] text-paper-80">
                    {service.standfirst}
                  </p>
                </Reveal>

                {/* The statute block — the reference card of the discipline */}
                <Reveal delay={0.34} className="mt-14">
                  <dl className="grid max-w-[46rem] gap-px bg-paper-12 sm:grid-cols-2">
                    {service.statute.map((row) => (
                      <div key={row.label} className="bg-ink px-5 py-4">
                        <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist">
                          {row.label}
                        </dt>
                        <dd className="mt-1.5 text-[0.9375rem] text-paper">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </div>
            </div>
          </Container>
        </header>

        {/* ── Who it is for ────────────────────────────────────────── */}
        <section aria-labelledby="audience-heading" className="border-b border-paper-12 py-16">
          <Container>
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-6 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
              <Label as="h2" id="audience-heading">
                Who it is for
              </Label>
              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                <p className="max-w-[58ch] text-[1.0625rem] leading-[1.7] text-paper-80">
                  {service.audience}
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── What it covers ───────────────────────────────────────── */}
        <section
          aria-labelledby="covers-heading"
          className="py-[var(--spacing-section)]"
        >
          <Container>
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <Reveal>
                  <Label as="h2" id="covers-heading">
                    What it covers
                  </Label>
                </Reveal>
              </div>

              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                {/* Prose first at a readable measure, then the detail as a
                    two-column list — which keeps each block's height honest
                    instead of leaving a short column stranded beside a tall one. */}
                {service.sections.map((section, i) => (
                  <Reveal key={section.title} delay={Math.min(i, 3) * 0.05}>
                    <div className="border-t border-paper-12 py-14 first:border-t-0 first:pt-0">
                      <h3 className="max-w-[22ch] font-display text-[clamp(1.625rem,3vw,2.25rem)] leading-[1.05] text-paper">
                        {section.title}
                      </h3>
                      <p className="mt-5 max-w-[62ch] text-[1rem] leading-[1.7] text-paper-80">
                        {section.body}
                      </p>
                      <ul className="mt-9 grid gap-x-14 sm:grid-cols-2">
                        {section.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-baseline gap-3 border-t border-paper-12 py-3.5 text-[0.875rem] leading-[1.6] text-paper-64"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.5em] h-px w-3 shrink-0 bg-ink-3"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── What it also carries ─────────────────────────────────── */}
        {carried.length ? (
          <section
            aria-labelledby="carries-heading"
            className="border-t border-paper-12 py-[var(--spacing-section)]"
          >
            <Container>
              <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
                <div className="lg:sticky lg:top-32 lg:self-start">
                  <Reveal>
                    <Label as="h2" id="carries-heading">
                      And everything below
                    </Label>
                  </Reveal>
                </div>

                <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                  <Reveal>
                    <p className="max-w-[58ch] text-[1.0625rem] leading-[1.7] text-paper-80">
                      {service.name} is not a narrower engagement than the practices beneath it. It
                      contains {carried.length === 1 ? "the one below" : "both of them"} whole — the
                      same work, by the same partners, on the same file.
                    </p>
                  </Reveal>

                  {/* The contained practice's own headings, listed. It is the
                      shortest honest answer to "so what does that actually
                      include", and it costs no duplicated prose. */}
                  {carried.map((inner, i) => (
                    <Reveal key={inner.slug} delay={0.08 + i * 0.06}>
                      <div className="mt-14 border-t border-paper-12 pt-8">
                        <h3 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1] text-paper">
                          <a
                            href={`/services/${inner.slug}`}
                            className="transition-colors duration-400 hover:text-gold-lit"
                          >
                            {inner.name}
                          </a>
                        </h3>
                        <ul className="mt-7 grid gap-x-14 sm:grid-cols-2">
                          {inner.sections.map((section) => (
                            <li
                              key={section.title}
                              className="flex items-baseline gap-3 border-t border-paper-12 py-3.5 text-[0.875rem] leading-[1.6] text-paper-64"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-[0.5em] h-px w-3 shrink-0 bg-ink-3"
                              />
                              {section.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        {/* ── What you receive ─────────────────────────────────────── */}
        <section aria-labelledby="deliverables-heading" className="bg-paper py-[var(--spacing-section)] text-ink">
          <Container>
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <Reveal>
                  <h2
                    id="deliverables-heading"
                    className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-slate"
                  >
                    What you receive
                  </h2>
                </Reveal>
              </div>
              <div className="lg:border-l lg:border-ink/12 lg:pl-[clamp(2rem,5vw,5rem)]">
                <Reveal>
                  <ol className="border-t border-ink/12">
                    {service.deliverables.map((item, i) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-6 border-b border-ink/12 py-6 sm:gap-10"
                      >
                        <span
                          data-figure
                          aria-hidden="true"
                          className="shrink-0 font-mono text-[0.6875rem] tracking-[0.14em] text-slate"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="max-w-[54ch] text-[1.0625rem] leading-[1.6] text-ink-3">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Talk to us ───────────────────────────────────────────── */}
        <section
          aria-labelledby="engage-heading"
          className="ledger-ground relative isolate overflow-hidden py-[var(--spacing-section)]"
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
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
              <Reveal>
                <Label>Engage us</Label>
              </Reveal>
              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                <SplitHeading
                  id="engage-heading"
                  text={`Talk to a partner about ${service.name.toLowerCase()}.`}
                  className="max-w-[18ch] font-display text-[clamp(2.25rem,5vw,4rem)] leading-[0.98] tracking-[-0.025em] text-paper"
                />
                <Reveal delay={0.14} className="mt-8">
                  <p className="max-w-[46ch] text-[1.0625rem] leading-[1.7] text-paper-80">
                    A first conversation costs nothing and usually takes twenty minutes. Bring your
                    last return, or just the question.
                  </p>
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <Magnetic strength={0.25}>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-sheen block rounded-full bg-paper px-8 py-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(232,201,122,0.45)]"
                      >
                        Book a consultation
                      </a>
                    </Magnetic>
                    <a
                      href={`tel:${firm.phone}`}
                      className="rounded-full border border-paper-12 px-8 py-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-gold hover:text-gold-lit"
                    >
                      {displayPhone(firm.phone)}
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>

        {/* ── The ladder ───────────────────────────────────────────── */}
        {/* All three, in order, with the one you are on marked — rather than
            "the others", which would present a nested catalogue as a flat set
            of alternatives and lose the only thing worth knowing about it. */}
        <section aria-labelledby="ladder-heading" className="border-t border-paper-12 py-20">
          <Container>
            <Label as="h2" id="ladder-heading">
              The three practices
            </Label>
            <ol className="mt-10 grid gap-px bg-paper-12 lg:grid-cols-3">
              {services.map((other) => {
                const here = other.slug === service.slug;
                return (
                  <li key={other.slug}>
                    <LightCard
                      className={`flex h-full flex-col justify-between gap-8 p-7 ${
                        here ? "bg-ink-2/55" : "bg-ink hover:bg-ink-2/40"
                      }`}
                    >
                      <div>
                        <p className="flex items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.16em]">
                          <span data-figure className="text-gold">
                            {String(other.tier).padStart(2, "0")}
                          </span>
                          {here ? (
                            <span className="text-paper-80" aria-current="true">
                              You are here
                            </span>
                          ) : null}
                        </p>
                        <h3 className="mt-4 font-display text-[1.5rem] leading-[1.1] text-paper">
                          {here ? (
                            other.name
                          ) : (
                            <a
                              href={`/services/${other.slug}`}
                              className="after:absolute after:inset-0 after:content-['']"
                            >
                              {other.name}
                            </a>
                          )}
                        </h3>
                      </div>
                      <p className="text-[0.875rem] leading-[1.65] text-paper-64">
                        {other.points.join(" · ")}
                      </p>
                    </LightCard>
                  </li>
                );
              })}
            </ol>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
