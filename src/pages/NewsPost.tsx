import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { fetchPost, fetchPosts, formatDate } from "@/lib/news";
import { SHARE_ICONS, SocialIcon } from "@/components/ui";
import { NewsError, PostCard, PostImage, PostMeta, useAsync } from "@/components/news";
import RichText from "@/components/RichText";

const WHATSAPP_ICON =
  "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z";

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
        <Link to="/actualites" className="btn btn-outline mt-8">
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
            <Link to="/actualites" className="transition-colors hover:text-ink">
              ← Actualités
            </Link>
          </nav>
          <div className="mt-10">
            <PostMeta post={post} />
          </div>
          <h1 className="fade-up mt-6 text-4xl md:text-6xl">{post.title}</h1>
          {post.author_name && (
            <div className="mt-8 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-white">
                {post.author_name.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-semibold">{post.author_name}</span>
                <span className="block text-xs text-muted">{formatDate(post.published_at)}</span>
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
              className="aspect-[16/9] max-h-[78vh] w-full rounded-[var(--radius-block)]"
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
              {[
                { name: "LinkedIn", path: SHARE_ICONS.linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}` },
                { name: "Facebook", path: SHARE_ICONS.facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}` },
                { name: "WhatsApp", path: WHATSAPP_ICON, href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${pageUrl}`)}` },
              ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
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
              Discutons-en
              <span className="dot" aria-hidden="true" />
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
