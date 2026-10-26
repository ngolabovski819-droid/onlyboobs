import { unstable_cache } from "next/cache";
import type { Creator } from "@/types/creator";
import inventory from "@/data/inventory.json";
import removed from "@/data/removed-creators.json";
import rules from "@/data/category-rules.json";
import { classifyProfile } from "./classification.mjs";
import { selectCreators } from "./directory.mjs";
export interface SearchParams {
  q?: string;
  category?: string;
  verified?: boolean;
  price?: "free" | "under5" | "under10" | "any";
  sort?: "popular" | "newest";
  page?: number;
  pageSize?: number;
  filterGroups?: Record<string, string[]>;
  revalidate?: number;
  offset?: number;
  excludeUsernames?: string[];
}
export interface SearchResult {
  creators: Creator[];
  total: number | null;
  hasMore: boolean;
}
export class CreatorFetchError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "CreatorFetchError";
  }
}
const CARD_COLS = [
  "id",
  "username",
  "name",
  "about",
  "location",
  "avatar",
  "avatar_c144",
  "header",
  "isverified",
  "subscribeprice",
  "photoscount",
  "videoscount",
  "postscount",
  "subscriberscount",
  "favoritedcount",
  "first_seen_at",
  "bundle1_price",
  "bundle1_duration",
  "bundle1_discount",
  "bundle2_price",
  "bundle2_duration",
  "bundle2_discount",
  "bundle3_price",
  "bundle3_duration",
  "bundle3_discount",
  "promotion1_price",
  "promotion1_discount",
].join(",");

