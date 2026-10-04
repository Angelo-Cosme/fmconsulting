import { Link } from "react-router";
import heroBg from "@/imports/header-image-fmconsulting.jpg";
import { fetchPosts } from "@/lib/news";
import { PostCard, PostCardSkeleton, useAsync } from "@/components/news";
import { Arrow, Check, CtaBand, SectionHeading } from "@/components/ui";

const services = [
  {
    title: "Lorem ipsum dolor sit",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim.",
  },
  {
    title: "Consectetur adipiscing",
    desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.",
  },
  {
    title: "Sed do eiusmod tempor",
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.",
  },
  {
    title: "Incididunt ut labore",
    desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum sed perspiciatis.",
  },
];

const stats = [
  { value: "15+", label: "Lorem ipsum" },
  { value: "300+", label: "Dolor sit amet" },
  { value: "120+", label: "Consectetur" },
  { value: "98%", label: "Adipiscing elit" },
];

const strengths = [
  "Lorem ipsum dolor sit amet consectetur",
  "Sed do eiusmod tempor incididunt labore",
  "Ut enim ad minim veniam quis nostrud",
  "Duis aute irure dolor reprehenderit",
];

const testimonials = [
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Lorem Ipsum",
    role: "Dolor Sit, Amet Consectetur",
  },
  {
    quote:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.",
    author: "Adipiscing Elit",
    role: "Sed Do, Eiusmod Tempor",
  },
  {
    quote:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.",
    author: "Incididunt Labore",
    role: "Dolore Magna, Aliqua Enim",
  },
];

export function Home() {
  return (
    <>
      {/* HERO */}
      <section className="container-site pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="fade-up md:col-span-8">
            <span className="eyebrow">Cabinet de conseil · Cotonou & Paris</span>
            <h1 className="mt-6 text-5xl font-semibold md:text-7xl">
              Lorem ipsum dolor,
              <br />
              <span className="accent">sit amet</span> consectetur.
            </h1>
          </div>
          <div className="fade-up fade-up-delay md:col-span-4">
            <p className="text-lg leading-relaxed text-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="btn btn-primary">
                Nous contacter <Arrow />
              </Link>
              <Link to="/services" className="btn btn-outline">
                Nos services
              </Link>
            </div>
          </div>
        </div>

        <div className="fade-up fade-up-delay relative mt-14 overflow-hidden rounded-3xl md:mt-20">
          <img
            src={heroBg}
            alt="Deux consultants FM Consulting en réunion"
            className="aspect-[4/3] w-full object-cover md:aspect-[21/9]"
          />
          <div className="absolute bottom-4 left-4 hidden rounded-2xl bg-white/90 px-5 py-4 backdrop-blur md:block">
            <p className="text-xs text-muted">Depuis 2008</p>
            <p className="font-display text-sm font-semibold">Lorem ipsum dolor sit amet</p>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`flex flex-col px-1 md:px-8 ${i > 0 ? "md:border-l md:border-line" : ""} md:first:pl-0`}>
              <dt className="order-2 mt-2 text-sm text-muted">{s.label}</dt>
              <dd className="order-1 font-display text-4xl font-semibold tracking-tight md:text-5xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* SERVICES */}
      <section className="border-t border-line bg-white">
        <div className="container-site py-20 md:py-28">
          <SectionHeading
            eyebrow="Expertises"
            title={
              <>
                Lorem ipsum dolor sit amet, <span className="accent">consectetur.</span>
              </>
            }
            action={
              <Link to="/services" className="link-arrow">
                Voir tous nos services <Arrow />
              </Link>
            }
          />
          <div className="divide-y divide-line border-y border-line">
            {services.map((s, i) => (
              <Link
                key={s.title}
                to="/services"
                className="group grid items-start gap-4 py-8 transition-colors md:grid-cols-12 md:gap-8 md:py-10"
              >
                <span className="font-display text-sm text-muted md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-semibold transition-colors group-hover:text-brand-600 md:col-span-4">
                  {s.title}
                </h3>
                <p className="leading-relaxed text-muted md:col-span-6">{s.desc}</p>
                <span className="hidden justify-end md:col-span-1 md:flex">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                    <Arrow />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container-site py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <span className="eyebrow">Pourquoi nous</span>
            <h2 className="mt-5 text-3xl font-semibold md:text-5xl">
              Lorem ipsum dolor sit, <span className="accent">adipiscing.</span>
            </h2>
            <p className="mt-6 leading-relaxed text-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <Link to="/about" className="btn btn-outline mt-10">
              À propos de nous <Arrow />
            </Link>
          </div>
          <div className="grid gap-4">
            <ul className="card divide-y divide-line">
              {strengths.map((item) => (
                <li key={item} className="flex items-center gap-4 px-6 py-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Check />
                  </span>
                  <span className="text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Lorem ipsum", val: "98%" },
                { label: "Consectetur", val: "94%" },
                { label: "Eiusmod", val: "96%" },
              ].map((b) => (
                <div key={b.label} className="rounded-2xl bg-mist p-5">
                  <p className="font-display text-2xl font-semibold">{b.val}</p>
                  <p className="mt-1 text-xs text-muted">{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-line bg-white">
        <div className="container-site py-20 md:py-28">
          <SectionHeading
            eyebrow="Témoignages"
            title={
              <>
                Ils nous font <span className="accent">confiance.</span>
              </>
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.author} className="flex flex-col justify-between rounded-2xl bg-canvas p-8">
                <blockquote className="text-lg leading-relaxed text-ink-soft">
                  <span className="mb-4 block font-serif text-5xl leading-none text-gold">“</span>
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-white">
                    {t.author.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{t.author}</span>
                    <span className="block text-xs text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <LatestNews />

      <CtaBand />
    </>
  );
}

/** Les 3 derniers articles publiés ; la section disparaît s'il n'y en a pas (ou en cas d'erreur). */
function LatestNews() {
  const { data: posts, loading } = useAsync(() => fetchPosts({ limit: 3 }), []);
  if (!loading && !posts?.length) return null;

  return (
    <section className="container-site pt-20 md:pt-28">
      <SectionHeading
        eyebrow="Actualités"
        title="Nos dernières analyses"
        action={
          <Link to="/news" className="link-arrow">
            Toutes les actualités <Arrow />
          </Link>
        }
      />
      <div className="grid gap-8 md:grid-cols-3">
        {posts
          ? posts.map((p) => <PostCard key={p.id} post={p} aspect="aspect-[4/3]" />)
          : [0, 1, 2].map((i) => <PostCardSkeleton key={i} aspect="aspect-[4/3]" />)}
      </div>
    </section>
  );
}
