import type { Metadata } from "next";
import Link from "next/link";
import { categories, categoryGroups } from "@/config/categories";
import { site } from "@/config/site";
import { fetchCollectionStats } from "@/lib/supabase";
import { fillSeo } from "@/lib/seo.mjs";

export async function generateMetadata(): Promise<Metadata> {
  const stats = await fetchCollectionStats();
  const title =
    fillSeo(
      `{count} OnlyFans Models in ${categories.length} Boob Categories`,
      stats,
    ) ?? "OnlyFans Categories by Size & Style";
  const description =
    fillSeo(
      `Browse {count} verified OnlyFans models across ${categories.length} categories: big, huge, natural, small, fake, MILF and more. {free} are free to follow. Updated {updated}.`,
      stats,
    ) ??
    "Explore OnlyFans categories for every size and style, including big, huge, small, natural and enhanced creator collections.";
  return {
    title,
    description,
    alternates: { canonical: "/categories" },
    openGraph: {
      title: `${title} | OnlyBoobs`,
      description,
      url: "/categories",
    },
  };
}

const groupIcons = ["♡", "✦"];
const sectionId = (label: string) =>
  `category-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

export default function Categories() {
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
    ],
  };

  return (
    <div className="categories-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <span>Categories</span>
      </nav>

      <header className="categories-header">
        <p className="eyebrow">Find creators your way</p>
        <h1>OnlyFans Categories for Every Size and Style</h1>
        <p className="muted">
          Browse {categories.length} collections of worldwide OnlyFans creators
          by breast size, natural or enhanced style, and more.
        </p>
        <p className="categories-description">
          Choose a collection to browse matching profiles. Category labels are
          based on creators’ public descriptions, not measurements or image
          analysis. You can also explore{" "}
          <Link href="/free-onlyfans-titty-models" className="text-link">
            free OnlyFans subscriptions
          </Link>
          .
        </p>
      </header>

      <nav className="category-jumps" aria-label="Jump to a category group">
        {categoryGroups.map((group) => (
          <a key={group.label} href={`#${sectionId(group.label)}`}>
            {group.label}
          </a>
        ))}
        <a href="#all-categories">All categories A–Z</a>
      </nav>

      <div className="category-sections">
        {categoryGroups.map((group, index) => (
          <section
            className="category-section"
            id={sectionId(group.label)}
            key={group.label}
          >
            <div className="category-section-heading">
              <span aria-hidden="true">{groupIcons[index] ?? "✦"}</span>
              <h2>{group.label}</h2>
              <div />
              <span className="category-count">
                {group.items.length} categories
              </span>
            </div>
            <div className="category-card-grid">
              {group.items.map((category) => (
                <Link
                  className="category-index-card"
                  href={`/categories/${category.slug}`}
                  key={category.slug}
                >
                  <span className="category-index-dot" aria-hidden="true" />
                  <span>{category.label}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="category-section category-alphabetical" id="all-categories">
        <div className="category-section-heading">
          <span aria-hidden="true">☷</span>
          <h2>All Categories A–Z</h2>
          <div />
        </div>
        <div className="category-card-grid">
          {[...categories]
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((category) => (
              <Link
                className="category-index-card category-index-card--subtle"
                href={`/categories/${category.slug}`}
                key={category.slug}
              >
                <span>{category.label}</span>
                <span aria-hidden="true">›</span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
