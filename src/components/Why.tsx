import { why } from "@/lib/content";
import { Section, Heading, Standfirst } from "./Section";
import { Reveal } from "./Reveal";

export default function Why() {
  return (
    <Section id="why" label="Why TaxWise" labelledBy="why-heading">
      <Heading id="why-heading">Four things that do not change.</Heading>
      <Reveal delay={0.18}>
        <Standfirst>
          Most practices will tell you they are thorough. These are the specific commitments we
          hold ourselves to, and the numbers behind them.
        </Standfirst>
      </Reveal>

      <dl className="mt-20 grid gap-x-16 gap-y-px sm:grid-cols-2">
        {/* dl > div > dt,dd — a single wrapper level keeps the list valid */}
        {why.map((item, i) => (
          <Reveal
            key={item.unit}
            delay={(i % 2) * 0.08}
            as="div"
            className="flex flex-col gap-6 border-t border-paper-12 py-10 sm:flex-row sm:gap-10"
          >
            <dt className="shrink-0 sm:w-28">
              <span
                data-figure
                className="font-display text-[clamp(3rem,5vw,4.5rem)] leading-[0.85] text-paper"
              >
                {item.figure}
              </span>
            </dt>
            <dd>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-mist">
                {item.unit}
              </p>
              <p className="mt-4 max-w-[38ch] text-[0.9375rem] leading-[1.75] text-paper-80">
                {item.body}
              </p>
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
