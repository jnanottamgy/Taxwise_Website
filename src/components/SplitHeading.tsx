"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
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
          <Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span
                data-word
                className="inline-block"
                style={{ "--wd": `${delay + i * step}s` } as React.CSSProperties}
              >
                {word}
              </span>
            </span>
            {/* An ordinary space, and outside the slot.
             *
             * It used to be a non-breaking space inside the word, because a
             * trailing space at the end of an inline-block's own line box is
             * removed by white-space processing and the words ran together.
             * But that put U+00A0 between every word of every heading on the
             * site, and find-in-page will not match a typed space against one:
             * you could read a heading and be unable to search for it.
             *
             * Out here it sits in the parent's inline formatting context,
             * where it is a real space — searchable, and the natural place for
             * the line to break. It carries no ink, so leaving it out of the
             * animated slot changes nothing anyone can see. */}
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
      {children}
    </Tag>
  );
}
