import { industries } from "@/lib/content";
import { Section, Heading, Standfirst } from "./Section";
import { Reveal } from "./Reveal";
import LightCard from "./LightCard";

export default function Industries() {
  return (
    <Section
      id="industries"
      label="Sectors"
      labelledBy="industries-heading"
      aside={
        <p className="max-w-[22ch] text-sm leading-relaxed text-paper-64">
          Each sector fails compliance in its own particular way.
        </p>
      }
    >
      <Heading id="industries-heading">Where we have already learned the hard parts.</Heading>
      <Reveal delay={0.18}>
        <Standfirst>
          Sector experience is not a badge. It is knowing which credit gets disallowed, which
          disclosure gets questioned, and which deadline is the one people miss.
        </Standfirst>
      </Reveal>

      <div className="mt-20 grid gap-px bg-paper-12 sm:grid-cols-2 lg:grid-cols-4">
        {industries.map((industry, i) => (
          <Reveal key={industry.name} delay={(i % 4) * 0.05} as="div" className="h-full">
            <LightCard className="flex h-full flex-col justify-between gap-10 bg-ink p-7 hover:bg-ink-2/40">
              <h3 className="font-display text-[1.375rem] leading-[1.15] text-paper">
                {industry.name}
              </h3>
              <p className="font-mono text-[0.6875rem] uppercase leading-[1.7] tracking-[0.1em] text-mist transition-colors duration-500 group-hover:text-paper-80">
                {industry.note}
              </p>
            </LightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
