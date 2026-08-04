import { firm } from "./content";
import { services } from "./services";
import { team } from "./team";

/**
 * Structured data for the practice. AccountingService is the most specific
 * schema.org type that fits a tax and accounting practice.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": `${firm.url}/#practice`,
    name: firm.name,
    legalName: firm.legalName,
    description:
      "Finance and tax advisory partnership with its head office in Bangalore, serving clients worldwide. Three practices, each containing the last: compliance and reporting, CFO advisory, and startup advisory.",
    url: firm.url,
    email: firm.email,
    telephone: firm.phone,
    foundingDate: firm.founded,
    priceRange: "$$",
    currenciesAccepted: "INR",
    // The head office is in Bangalore; the practice is not limited to it.
    areaServed: [{ "@type": "Country", name: "India" }, firm.areaServed],
    address: {
      "@type": "PostalAddress",
      streetAddress: `${firm.address.street}, ${firm.address.locality}`,
      addressLocality: firm.address.city,
      addressRegion: firm.address.region,
      postalCode: firm.address.postalCode,
      addressCountry: firm.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: firm.coords.lat,
      longitude: firm.coords.lng,
    },
    hasMap: firm.mapsUrl,
    // A partnership, so the practice has members rather than a founder.
    member: team.map((partner) => ({
      "@type": "Person",
      name: partner.name,
      jobTitle: partner.role,
      memberOf: { "@id": `${firm.url}/#practice` },
    })),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: firm.phone,
        contactType: "customer service",
        email: firm.email,
        areaServed: firm.areaServed,
        availableLanguage: ["en", "hi", "kn"],
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Advisory and compliance services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.summary,
        },
      })),
    },
  };
}
