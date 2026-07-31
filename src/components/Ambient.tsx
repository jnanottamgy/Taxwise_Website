/**
 * The ambient ground behind the whole site.
 *
 * A server component with no JavaScript at all: three drifting lamps of light
 * and a film grain, both fixed to the viewport so the page never has a
 * "decorated header, flat body" seam. All the behaviour lives in globals.css.
 *
 * It sits at z-index -1, behind every section. The sections that carry their
 * own opaque ground — the light `About` and `What you receive` panels, the lit
 * cards — cover it, which is what gives the page its rhythm of lit and unlit
 * passages.
 */
export default function Ambient() {
  return (
    <>
      <div className="ambient" aria-hidden="true">
        <div className="ambient-lamp ambient-a" />
        <div className="ambient-lamp ambient-b" />
        <div className="ambient-lamp ambient-c" />
      </div>
      <div className="ambient-grain" aria-hidden="true" />
    </>
  );
}
