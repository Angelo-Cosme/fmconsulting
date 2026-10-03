import { CtaBand, PageHeader, SectionHeading } from "@/components/ui";

const values = [
  { title: "Lorem Ipsum", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore." },
  { title: "Dolor Sit", desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo." },
  { title: "Consectetur", desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
  { title: "Adipiscing", desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id." },
];

export function About() {
  return (
    <>
      <PageHeader
        eyebrow="À propos"
        title={
          <>
            À propos de <span className="accent">FM Consulting</span>
          </>
        }
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />

      {/* STORY */}
      <section className="container-site py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=1000&fit=crop&auto=format"
              alt="Bureaux de FM Consulting"
              className="aspect-[4/5] w-full rounded-3xl object-cover"
            />
            <div className="absolute right-4 bottom-4 rounded-2xl bg-white px-6 py-5 shadow-sm">
              <p className="font-display text-3xl font-semibold">2008</p>
              <p className="mt-1 text-xs text-muted">Année de création</p>
            </div>
          </div>
          <div>
            <span className="eyebrow">Notre histoire</span>
            <h2 className="mt-5 text-3xl font-semibold md:text-4xl">
              Lorem ipsum dolor sit amet <span className="accent">consectetur adipiscing.</span>
            </h2>
            <div className="mt-8 space-y-5 leading-relaxed text-muted">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y border-line bg-white">
        <div className="container-site py-20 md:py-28">
          <SectionHeading
            eyebrow="Nos valeurs"
            title={
              <>
                Ce qui nous <span className="accent">guide.</span>
              </>
            }
          />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} className="bg-white p-8">
                <span className="font-display text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-10 text-xl font-semibold">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
