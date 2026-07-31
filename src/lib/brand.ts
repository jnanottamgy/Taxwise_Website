/**
 * The firm's mark: a shield carrying a TW monogram.
 *
 * Supplied as a 1920×1080 artboard with the artwork sitting in the middle and
 * everything else empty. The viewBox below is the artwork's true bounding box,
 * measured rather than eyeballed, so the mark scales from a 16px favicon to a
 * 1200px social card without carrying 94% dead space around with it.
 *
 * The paths are unfilled here on purpose — every surface that draws the mark
 * sets its own colour. The supplied artwork is #090E90, which measures 1.21:1
 * against the page ground and is unreadable there; on `paper` it measures
 * 12.94:1 and is the right colour. See `Mark`.
 */

export const markViewBox = "767.73 370.99 327.19 366.35";

/** Width ÷ height of the mark, for reserving space before paint. */
export const markAspect = 327.19 / 366.35;

export const markPaths = [
  // The shield, split by the crossbar of the T
  "M767.733,397.779v68.529s30.658-19.837,64.407-30.4,70.59-11.851,70.59-11.851v92.231l27.824-19.065,24.217,19.065V424.057s47.919,1.288,82.956,11.851,57.194,30.4,57.194,30.4V397.779s-82.57-26.793-164.367-26.793S767.733,397.779,767.733,397.779Z",
  // The W
  "M774.947,511.135,815.652,486.4s7.471,45.858,18.549,76.773,25.763,46.888,25.763,46.888L932.1,533.291l73.167,76.773s16.746-28.854,26.278-59.77S1043.4,486.4,1043.4,486.4l43.8,24.732s-5.153,41.736-22.671,83.472-47.4,83.472-47.4,83.472-27.7-15.458-48.949-34.007a241.469,241.469,0,0,1-36.068-40.19,326.01,326.01,0,0,1-40.19,40.19c-22.542,18.549-49.98,34.007-49.98,34.007s-27.051-36.583-43.8-78.319S774.947,511.135,774.947,511.135Z",
  // The point at the foot of the shield
  "M931.327,656.438,891.91,689.929l39.417,47.4,39.932-47.4Z",
] as const;

/** The colour the mark was drawn in. Legible on `paper`, not on `ink`. */
export const markBrandColor = "#090E90";
