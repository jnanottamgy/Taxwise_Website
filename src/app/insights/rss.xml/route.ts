import { allPosts } from "@/lib/insights";
import { firm } from "@/lib/content";

/**
 * The feed.
 *
 * Cheap to publish and the only way a reader can follow a practice without
 * handing over an email address. Built at build time along with everything
 * else — `force-static` because there is nothing here that changes between
 * requests.
 */
export const dynamic = "force-static";

/** XML has five predefined entities and no others; escape all of them. */
function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822, which is what RSS 2.0 requires — not ISO 8601. */
function rfc822(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 9, 0, 0)).toUTCString();
}

export function GET() {
  const posts = allPosts();
  const site = firm.url;

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${site}/insights/${p.slug}</link>
      <guid isPermaLink="true">${site}/insights/${p.slug}</guid>
      <description>${esc(p.excerpt)}</description>
      <category>${esc(p.category)}</category>
      <pubDate>${rfc822(p.date)}</pubDate>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${firm.name} — Insights & Updates`)}</title>
    <link>${site}/insights</link>
    <atom:link href="${site}/insights/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc(
      "What changed in tax and regulation, what it costs to get wrong, and what we are working on."
    )}</description>
    <language>en-IN</language>
    ${posts[0] ? `<lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
