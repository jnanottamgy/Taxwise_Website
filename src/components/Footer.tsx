import { firm, nav, displayPhone } from "@/lib/content";
import { Container } from "./Section";
import Mark from "./Mark";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-paper-12 py-16">
      <Container>
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

          <div className="flex flex-col gap-3 text-sm">
            <a
              href={`tel:${firm.phonePartner}`}
              className="text-paper-64 transition-colors duration-300 hover:text-paper"
            >
              {displayPhone(firm.phonePartner)}
            </a>
            <a
              href={`tel:${firm.phoneFirm}`}
              className="text-paper-64 transition-colors duration-300 hover:text-paper"
            >
              {displayPhone(firm.phoneFirm)}
            </a>
            <a
              href={`mailto:${firm.emailPartner}`}
              className="text-paper-64 transition-colors duration-300 hover:text-paper"
            >
              {firm.emailPartner}
            </a>
            <a
              href={`mailto:${firm.emailFirm}`}
              className="text-paper-64 transition-colors duration-300 hover:text-paper"
            >
              {firm.emailFirm}
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper-12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist">
            © {year} {firm.name}
          </p>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist">
            {firm.managingPartner}, {firm.managingPartnerTitle}
          </p>
        </div>
      </Container>
    </footer>
  );
}
