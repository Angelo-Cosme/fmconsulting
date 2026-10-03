import { useParams, Link } from "react-router";
import { posts } from "@/data/news";
import { Arrow, SocialIcon, socialLinks } from "@/components/ui";

export function NewsPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

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

  const others = posts.filter((p) => p.slug !== slug).slice(0, 3);

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
            <span className="font-medium text-brand-600">{post.category}</span> · {post.date}
          </p>
          <h1 className="fade-up mt-4 text-4xl font-semibold md:text-5xl">{post.title}</h1>
          <div className="mt-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-white">
              {post.author.charAt(0)}
            </span>
            <span>
              <span className="block text-sm font-semibold">{post.author}</span>
              <span className="block text-xs text-muted">Consultant FM Consulting</span>
            </span>
          </div>
        </header>

        <div className="container-site">
          <img
            src={post.photo}
            alt=""
            className="aspect-[16/9] w-full rounded-3xl object-cover md:aspect-[21/9]"
          />
        </div>

        {/* Body */}
        <div className="container-narrow py-14 md:py-20">
          <p className="text-xl leading-relaxed text-ink md:text-2xl">{post.excerpt}</p>
          <div className="mt-10 space-y-6 text-lg leading-[1.8] text-ink-soft">
            {post.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
            <div className="flex items-center gap-2">
              <span className="mr-2 text-sm text-muted">Partager</span>
              {socialLinks.map((s) => (
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
                <Link key={p.slug} to={`/news/${p.slug}`} className="group">
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={p.photo}
                      alt=""
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-5 text-xs text-muted">
                    <span className="font-medium text-brand-600">{p.category}</span> · {p.date}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug transition-colors group-hover:text-brand-600">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
