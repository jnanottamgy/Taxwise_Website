import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { roles, getRole } from "@/lib/careers";
import { firm } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Container } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import LightCard from "@/components/LightCard";
import ApplicationForm from "@/components/ApplicationForm";

export function generateStaticParams() {
  return roles.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) return {};

  return {
    title: role.title,
    description: role.summary,
    alternates: { canonical: `/careers/${role.slug}` },
    openGraph: {
      title: `${role.title} — ${firm.name}`,
      description: role.summary,
      url: `${firm.url}/careers/${role.slug}`,
    },
  };
}

/**
 * A list under a marginal heading — the shape the service pages already use.
 *
 * `lead` rather than a `first:` variant: each block is wrapped in its own
 * `Reveal`, so every one of them is a first child and the variant matched all
 * three at once — the separating rules never drew.
 */
function Block({
  title,
  items,
  lead,
}: {
  title: string;
  items: readonly string[];
  lead?: boolean;
}) {
  return (
    <div className={lead ? "pb-12" : "border-t border-paper-12 py-12"}>
      <h2 className="max-w-[22ch] font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] text-paper">
        {title}
      </h2>
      <ul className="mt-7 grid gap-x-14 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-baseline gap-3 border-t border-paper-12 py-3.5 text-[0.9375rem] leading-[1.65] text-paper-64"
          >
            <span aria-hidden="true" className="mt-[0.5em] h-px w-3 shrink-0 bg-ink-3" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();

  const others = roles.filter((r) => r.slug !== role.slug);

  // JobPosting, so the role is eligible for Google Jobs rather than only being
  // found by someone already on the site.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: [role.standfirst, ...role.responsibilities, ...role.requirements].join(" "),
    employmentType: role.type.toLowerCase().includes("full") ? "FULL_TIME" : "OTHER",
    hiringOrganization: { "@type": "Organization", name: firm.name, sameAs: firm.url },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: `${firm.address.street}, ${firm.address.locality}`,
        addressLocality: firm.address.city,
        addressRegion: firm.address.region,
        postalCode: firm.address.postalCode,
        addressCountry: firm.address.country,
      },
    },
    directApply: true,
    url: `${firm.url}/careers/${role.slug}`,
  };

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
                <nav aria-label="Breadcrumb">
                  <ol className="-my-3 flex flex-wrap items-center gap-x-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist">
                    <li>
                      <a href="/careers" className="block py-3 transition-colors hover:text-paper">
                        Careers
                      </a>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li className="py-3 text-gold" aria-current="page">
                      {role.practice}
                    </li>
                  </ol>
                </nav>
              </div>

              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                <SplitHeading
                  as="h1"
                  delay={0.08}
                  step={0.05}
                  text={role.title}
                  className="max-w-[18ch] font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.03em] text-paper"
                />
                <Reveal delay={0.22} className="mt-10">
                  <p className="max-w-[56ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.65] text-paper-80">
                    {role.standfirst}
                  </p>
                </Reveal>

                <Reveal delay={0.32} className="mt-14">
                  <dl className="grid max-w-[46rem] gap-px bg-paper-12 sm:grid-cols-2">
                    {[
                      { label: "Practice", value: role.practice },
                      { label: "Engagement", value: role.type },
                      { label: "Location", value: role.location },
                      { label: "Experience", value: role.experience },
                    ].map((row) => (
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

        {/* ── The role ─────────────────────────────────────────────── */}
        <section aria-labelledby="detail-heading" className="py-[var(--spacing-section)]">
          <Container>
            <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <Reveal>
                  <p className="label flex items-center gap-3" id="detail-heading">
                    <span aria-hidden="true" className="inline-block h-px w-6 shrink-0 bg-gold" />
                    The role
                  </p>
                </Reveal>
              </div>
              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                <Reveal>
                  <Block lead title="What you would do" items={role.responsibilities} />
                </Reveal>
                <Reveal delay={0.06}>
                  <Block title="What we are looking for" items={role.requirements} />
                </Reveal>
                <Reveal delay={0.12}>
                  <Block title="What we offer in return" items={role.offer} />
                </Reveal>
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
                  text={`Apply for ${role.title.toLowerCase()}.`}
                  className="max-w-[18ch] font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.0] tracking-[-0.025em] text-paper"
                />
                <Reveal delay={0.14} className="mt-8">
                  <p className="max-w-[52ch] text-[1.0625rem] leading-[1.7] text-paper-80">
                    The post is already selected below. Applications are read by a partner, and you
                    will hear back either way.
                  </p>
                  <div className="mt-12">
                    <ApplicationForm
                      roles={roles.map(({ slug, title }) => ({ slug, title }))}
                      defaultRole={role.slug}
                    />
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>

        {/* ── The other posts ──────────────────────────────────────── */}
        {others.length ? (
          <section aria-labelledby="others-heading" className="border-t border-paper-12 py-20">
            <Container>
              <h2 className="label flex items-center gap-3" id="others-heading">
                <span aria-hidden="true" className="inline-block h-px w-6 shrink-0 bg-gold" />
                Also open
              </h2>
              <ul className="mt-10 grid gap-px bg-paper-12 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((other) => (
                  <li key={other.slug}>
                    <LightCard className="flex h-full flex-col justify-between gap-8 bg-ink p-7 hover:bg-ink-2/40">
                      <div>
                        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-gold">
                          {other.practice}
                        </p>
                        <h3 className="mt-4 font-display text-[1.375rem] leading-[1.15] text-paper">
                          <a
                            href={`/careers/${other.slug}`}
                            className="after:absolute after:inset-0 after:content-['']"
                          >
                            {other.title}
                          </a>
                        </h3>
                      </div>
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mist">
                        {other.type} · {other.experience}
                      </p>
                    </LightCard>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // Built from the role's own record, not from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
