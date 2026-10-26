import type { Metadata } from "next";
import { Suspense } from "react";
import Directory, { single, type Query } from "@/components/Directory";
import CreatorGridSkeleton from "@/components/CreatorGridSkeleton";
export const metadata: Metadata = {
  title: "Best OF Titty Models | OnlyBoobs",
  robots: { index: false, follow: true },
};
export default async function Search({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const q = await searchParams;
  return (
    <div className="location-page">
      <div className="location-page-header">
        <p className="eyebrow">Make it your own</p>
        <h1>
          {single(q.q)
            ? `Results for “${single(q.q)?.slice(0, 120)}”`
            : "Explore creators"}
        </h1>
        <p className="muted">
          All sizes and shapes. Worldwide profiles, in one place.
        </p>
      </div>
      <Suspense key={JSON.stringify(q)} fallback={<CreatorGridSkeleton />}>
        <Directory query={q} />
      </Suspense>
    </div>
  );
}
