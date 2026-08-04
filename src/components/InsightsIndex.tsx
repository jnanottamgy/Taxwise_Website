"use client";

import { useMemo, useState } from "react";
import { formatDate, type Category, type Post } from "@/lib/insights-shared";
import { Container } from "./Section";
import { Reveal } from "./Reveal";
import LightCard from "./LightCard";

/**
 * The archive.
 *
 * Every post is rendered on the server and filtering happens in the browser on
 * top of that, rather than category living in the URL. It means the whole
 * archive is in the HTML — indexable, and complete for a reader with
 * JavaScript off — while a reader with it gets the filter for free and no page
 * load between topics.
 *
 * Only the metadata a card needs is passed down; the rendered article bodies
 * never reach the client bundle.
 */

export type Card = Pick<Post, "slug" | "title" | "date" | "category" | "excerpt" | "readingTime" | "author">;

function Meta({ post }: { post: Card }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mist">
      <span className="text-gold">{post.category}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingTime} min read</span>
    </p>
  );
}

export default function InsightsIndex({
  lead,
  rest,
  categories,
}: {
  lead: Card;
  rest: Card[];
  categories: Category[];
}) {
  const [filter, setFilter] = useState<Category | null>(null);

  // With a filter on, the lead loses its privilege and joins the list — a
  // pinned post from another topic at the top of "Tax" would be a bug, not a
  // feature.
  const shown = useMemo(() => {
    if (!filter) return rest;
    return [lead, ...rest].filter((p) => p.category === filter);
  }, [filter, lead, rest]);

  return (
    <>
      {/* ── The lead ──────────────────────────────────────────────────── */}
      {!filter ? (
        <section aria-labelledby="lead-heading" className="border-b border-paper-12 pb-16">
          <Container>
            <Reveal>
              <LightCard
                as="article"
                className="flex flex-col gap-8 border-0 bg-ink-2/30 p-8 lg:flex-row lg:items-end lg:gap-16 lg:p-12"
              >
                <div className="lg:flex-1">
                  <Meta post={lead} />
                  <h2
                    id="lead-heading"
                    className="mt-6 max-w-[20ch] font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] tracking-[-0.025em] text-paper"
                  >
                    <a
                      href={`/insights/${lead.slug}`}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {lead.title}
                    </a>
                  </h2>
                </div>
                <div className="lg:w-[26rem] lg:shrink-0">
                  <p className="max-w-[46ch] text-[1.0625rem] leading-[1.7] text-paper-80">
                    {lead.excerpt}
                  </p>
                  <p className="mt-8 flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper-64 transition-colors duration-500 group-hover:text-paper">
                    Read in full
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-3.5 w-3.5 shrink-0 text-mist transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-gold"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    >
                      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
                    </svg>
                  </p>
                </div>
              </LightCard>
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* ── Filter and archive ───────────────────────────────────────── */}
      <section aria-labelledby="archive-heading" className="py-16 lg:py-24">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2
              id="archive-heading"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist"
            >
              {filter ? filter : "Everything else"}
              <span aria-hidden="true"> · </span>
              <span className="text-paper-64">
                {shown.length} {shown.length === 1 ? "post" : "posts"}
              </span>
            </h2>

            <div className="flex flex-wrap items-center gap-2.5">
              {[null, ...categories].map((c) => {
                const active = filter === c;
                return (
                  <button
                    key={c ?? "all"}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(c)}
                    className={`inline-flex min-h-[2.75rem] items-center rounded-full border px-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                      active
                        ? "border-gold bg-paper-06 text-gold-lit"
                        : "border-paper-12 text-paper-64 hover:border-paper-40 hover:text-paper"
                    }`}
                  >
                    {c ?? "Everything"}
                  </button>
                );
              })}
            </div>
          </div>

          {shown.length ? (
            <ol className="mt-12 border-t border-paper-12">
              {shown.map((post, i) => (
                <Reveal key={post.slug} delay={Math.min(i, 4) * 0.05} as="li">
                  <LightCard
                    as="article"
                    className="grid gap-x-14 gap-y-5 border-0 border-b border-paper-12 py-9 lg:grid-cols-[minmax(0,1fr)_26rem]"
                  >
                    <div>
                      <Meta post={post} />
                      <h3 className="mt-4 max-w-[26ch] font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] text-paper">
                        <a
                          href={`/insights/${post.slug}`}
                          className="after:absolute after:inset-0 after:content-['']"
                        >
                          {post.title}
                        </a>
                      </h3>
                    </div>
                    <p className="max-w-[48ch] text-[0.9375rem] leading-[1.7] text-paper-64 lg:self-center">
                      {post.excerpt}
                    </p>
                  </LightCard>
                </Reveal>
              ))}
            </ol>
          ) : (
            <p className="mt-12 border-t border-paper-12 py-16 text-[0.9375rem] leading-[1.7] text-paper-64">
              Nothing published under {filter} yet.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
