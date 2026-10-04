import { useState } from "react";
import { Link } from "react-router";
import { CATEGORIES, fetchPosts, formatDate } from "@/lib/news";
import { Arrow, PageHeader } from "@/components/ui";
import { NewsError, PostCard, PostCardSkeleton, PostImage, useAsync } from "@/components/news";

const categories = ["Tous", ...CATEGORIES];

export function News() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const { data: posts, error, loading } = useAsync(
    () => fetchPosts({ category: activeCategory === "Tous" ? undefined : activeCategory }),
    [activeCategory],
  );

  const [featured, ...rest] = posts ?? [];

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

        {error && <NewsError message={error} />}

        {loading && !posts && (
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}

        <div className={`transition-opacity ${loading && posts ? "opacity-50" : ""}`}>
          {/* Featured article */}
          {featured && (
            <Link
              to={`/news/${featured.slug}`}
              className="group mb-16 grid items-center gap-8 md:grid-cols-2 md:gap-12"
            >
              <div className="overflow-hidden rounded-3xl">
                <PostImage
                  image={featured.cover}
                  eager
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div>
                <p className="text-sm text-muted">
                  <span className="font-medium text-brand-600">{featured.category}</span> ·{" "}
                  {formatDate(featured.published_at)}
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight transition-colors group-hover:text-brand-600 md:text-4xl">
                  {featured.title}
                </h2>
                {featured.excerpt && <p className="mt-5 leading-relaxed text-muted">{featured.excerpt}</p>}
                <p className="mt-8 flex items-center justify-between border-t border-line pt-6 text-sm">
                  <span className="text-ink-soft">{featured.author_name && `Par ${featured.author_name}`}</span>
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
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {posts && posts.length === 0 && (
            <p className="py-20 text-center text-muted">Aucun article dans cette catégorie.</p>
          )}
        </div>
      </section>
    </>
  );
}
