import { useEffect, useState } from "react";
import { Link } from "react-router";
import { assetUrl, type ImageRef, type PostSummary, formatDate, imageProps, imageSrc } from "@/lib/news";
import { parseYouTubeId, youTubeThumb } from "@/lib/youtube";
import type { VideoRef } from "@/content/media";

/** Petit hook de chargement asynchrone (données, erreur, état). */
export function useAsync<T>(load: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<{ data?: T; error?: string; loading: boolean }>({ loading: true });
  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ data: s.data, loading: true }));
    load().then(
      (data) => !cancelled && setState({ data, loading: false }),
      (err: Error) => !cancelled && setState({ error: err.message, loading: false }),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

export function PostImage({
  image,
  sizes,
  className = "",
  eager = false,
}: {
  image: ImageRef | null | undefined;
  sizes: string;
  className?: string;
  eager?: boolean;
}) {
  if (!image) {
    return <div aria-hidden="true" className={`bg-gradient-to-br from-brand-50 via-mist to-white ${className}`} />;
  }
  return (
    <img
      {...imageProps(image, sizes)}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
      className={`bg-mist object-cover ${className}`}
    />
  );
}

function PlayBadge({ large = false }: { large?: boolean }) {
  return (
    <span className="absolute inset-0 flex items-center justify-center">
      <span
        className={`flex items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform duration-300 group-hover:scale-110 ${
          large ? "h-20 w-20" : "h-16 w-16"
        }`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-6 w-6 fill-ink">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      </span>
    </span>
  );
}

/** Lecteur YouTube léger : seule la miniature est chargée, le lecteur l'est au clic. */
export function LiteYouTube({ videoId, title, className = "aspect-video" }: { videoId: string; title: string; className?: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`w-full rounded-2xl bg-ink ${className}`}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Lire la vidéo : ${title}`}
      className={`group relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-ink ${className}`}
    >
      <img src={youTubeThumb(videoId)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
      <PlayBadge />
    </button>
  );
}

/**
 * Vidéo (fichier MP4 ou lien YouTube) : seule l'image d'aperçu est chargée,
 * la vidéo ne se télécharge qu'au clic sur « Lecture ».
 */
export function VideoPlayer({
  video,
  title,
  className = "aspect-video",
  ratio,
}: {
  video: VideoRef | null | undefined;
  title: string;
  className?: string;
  /** Proportions (largeur / hauteur) quand className ne les fixe pas. */
  ratio?: number;
}) {
  const [playing, setPlaying] = useState(false);
  const style = ratio ? { aspectRatio: String(ratio) } : undefined;
  if (!video?.src) return null;

  const youTubeId = /youtu/i.test(video.src) ? parseYouTubeId(video.src) : null;
  if (youTubeId) return <LiteYouTube videoId={youTubeId} title={title} className={className} />;

  if (playing) {
    return (
      <video
        src={assetUrl(video.src)}
        controls
        autoPlay
        playsInline
        style={style}
        className={`w-full rounded-2xl bg-ink object-contain ${className}`}
        aria-label={title}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Lire la vidéo : ${title}`}
      style={style}
      className={`group relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-ink ${className}`}
    >
      {video.poster ? (
        <img
          src={imageSrc(video.poster, 640)}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
        />
      ) : (
        // Sans image d'aperçu : première image de la vidéo (chargement des métadonnées uniquement).
        <video src={`${assetUrl(video.src)}#t=1`} preload="metadata" muted playsInline className="h-full w-full object-cover" aria-hidden="true" />
      )}
      <PlayBadge />
    </button>
  );
}

/** Pastilles « catégorie » et « date » des articles, comme dans le template. */
export function PostMeta({ post, light = false }: { post: Pick<PostSummary, "category" | "published_at">; light?: boolean }) {
  const pill = `rounded-full px-3.5 py-1.5 text-xs font-medium ${light ? "bg-white/15 text-white" : "bg-mist text-ink-soft"}`;
  return (
    <div className="flex flex-wrap gap-2">
      <span className={pill}>{post.category}</span>
      {post.published_at && <span className={pill}>{formatDate(post.published_at)}</span>}
    </div>
  );
}

export function PostCard({ post, aspect = "aspect-[4/3]" }: { post: PostSummary; aspect?: string }) {
  return (
    <Link to={`/actualites/${post.slug}`} className="group flex flex-col">
      <div className="overflow-hidden rounded-2xl">
        <PostImage
          image={post.cover}
          sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw"
          className={`${aspect} w-full transition-transform duration-700 group-hover:scale-[1.04]`}
        />
      </div>
      <div className="mt-5">
        <PostMeta post={post} />
      </div>
      <h3 className="mt-4 text-xl leading-snug font-semibold tracking-tight transition-colors group-hover:text-brand-600">{post.title}</h3>
      {post.excerpt && <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>}
    </Link>
  );
}

/** Article en ligne (image à gauche, texte à droite), comme la section blog du template. */
export function PostRow({ post }: { post: PostSummary }) {
  return (
    <Link
      to={`/actualites/${post.slug}`}
      className="group grid items-center gap-6 rounded-2xl border border-line bg-white p-2 transition-colors hover:border-ink/30 md:grid-cols-[minmax(0,320px)_1fr_auto] md:gap-10 md:pr-8"
    >
      <div className="overflow-hidden rounded-xl">
        <PostImage image={post.cover} sizes="(min-width: 768px) 320px, 100vw" className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.05]" />
      </div>
      <div className="px-3 pb-3 md:px-0 md:pb-0">
        <PostMeta post={post} />
        <h3 className="mt-4 text-xl leading-snug font-semibold tracking-tight md:text-2xl">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>}
      </div>
      <span className="btn btn-outline mx-3 mb-3 self-start md:m-0 md:self-center">
        Lire la suite
        <span className="dot" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function PostCardSkeleton({ aspect = "aspect-[4/3]" }: { aspect?: string }) {
  return (
    <div className="animate-pulse">
      <div className={`${aspect} rounded-2xl bg-mist`} />
      <div className="mt-5 h-3 w-1/3 rounded bg-mist" />
      <div className="mt-3 h-5 w-5/6 rounded bg-mist" />
      <div className="mt-2 h-5 w-2/3 rounded bg-mist" />
    </div>
  );
}

export function NewsError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-8 text-center text-muted">
      <p>Les actualités sont momentanément indisponibles.</p>
      <p className="mt-2 text-xs">{message}</p>
    </div>
  );
}
