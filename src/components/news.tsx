import { useEffect, useState } from "react";
import { Link } from "react-router";
import { type ImageRef, type PostSummary, formatDate, imageProps } from "@/lib/news";
import { youTubeThumb } from "@/lib/youtube";

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
  image: ImageRef | null;
  sizes: string;
  className?: string;
  eager?: boolean;
}) {
  if (!image) {
    return (
      <div
        aria-hidden="true"
        className={`bg-gradient-to-br from-brand-50 via-mist to-white ${className}`}
      />
    );
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

/** Lecteur YouTube léger : seule la miniature est chargée, le lecteur l'est au clic. */
export function LiteYouTube({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full rounded-2xl bg-ink"
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Lire la vidéo : ${title}`}
      className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-2xl bg-ink"
    >
      <img
        src={youTubeThumb(videoId)}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-105">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-6 w-6 fill-ink">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        </span>
      </span>
    </button>
  );
}

export function PostCard({ post, aspect = "aspect-[3/2]" }: { post: PostSummary; aspect?: string }) {
  return (
    <Link to={`/news/${post.slug}`} className="group flex flex-col">
      <div className="overflow-hidden rounded-2xl">
        <PostImage
          image={post.cover}
          sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
          className={`${aspect} w-full transition-transform duration-500 group-hover:scale-[1.03]`}
        />
      </div>
      <p className="mt-5 text-xs text-muted">
        <span className="font-medium text-brand-600">{post.category}</span> · {formatDate(post.published_at)}
      </p>
      <h3 className="mt-2 text-xl font-semibold leading-snug transition-colors group-hover:text-brand-600">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
      )}
    </Link>
  );
}

export function PostCardSkeleton({ aspect = "aspect-[3/2]" }: { aspect?: string }) {
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
