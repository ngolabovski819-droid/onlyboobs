"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/config/categories";
import Brand from "./Brand";
import CreatorSearch from "./CreatorSearch";
const links = [
  {
    href: "/best-onlyfans-titty-models-search",
    label: "Best OF Titty Models",
  },
  { href: "/free-onlyfans-titty-models", label: "Free OF Booby Girls" },
];
export default function Nav() {
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState(false),
    [categoriesOpen, setCategoriesOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="nav-wrapper">
      <div className="nav-row1">
        <Link href="/" className="nav-logo" aria-label="Onlytits home">
          <Brand />
        </Link>
        <div className="header-search">
          <CreatorSearch variant="results" />
        </div>
        <nav className="nav-desktop" aria-label="Main navigation">
          {links.map((l) => (
            <Link className="nav-link" href={l.href} key={l.href}>
              {l.label}
            </Link>
          ))}
          <div
            className="nav-dropdown-wrap"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              type="button"
              className={`nav-link nav-dropdown-btn${pathname.startsWith("/categories") ? " active" : ""}`}
              aria-expanded={categoriesOpen}
              aria-controls="desktop-categories-menu"
              onClick={() => setCategoriesOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setCategoriesOpen(false);
              }}
            >
              Categories <span aria-hidden="true">▾</span>
            </button>
            {categoriesOpen && (
              <div
                id="desktop-categories-menu"
                className="nav-dropdown nav-dropdown--wide nav-dropdown--right"
              >
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="nav-dropdown-item"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    {category.label}
                  </Link>
                ))}
                <Link
                  href="/categories"
                  className="nav-dropdown-item nav-dropdown-item--all"
                  onClick={() => setCategoriesOpen(false)}
                >
                  View All Categories →
                </Link>
              </div>
            )}
          </div>
        </nav>
        <div className="nav-mobile-actions">
          <button
            className="nav-search-toggle"
            aria-label="Toggle search"
            aria-expanded={search}
            onClick={() => setSearch(!search)}
          >
            ⌕
          </button>
          <button
            className="nav-hamburger"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {search && (
        <div className="nav-search-expanded">
          <CreatorSearch variant="results" />
        </div>
      )}
      {open && (
        <nav
          id="mobile-menu"
          className="nav-mobile"
          aria-label="Mobile navigation"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-mobile-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="nav-mobile-section">Categories</div>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="nav-mobile-link"
              onClick={() => setOpen(false)}
            >
              {category.label}
            </Link>
          ))}
          <Link
            href="/categories"
            className="nav-mobile-link"
            onClick={() => setOpen(false)}
          >
            View all categories →
          </Link>
        </nav>
      )}
    </header>
  );
}
