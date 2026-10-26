import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
export const metadata: Metadata = {
  title: "Get Featured on OnlyBoobs",
  alternates: { canonical: "/promote" },
};
export default function Promote() {
  return (
    <>
      <section className="hero">
        <p className="hero-eyebrow">For creators & agencies</p>
        <h1 className="hero-title">
          Your profile.
          <br />
          <span className="hero-title-gradient">A new audience.</span>
        </h1>
        <p className="hero-subtitle">
          Put your profile in front of people exploring your niche. Discover
          featured placements on OnlyBoobs.
        </p>
        <a
          className="btn btn--primary"
          href={site.promoteUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get featured →
        </a>
      </section>
      <section className="page-section collection-grid">
        {[
          [
            "Featured cards",
            "A reserved position in a relevant collection, clearly labelled as a paid placement.",
          ],
          [
            "Photo galleries",
            "Show a selection of your supplied images in the existing creator-card carousel.",
          ],
          [
            "Click reporting",
            "Site-specific click reporting, with bot and link-verification signals.",
          ],
        ].map(([title, copy]) => (
          <div className="collection-card" key={title}>
            <h2>{title}</h2>
            <p>{copy}</p>
          </div>
        ))}
      </section>
      <section className="legal-page">
        <h2>How it works</h2>
        <p>
          We agree on your placement, supplied images, destination link and
          campaign period. Your card then appears in the agreed positions. You
          keep control of your creator account; we never need your password.
        </p>
        <h2>A new directory</h2>
        <p>
          OnlyBoobs is preparing for launch. We do not promise traffic,
          subscriber numbers or financial results. Campaign availability and
          pricing will be confirmed individually.
        </p>
        <p>
          Read our{" "}
          <Link className="text-link" href="/disclosure">
            sponsorship disclosure
          </Link>
          .
        </p>
      </section>
    </>
  );
}