/**
 * Names and locations arrive HTML-escaped from the OnlyFans scrape (7.7k profiles carry a
 * literal "&amp;"), and React escapes again on render, so "Audrey & Sadie" reached the card
 * as "Audrey &amp; Sadie". Decoding once here fixes every consumer — cards, alt text,
 * aria-labels and page metadata — rather than at each render site.
 *
 * One pass, so an escaped entity like "&amp;lt;" decodes to "&lt;" and not to "<".
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities<T extends string | null>(value: T): T {
  if (!value) return value;
  return value.replace(
    /&(#x[0-9a-f]+|#d+|[a-z]+);/gi,
    (match, entity: string) => {
      const key = entity.toLowerCase();
      const codePoint = key.startsWith("#x")
        ? Number.parseInt(entity.slice(2), 16)
        : key.startsWith("#")
          ? Number.parseInt(entity.slice(1), 10)
          : null;
      if (codePoint !== null) {
        // Reject out-of-range or malformed references rather than throwing on fromCodePoint.
        return Number.isInteger(codePoint) &&
          codePoint >= 0 &&
          codePoint <= 0x10ffff
          ? String.fromCodePoint(codePoint)
          : match;
      }
      return NAMED_ENTITIES[key] ?? match;
    },
  ) as T;
}

function mapCreator(raw: Record<string, unknown>): Creator {
  return {
    id: raw.id as number,
    username: raw.username as string,
    name: decodeEntities((raw.name as string) ?? null),
    about: (raw.about as string) ?? null,
    location: decodeEntities((raw.location as string) ?? null),
    avatar: (raw.avatar as string) ?? null,
    avatarC144: (raw.avatar_c144 as string) ?? null,
    header: (raw.header as string) ?? null,
    isVerified: Boolean(raw.isverified),
    subscribePrice:
      raw.subscribeprice != null ? Number(raw.subscribeprice) : null,
    favoritedCount: Number(raw.favoritedcount ?? 0),
    firstSeenAt: (raw.first_seen_at as string) ?? null,
    subscribersCount:
      raw.subscriberscount != null ? Number(raw.subscriberscount) : null,
    postsCount: raw.postscount != null ? Number(raw.postscount) : null,
    photosCount: raw.photoscount != null ? Number(raw.photoscount) : null,
    videosCount: raw.videoscount != null ? Number(raw.videoscount) : null,
    bundle1Price: raw.bundle1_price != null ? Number(raw.bundle1_price) : null,
    bundle1Duration:
      raw.bundle1_duration != null ? Number(raw.bundle1_duration) : null,
    bundle1Discount:
      raw.bundle1_discount != null ? Number(raw.bundle1_discount) : null,
    bundle2Price: raw.bundle2_price != null ? Number(raw.bundle2_price) : null,
    bundle2Duration:
      raw.bundle2_duration != null ? Number(raw.bundle2_duration) : null,
    bundle2Discount:
      raw.bundle2_discount != null ? Number(raw.bundle2_discount) : null,
    bundle3Price: raw.bundle3_price != null ? Number(raw.bundle3_price) : null,
    bundle3Duration:
      raw.bundle3_duration != null ? Number(raw.bundle3_duration) : null,
    bundle3Discount:
      raw.bundle3_discount != null ? Number(raw.bundle3_discount) : null,
    promotion1Price:
      raw.promotion1_price != null ? Number(raw.promotion1_price) : null,
    promotion1Discount:
      raw.promotion1_discount != null ? Number(raw.promotion1_discount) : null,
  };
}

interface Member {
  id: number;
  username: string;
  categories: string[];
}
interface ListedCreator extends Creator {
  categories: string[];
}
const suppressed = new Set<string>(
  removed.map((name: string) => name.toLowerCase()),
);
const members = (inventory.creators as Member[]).filter(
  (m) => !suppressed.has(m.username.toLowerCase()),
);
const loadChunk = unstable_cache(
  async (ids: number[]): Promise<ListedCreator[]> => {
    const url = process.env.SUPABASE_URL?.replace(/\/+$/, ""),
      key = process.env.SUPABASE_KEY;
    if (!url || !key)
      throw new CreatorFetchError("Creator database is not configured");
    const params = new URLSearchParams({
      select: CARD_COLS + ",isperformer",
      id: `in.(${ids.join(",")})`,
      isperformer: "eq.true",
      isverified: "eq.true",
      limit: "200",
    });
    const response = await fetch(`${url}/rest/v1/onlyfans_profiles?${params}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok)
      throw new CreatorFetchError(
        "Creator database is temporarily unavailable",
        response.status,
      );
    const rows: Record<string, unknown>[] = await response.json();
    return rows.flatMap((row) => {
      const classified = classifyProfile(row, rules);
      return classified && !suppressed.has(String(row.username).toLowerCase())
        ? [{ ...mapCreator(row), categories: classified.categories }]
        : [];
    });
  },
  [
    "onlyboobs-inventory-chunk-v1",
    inventory.generatedAt ?? "empty",
    JSON.stringify(removed),
  ],
  { revalidate: 300 },
);
async function loadInventory(): Promise<ListedCreator[]> {
  const chunks: number[][] = [];
  for (let i = 0; i < members.length; i += 200)
    chunks.push(members.slice(i, i + 200).map((m) => m.id));
  const result: ListedCreator[] = [];
  for (let start = 0; start < chunks.length; start += 4) {
    const batches = await Promise.all(
      chunks.slice(start, start + 4).map((ids) => loadChunk(ids)),
    );
    result.push(...batches.flat());
  }
  return result;
}
export async function fetchCreators(
  params: SearchParams,
): Promise<SearchResult> {
  const result = selectCreators(await loadInventory(), params);
  return {
    ...result,
    creators: result.creators.map((creator: ListedCreator) => ({
      ...creator,
      about: null,
    })),
  };
}
export async function fetchCreatorsByUsernames(
  usernames: string[],
  revalidate = 3600,
): Promise<Creator[]> {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const supabaseKey = process.env.SUPABASE_KEY;
  const cleaned = Array.from(
    new Set(
      usernames
        .map((username) => username.trim().replace(/[^a-zA-Z0-9._-]/g, ""))
        .filter(Boolean),
    ),
  ).slice(0, 20);

  if (!supabaseUrl || !supabaseKey || cleaned.length === 0) return [];

  const fetchRows = async (
    usernameFilter: string,
    limit: number,
  ): Promise<Creator[]> => {
    const qp = new URLSearchParams();
    qp.set("select", CARD_COLS);
    qp.set("username", usernameFilter);
    qp.set("limit", String(limit));

    const response = await fetch(
      `${supabaseUrl}/rest/v1/onlyfans_profiles?${qp.toString()}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Accept-Profile": "public",
          Prefer: "count=none",
        },
        next: { revalidate },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!response.ok) {
      throw new CreatorFetchError(
        "Creator lookup temporarily unavailable",
        response.status,
      );
    }
    const rows: Record<string, unknown>[] = await response.json();
    return rows.map(mapCreator);
  };

  const byUsername = new Map<string, Creator>();
  const addCreators = (creators: Creator[]) => {
    for (const creator of creators) {
      const key = creator.username.toLowerCase();
      if (!byUsername.has(key)) byUsername.set(key, creator);
    }
  };

  // Profiles are normally stored lowercase, so try both spellings exactly.
  const exactNames = Array.from(
    new Set(cleaned.flatMap((username) => [username, username.toLowerCase()])),
  );
  try {
    addCreators(
      await fetchRows(
        `in.(${exactNames.map((username) => `"${username}"`).join(",")})`,
        exactNames.length,
      ),
    );
  } catch (error) {
    console.error(
      "Sponsor lookup failed:",
      error instanceof Error ? error.message : error,
    );
  }

  const missing = cleaned.filter(
    (username) =>
      !suppressed.has(username.toLowerCase()) &&
      !byUsername.has(username.toLowerCase()),
  );
  const fallbackResults = await Promise.all(
    missing.map(async (username) => {
      try {
        // Escape `_` so it is not a LIKE wildcard; `.` and `-` are already literal.
        const rows = await fetchRows(
          `ilike.${username.replace(/_/g, "\\_")}`,
          2,
        );
        return rows.filter(
          (creator) =>
            creator.username.toLowerCase() === username.toLowerCase(),
        );
      } catch (error) {
        console.error(
          `Sponsor lookup failed for ${username}:`,
          error instanceof Error ? error.message : error,
        );
        return [];
      }
    }),
  );
  fallbackResults.forEach(addCreators);

  return Array.from(byUsername.values()).filter(
    (creator) => !suppressed.has(creator.username.toLowerCase()),
  );
}
