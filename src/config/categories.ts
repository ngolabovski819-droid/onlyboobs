import rules from "@/data/category-rules.json";
export interface CategoryFAQ {
  q: string;
  a: string;
}
export interface CategorySeo {
  title: string;
  description: string;
  heading: string;
  intro: string;
  resultsHeading: string;
  selectionNote: string;
}
export interface CategoryConfig {
  slug: string;
  label: string;
  terms: string[];
  summary: string;
  core?: boolean;
  launch?: boolean;
  requiresBusty?: boolean;
  emoji?: string;
  excludeUsernames?: string[];
  hideSitewideSponsors?: boolean;
  seo?: CategorySeo;
}
export const categories: CategoryConfig[] = rules.map((rule) => ({
  ...rule,
  hideSitewideSponsors: true,
}));
export const popularCategories = categories;
export const categoryGroups = [
  { label: "Sizes & breast types", items: categories.filter((c) => c.core) },
  { label: "Creator styles", items: categories.filter((c) => !c.core) },
];
export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
