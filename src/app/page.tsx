import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import CreatorSearch from "@/components/CreatorSearch";
import CreatorGridSkeleton from "@/components/CreatorGridSkeleton";
import CategoryBrowse from "@/components/CategoryBrowse";
import Directory from "@/components/Directory";
import FAQ from "@/components/FAQ";
export const revalidate = 300;
export const metadata: Metadata = {
  title: "Find OnlyFans Models with Beautiful Tits | OnlyBoobs",
  description:
    "Find OnlyFans models of every size and style, from big and busty to small, natural, and enhanced. Browse worldwide creator profiles and free or paid subscriptions.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Find OnlyFans Models with Beautiful Tits | OnlyBoobs",
    description:
      "Discover OnlyFans models of every size and shape. Browse creator profiles by size, style and subscription price.",
    url: "/",
  },
};
const faqs = [
  {
    q: "How can I find OnlyFans models by breast size?",
    a: "Browse the Big Boobs, Huge Boobs, Small Boobs, Natural, and Enhanced collections, or use search and filters to narrow profiles by category and subscription price.",
  },
  {
    q: "Does OnlyBoobs include small-breasted creators?",
    a: "Yes. OnlyBoobs is for creators of every size and shape. The Small Boobs collection is available alongside big, huge, natural, and enhanced categories.",
  },
  {
    q: "Are the OnlyFans profiles on OnlyBoobs verified?",
    a: "The directory uses verified performer profiles from its creator data source. Category matches are based on words in public profile descriptions; they are discovery labels, not measurements or independent verification of appearance.",
  },
  {
    q: "Are there free OnlyFans models?",
    a: "Yes. Browse free-subscription profiles on our free OnlyFans page. A free subscription may still include paid posts or messages, so check each creator’s official profile for current terms.",
  },
  {
    q: "How are popular OnlyFans creators ordered?",
    a: "Popular sorting uses the favourites count supplied with the creator profile, while Newest uses when the directory first recorded the profile. Neither sort guarantees quality or ranks every creator on OnlyFans.",
  },
  {
    q: "Does OnlyBoobs host creator photos or subscriptions?",
    a: "No. OnlyBoobs is an independent discovery directory. Creator profiles link to official external pages, where you can confirm current subscription prices, posts, and terms.",
  },
];
export default function Home() {
  return (
    <>
      <section className="hero">
        <h1 className="hero-title hero-title--home">
          Find OnlyFans models
          <br />
          <span className="hero-title-gradient hero-title-second-line">
            with beautiful tits
          </span>
        </h1>
        <p className="hero-subtitle">
          Discover creators of every breast size and style.
        </p>
        <CreatorSearch />
        <div className="hero-quick-links">
          <Link href="/categories/big-tits">Big Boobs</Link>
          <Link href="/categories/huge-tits">Huge Boobs</Link>
          <Link href="/categories/small-tits">Small Boobs</Link>
          <Link href="/categories/natural-tits">Natural</Link>
          <Link href="/categories/fake-tits">Enhanced</Link>
          <Link href="/categories">All categories →</Link>
        </div>
      </section>
      <section className="page-section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Find someone new</p>
            <h2 className="section-heading">Popular Titty Creators</h2>
          </div>
          <Link href="/best-onlyfans-titty-models-search" className="text-link">
            Explore the Best OF Titty Models →
          </Link>
        </div>
        <Suspense fallback={<CreatorGridSkeleton />}>
          <Directory home />
        </Suspense>
      </section>
      <CategoryBrowse />
      <section className="directory-intro page-section">
        <p className="eyebrow">Discover your kind of creator</p>
        <h2>Explore OnlyFans models by size and style</h2>
        <p>
          Search worldwide OnlyFans profiles by the words creators use to
          describe themselves. Start with{" "}
          <Link href="/categories/big-tits" className="text-link">
            OnlyFans models with big tits
          </Link>{" "}
          or{" "}
          <Link href="/categories/huge-tits" className="text-link">
            huge-breasted creators
          </Link>
          , or explore{" "}
          <Link href="/categories/small-tits" className="text-link">
            small-breasted models
          </Link>
          ,{" "}
          <Link href="/categories/natural-tits" className="text-link">
            natural profiles
          </Link>
          , and{" "}
          <Link href="/categories/fake-tits" className="text-link">
            enhanced creators
          </Link>
          . OnlyBoobs includes every size and shape, not just busty categories.
        </p>
        <p>
          Prefer a particular look? Browse{" "}
          <Link href="/categories/asian" className="text-link">
            busty Asian
          </Link>
          ,{" "}
          <Link href="/categories/latina" className="text-link">
            Latina
          </Link>
          ,{" "}
          <Link href="/categories/blonde" className="text-link">
            blonde
          </Link>
          , or{" "}
          <Link href="/categories/milf" className="text-link">
            MILF
          </Link>{" "}
          creator collections. Looking for a no-cost subscription?{" "}
          <Link href="/free-onlyfans-titty-models" className="text-link">
            Browse free OnlyFans models
          </Link>
          . Check official profiles for current prices and content; categories
          are based on public descriptions, not body measurements.
        </p>
      </section>
      <section className="how-it-works">
        <h2 className="how-it-works-title">
          How to find your next favourite creator
        </h2>
        <p className="how-it-works-sub">A simpler way to discover creators.</p>
        <div className="how-it-works-steps">
          {[
            [
              "Search or browse",
              "Explore a category or search for a name or keyword.",
            ],
            [
              "Make it your own",
              "Narrow your results by category, price and popularity.",
            ],
            [
              "Visit their page",
              "See the creator’s official profile for current prices and details.",
            ],
          ].map(([title, copy], i) => (
            <div className="how-step" key={title}>
              <div className="how-step-num">0{i + 1}</div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="page-section home-faq">
        <p className="eyebrow">Good to know</p>
        <FAQ faqs={faqs} heading="OnlyFans Model FAQs" />
      </div>
      <section className="feature-callout page-section">
        <div>
          <p className="eyebrow">For creators</p>
          <h2>Your profile. A new audience.</h2>
          <p>Explore featured placements on OnlyBoobs.</p>
        </div>
        <Link className="btn btn--primary" href="/promote">
          Get featured →
        </Link>
      </section>
    </>
  );
}
