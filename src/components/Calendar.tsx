"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  authorities,
  calendarNote,
  countdownLabel,
  daysInMonth,
  daysUntil,
  monthName,
  nextFrom,
  occurrencesIn,
  type Authority,
  type Occurrence,
} from "@/lib/calendar";
import { Section, Heading, Standfirst } from "./Section";
import { Reveal } from "./Reveal";

/**
 * The statutory calendar, as a working instrument rather than a printed list.
 *
 * Three things are true of a compliance calendar and only one of them was true
 * of the version this replaces. It has to say what is due *next* — which means
 * knowing today's date. It has to be navigable, because the useful question is
 * usually "what does October look like", not "show me everything". And it has
 * to leave the page: a date you read on a website helps only while you are
 * looking at it, so the whole thing downloads as a subscribable calendar file
 * with a reminder three days ahead of each due date.
 *
 * On dates and static rendering. The page is prerendered, so `new Date()` on
 * the server is the *build* date. Rather than let that diverge from the
 * browser's date and blow up hydration, the build date arrives as a prop, the
 * first client render uses exactly that, and an effect corrects to the real
 * today immediately afterwards. Server and first client render agree by
 * construction; the correction is one re-render before anyone can interact.
 */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function parseISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** The tag that names which body an obligation runs to. */
function AuthorityTag({ authority }: { authority: Authority }) {
  return (
    <span className="shrink-0 rounded-full border border-paper-12 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mist">
      {authority}
    </span>
  );
}

