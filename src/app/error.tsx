"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="hero">
      <h1>Something didn’t load</h1>
      <p className="hero-subtitle">Please try again in a moment.</p>
      <button className="btn btn--primary" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
