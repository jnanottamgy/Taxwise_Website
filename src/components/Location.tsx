"use client";

import { useState } from "react";
import {
  firm,
  location,
  mapEmbedUrl,
  directionsUrl,
  coordsLabel,
  displayPhone,
} from "@/lib/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/**
 * Where the office is.
 *
 * The map is the only third-party request on the site, so it is not made until
 * someone asks for it: until then the panel is a plain placeholder carrying the
 * coordinates, which costs nothing and sends nothing to Google. Anyone who only
 * wants directions never loads it at all — the directions link goes straight to
 * Maps with the office as the destination.
 *
 * Once loaded the embed is inverted and rotated back through the blue. A stock
 * Google embed cannot be styled without the JS API and an API key, and dropped
 * in raw it is a white rectangle in the middle of a dark page.
 */

/**
 * Turning a stock Google embed dark is an inversion, and the naive one
 * (`invert(1)`) crushes the land fill to #121213 — a black rectangle you can
 * read nothing off. Lifting brightness and dropping contrast lands the land
 * around #3E3E3F instead, which keeps the labels and the water legible.
 *
 * Measured while tuning: Google's road fill (#FFFFFF) and land fill (#F8F9FA)
 * are only ~9 apart in RGB *before* any filter. Roads are legible because of
 * their casing and labels, not their fill, so no filter meaningfully helps or
 * hurts that — which is why the tuning here is about overall level, not
 * road contrast.
 *
 * The inversion leaves everything neutral grey, so a navy veil sits over the
 * top to pull it back to the page's palette. It is pointer-events-none, so the
 * map underneath still pans.
 */
const DARK_MAP =
  "invert(0.9) hue-rotate(190deg) saturate(0.65) brightness(1.35) contrast(0.82)";

function Detail({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-paper-12 py-5">
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mist">{term}</dt>
      <dd className="mt-2.5 text-[0.9375rem] leading-[1.7] text-paper-80">{children}</dd>
    </div>
  );
}

export default function Location() {
  const [showMap, setShowMap] = useState(false);

  return (
    <Section
      id="location"
      label={location.label}
      labelledBy="location-heading"
      aside={
        <p className="max-w-[22ch] text-sm leading-relaxed text-paper-64">
          Off 14th Main, a few minutes from Sadashivanagar.
        </p>
      }
    >
      <Reveal>
        <h2
          id="location-heading"
          className="max-w-[20ch] font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.98] tracking-[-0.025em] text-paper"
        >
          {location.headline}
        </h2>
        <p className="mt-8 max-w-[52ch] text-[clamp(1rem,1.4vw,1.1875rem)] leading-[1.65] text-paper-80">
          {location.standfirst}
        </p>
      </Reveal>

      <div className="mt-20 grid gap-x-14 gap-y-12 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <Reveal>
          <dl>
            <Detail term="Address">
              <address className="not-italic">
                {firm.address.street}
                <br />
                {firm.address.locality}
                <br />
                {firm.address.city} {firm.address.postalCode}
              </address>
            </Detail>
            <Detail term="Coordinates">
              <span className="tabular">{coordsLabel}</span>
            </Detail>
            <Detail term="Telephone">
              <a
                href={`tel:${firm.phone}`}
                className="transition-colors duration-300 hover:text-gold-lit"
              >
                {displayPhone(firm.phone)}
              </a>
            </Detail>
          </dl>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sheen mt-9 inline-flex items-center gap-3 rounded-full border border-paper-12 px-7 py-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-gold hover:text-gold-lit"
          >
            Get directions
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            >
              <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
            </svg>
          </a>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-paper-12 sm:aspect-[16/10]">
            {showMap ? (
              <>
                <iframe
                  src={mapEmbedUrl}
                  title={`Map showing ${firm.name}, ${firm.address.locality}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                  style={{ filter: DARK_MAP, border: 0 }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[rgba(14,27,47,0.3)]"
                />
              </>
            ) : (
              <div className="ledger-ground absolute inset-0 flex flex-col items-center justify-center gap-6 bg-ink">
                {/* A surveyor's mark rather than a map pin — this page sets
                    every number in mono, and a position is a number. */}
                <span aria-hidden="true" className="relative block h-12 w-12">
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gold/45" />
                  <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-gold/45" />
                  <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
                </span>
                <p className="tabular text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mist">
                  {coordsLabel}
                </p>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="rounded-full border border-paper-12 bg-paper-06 px-7 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper transition-colors duration-300 hover:border-gold hover:text-gold-lit"
                >
                  Show map
                </button>
                <p className="max-w-[26ch] text-center text-[0.75rem] leading-[1.6] text-paper-64">
                  Loads Google Maps. Nothing is requested from Google until you
                  press it.
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
