import { obligations, monthName, type Authority, type Obligation } from "./calendar";

/**
 * The calendar, as a file you can put in your own calendar.
 *
 * This is the point of publishing a compliance calendar at all: reading one on
 * a website helps for as long as you are looking at it. Subscribing to it means
 * the reminder arrives on the seventh of the month whether or not anyone
 * remembered to look.
 *
 * Written as recurrence rules rather than as several hundred dated events, so
 * the file stays small and keeps working next year. Every event is all-day,
 * with an alarm three days ahead — far enough out to act on, close enough to
 * still be true.
 */

/** RFC 5545 §3.3.11: escape backslash, semicolon, comma and newline in TEXT. */
function esc(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * RFC 5545 §3.1: no line may exceed 75 octets. Longer ones are folded onto a
 * continuation line beginning with a single space. Measured in octets rather
 * than characters, because the detail lines carry en dashes and rupee signs
 * and a character count would let those lines run over.
 */
function fold(line: string) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;

  const out: string[] = [];
  let current = "";
  let currentBytes = 0;
  let limit = 75;

  for (const char of line) {
    const size = new TextEncoder().encode(char).length;
    if (currentBytes + size > limit) {
      out.push(current);
      current = "";
      currentBytes = 0;
      limit = 74; // a continuation line spends one octet on its leading space
    }
    current += char;
    currentBytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

function stamp(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`
  );
}

function dateValue(year: number, month: number, day: number) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${year}${p(month)}${p(day)}`;
}

/** A stable identifier, so re-importing updates rather than duplicates. */
function uid(o: Obligation) {
  const slug = o.form
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${o.month ?? "monthly"}-${o.day}-${slug}@twchartered.com`;
}

function event(o: Obligation, now: Date): string[] {
  // Both kinds anchor to now: a monthly series begins this month, and a yearly
  // one begins on its date this year. Anchoring a yearly rule to a later year
  // would drop the current year's occurrence entirely, which is the one the
  // reader is most likely to need.
  const month = o.month ?? now.getMonth() + 1;
  const anchorYear = now.getFullYear();
  const start = dateValue(anchorYear, month, o.day);
  const endDay = new Date(anchorYear, month - 1, o.day + 1);
  const end = dateValue(endDay.getFullYear(), endDay.getMonth() + 1, endDay.getDate());

  const rule =
    o.month === undefined
      ? `RRULE:FREQ=MONTHLY;BYMONTHDAY=${o.day}`
      : `RRULE:FREQ=YEARLY;BYMONTH=${o.month};BYMONTHDAY=${o.day}`;

  const cadence =
    o.month === undefined
      ? "Every month"
      : `Every year on ${o.day} ${monthName(o.month)}`;

  return [
    "BEGIN:VEVENT",
    fold(`UID:${uid(o)}`),
    `DTSTAMP:${stamp(now)}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    rule,
    fold(`SUMMARY:${esc(`${o.form} — ${o.authority}`)}`),
    fold(`DESCRIPTION:${esc(`${o.detail}\n\n${cadence}. Standard statutory date; extensions are issued from time to time. TaxWise — twchartered.com`)}`),
    fold(`CATEGORIES:${esc(o.authority)}`),
    "TRANSP:TRANSPARENT",
    "BEGIN:VALARM",
    "TRIGGER:-P3D",
    "ACTION:DISPLAY",
    fold(`DESCRIPTION:${esc(`${o.form} is due in three days`)}`),
    "END:VALARM",
    "END:VEVENT",
  ];
}

/**
 * The whole calendar as an iCalendar file. `filter` narrows it to one
 * authority, so someone who only wants the GST cycle is not handed the
 * Companies Act as well.
 */
export function buildIcs({
  filter,
  now = new Date(),
}: {
  filter?: Authority | null;
  now?: Date;
} = {}) {
  const chosen = filter ? obligations.filter((o) => o.authority === filter) : obligations;
  const name = filter ? `TaxWise — ${filter} calendar` : "TaxWise — compliance calendar";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TaxWise//Compliance Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    fold(`X-WR-CALNAME:${esc(name)}`),
    fold(`X-WR-CALDESC:${esc("Statutory due dates under Indian tax and corporate law. Published by TaxWise, twchartered.com.")}`),
    ...chosen.flatMap((o) => event(o, now)),
    "END:VCALENDAR",
  ];

  // CRLF throughout, and a trailing one — some parsers drop the final line
  // without it.
  return lines.join("\r\n") + "\r\n";
}

export function icsFilename(filter?: Authority | null) {
  const slug = filter ? filter.toLowerCase().replace(/\s+/g, "-") : "compliance";
  return `taxwise-${slug}-calendar.ics`;
}
