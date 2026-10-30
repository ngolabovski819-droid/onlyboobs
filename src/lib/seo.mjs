/** Rounds down so "405K+" never overstates the real total. */
export function compactCount(n) {
  if (n >= 1e6) return `${Math.floor(n / 1e5) / 10}M+`;
  if (n >= 1e4) return `${Math.floor(n / 1e3)}K+`;
  return n.toLocaleString("en-US");
}

/**
 * Fills {token} placeholders in SEO copy from live collection stats, so titles
 * and descriptions always quote the same totals the page shows. Returns null
 * without stats; callers then fall back to number-free copy instead of guessing.
 */
export function fillSeo(template, stats) {
  if (!stats) return null;
  const updated = new Date(stats.updated);
  const values = {
    count: stats.count.toLocaleString("en-US"),
    free: stats.free.toLocaleString("en-US"),
    minPrice: stats.minPrice == null ? "" : `$${stats.minPrice.toFixed(2)}`,
    photos: compactCount(stats.photos),
    videos: compactCount(stats.videos),
    updated: updated.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }),
    year: String(updated.getUTCFullYear()),
  };
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}
