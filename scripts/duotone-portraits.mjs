/**
 * Regenerates the duotone team portraits in /public/team.
 *
 * The source photographs are 270x270 and were shot on four unrelated
 * backgrounds. This maps them through a three-stop ramp built from the site's
 * own palette so they read as one set on the ink ground.
 *
 * sharp is not a project dependency - it is needed only when the photographs
 * change. Run it ad hoc:
 *
 *   npm i --no-save sharp
 *   node scripts/duotone-portraits.mjs ./path/to/source-portraits
 *
 * Source filenames are listed in `people` below; update them if the firm
 * supplies new files.
 */
import sharp from "sharp";
import fs from "fs";

const SRC = process.argv[2] || "./source-portraits";
const DEST = new URL("../public/team", import.meta.url).pathname;
fs.mkdirSync(DEST, { recursive: true });

// Three stops from the site's own palette. A straight two-colour duotone goes
// harsh on skin; routing the midtones through `slate` keeps faces readable.
// The highlight stops short of `paper` on purpose. Two of the four portraits
// were shot on a white studio backdrop; taken to full paper they render as
// glaring white blocks on the ink ground, and the set stops reading as a set.
const STOPS = [
  { at: 0.0, c: [0x10, 0x1d, 0x33] }, // ink, barely lifted
  { at: 0.5, c: [0x53, 0x6b, 0x94] }, // slate
  { at: 1.0, c: [0xc2, 0xcd, 0xe0] }, // light navy, not paper
];

function ramp(t) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i], b = STOPS[i + 1];
    if (t >= a.at && t <= b.at) {
      const k = (t - a.at) / (b.at - a.at);
      return [0, 1, 2].map((j) => Math.round(a.c[j] + (b.c[j] - a.c[j]) * k));
    }
  }
  return STOPS[STOPS.length - 1].c;
}

// Precompute the 256-entry lookup table once.
const LUT = Array.from({ length: 256 }, (_, i) => ramp(i / 255));

const people = [
  { file: "Shabhari.png", slug: "shabari-kj" },
  { file: "270-2.png", slug: "vinay-karlagere" },
  { file: "270-1.png", slug: "akshay-r-jain" },
  { file: "Vagi.png", slug: "vagdev-mr" },
];

// Rendered at 160px; 400 covers a 2.5x display with headroom to spare.
const SIZE = 400;

for (const p of people) {
  const src = sharp(`${SRC}/${p.file}`)
    .flatten({ background: "#ffffff" }) // two files carry alpha
    .resize(SIZE, SIZE, { fit: "cover", position: "top" })
    .greyscale()
    .linear(1.12, -10) // a touch more contrast before the map
    .toColourspace("b-w");

  const { data, info } = await src.raw().toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0; i < data.length; i++) {
    const [r, g, b] = LUT[data[i]];
    out[i * 3] = r;
    out[i * 3 + 1] = g;
    out[i * 3 + 2] = b;
  }

  await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
    .webp({ quality: 82 })
    .toFile(`${DEST}/${p.slug}.webp`);


  const kb = (fs.statSync(`${DEST}/${p.slug}.webp`).size / 1024) | 0;
  console.log(`${p.slug.padEnd(18)} ${SIZE}x${SIZE}  ${kb}KB`);
}
