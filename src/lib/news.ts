// Accès public aux actualités via l'API REST de Supabase.
// Volontairement sans @supabase/supabase-js : les visiteurs ne téléchargent pas la librairie
// (elle n'est chargée que dans le dashboard /admin).

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "";
export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const CATEGORIES = ["Stratégie", "Digital", "Ressources humaines", "Finance", "RSE"];
export const IMAGE_WIDTHS = [480, 960, 1600] as const;
export const IMAGE_BUCKET = "news";

/** widths : largeurs réellement générées (fichiers news/<path>/<largeur>.<ext>). */
export type ImageRef = {
  path: string;
  width: number;
  height: number;
  alt: string;
  widths: number[];
  ext?: "webp" | "jpg";
};

/** Document de l'éditeur Tiptap (JSON ProseMirror). */
export type RichMark = { type: string; attrs?: Record<string, unknown> };
export type RichNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichNode[];
  marks?: RichMark[];
  text?: string;
};
export type RichDoc = RichNode & { type: "doc" };

export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author_name: string;
  cover: ImageRef | null;
  published_at: string | null;
};

export type Post = PostSummary & {
  content: RichDoc;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

const SUMMARY_FIELDS = "id,slug,title,excerpt,category,author_name,cover,published_at";

async function rest<T>(path: string): Promise<T> {
  if (!isConfigured) throw new Error("Supabase n'est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Erreur ${res.status} lors du chargement des actualités`);
  return res.json() as Promise<T>;
}

export function fetchPosts({ category, limit }: { category?: string; limit?: number } = {}) {
  const params = new URLSearchParams({
    select: SUMMARY_FIELDS,
    status: "eq.published",
    order: "published_at.desc",
  });
  if (category) params.set("category", `eq.${category}`);
  if (limit) params.set("limit", String(limit));
  return rest<PostSummary[]>(`posts?${params}`);
}

export async function fetchPost(slug: string) {
  const params = new URLSearchParams({ select: "*", slug: `eq.${slug}`, status: "eq.published", limit: "1" });
  const [post] = await rest<Post[]>(`posts?${params}`);
  return post ?? null;
}

export const imageUrl = (path: string, width: number, ext: ImageRef["ext"] = "webp") =>
  `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}/${width}.${ext}`;

/** Attributs src/srcSet/sizes pour une image stockée en plusieurs largeurs. */
export function imageProps(image: ImageRef, sizes: string) {
  const widths = [...image.widths].sort((a, b) => a - b);
  const fallback = widths.find((w) => w >= 960) ?? widths[widths.length - 1];
  return {
    src: imageUrl(image.path, fallback, image.ext),
    srcSet: widths.map((w) => `${imageUrl(image.path, w, image.ext)} ${w}w`).join(", "),
    sizes,
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
}

export const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
