# Deploy OnlyBoobs with Git, Vercel and NameSilo

The project is not connected to a Git remote or a Vercel project yet. Vercel
CLI is authenticated, but there is no OnlyBoobs project in the account. The
recommended setup is GitHub deployment through Vercel; pushes to `main` then
trigger production deployments.

## 1. Check the release locally

From PowerShell in the project folder:

```powershell
npm ci
npm run lint
npm test
npm run build
npm run check:release
```

The release check is expected to fail until the real public email, operator
name, jurisdiction and final release approval are configured. Do not set
`SITE_LAUNCH_READY=true` just to bypass this check. With it set to `false`, the
deployed site remains `noindex` and its sitemap shards are empty.

## 2. Push the project to a private GitHub repository

Create an empty private repository on GitHub named `onlyboobs` (do not initialize
it with a README or license). Then run these commands, replacing the repository
URL with the URL GitHub displays for your account:

```powershell
git status --short
git add .
git diff --cached --check
git commit -m "Initial OnlyBoobs site" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
git remote add origin https://github.com/YOUR-ACCOUNT/onlyboobs.git
git push -u origin main
```

`.env.local` and other `.env*` files containing local settings are ignored by
Git. Confirm that `git status --short` does not show `.env.local` before pushing.
Never paste database keys or other secrets into GitHub, source files, or chat.

## 3. Import the repository into Vercel

1. In Vercel, choose **Add New → Project** and import the private GitHub
   repository.
2. Keep the detected Next.js settings and the repository root as the project
   root. Use the included lockfile and the default `npm run build` command.
3. In **Settings → Environment Variables**, add the following values:

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://onlyboobs.co` |
   | `SITE_LAUNCH_READY` | `false` |
   | `PUBLIC_OPERATOR_NAME` | Leave empty until the correct legal name is known |
   | `LEGAL_JURISDICTION` | Leave empty until the correct country/state is known |
   | `CONTACT_EMAIL` | `contact@onlyboobs.co` as a visible, nonfunctional placeholder, or leave empty |
   | `SUPABASE_URL` | The existing Supabase project URL |
   | `SUPABASE_KEY` | The server-side key used by the local site; mark it sensitive |
   | `PROMOTE_FORM_URL` | `https://tally.so/r/kd16Xe` |

   Add server credentials only to Vercel's server-side environment variables.
   The analytics ID is optional; leave `NEXT_PUBLIC_GA_ID` unset to keep
   analytics disabled. `CLICK_IP_SALT` and `CLICK_TOKEN_SECRET` are only needed
   if sponsored campaigns are later activated.
4. Deploy. The `SITE_LAUNCH_READY=false` deployment can be checked on its
   Vercel URL, but it will not be indexed by search engines and its sitemaps
   will be empty.

## 4. Connect onlyboobs.co at NameSilo

1. In the Vercel project, open **Settings → Domains** and add `onlyboobs.co`.
   Add `www.onlyboobs.co` too if you want the `www` hostname redirected or
   served.
2. Vercel will show the DNS records it expects for this project. In NameSilo,
   open **Domain Manager → Manage DNS** for `onlyboobs.co` and enter those
   exact records.
3. Do not remove unrelated MX records if the domain is used for email. Remove
   or replace conflicting web A/AAAA/CNAME records only after confirming they
   are for the old website.
4. Wait for Vercel to verify the domain and issue HTTPS. Set the apex domain as
   the production domain in Vercel if it is not selected automatically.
5. Redeploy from **Deployments** after changing production environment
   variables. Verify `https://onlyboobs.co`, `https://onlyboobs.co/robots.txt`,
   and both sitemap paths after DNS and HTTPS are ready.

## 5. Enable indexing after launch details are final

Before switching the site to an indexable public launch:

- Replace the visible `contact@onlyboobs.co` placeholder with a mailbox that
  exists, is monitored, and accepts creator removal and copyright requests.
- Replace `[LEGAL OPERATOR NAME]` and `[LEGAL JURISDICTION]` throughout the
  policies with accurate details.
- Have the privacy, terms, cookie and copyright-removal processes reviewed for
  the operator's jurisdiction and the jurisdictions being served. A DMCA page
  alone does not register a designated agent or establish safe-harbor
  eligibility.
- Confirm inventory, removal handling, Vercel/Supabase production settings,
  analytics consent and any sponsor tracking/retention configuration.
- Set `PUBLIC_OPERATOR_NAME`, `LEGAL_JURISDICTION`, and `CONTACT_EMAIL` to their
  real values in Vercel. Run `npm run check:release` locally with matching
  production values, then set `SITE_LAUNCH_READY=true` in Vercel and redeploy.

After the repository is connected, future releases use:

```powershell
git add .
git diff --cached --check
git commit -m "Describe the change"
git push
```

The push to `main` triggers a Vercel production deployment. Review its build
logs and production URL before announcing the release.
