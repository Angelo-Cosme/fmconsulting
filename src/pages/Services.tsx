import { Link } from "react-router";

const services = [
  {
    id: "s1",
    icon: "◈",
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
    icon: "◇",
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
    icon: "◉",
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
    icon: "◫",
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
    icon: "◬",
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
    icon: "◩",
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

export function Services() {
  return (
    <div>
      {/* Header */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--text-dark) 0%, var(--blue-deep) 100%)",
          padding: "80px 24px 60px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "var(--gold)",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Lorem ipsum dolor
        </span>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            color: "white",
            marginTop: "0.75rem",
            lineHeight: 1.2,
          }}
        >
          Nos domaines d'expertise
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: "1rem",
            maxWidth: 560,
            margin: "1rem auto 0",
            lineHeight: 1.75,
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.
        </p>
      </section>

      {/* Services grid */}
      <section style={{ padding: "80px 24px" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {services.map((s, i) => (
            <div
              key={s.id}
              style={{
                background: i % 4 < 2 ? "var(--gray-light)" : "white",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "2.5rem",
                display: "flex",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  color: "var(--blue-mid)",
                  flexShrink: 0,
                  lineHeight: 1,
                  marginTop: "4px",
                }}
              >
                {s.icon}
              </div>
              <div>
                <span
                  style={{
                    color: "var(--gold)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.tagline}
                </span>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.25rem",
                    marginTop: "0.4rem",
                    marginBottom: "0.75rem",
                    color: "var(--text-dark)",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ color: "var(--gray-mid)", fontSize: "0.85rem", lineHeight: 1.75, marginBottom: "1.25rem" }}>
                  {s.desc}
                </p>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {s.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-dark)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.5rem",
                      }}
                    >
                      <span style={{ color: "var(--blue-mid)", flexShrink: 0, marginTop: "1px" }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section style={{ background: "var(--blue-deep)", padding: "80px 24px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                color: "white",
              }}
            >
              Lorem ipsum dolor sit amet
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Lorem Ipsum", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt." },
              { num: "02", title: "Dolor Sit", desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea." },
              { num: "03", title: "Consectetur", desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat." },
              { num: "04", title: "Adipiscing", desc: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit." },
            ].map((step) => (
              <div key={step.num} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "3rem",
                    color: "rgba(255,255,255,0.15)",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "var(--gold)",
                    fontSize: "1.1rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            marginBottom: "1rem",
          }}
        >
          Lorem ipsum dolor sit amet ?
        </h2>
        <p style={{ color: "var(--gray-mid)", marginBottom: "2rem" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt.
        </p>
        <Link
          to="/contact"
          style={{
            background: "var(--blue-deep)",
            color: "white",
            padding: "14px 36px",
            borderRadius: "2px",
            fontWeight: 600,
            fontSize: "0.85rem",
            letterSpacing: "0.06em",
            textDecoration: "none",
          }}
        >
          Nous contacter →
        </Link>
      </section>
    </div>
  );
}
