import { about, firm, displayPhone } from "@/lib/content";
import { Container } from "./Section";
import { Reveal } from "./Reveal";

/**
 * The one light section. After a long dark page this reads as a room with the
 * blinds opened — which is the right feeling for the part that explains who
 * you are actually hiring.
 */
export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-paper py-[var(--spacing-section)] text-ink"
    >
      <Container>
        <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-slate">
                {about.label}
              </p>
            </Reveal>
          </div>

          <div className="lg:border-l lg:border-ink/12 lg:pl-[clamp(2rem,5vw,5rem)]">
            <Reveal>
              <h2
                id="about-heading"
                className="max-w-[18ch] font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.98] tracking-[-0.025em] text-ink"
              >
                {about.headline}
              </h2>
            </Reveal>

            <div className="mt-16 grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <Reveal delay={0.1}>
                <div className="max-w-[58ch] space-y-6">
                  {about.body.map((paragraph) => (
                    <p key={paragraph} className="text-[1.0625rem] leading-[1.75] text-ink-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>

              {/* Credentials read as a statement block, because that is what they are */}
              <Reveal delay={0.18}>
                <dl className="border-t border-ink/12">
                  {about.credentials.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-6 border-b border-ink/12 py-4"
                    >
                      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-slate">
                        {row.label}
                      </dt>
                      <dd className="text-right text-[0.9375rem] text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-8 text-[0.9375rem] leading-[1.7] text-slate">
                  {firm.managingPartner} leads every engagement personally. You can reach him on{" "}
                  <a
                    href={`tel:${firm.phonePartner}`}
                    className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    {displayPhone(firm.phonePartner)}
                  </a>
                  .
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
