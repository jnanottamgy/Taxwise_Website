import { firm } from "./content";
import { services } from "./services";

/**
 * Structured data for the practice. AccountingService is the most specific
 * schema.org type that fits a chartered accountancy firm.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": `${firm.url}/#practice`,
    name: firm.name,
    legalName: firm.legalName,
    description:
      "Chartered accountancy practice in Bangalore providing audit, taxation, GST, accounting, business advisory, ROC compliance and startup advisory services.",
    url: firm.url,
    email: firm.emailPartner,
    telephone: firm.phonePartner,
    foundingDate: firm.founded,
    priceRange: "$$",
    currenciesAccepted: "INR",
    areaServed: { "@type": "Country", name: "India" },
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
    founder: {
      "@type": "Person",
      name: firm.managingPartner,
      jobTitle: firm.managingPartnerTitle,
      worksFor: { "@id": `${firm.url}/#practice` },
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: firm.phonePartner,
        contactType: "customer service",
        email: firm.emailPartner,
        areaServed: "IN",
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
