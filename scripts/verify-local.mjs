import { chromium } from "@playwright/test";
import fs from "node:fs";
import assert from "node:assert/strict";
const base = process.env.PREVIEW_URL ?? "http://localhost:3008";
const executablePath =
  process.env.CHROME_PATH ??
  "C:/Users/nickg/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe";
fs.mkdirSync(".qa", { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.getByRole("dialog", { name: "Adults only" }).waitFor();
  await page.screenshot({ path: ".qa/age-gate.png" });
  await page.getByRole("button", { name: /18 or older/ }).click();
  await page.locator(".creator-card").first().waitFor({ timeout: 30000 });
  assert.equal(await page.locator(".creator-card").count(), 24);
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(13, 13, 20)");
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).color), "rgb(240, 240, 245)");
  await page.screenshot({ path: ".qa/home-desktop-viewport.png" });
  await page.screenshot({ path: ".qa/home-desktop.png", fullPage: true });
  const first = await page.locator(".creator-username").allTextContents();
  await page.getByRole("button", { name: "Load more creators" }).click();
  await page.waitForFunction(
    () => document.querySelectorAll(".creator-card").length === 48,
  );
  const expanded = await page.locator(".creator-username").allTextContents();
  assert.equal(new Set(expanded).size, 48);
  assert.deepEqual(expanded.slice(0, 24), first);
  const rules = JSON.parse(
    fs.readFileSync("src/data/category-rules.json", "utf8"),
  );
  const counts = {};
  for (const rule of rules) {
    const res = await page.request.get(
      `${base}/api/search?scope=category:${rule.slug}&page_size=24`,
    );
    assert.equal(res.status(), 200);
    const body = await res.json();
    assert(body.creators.length <= 24);
    assert(body.creators.every((c) => c.categories.includes(rule.slug)));
    counts[rule.slug] = body.total;
  }
  await page.goto(`${base}/categories/small-tits`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator(".creator-card").first().waitFor();
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute("href"),
    "https://onlyboobs.co/categories/small-tits",
  );
  await page.screenshot({ path: ".qa/category-desktop.png", fullPage: true });
  await page
    .locator(".filters-desktop")
    .getByText("Pricing", { exact: true })
    .click();
  await page
    .locator(".filters-desktop")
    .getByLabel("Free", { exact: true })
    .check();
  await page
    .locator(".filters-desktop")
    .getByRole("button", { name: "Apply Filters" })
    .click();
  await page.waitForURL(/price=free/);
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".creator-price")].every(
      (el) => el.textContent === "FREE",
    ),
  );
  assert((await page.locator(".creator-card").count()) > 0);
  const api = await page.request.get(
    `${base}/api/search?scope=category:small-tits&price=free&page_size=24&skip_location_filter=true&category_terms=busty`,
  );
  const free = await api.json();
  assert(
    free.creators.every(
      (c) => c.subscribePrice === 0 && c.categories.includes("small-tits"),
    ),
  );
  assert.deepEqual(
    await (await page.request.get(`${base}/api/sponsor-preview`)).json(),
    [],
  );
  assert.equal(
    (
      await page.request.get(`${base}/api/search?category=nonexistent`)
    ).status(),
    400,
  );
  for (const route of [
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/dmca",
    "/cookies",
    "/disclosure",
    "/promote",
    "/categories",
    "/perky-tits",
    "/sagging-tits",
    "/categories/perky-tits",
    "/categories/sagging-tits",
    "/best-onlyfans-titty-models-search",
    "/free-onlyfans-titty-models",
    "/robots.txt",
    "/sitemap/0",
    "/sitemap/1",
    "/opengraph-image",
    "/logo.png",
  ]) {
    assert.equal(
      (await page.request.get(`${base}${route}`)).status(),
      200,
      route,
    );
  }
  for (const [legacyPath, destination] of [
    ["/search?q=unfindablefixture923847", "/best-onlyfans-titty-models-search"],
    ["/onlyfans-search?q=unfindablefixture923847", "/best-onlyfans-titty-models-search"],
    ["/free", "/free-onlyfans-titty-models"],
  ]) {
    const response = await page.request.get(`${base}${legacyPath}`, {
      maxRedirects: 0,
    });
    assert.equal(response.status(), 308, legacyPath);
    assert(
      response.headers().location?.startsWith(destination),
      `${legacyPath} should redirect to ${destination}`,
    );
  }
  await page.goto(
    `${base}/best-onlyfans-titty-models-search?q=unfindablefixture923847`,
    {
    waitUntil: "domcontentloaded",
    },
  );
  await page.getByText("No creators found matching your filters.").waitFor();
  await page.goto(`${base}/free-onlyfans-titty-models`, {
    waitUntil: "domcontentloaded",
  });
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute("href"),
    "https://onlyboobs.co/free-onlyfans-titty-models",
  );
  assert.equal(
    await page.getByRole("heading", { name: "Best Free OnlyFans Models With Big Tits" }).count(),
    1,
  );
  await page.goto(base, { waitUntil: "domcontentloaded" });
  const footer = page.locator("footer");
  for (const label of [
    "Perky",
    "Sagging",
    "Best OF Titty Models",
    "Free OF Booby Girls",
  ]) {
    assert.equal(await footer.getByRole("link", { name: label, exact: true }).count(), 1);
  }
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    deviceScaleFactor: 1,
  });
  mobile.on("pageerror", (error) => errors.push(error.message));
  await mobile.goto(`${base}/contact`, { waitUntil: "domcontentloaded" });
  assert.equal(
    await mobile.getByRole("dialog", { name: "Adults only" }).count(),
    0,
  );
  await mobile.addInitScript(() =>
    localStorage.setItem("onlyboobs_age_confirmed", "1"),
  );
  await mobile.goto(base, { waitUntil: "domcontentloaded" });
  await mobile.locator(".creator-card").first().waitFor();
  assert(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    "Mobile horizontal overflow",
  );
  await mobile.screenshot({ path: ".qa/home-mobile.png", fullPage: true });
  await mobile.screenshot({ path: ".qa/home-mobile-viewport.png" });
  await mobile.getByRole("button", { name: "Toggle menu" }).click();
  await mobile
    .locator("#mobile-menu")
    .getByRole("link", { name: "View all categories →" })
    .click();
  await mobile.waitForURL("**/categories");
  await mobile
    .locator(".category-sections")
    .getByRole("link", { name: "Small Boobs", exact: true })
    .click();
  await mobile.locator(".creator-card").first().waitFor();
  await mobile.getByRole("button", { name: /^Filters/ }).click();
  await mobile.locator(".filters-mobile-content").waitFor();
  await mobile.screenshot({ path: ".qa/mobile-filters.png" });
  await mobile.getByRole("button", { name: "Close filters" }).click();
  assert.equal(await mobile.getByRole("dialog", { name: "Creator filters" }).count(), 0);
  assert.equal(errors.length, 0, errors.join("\n"));
  fs.writeFileSync(
    ".qa/results.json",
    JSON.stringify(
      {
        passed: true,
        categoryCounts: counts,
        consoleErrors: errors,
        screenshots: [
          "home-desktop.png",
          "home-mobile.png",
          "category-desktop.png",
          "age-gate.png",
          "mobile-filters.png",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      passed: true,
      categoryCounts: counts,
      browserErrors: errors.length,
    }),
  );
} finally {
  await browser.close();
}
