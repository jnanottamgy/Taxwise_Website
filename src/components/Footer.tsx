import { firm, nav, displayPhone } from "@/lib/content";
import { Container } from "./Section";
import Mark from "./Mark";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-paper-12 py-16">
      {/* The closing plate: a low pool of warm light, and the firm's name set
          enormous and almost invisible — a watermark pressed into the page. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 90% at 50% 130%, rgba(201,168,76,0.07), transparent 62%)",
          }}
        />
        {/* One word instead of two, so it is set far larger than the old
            lockup and pushed further under the fold of the plate — at this
            size the letterforms have to sit below the content rather than
            behind it, or the address reads through the strokes. */}
        <p className="absolute -bottom-[0.32em] left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[clamp(8rem,23vw,19rem)] leading-none tracking-[-0.03em] text-paper/[0.028]">
          {firm.name}
        </p>
      </div>
      <Container className="relative">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {/* The same lockup as the nav, one step larger — this is the
                signature at the foot of the page. */}
            <p className="flex items-center gap-3.5 font-display text-[1.75rem] leading-none text-paper">
              <Mark className="h-8 w-auto shrink-0 text-paper" />
              {firm.name}
            </p>
            <p className="mt-3 font-mono text-[0.6875rem] uppercase leading-[1.7] tracking-[0.18em] text-mist">
              {firm.descriptor}
              <br />
              Head office, {firm.city} · {firm.areaServed}
            </p>
            <address className="mt-8 max-w-[26ch] text-sm not-italic leading-[1.8] text-paper-64">
              {firm.address.street}
              <br />
              {firm.address.locality}
              <br />
              {firm.address.city} {firm.address.postalCode}
            </address>
          </div>

          {/* Padding, not gap, carries the spacing on touch: it is the same
              rhythm but the whole strip is tappable. 17px links were the real
              defect here — a finger is nearer 44. */}
          <nav aria-label="Footer" className="-my-3 flex flex-col lg:my-0 lg:gap-3">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper-64 transition-colors duration-300 hover:text-paper lg:py-0"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Office line and office address only — no personal contacts. */}
          <div className="-my-3 flex flex-col text-sm lg:my-0 lg:gap-3">
            <a
              href={`tel:${firm.phone}`}
              className="py-3 text-paper-64 transition-colors duration-300 hover:text-gold-lit lg:py-0"
            >
              {displayPhone(firm.phone)}
            </a>
            <a
              href={`mailto:${firm.email}`}
              className="py-3 text-paper-64 transition-colors duration-300 hover:text-gold-lit lg:py-0"
            >
              {firm.email}
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper-12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-mist">
            © {year} {firm.name}
          </p>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-mist">
            {firm.constitution} firm · Established {firm.founded}
          </p>
        </div>
      </Container>
    </footer>
  );
}
