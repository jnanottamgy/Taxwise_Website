import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getService } from "@/lib/services";
import { firm, whatsappUrl, displayPhone } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Container } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import LightCard from "@/components/LightCard";

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

  const others = services.filter((s) => s.slug !== service.slug);

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
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 lg:grid-cols-[13rem_minmax(0,1fr)]">
              <div>
                <nav aria-label="Breadcrumb">
                  <ol className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist">
                    <li>
                      <a href="/#services" className="transition-colors hover:text-paper">
                        Services
                      </a>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li className="text-paper-80" aria-current="page">
                      {service.name}
                    </li>
                  </ol>
                </nav>
              </div>

              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                <h1 className="max-w-[16ch] font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-paper">
                  {service.name}
                </h1>
                <p className="mt-10 max-w-[54ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.65] text-paper-80">
                  {service.standfirst}
                </p>

                {/* The statute block — the reference card of the discipline */}
                <dl className="mt-14 grid max-w-[46rem] gap-px bg-paper-12 sm:grid-cols-2">
                  {service.statute.map((row) => (
                    <div key={row.label} className="bg-ink px-5 py-4">
                      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist">
                        {row.label}
                      </dt>
                      <dd className="mt-1.5 text-[0.9375rem] text-paper">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Container>
        </header>

        {/* ── Who it is for ────────────────────────────────────────── */}
        <section aria-labelledby="audience-heading" className="border-b border-paper-12 py-16">
          <Container>
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
              <h2 id="audience-heading" className="label">
                Who it is for
              </h2>
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
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <Reveal>
                  <h2 id="covers-heading" className="label">
                    What it covers
                  </h2>
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

        {/* ── What you receive ─────────────────────────────────────── */}
        <section aria-labelledby="deliverables-heading" className="bg-paper py-[var(--spacing-section)] text-ink">
          <Container>
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
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
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 lg:grid-cols-[13rem_minmax(0,1fr)]">
              <Reveal>
                <p className="label">Engage us</p>
              </Reveal>
              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                <Reveal>
                  <h2
                    id="engage-heading"
                    className="max-w-[18ch] font-display text-[clamp(2.25rem,5vw,4rem)] leading-[0.98] tracking-[-0.025em] text-paper"
                  >
                    Talk to {firm.managingPartner} about {service.name.toLowerCase()}.
                  </h2>
                  <p className="mt-8 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-paper-80">
                    A first conversation costs nothing and usually takes twenty minutes. Bring your
                    last return, or just the question.
                  </p>
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-paper px-8 py-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(245,244,242,0.4)]"
                    >
                      Book a consultation
                    </a>
                    <a
                      href={`tel:${firm.phonePartner}`}
                      className="rounded-full border border-paper-12 px-8 py-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-paper-40 hover:bg-paper-06"
                    >
                      {displayPhone(firm.phonePartner)}
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>

        {/* ── The other disciplines ────────────────────────────────── */}
        <section aria-labelledby="others-heading" className="border-t border-paper-12 py-20">
          <Container>
            <h2 id="others-heading" className="label">
              The other disciplines
            </h2>
            <ul className="mt-10 grid gap-px bg-paper-12 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <li key={other.slug}>
                  <LightCard className="flex h-full flex-col justify-between gap-8 bg-ink p-7 hover:bg-ink-2/40">
                    <h3 className="font-display text-[1.5rem] leading-none text-paper">
                      <a
                        href={`/services/${other.slug}`}
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {other.name}
                      </a>
                    </h3>
                    <p className="text-[0.875rem] leading-[1.65] text-paper-64">
                      {other.points.join(" · ")}
                    </p>
                  </LightCard>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
