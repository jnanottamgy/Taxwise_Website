# How to publish a post

Every post on **Insights & Updates** is one file in this folder. Add a file, and
the post appears — on `/insights`, in the RSS feed, in the sitemap, and in
"More from the practice" at the foot of the other articles. Nothing else needs
touching.

You do not need to install anything. The whole job can be done in a browser.

---

## Adding a post from GitHub

1. Go to the repository and open **`content/insights`**.
2. Press **Add file → Create new file**.
3. Name it after the article, in lower case, with hyphens instead of spaces,
   ending in `.md`. The name becomes the web address:

   `input-tax-credit-dies-quietly.md` → `twchartered.com/insights/input-tax-credit-dies-quietly`

   Keep it short and readable. It cannot be changed later without breaking any
   link anyone has shared.
4. Paste the template below, replace the content, and press **Commit changes**.
5. The site rebuilds and publishes itself within a couple of minutes.

To **edit** a published post, open its file and press the pencil icon.
To **unpublish** one, delete the file.

### Drafts

Start the filename with an underscore — `_half-written-piece.md` — and it will
sit in this folder without publishing. Take the underscore off when it is ready.

(This file, `README.md`, is the guide you are reading and is never published
either.)

---

## The template

```markdown
---
title: The headline, in sentence case
date: 2026-08-04
category: Tax
excerpt: One or two sentences. This is what appears under the headline on the index, and what Google shows in the search result.
author: Vinay Karlagere
---

Open with the point. The first paragraph is the one people read.

## A section heading

Body text. Write in plain sentences — the site sets everything else.

- A list item
- Another one

## Another section

**Bold** for emphasis, *italics* where you mean them, and
[a link](https://example.com) written like this.
```

Everything between the two `---` lines is the file's settings. Everything below
is the article.

---

## The settings

| Setting | Required | What it does |
| --- | --- | --- |
| `title` | yes | The headline. No quotation marks needed unless it contains a colon. |
| `date` | yes | `YYYY-MM-DD`. Sorts the archive — newest first. |
| `category` | yes | One of **Firm news**, **Tax**, **Finance**, **Regulation**. Exactly as spelt. |
| `excerpt` | yes | One or two sentences, shown on the index and used as the search description. |
| `author` | no | A partner's name, spelt exactly as it appears on the Team section. Adds their photo and title beside the article. |
| `featured` | no | `true` pins the post to the large slot at the top of the index. Only put it on one post at a time. |

A typo in `category` or a malformed `date` will stop the site from building,
with a message naming the file. That is deliberate — better a clear failure
than a post that quietly vanishes from every filter.

Reading time is worked out from the length. You do not set it.

---

## Choosing a category

- **Firm news** — the practice's own news. A milestone, an appointment, a
  publication, something you shipped.
- **Tax** — income tax, GST, TDS. Anything under the tax Acts.
- **Finance** — funding, banking, valuation, working capital, the economy.
- **Regulation** — MCA and the Companies Act, RBI, SEBI, labour.

---

## Writing notes

The site's voice is plain and specific. It works best when a post:

- says the useful thing in the first paragraph rather than building to it
- names the section, the form or the date rather than gesturing at "regulations"
- explains what something costs when it goes wrong, in rupees or in weeks
- ends without a summary — if the point needed summarising, it needed rewriting

Around 600 to 1,200 words is the right length. Below that it reads as a note;
well above it and people stop.

---

## What Markdown gives you

| You write | You get |
| --- | --- |
| `## Heading` | A section heading |
| `### Heading` | A smaller heading |
| `**bold**` | **bold** |
| `*italics*` | *italics* |
| `- item` | A bulleted list |
| `1. item` | A numbered list |
| `[text](https://url)` | A link |
| `> quoted line` | A pull quote |
| `---` | A dividing rule |
| A table, as in this file | A table |

Anything else — raw HTML, scripts — is stripped before the page is built.

---

## One thing worth knowing

Dates in posts age. A piece that says "the rate is now 18 per cent" is wrong the
moment it changes, and it will sit at that address for years. Prefer writing
about how a rule works over what this week's number is: it stays true, and it
keeps earning search traffic long after a news item has stopped.
