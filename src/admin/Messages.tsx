import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};

const formatDateTime = (iso: string) => new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });

export default function Messages({ onUnreadChange }: { onUnreadChange?: () => void }) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setMessages(data as Message[]);
      });
  }, []);

  async function setRead(m: Message, read: boolean) {
    const { error } = await supabase.from("messages").update({ read }).eq("id", m.id);
    if (error) return alert(error.message);
    setMessages((list) => list?.map((x) => (x.id === m.id ? { ...x, read } : x)) ?? null);
    onUnreadChange?.();
  }

  async function remove(m: Message) {
    if (!confirm(`Supprimer définitivement le message de ${m.name} ?`)) return;
    const { error } = await supabase.from("messages").delete().eq("id", m.id);
    if (error) return alert(error.message);
    setMessages((list) => list?.filter((x) => x.id !== m.id) ?? null);
    onUnreadChange?.();
  }

  function toggle(m: Message) {
    const next = open === m.id ? null : m.id;
    setOpen(next);
    if (next && !m.read) setRead(m, true);
  }

  const unread = messages?.filter((m) => !m.read).length ?? 0;
  const shown = messages?.filter((m) => filter === "all" || !m.read) ?? [];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Messages</h1>
          <p className="mt-1 text-sm text-muted">
            {messages ? `${messages.length} message${messages.length > 1 ? "s" : ""} reçu${messages.length > 1 ? "s" : ""} via le formulaire de contact · ${unread} non lu${unread > 1 ? "s" : ""}` : "Chargement…"}
          </p>
        </div>
        <div className="flex rounded-full bg-mist p-1 text-sm">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-full px-4 py-1.5 ${filter === f ? "bg-white font-medium shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {f === "all" ? "Tous" : "Non lus"}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {messages && shown.length === 0 && (
        <div className="card mt-8 p-12 text-center text-muted">{filter === "unread" ? "Aucun message non lu." : "Aucun message pour l'instant."}</div>
      )}

      {shown.length > 0 && (
        <ul className="card mt-8 divide-y divide-line overflow-hidden">
          {shown.map((m) => {
            const isOpen = open === m.id;
            return (
              <li key={m.id} className={isOpen ? "bg-canvas" : ""}>
                <button type="button" onClick={() => toggle(m)} aria-expanded={isOpen} className="flex w-full cursor-pointer items-start gap-4 p-4 text-left transition-colors hover:bg-canvas md:px-6">
                  <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-brand-600"}`} aria-label={m.read ? undefined : "Non lu"} />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className={`truncate ${m.read ? "" : "font-semibold"}`}>
                        {m.name}
                        {m.organization && <span className="font-normal text-muted"> · {m.organization}</span>}
                      </span>
                      <span className="shrink-0 text-xs text-muted">{formatDateTime(m.created_at)}</span>
                    </span>
                    <span className="mt-1 block truncate text-sm text-muted">
                      {m.subject && <span className="font-medium text-ink-soft">{m.subject} — </span>}
                      {m.message}
                    </span>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-6 md:px-6 md:pl-[3.4rem]">
                    <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                      <dt className="text-muted">Email</dt>
                      <dd>
                        <a href={`mailto:${m.email}`} className="text-brand-600 hover:underline">
                          {m.email}
                        </a>
                      </dd>
                      {m.phone && (
                        <>
                          <dt className="text-muted">Téléphone</dt>
                          <dd>
                            <a href={`tel:${m.phone.replace(/[^\d+]/g, "")}`} className="text-brand-600 hover:underline">
                              {m.phone}
                            </a>
                          </dd>
                        </>
                      )}
                      {m.subject && (
                        <>
                          <dt className="text-muted">Sujet</dt>
                          <dd>{m.subject}</dd>
                        </>
                      )}
                    </dl>
                    <p className="mt-5 rounded-xl border border-line bg-white p-5 leading-relaxed whitespace-pre-line">{m.message}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Votre message"}`)}`} className="btn btn-primary !px-5 !py-2 text-sm">
                        Répondre par email
                      </a>
                      <button type="button" onClick={() => setRead(m, !m.read)} className="btn btn-outline !px-5 !py-2 text-sm">
                        Marquer comme {m.read ? "non lu" : "lu"}
                      </button>
                      <button type="button" onClick={() => remove(m)} className="cursor-pointer rounded-full px-4 py-2 text-red-600 hover:bg-red-50">
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
