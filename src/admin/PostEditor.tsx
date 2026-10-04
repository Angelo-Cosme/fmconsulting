import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { CATEGORIES, type ImageRef, type Post, type RichDoc, imageUrl } from "@/lib/news";
import { deleteImages, supabase, uploadImage } from "./supabase";
import { emptyDoc, isEmptyDoc, postImages, slugify } from "./content";
import RichEditor from "./RichEditor";

type Form = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author_name: string;
  cover: ImageRef | null;
  status: "draft" | "published";
};

const emptyForm: Form = { title: "", slug: "", excerpt: "", category: CATEGORIES[0], author_name: "", cover: null, status: "draft" };

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(emptyForm);
  const [content, setContent] = useState<RichDoc>(emptyDoc);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const saved = useRef<Pick<Post, "cover" | "content"> | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) return setMessage({ type: "error", text: error?.message ?? "Article introuvable" });
        const post = data as Post;
        saved.current = { cover: post.cover, content: post.content };
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: post.category,
          author_name: post.author_name,
          cover: post.cover,
          status: post.status,
        });
        setContent(post.content);
        setSlugTouched(true);
      });
  }, [id]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(patch: Partial<Form>) {
    setForm((f) => {
      const next = { ...f, ...patch };
      if (patch.title !== undefined && !slugTouched) next.slug = slugify(patch.title);
      return next;
    });
    setDirty(true);
  }

  async function save(status: Form["status"] = form.status) {
    if (!form.title.trim()) return setMessage({ type: "error", text: "Le titre est obligatoire." });
    const slug = slugify(form.slug || form.title);
    if (status === "published" && isEmptyDoc(content)) {
      return setMessage({ type: "error", text: "Le contenu de l'article est vide." });
    }
    const payload = { ...form, slug, status, content };

    setSaving(true);
    setMessage(null);
    const query = id
      ? supabase.from("posts").update(payload).eq("id", id).select("id").single()
      : supabase.from("posts").insert(payload).select("id").single();
    const { data, error } = await query;
    setSaving(false);

    if (error) {
      const text = error.code === "23505" ? "Ce slug est déjà utilisé par un autre article." : error.message;
      return setMessage({ type: "error", text });
    }

    // Supprime du stockage les images retirées de l'article depuis le dernier enregistrement.
    if (saved.current) {
      const kept = new Set(postImages(payload).map((img) => img.path));
      await deleteImages(postImages(saved.current).filter((img) => !kept.has(img.path)));
    }
    saved.current = { cover: payload.cover, content: payload.content };

    setForm((f) => ({ ...f, slug, status }));
    setDirty(false);
    setMessage({ type: "ok", text: status === "published" ? "Article publié." : "Brouillon enregistré." });
    if (!id && data) navigate(`/admin/posts/${data.id}`, { replace: true });
  }

  if (loading) return <p className="text-sm text-muted">Chargement…</p>;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link to="/admin" className="text-sm text-muted hover:text-ink">
          ← Tous les articles
        </Link>
        {message && (
          <p role="status" className={`rounded-full px-4 py-2 text-sm ${message.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </p>
        )}
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        {/* Contenu */}
        <div className="space-y-6">
          <div className="card p-6 md:p-8">
            <input
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Titre de l'article"
              aria-label="Titre"
              className="w-full font-display text-3xl font-semibold tracking-tight outline-none placeholder:text-muted/40 md:text-4xl"
            />
            <textarea
              value={form.excerpt}
              onChange={(e) => update({ excerpt: e.target.value })}
              placeholder="Chapô : résumé affiché dans la liste des actualités et en tête d'article"
              aria-label="Chapô"
              rows={2}
              maxLength={600}
              className="mt-4 w-full resize-none text-lg leading-relaxed text-ink-soft outline-none [field-sizing:content] placeholder:text-muted/50"
            />
          </div>

          <RichEditor
            initial={content}
            onChange={(doc) => {
              setContent(doc);
              setDirty(true);
            }}
          />
        </div>

        {/* Réglages */}
        <aside className="space-y-6 lg:sticky lg:top-24">
          <div className="card space-y-3 p-6">
            <p className="text-sm">
              Statut :{" "}
              <span className={form.status === "published" ? "font-medium text-emerald-700" : "font-medium text-amber-700"}>
                {form.status === "published" ? "Publié" : "Brouillon"}
              </span>
              {dirty && <span className="text-muted"> · modifications non enregistrées</span>}
            </p>
            {form.status === "published" ? (
              <>
                <button disabled={saving} onClick={() => save("published")} className="btn btn-primary w-full disabled:opacity-60">
                  {saving ? "Enregistrement…" : "Mettre à jour"}
                </button>
                <button disabled={saving} onClick={() => save("draft")} className="btn btn-outline w-full">
                  Repasser en brouillon
                </button>
                <Link to={`/news/${form.slug}`} target="_blank" className="block text-center text-sm text-muted hover:text-ink">
                  Voir l'article ↗
                </Link>
              </>
            ) : (
              <>
                <button disabled={saving} onClick={() => save("published")} className="btn btn-primary w-full disabled:opacity-60">
                  {saving ? "Enregistrement…" : "Publier"}
                </button>
                <button disabled={saving} onClick={() => save("draft")} className="btn btn-outline w-full">
                  Enregistrer le brouillon
                </button>
              </>
            )}
          </div>

          <div className="card space-y-5 p-6">
            <div>
              <span className="field-label">Image de couverture</span>
              <ImageField image={form.cover} onChange={(cover) => update({ cover })} />
            </div>
            <div>
              <label htmlFor="category" className="field-label">Catégorie</label>
              <select id="category" value={form.category} onChange={(e) => update({ category: e.target.value })} className="field">
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="author" className="field-label">Auteur</label>
              <input id="author" value={form.author_name} onChange={(e) => update({ author_name: e.target.value })} placeholder="Prénom Nom" className="field" />
            </div>
            <div>
              <label htmlFor="slug" className="field-label">Adresse (slug)</label>
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") });
                }}
                className="field font-mono text-xs"
              />
              <p className="mt-1 truncate text-xs text-muted">/news/{form.slug || "…"}</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function ImageField({ image, onChange, wide = false }: { image: ImageRef | null; onChange: (image: ImageRef | null) => void; wide?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file, image?.alt ?? ""));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      {image ? (
        <div className="space-y-2">
          <img src={imageUrl(image.path, image.widths[Math.min(1, image.widths.length - 1)], image.ext)} alt={image.alt} className={`w-full rounded-xl bg-mist object-cover ${wide ? "max-h-96" : "aspect-[4/3]"}`} />
          <input value={image.alt} onChange={(e) => onChange({ ...image, alt: e.target.value })} placeholder="Texte alternatif (description de l'image)" aria-label="Texte alternatif" className="field" />
          <div className="flex gap-3 text-sm">
            <button type="button" disabled={busy} onClick={() => input.current?.click()} className="cursor-pointer text-brand-600 hover:underline">
              {busy ? "Envoi…" : "Remplacer"}
            </button>
            <button type="button" onClick={() => onChange(null)} className="cursor-pointer text-red-600 hover:underline">
              Retirer
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => input.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            pick(e.dataTransfer.files[0]);
          }}
          className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-canvas text-sm text-muted hover:border-ink hover:text-ink ${wide ? "py-12" : "aspect-[4/3]"}`}
        >
          {busy ? "Compression et envoi…" : "Choisir ou déposer une image"}
          {!busy && <span className="mt-1 text-xs">Compressée automatiquement</span>}
        </button>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
