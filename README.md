# TaxWise Consultants

Marketing site for TaxWise Consultants, a chartered accountancy practice in
Bangalore led by HK Vinay.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

Node 20+ required. No environment variables, no backend, no database — the
whole site is statically prerendered.

## Design

**Palette.** Five navies and one off-white, fixed:

| Token | Hex | Used for |
|---|---|---|
| `ink` | `#0E1B2F` | page ground |
| `ink-2` | `#223250` | raised surfaces |
| `ink-3` | `#34476A` | rules and borders |
| `slate` | `#536B94` | large text only — 3.20:1 on ink |
| `mist` | `#7184A9` | secondary text — 4.59:1 on ink |
| `paper` | `#F5F4F2` | off-white |

There is no accent colour. Light is the accent: a soft pool that rakes across
the hero, catches the cursor on a card, and pools once more at the closing
section. Nothing on the page glows on its own.

Body copy on the dark ground uses tints of `paper` (`paper-80`, `paper-64`)
rather than the mid navies, because those tints clear 4.5:1 and `slate` does
not. `slate` is reserved for the light section, where it measures 4.90:1.

**Type.** Instrument Serif for display, Instrument Sans for body, IBM Plex Mono
for labels and figures. The mono is doing real work: it is the vernacular of a
statement, and every figure on the site is set with tabular numerals so columns
line up the way they would on paper.

**Structure.** Every section hangs off the same spine — a narrow marginal
column carrying a mono label, a hairline rule, then the wide column with the
work. Step numbers appear in exactly one place, the process timeline, because
that is the only content where order is information.

**The light section.** `About` is the single off-white section. After a long
dark page it reads as a room with the blinds opened, which is the right feeling
for the part that explains who you are hiring.

**The portraits.** The four team photographs came from the firm's existing site
shot on four unrelated backgrounds — foliage, two white studio backdrops, a grey
wall. Dropped onto the ink ground as-is they read as four unrelated pictures, so
they are mapped through a duotone built from the site's own palette: `ink` in the
shadows, `slate` at the midpoint, and a light navy at the top. The highlight
deliberately stops short of `paper` — taken all the way, the two studio backdrops
render as glaring white blocks and the set stops reading as a set.

The sources are 270×270; the shipped files are 400×400 WebP at 7–12KB each.
`scripts/duotone-portraits.mjs` regenerates them if the firm supplies new
photographs — it needs `sharp`, which is deliberately not a project dependency
since it is only wanted when the pictures change.

**The mark.** A shield carrying a TW monogram, supplied as `taxwise.svg` on a
1920×1080 artboard of which the artwork occupied 327×366 — the rest was empty.
`src/lib/brand.ts` holds the path data with the artwork's measured bounding box
as its viewBox, so the mark scales from a 16px favicon to the 1200px social card
without dragging 94% dead space behind it.

It is drawn in `currentColor`, not in the supplied `#090E90`. That blue measures
**1.21:1** against the page ground — invisible — and **12.94:1** on `paper`. So
the mark inherits `paper` on the dark ground and the brand blue stays available
for genuinely light surfaces. Same component, no second asset, and the site's
"no accent colour" rule survives contact with a brand palette.

The mark is `aria-hidden` wherever the wordmark sits beside it, so a screen
reader announces the firm's name once rather than twice. Pass `title` only where
it stands alone.

## Content

The site is eight homepage sections plus a page per service.

```
/                       hero · services · why · process · calendar
                        · sectors · clients · firm · team · contact
/services/taxation
/services/audit
/services/gst
/services/accounting
/services/business-advisory
/services/roc-compliance
/services/startup-advisory
```

Each service page carries a standfirst, who it is for, a statute reference
block, three or four "what it covers" sections with the specific forms and
sections named, what the client receives, and a CTA naming the engagement lead.

The **compliance calendar** on the homepage publishes the monthly cycle and the
annual cycle in full. It is the most useful thing the site can hand a visitor
who is not yet a client, which is the point.

## Architecture

