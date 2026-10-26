import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/config/categories";
import { site } from "@/config/site";
import inventory from "@/data/inventory.json";
import Directory, { type Query } from "@/components/Directory";
import CreatorGridSkeleton from "@/components/CreatorGridSkeleton";
import CategoryIntro from "@/components/CategoryIntro";
interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Query>;
}
export const revalidate = 300;
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  const queries = await searchParams;
  const filtered = Object.keys(queries).length > 0;
  const count = inventory.creators.filter((c) =>
    (c.categories as string[]).includes(slug),
  ).length;
  return {
    title: cat.seo?.title ?? `${cat.label} OnlyFans Creators`,
    description: cat.seo?.description ?? cat.summary,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: cat.seo
      ? {
          title: `${cat.seo.title} | OnlyBoobs`,
          description: cat.seo.description,
          url: `/categories/${slug}`,
        }
      : undefined,
    robots: {
      index: site.launchReady && !filtered && count >= 24,
      follow: true,
    },
  };
}
export default async function Category({ params, searchParams }: Props) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();
  const query = await searchParams;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: `${site.url}/categories`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cat.label,
        item: `${site.url}/categories/${slug}`,
      },
    ],
  };
  return (
    <div className="location-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <Link href="/categories">Categories</Link>
        <span>›</span>
        <span>{cat.label}</span>
      </nav>
      <div className="location-page-header category-page-header">
        <p className="eyebrow">Worldwide creator collection</p>
        <h1>{cat.seo?.heading ?? `${cat.label} OnlyFans Creators`}</h1>
        <CategoryIntro text={cat.seo?.intro ?? cat.summary} leadSentences={3} />
      </div>
      <h2 className="category-results-heading">
        {cat.seo?.resultsHeading ?? `Explore ${cat.label} creators`}
      </h2>
      <Suspense key={JSON.stringify(query)} fallback={<CreatorGridSkeleton />}>
        <Directory query={query} category={slug} />
      </Suspense>
      <section className="category-editorial">
        <h2>How this collection is selected</h2>
        <p>
          {cat.seo?.selectionNote ??
            `${cat.summary} Matches use profile descriptions and are discovery labels, not independently verified measurements.`}{" "}
          Creator profiles and subscription prices may change; check each
          creator’s official page for current information.
        </p>
        <h2>Explore more OnlyFans categories</h2>
        <div className="chips-row chips-row--wrap">
          {categories
            .filter((c) => c.slug !== slug)
            .map((c) => (
              <Link
                className="category-chip"
                href={`/categories/${c.slug}`}
                key={c.slug}
              >
                {c.label}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
