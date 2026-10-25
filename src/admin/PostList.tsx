import { useEffect, useState } from "react";
import { Link } from "react-router";
import { formatDate, type Post } from "@/lib/news";
import { PostImage } from "@/components/news";
import { cleanupStorage, supabase } from "./supabase";

type Row = Pick<Post, "id" | "slug" | "title" | "category" | "status" | "cover" | "content" | "published_at" | "updated_at">;

export default function PostList() {
  const [posts, setPosts] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("posts")
      .select("id,slug,title,category,status,cover,content,published_at,updated_at")
      .order("updated_at", { ascending: false });
    if (error) setError(error.message);
    else setPosts(data as Row[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(post: Row) {
    if (!confirm(`Supprimer définitivement « ${post.title} » ?`)) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) return alert(error.message);
    await cleanupStorage({ cover: post.cover, content: post.content }, null);
    setPosts((list) => list?.filter((p) => p.id !== post.id) ?? null);
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Articles (actualités)</h1>
          <p className="mt-1 text-sm text-muted">
            {posts ? `${posts.length} article${posts.length > 1 ? "s" : ""}` : "Chargement…"}
          </p>
        </div>
        <Link to="/admin/posts/new" className="btn btn-primary">
          + Nouvel article
        </Link>
      </div>

      {error && <p className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {posts && posts.length === 0 && (
        <div className="card mt-8 p-12 text-center text-muted">
          Aucun article pour l'instant. Créez le premier !
        </div>
      )}

      {posts && posts.length > 0 && (
        <ul className="card mt-8 divide-y divide-line overflow-hidden">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-canvas">
              <PostImage image={post.cover} sizes="96px" className="hidden h-14 w-20 shrink-0 rounded-lg sm:block" />
              <div className="min-w-0 flex-1">
                <Link to={`/admin/posts/${post.id}`} className="block truncate font-medium hover:text-brand-600">
                  {post.title}
                </Link>
                <p className="mt-1 text-xs text-muted">
                  {post.category} ·{" "}
                  {post.status === "published"
                    ? `Publié le ${formatDate(post.published_at)}`
                    : `Modifié le ${formatDate(post.updated_at)}`}
                </p>
              </div>
              <span
                className={`hidden rounded-full px-3 py-1 text-xs font-medium sm:inline ${
                  post.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {post.status === "published" ? "Publié" : "Brouillon"}
              </span>
              <div className="flex shrink-0 items-center gap-1 text-sm">
                {post.status === "published" && (
                  <Link to={`/actualites/${post.slug}`} target="_blank" className="rounded-lg px-3 py-2 text-muted hover:bg-mist hover:text-ink">
                    Voir
                  </Link>
                )}
                <Link to={`/admin/posts/${post.id}`} className="rounded-lg px-3 py-2 text-muted hover:bg-mist hover:text-ink">
                  Modifier
                </Link>
                <button onClick={() => remove(post)} className="cursor-pointer rounded-lg px-3 py-2 text-red-600 hover:bg-red-50">
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
