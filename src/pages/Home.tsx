import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { usePage } from "@/content/SiteContent";
import type { PageContent } from "@/content/pages";
import { fetchPosts } from "@/lib/news";
import { PostImage, PostRow, VideoPlayer, useAsync } from "@/components/news";
import { Icon } from "@/components/icons";
import { Arrow, Button, Counter, CtaBand, Eyebrow, Paragraphs, PhoneIcon, phoneHref, Reveal, Rich, SectionTitle, SmartLink } from "@/components/ui";

type Home = PageContent<"home">;

export function Home() {
  const page = usePage("home");

  useEffect(() => {
    document.title = "FM Consulting · Développement communautaire, social et culturel";
  }, []);

  return (
    <>
      <Hero data={page.hero} />
      {page.pillars.visible && <Pillars data={page.pillars} />}
      {page.stats.visible && <Stats data={page.stats} />}
      {page.about.visible && <About data={page.about} />}
      {page.work.visible && <Work data={page.work} />}
      {page.team.visible && <Team data={page.team} />}
      {page.testimonials.visible && <Testimonials data={page.testimonials} />}
      {page.marquee.visible && <Marquee data={page.marquee} />}
      {page.why.visible && <Why data={page.why} />}
      {page.videos.visible && <Videos data={page.videos} />}
      {page.faq.visible && <Faq data={page.faq} />}
      {page.news.visible && <LatestNews data={page.news} />}
      <CtaBand />
    </>
  );
}

// ─── Bandeau d'ouverture ─────────────────────────────────────────────────────
function Hero({ data }: { data: Home["hero"] }) {
  return (
    <section className="block-wide relative min-h-[560px] overflow-hidden bg-ink md:min-h-[min(820px,calc(100vh-7rem))]">
      <PostImage image={data.image} eager sizes="100vw" className="hero-zoom absolute inset-0 h-full w-full" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/60 to-transparent" />

      <div className="container-site relative flex min-h-[inherit] flex-col justify-center py-24 md:py-32">
        <div className="max-w-4xl">
          <h1 className="fade-up text-[3.4rem] leading-[0.95] text-white sm:text-7xl md:text-8xl lg:text-[7.5rem]">
            <Rich text={data.title} />
          </h1>
          {data.text && <p className="fade-up fade-up-delay mt-8 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">{data.text}</p>}
          <div className="fade-up fade-up-delay mt-10">
            <Button link={data.cta} variant="sun" />
          </div>
        </div>
      </div>

      {data.badge && (
        <Link
          to="/contact"
          className="group absolute right-6 bottom-6 hidden h-40 w-40 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-brand-600 md:flex lg:right-12 lg:bottom-12 lg:h-48 lg:w-48"
          aria-label={data.badge}
        >
          <svg viewBox="0 0 200 200" aria-hidden="true" className="spin-slow absolute inset-0 h-full w-full">
            <defs>
              <path id="hero-badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            {/* Le texte est étiré pour faire exactement le tour du cercle (2π × 78 ≈ 490). */}
            <text className="fill-white text-[14px] font-semibold uppercase">
              <textPath href="#hero-badge-circle" textLength="486" lengthAdjust="spacing">{`${data.badge} • `}</textPath>
            </text>
          </svg>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sun text-ink transition-transform duration-300 group-hover:rotate-[-45deg]">
            <Arrow className="h-5 w-5" />
          </span>
        </Link>
      )}
    </section>
  );
}

// ─── Trois cartes ────────────────────────────────────────────────────────────
const TONES: Record<string, { card: string; text: string; link: string; watermark: string }> = {
  clay: { card: "bg-clay", text: "text-white", link: "text-white", watermark: "text-white/15" },
  brand: { card: "bg-brand-600", text: "text-white", link: "text-white", watermark: "text-white/15" },
  mist: { card: "bg-mist", text: "text-ink", link: "text-ink", watermark: "text-ink/[0.06]" },
};

