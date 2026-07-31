import type { CSSProperties, ReactNode } from "react";
import { hero, stats, whatsappUrl } from "@/lib/content";
import { Container } from "./Section";
import LedgerCanvas from "./LedgerCanvas";

/**
 * The hero is a server component. Its entrance runs on CSS keyframes that
 * start at first paint, so the headline is never waiting on JavaScript, and
 * the only client code in this section is the canvas behind it.
 */

const d = (delay: number) => ({ "--d": `${delay}s` }) as CSSProperties;

/** A headline line that rises out of its own edge. */
function Line({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span data-hero-line className="block" style={d(delay)}>
        {children}
      </span>
    </span>
  );
}

function Fade({
  children,
  delay,
  className = "",
}: {
  children: ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <div data-hero-fade className={className} style={d(delay)}>
      {children}
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="ledger-ground relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* The light that rakes across the ruled ground */}
      <LedgerCanvas className="absolute inset-0 -z-20 h-full w-full" />

      {/* Vignette: lets the page fall away at the edges so the type stays first */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 30%, rgba(14,27,47,0.55) 70%, rgba(14,27,47,0.92) 100%)",
        }}
      />

      <div className="flex flex-1 items-center pt-28 pb-12">
        <Container>
          <div className="max-w-[64rem]">
            <Fade delay={0.04}>
              <p className="label flex items-center gap-3">
                <span aria-hidden="true" className="inline-block h-px w-8 bg-mist" />
                {hero.eyebrow}
              </p>
            </Fade>

            <h1 className="mt-8 font-display text-[clamp(3rem,10vw,8.75rem)] leading-[0.9] tracking-[-0.035em] text-paper">
              <Line delay={0.05}>{hero.headlineLead}</Line>
              <Line delay={0.13}>
                <em className="not-italic text-mist">{hero.headlineEmphasis}</em>
              </Line>
            </h1>

            <Fade delay={0.4} className="mt-8 max-w-[46ch]">
              <p className="text-[clamp(1rem,1.5vw,1.1875rem)] leading-[1.7] text-paper-80">
                {hero.standfirst}
              </p>
            </Fade>

            <Fade
              delay={0.5}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-paper px-8 py-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(245,244,242,0.4)]"
              >
                {hero.primaryCta}
              </a>
              <a
                href="#services"
                className="rounded-full border border-paper-12 px-8 py-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-paper-40 hover:bg-paper-06"
              >
                {hero.secondaryCta}
              </a>
            </Fade>
          </div>
        </Container>
      </div>

      {/* The figures sit on the balance rule at the foot of the page */}
      <Fade delay={0.62} className="relative border-t border-paper-12">
        <Container>
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`py-7 lg:py-8 ${
                  i % 2 === 1 ? "border-l border-paper-12 pl-6" : "pr-6"
                } ${i > 1 ? "border-t border-paper-12 lg:border-t-0" : ""} ${
                  i > 0 ? "lg:border-l lg:border-paper-12 lg:pl-8" : ""
                }`}
              >
                <dd
                  data-figure
                  className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-none text-paper"
                >
                  {"prefix" in stat && stat.prefix ? (
                    <span className="text-mist">{stat.prefix}</span>
                  ) : null}
                  {stat.figure}
                  <span className="text-mist">{stat.suffix}</span>
                </dd>
                <dt className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-paper-64">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Container>
      </Fade>
    </section>
  );
}
