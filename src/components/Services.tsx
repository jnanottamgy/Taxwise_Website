import { services } from "@/lib/services";
import { Section, Heading, Standfirst } from "./Section";
import { Reveal } from "./Reveal";
import LightCard from "./LightCard";

const CARD = "border-0 bg-ink-2/30 h-full flex flex-col";

function Points({
  points,
  align = "bottom",
}: {
  points: readonly string[];
  align?: "top" | "bottom";
}) {
  return (
    <ul className={`space-y-2.5 ${align === "bottom" ? "mt-auto pt-8" : "pt-1"}`}>
      {points.map((point) => (
        <li
          key={point}
          className="flex items-baseline gap-3 font-mono text-[0.6875rem] tracking-[0.04em] text-paper-64"
        >
          <span aria-hidden="true" className="mt-[0.4em] h-px w-3 shrink-0 bg-ink-3" />
          {point}
        </li>
      ))}
    </ul>
  );
}

/** The arrow that appears on hover, on every card that leads somewhere. */
function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0 text-mist transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
    </svg>
  );
}

export default function Services() {
  const [feature, ...rest] = services;

  return (
    <Section
      id="services"
      label="Services"
      labelledBy="services-heading"
      aside={
        <p className="max-w-[22ch] text-sm leading-relaxed text-paper-64">
          Seven disciplines, one file. Nothing is handed to a subcontractor.
        </p>
      }
    >
      <Reveal>
        <Heading id="services-heading">Everything a company owes, handled in one place.</Heading>
        <Standfirst>
          Audit, tax and compliance are not separate problems. We run them together, which is how
          the answer to one stops creating a problem in another.
        </Standfirst>
      </Reveal>

      <div className="mt-20 grid gap-px bg-paper-12 lg:grid-cols-3">
        {/* The flagship discipline gets the full measure */}
        <Reveal className="lg:col-span-3" as="div">
          <LightCard as="article" className={CARD}>
            <div className="grid gap-10 p-8 lg:grid-cols-[1fr_18rem] lg:p-12">
              <div>
                <h3 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-paper">
                  <a
                    href={`/services/${feature.slug}`}
                    className="after:absolute after:inset-0 after:content-['']"
                  >
                    {feature.name}
                  </a>
                </h3>
                <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-paper-80">
                  {feature.summary}
                </p>
                {/* paper-64, not mist: mist clears 4.5:1 on the page ground but
                    not on this raised surface. */}
                <p className="mt-5 flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper-64 transition-colors duration-500 group-hover:text-paper">
                  Explore {feature.name.toLowerCase()}
                  <Arrow />
                </p>
              </div>
              <div className="lg:border-l lg:border-paper-12 lg:pl-10">
                <Points points={feature.points} align="top" />
              </div>
            </div>
          </LightCard>
        </Reveal>

        {rest.map((service, i) => (
          <Reveal key={service.slug} delay={(i % 3) * 0.06} as="div" className="h-full">
            <LightCard as="article" className={`${CARD} p-8 lg:p-10`}>
              <h3 className="font-display text-[1.75rem] leading-none text-paper">
                <a
                  href={`/services/${service.slug}`}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  {service.name}
                </a>
              </h3>
              <p className="mt-5 text-[0.9375rem] leading-[1.7] text-paper-80">{service.summary}</p>
              <Points points={service.points} />
              <p className="mt-8 flex items-center justify-between gap-3 border-t border-paper-12 pt-5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper-64 transition-colors duration-500 group-hover:text-paper">
                Read more
                <Arrow />
              </p>
            </LightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
