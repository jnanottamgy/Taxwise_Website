import { team, teamIntro } from "@/lib/team";
import { Container, Label } from "./Section";
import { Reveal } from "./Reveal";

/**
 * The team.
 *
 * This is the one section that steps outside the page's marginal-label spine
 * and runs the full width of the container. Four people read as a line-up, and
 * a line-up wants room — squeezed into the narrow column they stack into
 * something you scroll past. It also gives the page a change of pace at the
 * point where it stops describing the practice and starts introducing it.
 *
 * Portraits are circular. The four sources were shot on four unrelated
 * backgrounds, and a circle crops tight to the face and throws away the
 * corners, which is where most of that variation lived.
 */
export default function Team() {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="border-t border-paper-12 py-[var(--spacing-section)]"
    >
      <Container>
        <Reveal>
          <Label>{teamIntro.label}</Label>
          <h2
            id="team-heading"
            className="mt-8 max-w-[20ch] font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.98] tracking-[-0.025em] text-paper"
          >
            {teamIntro.headline}
          </h2>
          <p className="mt-8 max-w-[52ch] text-[clamp(1rem,1.4vw,1.1875rem)] leading-[1.65] text-paper-80">
            {teamIntro.standfirst}
          </p>
        </Reveal>

        <ul className="mt-24 grid gap-x-12 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={(i % 4) * 0.07} as="li" className="group flex flex-col">
              <img
                src={member.photo}
                alt={member.name}
                width={448}
                height={448}
                loading="lazy"
                decoding="async"
                className="h-[9.5rem] w-[9.5rem] rounded-full object-cover shadow-[0_0_0_1px_rgba(245,244,242,0.14)] transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045] group-hover:shadow-[0_0_0_1px_rgba(201,168,76,0.55),0_18px_50px_-20px_rgba(0,0,0,0.7)]"
              />

              <h3 className="mt-9 font-display text-[1.5rem] leading-none text-paper">
                {member.name}
              </h3>
              <p className="mt-3 font-mono text-[0.6875rem] uppercase leading-[1.6] tracking-[0.16em] text-mist">
                <span className="text-gold">{member.role}</span>
                <span aria-hidden="true"> · </span>
                {member.credential}
              </p>

              <p className="mt-6 mb-8 text-[0.9375rem] leading-[1.75] text-paper-80">
                {member.bio}
              </p>

              {/* Pinned to the foot so the four rules line up across the row
                  even though the biographies are different lengths. */}
              <p className="mt-auto border-t border-paper-12 pt-4 font-mono text-[0.625rem] uppercase leading-[1.7] tracking-[0.12em] text-paper-64">
                {member.focus}
              </p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
