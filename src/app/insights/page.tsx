import type { Metadata } from "next";
import { allPosts, leadPost, usedCategories } from "@/lib/insights";
import { firm } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Container } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import InsightsIndex, { type Card } from "@/components/InsightsIndex";

export const metadata: Metadata = {
  title: "Insights & Updates",
  description:
    "Notes from the practice: what changed in tax and regulation, what it costs to get wrong, and what we are working on.",
  alternates: { canonical: "/insights", types: { "application/rss+xml": "/insights/rss.xml" } },
  openGraph: {
    title: `Insights & Updates — ${firm.name}`,
    description:
      "Notes from the practice: what changed in tax and regulation, what it costs to get wrong, and what we are working on.",
    url: `${firm.url}/insights`,
  },
};

/** Only what a card needs — the rendered bodies stay on the server. */
function toCard(p: ReturnType<typeof allPosts>[number]): Card {
  return {
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    excerpt: p.excerpt,
    readingTime: p.readingTime,
    author: p.author,
  };
}

export default function InsightsPage() {
  const posts = allPosts();
  const lead = leadPost(posts);

  return (
    <>
      <Nav />
      <main id="main">
        {/* ── Masthead ─────────────────────────────────────────────── */}
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
                <p className="label flex items-center gap-3">
                  <span aria-hidden="true" className="inline-block h-px w-6 shrink-0 bg-gold" />
                  Insights
                </p>
              </div>

              <div className="lg:border-l lg:border-paper-12 lg:pl-[clamp(2rem,5vw,5rem)]">
                <SplitHeading
                  as="h1"
                  delay={0.08}
                  step={0.05}
                  text="Insights & Updates"
                  className="max-w-[16ch] font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.94] tracking-[-0.03em] text-paper"
                />
                <Reveal delay={0.22} className="mt-10">
                  <p className="max-w-[54ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.65] text-paper-80">
                    What changed in tax and regulation, what it costs to get wrong, and what we are
                    working on. Written by the partners doing the work, not by a content desk.
                  </p>
                  <a
                    href="/insights/rss.xml"
                    className="mt-8 inline-flex min-h-[2.75rem] items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-paper-64 transition-colors duration-300 hover:text-gold-lit"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-3.5 w-3.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    >
                      <path d="M3 12.5h.01M3 8a5 5 0 0 1 5 5M3 3.5a9 9 0 0 1 9 9" strokeLinecap="round" />
                    </svg>
                    Subscribe by RSS
                  </a>
                </Reveal>
              </div>
            </div>
          </Container>
        </header>

        {posts.length ? (
          <InsightsIndex
            lead={toCard(lead)}
            rest={posts.filter((p) => p.slug !== lead.slug).map(toCard)}
            categories={usedCategories(posts)}
          />
        ) : (
          <section className="py-[var(--spacing-section)]">
            <Container>
              <p className="max-w-[46ch] text-[1.0625rem] leading-[1.7] text-paper-64">
                Nothing published yet. The first note is being written.
              </p>
            </Container>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
