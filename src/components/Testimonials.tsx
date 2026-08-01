import { testimonials } from "@/lib/content";
import { Section, Heading } from "./Section";
import { Reveal } from "./Reveal";

/**
 * Client quotes, set as pull quotes rather than as three equal columns.
 *
 * Three things carry this section, and none of them is motion:
 *
 * 1. The opening quotation mark hangs into the left margin. Setting it inline
 *    pushes the first line in by its own width and breaks the left edge of a
 *    column of type — hanging it is what typesetters have always done, and it
 *    is the detail that separates set type from placed text.
 * 2. The first quote is given the full measure and a larger size. Three
 *    identical columns is a layout; a lead and two supports is a composition.
 * 3. The attributions sit on a hairline that draws itself in, so the eye
 *    lands on the quote first and the credential second.
 */
export default function Testimonials() {
  const [lead, ...rest] = testimonials;

  return (
    <Section id="clients" label="Clients" labelledBy="clients-heading">
      <Heading id="clients-heading">In their words.</Heading>

      {/* The lead quote, at full measure */}
      <Reveal delay={0.16}>
        <figure className="mt-20">
          <blockquote className="relative max-w-[24ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.2] tracking-[-0.02em] text-paper">
            {/* Hung into the margin, and never announced — a screen reader
                already knows this is a quotation from the blockquote. */}
            <span
              aria-hidden="true"
              className="absolute right-full top-[-0.06em] pr-[0.12em] text-gold/70"
            >
              &ldquo;
            </span>
            {lead.quote}
          </blockquote>
          <figcaption className="mt-9 flex items-center gap-5">
            <span aria-hidden="true" className="h-px w-10 shrink-0 bg-gold" />
            <span className="font-mono text-[0.6875rem] uppercase leading-[1.8] tracking-[0.14em]">
              <span className="text-paper-80">{lead.role}</span>
              <span aria-hidden="true" className="text-mist">
                {" · "}
              </span>
              <span className="text-mist">{lead.context}</span>
            </span>
          </figcaption>
        </figure>
      </Reveal>

      {/* The supporting pair, quieter and set smaller */}
      <div className="mt-24 grid gap-x-16 gap-y-16 border-t border-paper-12 pt-16 sm:grid-cols-2">
        {rest.map((item, i) => (
          <Reveal key={item.quote} delay={0.08 + i * 0.08} as="figure" className="flex flex-col">
            <blockquote className="relative font-display text-[clamp(1.125rem,1.6vw,1.375rem)] leading-[1.4] tracking-[-0.01em] text-paper-80">
              <span
                aria-hidden="true"
                className="absolute right-full top-[-0.04em] pr-[0.12em] text-gold/50"
              >
                &ldquo;
              </span>
              {item.quote}
            </blockquote>
            {/* Pinned to the foot rather than sitting seven units under its own
                quote. The two quotes are different lengths, so hanging the
                attributions off the text left them at different heights and
                the pair read as two unrelated blocks; sharing a baseline is
                what makes them a pair. */}
            <figcaption className="mt-auto pt-7 font-mono text-[0.625rem] uppercase leading-[1.8] tracking-[0.14em]">
              <span className="text-paper-64">{item.role}</span>
              <br />
              <span className="text-mist">{item.context}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
