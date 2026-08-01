import { monthly, year, calendarNote } from "@/lib/calendar";
import { Section, Heading, Standfirst } from "./Section";
import { Reveal } from "./Reveal";
import LightCard from "./LightCard";

/**
 * The statutory calendar, set as a ledger — which is what it is. The recurring
 * monthly obligations run across the top, the annual cycle below them.
 *
 * This section exists because it is the most useful thing the site can give a
 * visitor who is not yet a client.
 */
export default function Calendar() {
  return (
    <Section
      id="calendar"
      label="Calendar"
      labelledBy="calendar-heading"
      aside={
        <p className="max-w-[22ch] text-sm leading-relaxed text-paper-64">
          The dates that decide whether compliance is routine or expensive.
        </p>
      }
    >
      <Heading id="calendar-heading">The dates we keep, so you do not have to.</Heading>
      <Reveal delay={0.18}>
        <Standfirst>
          Nothing here is secret, and all of it is missable. This is the calendar we run for every
          client — published in full, because a practice that keeps its deadlines has no reason to
          keep them quiet.
        </Standfirst>
      </Reveal>

      {/* Recurring monthly obligations */}
      <Reveal delay={0.06}>
        <h3 className="mt-24 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist">
          Every month
        </h3>
      </Reveal>

      <ul className="mt-8 grid gap-px bg-paper-12 sm:grid-cols-2 lg:grid-cols-3">
        {monthly.map((item, i) => (
          <Reveal key={item.form} delay={(i % 3) * 0.05} as="li" className="h-full">
            <LightCard className="flex h-full gap-6 bg-ink p-7 hover:bg-ink-2/40">
              {/* The dates carry the gold. This section is the firm's whole
                  argument — the dates it keeps — so it is the one place a
                  figure itself is worth the accent, not just its glyph. */}
              <span
                data-figure
                aria-hidden="true"
                className="shrink-0 font-display text-[2.75rem] leading-[0.8] text-gold"
              >
                {item.day}
              </span>
              <div>
                <p className="text-[0.9375rem] leading-snug text-paper">
                  <span className="sr-only">Day {item.day} of each month — </span>
                  {item.form}
                </p>
                <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mist">
                  {item.authority}
                </p>
                <p className="mt-3 text-[0.8125rem] leading-[1.65] text-paper-64">{item.detail}</p>
              </div>
            </LightCard>
          </Reveal>
        ))}
      </ul>

      {/* The annual cycle */}
      <Reveal delay={0.06}>
        <h3 className="mt-24 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist">
          Through the financial year
        </h3>
      </Reveal>

      {/* One reveal for the whole annual list rather than one per month — a
          long table that fades in row by row reads as fussy, and costs more. */}
      <Reveal className="mt-8 block">
        {year.map((month) => (
          <div key={month.month}>
            <div className="grid gap-x-8 border-t border-paper-12 py-7 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <h4 className="font-display text-[1.375rem] leading-none text-paper sm:pt-1">
                {month.month}
              </h4>
              <dl className="mt-5 sm:mt-0">
                {month.entries.map((entry) => (
                  <div
                    key={entry.form + entry.date}
                    className="group -mx-3 flex flex-col gap-1 rounded-sm px-3 py-2.5 transition-colors duration-300 hover:bg-ink-2/25 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <dt
                      data-figure
                      className="shrink-0 font-mono text-[0.6875rem] tracking-[0.14em] text-gold transition-colors duration-300 group-hover:text-gold-lit sm:w-8"
                    >
                      {entry.date}
                    </dt>
                    <dd className="flex flex-col gap-1 sm:flex-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                      <span className="text-[0.9375rem] text-paper-80">{entry.form}</span>
                      <span className="max-w-[38ch] text-[0.8125rem] leading-[1.6] text-mist sm:text-right">
                        {entry.note}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
        <div className="border-t border-paper-12" />
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mt-10 max-w-[62ch] text-[0.8125rem] leading-[1.7] text-mist">
          {calendarNote}
        </p>
      </Reveal>
    </Section>
  );
}
