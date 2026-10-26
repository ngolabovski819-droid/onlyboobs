import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { selectCreators } from "../src/lib/directory.mjs";
import { classifyProfile } from "../src/lib/classification.mjs";
const rules = JSON.parse(
  fs.readFileSync(
    new URL("../src/data/category-rules.json", import.meta.url),
    "utf8",
  ),
);
const profile = (about) => ({
  id: 1,
  username: "fixture",
  isperformer: true,
  isverified: true,
  about,
});
test("small and phase-two shapes remain eligible without busty membership", () => {
  const small = classifyProfile(
    profile("Small breasts. Profile description."),
    rules,
  );
  assert(small.categories.includes("small-tits"));
  assert(!small.categories.includes("big-tits"));
  const sagging = classifyProfile(
    profile("Saggy boobs. Profile description."),
    rules,
  );
  assert(sagging.categories.includes("sagging-tits"));
  const perky = classifyProfile(
    profile("Perky breasts. Profile description."),
    rules,
  );
  assert(perky.categories.includes("perky-tits"));
});
test("combined categories require both attributes", () => {
  const asian = classifyProfile(
    profile("Asian creator with small breasts."),
    rules,
  );
  assert(!asian.categories.includes("asian"));
  const busty = classifyProfile(
    profile("Asian creator with big breasts."),
    rules,
  );
  assert(busty.categories.includes("asian"));
});
test("negation, ambiguous natural wording and contradictory size descriptions are not labels", () => {
  const natural = classifyProfile(
    profile("Natural breasts. No breast implants."),
    rules,
  );
  assert(natural.categories.includes("natural-tits"));
  assert(!natural.categories.includes("fake-tits"));
  assert(
    !classifyProfile(
      profile("Natural blonde with small breasts."),
      rules,
    ).categories.includes("natural-tits"),
  );
  const mixed = classifyProfile(profile("Small tits and huge tits."), rules);
  assert(!mixed.categories.includes("small-tits"));
  assert(!mixed.categories.includes("huge-tits"));
});
test("unverified and explicitly underage records are not eligible", () => {
  assert.equal(
    classifyProfile({ ...profile("Small breasts."), isverified: false }, rules),
    null,
  );
  assert.equal(
    classifyProfile(profile("17 years old. Small breasts."), rules),
    null,
  );
});
const rows = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  username: `fixture${i}`,
  name: "Creator",
  about: "Small breasts",
  location: "Worldwide",
  categories: ["small-tits", i % 2 ? "natural-tits" : "fake-tits"],
  subscribePrice: i === 0 ? null : i % 3 === 0 ? 0 : 10,
  favoritedCount: 60 - i,
  isVerified: true,
  firstSeenAt: "2026-10-25",
}));
test("pagination is stable, exhaustive and has no duplicates or skipped rows", () => {
  const a = selectCreators(rows, {
    category: "small-tits",
    page: 1,
    pageSize: 24,
  });
  const b = selectCreators(rows, {
    category: "small-tits",
    page: 2,
    pageSize: 24,
  });
  const c = selectCreators(rows, {
    category: "small-tits",
    page: 3,
    pageSize: 24,
  });
  assert.equal(
    new Set([...a.creators, ...b.creators, ...c.creators].map((c) => c.id))
      .size,
    60,
  );
  assert.equal(a.hasMore, true);
  assert.equal(c.hasMore, false);
});
test("filters are OR inside groups and AND between groups; unknown prices are never free", () => {
  const result = selectCreators(rows, {
    price: "free",
    filterGroups: { size: ["small-tits"], type: ["natural-tits", "fake-tits"] },
  });
  assert(result.creators.every((c) => c.subscribePrice === 0));
  assert(!result.creators.some((c) => c.id === 1));
  assert.equal(
    selectCreators(rows, {
      category: "huge-tits",
      filterGroups: { size: ["small-tits"] },
    }).total,
    0,
  );
});
test("suppressions apply before pagination", () => {
  const result = selectCreators(rows, {
    excludeUsernames: ["FIXTURE0"],
    pageSize: 24,
  });
  assert.equal(result.creators.length, 24);
  assert.equal(result.creators[0].id, 2);
  assert.equal(result.total, 59);
});
test("every launch category has distinct SEO metadata and a four-sentence intro", () => {
  assert.equal(rules.length, 11);
  const titles = new Set();
  for (const category of rules) {
    assert(category.seo, `${category.slug} is missing SEO metadata`);
    assert(category.seo.title.length <= 60, `${category.slug} title is too long`);
    assert(category.seo.description.length <= 160, `${category.slug} description is too long`);
    assert(!titles.has(category.seo.title), `${category.slug} title is duplicated`);
    titles.add(category.seo.title);
    assert.equal(
      category.seo.intro.split(/(?<=[.!?])\s+(?=[A-Z"'])/).length,
      4,
      `${category.slug} intro should provide three visible sentences and expandable detail`,
    );
  }
});
