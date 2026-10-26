import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "About OnlyBoobs",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <article className="legal-page">
      <p className="eyebrow">Every size. Every shape.</p>
      <h1>A place to find your favourites.</h1>
      <p>
        OnlyBoobs is an independent directory of OnlyFans creators from around
        the world. Small, big, natural, enhanced and more: the idea is to make
        discovery simpler.
      </p>
      <h2>How we build collections</h2>
      <p>
        We use creator profile descriptions to match relevant categories. We do
        not determine physical attributes from photographs. Listings come from
        our connected profile dataset and are refreshed when you browse, with a
        short cache to keep the site responsive.
      </p>
      <h2>How results are ordered</h2>
      <p>
        Popular means the highest supplied favourites count within our indexed
        collection. Newest refers to when a profile first appeared in our
        dataset, rather than its account creation date. Any paid placements are
        clearly labelled.
      </p>
      <h2>For creators</h2>
      <p>
        You can request corrections or removal through our{" "}
        <Link className="text-link" href="/contact">
          contact page
        </Link>
        . We are not affiliated with or endorsed by OnlyFans.
      </p>
    </article>
  );
}
