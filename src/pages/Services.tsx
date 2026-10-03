import { CtaBand, PageHeader, SectionHeading } from "@/components/ui";

const services = [
  {
    id: "s1",
    title: "Lorem ipsum dolor sit amet",
    tagline: "Consectetur adipiscing elit",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    items: [
      "Lorem ipsum dolor sit amet consectetur",
      "Sed do eiusmod tempor incididunt labore",
      "Ut enim ad minim veniam quis nostrud",
      "Duis aute irure dolor in reprehenderit",
      "Excepteur sint occaecat cupidatat non",
    ],
  },
  {
    id: "s2",
    title: "Consectetur adipiscing elit",
    tagline: "Sed do eiusmod tempor",
    desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
    items: [
      "Duis aute irure dolor reprehenderit",
      "Excepteur sint occaecat cupidatat",
      "Sed ut perspiciatis unde omnis iste",
      "Nemo enim ipsam voluptatem quia",
      "At vero eos et accusamus iusto odio",
    ],
  },
  {
    id: "s3",
    title: "Sed do eiusmod tempor incididunt",
    tagline: "Ut labore et dolore magna",
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    items: [
      "Sed ut perspiciatis unde omnis natus",
      "Nemo enim ipsam voluptatem quia sit",
      "At vero eos et accusamus et iusto odio",
      "Nam libero tempore cum soluta nobis",
      "Temporibus autem quibusdam et aut",
    ],
  },
  {
    id: "s4",
    title: "Ut enim ad minim veniam",
    tagline: "Quis nostrud exercitation",
    desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus.",
    items: [
      "Nemo enim ipsam voluptatem quia voluptas",
      "At vero eos et accusamus et iusto odio",
      "Nam libero tempore cum soluta nobis est",
      "Temporibus autem quibusdam et aut officiis",
      "Itaque earum rerum hic tenetur sapiente",
    ],
  },
  {
    id: "s5",
    title: "Quis nostrud exercitation ullamco",
    tagline: "Laboris nisi ut aliquip",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore.",
    items: [
      "Temporibus autem quibusdam et aut officiis",
      "Itaque earum rerum hic tenetur sapiente",
      "Quis autem vel eum iure reprehenderit",
      "Nam libero tempore cum soluta nobis est",
      "At vero eos et accusamus et iusto odio",
    ],
  },
  {
    id: "s6",
    title: "Duis aute irure dolor reprehenderit",
    tagline: "In voluptate velit esse",
    desc: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi.",
    items: [
      "Quis autem vel eum iure reprehenderit qui",
      "Itaque earum rerum hic tenetur sapiente",
      "Nam libero tempore cum soluta nobis est",
      "Temporibus autem quibusdam et aut officiis",
      "At vero eos et accusamus et iusto odio",
    ],
  },
];

const steps = [
  { num: "01", title: "Lorem Ipsum", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt." },
  { num: "02", title: "Dolor Sit", desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea." },
  { num: "03", title: "Consectetur", desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat." },
  { num: "04", title: "Adipiscing", desc: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit." },
];

export function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Nos domaines <span className="accent">d'expertise</span>
          </>
        }
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam."
      />

      {/* Services list */}
      <section className="container-site py-12 md:py-16">
        <div className="divide-y divide-line">
          {services.map((s, i) => (
            <article key={s.id} id={s.id} className="grid scroll-mt-24 gap-8 py-12 md:grid-cols-12 md:py-16">
              <div className="md:col-span-5">
                <span className="font-display text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-6 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">{s.tagline}</p>
                <h2 className="mt-3 text-2xl font-semibold md:text-3xl">{s.title}</h2>
              </div>
              <div className="md:col-span-7">
                <p className="text-lg leading-relaxed text-muted">{s.desc}</p>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <li key={item} className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-line bg-white">
        <div className="container-site py-20 md:py-28">
          <SectionHeading
            eyebrow="Notre méthode"
            title={
              <>
                Une démarche <span className="accent">en quatre temps.</span>
              </>
            }
          />
          <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
            {steps.map((step) => (
              <li key={step.num} className="border-t-2 border-ink pt-6">
                <span className="font-display text-sm font-semibold text-brand-600">{step.num}</span>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Un projet en tête ? <span className="accent">Parlons-en.</span>
          </>
        }
      />
    </>
  );
}
