import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CATEGORIES, fetchPosts } from "@/lib/news";
import { usePage } from "@/content/SiteContent";
import { CtaBand, PageHeader } from "@/components/ui";
import { NewsError, PostCard, PostCardSkeleton, PostImage, PostMeta, useAsync } from "@/components/news";

const categories = ["Tous", ...CATEGORIES];

export function News() {
  const { header } = usePage("news");
  const [activeCategory, setActiveCategory] = useState("Tous");

  useEffect(() => {
    document.title = "Actualités · FM Consulting";
  }, []);
  const { data: posts, error, loading } = useAsync(
    () => fetchPosts({ category: activeCategory === "Tous" ? undefined : activeCategory }),
    [activeCategory],
  );

  const [featured, ...rest] = posts ?? [];

  return (
    <>
      <PageHeader eyebrow={header.eyebrow} title={header.title} text={header.text} />

      <section className="container-site pb-24 md:pb-32">
        {/* Category filter */}
        <div className="-mx-6 mb-12 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                activeCategory === cat ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-ink hover:text-ink"
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
            <Link to={`/actualites/${featured.slug}`} className="group mb-16 grid items-center gap-8 rounded-[var(--radius-block)] bg-mist p-3 md:grid-cols-2 md:gap-12 md:pr-12">
              <div className="overflow-hidden rounded-2xl">
                <PostImage
                  image={featured.cover}
                  eager
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-3 pb-6 md:px-0 md:pb-0">
                <PostMeta post={featured} light={false} />
                <h2 className="mt-5 text-3xl leading-tight transition-colors group-hover:text-brand-600 md:text-4xl">{featured.title}</h2>
                {featured.excerpt && <p className="mt-5 leading-relaxed text-muted">{featured.excerpt}</p>}
                <span className="btn btn-outline mt-8">
                  Lire l'article
                  <span className="dot" aria-hidden="true" />
                </span>
              </div>
            </Link>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
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

      <CtaBand />
    </>
  );
}
