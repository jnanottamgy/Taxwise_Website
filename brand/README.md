# Brand assets

`taxwise.svg` is the mark exactly as supplied by the firm — a shield carrying a
TW monogram, filled `#090E90`, on a 1920×1080 artboard. It is kept here as the
source of record and is **not** referenced by the site.

The site draws the mark from `src/lib/brand.ts`, which carries the same three
paths with the artwork's measured bounding box (`767.73 370.99 327.19 366.35`)
as the viewBox, and no fill — every surface sets its own colour. Two things in
the original are deliberately dropped there:

- **The 1920×1080 artboard.** The artwork occupies 327×366 of it; the other 94%
  is empty and would have scaled as padding.
- **`stroke="#707070"`.** A 1px grey outline on each path, which turns muddy
  once the mark is drawn below about 32px.

If the firm ever reissues the logo, update `src/lib/brand.ts` and re-run the
generator for `apple-icon.png` and `opengraph-image.png` — `src/app/icon.svg`
carries its own copy of the path data and has to be edited by hand.
