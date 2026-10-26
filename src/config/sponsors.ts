/**
 * Paid creator campaigns.
 *
 * Keep every campaign in this one list so grid positions, search placements,
 * creative overrides, and click tracking cannot drift out of sync.
 *
 * Update campaign usernames, placement scopes, links, tags, and image assets
 * here. An omitted `scopes` array means the campaign is site-wide.
 *
 * Example:
 * {
 *   username: 'creatorname',
 *   position: 1,
 *   scopes: ['sitewide'],
 *   searchDropdown: true,
 *   linkOverride: 'https://onlyfans.com/creatorname/c123',
 *   clickTable: 'sponsor_clicks_onlyboobs_creatorname',
 *   imageOverride: '/uploads/sponsors/creatorname/cover-01.jpg',
 *   galleryImages: ['/uploads/sponsors/creatorname/cover-02.jpg'],
 *   tags: ['GFE', 'Cosplay'],
 *   additionalTagCount: 4,
 * }
 */

export type SponsorScope =
  | "sitewide"
  | "home"
  | "search"
  | "directory"
  | `category:${string}`
  | `location:${string}`
  | `location-category:${string}:${string}`;

export interface SponsorCampaign {
  username: string;
  /** One-based global card position across pagination. */
  position: number;
  /** Omit or include `sitewide` to show on every creator grid. */
  scopes?: SponsorScope[];
  /** Override whether this campaign appears in focused search boxes. */
  searchDropdown?: boolean;
  /** One-based search-dropdown slot, independent of the creator-grid position. */
  searchPosition?: number;
  /** Custom outbound referral/tracking URL. */
  linkOverride?: string;
  /** Per-campaign Supabase click table written by /go/[username]. */
  clickTable?: string;
  /** Primary card/search image under public/ or an absolute URL. */
  imageOverride?: string;
  /** Short labels over the sponsored card image. */
  tags?: string[];
  /** Extra tag count rendered as +N. */
  additionalTagCount?: number;
  /** Additional carousel images under public/ or absolute URLs. */
  galleryImages?: string[];
}

export const SPONSOR_CAMPAIGNS: readonly SponsorCampaign[] = [];

const NORMALIZED = new Map(
  SPONSOR_CAMPAIGNS.map((campaign) => [
    campaign.username.trim().toLowerCase(),
    campaign,
  ]),
);

function isSitewide(campaign: SponsorCampaign): boolean {
  return !campaign.scopes?.length || campaign.scopes.includes("sitewide");
}

/** Case-insensitive campaign lookup. */
export function getSponsorCampaign(
  username: string,
): SponsorCampaign | undefined {
  return NORMALIZED.get(username.trim().toLowerCase());
}

/** Ordered, deduplicated campaigns that belong in a creator-grid scope.
 *  `includeSitewide: false` keeps only campaigns that name the scope. */
export function getSponsorCampaignsForScope(
  scope: string,
  includeSitewide = true,
): SponsorCampaign[] {
  const seenUsers = new Set<string>();
  const seenPositions = new Set<number>();

  return SPONSOR_CAMPAIGNS.filter(
    (campaign) =>
      (includeSitewide && isSitewide(campaign)) ||
      campaign.scopes?.includes(scope as SponsorScope),
  )
    .filter(
      (campaign) =>
        campaign.username.trim() &&
        Number.isInteger(campaign.position) &&
        campaign.position > 0,
    )
    .slice()
    .sort((a, b) => a.position - b.position)
    .filter((campaign) => {
      const username = campaign.username.trim().toLowerCase();
      if (seenUsers.has(username) || seenPositions.has(campaign.position))
        return false;
      seenUsers.add(username);
      seenPositions.add(campaign.position);
      return true;
    });
}

/** Search placements derive from the same campaign list as grid placements. */
export function getSearchSponsorCampaigns(): SponsorCampaign[] {
  const seen = new Set<string>();
  const campaigns = SPONSOR_CAMPAIGNS.filter(
    (campaign) => campaign.searchDropdown ?? isSitewide(campaign),
  )
    .slice()
    .sort((a, b) => a.position - b.position)
    .filter((campaign) => {
      const username = campaign.username.trim().toLowerCase();
      if (!username || seen.has(username)) return false;
      seen.add(username);
      return true;
    });

  // Reserve explicit dropdown slots without changing the grid or the relative
  // order of existing search sponsors. Slots beyond the list append at the end.
  const pinned = campaigns
    .filter(
      (campaign): campaign is SponsorCampaign & { searchPosition: number } =>
        Number.isInteger(campaign.searchPosition) &&
        (campaign.searchPosition ?? 0) > 0,
    )
    .sort((a, b) => a.searchPosition - b.searchPosition);
  const pinnedUsernames = new Set(pinned.map((campaign) => campaign.username));
  const ordered = campaigns.filter(
    (campaign) => !pinnedUsernames.has(campaign.username),
  );
  for (const campaign of pinned) {
    ordered.splice(
      Math.min(campaign.searchPosition - 1, ordered.length),
      0,
      campaign,
    );
  }
  return ordered;
}

export function isSponsorScope(value: string): boolean {
  return /^(home|search|directory|category:[a-z0-9-]+|location:[a-z0-9-]+|location-category:[a-z0-9-]+:[a-z0-9-]+)$/u.test(
    value,
  );
}

/**
 * Vanity slugs for the `/go/<slug>` redirect ONLY. Lets a sponsor share
 * `onlyboobs.co/go/<anything>` — the OF username of a profile in the owner's promo
 * sheet, an IG/TikTok persona, a per-campaign name — instead of `/go/<of-username>`. The
 * route resolves the alias to the target's campaign (linkOverride + clickTable) and logs
 * the click with `placement: 'vanity:<alias>'`, so each shared link reports separately.
 *
 * Alias → real OF username, both matched case-insensitively. Adding one is a single line +
 * deploy: no DNS, no Vercel config, no migration (it reuses the target's table). Cards,
 * profile pages and click-token minting never see aliases — they key on the real username
 * via getSponsorCampaign().
 *
 * Mirrors GO_ALIASES in the fanspedia and findbyface repos; each site's alias list is
 * independent, since promo-sheet rows are sold per-site.
 */
export const GO_ALIASES: Record<string, string> = {};

const NORMALIZED_ALIASES = new Map(
  Object.entries(GO_ALIASES).map(([alias, username]) => [
    alias.trim().toLowerCase(),
    username.trim().toLowerCase(),
  ]),
);

// Build-time guard (runs on module load, so `next build` fails loudly on a bad config): an
// alias that shadows a real campaign username would silently hijack that sponsor's /go/ link,
// and an alias pointing at a non-sponsor would redirect but never log.
for (const [alias, username] of NORMALIZED_ALIASES) {
  if (NORMALIZED.has(alias)) {
    throw new Error(
      `GO_ALIASES: "${alias}" collides with a SPONSOR_CAMPAIGNS username`,
    );
  }
  if (!NORMALIZED.has(username)) {
    throw new Error(
      `GO_ALIASES: "${alias}" points at "${username}", which has no campaign`,
    );
  }
}

/**
 * Resolve a `/go/<slug>` path segment to the real sponsor username. Non-aliases resolve to
 * themselves unchanged, so existing `/go/<username>` links behave exactly as before.
 */
export function resolveGoAlias(slug: string): {
  username: string;
  isAlias: boolean;
} {
  const target = NORMALIZED_ALIASES.get(slug.trim().toLowerCase());
  return target
    ? { username: target, isAlias: true }
    : { username: slug, isAlias: false };
}
