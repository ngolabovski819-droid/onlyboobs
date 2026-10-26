import fs from "node:fs";
try {
  process.loadEnvFile(".env.local");
} catch {}
const missing = [];
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.CONTACT_EMAIL ?? ""))
  missing.push("Real public CONTACT_EMAIL");
if (
  (process.env.CONTACT_EMAIL ?? "").trim().toLowerCase() ===
  "contact@onlyboobs.co"
)
  missing.push("Replace placeholder CONTACT_EMAIL with a monitored mailbox");
if (!process.env.PUBLIC_OPERATOR_NAME?.trim())
  missing.push("Public legal operator name (PUBLIC_OPERATOR_NAME)");
if (!process.env.LEGAL_JURISDICTION?.trim())
  missing.push("Applicable country/state (LEGAL_JURISDICTION)");
if (process.env.SITE_LAUNCH_READY !== "true")
  missing.push("Final legal/operator review and SITE_LAUNCH_READY=true");
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY)
  missing.push("Server database configuration");
const report = JSON.parse(
  fs.readFileSync("docs/inventory-report.json", "utf8"),
);
const launchCategories = JSON.parse(
  fs.readFileSync("src/data/category-rules.json", "utf8"),
).filter((category) => category.launch);
for (const { slug } of launchCategories) {
  const count = report.counts[slug] ?? 0;
  if (count < 24) missing.push(`Inventory for ${slug} (${count}/24)`);
}
if (missing.length) {
  console.log(
    "Public release remains pending:\n" +
      missing.map((x) => `- ${x}`).join("\n"),
  );
  process.exitCode = 1;
} else
  console.log(
    "Configuration checks pass. Complete manual policy and production smoke checks before release.",
  );
