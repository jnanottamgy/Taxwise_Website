import { about, firm, displayPhone } from "@/lib/content";
import { Container } from "./Section";
import { Reveal } from "./Reveal";
import SplitHeading from "./SplitHeading";

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
      className="section-dawn relative bg-paper py-[var(--spacing-section)] text-ink"
    >
      {/* The one place the page changes ground. Left as a hard edge it is a
          seam; given a band of light above it, the off-white reads as arriving
          rather than being cut in. The gold hairline is the horizon. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -translate-y-full"
      >
        <div className="h-px w-full bg-gold/45" />
        <div
          className="h-32 w-full"
          style={{
            background:
              "linear-gradient(to top, rgba(245,244,242,0.13), rgba(201,168,76,0.05) 42%, transparent)",
          }}
        />
      </div>
      <Container>
        <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-slate">
                {about.label}
              </p>
            </Reveal>
          </div>

          <div className="lg:border-l lg:border-ink/12 lg:pl-[clamp(2rem,5vw,5rem)]">
            <SplitHeading
              id="about-heading"
              text={about.headline}
              className="max-w-[18ch] font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.98] tracking-[-0.025em] text-ink"
            />

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
                      {/* The label is the fixed element in the pair, so it
                          holds its line and the value wraps. "Head office"
                          breaking across two lines put its row out of step
                          with the four beside it. */}
                      <dt className="whitespace-nowrap font-mono text-[0.625rem] uppercase tracking-[0.16em] text-slate">
                        {row.label}
                      </dt>
                      <dd className="text-right text-[0.9375rem] text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-8 text-[0.9375rem] leading-[1.7] text-slate">
                  For a direct conversation, the office line is{" "}
                  <a
                    href={`tel:${firm.phone}`}
                    className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    {displayPhone(firm.phone)}
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