```
src/
  app/
    layout.tsx           fonts, metadata, JSON-LD, CursorLight
    page.tsx             homepage section order
    globals.css          tokens, base, lightcard, reveal + hero keyframes
    services/[slug]/     the seven service pages (generateStaticParams)
    icon.svg             favicon — the mark on an ink tile
    apple-icon.png       180×180 touch icon
    opengraph-image.png  1200×630 link preview
    sitemap.ts  robots.ts
  components/
    Hero.tsx             server component; CSS-keyframe entrance
    LedgerCanvas.tsx     the raking light (the only canvas)
    Mark.tsx             the shield mark, drawn in currentColor
    Section.tsx          Container, Section, Heading, Standfirst
    Reveal.tsx           CSS scroll reveals on one shared IntersectionObserver
    LightCard.tsx        server-rendered lit surface
    CursorLight.tsx      one delegated pointer listener for every lit surface
    Calendar · Services · Why · Process · Industries
    · Testimonials · About · Team · FinalCTA · Nav · Footer
  lib/
    content.ts           firm details, hero, stats, process, about, nav
    services.ts          the service catalogue — every word of it
    calendar.ts          the statutory calendar
    team.ts              the four practitioners
    brand.ts             the mark's path data and true viewBox
    jsonld.ts            AccountingService structured data
```

Nothing is hardcoded in a component. Every word, figure, form name and date
lives in `src/lib/`.

### Where the client-side code is

The site is almost entirely server-rendered. Four components ship JavaScript:

- `LedgerCanvas` — the hero light
- `Nav` — scroll state and the mobile panel
- `Process` — the scroll-linked timeline
- `Reveal` and `CursorLight` — one shared observer, one delegated listener

Framer Motion is used where it earns its weight: the nav panel transition and
the scroll-linked timeline. Everything else is CSS.

Two decisions were made against measurements rather than taste:

- **The hero entrance is CSS keyframes, not a motion library.** Driving it
  through JS meant the largest contentful paint waited on hydration — worth
  about a second of LCP.
- **Lit cards are server components.** Each card used to own a pointer
  handler, which made all twenty-one of them hydrate; on the page with the
  calendar that alone cost 850ms of blocking time. One delegated listener in
  `CursorLight` writes the same two custom properties, and the light layers are
  `::before` / `::after` rather than two extra DOM nodes per card.

### The hero canvas

The static grid is CSS (`ledger-ground`), so it stays crisp at any pixel ratio
and costs nothing per frame. The canvas draws only the light: a wash, plus the
same grid brightened and masked to the lit pool. It renders at 1x, starts on
`requestIdleCallback`, and stops entirely when scrolled out of view or when the
tab is hidden. Under `prefers-reduced-motion` it paints one static frame and
never animates.

Three.js was considered and not used. The brief asked for architectural lines,
and a 2D canvas draws them at a fraction of the cost — adding a WebGL renderer
would have cost roughly 150KB and several Lighthouse points to draw straight
lines.

## Quality

Measured against the production build with Lighthouse 13 (mobile preset):

| | Home | Service page |
|---|---|---|
| Performance | 90 | 92 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

CLS 0 on both. Performance varies ±3 between runs on a shared machine; measure
on the target host before treating a number as final.

axe-core reports no WCAG 2.1 A/AA violations on either page type, at 1440px or
390px. Keyboard focus is visible throughout, `prefers-reduced-motion` is
honoured everywhere, and text clears 4.5:1 in every state — including
partly-revealed ones and on the raised card surfaces, where `mist` does not
qualify and `paper-64` is used instead.

## Before launch

**The professional content needs a chartered accountant's sign-off.** The
service pages and the calendar name specific sections, forms, thresholds and
dates — section 44AB thresholds, GSTR filing days, AOC-4 and MGT-7 windows,
section 56(2)(viib), FC-GPR and FLA timing. These are the standard positions,
but they move: CBDT and CBIC issue extensions, thresholds change with the
Finance Act, and filings tied to the AGM shift with it. Read
`src/lib/services.ts` and `src/lib/calendar.ts` end to end and confirm every
figure before publishing. The calendar carries a caveat on the page; the
service pages state dates as fact.

Also:

- **Testimonials are placeholders.** `testimonials` in `src/lib/content.ts`
  contains three realistic quotes attributed by role and sector only, with no
  invented names. Replace them with real, approved client quotes, or delete the
  section.
- **Check the headline figures.** "500+ clients", "₹50Cr+ tax saved", "0
  deadlines missed since 2015" and "24h reply" carry over from the existing site
  or were written to match it. Each is a claim the firm has to be able to stand
  behind.
- **Set the canonical domain.** `firm.url` in `src/lib/content.ts` is
  `https://twchartered.com`; it drives metadata, sitemap and structured data.
- Confirm the ICAI membership wording and the FCA designation in `about`.
