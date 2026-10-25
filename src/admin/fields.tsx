import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Field, Link } from "@/content/schema";
import { pages } from "@/content/pages";
import type { VideoRef } from "@/content/media";
import { imageSrc, type ImageRef } from "@/lib/news";
import { parseYouTubeId } from "@/lib/youtube";
import { VideoPlayer } from "@/components/news";
import { Icon } from "@/components/icons";
import { MAX_VIDEO_BYTES, uploadImage, uploadVideo } from "./supabase";

// ─── Valeurs ─────────────────────────────────────────────────────────────────

export function emptyValue(field: Field): unknown {
  switch (field.type) {
    case "text":
    case "textarea":
      return "";
    case "image":
    case "video":
      return null;
    case "link":
      return { label: "", href: "" };
    case "select":
      return field.options[0]?.value ?? "";
    case "list":
      return [];
  }
}

const emptyItem = (fields: Field[]) => Object.fromEntries(fields.map((f) => [f.key, emptyValue(f)]));

// Photos et vidéos fournies avec le site, proposées dans les sélecteurs.
const LIBRARY_PHOTOS = pages.media.sections.photos.defaults.items;
const LIBRARY_VIDEOS = pages.media.sections.videos.defaults.items;

export const SITE_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/cabinet", label: "Le cabinet" },
  { href: "/expertises", label: "Expertises" },
  { href: "/mediatheque", label: "Médiathèque" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

// ─── Champ générique ─────────────────────────────────────────────────────────

export function FieldInput({ field, value, onChange, idPrefix }: { field: Field; value: unknown; onChange: (v: unknown) => void; idPrefix: string }) {
  const id = `${idPrefix}-${field.key}`;
  const label = (
    <div className="mb-2">
      <label htmlFor={field.type === "list" || field.type === "image" || field.type === "video" ? undefined : id} className="block text-sm font-semibold text-ink">
        {field.label}
      </label>
      {field.help && <p className="mt-0.5 text-xs leading-relaxed text-muted">{field.help}</p>}
    </div>
  );

  switch (field.type) {
    case "text":
      return (
        <div>
          {label}
          <input id={id} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className="field" />
        </div>
      );
    case "textarea":
      return (
        <div>
          {label}
          <textarea
            id={id}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={field.rows ?? 4}
            className="field min-h-24 resize-y leading-relaxed [field-sizing:content]"
          />
        </div>
      );
    case "link":
      return (
        <div>
          {label}
          <LinkInput id={id} value={(value as Link) ?? { label: "", href: "" }} onChange={onChange} />
        </div>
      );
    case "select":
      return (
        <div>
          {label}
          <SelectInput id={id} field={field} value={(value as string) ?? ""} onChange={onChange} />
        </div>
      );
    case "image":
      return (
        <div>
          {label}
          <ImageInput value={(value as ImageRef | null) ?? null} onChange={onChange} />
        </div>
      );
    case "video":
      return (
        <div>
          {label}
          <VideoInput value={(value as VideoRef | null) ?? null} onChange={onChange} />
        </div>
      );
    case "list":
      return (
        <div>
          {label}
          <ListInput field={field} value={(value as Record<string, unknown>[]) ?? []} onChange={onChange} idPrefix={id} />
        </div>
      );
  }
}

/** Champs d'un objet (section ou élément de liste). */
export function FieldGroup({ fields, value, onChange, idPrefix }: { fields: Field[]; value: Record<string, unknown>; onChange: (v: Record<string, unknown>) => void; idPrefix: string }) {
  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <FieldInput key={field.key} field={field} idPrefix={idPrefix} value={value[field.key]} onChange={(v) => onChange({ ...value, [field.key]: v })} />
      ))}
    </div>
  );
}

// ─── Lien / bouton ───────────────────────────────────────────────────────────

