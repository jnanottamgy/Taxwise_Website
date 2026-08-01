"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { observeReveal } from "./Reveal";

/**
 * A heading whose words rise out of their own edge, one after the next.
 *
 * The words are rendered on the server — this component only attaches the
 * shared IntersectionObserver, which flips a single attribute on the heading
 * and lets CSS do the staggering. Nothing per-word is hydrated.
 *
 * It carries its own reveal rather than sitting inside a `Reveal` wrapper:
 * a blur-and-rise on the block *and* a stagger on the words inside it is two
 * animations doing one job, and it reads muddy. The heading leads, and
 * whatever follows it is delayed behind it.
 *
 * The full string stays in the accessibility tree as one label, because the
 * per-word spans would otherwise be announced as separate fragments and
 * `Where strategy` `meets certainty` would run together as one word.
 */
export default function SplitHeading({
  text,
  id,
  className = "",
  as: Tag = "h2",
  delay = 0,
  step = 0.045,
  children,
}: {
  text: string;
  id?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  step?: number;
  /** Rendered after the words — a trailing mark, for instance. */
  children?: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => observeReveal(ref.current), []);

  const words = text.split(" ");

  return (
    <Tag ref={ref} id={id} data-split="" className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span
              data-word
              className="inline-block"
              style={{ "--wd": `${delay + i * step}s` } as React.CSSProperties}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </span>
      {children}
    </Tag>
  );
}