function Pillars({ data }: { data: Home["pillars"] }) {
  return (
    <section className="container-site py-20 md:py-28">
      <div className="grid gap-6 md:grid-cols-3">
        {data.items.map((item, i) => {
          const tone = TONES[item.tone] ?? TONES.mist;
          return (
            <Reveal key={i} delay={i * 120} className={`relative flex min-h-[460px] flex-col overflow-hidden rounded-[var(--radius-block)] ${tone.card}`}>
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute top-6 -right-3 font-display text-[110px] leading-none font-extrabold tracking-tighter [writing-mode:vertical-rl] ${tone.watermark}`}
              >
                FM
              </span>
              <div className={`relative p-8 pb-6 md:p-10 md:pb-6 ${tone.text}`}>
                <h3 className={`text-3xl ${tone.text}`}>
                  <Rich text={item.title} />
                </h3>
                <p className="mt-4 max-w-xs text-[15px] leading-relaxed opacity-85">{item.text}</p>
                {item.link?.href && (
                  <SmartLink href={item.link.href} className={`link-arrow mt-6 ${tone.link}`}>
                    {item.link.label} <Arrow />
                  </SmartLink>
                )}
              </div>
              {item.image && (
                <div className="relative mt-auto px-3 pb-3">
                  <PostImage image={item.image} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[16/10] w-full rounded-xl" />
                </div>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// ─── Chiffres clés ───────────────────────────────────────────────────────────
function Stats({ data }: { data: Home["stats"] }) {
  return (
    <section className="block-wide relative overflow-hidden bg-ink">
      <PostImage image={data.image} sizes="100vw" className="absolute inset-0 h-full w-full" />
      <div aria-hidden="true" className="absolute inset-0 bg-ink/70" />
      <div className="container-site relative grid grid-cols-2 gap-y-10 py-20 md:py-28 lg:grid-cols-4">
        {data.items.map((item, i) => (
          <Reveal key={i} delay={i * 100} className="flex justify-center">
            <div className="flex aspect-square w-full max-w-[280px] flex-col items-center justify-center rounded-full border border-white/20 text-center">
              <p className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl">
                <Counter value={item.value} />
                {item.suffix && <span className="align-super text-3xl text-sun md:text-4xl">{item.suffix}</span>}
              </p>
              <p className="mt-2 max-w-[70%] text-sm font-semibold text-white/90 md:text-base">{item.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── Présentation ────────────────────────────────────────────────────────────
function About({ data }: { data: Home["about"] }) {
  const { contact } = usePage("settings");
  return (
    <section className="container-site py-24 md:py-32">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <SectionTitle eyebrow={data.eyebrow} title={data.title} className="lg:col-span-8" />
        {(data.badgeLabel || data.badgeValue) && (
          <Reveal className="lg:col-span-4 lg:justify-self-end">
            <div className="w-64 rounded-2xl border-t-4 border-clay bg-mist bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] p-6 [background-size:14px_14px]">
              <p className="text-sm font-medium text-ink-soft">{data.badgeLabel}</p>
              <p className="mt-3 font-display text-4xl leading-none font-extrabold tracking-tight text-clay">{data.badgeValue}</p>
            </div>
          </Reveal>
        )}
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <div className="overflow-hidden rounded-[var(--radius-block)]">
            <PostImage image={data.image} sizes="(min-width: 1024px) 640px, 100vw" className="aspect-[5/4] w-full" />
          </div>
        </Reveal>
        <Reveal delay={150} className="flex flex-col justify-center lg:col-span-6">
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
            <Paragraphs text={data.text} />
          </div>
          <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[16rem] text-ink-soft">{data.question}</p>
            {contact.phone && (
              <a href={phoneHref(contact.phone)} className="group flex items-center gap-3 font-semibold">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition-colors group-hover:bg-brand-600">
                  <PhoneIcon className="h-4 w-4" />
                </span>
                {contact.phone}
              </a>
            )}
          </div>
          <div className="mt-8">
            <Button link={data.link} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Réalisations : cartes empilées au défilement ────────────────────────────
function Work({ data }: { data: Home["work"] }) {
  return (
    <section className="pb-12">
      {data.watermark && (
        <p aria-hidden="true" className="container-site overflow-hidden text-center font-display text-[17vw] leading-[0.8] font-extrabold tracking-tighter whitespace-nowrap text-mist lg:text-[12rem]">
          {data.watermark}
        </p>
      )}
      <div className="relative -mt-[4vw] lg:-mt-16">
        {data.items.map((item, i) => (
          <article key={i} className="block-wide sticky top-24 mb-6 h-[78vh] min-h-[480px] overflow-hidden bg-ink lg:top-28" style={{ zIndex: i + 1 }}>
            <PostImage image={item.image} sizes="100vw" className="absolute inset-0 h-full w-full" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />
            <div className="container-site relative flex h-full flex-col justify-between py-12 md:py-16">
              <div className="max-w-xl">
                <span className="font-display text-sm font-semibold text-white/60">
                  {String(i + 1).padStart(2, "0")} / {String(data.items.length).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-5xl text-white md:text-7xl">
                  <Rich text={item.title} />
                </h3>
                {item.text && <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">{item.text}</p>}
              </div>
              {item.link?.href && (
                <div>
                  <Button link={item.link} variant="light" />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── Équipe ──────────────────────────────────────────────────────────────────
function Team({ data }: { data: Home["team"] }) {
  const n = data.members.length;
  const cols = n === 4 || n > 6 ? "sm:grid-cols-2 lg:grid-cols-4" : n >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : n === 2 ? "sm:grid-cols-2 max-w-4xl mx-auto" : "max-w-md mx-auto";
  return (
    <section className="container-site py-24 md:py-32">
      <SectionTitle eyebrow={data.eyebrow} title={data.title} center />
      <div className={`mt-14 grid gap-6 ${cols}`}>
        {data.members.map((m, i) => (
          <Reveal key={i} delay={i * 120} className="group">
            <div className="relative overflow-hidden rounded-[var(--radius-block)] border border-line bg-mist">
              <PostImage image={m.image} sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.04]" />
            </div>
            <h3 className="mt-5 text-2xl lg:text-xl xl:text-2xl">{m.name}</h3>
            <p className="mt-1 leading-snug text-muted">{m.role}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── Témoignages ─────────────────────────────────────────────────────────────
function Testimonials({ data }: { data: Home["testimonials"] }) {
  const [index, setIndex] = useState(0);
  const items = data.items;
  if (!items.length) return null;
  const item = items[index % items.length];
  const go = (step: number) => setIndex((i) => (i + step + items.length) % items.length);

  return (
    <section className="container-site pb-24 md:pb-32">
      <div className="relative mx-auto max-w-5xl text-center">
        <span aria-hidden="true" className="font-serif text-8xl leading-none text-brand-600/30">
          “
        </span>
        <blockquote key={index} className="fade-up -mt-6 text-2xl leading-snug font-semibold tracking-tight md:text-4xl">
          {item.quote}
        </blockquote>
        <p className="mt-8 font-semibold">{item.author}</p>
        <p className="text-sm text-muted">{item.role}</p>
        {items.length > 1 && (
          <div className="mt-8 flex justify-center gap-3 md:absolute md:inset-x-0 md:top-1/2 md:mt-0 md:-translate-y-1/2 md:justify-between">
            <button onClick={() => go(-1)} aria-label="Témoignage précédent" className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-line bg-white hover:border-ink md:-ml-16">
              <Arrow className="rotate-180" />
            </button>
            <button onClick={() => go(1)} aria-label="Témoignage suivant" className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-line bg-white hover:border-ink md:-mr-16">
              <Arrow />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Bandeau défilant ────────────────────────────────────────────────────────
function Marquee({ data }: { data: Home["marquee"] }) {
  const words = data.words.map((w) => w.text).filter(Boolean);
  if (!words.length) return null;
  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={i} className="flex items-center">
          <span className="text-outline px-6 font-display text-7xl font-extrabold tracking-tight uppercase md:text-[9rem]">{w}</span>
          <span aria-hidden="true" className="h-4 w-4 rounded-full bg-sun md:h-6 md:w-6" />
        </span>
      ))}
    </div>
  );
  return (
    <section aria-label={words.join(", ")} className="overflow-hidden py-12 md:py-16">
      <div className="marquee-track flex w-max" aria-hidden="true">
        {row}
        {row}
      </div>
    </section>
  );
}

// ─── Pourquoi nous choisir ───────────────────────────────────────────────────
const WHY_TONES = ["bg-white/15 text-white backdrop-blur-md border border-white/20", "bg-clay text-white", "bg-sun text-ink", "bg-white text-ink"];
const WHY_PLACES = ["lg:col-start-1 lg:row-start-1", "lg:col-start-3 lg:row-start-1 lg:mt-24", "lg:col-start-1 lg:row-start-3 lg:-mt-10", "lg:col-start-3 lg:row-start-3 lg:mt-6"];

function Why({ data }: { data: Home["why"] }) {
  return (
    <section className="block-wide relative overflow-hidden bg-ink">
      <PostImage image={data.image} sizes="100vw" className="absolute inset-0 h-full w-full" />
      <div aria-hidden="true" className="absolute inset-0 bg-ink/65" />
      <div className="container-site relative grid gap-6 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto_auto]">
        <div className="text-center lg:col-start-2 lg:row-start-2 lg:py-16">
          <Reveal>
            <Eyebrow tone="solid">{data.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-4xl text-white md:text-6xl">
              <Rich text={data.title} />
            </h2>
          </Reveal>
        </div>
        {data.items.map((item, i) => (
          <Reveal key={i} delay={i * 100} className={`rounded-2xl p-7 lg:max-w-xs ${WHY_TONES[i % 4]} ${WHY_PLACES[i % 4]} ${i % 2 ? "lg:justify-self-end" : ""}`}>
            <div className="flex justify-end">
              <Icon name={item.icon} className="h-8 w-8" />
            </div>
            <h3 className="mt-8 text-xl text-current">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed opacity-85">{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── Vidéos ──────────────────────────────────────────────────────────────────
function Videos({ data }: { data: Home["videos"] }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  // Active ou grise les chevrons selon la position du défilement.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [data.items.length]);

  // Défile d'une carte vers la gauche ou la droite.
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: "smooth" });
  };

  const chevron = (dir: 1 | -1, disabled: boolean) => (
    <button
      type="button"
      onClick={() => scroll(dir)}
      disabled={disabled}
      aria-label={dir === 1 ? "Vidéos suivantes" : "Vidéos précédentes"}
      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-ink text-ink transition-colors enabled:hover:bg-ink enabled:hover:text-white disabled:cursor-default disabled:border-line disabled:text-line"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={`h-4 w-4 ${dir === -1 ? "rotate-180" : ""}`}>
        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  return (
    <section className="container-site py-24 md:py-32">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionTitle eyebrow={data.eyebrow} title={data.title}>
          {data.text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{data.text}</p>}
        </SectionTitle>
        <Button link={data.link} variant="outline" className="self-start md:self-auto" />
      </div>
      {data.items.length > 1 && (
        <div className="mt-10 flex gap-3">
          {chevron(-1, edges.start)}
          {chevron(1, edges.end)}
        </div>
      )}
      <div
        ref={track}
        className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {data.items.map((item, i) => (
          <Reveal key={i} delay={Math.min(i, 3) * 100} className="w-[72vw] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] md:w-[calc((100%-40px)/3)] lg:w-[calc((100%-60px)/4)]">
            <VideoPlayer video={item.video} title={item.title} className="aspect-[9/16]" />
            <p className="mt-4 text-[15px] leading-snug font-semibold">{item.title}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── Questions fréquentes ────────────────────────────────────────────────────
function Faq({ data }: { data: Home["faq"] }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="container-site pb-24 md:pb-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionTitle eyebrow={data.eyebrow} title={data.title} />
          <Reveal className="mt-10">
            <Button link={data.link} />
          </Reveal>
        </div>
        <Reveal className="rounded-2xl bg-mist p-2 lg:col-span-7">
          {data.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="mb-2 rounded-xl bg-white last:mb-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left font-semibold"
                >
                  <span>
                    {String(i + 1).padStart(2, "0")}. {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg transition-colors ${
                      isOpen ? "border-clay bg-clay text-white" : "border-ink text-ink"
                    }`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-relaxed text-ink-soft">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

// ─── Dernières actualités ────────────────────────────────────────────────────
function LatestNews({ data }: { data: Home["news"] }) {
  const { data: posts } = useAsync(() => fetchPosts({ limit: 3 }), []);
  if (!posts?.length) return null;
  return (
    <section className="block-wide bg-mist py-24 md:py-32">
      <div className="container-site">
        <SectionTitle eyebrow={data.eyebrow} title={data.title} center />
        <div className="mt-14 space-y-5">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 100}>
              <PostRow post={post} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/actualites" className="btn btn-dark">
            Toutes les actualités
            <span className="dot" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
