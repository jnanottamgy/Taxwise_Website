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
        <p className="absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[clamp(6rem,17vw,15rem)] leading-none tracking-[-0.03em] text-paper/[0.03]">
          TaxWise Consultants
        </p>
      </div>
      <Container className="relative">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {/* The same lockup as the nav, one step larger — this is the
                signature at the foot of the page. */}
            <p className="flex items-center gap-3.5 font-display text-2xl leading-none">
              <Mark className="h-8 w-auto shrink-0 text-paper" />
              <span>
                <span className="text-paper">TaxWise</span>{" "}
                <span className="text-mist">Consultants</span>
              </span>
            </p>
            <p className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-mist">
              {firm.descriptor} · {firm.city}
            </p>
            <address className="mt-8 max-w-[26ch] text-sm not-italic leading-[1.8] text-paper-64">
              {firm.address.street}
              <br />
              {firm.address.locality}
              <br />
              {firm.address.city} {firm.address.postalCode}
            </address>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper-64 transition-colors duration-300 hover:text-paper"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Office line and office address only — no personal contacts. */}
          <div className="flex flex-col gap-3 text-sm">
            <a
              href={`tel:${firm.phone}`}
              className="text-paper-64 transition-colors duration-300 hover:text-gold-lit"
            >
              {displayPhone(firm.phone)}
            </a>
            <a
              href={`mailto:${firm.email}`}
              className="text-paper-64 transition-colors duration-300 hover:text-gold-lit"
            >
              {firm.email}
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper-12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist">
            © {year} {firm.name}
          </p>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist">
            {firm.constitution} firm · Established {firm.founded}
          </p>
        </div>
      </Container>
    </footer>
  );
}
