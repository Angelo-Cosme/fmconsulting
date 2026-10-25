import { useEffect, useState } from "react";
import { Link } from "react-router";
import { pages, type PageId } from "@/content/pages";
import { supabase } from "./supabase";

export const EDITABLE_PAGES: PageId[] = ["home", "about", "services", "media", "news", "contact"];

type Stats = { published: number; drafts: number; unread: number; edited: Record<string, string> };

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("posts").select("status"),
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
      supabase.from("site_content").select("page,updated_at"),
    ]).then(([posts, messages, content]) => {
      const rows = (posts.data ?? []) as { status: string }[];
      setStats({
        published: rows.filter((p) => p.status === "published").length,
        drafts: rows.filter((p) => p.status === "draft").length,
        unread: messages.count ?? 0,
        edited: Object.fromEntries(((content.data ?? []) as { page: string; updated_at: string }[]).map((r) => [r.page, r.updated_at])),
      });
    });
  }, []);

  return (
    <>
      <h1 className="text-3xl font-semibold">Tableau de bord</h1>
      <p className="mt-1 text-sm text-muted">Gérez ici tout le contenu du site : textes, images, vidéos, articles et messages.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard to="/admin/posts" label="Articles publiés" value={stats?.published} detail={stats ? `${stats.drafts} brouillon${stats.drafts > 1 ? "s" : ""}` : ""} />
        <StatCard to="/admin/messages" label="Messages non lus" value={stats?.unread} detail="Formulaire de contact" highlight={Boolean(stats?.unread)} />
        <StatCard to="/admin/posts/new" label="Nouvel article" value="+" detail="Publier une activité" />
      </div>

      <h2 className="mt-12 text-xl font-semibold">Pages du site</h2>
      <p className="mt-1 text-sm text-muted">Chaque page est découpée en sections : ouvrez-en une, modifiez les champs, puis cliquez sur « Enregistrer et publier ».</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...EDITABLE_PAGES, "settings" as PageId].map((id) => {
          const page = pages[id];
          const edited = stats?.edited[id];
          return (
            <Link key={id} to={id === "settings" ? "/admin/settings" : `/admin/pages/${id}`} className="card group flex flex-col p-6 transition-colors hover:border-brand-600/50">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold group-hover:text-brand-600">{page.title}</h3>
                <span className="shrink-0 rounded-full bg-mist px-2.5 py-1 text-xs text-muted">{Object.keys(page.sections).length} sections</span>
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{page.help}</p>
              <p className="mt-5 text-xs text-muted">
                {edited ? `Modifiée le ${new Date(edited).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}` : "Contenu par défaut"}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        <Guide title="Mettre un mot en valeur">
          Dans les titres, entourez un mot d'astérisques : <code className="rounded bg-mist px-1">Nos *réalisations*</code> s'affiche « Nos <em className="font-serif">réalisations</em> ».
        </Guide>
        <Guide title="Images">
          Glissez une image dans un champ ou choisissez parmi les « Photos du cabinet ». Elles sont compressées automatiquement. Pensez à la description (accessibilité).
        </Guide>
        <Guide title="Vidéos">
          Trois possibilités : un fichier MP4 (50 Mo max, image d'aperçu générée automatiquement), un lien YouTube (idéal pour les longues vidéos) ou une des « Vidéos du cabinet ».
        </Guide>
      </div>
    </>
  );
}

function StatCard({ to, label, value, detail, highlight = false }: { to: string; label: string; value: number | string | undefined; detail: string; highlight?: boolean }) {
  return (
    <Link to={to} className={`card p-6 transition-colors hover:border-brand-600/50 ${highlight ? "border-brand-600/40 bg-brand-50" : ""}`}>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-4xl font-bold tracking-tight">{value ?? "…"}</p>
      <p className="mt-1 text-xs text-muted">{detail}</p>
    </Link>
  );
}

function Guide({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-line">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}
