import { categories } from "./categories";
export interface FilterOption {
  label: string;
  terms: string[];
}
export interface FilterGroup {
  id: string;
  label: string;
  type: "terms" | "price";
  options: FilterOption[];
}
export const filterGroups: FilterGroup[] = [
  {
    id: "size",
    label: "Breast size",
    type: "terms",
    options: categories
      .filter((c) => ["big-tits", "huge-tits", "small-tits"].includes(c.slug))
      .map((c) => ({ label: c.label, terms: [c.slug] })),
  },
  {
    id: "type",
    label: "Breast attributes",
    type: "terms",
    options: categories
      .filter((c) => ["natural-tits", "fake-tits"].includes(c.slug))
      .map((c) => ({ label: c.label, terms: [c.slug] })),
  },
];
export function parseFilterGroups(raw?: string): Record<string, string[]> {
  if (!raw || raw.length > 3000) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};
    const source = parsed as Record<string, unknown>;
    return Object.fromEntries(
      filterGroups.flatMap((group) => {
        const values = source[group.id];
        if (!Array.isArray(values)) return [];
        const allowed = new Set(group.options.flatMap((o) => o.terms));
        const valid = [
          ...new Set(
            values.filter(
              (v): v is string => typeof v === "string" && allowed.has(v),
            ),
          ),
        ];
        return valid.length ? [[group.id, valid]] : [];
      }),
    );
  } catch {
    return {};
  }
}
