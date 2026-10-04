import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { fetchPost, fetchPosts, formatDate } from "@/lib/news";
import { Arrow, SocialIcon, socialLinks } from "@/components/ui";
import { NewsError, PostCard, PostImage, useAsync } from "@/components/news";
import RichText from "@/components/RichText";

export function NewsPost() {
  const { slug = "" } = useParams();
  const { data: post, error, loading } = useAsync(() => fetchPost(slug), [slug]);
  const { data: latest } = useAsync(() => fetchPosts({ limit: 4 }), []);

  useEffect(() => {
    if (post) document.title = `${post.title} — FM Consulting`;
  }, [post]);

  if (error) {
    return (
      <div className="container-narrow py-32">
        <NewsError message={error} />
      </div>
    );
  }

  if (loading && !post) {
    return (
      <div className="container-narrow animate-pulse pt-20 pb-32">
        <div className="h-4 w-32 rounded bg-mist" />
        <div className="mt-10 h-12 w-full rounded bg-mist" />
        <div className="mt-3 h-12 w-2/3 rounded bg-mist" />
        <div className="mt-12 aspect-[16/9] rounded-3xl bg-mist" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-site py-32 text-center">
        <h1 className="text-3xl font-semibold">Article introuvable</h1>
        <Link to="/news" className="btn btn-outline mt-8">
          ← Retour aux actualités
        </Link>
      </div>
    );
  }

  const others = (latest ?? []).filter((p) => p.slug !== slug).slice(0, 3);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <article>
        {/* Header */}
        <header className="container-narrow pt-12 pb-10 md:pt-20">
          <nav className="text-sm text-muted" aria-label="Fil d'Ariane">
            <Link to="/news" className="transition-colors hover:text-ink">
              ← Actualités
            </Link>
          </nav>
          <p className="mt-10 text-sm text-muted">
            <span className="font-medium text-brand-600">{post.category}</span> · {formatDate(post.published_at)}
          </p>
          <h1 className="fade-up mt-4 text-4xl font-semibold md:text-5xl">{post.title}</h1>
          {post.author_name && (
            <div className="mt-8 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-white">
                {post.author_name.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-semibold">{post.author_name}</span>
                <span className="block text-xs text-muted">Consultant FM Consulting</span>
              </span>
            </div>
          )}
        </header>

        {post.cover && (
          <div className="container-site">
            <PostImage
              image={post.cover}
              eager
              sizes="(min-width: 1200px) 1152px, 100vw"
              className="aspect-[16/9] w-full rounded-3xl md:aspect-[21/9]"
            />
          </div>
        )}

        {/* Body */}
        <div className="container-narrow py-14 md:py-20">
          {post.excerpt && <p className="mb-10 text-xl leading-relaxed text-ink md:text-2xl">{post.excerpt}</p>}
          <RichText doc={post.content} title={post.title} />

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
            <div className="flex items-center gap-2">
              <span className="mr-2 text-sm text-muted">Partager</span>
              {socialLinks
                .filter((s) => s.name === "LinkedIn" || s.name === "Facebook")
                .map((s) => (
                  <a
                    key={s.name}
                    href={
                      s.name === "LinkedIn"
                        ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`
                        : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Partager sur ${s.name}`}
                    title={`Partager sur ${s.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink"
                  >
                    <SocialIcon path={s.path} />
                  </a>
                ))}
            </div>
            <Link to="/contact" className="btn btn-primary">
              Discutons-en <Arrow />
            </Link>
          </div>
        </div>
      </article>

      {/* Related articles */}
      {others.length > 0 && (
        <section className="border-t border-line bg-white">
          <div className="container-site py-20">
            <h2 className="text-2xl font-semibold md:text-3xl">À lire également</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {others.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
