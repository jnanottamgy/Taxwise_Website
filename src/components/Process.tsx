"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { process } from "@/lib/content";
import { Section, Heading, Standfirst } from "./Section";
import { Reveal } from "./Reveal";

/**
 * The one place on the site where numbering is honest: these are five steps
 * that happen in order, and the order is the information.
 */

function Step({
  index,
  progress,
  step,
  reduce,
}: {
  index: number;
  progress: MotionValue<number>;
  step: (typeof process)[number];
  reduce: boolean | null;
}) {
  const at = index / process.length;
  // The floor stays at 0.75 so an unreached step is still legible: at any point
  // in the animation the body copy holds above 4.5:1 against the ink ground.
  const opacity = useTransform(progress, [at - 0.12, at + 0.04], [0.75, 1]);
  const nodeScale = useTransform(progress, [at - 0.12, at + 0.04], [0.5, 1]);

  return (
    <motion.li
      style={reduce ? undefined : { opacity }}
      className="relative pl-10 lg:pl-0 lg:pt-12"
    >
      {/* The node sits on the timeline */}
      <motion.span
        aria-hidden="true"
        style={reduce ? undefined : { scale: nodeScale }}
        className="absolute left-0 top-1.5 block h-1.5 w-1.5 rounded-full bg-paper lg:left-0 lg:top-[-3px]"
      />
      <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-paper-80" data-figure>
        {step.step}
      </p>
      <h3 className="mt-4 font-display text-[1.625rem] leading-none text-paper">{step.name}</h3>
      <p className="mt-4 max-w-[30ch] text-[0.9375rem] leading-[1.7] text-paper-80">{step.body}</p>
    </motion.li>
  );
}

export default function Process() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  return (
    <Section
      id="process"
      label="Approach"
      labelledBy="process-heading"
      aside={
        <p className="max-w-[22ch] text-sm leading-relaxed text-paper-64">
          Five steps. You always know which one you are in.
        </p>
      }
    >
      <Reveal>
        <Heading id="process-heading">How an engagement actually runs.</Heading>
        <Standfirst>
          No engagement starts with paperwork. It starts with understanding what you are trying to
          do, and what the law will let you do about it.
        </Standfirst>
      </Reveal>

      <div ref={ref} className="relative mt-24">
        {/* Timeline: vertical on small screens, horizontal from lg */}
        <div
          aria-hidden="true"
          className="absolute left-[2px] top-0 h-full w-px bg-paper-12 lg:left-0 lg:top-0 lg:h-px lg:w-full"
        />
        <motion.div
          aria-hidden="true"
          style={reduce ? { scaleY: 1, scaleX: 1 } : { scaleY: scrollYProgress }}
          className="absolute left-[2px] top-0 h-full w-px origin-top bg-gold lg:hidden"
        />
        <motion.div
          aria-hidden="true"
          style={reduce ? { scaleX: 1 } : { scaleX: scrollYProgress }}
          className="absolute left-0 top-0 hidden h-px w-full origin-left bg-gold lg:block"
        />

        <ol className="grid gap-12 lg:grid-cols-5 lg:gap-8">
          {process.map((step, i) => (
            <Step key={step.step} index={i} progress={scrollYProgress} step={step} reduce={reduce} />
          ))}
        </ol>
      </div>
    </Section>
  );
}
