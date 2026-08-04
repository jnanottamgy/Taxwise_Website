import { obligations, monthName } from "@/lib/calendar";

/**
 * The whole year on one screen, as static text.
 *
 * The grid above it is the working tool, but it only ever shows one month —
 * which means the rendered HTML only ever contains one month. This block is
 * the rest: every dated obligation, server-rendered, so the page still answers
 * "when is Form 3CEB due" for a reader with JavaScript off and for a search
 * engine that never runs any. It is a server component passed in as a child,
 * so none of it reaches the client bundle.
 *
 * Only the annual dates are listed. The six monthly obligations are named once
 * underneath rather than repeated twelve times.
 */
export default function CalendarYear() {
  const recurring = obligations.filter((o) => o.month === undefined);

  // Financial-year order — April first, as the calendar is actually lived.
  const order = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
  const months = order
    .map((m) => ({
      month: m,
      entries: obligations
        .filter((o) => o.month === m)
        .sort((a, b) => a.day - b.day || a.form.localeCompare(b.form)),
    }))
    .filter((m) => m.entries.length);

  return (
    /* A disclosure rather than an always-open block. Expanded it is the longest
       thing on the page — on a phone it doubles the section — and the grid
       above is the tool most people came for. `details` keeps it out of the way
       without hiding it from anything that matters: the markup is on the page,
       so a search engine indexes it and a reader with JavaScript off can still
       open it. */
    <details className="group mt-24 border-t border-paper-12 pt-8">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-3 [&::-webkit-details-marker]:hidden">
        <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist transition-colors duration-300 group-hover:text-paper">
          The full year — every dated obligation
        </h3>
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-paper-12 text-mist transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-gold group-hover:text-gold-lit group-open:rotate-180"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m3 6 5 5 5-5" strokeLinecap="square" />
          </svg>
        </span>
      </summary>

      <div className="mt-10 grid gap-x-14 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {months.map(({ month, entries }) => (
          <div key={month}>
            <h4 className="font-display text-[1.375rem] leading-none text-paper">
              {monthName(month)}
            </h4>
            <dl className="mt-5 border-t border-paper-12">
              {entries.map((o) => (
                <div key={o.form + o.day} className="flex gap-4 border-b border-paper-12 py-3">
                  <dt
                    data-figure
                    className="w-6 shrink-0 font-mono text-[0.6875rem] leading-[1.6] tracking-[0.12em] text-gold"
                  >
                    {o.day}
                  </dt>
                  <dd className="min-w-0 text-[0.8125rem] leading-[1.6] text-paper-80">
                    {o.form}
                    <span className="mt-1 block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-mist">
                      {o.authority}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-14 mb-6 border-t border-paper-12 pt-8">
        <h4 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist">
          And every month
        </h4>
        <ul className="mt-6 grid gap-x-14 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {recurring.map((o) => (
            <li key={o.form} className="flex gap-4 text-[0.8125rem] leading-[1.6] text-paper-80">
              <span
                data-figure
                aria-hidden="true"
                className="w-6 shrink-0 font-mono text-[0.6875rem] leading-[1.6] tracking-[0.12em] text-gold"
              >
                {String(o.day).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="sr-only">Day {o.day} of each month — </span>
                {o.form}
                <span className="mt-1 block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-mist">
                  {o.authority}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
