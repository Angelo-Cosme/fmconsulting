import { useEffect } from "react";
import { usePage } from "@/content/SiteContent";
import { PostImage } from "@/components/news";
import { Icon } from "@/components/icons";
import { CtaBand, Paragraphs, PageHero, Reveal, SectionTitle } from "@/components/ui";

export function About() {
  const { header, intro, values, director, territories, partners } = usePage("about");

  useEffect(() => {
    document.title = "Le cabinet · FM Consulting";
  }, []);

  return (
    <>
      <PageHero eyebrow={header.eyebrow} title={header.title} text={header.text} image={header.image} />

      {/* Qui sommes-nous */}
      <section className="container-site py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionTitle eyebrow={intro.eyebrow} title={intro.title} />
            <Reveal className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
              <Paragraphs text={intro.text} />
            </Reveal>
          </div>
          <Reveal delay={150} className="lg:col-span-6">
            <PostImage image={intro.image} sizes="(min-width: 1024px) 640px, 100vw" className="aspect-[4/5] w-full rounded-[var(--radius-block)] lg:aspect-[4/4.6]" />
          </Reveal>
        </div>
      </section>

      {/* Mission, vision, valeurs */}
      {values.visible && (
        <section className="block-wide bg-mist py-24 md:py-32">
          <div className="container-site">
            <SectionTitle eyebrow={values.eyebrow} title={values.title} center />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {values.items.map((item, i) => (
                <Reveal key={i} delay={i * 120} className={`rounded-2xl p-8 md:p-10 ${i === 1 ? "bg-brand-600 text-white" : "bg-white"}`}>
                  <span className={`flex h-14 w-14 items-center justify-center rounded-full ${i === 1 ? "bg-white/15" : "bg-brand-50 text-brand-600"}`}>
                    <Icon name={item.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="mt-8 text-2xl text-current">{item.title}</h3>
                  <p className="mt-4 leading-relaxed opacity-80">{item.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mot du directeur */}
      {director.visible && (
        <section className="container-site py-24 md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-5">
              <PostImage image={director.image} sizes="(min-width: 1024px) 520px, 100vw" className="aspect-[4/5] w-full rounded-[var(--radius-block)]" />
            </Reveal>
            <Reveal delay={150} className="lg:col-span-7">
              {director.eyebrow && <span className="eyebrow">{director.eyebrow}</span>}
              <blockquote className="mt-8 font-serif text-3xl leading-snug font-medium text-ink italic md:text-[2.6rem]">« {director.quote} »</blockquote>
              {director.text && (
                <div className="mt-8 space-y-4 leading-relaxed text-ink-soft">
                  <Paragraphs text={director.text} />
                </div>
              )}
              <div className="mt-10 flex items-center gap-4 border-t border-line pt-8">
                <span className="h-px w-10 bg-clay" aria-hidden="true" />
                <div>
                  <p className="font-display text-lg font-bold">{director.name}</p>
                  <p className="text-sm text-muted">{director.role}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Zones d'intervention */}
      {territories.visible && (
        <section className="block-wide bg-ink py-24 text-white md:py-32">
          <div className="container-site">
            <SectionTitle eyebrow={territories.eyebrow} title={territories.title} light />
            <div className="mt-14 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
              {territories.items.map((item, i) => (
                <Reveal key={i} delay={i * 100} className="border-b border-white/15 py-8 sm:pr-8 lg:border-r lg:border-b-0 lg:px-8 lg:first:pl-0 lg:last:border-r-0">
                  <p className="font-display text-sm font-semibold text-sun">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 text-3xl text-white">{item.name}</h3>
                  <p className="mt-2 text-white/60">{item.detail}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Institutions et territoires */}
      {partners.visible && partners.items.length > 0 && (
        <section className="container-site py-24 md:py-32">
          <SectionTitle eyebrow={partners.eyebrow} title={partners.title} center />
          <Reveal className="mt-14 flex flex-wrap justify-center gap-3">
            {partners.items.map((p, i) => (
              <span key={i} className="rounded-2xl border border-line px-6 py-3 text-center">
                <span className="block font-display text-lg font-semibold tracking-tight text-ink-soft">{p.name}</span>
                {p.detail && <span className="mt-0.5 block text-sm text-muted">{p.detail}</span>}
              </span>
            ))}
          </Reveal>
        </section>
      )}

      <CtaBand />
    </>
  );
}
