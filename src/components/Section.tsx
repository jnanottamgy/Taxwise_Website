import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

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
        <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p id={`${id}-label`} className="label">
                {label}
              </p>
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

/** The editorial headline used at the top of each section. */
export function Heading({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className={`max-w-[20ch] font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.98] tracking-[-0.025em] text-paper ${className}`}
    >
      {children}
    </h2>
  );
}

export function Standfirst({ children }: { children: ReactNode }) {
  return (
    <p className="mt-8 max-w-[52ch] text-[clamp(1rem,1.4vw,1.1875rem)] leading-[1.65] text-paper-80">
      {children}
    </p>
  );
}
