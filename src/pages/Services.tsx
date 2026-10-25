import { useEffect } from "react";
import { usePage } from "@/content/SiteContent";
import { PostImage } from "@/components/news";
import { Icon } from "@/components/icons";
import { Check, CtaBand, PageHero, Reveal, SectionTitle } from "@/components/ui";

export function Services() {
  const { header, list, process } = usePage("services");

  useEffect(() => {
    document.title = "Expertises · FM Consulting";
  }, []);

  return (
    <>
      <PageHero eyebrow={header.eyebrow} title={header.title} text={header.text} image={header.image} />

      <section className="container-site py-24 md:py-32">
        <SectionTitle eyebrow={list.eyebrow} title={list.title} />

        <div className="mt-16 space-y-6">
          {list.items.map((item, i) => {
            const points = item.points.split("\n").map((p) => p.trim()).filter(Boolean);
            const reversed = i % 2 === 1;
            return (
              <Reveal key={i} as="article" className="grid gap-8 rounded-[var(--radius-block)] border border-line p-3 md:grid-cols-2 md:gap-0">
                <div className={`overflow-hidden rounded-xl ${reversed ? "md:order-2" : ""}`}>
                  <PostImage image={item.image} sizes="(min-width: 768px) 640px, 100vw" className="aspect-[4/3] h-full w-full" />
                </div>
                <div className="flex flex-col justify-center px-5 pb-6 md:px-12 md:py-10 lg:px-16">
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <Icon name={item.icon} className="h-7 w-7" />
                    </span>
                    <span className="font-display text-sm font-semibold text-muted">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-6 text-3xl md:text-4xl">{item.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-ink-soft">{item.text}</p>
                  {points.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {points.map((p, j) => (
                        <li key={j} className="flex gap-3 text-ink-soft">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sun text-ink">
                            <Check />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {process.visible && (
        <section className="block-wide bg-mist py-24 md:py-32">
          <div className="container-site">
            <SectionTitle eyebrow={process.eyebrow} title={process.title} center />
            <ol className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {process.items.map((step, i) => (
                <Reveal as="li" key={i} delay={i * 120} className="relative rounded-2xl bg-white p-8">
                  <span className="font-display text-6xl font-extrabold tracking-tighter text-brand-600/15">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-xl">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{step.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
