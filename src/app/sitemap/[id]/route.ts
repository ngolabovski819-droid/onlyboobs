import { NextResponse } from "next/server";
import { categories } from "@/config/categories";
import { site } from "@/config/site";
import inventory from "@/data/inventory.json";

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function sitemapResponse(entries: string[]) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("")}</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}

function url(
  path: string,
  lastModified: string,
  priority: number,
  changeFrequency: string,
) {
  return `<url><loc>${xmlEscape(`${site.url}${path}`)}</loc><lastmod>${xmlEscape(lastModified)}</lastmod><changefreq>${changeFrequency}</changefreq><priority>${priority}</priority></url>`;
}

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  if (id !== "0" && id !== "1")
    return NextResponse.json({ error: "Sitemap not found" }, { status: 404 });

  if (!site.launchReady) return sitemapResponse([]);

  const lastModified = new Date(
    inventory.generatedAt ?? "2026-10-25",
  ).toISOString();

  if (id === "0") {
    const staticPaths = [
      ["/", 1, "daily"],
      ["/categories", 0.8, "weekly"],
      ["/free-onlyfans-titty-models", 0.8, "weekly"],
      ["/about", 0.5, "monthly"],
      ["/contact", 0.5, "monthly"],
      ["/promote", 0.5, "monthly"],
      ["/privacy", 0.3, "monthly"],
      ["/terms", 0.3, "monthly"],
      ["/dmca", 0.3, "monthly"],
      ["/cookies", 0.3, "monthly"],
      ["/disclosure", 0.3, "monthly"],
    ] as const;
    return sitemapResponse(
      staticPaths.map(([path, priority, frequency]) =>
        url(path, lastModified, priority, frequency),
      ),
    );
  }

  const eligibleCategories = categories.filter(
    (category) =>
      inventory.creators.filter((creator) =>
        (creator.categories as string[]).includes(category.slug),
      ).length >= 24,
  );
  return sitemapResponse(
    eligibleCategories.map((category) =>
      url(`/categories/${category.slug}`, lastModified, 0.85, "daily"),
    ),
  );
}
