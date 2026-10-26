import type { MetadataRoute } from "next";
import { site } from "@/config/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/best-onlyfans-titty-models-search",
        "/search",
        "/api/",
        "/go/",
      ],
    },
    sitemap: [`${site.url}/sitemap/0`, `${site.url}/sitemap/1`],
  };
}
