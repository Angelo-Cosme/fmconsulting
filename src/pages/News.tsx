import { useState } from "react";
import { Link } from "react-router";
import { posts } from "@/data/news";
import { Arrow, PageHeader } from "@/components/ui";

const categories = ["Tous", "Stratégie", "Digital", "Ressources humaines", "Finance", "RSE"];

export function News() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filtered =
    activeCategory === "Tous" ? posts : posts.filter((p) => p.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <>
      <PageHeader
        eyebrow="Insights & expertise"
        title={
          <>
            Nos <span className="accent">actualités</span>
          </>
        }
        description="Analyses, tendances et retours d'expérience de nos consultants."
      />

      <section className="container-site py-12 md:py-16">
        {/* Category filter */}
        <div className="-mx-6 mb-12 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                activeCategory === cat
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured article */}
        {featured && (
          <Link
            to={`/news/${featured.slug}`}
            className="group mb-16 grid items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            <div className="overflow-hidden rounded-3xl">
              <img
                src={featured.photo}
                alt=""
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div>
              <p className="text-sm text-muted">
                <span className="font-medium text-brand-600">{featured.category}</span> · {featured.date}
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight transition-colors group-hover:text-brand-600 md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-5 leading-relaxed text-muted">{featured.excerpt}</p>
              <p className="mt-8 flex items-center justify-between border-t border-line pt-6 text-sm">
                <span className="text-ink-soft">Par {featured.author}</span>
                <span className="link-arrow">
                  Lire l'article <Arrow />
                </span>
              </p>
            </div>
          </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid gap-x-8 gap-y-14 border-t border-line pt-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} to={`/news/${post.slug}`} className="group flex flex-col">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={post.photo}
                    alt=""
                    className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-5 text-xs text-muted">
                  <span className="font-medium text-brand-600">{post.category}</span> · {post.date}
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-snug transition-colors group-hover:text-brand-600">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="py-20 text-center text-muted">Aucun article dans cette catégorie.</p>
        )}
      </section>
    </>
  );
}
