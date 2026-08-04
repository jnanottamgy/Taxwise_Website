import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

/**
 * Insights and updates.
 *
 * Posts are Markdown files in `content/insights`, read and rendered at build
 * time. Markdown rather than MDX on purpose: the people writing here are a tax
 * practice, not a front-end team, and they need to be able to add a post from
 * GitHub's own web editor without learning JSX or running anything locally.
 * Adding a post is adding one file — see `content/insights/README.md`.
 *
 * The rendered HTML is sanitised. Nothing in this pipeline should be able to
 * put a script on the page, however the file arrived in the repository.
 */

import { categories, type Category, type Post } from "./insights-shared";

// Re-exported so a server component has one import for the whole model.
export { categories, formatDate } from "./insights-shared";
export type { Category, Post } from "./insights-shared";

const DIR = path.join(process.cwd(), "content", "insights");

/**
 * GitHub's schema, plus the ids `rehype-slug` puts on headings so the
 * anchors survive sanitisation, and the alignment attributes GFM tables use.
 */
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "id"],
    th: [...(defaultSchema.attributes?.th ?? []), "align"],
    td: [...(defaultSchema.attributes?.td ?? []), "align"],
  },
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeSanitize, schema)
  .use(rehypeStringify);

function assertCategory(value: unknown, file: string): Category {
  if (typeof value === "string" && (categories as readonly string[]).includes(value)) {
    return value as Category;
  }
  // A typo in one file should fail the build loudly rather than quietly drop
  // the post out of every filter on the site.
  throw new Error(
    `content/insights/${file}: category must be one of ${categories.join(", ")} — got ${JSON.stringify(value)}`
  );
}

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, "");

  for (const key of ["title", "date", "excerpt"] as const) {
    if (!data[key]) throw new Error(`content/insights/${file}: missing "${key}" in the front matter`);
  }

  // gray-matter parses an unquoted YAML date into a Date; either form is fine
  // to write, and both end up as YYYY-MM-DD here.
  const date =
    data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date).slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`content/insights/${file}: date must be YYYY-MM-DD — got ${JSON.stringify(data.date)}`);
  }

  const words = content.trim().split(/\s+/).length;

  return {
    slug,
    title: String(data.title),
    date,
    category: assertCategory(data.category, file),
    excerpt: String(data.excerpt),
    author: data.author ? String(data.author) : undefined,
    featured: data.featured === true,
    readingTime: Math.max(1, Math.round(words / 200)),
    html: String(processor.processSync(content)),
  };
}

let cache: Post[] | null = null;

/** Every post, newest first. */
export function allPosts(): Post[] {
  if (cache) return cache;
  if (!fs.existsSync(DIR)) return (cache = []);

  cache = fs
    .readdirSync(DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));

  return cache;
}

export function getPost(slug: string) {
  return allPosts().find((p) => p.slug === slug);
}

/** The post that leads the index: whichever is pinned, else the newest. */
export function leadPost(posts: Post[] = allPosts()) {
  return posts.find((p) => p.featured) ?? posts[0];
}

/** Categories that actually have something in them, in canonical order. */
export function usedCategories(posts: Post[] = allPosts()): Category[] {
  const present = new Set(posts.map((p) => p.category));
  return categories.filter((c) => present.has(c));
}

