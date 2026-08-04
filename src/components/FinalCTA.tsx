import { finalCta, firm, whatsappUrl, displayPhone } from "@/lib/content";
import { Container, Label } from "./Section";
import { Reveal, DrawRule } from "./Reveal";
import SplitHeading from "./SplitHeading";

/** The office, four ways. No personal numbers or addresses anywhere. */
const channels = [
  {
    label: "Office line",
    value: displayPhone(firm.phone),
    href: `tel:${firm.phone}`,
    external: false,
  },
  { label: "WhatsApp", value: "Start a conversation", href: whatsappUrl, external: true },
  { label: "Email", value: firm.email, href: `mailto:${firm.email}`, external: false },
  {
    label: "Office",
    value: `${firm.address.street}, ${firm.address.locality}`,
    href: firm.mapsUrl,
    external: true,
  },
] as const;

export default function FinalCTA() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="ledger-ground relative isolate overflow-hidden border-t border-paper-12 py-[var(--spacing-section)]"
    >
      {/* A last pool of light, low and central — the lamp on the desk */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 105%, rgba(34,50,80,0.75), transparent 70%), radial-gradient(100% 80% at 50% 0%, rgba(14,27,47,0.9), transparent 60%)",
        }}
      />

      <Container>
        <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-16 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
          <Reveal>
            <Label>{finalCta.label}</Label>
          </Reveal>

          <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
            <SplitHeading
              id="contact-heading"
              text={finalCta.headline}
              step={0.06}
              className="max-w-[16ch] font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-[-0.03em] text-paper"
            />
            <Reveal delay={0.14} className="mt-8">
              <p className="max-w-[46ch] text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.7] text-paper-80">
                {finalCta.body}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-16 max-w-[46rem]">
                <li>
                  <DrawRule />
                </li>
                {channels.map((channel) => (
                  <li key={channel.label}>
                    <a
                      href={channel.href}
                      {...(channel.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      // Label beside value is a row that cannot shrink: an
                      // email is one unbreakable token, and with the label and
                      // the gap beside it the row's min-content beat a 320px
                      // viewport. The column grew to fit and the section's
                      // overflow:hidden then amputated it — standfirst cut
                      // mid-word, every arrow gone. It stacks until there is
                      // room for a row, which also keeps the layout safe
                      // against a longer address than the one here today.
                      className="group flex flex-col gap-2 border-b border-paper-12 py-6 transition-colors duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-paper-40 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist transition-colors duration-400 group-hover:text-paper">
                        {channel.label}
                      </span>
                      <span className="flex w-full min-w-0 items-center justify-between gap-4 sm:w-auto sm:justify-start sm:text-right">
                        <span className="min-w-0 break-words text-[0.9375rem] text-paper-80 transition-colors duration-400 group-hover:text-paper sm:text-[1.0625rem]">
                          {channel.value}
                        </span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          className="h-3.5 w-3.5 shrink-0 text-mist transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.25"
                        >
                          <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
                        </svg>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
