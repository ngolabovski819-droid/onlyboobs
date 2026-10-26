import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Directory from "@/components/Directory";
import CreatorGridSkeleton from "@/components/CreatorGridSkeleton";

export const metadata: Metadata = {
  title: "Best Free OnlyFans Models With Big Tits",
  description:
    "Discover free-subscription OnlyFans models with big tits. Browse worldwide creators in the OnlyBoobs Big Boobs collection.",
  alternates: { canonical: "/free-onlyfans-titty-models" },
};

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