export default function Calendar({
  today: buildDate,
  children,
}: {
  today: string;
  /** The full-year reference, rendered on the server and passed in. */
  children?: React.ReactNode;
}) {
  const [today, setToday] = useState(() => parseISODate(buildDate));
  const [cursor, setCursor] = useState(() => {
    const d = parseISODate(buildDate);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [filter, setFilter] = useState<Authority | null>(null);
  const [focusDay, setFocusDay] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const shouldFocus = useRef(false);

  // Correct the build date to the reader's actual date, once, on mount.
  useEffect(() => {
    const now = new Date();
    const real = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    setToday(real);
    setCursor({ year: real.getFullYear(), month: real.getMonth() + 1 });
  }, []);

  const monthOccurrences = useMemo(
    () => occurrencesIn(cursor.year, cursor.month),
    [cursor.year, cursor.month]
  );

  const visible = useMemo(
    () => (filter ? monthOccurrences.filter((o) => o.authority === filter) : monthOccurrences),
    [monthOccurrences, filter]
  );

  /** Day of month → how many obligations fall on it, after filtering. */
  const loadByDay = useMemo(() => {
    const map = new Map<number, number>();
    for (const o of visible) map.set(o.date.getDate(), (map.get(o.date.getDate()) ?? 0) + 1);
    return map;
  }, [visible]);

  const upcoming = useMemo(() => nextFrom(today, 3, filter), [today, filter]);

  const listed = selectedDay
    ? visible.filter((o) => o.date.getDate() === selectedDay)
    : visible;

  const total = daysInMonth(cursor.year, cursor.month);
  const leading = new Date(cursor.year, cursor.month - 1, 1).getDay();
  const isCurrentMonth =
    today.getFullYear() === cursor.year && today.getMonth() + 1 === cursor.month;

  const step = useCallback(
    (delta: number) => {
      setSelectedDay(null);
      setFocusDay(null);
      setCursor((c) => {
        const next = new Date(c.year, c.month - 1 + delta, 1);
        return { year: next.getFullYear(), month: next.getMonth() + 1 };
      });
    },
    []
  );

  const goToday = useCallback(() => {
    setCursor({ year: today.getFullYear(), month: today.getMonth() + 1 });
    setSelectedDay(today.getDate());
    setFocusDay(today.getDate());
  }, [today]);

  // Roving tabindex: one day is tabbable, arrows move between them. Focus is
  // only taken when a key moved it — never on a state change the reader did
  // not cause, which would steal focus mid-page.
  useEffect(() => {
    if (!shouldFocus.current || focusDay === null) return;
    shouldFocus.current = false;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-day="${focusDay}"]`)
      ?.focus();
  }, [focusDay, cursor]);

  function onGridKeyDown(e: React.KeyboardEvent) {
    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const current = focusDay ?? (isCurrentMonth ? today.getDate() : 1);

    if (e.key in deltas) {
      e.preventDefault();
      const target = new Date(cursor.year, cursor.month - 1, current + deltas[e.key]);
      shouldFocus.current = true;
      setFocusDay(target.getDate());
      if (target.getMonth() + 1 !== cursor.month || target.getFullYear() !== cursor.year) {
        setCursor({ year: target.getFullYear(), month: target.getMonth() + 1 });
      }
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      shouldFocus.current = true;
      setFocusDay(1);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      shouldFocus.current = true;
      setFocusDay(total);
      return;
    }
    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      step(e.key === "PageUp" ? -1 : 1);
    }
  }

  const tabbableDay =
    focusDay ?? selectedDay ?? (isCurrentMonth ? today.getDate() : 1);

  async function download() {
    const { buildIcs, icsFilename } = await import("@/lib/ics");
    const blob = new Blob([buildIcs({ filter })], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = icsFilename(filter);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

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
          None of this is confidential, and all of it is easily missed. This is the calendar we
          run for every client, published in full and available to download — a practice that keeps
          its deadlines has no reason to keep them private.
        </Standfirst>
      </Reveal>

      {/* ── What is due next ──────────────────────────────────────────── */}
      <Reveal delay={0.06}>
        <h3 className="mt-24 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist">
          Due next
        </h3>
        <ul className="mt-8 grid gap-px bg-paper-12 sm:grid-cols-3">
          {upcoming.map((o) => {
            const days = daysUntil(today, o.date);
            return (
              <li key={`${o.form}-${o.date.toDateString()}`} className="bg-ink p-6">
                {/* The countdown is the figure that matters here, so it takes
                    the gold — the same rule the rest of the page follows. */}
                <p
                  data-figure
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gold"
                >
                  {countdownLabel(days)}
                </p>
                <p className="mt-4 text-[1.0625rem] leading-snug text-paper">{o.form}</p>
                <p className="mt-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mist">
                  <time dateTime={`${o.year}-${String(o.onMonth).padStart(2, "0")}-${String(o.date.getDate()).padStart(2, "0")}`}>
                    {o.date.getDate()} {monthName(o.onMonth)}
                  </time>
                  <span aria-hidden="true"> · </span>
                  {o.authority}
                </p>
              </li>
            );
          })}
        </ul>
      </Reveal>

      {/* ── Filter ────────────────────────────────────────────────────── */}
      <Reveal delay={0.06}>
        <div className="mt-20 flex flex-wrap items-center gap-2.5">
          <span className="mr-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist">
            Filter
          </span>
          {[null, ...authorities].map((a) => {
            const active = filter === a;
            return (
              <button
                key={a ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setFilter(a);
                  setSelectedDay(null);
                }}
                // min-h rather than padding: the label is 10px mono, so the
                // padding that looks right leaves a 37px target. Setting the
                // height directly makes it 44 without inflating the pill.
                className={`inline-flex min-h-[2.75rem] items-center rounded-full border px-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                  active
                    ? "border-gold bg-paper-06 text-gold-lit"
                    : "border-paper-12 text-paper-64 hover:border-paper-40 hover:text-paper"
                }`}
              >
                {a ?? "Everything"}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* ── Grid and detail ──────────────────────────────────────────── */}
      <div className="mt-10 grid gap-x-14 gap-y-12 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-center justify-between gap-4">
            <h4
              id="calendar-month"
              aria-live="polite"
              className="font-display text-[1.5rem] leading-none text-paper"
            >
              {monthName(cursor.month)} {cursor.year}
            </h4>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => step(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-paper-12 text-paper-64 transition-colors duration-300 hover:border-gold hover:text-gold-lit"
              >
                <span className="sr-only">Previous month</span>
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.25">
                  <path d="M10 3 5 8l5 5" strokeLinecap="square" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goToday}
                className="flex h-11 items-center rounded-full border border-paper-12 px-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-paper-64 transition-colors duration-300 hover:border-gold hover:text-gold-lit"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-paper-12 text-paper-64 transition-colors duration-300 hover:border-gold hover:text-gold-lit"
              >
                <span className="sr-only">Next month</span>
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.25">
                  <path d="m6 3 5 5-5 5" strokeLinecap="square" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={gridRef}
            role="grid"
            aria-labelledby="calendar-month"
            onKeyDown={onGridKeyDown}
            className="mt-7"
          >
            <div role="row" className="grid grid-cols-7">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  role="columnheader"
                  aria-label={d}
                  className="pb-3 text-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mist"
                >
                  {d.slice(0, 2)}
                </div>
              ))}
            </div>

            {Array.from({ length: Math.ceil((leading + total) / 7) }, (_, week) => (
              <div role="row" key={week} className="grid grid-cols-7">
                {Array.from({ length: 7 }, (_, col) => {
                  const day = week * 7 + col - leading + 1;
                  if (day < 1 || day > total) {
                    return <div role="gridcell" key={col} className="min-h-[3.25rem]" />;
                  }
                  const load = loadByDay.get(day) ?? 0;
                  const isToday = isCurrentMonth && day === today.getDate();
                  const isSelected = selectedDay === day;
                  return (
                    <div role="gridcell" key={col} className="p-0.5">
                      <button
                        type="button"
                        data-day={day}
                        tabIndex={day === tabbableDay ? 0 : -1}
                        aria-pressed={isSelected}
                        aria-label={`${day} ${monthName(cursor.month)} ${cursor.year}${
                          load ? `, ${load} due` : ", nothing due"
                        }${isToday ? ", today" : ""}`}
                        onClick={() => {
                          setSelectedDay(isSelected ? null : day);
                          setFocusDay(day);
                        }}
                        className={`flex min-h-[3rem] w-full flex-col items-center justify-center gap-1.5 rounded-md border transition-colors duration-300 ${
                          isSelected
                            ? "border-gold bg-paper-06 text-paper"
                            : isToday
                              ? "border-paper-40 text-paper"
                              : load
                                ? "border-transparent text-paper hover:border-paper-12"
                                : "border-transparent text-paper-64 hover:border-paper-12"
                        }`}
                      >
                        <span data-figure className="font-mono text-[0.8125rem] leading-none">
                          {day}
                        </span>
                        {/* One mark per obligation, capped at four. The busy
                            days of the month are legible at a glance without
                            reading a single word — and the count is in the
                            label, so it does not rely on the marks alone. */}
                        <span aria-hidden="true" className="flex h-1 items-center gap-[3px]">
                          {Array.from({ length: Math.min(load, 4) }, (_, i) => (
                            <span key={i} className="block h-px w-1.5 bg-gold" />
                          ))}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={download}
            className="btn-sheen mt-8 inline-flex items-center gap-3 rounded-full border border-paper-12 px-6 py-3.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-paper transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-gold hover:text-gold-lit"
          >
            Add to your calendar
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.25">
              <path d="M8 2v9m0 0L4.5 7.5M8 11l3.5-3.5M2.5 13.5h11" strokeLinecap="square" />
            </svg>
          </button>
          <p className="mt-3 max-w-[30ch] text-[0.75rem] leading-[1.6] text-paper-64">
            An .ics file containing every date{filter ? ` for ${filter.toLowerCase()}` : ""},
            repeating annually, with a reminder three days in advance.
          </p>
        </Reveal>

        {/* ── What falls in the chosen month, or on the chosen day ────── */}
        <Reveal delay={0.08}>
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-paper-12 pb-4">
            <h4 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist">
              {selectedDay
                ? `${selectedDay} ${monthName(cursor.month)}`
                : `All of ${monthName(cursor.month)}`}
            </h4>
            {selectedDay ? (
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-paper-64 underline decoration-paper-12 underline-offset-4 transition-colors duration-300 hover:text-gold-lit"
              >
                Show the whole month
              </button>
            ) : (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-paper-64">
                {visible.length} {visible.length === 1 ? "obligation" : "obligations"}
              </span>
            )}
          </div>

          {listed.length ? (
            <ol>
              {listed.map((o) => (
                <li
                  key={`${o.form}-${o.date.getDate()}`}
                  className="border-b border-paper-12 py-6"
                >
                  <div className="flex items-baseline gap-5 sm:gap-7">
                    <span
                      data-figure
                      aria-hidden="true"
                      className="w-8 shrink-0 font-display text-[1.75rem] leading-none text-gold"
                    >
                      {o.date.getDate()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
                        <p className="text-[1.0625rem] leading-snug text-paper">
                          <span className="sr-only">
                            {o.date.getDate()} {monthName(o.onMonth)} —{" "}
                          </span>
                          {o.form}
                        </p>
                        <AuthorityTag authority={o.authority} />
                      </div>
                      <p className="mt-2.5 max-w-[56ch] text-[0.875rem] leading-[1.7] text-paper-64">
                        {o.detail}
                      </p>
                      {o.recurring ? (
                        <p className="mt-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mist">
                          Every month
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="py-10 text-[0.9375rem] leading-[1.7] text-paper-64">
              {selectedDay
                ? `Nothing falls due on ${selectedDay} ${monthName(cursor.month)}${
                    filter ? ` for ${filter.toLowerCase()}` : ""
                  }.`
                : `No ${filter?.toLowerCase()} obligations fall in ${monthName(cursor.month)}. Clear the filter to see the rest of the month.`}
            </p>
          )}

          <p className="mt-10 max-w-[62ch] text-[0.8125rem] leading-[1.7] text-mist">
            {calendarNote}
          </p>
        </Reveal>
      </div>

      {children}
    </Section>
  );
}
