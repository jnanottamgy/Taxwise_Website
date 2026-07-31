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

## Architecture

```
src/
  app/
    layout.tsx      fonts, metadata, JSON-LD
    page.tsx        section order
    globals.css     tokens, base, reveal + hero keyframes
    icon.svg        favicon
    sitemap.ts  robots.ts
  components/
    Hero.tsx        server component; CSS-keyframe entrance
    LedgerCanvas.tsx  the raking light (the only canvas)
    Section.tsx     Container, Section, Heading, Standfirst
    Reveal.tsx      CSS scroll reveals on a shared IntersectionObserver
    LightCard.tsx   cursor-lit surface
    Services · Why · Process · Industries · Testimonials · About · FinalCTA · Nav · Footer
  lib/
    content.ts      every word and figure on the site
    jsonld.ts       AccountingService structured data
```

All copy, contact details and figures live in `src/lib/content.ts`. Nothing is
hardcoded in a component.

### Where the client-side code is

The page is almost entirely server-rendered. Only four components ship
JavaScript:

- `LedgerCanvas` — the hero light
- `Nav` — scroll state and the mobile panel
- `Process` — the scroll-linked timeline
- `Reveal` / `LightCard` — shared observers and pointer position

Framer Motion is used where it earns its weight: the nav panel transition and
the scroll-linked timeline. The hero entrance and the ~25 scroll reveals run on
CSS instead — driving those through a motion library cost about 1.8s of main
thread time for no visible difference.

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

| | |
|---|---|
| Performance | 97 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

LCP 2.4s · CLS 0 · TBT 90ms.

axe-core reports no WCAG 2.1 A/AA violations at 1440px or 390px. Keyboard focus
is visible throughout, `prefers-reduced-motion` is honoured everywhere, and all
text clears 4.5:1 in every animation state — including partly-revealed ones.

## Before launch

- **Testimonials are placeholders.** `testimonials` in `src/lib/content.ts`
  contains three realistic quotes attributed by role and sector only, with no
  invented names. Replace them with real, approved client quotes, or delete the
  section.
- **Check the figures.** "500+ clients", "₹50Cr+ tax saved", "0 deadlines
  missed since 2015" and "24h reply" carry over from the existing site or were
  written to match it. Confirm each is accurate and defensible before publishing.
- **Set the canonical domain.** `firm.url` in `src/lib/content.ts` is
  `https://twchartered.com`; it drives metadata, sitemap and structured data.
- **Add an OG image** at `src/app/opengraph-image.png` (1200×630) — link
  previews currently fall back to text.
- Confirm the ICAI membership wording and the FCA designation in `about`.
