import type { CSSProperties, ReactNode } from "react";
import { hero, stats, whatsappUrl } from "@/lib/content";
import { Container } from "./Section";
import LedgerCanvas from "./LedgerCanvas";
import Mark3D from "./Mark3D";
import Magnetic from "./Magnetic";
import CountUp from "./CountUp";

/**
 * The hero is a server component. Its entrance runs on CSS keyframes that
 * start at first paint, so the headline is never waiting on JavaScript — the
 * word-stagger below is server-rendered spans with per-word delays, not a
 * hydrated animation. The only client code in this section is the canvas
 * behind it and the counting figures at its foot.
 *
 * Parallax: CursorLight writes --par-x/--par-y onto this section; the content
 * block consumes them in a calc() transform, so depth costs no extra
 * hydration. The canvas light already leans toward the pointer, one layer
 * deeper, which is what sells the depth.
 */

const d = (delay: number) => ({ "--d": `${delay}s` }) as CSSProperties;

/** A run of words, each rising out of its own edge in sequence. */
function Words({ text, delay, step = 0.055 }: { text: string; delay: number; step?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
          <span data-hero-line className="inline-block" style={d(delay + i * step)}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </>
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
  // The emphasis line ends in a full stop; that stop is the one gold mark in
  // the headline — the entry closed, the way a final figure is ruled off.
  const emphasis = hero.headlineEmphasis.endsWith(".")
    ? hero.headlineEmphasis.slice(0, -1)
    : hero.headlineEmphasis;
  const hasStop = hero.headlineEmphasis.endsWith(".");
  const emphasisWords = emphasis.split(" ").length;

  return (
    <section
      id="top"
      className="ledger-ground relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* The light that rakes across the ruled ground */}
      <LedgerCanvas className="absolute inset-0 -z-20 h-full w-full" />

      {/* The crest occupies the right of the masthead, which the headline
          leaves empty — the firm's own shield extruded into a slowly turning
          wireframe, edges warming to gold. Scroll turns it. Hidden below lg,
          where the type needs the full width. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/2 items-center justify-center lg:flex"
      >
        <Mark3D className="h-[72%] w-full max-w-[36rem]" />
      </div>

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
          <div
            className="max-w-[64rem] transition-transform duration-500 ease-out will-change-transform"
            style={{
              transform:
                "translate3d(calc(var(--par-x, 0) * 14px), calc(var(--par-y, 0) * 10px), 0)",
            }}
          >
            <Fade delay={0.04}>
              <p className="label flex items-center gap-3">
                <span aria-hidden="true" className="inline-block h-px w-8 bg-gold" />
                {hero.eyebrow}
              </p>
            </Fade>

            <h1 className="mt-8 font-display text-[clamp(3rem,10vw,8.75rem)] leading-[0.9] tracking-[-0.035em] text-paper">
              <span className="block">
                <Words text={hero.headlineLead} delay={0.05} />
              </span>
              <em className="block not-italic text-mist">
                <Words text={emphasis} delay={0.2} />
                {hasStop ? (
                  <span className="inline-block overflow-hidden pb-[0.08em] align-top">
                    <span
                      data-hero-line
                      className="inline-block text-gold"
                      style={d(0.2 + emphasisWords * 0.055 + 0.1)}
                    >
                      .
                    </span>
                  </span>
                ) : null}
              </em>
            </h1>

            <Fade delay={0.48} className="mt-8 max-w-[46ch]">
              <p className="text-[clamp(1rem,1.5vw,1.1875rem)] leading-[1.7] text-paper-80">
                {hero.standfirst}
              </p>
            </Fade>

            <Fade
              delay={0.58}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Magnetic strength={0.25}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sheen block rounded-full bg-paper px-8 py-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(232,201,122,0.45)]"
                >
                  {hero.primaryCta}
                </a>
              </Magnetic>
              <a
                href="#services"
                className="btn-sheen rounded-full border border-paper-12 px-8 py-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-gold hover:text-gold-lit"
              >
                {hero.secondaryCta}
              </a>
            </Fade>
          </div>
        </Container>
      </div>

      {/* The figures sit on the balance rule at the foot of the page */}
      <Fade delay={0.68} className="relative border-t border-paper-12">
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
                  {/* The glyphs, not the digits. A rupee sign and a plus in
                      gold read as a mark on a statement; a whole figure in
                      gold reads as a highlighter. */}
                  {"prefix" in stat && stat.prefix ? (
                    <span className="text-gold">{stat.prefix}</span>
                  ) : null}
                  <CountUp value={Number(stat.figure)} />
                  <span className="text-gold">{stat.suffix}</span>
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
