import Link from "next/link";
import Brand from "./Brand";
import { categories } from "@/config/categories";
const info = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Best OF Titty Models", "/best-onlyfans-titty-models-search"],
  ["Free OF Booby Girls", "/free-onlyfans-titty-models"],
];
const policies = [
  ["Get featured", "/promote"],
  ["Privacy policy", "/privacy"],
  ["Terms of use", "/terms"],
  ["DMCA & removal", "/dmca"],
  ["Cookies & preferences", "/cookies"],
  ["Sponsorship disclosure", "/disclosure"],
];
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <Link href="/" className="footer-logo">
              <Brand />
            </Link>
            <p className="footer-tagline">
              Discover OnlyFans models with big tits, small boobs and every
              shape.
            </p>
            <p className="footer-disclaimer">
              An independent directory for adults. Not affiliated with or
              endorsed by OnlyFans or Fenix International Limited.
            </p>
          </div>
          <div>
            <h2 className="footer-heading">Explore</h2>
            <ul className="footer-list">
              {categories
                .filter(
                  (c) =>
                    c.core ||
                    c.slug === "perky-tits" ||
                    c.slug === "sagging-tits",
                )
                .map((c) => (
                  <li key={c.slug}>
                    <Link
                      className="footer-link"
                      href={`/categories/${c.slug}`}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2 className="footer-heading">OnlyBoobs</h2>
            <ul className="footer-list">
              {info.map(([label, href]) => (
                <li key={href}>
                  <Link className="footer-link" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="footer-heading">Information</h2>
            <ul className="footer-list">
              {policies.map(([label, href]) => (
                <li key={href}>
                  <Link className="footer-link" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} OnlyBoobs. Adults 18+.</p>
          <p>
            Prices and availability can change. Confirm details on the creator’s
            official page.
          </p>
        </div>
      </div>
    </footer>
  );
}