function LinkInput({ id, value, onChange }: { id: string; value: Link; onChange: (v: Link) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <span className="mb-1 block text-xs text-muted">Texte affiché</span>
        <input id={id} value={value.label} onChange={(e) => onChange({ ...value, label: e.target.value })} placeholder="Ex. En savoir plus" className="field" />
      </div>
      <div>
        <span className="mb-1 block text-xs text-muted">Destination</span>
        <input
          value={value.href}
          onChange={(e) => onChange({ ...value, href: e.target.value })}
          list="admin-site-links"
          placeholder="/contact ou https://…"
          className="field font-mono text-xs"
        />
        <datalist id="admin-site-links">
          {SITE_LINKS.map((l) => (
            <option key={l.href} value={l.href}>
              {l.label}
            </option>
          ))}
        </datalist>
      </div>
      <p className="text-xs text-muted sm:col-span-2">Laissez le texte vide pour masquer le bouton. Page du site : /contact, /expertises… ; site externe : https://…</p>
    </div>
  );
}

// ─── Listes de choix ─────────────────────────────────────────────────────────

const TONE_SWATCH: Record<string, string> = { clay: "bg-clay", brand: "bg-brand-600", mist: "bg-mist border border-line" };

function SelectInput({ id, field, value, onChange }: { id: string; field: Extract<Field, { type: "select" }>; value: string; onChange: (v: string) => void }) {
  if (field.key === "icon") {
    return (
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={field.label}>
        {field.options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            title={o.label}
            onClick={() => onChange(o.value)}
            className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border transition-colors ${
              value === o.value ? "border-brand-600 bg-brand-50 text-brand-600" : "border-line text-ink-soft hover:border-ink"
            }`}
          >
            <Icon name={o.value} className="h-5 w-5" />
          </button>
        ))}
      </div>
    );
  }
  if (field.key === "tone") {
    return (
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={field.label}>
        {field.options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={`flex cursor-pointer items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-sm transition-colors ${
              value === o.value ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
            }`}
          >
            <span className={`h-6 w-6 rounded-full ${TONE_SWATCH[o.value] ?? "bg-mist"}`} />
            {o.label}
          </button>
        ))}
      </div>
    );
  }
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field">
      {field.options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ─── Image ───────────────────────────────────────────────────────────────────

export function ImageInput({ value, onChange, compact = false }: { value: ImageRef | null; onChange: (v: ImageRef | null) => void; compact?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file, value?.alt ?? ""));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const actions = (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      <button type="button" disabled={busy} onClick={() => input.current?.click()} className="cursor-pointer font-medium text-brand-600 hover:underline">
        {busy ? "Compression et envoi…" : value ? "Remplacer" : "Envoyer une image"}
      </button>
      <button type="button" onClick={() => setPicker(true)} className="cursor-pointer font-medium text-brand-600 hover:underline">
        Photos du cabinet
      </button>
      {value && (
        <button type="button" onClick={() => onChange(null)} className="cursor-pointer text-red-600 hover:underline">
          Retirer
        </button>
      )}
    </div>
  );

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        pick(e.dataTransfer.files[0]);
      }}
    >
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      {value ? (
        <div className={`flex gap-4 ${compact ? "items-center" : "flex-col sm:flex-row"}`}>
          <img
            src={imageSrc(value, 640)}
            alt=""
            className={`shrink-0 rounded-xl border border-line bg-mist object-cover ${compact ? "h-20 w-20" : "aspect-[4/3] w-full sm:w-56"}`}
          />
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <span className="mb-1 block text-xs text-muted">Description de l'image (accessibilité et référencement)</span>
              <input value={value.alt} onChange={(e) => onChange({ ...value, alt: e.target.value })} placeholder="Que montre cette image ?" className="field" />
            </div>
            {actions}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-canvas px-4 py-8 text-center">
          <p className="text-sm text-muted">Glissez une image ici, ou :</p>
          {actions}
          <p className="text-xs text-muted">Compressée automatiquement (WebP)</p>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {picker && (
        <Modal title="Photos du cabinet" onClose={() => setPicker(false)}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {LIBRARY_PHOTOS.map((p) =>
              p.image ? (
                <button
                  key={p.image.url}
                  type="button"
                  onClick={() => {
                    onChange({ ...p.image!, alt: p.caption });
                    setPicker(false);
                  }}
                  className="group cursor-pointer text-left"
                >
                  <img src={imageSrc(p.image, 640)} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover ring-brand-600 group-hover:ring-2" />
                  <span className="mt-1 line-clamp-2 block text-xs text-muted">{p.caption}</span>
                </button>
              ) : null,
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Vidéo ───────────────────────────────────────────────────────────────────

export function VideoInput({ value, onChange }: { value: VideoRef | null; onChange: (v: VideoRef | null) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const youTube = value?.src && /youtu/i.test(value.src) ? parseYouTubeId(value.src) : null;

  async function pick(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_VIDEO_BYTES) {
      setError(`Vidéo trop lourde (${Math.round(file.size / 1024 / 1024)} Mo, 50 Mo maximum) : compressez-la ou publiez-la sur YouTube puis collez le lien.`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      onChange(await uploadVideo(file));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  function askYouTube() {
    const url = window.prompt("Lien de la vidéo YouTube (youtube.com/watch?v=…, youtu.be/…, shorts…)", youTube ? value!.src : "");
    if (!url) return;
    const id = parseYouTubeId(url);
    if (!id) return setError("Lien YouTube non reconnu.");
    setError("");
    onChange({ src: `https://www.youtube.com/watch?v=${id}` });
  }

  const source = !value ? "" : youTube ? "Vidéo YouTube" : value.path ? "Fichier envoyé depuis le dashboard" : "Vidéo fournie avec le site";

  return (
    <div>
      <input ref={input} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      <div className={`flex gap-4 ${value ? "flex-col sm:flex-row" : ""}`}>
        {value && (
          <div className={youTube ? "w-full sm:w-72" : "w-32 shrink-0"}>
            <VideoPlayer video={value} title="Aperçu" className={youTube ? "aspect-video" : "aspect-[9/16]"} />
          </div>
        )}
        <div className={`min-w-0 flex-1 space-y-3 ${value ? "" : "rounded-xl border border-dashed border-line bg-canvas px-4 py-6"}`}>
          {value ? <p className="text-xs text-muted">{source}</p> : <p className="text-sm text-muted">Aucune vidéo.</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <button type="button" disabled={busy} onClick={() => input.current?.click()} className="cursor-pointer font-medium text-brand-600 hover:underline">
              {busy ? "Envoi en cours, patientez…" : "Envoyer un fichier (MP4, 50 Mo max)"}
            </button>
            <button type="button" onClick={askYouTube} className="cursor-pointer font-medium text-brand-600 hover:underline">
              Lien YouTube
            </button>
            <button type="button" onClick={() => setPicker(true)} className="cursor-pointer font-medium text-brand-600 hover:underline">
              Vidéos du cabinet
            </button>
            {value && (
              <button type="button" onClick={() => onChange(null)} className="cursor-pointer text-red-600 hover:underline">
                Retirer
              </button>
            )}
          </div>
          {value && !youTube && (
            <div className="pt-2">
              <span className="mb-2 block text-xs text-muted">Image d'aperçu (affichée avant la lecture)</span>
              <ImageInput compact value={value.poster ?? null} onChange={(poster) => onChange({ ...value, poster })} />
            </div>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {picker && (
        <Modal title="Vidéos du cabinet" onClose={() => setPicker(false)}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {LIBRARY_VIDEOS.map((v) =>
              v.video ? (
                <button
                  key={v.video.src}
                  type="button"
                  onClick={() => {
                    onChange(v.video);
                    setPicker(false);
                  }}
                  className="group cursor-pointer text-left"
                >
                  {v.video.poster && <img src={imageSrc(v.video.poster, 640)} alt="" loading="lazy" className="aspect-[9/16] w-full rounded-lg object-cover ring-brand-600 group-hover:ring-2" />}
                  <span className="mt-1 line-clamp-2 block text-xs text-muted">{v.title}</span>
                </button>
              ) : null,
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Liste d'éléments ────────────────────────────────────────────────────────

let nextId = 0;
const newId = () => `item-${++nextId}`;

function ListInput({ field, value, onChange, idPrefix }: { field: Extract<Field, { type: "list" }>; value: Record<string, unknown>[]; onChange: (v: unknown) => void; idPrefix: string }) {
  // Identifiants stables pour garder l'élément ouvert lors d'un déplacement.
  const [ids, setIds] = useState<string[]>(() => value.map(newId));
  const [open, setOpen] = useState<string | null>(null);
  const keys = ids.length === value.length ? ids : value.map((_, i) => ids[i] ?? newId());
  useEffect(() => {
    if (ids.length !== value.length) setIds(keys);
  });

  const update = (next: Record<string, unknown>[], nextIds: string[]) => {
    setIds(nextIds);
    onChange(next);
  };
  const move = (i: number, step: number) => {
    const j = i + step;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    const nextIds = [...keys];
    [next[i], next[j]] = [next[j], next[i]];
    [nextIds[i], nextIds[j]] = [nextIds[j], nextIds[i]];
    update(next, nextIds);
  };
  const remove = (i: number) => {
    if (!confirm(`Supprimer cet élément ?`)) return;
    update(
      value.filter((_, k) => k !== i),
      keys.filter((_, k) => k !== i),
    );
  };
  const add = () => {
    const id = newId();
    update([...value, emptyItem(field.fields)], [...keys, id]);
    setOpen(id);
  };
  const full = field.max !== undefined && value.length >= field.max;
  const imageKey = field.fields.find((f) => f.type === "image")?.key;
  const iconKey = field.fields.find((f) => f.type === "select" && f.key === "icon")?.key;

  return (
    <div className="space-y-2">
      {value.map((item, i) => {
        const key = keys[i];
        const isOpen = open === key;
        const summary = (field.summary && String(item[field.summary] ?? "").replace(/\*/g, "")) || `Élément ${i + 1}`;
        const thumb = imageKey ? (item[imageKey] as ImageRef | null) : null;
        return (
          <div key={key} className={`rounded-xl border transition-colors ${isOpen ? "border-brand-600/40 bg-white shadow-sm" : "border-line bg-canvas"}`}>
            <div className="flex items-center gap-2 p-2 pl-3">
              <button type="button" onClick={() => setOpen(isOpen ? null : key)} aria-expanded={isOpen} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left">
                <span className="w-6 shrink-0 text-xs font-semibold text-muted">{i + 1}.</span>
                {thumb ? (
                  <img src={imageSrc(thumb, 480)} alt="" className="h-9 w-12 shrink-0 rounded-md object-cover" />
                ) : iconKey ? (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                    <Icon name={String(item[iconKey])} className="h-4 w-4" />
                  </span>
                ) : null}
                <span className="truncate text-sm font-medium">{summary}</span>
              </button>
              <IconButton label="Monter" disabled={i === 0} onClick={() => move(i, -1)} d="M12 19V5M5 12l7-7 7 7" />
              <IconButton label="Descendre" disabled={i === value.length - 1} onClick={() => move(i, 1)} d="M12 5v14M19 12l-7 7-7-7" />
              <IconButton label="Supprimer" danger onClick={() => remove(i)} d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
              <IconButton label={isOpen ? "Replier" : "Modifier"} onClick={() => setOpen(isOpen ? null : key)} d={isOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
            </div>
            {isOpen && (
              <div className="border-t border-line p-4 md:p-5">
                <FieldGroup fields={field.fields} value={item} onChange={(v) => onChange(value.map((it, k) => (k === i ? v : it)))} idPrefix={`${idPrefix}-${key}`} />
              </div>
            )}
          </div>
        );
      })}
      {value.length === 0 && <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">Aucun élément.</p>}
      <button
        type="button"
        onClick={add}
        disabled={full}
        className="w-full cursor-pointer rounded-xl border border-dashed border-line px-4 py-3 text-sm font-medium text-brand-600 transition-colors hover:border-brand-600 hover:bg-brand-50 disabled:cursor-default disabled:text-muted disabled:hover:border-line disabled:hover:bg-transparent"
      >
        {full ? `Maximum atteint (${field.max})` : `+ Ajouter ${field.item}`}
      </button>
    </div>
  );
}

function IconButton({ label, d, onClick, disabled = false, danger = false }: { label: string; d: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:cursor-default disabled:opacity-25 ${
        danger ? "text-red-600 hover:bg-red-50" : "text-ink-soft hover:bg-mist"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
        <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ─── Fenêtre modale ──────────────────────────────────────────────────────────

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-mist hover:text-ink">
            Fermer ✕
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
