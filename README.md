# OnlyBoobs

An adaptation of the local OnlyAussieFans directory, covering creators worldwide and all breast sizes and shapes. Nine launch categories are supplemented by Perky and Sagging collections. Sponsor infrastructure is retained with **no active campaigns**.

## Local use

```powershell
npm ci
npm run dev -- --webpack --port 3008
```

Use Webpack for local development on this Windows setup. A local `.env.local` has been configured with the existing shared database connection and new site-specific click secrets. It is ignored by Git. `.env.example` contains names only; never commit real credentials.

```powershell
npm run lint
npm test
npm run build
npm start -- --port 3008
```

The production build includes TypeScript validation. `scripts/verify-local.mjs` checks the running site with Playwright. Set `PREVIEW_URL` and `CHROME_PATH` for your environment; screenshots and results are written to ignored `.qa/`.

## Creator data

`npm run refresh:inventory` performs bounded, read-only queries against the shared `onlyfans_profiles` table. It creates `src/data/inventory.json` and an aggregate report at `docs/inventory-report.json`. It does not scrape external sites, update shared profile records or create database tables.

Membership is based on explicit profile-description phrases and verified performer flags in the source. The importer rejects obvious negations, contradictory size/type signals and explicitly underage descriptions. It does not infer attributes from images. This is rule-based classification, not independent verification of body attributes or a complete audit of every profile. Review and correct individual assignments as needed before public release.

The initial discovery is a bounded sample, not an exhaustive import of the worldwide database. Profiles matching future-phase shapes remain eligible for the homepage and general search. Category collections additionally apply their own rules; for example Busty Asian requires both attributes. Add synonyms or refresh discovery through `src/lib/classification.mjs` and `src/data/category-rules.json`.

At runtime, the site reads current profile information for approved IDs in batches, caches each batch for five minutes and reapplies classification. One selector implements search, price filters, sorting, category membership and pagination. There is no Australia restriction. Sorting is within the indexed collection, not a claim to rank every creator worldwide.

Add normalized usernames to `src/data/removed-creators.json` to suppress listings across discovery, browsing and sponsor lookup. A removal must also remove any campaign, uploaded image and cached copy associated with that creator. Redeploy after configuration changes.

## Sponsors

`src/config/sponsors.ts` is the source of truth. The campaign array and vanity-alias map start empty. The original site's sponsor roster, images and campaign tables were not carried over. Organic cards fill all grid slots.

For each future campaign, supply its position, explicitly eligible scopes, images and destination URL. Category pages currently omit sitewide campaigns; explicitly scope a suitable sponsor to its category. Reporting tables must use the `sponsor_clicks_onlyboobs_` prefix. The redirect refuses other table namespaces. Prepare a suitable table schema and verify click persistence before activating a campaign; no tracking migrations have been run.

## Before public release

- Supply a monitored `CONTACT_EMAIL`, `PUBLIC_OPERATOR_NAME`, and `LEGAL_JURISDICTION`. The contact address shown by default (`contact@onlyboobs.co`) is explicitly a nonfunctional placeholder; it is not linked as an email address. Replace the operator/jurisdiction placeholders and have the legal pages reviewed for the jurisdictions where the service operates and is accessed.
- Configure `PROMOTE_FORM_URL` if using an external enquiry form. Otherwise promotion enquiries use the contact page.
- Decide actual server/campaign retention settings and complete policy review. Sponsor tracking is inactive until campaigns are configured.
- Set a dedicated `NEXT_PUBLIC_GA_ID` only if wanted. Analytics is off by default and requires consent when configured; the original measurement ID is not reused.
- Review category matches, image availability and removal requests. Source prices are displayed without currency conversion; confirm current pricing on each official profile.
- Set `SITE_LAUNCH_READY=true` only after release details are complete. Until then pages remain `noindex` and the sitemap is empty. Search/filter combinations remain `noindex` after launch; categories require at least 24 inventory records to enter the sitemap. Sitemap shards are `/sitemap/0` (static pages) and `/sitemap/1` (eligible categories), listed individually in `robots.txt`.
- Configure hosting, HTTPS, domain routing and Search Console. Nothing has been deployed or pushed from this workspace.

The original project at `../onlyaussiefans` was used as a read-only source. See `MASTER_PLAN.md` and `planning/keyword-map.csv` for the approved scope and phase-two research.

For Git, Vercel and NameSilo deployment steps, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).
