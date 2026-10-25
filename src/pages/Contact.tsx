import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { usePage } from "@/content/SiteContent";
import { sendMessage, type ContactMessage } from "@/lib/messages";
import { Check, PageHeader, PhoneIcon, phoneHref, SocialLinks } from "@/components/ui";

const emptyForm: ContactMessage = { name: "", email: "", phone: "", organization: "", subject: "", message: "" };

export function Contact() {
  const { header, form: content } = usePage("contact");
  const { contact } = usePage("settings");
  const [form, setForm] = useState<ContactMessage>(emptyForm);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Contact · FM Consulting";
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    // Champ invisible rempli : robot, on n'enregistre rien.
    if (honeypot) return setStatus("sent");
    setStatus("sending");
    try {
      await sendMessage(form);
      setStatus("sent");
    } catch (err) {
      setError((err as Error).message);
      setStatus("idle");
    }
  }

  const whatsapp = contact.whatsapp.replace(/[^\d]/g, "");

  return (
    <>
      <PageHeader eyebrow={header.eyebrow} title={header.title} text={header.text} />

      <section className="container-site pb-24 md:pb-32">
        <div className="grid items-start gap-6 lg:grid-cols-12">
          {/* Coordonnées */}
          <aside className="relative overflow-hidden rounded-[var(--radius-block)] bg-ink p-8 text-white md:p-10 lg:col-span-5">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-brand-600/50 blur-3xl" />
            <dl className="relative space-y-8">
              {contact.addresses.map((a) => (
                <div key={a.label + a.text}>
                  <dt className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">{a.label}</dt>
                  <dd className="mt-2 text-lg whitespace-pre-line">{a.text}</dd>
                </div>
              ))}
              {(contact.phone || contact.phone2) && (
                <div>
                  <dt className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Téléphone</dt>
                  <dd className="mt-2 space-y-1 text-lg">
                    {[contact.phone, contact.phone2].filter(Boolean).map((p) => (
                      <a key={p} href={phoneHref(p)} className="flex items-center gap-3 hover:text-sun">
                        <PhoneIcon className="h-4 w-4 text-white/60" /> {p}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
              {contact.email && (
                <div>
                  <dt className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Email</dt>
                  <dd className="mt-2 text-lg">
                    <a href={`mailto:${contact.email}`} className="break-all hover:text-sun">
                      {contact.email}
                    </a>
                  </dd>
                </div>
              )}
              {contact.hours && (
                <div>
                  <dt className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Horaires</dt>
                  <dd className="mt-2 text-lg whitespace-pre-line">{contact.hours}</dd>
                </div>
              )}
            </dl>
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-sun relative mt-10">
                Écrire sur WhatsApp
                <span className="dot" aria-hidden="true" />
              </a>
            )}
            <SocialLinks
              className="relative mt-10"
              itemClassName="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white"
            />
          </aside>

          {/* Formulaire */}
          <div className="rounded-[var(--radius-block)] border border-line p-6 md:p-10 lg:col-span-7">
            {status === "sent" ? (
              <div className="py-16 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sun text-ink [&_svg]:h-7 [&_svg]:w-7">
                  <Check />
                </span>
                <h2 className="mt-6 text-3xl">{content.successTitle}</h2>
                <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">{content.successText}</p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setForm(emptyForm);
                  }}
                  className="btn btn-outline mt-8"
                >
                  Envoyer un autre message
                  <span className="dot" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-3xl">{content.title}</h2>
                {content.text && <p className="mt-2 text-muted">{content.text}</p>}

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="field-label">Nom complet *</label>
                    <input id="name" name="name" autoComplete="name" value={form.name} onChange={handleChange} required maxLength={120} className="field" />
                  </div>
                  <div>
                    <label htmlFor="email" className="field-label">Adresse email *</label>
                    <input id="email" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} required maxLength={200} className="field" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="field-label">Téléphone</label>
                    <input id="phone" type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={handleChange} maxLength={40} className="field" />
                  </div>
                  <div>
                    <label htmlFor="organization" className="field-label">Organisation</label>
                    <input id="organization" name="organization" autoComplete="organization" value={form.organization} onChange={handleChange} maxLength={160} placeholder="Collectivité, institution, association…" className="field" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="subject" className="field-label">Sujet *</label>
                    <div className="relative">
                      <select id="subject" name="subject" value={form.subject} onChange={handleChange} required className="field appearance-none pr-10">
                        <option value="">Choisir un sujet</option>
                        {content.subjects.map((s) => (
                          <option key={s.label} value={s.label}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-muted">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="field-label">Message *</label>
                    <textarea id="message" name="message" value={form.message} onChange={handleChange} required maxLength={5000} rows={6} placeholder="Présentez votre projet en quelques lignes…" className="field resize-y" />
                  </div>
                  {/* Piège à robots : invisible pour les visiteurs */}
                  <div aria-hidden="true" className="absolute -left-[9999px]">
                    <label htmlFor="website">Ne pas remplir</label>
                    <input id="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </div>
                </div>

                {error && (
                  <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-muted">* Champs obligatoires</p>
                  <button type="submit" disabled={status === "sending"} className="btn btn-primary">
                    {status === "sending" ? "Envoi…" : "Envoyer le message"}
                    <span className="dot" aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
