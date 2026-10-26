import Link from "next/link";
import { contactEmailPlaceholder, site } from "@/config/site";
export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="legal-page">
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <span>{title}</span>
      </nav>
      <h1>{title}</h1>
      <p className="legal-page-date">Last updated: 26 October 2026</p>
      {children}
    </article>
  );
}
export function ContactLink() {
  return site.contactEmail &&
    site.contactEmail.toLowerCase() !== contactEmailPlaceholder ? (
    <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
  ) : (
    <Link href="/contact">Contact information</Link>
  );
}
