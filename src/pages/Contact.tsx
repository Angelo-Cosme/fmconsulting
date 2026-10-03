import { useState } from "react";
import { Arrow, Check, PageHeader } from "@/components/ui";

type FormState = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

const emptyForm: FormState = { name: "", email: "", company: "", subject: "", message: "" };

const infos = [
  { label: "Adresse", value: "123 Lorem Ipsum Avenue\nBP1203 Dolor Sit, Bénin" },
  { label: "Téléphone", value: "+229 (0)1 23 45 67 89", href: "tel:+2290123456789" },
  { label: "Email", value: "contact@fmconsultingplus.com", href: "mailto:contact@fmconsultingplus.com" },
  { label: "Horaires", value: "Lorem – Ipsum\n9h00 – 18h30" },
];

export function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Contactez-<span className="accent">nous</span>
          </>
        }
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />

      <section className="container-site py-16 md:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Info */}
          <aside className="lg:col-span-4">
            <dl className="divide-y divide-line border-y border-line">
              {infos.map((info) => (
                <div key={info.label} className="py-6">
                  <dt className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">{info.label}</dt>
                  <dd className="mt-2 whitespace-pre-line text-ink-soft">
                    {info.href ? (
                      <a href={info.href} className="transition-colors hover:text-brand-600">
                        {info.value}
                      </a>
                    ) : (
                      info.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>

          {/* Form */}
          <div className="card p-6 md:p-10 lg:col-span-8">
            {submitted ? (
              <div className="py-12 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 [&_svg]:h-6 [&_svg]:w-6">
                  <Check />
                </span>
                <h2 className="mt-6 text-2xl font-semibold">Message envoyé</h2>
                <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm(emptyForm);
                  }}
                  className="btn btn-outline mt-8"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold">Écrivez-nous</h2>
                <p className="mt-2 text-sm text-muted">Nous vous répondons sous 48 heures ouvrées.</p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="field-label">Nom complet *</label>
                    <input id="name" type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Lorem Ipsum" className="field" />
                  </div>
                  <div>
                    <label htmlFor="email" className="field-label">Adresse email *</label>
                    <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="lorem@ipsum.fr" className="field" />
                  </div>
                  <div>
                    <label htmlFor="company" className="field-label">Entreprise</label>
                    <input id="company" type="text" name="company" value={form.company} onChange={handleChange} placeholder="Lorem Ipsum SAS" className="field" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="field-label">Sujet *</label>
                    <div className="relative">
                      <select id="subject" name="subject" value={form.subject} onChange={handleChange} required className="field appearance-none pr-10">
                        <option value="">Choisir un sujet</option>
                        <option value="s1">Lorem ipsum dolor sit</option>
                        <option value="s2">Consectetur adipiscing elit</option>
                        <option value="s3">Sed do eiusmod tempor</option>
                        <option value="s4">Ut enim ad minim veniam</option>
                        <option value="s5">Quis nostrud exercitation</option>
                        <option value="autre">Autre demande</option>
                      </select>
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-muted">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="field-label">Message *</label>
                    <textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={6} placeholder="Décrivez votre projet en quelques lignes…" className="field resize-y" />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-muted">* Champs obligatoires</p>
                  <button type="submit" className="btn btn-primary">
                    Envoyer le message <Arrow />
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
