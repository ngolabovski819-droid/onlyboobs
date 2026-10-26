export const discoveryTerms = [
  "big breasts",
  "large breasts",
  "large boobs",
  "tiny boobs",
  "huge breasts",
  "massive tits",
  "giant tits",
  "giant boobs",
  "very busty",
  "natural bust",
  "itty bitty titty",
  "boob implants",
  "silicone breasts",
  "enhanced breasts",
  "busty asian",
  "asian big tits",
  "asian big boobs",
  "big tits",
  "big boobs",
  "busty",
  "huge tits",
  "huge boobs",
  "massive boobs",
  "natural tits",
  "natural boobs",
  "natural breasts",
  "naturally busty",
  "small tits",
  "small boobs",
  "small breasts",
  "tiny tits",
  "flat chested",
  "fake tits",
  "fake boobs",
  "breast implants",
  "saggy tits",
  "saggy boobs",
  "sagging tits",
  "sagging boobs",
  "sagging breasts",
  "saggy breasts",
  "perky tits",
  "perky boobs",
  "perky breasts",
  "pierced nipples",
  "puffy nipples",
];
export function normalize(text) {
  return String(text ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‐‑–—-]/g, " ")
    .replace(/\s+/g, " ");
}
export function phraseEvidence(text, term) {
  const value = normalize(text),
    escaped = normalize(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const match of value.matchAll(
    new RegExp(`(^|[^a-z])(${escaped})(?=$|[^a-z])`, "g"),
  )) {
    const before = value.slice(
      Math.max(0, match.index - 38),
      match.index + match[1].length,
    );
    if (
      /\b(no|not|without|don't have|dont have|used to have)\s+(?:\w+\s+){0,3}$/.test(
        before,
      )
    )
      continue;
    return term;
  }
  return null;
}
/** Explicit profile wording only; no image or name inference. */
export function classifyProfile(profile, rules) {
  const text = normalize(profile.about);
  if (!profile.isperformer || !profile.isverified || !text) return null;
  if (/\b1[0-7]\s*(?:years? old|yr old|yo|y\/o)\b|\bunder\s*18\b/.test(text))
    return null;
  const evidence = {};
  for (const rule of rules) {
    const match = rule.terms.find((term) => phraseEvidence(text, term));
    if (match) evidence[rule.slug] = match;
  }
  if (evidence["huge-tits"]) evidence["big-tits"] ||= evidence["huge-tits"];
  for (const rule of rules)
    if (rule.requiresBusty && !evidence["big-tits"]) delete evidence[rule.slug];
  if (evidence["natural-tits"] && evidence["fake-tits"]) {
    delete evidence["natural-tits"];
    delete evidence["fake-tits"];
  }
  if (evidence["small-tits"] && evidence["big-tits"]) {
    delete evidence["small-tits"];
    delete evidence["big-tits"];
    delete evidence["huge-tits"];
    for (const rule of rules)
      if (rule.requiresBusty) delete evidence[rule.slug];
  }
  const siteEvidence = discoveryTerms.find((term) =>
    phraseEvidence(text, term),
  );
  return siteEvidence
    ? {
        id: profile.id,
        username: profile.username,
        categories: Object.keys(evidence),
        evidence,
        siteEvidence,
      }
    : null;
}
