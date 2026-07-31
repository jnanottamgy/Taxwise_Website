/**
 * Builds the team portraits in /public/team.
 *
 * The sources are 270x270 headshots shot on four unrelated backgrounds. They
 * are rendered in their own colour and cropped square on the subject, then
 * masked to a circle in CSS — a circular crop keeps the frame tight on the
 * face and drops the corners, which is where most of the background variation
 * lived.
 *
 * sharp is not a project dependency; it is only wanted when the photographs
 * change. Run it ad hoc:
 *
 *   npm i --no-save sharp
 *   node scripts/build-portraits.mjs ./path/to/source-portraits
 */

import sharp from "sharp";
import fs from "fs";

const SRC = process.argv[2] || "./source-portraits";
const DEST = new URL("../public/team", import.meta.url).pathname;
fs.mkdirSync(DEST, { recursive: true });

const people = [
  { file: "Shabhari.png", slug: "shabari-kj" },
  { file: "270-2.png", slug: "vinay-karlagere" },
  { file: "270-1.png", slug: "akshay-r-jain" },
  { file: "Vagi.png", slug: "vagdev-mr" },
];

// Rendered at 152px; 448 covers a 3x display.
const SIZE = 448;

// Crop ~8% in on every edge. Two of the sources carry a border artifact from
// the original scan that otherwise clips the rim of the circle, and the tighter
// frame puts more face inside a shape that throws the corners away anyway.
const OVERSCAN = 1.18;
const BIG = Math.round(SIZE * OVERSCAN);
const INSET = Math.round((BIG - SIZE) / 2);

for (const p of people) {
  await sharp(`${SRC}/${p.file}`)
    // Two of the four carry alpha; flatten to white so the circle edge stays clean.
    .flatten({ background: "#ffffff" })
    .resize(BIG, BIG, { fit: "cover", position: sharp.strategy.attention })
    .extract({ left: INSET, top: INSET, width: SIZE, height: SIZE })
    .webp({ quality: 88 })
    .toFile(`${DEST}/${p.slug}.webp`);

  const kb = (fs.statSync(`${DEST}/${p.slug}.webp`).size / 1024) | 0;
  console.log(`${p.slug.padEnd(18)} ${SIZE}x${SIZE}  ${kb}KB`);
}
