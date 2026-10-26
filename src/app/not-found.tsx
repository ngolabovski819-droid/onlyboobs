import Link from "next/link";
export default function NotFound() {
  return (
    <section className="hero">
      <p className="hero-eyebrow">404</p>
      <h1 className="hero-title">A little off track.</h1>
      <p className="hero-subtitle">
        That page isn’t here. There’s still plenty to explore.
      </p>
      <Link href="/categories" className="btn btn--primary">
        Browse categories →
      </Link>
    </section>
  );
}
