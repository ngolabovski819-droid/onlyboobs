import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Directory from "@/components/Directory";
import CreatorGridSkeleton from "@/components/CreatorGridSkeleton";
import { fetchCollectionStats } from "@/lib/supabase";
import { fillSeo } from "@/lib/seo.mjs";

export async function generateMetadata(): Promise<Metadata> {
  const stats = await fetchCollectionStats("big-tits");
  return {
    title:
      fillSeo("{free} Free Big Tits OnlyFans Models ($0 to Follow)", stats) ??
      "Best Free OnlyFans Models With Big Tits",
    description:
      fillSeo(
        "{free} OnlyFans models with big tits you can follow for $0, ranked by likes. Real, verified accounts with no subscription fee. Updated {updated}.",
        stats,
      ) ??
      "Discover free-subscription OnlyFans models with big tits. Browse worldwide creators in the OnlyBoobs Big Boobs collection.",
    alternates: { canonical: "/free-onlyfans-titty-models" },
  };
}

export default function FreeCreators() {
  return (
    <div className="location-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <span>Free OF Booby Girls</span>
      </nav>
      <div className="location-page-header">
        <p className="eyebrow">Free subscriptions</p>
        <h1>Best Free OnlyFans Models With Big Tits</h1>
        <p className="muted">
          Browse free-subscription creators in our Big Boobs collection.
          Subscription prices can change, so check each creator’s official
          profile for current details.
        </p>
      </div>
      <Suspense fallback={<CreatorGridSkeleton />}>
        <Directory query={{ price: "free" }} category="big-tits" />
      </Suspense>
    </div>
  );
}
