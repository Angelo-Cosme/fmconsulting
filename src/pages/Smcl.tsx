import { useEffect } from "react";
import { usePage } from "@/content/SiteContent";
import type { PageContent } from "@/content/pages";
import { VideoPlayer } from "@/components/news";
import { Icon } from "@/components/icons";
import { Button, Check, Eyebrow, Paragraphs, Reveal, Rich, SectionTitle } from "@/components/ui";

type Smcl = PageContent<"smcl">;

const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function Smcl() {
  const page = usePage("smcl");

  useEffect(() => {
    document.title = "Mission SMCL Paris 2026 · FM Consulting";
  }, []);

  return (
    <>
      <Header data={page.header} />
      {page.why.visible && <Why data={page.why} />}
      {page.ambition.visible && <Ambition data={page.ambition} />}
      {page.salon.visible && <Salon data={page.salon} />}
      {page.tripartite.visible && <Tripartite data={page.tripartite} />}
      {page.pillars.visible && <Pillars data={page.pillars} />}
      {page.timeline.visible && <Timeline data={page.timeline} />}
      {page.recommendations.visible && <Recommendations data={page.recommendations} />}
      <Join data={page.join} />
    </>
  );
}

/** Nombre de jours avant la date (AAAA-MM-JJ), ou null si elle est passée ou invalide. */
function daysUntil(date: string) {
  const target = new Date(`${date}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const days = Math.ceil((target.getTime() - Date.now()) / 86_400_000);
  return days > 0 ? days : null;
}

// ─── En-tête ─────────────────────────────────────────────────────────────────
function Header({ data }: { data: Smcl["header"] }) {
  const days = data.countdown ? daysUntil(data.countdown) : null;
  return (
    <section className="block-wide relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-brand-600/30 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full bg-clay/20 blur-3xl" />
      <div className="container-site relative grid items-center gap-12 pt-16 pb-20 md:pt-24 md:pb-28 lg:grid-cols-12 lg:gap-16">
        <div className="fade-up lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sun" />
              </span>
              {data.eyebrow}
            </span>
            {days !== null && <span className="rounded-full bg-sun px-4 py-2 font-display text-sm font-extrabold text-ink">J-{days}</span>}
          </div>
          <h1 className="mt-6 text-5xl leading-[1.02] text-white md:text-7xl">
            <Rich text={data.title} />
          </h1>
          {data.text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">{data.text}</p>}
          {data.facts.length > 0 && (
            <dl className="mt-10 grid gap-6 border-t border-white/15 pt-8 sm:grid-cols-3">
              {data.facts.map((f, i) => (
                <div key={i}>
                  <dt className="text-xs font-semibold tracking-wider text-white/55 uppercase">{f.label}</dt>
                  <dd className="mt-2 leading-snug font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-10 flex flex-wrap gap-4">
            <Button link={data.cta} variant="sun" />
            <Button link={data.secondary} variant="light" />
          </div>
        </div>
        {data.video && (
          <div className="fade-up fade-up-delay mx-auto w-full max-w-[340px] lg:col-span-5">
            <VideoPlayer video={data.video} title={data.title.replace(/\*/g, "")} className="aspect-[9/16]" />
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Pourquoi aujourd'hui ────────────────────────────────────────────────────
function Why({ data }: { data: Smcl["why"] }) {
  return (
    <section className="container-site py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <SectionTitle eyebrow={data.eyebrow} title={data.title} className="lg:col-span-5" />
        <Reveal delay={120} className="lg:col-span-7">
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
            <Paragraphs text={data.text} />
          </div>
          {data.quote && (
            <figure className="mt-10 rounded-2xl border-l-4 border-clay bg-mist p-8">
              <p className="text-xs font-semibold tracking-wider text-clay uppercase">Notre engagement</p>
              <blockquote className="mt-3 font-display text-xl leading-snug font-semibold text-ink">« {data.quote} »</blockquote>
              {data.quoteAuthor && <figcaption className="mt-4 text-sm text-muted">{data.quoteAuthor}</figcaption>}
            </figure>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// ─── Ce que nous allons construire ───────────────────────────────────────────
function Ambition({ data }: { data: Smcl["ambition"] }) {
  return (
    <section className="block-wide bg-mist py-24 md:py-32">
      <div className="container-site">
        <SectionTitle eyebrow={data.eyebrow} title={data.title} center />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {data.items.map((item, i) => (
            <Reveal key={i} delay={i * 120} className="flex flex-col rounded-2xl bg-white p-8 md:p-10">
              <div className="flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Icon name={item.icon} className="h-7 w-7" />
                </span>
                <span className="font-display text-5xl font-extrabold tracking-tighter text-brand-600/15">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-8 text-2xl">{item.title}</h3>
              <p className="mt-4 leading-relaxed text-ink-soft">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Au salon ────────────────────────────────────────────────────────────────
function Salon({ data }: { data: Smcl["salon"] }) {
  const column = (heading: string, items: { title: string; text: string }[], accent: string) => (
    <Reveal className={`rounded-[var(--radius-block)] border-t-4 bg-white p-8 ring-1 ring-line md:p-10 ${accent}`}>
      <h3 className="text-2xl">{heading}</h3>
      <ul className="mt-8 space-y-6">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sun text-ink">
              <Check />
            </span>
            <div>
              <p className="font-semibold text-ink">{item.title}</p>
              <p className="mt-1 leading-relaxed text-ink-soft">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Reveal>
  );

  return (
    <section className="container-site py-24 md:py-32">
      <SectionTitle eyebrow={data.eyebrow} title={data.title}>
        {data.text && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{data.text}</p>}
      </SectionTitle>
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {column(data.leftTitle, data.positioning, "border-brand-600")}
        {column(data.rightTitle, data.networks, "border-clay")}
      </div>
    </section>
  );
}

// ─── Séance de travail tripartite ────────────────────────────────────────────
function Tripartite({ data }: { data: Smcl["tripartite"] }) {
  return (
    <section className="block-wide bg-ink py-24 text-white md:py-32">
      <div className="container-site">
        <SectionTitle eyebrow={data.eyebrow} title={data.title} light>
          {data.text && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{data.text}</p>}
        </SectionTitle>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <Reveal className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
            <p className="text-xs font-semibold tracking-wider text-sun uppercase">Participants</p>
            <ul className="mt-5 space-y-3">
              {lines(data.participants).map((p, i) => (
                <li key={i} className="flex gap-3 leading-snug">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sun" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
            <p className="text-xs font-semibold tracking-wider text-sun uppercase">Axes de discussion</p>
            <ul className="mt-5 space-y-3">
              {lines(data.axes).map((p, i) => (
                <li key={i} className="flex gap-3 leading-snug text-white/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sun" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={240} className="rounded-2xl bg-sun p-8 text-ink">
            <p className="text-xs font-semibold tracking-wider uppercase opacity-70">Financements mobilisables</p>
            <ul className="mt-5 space-y-5">
              {data.funds.map((f, i) => (
                <li key={i}>
                  <p className="font-display text-xl font-extrabold">{f.title}</p>
                  <p className="mt-1 leading-snug opacity-80">{f.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Trois piliers ───────────────────────────────────────────────────────────
function Pillars({ data }: { data: Smcl["pillars"] }) {
  return (
    <section className="container-site py-24 md:py-32">
      <SectionTitle eyebrow={data.eyebrow} title={data.title} center />
      <ol className="mt-16 grid gap-6 md:grid-cols-3">
        {data.items.map((item, i) => (
          <Reveal as="li" key={i} delay={i * 120} className="relative overflow-hidden rounded-2xl bg-mist p-8 md:p-10">
            <span className="font-display text-6xl font-extrabold tracking-tighter text-brand-600/15">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 text-2xl">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">{item.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

// ─── Calendrier ──────────────────────────────────────────────────────────────
function Timeline({ data }: { data: Smcl["timeline"] }) {
  return (
    <section className="block-wide bg-mist py-24 md:py-32">
      <div className="container-site">
        <SectionTitle eyebrow={data.eyebrow} title={data.title} />
        <ol className="relative mt-14 space-y-6 before:absolute before:top-4 before:bottom-4 before:left-[19px] before:w-px before:bg-line md:before:left-[23px]">
          {data.items.map((step, i) => (
            <Reveal as="li" key={i} delay={Math.min(i, 3) * 80} className="relative flex gap-5 md:gap-8">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white md:h-12 md:w-12">
                {i + 1}
              </span>
              <div className="grid flex-1 gap-4 rounded-2xl bg-white p-6 md:grid-cols-12 md:gap-8 md:p-8">
                <p className="font-display text-lg font-extrabold text-brand-600 md:col-span-3">{step.period}</p>
                <div className="md:col-span-5">
                  <p className="text-xs font-semibold tracking-wider text-muted uppercase">Actions clés</p>
                  <p className="mt-2 leading-relaxed text-ink">{step.action}</p>
                </div>
                <div className="md:col-span-4">
                  <p className="text-xs font-semibold tracking-wider text-muted uppercase">Résultats attendus</p>
                  <p className="mt-2 leading-relaxed text-ink-soft">{step.result}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─── Recommandations ─────────────────────────────────────────────────────────
function Recommendations({ data }: { data: Smcl["recommendations"] }) {
  return (
    <section className="container-site py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <SectionTitle eyebrow={data.eyebrow} title={data.title} className="lg:col-span-4" />
        <ul className="space-y-4 lg:col-span-8">
          {data.items.map((item, i) => (
            <Reveal as="li" key={i} delay={i * 100} className="flex gap-5 rounded-2xl border border-line p-6 md:p-8">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay text-white">
                <Check />
              </span>
              <div>
                <h3 className="text-xl">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Appel à l'inscription ───────────────────────────────────────────────────
function Join({ data }: { data: Smcl["join"] }) {
  return (
    <section className="block-wide relative my-6 overflow-hidden bg-brand md:my-10">
      <div aria-hidden="true" className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sun/20 blur-3xl" />
      <div className="container-site relative flex flex-col gap-10 py-20 md:flex-row md:items-end md:justify-between md:py-28">
        <Reveal className="max-w-2xl">
          <Eyebrow tone="light">SMCL Paris 2026</Eyebrow>
          <h2 className="mt-6 text-4xl text-white md:text-6xl">
            <Rich text={data.title} />
          </h2>
          {data.text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{data.text}</p>}
        </Reveal>
        <div className="flex flex-wrap gap-4 self-start md:self-auto">
          <Button link={data.cta} variant="sun" />
          <Button link={data.secondary} variant="light" />
        </div>
      </div>
    </section>
  );
}
