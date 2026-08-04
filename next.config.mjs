/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The catalogue was seven flat disciplines before it became three nested
  // practices. Those URLs were live, so each one is sent to the practice that
  // absorbed it rather than to a 404 — permanently, because the old shape is
  // not coming back and a 301 is what tells a search engine that.
  async redirects() {
    const absorbed = {
      taxation: "compliance",
      audit: "compliance",
      gst: "compliance",
      accounting: "compliance",
      "roc-compliance": "compliance",
      "business-advisory": "cfo-advisory",
    };
    return Object.entries(absorbed).map(([from, to]) => ({
      source: `/services/${from}`,
      destination: `/services/${to}`,
      permanent: true,
    }));
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
