import { NextRequest, NextResponse } from "next/server";
import { fetchSponsoredPage } from "@/config/featured";
import { getCategoryBySlug } from "@/config/categories";
import { parseFilterGroups } from "@/config/filters";
import type { SearchParams } from "@/lib/supabase";
export const runtime = "nodejs";
const limits = new Map<string, { count: number; reset: number }>();
export async function GET(req: NextRequest) {
  const now = Date.now(),
    ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (limits.size > 5000)
    for (const [key, value] of limits)
      if (value.reset < now) limits.delete(key);
  const entry = limits.get(ip);
  if (entry && entry.reset > now && entry.count >= 60)
    return NextResponse.json(
      { error: "Please try again shortly." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  limits.set(
    ip,
    entry && entry.reset > now
      ? { ...entry, count: entry.count + 1 }
      : { count: 1, reset: now + 60000 },
  );
  const sp = req.nextUrl.searchParams;
  const requestedScope = sp.get("scope") ?? "search";
  const category =
    sp.get("category") ??
    (requestedScope.startsWith("category:")
      ? requestedScope.slice(9)
      : undefined);
  if (category && !getCategoryBySlug(category))
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  const scope = category
    ? `category:${category}`
    : requestedScope === "home"
      ? "home"
      : "search";
  const price = sp.get("price");
  const params: SearchParams = {
    q: (sp.get("q") ?? "").slice(0, 120),
    category,
    price: ["free", "under5", "under10"].includes(price ?? "")
      ? (price as SearchParams["price"])
      : undefined,
    sort: sp.get("sort") === "newest" ? "newest" : "popular",
    filterGroups: parseFilterGroups(sp.get("filter_groups") ?? undefined),
  };
  const page = Math.max(
    1,
    Math.min(10000, Number.parseInt(sp.get("page") ?? "1", 10) || 1),
  );
  const size = Math.max(
    1,
    Math.min(40, Number.parseInt(sp.get("page_size") ?? "24", 10) || 24),
  );
  try {
    return NextResponse.json(
      await fetchSponsoredPage(scope, params, page, size),
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Creators are temporarily unavailable. Please try again." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
