import Link from "next/link";
import { categoryGroups } from "@/config/categories";

export default function CategoryBrowse() {
  return (
    <section className="category-browse">
      <h2 className="category-browse-heading">
        Browse OnlyFans Models by Size and Style
      </h2>
      <div className="category-browse-groups">
        {categoryGroups.map((group) => (
          <div key={group.label} className="category-group">
            <h3 className="category-group-label">{group.label}</h3>
            <div className="chips-row chips-row--wrap">
              {group.items.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="category-chip"
                >
                  {cat.emoji && <span>{cat.emoji} </span>}
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link href="/categories" className="btn btn--outline">
          Explore All OnlyFans Categories →
        </Link>
      </div>
    </section>
  );
}
