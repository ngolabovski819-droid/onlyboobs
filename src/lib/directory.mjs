/** One selection path for server pages, API search, and pagination. */
export function selectCreators(creators, params = {}) {
  const excluded = new Set(
    (params.excludeUsernames ?? []).map((x) => x.toLowerCase()),
  );
  const words = (params.q ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .slice(0, 120)
    .split(/\s+/)
    .filter(Boolean);
  const rows = creators.filter((c) => {
    if (excluded.has(c.username.toLowerCase())) return false;
    if (params.category && !c.categories.includes(params.category))
      return false;
    if (params.verified && !c.isVerified) return false;
    if (params.price === "free" && c.subscribePrice !== 0) return false;
    if (
      params.price === "under5" &&
      (c.subscribePrice === null || c.subscribePrice > 5)
    )
      return false;
    if (
      params.price === "under10" &&
      (c.subscribePrice === null || c.subscribePrice > 10)
    )
      return false;
    const text =
      `${c.username} ${c.name ?? ""} ${c.about ?? ""} ${c.location ?? ""} ${c.categories.join(" ").replaceAll("-", " ")}`
        .normalize("NFKC")
        .toLowerCase();
    if (!words.every((w) => text.includes(w))) return false;
    return Object.values(params.filterGroups ?? {}).every(
      (group) =>
        !group.length || group.some((tag) => c.categories.includes(tag)),
    );
  });
  rows.sort((a, b) => {
    if (params.sort === "newest") {
      const date =
        (Date.parse(b.firstSeenAt ?? "") || 0) -
        (Date.parse(a.firstSeenAt ?? "") || 0);
      if (date) return date;
    }
    return (
      b.favoritedCount - a.favoritedCount ||
      (a.subscribePrice ?? Infinity) - (b.subscribePrice ?? Infinity) ||
      b.id - a.id
    );
  });
  const size = Math.min(40, Math.max(1, params.pageSize ?? 24));
  const offset = Math.max(0, params.offset ?? ((params.page ?? 1) - 1) * size);
  return {
    creators: rows.slice(offset, offset + size),
    total: rows.length,
    hasMore: offset + size < rows.length,
  };
}
