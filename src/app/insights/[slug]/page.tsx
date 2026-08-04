import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPosts, getPost, formatDate } from "@/lib/insights";
import { firm, whatsappUrl } from "@/lib/content";
import { team } from "@/lib/team";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Container } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import LightCard from "@/components/LightCard";
import Magnetic from "@/components/Magnetic";

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${firm.url}/insights/${post.slug}`,
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = post.author ? team.find((m) => m.name === post.author) : undefined;
  const more = allPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  // Article structured data, so a search engine has the date, the author and
  // the headline without inferring them from the markup.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: `${firm.url}/insights/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${firm.url}/insights/${post.slug}` },
    articleSection: post.category,
    inLanguage: "en-IN",
    publisher: { "@id": `${firm.url}/#practice` },
    ...(post.author ? { author: { "@type": "Person", name: post.author } } : {}),
  };

  return (
    <>
      <Nav />
      <main id="main">
        <article>
          {/* ── Masthead ───────────────────────────────────────────── */}
          <header className="ledger-ground relative isolate overflow-hidden border-b border-paper-12 pt-40 pb-16 lg:pt-48 lg:pb-20">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(90% 70% at 20% 0%, rgba(34,50,80,0.7), transparent 65%), radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(14,27,47,0.9) 100%)",
              }}
            />
            <Container>
              <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
                <div>
                  <nav aria-label="Breadcrumb">
                    <ol className="-my-3 flex flex-wrap items-center gap-x-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist">
                      <li>
                        <a href="/insights" className="block py-3 transition-colors hover:text-paper">
                          Insights
                        </a>
                      </li>
                      <li aria-hidden="true">/</li>
                      <li className="py-3 text-gold" aria-current="page">
                        {post.category}
                      </li>
                    </ol>
                  </nav>
                  <p className="mt-8 font-mono text-[0.625rem] uppercase leading-[1.8] tracking-[0.16em] text-mist">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden="true"> · </span>
                    {post.readingTime} min read
                  </p>
                </div>

                <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                  <SplitHeading
                    as="h1"
                    delay={0.08}
                    step={0.035}
                    text={post.title}
                    className="max-w-[20ch] font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.0] tracking-[-0.03em] text-paper"
                  />
                  <Reveal delay={0.24} className="mt-10">
                    <p className="max-w-[54ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.65] text-paper-80">
                      {post.excerpt}
                    </p>
                  </Reveal>
                </div>
              </div>
            </Container>
          </header>

          {/* ── The piece ──────────────────────────────────────────── */}
          <div className="py-[var(--spacing-section)]">
            <Container>
              <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
                <div className="lg:sticky lg:top-32 lg:self-start">
                  {author ? (
                    <Reveal>
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist">
                        Written by
                      </p>
                      <div className="mt-5 flex items-center gap-4">
                        <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(245,244,242,0.14)]">
                          <img
                            src={author.photo}
                            alt=""
                            width={448}
                            height={448}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-full"
                            style={{
                              background:
                                "radial-gradient(circle at 50% 46%, transparent 58%, rgba(14,27,47,0.34) 82%, rgba(14,27,47,0.62) 100%)",
                            }}
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-[1.0625rem] leading-tight text-paper">
                            {author.name}
                          </span>
                          <span className="mt-1 block font-mono text-[0.5625rem] uppercase leading-[1.6] tracking-[0.14em] text-mist">
                            {author.role} · {author.credential}
                          </span>
                        </span>
                      </div>
                    </Reveal>
                  ) : null}
                </div>

                <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                  <Reveal>
                    {/* Sanitised at build time in lib/insights.ts — nothing in
                        the pipeline can put a script on the page. */}
                    <div
                      data-article
                      dangerouslySetInnerHTML={{ __html: post.html }}
                    />
                  </Reveal>
                </div>
              </div>
            </Container>
          </div>

          {/* ── Talk to us ─────────────────────────────────────────── */}
          <section
            aria-labelledby="engage-heading"
            className="ledger-ground relative isolate overflow-hidden border-t border-paper-12 py-[var(--spacing-section)]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(70% 55% at 50% 105%, rgba(34,50,80,0.7), transparent 70%), radial-gradient(100% 80% at 50% 0%, rgba(14,27,47,0.9), transparent 60%)",
              }}
            />
            <Container>
              <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 grid-cols-[minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)]">
                <Reveal>
                  <p className="label flex items-center gap-3">
                    <span aria-hidden="true" className="inline-block h-px w-6 shrink-0 bg-gold" />
                    Engage us
                  </p>
                </Reveal>
                <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                  <SplitHeading
                    id="engage-heading"
                    text="Does this apply to your position?"
                    className="max-w-[18ch] font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.98] tracking-[-0.025em] text-paper"
                  />
                  <Reveal delay={0.14} className="mt-8">
                    <p className="max-w-[46ch] text-[1.0625rem] leading-[1.7] text-paper-80">
                      A first conversation costs nothing and usually takes twenty minutes. Bring
                      the question this raised.
                    </p>
                    <div className="mt-10">
                      <Magnetic strength={0.25}>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-sheen inline-block rounded-full bg-paper px-8 py-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink transition duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(232,201,122,0.45)]"
                        >
                          Arrange a consultation
                        </a>
                      </Magnetic>
                    </div>
                  </Reveal>
                </div>
              </div>
            </Container>
          </section>

          {/* ── More ───────────────────────────────────────────────── */}
          {more.length ? (
            <section aria-labelledby="more-heading" className="border-t border-paper-12 py-20">
              <Container>
                <h2
                  id="more-heading"
                  className="label flex items-center gap-3"
                >
                  <span aria-hidden="true" className="inline-block h-px w-6 shrink-0 bg-gold" />
                  More from the practice
                </h2>
                <ul className="mt-10 grid gap-px bg-paper-12 lg:grid-cols-3">
                  {more.map((other) => (
                    <li key={other.slug}>
                      <LightCard className="flex h-full flex-col justify-between gap-8 bg-ink p-7 hover:bg-ink-2/40">
                        <div>
                          <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-gold">
                            {other.category}
                          </p>
                          <h3 className="mt-4 font-display text-[1.375rem] leading-[1.15] text-paper">
                            <a
                              href={`/insights/${other.slug}`}
                              className="after:absolute after:inset-0 after:content-['']"
                            >
                              {other.title}
                            </a>
                          </h3>
                        </div>
                        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mist">
                          <time dateTime={other.date}>{formatDate(other.date)}</time>
                        </p>
                      </LightCard>
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          ) : null}
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // Built from the post's own front matter, not from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
