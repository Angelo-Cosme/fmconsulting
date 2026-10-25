import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useBlocker, useParams } from "react-router";
import { mergePage, pages, type PageId, type StoredPage } from "@/content/pages";
import type { PageDef, SectionDef } from "@/content/schema";
import { FieldGroup } from "./fields";
import { cleanupStorage, supabase } from "./supabase";

type SectionValue = Record<string, unknown>;

export default function PageEditor({ id: forcedId }: { id?: PageId }) {
  const params = useParams();
  const id = (forcedId ?? params.pageId) as PageId;
  const def = pages[id] as PageDef | undefined;
  if (!def) {
    return (
      <div className="card p-10 text-center">
        <p className="text-muted">Page inconnue.</p>
        <Link to="/admin" className="btn btn-outline mt-6">
          ← Tableau de bord
        </Link>
      </div>
    );
  }
  return <Editor key={id} id={id} def={def} />;
}

function Editor({ id, def }: { id: PageId; def: PageDef }) {
  // stored : ce qui est enregistré en base (sections modifiées uniquement) ; draft : version en cours d'édition.
  const [stored, setStored] = useState<StoredPage>({});
  const [draft, setDraft] = useState<StoredPage>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [open, setOpen] = useState<Set<string>>(() => new Set([Object.keys(def.sections)[0]]));
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const savedJson = useRef("{}");

  useEffect(() => {
    supabase
      .from("site_content")
      .select("data,updated_at")
      .eq("page", id)
      .maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error) return setMessage({ type: "error", text: error.message });
        const value = (data?.data ?? {}) as StoredPage;
        savedJson.current = JSON.stringify(value);
        setStored(value);
        setDraft(value);
        setUpdatedAt(data?.updated_at ?? null);
      });
  }, [id]);

  const merged = useMemo(() => mergePage(id, draft) as unknown as Record<string, SectionValue>, [id, draft]);
  const dirty = JSON.stringify(draft) !== savedJson.current;

  // Avertit avant de quitter la page avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname);
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (confirm("Des modifications ne sont pas enregistrées. Quitter quand même ?")) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  function updateSection(key: string, value: SectionValue) {
    setDraft((d) => ({ ...d, [key]: value }));
    setMessage(null);
  }

  function resetSection(key: string, label: string) {
    if (!confirm(`Rétablir le contenu par défaut de « ${label} » ? Vos modifications de cette section seront perdues après enregistrement.`)) return;
    setDraft((d) => {
      const next = { ...d };
      delete next[key];
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    const { data, error } = await supabase.from("site_content").upsert({ page: id, data: draft }).select("updated_at").single();
    setSaving(false);
    if (error) return setMessage({ type: "error", text: error.message });
    // Supprime du stockage les images et vidéos retirées depuis le dernier enregistrement.
    await cleanupStorage(stored, draft);
    savedJson.current = JSON.stringify(draft);
    setStored(draft);
    setUpdatedAt(data.updated_at);
    setMessage({ type: "ok", text: "Modifications enregistrées et publiées." });
  }

  const toggle = (key: string) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const sections = Object.entries(def.sections) as [string, SectionDef][];
  const allOpen = open.size === sections.length;

  if (loading) return <p className="text-sm text-muted">Chargement…</p>;

  return (
    <>
      {/* Barre d'enregistrement */}
      <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-line bg-canvas/90 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold md:text-3xl">{def.title}</h1>
            <p className="mt-1 text-sm text-muted">
              {dirty ? (
                <span className="font-medium text-amber-700">● Modifications non enregistrées</span>
              ) : updatedAt ? (
                `Dernier enregistrement : ${new Date(updatedAt).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}`
              ) : (
                "Contenu par défaut (jamais modifié)"
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {message && (
              <p role="status" className={`rounded-full px-4 py-2 text-sm ${message.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                {message.text}
              </p>
            )}
            {def.path && (
              <a href={def.path} target="_blank" rel="noreferrer" className="btn btn-outline !px-5 !py-2.5 text-sm">
                Voir la page ↗
              </a>
            )}
            {dirty && (
              <button type="button" onClick={() => setDraft(JSON.parse(savedJson.current))} className="btn !px-5 !py-2.5 text-sm text-muted hover:text-ink">
                Annuler
              </button>
            )}
            <button type="button" disabled={saving || !dirty} onClick={save} className="btn btn-primary !px-5 !py-2.5 text-sm">
              {saving ? "Enregistrement…" : "Enregistrer et publier"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-8 xl:grid-cols-[220px_minmax(0,1fr)]">
        {/* Sommaire des sections */}
        <nav className="hidden xl:sticky xl:top-44 xl:block" aria-label="Sections de la page">
          <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-muted uppercase">Sections</p>
          <ol className="space-y-1 text-sm">
            {sections.map(([key, s], i) => (
              <li key={key}>
                <a
                  href={`#section-${key}`}
                  onClick={() => setOpen((o) => new Set(o).add(key))}
                  className={`flex gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-white ${merged[key]?.visible === false ? "text-muted line-through" : "text-ink-soft"}`}
                >
                  <span className="w-5 shrink-0 text-muted">{i + 1}.</span>
                  <span>{s.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">{def.help}</p>
            <button type="button" onClick={() => setOpen(allOpen ? new Set() : new Set(sections.map(([k]) => k)))} className="cursor-pointer text-sm font-medium text-brand-600 hover:underline">
              {allOpen ? "Tout replier" : "Tout déplier"}
            </button>
          </div>

          {sections.map(([key, s], i) => {
            const value = merged[key];
            const isOpen = open.has(key);
            const customized = key in draft;
            return (
              <section key={key} id={`section-${key}`} className="card scroll-mt-48 overflow-hidden">
                <div className="flex items-center gap-3 p-4 md:px-6">
                  <button type="button" onClick={() => toggle(key)} aria-expanded={isOpen} className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 text-left">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-sm font-semibold text-ink-soft">{i + 1}</span>
                    <span className="min-w-0">
                      <span className={`block font-semibold ${value.visible === false ? "text-muted" : ""}`}>{s.label}</span>
                      {s.help && <span className="mt-0.5 block text-xs text-muted">{s.help}</span>}
                    </span>
                  </button>
                  {s.hideable && (
                    <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-muted" title="Afficher cette section sur le site">
                      <span className="hidden sm:inline">{value.visible === false ? "Masquée" : "Affichée"}</span>
                      <input
                        type="checkbox"
                        role="switch"
                        checked={value.visible !== false}
                        onChange={(e) => updateSection(key, { ...value, visible: e.target.checked })}
                        className="peer sr-only"
                      />
                      <span className="relative h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-600 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
                    </label>
                  )}
                  <button type="button" onClick={() => toggle(key)} aria-label={isOpen ? "Replier" : "Déplier"} className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink-soft hover:bg-mist">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                {isOpen && (
                  <div className="border-t border-line bg-canvas/50 p-4 md:p-6">
                    <FieldGroup fields={s.fields} value={value} onChange={(v) => updateSection(key, v)} idPrefix={`${id}-${key}`} />
                    {customized && (
                      <div className="mt-8 border-t border-line pt-4 text-right">
                        <button type="button" onClick={() => resetSection(key, s.label)} className="cursor-pointer text-xs text-muted hover:text-red-600">
                          Rétablir le contenu par défaut de cette section
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
