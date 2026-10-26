import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { contactEmailPlaceholder, site } from "@/config/site";
export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
};
export default function Contact() {
  return (
    <LegalPage title="Contact OnlyBoobs">
      <p>
        Get in touch about a listing, a correction, privacy, copyright or a
        featured placement.
      </p>
      {site.contactEmail &&
      site.contactEmail.toLowerCase() !== contactEmailPlaceholder ? (
        <p>
          Email{" "}
          <a className="text-link" href={`mailto:${site.contactEmail}`}>
            {site.contactEmail}
          </a>
          .
        </p>
      ) : (
        <p>
          A public contact email is not currently available. This page does not
          accept submissions.
        </p>
      )}
      <h2>Creators and listing corrections</h2>
      <p>
        Include your username, the relevant OnlyBoobs page and a short
        description of the change. Never send your account password or payment
        details.
      </p>
      <h2>Removal and copyright</h2>
      <p>
        See our{" "}
        <Link className="text-link" href="/dmca">
          DMCA and removal page
        </Link>{" "}
        for the information needed to identify the listing or material.
      </p>
      <h2>Featured placements</h2>
      <p>
        Read about{" "}
        <Link className="text-link" href="/promote">
          getting featured
        </Link>{" "}
        and the available placement formats.
      </p>
    </LegalPage>
  );
}
