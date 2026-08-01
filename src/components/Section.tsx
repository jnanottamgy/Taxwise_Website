import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import SplitHeading from "./SplitHeading";

/**
 * The marginal label, with the gold tick that marks the start of a section.
 * Every section label on the site renders through this, so the accent repeats
 * on a fixed rhythm down the page instead of being applied by hand.
 */
export function Label({
  children,
  id,
  className = "",
  as: Tag = "p",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  as?: "p" | "h2";
}) {
  return (
    <Tag id={id} className={`label flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="inline-block h-px w-6 shrink-0 bg-gold" />
      {children}
    </Tag>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[88rem] px-[var(--spacing-gutter)] ${className}`}>
      {children}
    </div>
  );
}

/**
 * Every section on the page hangs off the same structure: a narrow marginal
 * column carrying the label, and a wide column carrying the work. The rule
 * between them is the spine of the page.
 */
export function Section({
  id,
  label,
  aside,
  children,
  className = "",
  labelledBy,
}: {
  id: string;
  label: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy ?? `${id}-label`}
      className={`py-[var(--spacing-section)] ${className}`}
    >
      <Container>
        <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <Label id={`${id}-label`}>{label}</Label>
              {aside ? <div className="mt-8 hidden lg:block">{aside}</div> : null}
            </Reveal>
          </div>
          <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * The editorial headline used at the top of each section. It carries its own
 * entrance — the words rise one after the next — so it is not wrapped in a
 * `Reveal`; whatever follows it is delayed behind it instead.
 */
export function Heading({
  children,
  className = "",
  id,
}: {
  children: string;
  className?: string;
  id?: string;
}) {
  return (
    <SplitHeading
      text={children}
      id={id}
      className={`max-w-[20ch] font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.98] tracking-[-0.025em] text-paper ${className}`}
    />
  );
}

export function Standfirst({ children }: { children: ReactNode }) {
  return (
    <p className="mt-8 max-w-[52ch] text-[clamp(1rem,1.4vw,1.1875rem)] leading-[1.65] text-paper-80">
      {children}
    </p>
  );
}
