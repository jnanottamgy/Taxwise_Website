import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { firm } from "@/lib/content";
import { organizationJsonLd } from "@/lib/jsonld";
import CursorLight from "@/components/CursorLight";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

const title = `${firm.name} — Chartered Accountants, ${firm.city}`;
const description =
  "A partnership of chartered accountants in Bangalore handling audit, taxation, GST and compliance for founders, family offices and companies.";

export const metadata: Metadata = {
  metadataBase: new URL(firm.url),
  title: {
    default: title,
    template: `%s — ${firm.name}`,
  },
  description,
  keywords: [
    "chartered accountant Bangalore",
    "tax consultant Bangalore",
    "GST filing Bangalore",
    "statutory audit",
    "ROC compliance",
    "startup advisory India",
    "TaxWise Consultants",
  ],
  authors: [{ name: firm.name }],
  creator: firm.name,
  publisher: firm.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: firm.url,
    siteName: firm.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "finance",
};

export const viewport: Viewport = {
  themeColor: "#0E1B2F",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${instrumentSerif.variable} ${instrumentSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-ink text-paper antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-sm focus:bg-paper focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.18em] focus:text-ink"
        >
          Skip to content
        </a>
        {children}
        <CursorLight />
        <SmoothScroll />
        <script
          type="application/ld+json"
          // Structured data is a static, trusted object built in lib/jsonld.ts
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
