import fs from "node:fs";
import { classifyProfile, discoveryTerms } from "../src/lib/classification.mjs";
try {
  process.loadEnvFile(".env.local");
} catch {}
const rules = JSON.parse(
  fs.readFileSync("src/data/category-rules.json", "utf8"),
);
const removed = new Set(
  JSON.parse(fs.readFileSync("src/data/removed-creators.json", "utf8")).map(
    (x) => x.toLowerCase(),
  ),
);
const base = process.env.SUPABASE_URL?.replace(/\/+$/, ""),
  key = process.env.SUPABASE_KEY;
if (!base || !key)
  throw Error("Configure the server-side creator database first.");
const profiles = new Map();
// Bounded read-only discovery; no writes or schema changes to the shared database.
for (let start = 0; start < discoveryTerms.length; start += 3) {
  await Promise.all(
    discoveryTerms.slice(start, start + 3).map(async (term) => {
      const query = new URLSearchParams({
        select: "id,username,about,isperformer,isverified",
        isperformer: "eq.true",
        isverified: "eq.true",
        search_text: `like.*${term}*`,
        limit: "250",
      });
      const response = await fetch(
        `${base}/rest/v1/onlyfans_profiles?${query}`,
        {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
          signal: AbortSignal.timeout(30000),
        },
      );
      if (!response.ok)
        throw Error(
          `Discovery failed (${response.status}) for configured term`,
        );
      for (const row of await response.json()) profiles.set(row.id, row);
    }),
  );
}
const creators = [...profiles.values()]
  .filter((p) => !removed.has(p.username.toLowerCase()))
  .map((p) => classifyProfile(p, rules))
  .filter(Boolean)
  .sort((a, b) => a.id - b.id);
const counts = Object.fromEntries(
  rules.map((rule) => [
    rule.slug,
    creators.filter((c) => c.categories.includes(rule.slug)).length,
  ]),
);
const inventory = {
  generatedAt: new Date().toISOString(),
  method:
    "Explicit profile-description phrases; verified performer records; no image inference",
  creators,
};
fs.writeFileSync(
  "src/data/inventory.json",
  JSON.stringify(inventory, null, 2) + "\n",
);
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync(
  "docs/inventory-report.json",
  JSON.stringify(
    {
      generatedAt: inventory.generatedAt,
      candidateProfiles: profiles.size,
      eligibleProfiles: creators.length,
      counts,
      minimumCategorySize: 24,
      limitedDiscovery: true,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({
    candidateProfiles: profiles.size,
    eligibleProfiles: creators.length,
    counts,
  }),
);
