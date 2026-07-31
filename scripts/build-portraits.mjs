/**
 * Builds the team portraits in /public/team.
 *
 * The four sources are 270x270 headshots shot on four unrelated backgrounds,
 * at four different framings. An automatic crop cannot fix that: sharp's
 * `attention` strategy optimises for the most "interesting" region, which is
 * not the same as the face, and it picked a different region in every photo —
 * eye-lines landed between 32% and 40% of the frame, face centres between 40%
 * and 57%, head heights between 50% and 57%. Side by side in a line-up that
 * reads as sloppy even when nobody can say why.
 *
 * So the crops are explicit. `FACES` below records, per photo, three things
 * measured off the source against a percentage grid:
 *
 *   eyeY   — the eye-line, as a fraction of source height
 *   faceCx — the horizontal centre of the face, as a fraction of source width
 *   headH  — hair-top to chin, as a fraction of source height
 *
 * From those three numbers every crop is derived so that all four portraits
 * share one framing: heads the same size, eyes on the same line, faces on the
 * centre line. Re-measure these if the firm supplies new photographs.
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

/** The shared framing every portrait is cropped to. */
const HEAD_FRACTION = 0.6; // head occupies 60% of the frame's height
const EYE_LINE = 0.4; // eyes sit 40% down — slightly above centre, as portraits do

const FACES = [
  { file: "Shabhari.png", slug: "shabari-kj", eyeY: 0.32, faceCx: 0.385, headH: 0.58 },
  { file: "270-2.png", slug: "vinay-karlagere", eyeY: 0.4, faceCx: 0.5, headH: 0.55 },
  { file: "270-1.png", slug: "akshay-r-jain", eyeY: 0.38, faceCx: 0.47, headH: 0.57 },
  {
    file: "Vagi.png",
    slug: "vagdev-mr",
    eyeY: 0.36,
    faceCx: 0.55,
    headH: 0.52,
    // This one was scanned onto a larger canvas: columns 251-269 are blank
    // white and column 250 is the dark edge of the photograph. Aligning his
    // face brings all of that into frame, so the source is trimmed back to
    // its real content first.
    trim: { right: 21 },
  },
];

// Rendered at 152px; 448 covers a 3x display.
const SIZE = 448;

/**
 * Every crop is padded before it is taken. Aligning the faces means some crops
 * reach past the edge of their source — mirroring the border rather than
 * clamping the crop keeps the alignment exact, and the circle mask throws away
 * the corners where the mirroring would otherwise be visible.
 */
const PAD = 120;

for (const f of FACES) {
  const meta = await sharp(`${SRC}/${f.file}`).metadata();
  const W = meta.width;
  const H = meta.height;
  const t = { left: 0, top: 0, right: 0, bottom: 0, ...(f.trim ?? {}) };

  // The face metrics are fractions of the *original* frame, so they stay
  // meaningful whatever gets trimmed off the edges. Resolve them to absolute
  // pixels first, then rebase into trimmed coordinates.
  const eyeYpx = f.eyeY * H - t.top;
  const faceCxPx = f.faceCx * W - t.left;

  // Side of the square crop, in source pixels, that puts the head at HEAD_FRACTION.
  const side = Math.round((f.headH * H) / HEAD_FRACTION);
  // Position it so the eyes land on EYE_LINE and the face is centred.
  const left = Math.round(faceCxPx - side / 2) + PAD;
  const top = Math.round(eyeYpx - side * EYE_LINE) + PAD;

  // Two passes on purpose. sharp's pipeline order is fixed — extract runs
  // before extend — so padding and cropping in one chain would extract from
  // the unpadded original and fall outside it. Materialising the padded image
  // first makes the crop coordinates mean what they say.
  const padded = await sharp(`${SRC}/${f.file}`)
    // Two of the four carry alpha; flatten to white so the circle edge stays clean.
    .flatten({ background: "#ffffff" })
    .extract({
      left: t.left,
      top: t.top,
      width: W - t.left - t.right,
      height: H - t.top - t.bottom,
    })
    .extend({
      top: PAD,
      bottom: PAD,
      left: PAD,
      right: PAD,
      extendWith: "mirror",
    })
    .toBuffer();

  await sharp(padded)
    .extract({ left, top, width: side, height: side })
    .resize(SIZE, SIZE, { fit: "cover" })
    .webp({ quality: 88 })
    .toFile(`${DEST}/${f.slug}.webp`);

  const kb = (fs.statSync(`${DEST}/${f.slug}.webp`).size / 1024) | 0;
  console.log(
    `${f.slug.padEnd(18)} crop ${side}px @ (${left - PAD}, ${top - PAD})  ->  ${SIZE}x${SIZE}  ${kb}KB`
  );
}
