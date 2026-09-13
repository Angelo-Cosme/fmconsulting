import { Link } from "react-router";

const team = [
  {
    name: "Lorem Ipsum",
    role: "Fondateur & Associé Principal",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Dolor Sit Amet",
    role: "Associée — Lorem Ipsum",
    bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Consectetur Adipiscing",
    role: "Directeur Lorem Ipsum",
    bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Sed Do Eiusmod",
    role: "Consultante Senior — Lorem",
    bio: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
  },
];

const values = [
  { title: "Lorem Ipsum", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore." },
  { title: "Dolor Sit", desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo." },
  { title: "Consectetur", desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
  { title: "Adipiscing", desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id." },
];

export function About() {
  return (
    <div>
      {/* Page Header */}
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
          À propos de FM Consulting
        </h1>
      </section>

      {/* STORY */}
      <section style={{ padding: "80px 24px" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span
              style={{
                color: "var(--blue-mid)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Lorem ipsum dolor sit
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.7rem, 2.5vw, 2.2rem)",
                marginTop: "0.75rem",
                marginBottom: "1.5rem",
                lineHeight: 1.3,
              }}
            >
              Lorem ipsum dolor sit<br />amet consectetur adipiscing
            </h2>
            <p style={{ color: "var(--gray-mid)", lineHeight: 1.85, marginBottom: "1.2rem" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
              ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
              ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p style={{ color: "var(--gray-mid)", lineHeight: 1.85, marginBottom: "1.2rem" }}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </p>
            <p style={{ color: "var(--gray-mid)", lineHeight: 1.85 }}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem.
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format"
              alt="Lorem ipsum FM Consulting"
              style={{ width: "100%", borderRadius: "4px", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                right: "-20px",
                background: "var(--gold)",
                color: "white",
                padding: "1.5rem 2rem",
                borderRadius: "2px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2rem",
                  lineHeight: 1,
                }}
              >
                2008
              </div>
              <div style={{ fontSize: "0.75rem", marginTop: "4px" }}>Lorem ipsum</div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ background: "var(--gray-light)", padding: "80px 24px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span
              style={{
                color: "var(--blue-mid)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Lorem ipsum dolor
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                marginTop: "0.75rem",
              }}
            >
              Lorem ipsum dolor sit amet
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                style={{
                  background: "white",
                  borderRadius: "4px",
                  padding: "2rem 1.5rem",
                  borderLeft: `4px solid ${i % 2 === 0 ? "var(--blue-deep)" : "var(--gold)"}`,
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.15rem",
                    marginBottom: "0.75rem",
                    color: "var(--text-dark)",
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ color: "var(--gray-mid)", fontSize: "0.85rem", lineHeight: 1.7 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ padding: "80px 24px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span
              style={{
                color: "var(--blue-mid)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Lorem ipsum
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                marginTop: "0.75rem",
              }}
            >
              Lorem ipsum dolor sit amet
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((m) => (
              <div key={m.name} className="text-center">
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto 1rem",
                    border: "3px solid var(--blue-pale)",
                  }}
                >
                  <img
                    src={m.photo}
                    alt={m.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  {m.name}
                </h3>
                <p style={{ color: "var(--gold)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                  {m.role}
                </p>
                <p style={{ color: "var(--gray-mid)", fontSize: "0.82rem", lineHeight: 1.65 }}>
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "var(--blue-pale)",
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            marginBottom: "1rem",
            color: "var(--text-dark)",
          }}
        >
          Lorem ipsum dolor sit amet consectetur
        </h2>
        <p style={{ color: "var(--gray-mid)", marginBottom: "2rem" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
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
          Nous contacter
        </Link>
      </section>
    </div>
  );
}
