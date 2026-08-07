import { services, getService } from "@/lib/services";
import { Section, Heading, Standfirst } from "./Section";
import { Reveal } from "./Reveal";
import LightCard from "./LightCard";

/**
 * The three practices.
 *
 * They are nested, not parallel — CFO Advisory contains Core CA Practice
 * whole, and Startup Advisory contains CFO Advisory whole — so this is drawn
 * as a ladder rather than as a grid of equals. Three full-width rungs, each
 * numbered, each one step lighter than the last, and each of the upper two
 * carrying an explicit line naming what it already includes.
 *
 * A grid of three equal cards would have been the obvious layout and it would
 * have been a lie: it says "pick one of these three things" when the truth is
 * "each of these contains the one before it". The containment is the most
 * useful fact about the catalogue, so it gets drawn.
 */

/** The tier ground, one step lighter as the ladder climbs. */
const GROUND = ["bg-ink-2/25", "bg-ink-2/40", "bg-ink-2/55"] as const;

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0 text-mist transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
    </svg>
  );
}

export default function Services() {
  return (
    <Section
      id="services"
      label="Services"
      labelledBy="services-heading"
      aside={
        <p className="max-w-[22ch] text-sm leading-relaxed text-paper-64">
          Three practices, each containing the last. No part of the work is
          subcontracted.
        </p>
      }
    >
      <Heading id="services-heading">Everything a company owes, handled in one place.</Heading>
      <Reveal delay={0.18}>
        <Standfirst>
          The three practices are not alternatives. Each contains the one beneath it in full, so
          you engage at the level you need — and when the requirement grows, nothing is explained
          twice.
        </Standfirst>
      </Reveal>

      <div className="mt-20 grid gap-px bg-paper-12">
        {services.map((service, i) => {
          const inner = service.includes ? getService(service.includes) : undefined;

          return (
            <Reveal key={service.slug} delay={Math.min(i, 2) * 0.07} as="div">
              <LightCard
                as="article"
                className={`flex h-full flex-col border-0 ${GROUND[i] ?? GROUND[0]} p-8 lg:p-12`}
              >
                <div className="grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-8 lg:grid-cols-[4.5rem_minmax(0,1fr)_19.5rem]">
                  {/* The rung number. It is the one place the ladder is stated
                      as a number rather than implied by weight. */}
                  <p
                    data-figure
                    aria-hidden="true"
                    className="font-mono text-[0.6875rem] tracking-[0.16em] text-gold"
                  >
                    {String(service.tier).padStart(2, "0")}
                  </p>

                  <div>
                    <h3 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] text-paper">
                      <a
                        href={`/services/${service.slug}`}
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {service.name}
                      </a>
                    </h3>
                    <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-[1.65] text-paper-80">
                      {service.summary}
                    </p>

                    {/* Said in words, and linked, because a reader arriving at
                        tier three needs to know it is not a narrower offer than
                        tier one — it is a larger one. */}
                    {inner ? (
                      <p className="mt-6 flex items-baseline gap-2.5 font-mono text-[0.6875rem] uppercase leading-[1.6] tracking-[0.14em] text-mist">
                        <span aria-hidden="true" className="text-gold">
                          &#8627;
                        </span>
                        <span>
                          Includes everything in {inner.name}
                        </span>
                      </p>
                    ) : null}

                    {/* paper-64, not mist: mist clears 4.5:1 on the page ground
                        but not on this raised surface. */}
                    <p className="mt-8 flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper-64 transition-colors duration-500 group-hover:text-paper">
                      {/* Set in uppercase by the class, so the name goes in as
                          written — lowercasing it first destroyed CA and CFO. */}
                      Explore {service.name}
                      <Arrow />
                    </p>
                  </div>

                  <ul className="space-y-2.5 lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,4vw,4rem)]">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-baseline gap-3 font-mono text-[0.6875rem] leading-[1.5] tracking-[0.04em] text-paper-64"
                      >
                        <span aria-hidden="true" className="mt-[0.4em] h-px w-3 shrink-0 bg-ink-3" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </LightCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
