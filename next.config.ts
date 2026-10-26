import type { NextConfig } from "next";
import categories from "./src/data/category-rules.json";
const config: NextConfig = {
  async redirects() {
    return [
      {
        source: "/search",
        destination: "/best-onlyfans-titty-models-search",
        permanent: true,
      },
      {
        source: "/free",
        destination: "/free-onlyfans-titty-models",
        permanent: true,
      },
      {
        source: "/onlyfans-search",
        destination: "/best-onlyfans-titty-models-search",
        permanent: true,
      },
      ...categories.map((c) => ({
        source: `/${c.slug}`,
        destination: `/categories/${c.slug}`,
        permanent: true,
      })),
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.onlyfans.com" }],
    deviceSizes: [720],
    imageSizes: [72, 360],
    qualities: [75],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
export default config;
