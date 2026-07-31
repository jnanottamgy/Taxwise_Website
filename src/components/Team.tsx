import { team, teamIntro } from "@/lib/team";
import { Section, Heading, Standfirst } from "./Section";
import { Reveal } from "./Reveal";

/**
 * The team, set as ruled rows rather than a card grid.
 *
 * The four portraits arrived shot on four different backgrounds — foliage, two
 * white studio backdrops, a grey wall. Blown up into a four-across card grid
 * they read as four unrelated pictures; kept to a modest square beside the
 * type, on a duotone mapped to the site's own palette, they read as a set.
 * The structure is the same one `Why` uses, which is the right precedent: a
 * fixed-width column on the left, prose on the right, hairline between rows.
 *
 * Plain <img> rather than next/image: these are fixed 160px squares already
 * encoded at 400px WebP and 7-12KB each, so an optimisation round-trip would
 * cost more than it saves. Width and height are set, so CLS stays at zero.
 */
export default function Team() {
  return (
    <Section
      id="team"
      label={teamIntro.label}
      labelledBy="team-heading"
      aside={
        <p className="max-w-[22ch] text-sm leading-relaxed text-paper-64">
          Four people. No account managers between you and them.
        </p>
      }
    >
      <Reveal>
        <Heading id="team-heading">{teamIntro.headline}</Heading>
        <Standfirst>{teamIntro.standfirst}</Standfirst>
      </Reveal>

      <ul className="mt-20 grid gap-x-16 gap-y-px sm:grid-cols-2">
        {team.map((member, i) => (
          <Reveal
            key={member.name}
            delay={(i % 2) * 0.08}
            as="li"
            className="flex flex-col gap-6 border-t border-paper-12 py-10 sm:flex-row sm:gap-8"
          >
            <img
              src={member.photo}
              alt={`${member.name}, ${member.credential}`}
              width={400}
              height={400}
              loading="lazy"
              decoding="async"
              className="h-32 w-32 shrink-0 object-cover object-top sm:h-40 sm:w-40"
            />
            {/* The bios differ in length, so the focus line is pushed to the
                foot of the row — otherwise it floats at a different height in
                each cell and the grid stops looking like a grid. */}
            <div className="flex flex-1 flex-col">
              <h3 className="font-display text-[1.5rem] leading-none text-paper">
                {member.name}
              </h3>
              <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-mist">
                {member.credential}
              </p>
              <p className="mt-4 mb-8 max-w-[42ch] text-[0.9375rem] leading-[1.75] text-paper-80">
                {member.bio}
              </p>
              <p className="mt-auto border-t border-paper-12 pt-4 font-mono text-[0.625rem] uppercase leading-[1.7] tracking-[0.12em] text-paper-64">
                {member.focus}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
