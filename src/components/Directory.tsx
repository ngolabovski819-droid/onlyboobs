import Link from "next/link";
import { fetchSponsoredPage } from "@/config/featured";
import { parseFilterGroups } from "@/config/filters";
import type { SearchParams } from "@/lib/supabase";
import CreatorGrid from "./CreatorGrid";
import SearchFilters from "./SearchFilters";
import CreatorSearch from "./CreatorSearch";
export type Query = Record<string, string | string[] | undefined>;
export function single(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}
export default async function Directory({
  query = {},
  category,
  home = false,
}: {
  query?: Query;
  category?: string;
  home?: boolean;
}) {
  const q = single(query.q)?.slice(0, 120),
    sort = single(query.sort) === "newest" ? "newest" : "popular";
  const rawPrice = single(query.price);
  const price = ["free", "under5", "under10"].includes(rawPrice ?? "")
    ? (rawPrice as SearchParams["price"])
    : undefined;
  const filters = parseFilterGroups(single(query.filter_groups));
  const scope = home ? "home" : category ? `category:${category}` : "search";
  const params = {
    q,
    sort,
    price,
    category,
    filterGroups: filters,
  } satisfies SearchParams;
  const stateKey = JSON.stringify(params);
  const result = await fetchSponsoredPage(scope, params, 1, 24).catch(
    () => null,
  );
  if (!result)
    return (
      <div className="empty-state" role="status">
        <h2>Profiles are taking a moment</h2>
        <p>We couldn’t load creator details. Please try again shortly.</p>
        <Link
          className="btn btn--outline"
          href={
            category
              ? `/categories/${category}`
              : "/best-onlyfans-titty-models-search"
          }
        >
          Try again
        </Link>
      </div>
    );
  const { creators, total, hasMore } = result;
  const grid = (
    <CreatorGrid
      key={stateKey}
      initialCreators={creators}
      initialTotal={total}
      initialHasMore={hasMore}
      pageSize={24}
      q={q}
      price={price}
      sort={sort}
      filterGroups={filters}
      scope={scope}
    />
  );
  if (home) return grid;
  return (
    <div className="search-layout directory-layout">
      <aside className="search-sidebar filters-desktop">
        <SearchFilters key={stateKey} />
      </aside>
      <div>
        {!category && (
          <CreatorSearch
            key={q ?? ""}
            variant="results"
            initialQuery={q ?? ""}
          />
        )}
        <div className="search-mobile-filters">
          <SearchFilters key={stateKey} mobile />
        </div>
        {grid}
      </div>
    </div>
  );
}
