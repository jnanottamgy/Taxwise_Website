import { testimonials } from "@/lib/content";
import { Section, Heading } from "./Section";
import { Reveal } from "./Reveal";

export default function Testimonials() {
  return (
    <Section id="clients" label="Clients" labelledBy="clients-heading">
      <Reveal>
        <Heading id="clients-heading">In their words.</Heading>
      </Reveal>

      <div className="mt-20 grid gap-x-12 gap-y-16 lg:grid-cols-3">
        {testimonials.map((item, i) => (
          <Reveal key={item.quote} delay={i * 0.08} as="figure" className="flex flex-col">
            <span aria-hidden="true" className="mb-8 block h-px w-10 bg-gold" />
            <blockquote className="font-display text-[clamp(1.25rem,1.9vw,1.5rem)] leading-[1.35] tracking-[-0.01em] text-paper">
              {item.quote}
            </blockquote>
            <figcaption className="mt-8 font-mono text-[0.6875rem] uppercase leading-[1.8] tracking-[0.14em]">
              <span className="text-paper-80">{item.role}</span>
              <br />
              <span className="text-mist">{item.context}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
