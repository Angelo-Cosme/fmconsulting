import { Link } from "react-router";
import heroBg from "@/imports/header-image-fmconsulting.jpg";

const services = [
  {
    icon: "◈",
    title: "Lorem ipsum dolor sit",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim.",
  },
  {
    icon: "◇",
    title: "Consectetur adipiscing",
    desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.",
  },
  {
    icon: "◉",
    title: "Sed do eiusmod tempor",
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.",
  },
  {
    icon: "◫",
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
    <div className="page-shell">
      {/* HERO */}
      <section
        style={{
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(135deg, rgba(15,28,63,0.88) 0%, rgba(26,58,143,0.78) 60%, rgba(36,86,184,0.70) 100%)",
          }}
        />
        <svg
          style={{
            position: "absolute",
            right: "-80px",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.07,
            width: "600px",
            height: "600px",
            zIndex: 2,
            pointerEvents: "none",
          }}
          viewBox="0 0 600 600"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="300" cy="300" r="280" stroke="white" strokeWidth="60" />
          <circle cx="300" cy="300" r="180" stroke="white" strokeWidth="30" />
        </svg>

        <div
          className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center w-full"
          style={{ position: "relative", zIndex: 3 }}
        >
          <div className="fade-up">
            <span
              style={{
                display: "inline-block",
                background: "var(--gold)",
                color: "white",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "4px 14px",
                borderRadius: "1px",
                marginBottom: "1.5rem",
              }}
            >
              Lorem ipsum dolor
            </span>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                lineHeight: 1.15,
                color: "white",
                marginBottom: "1.5rem",
              }}
            >
              Lorem ipsum<br />
              <span style={{ color: "var(--gold)" }}>dolor sit amet.</span>
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "1.05rem",
                lineHeight: 1.75,
                maxWidth: "480px",
                marginBottom: "2.5rem",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                style={{
                  background: "var(--gold)",
                  color: "white",
                  padding: "14px 32px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
              >
                Nous contacter
              </Link>
              <Link
                to="/services"
                style={{
                  border: "1px solid rgba(255,255,255,0.35)",
                  color: "white",
                  padding: "14px 32px",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  letterSpacing: "0.06em",
                  borderRadius: "2px",
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
              >
                Nos services →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "4px",
                  padding: "2rem 1.5rem",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2.4rem",
                    color: "var(--gold)",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section style={{ background: "var(--gray-light)", padding: "80px 24px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
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
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                color: "var(--text-dark)",
                marginTop: "0.75rem",
              }}
            >
              Lorem ipsum dolor sit amet<br />consectetur adipiscing elit
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                style={{
                  background: "white",
                  borderRadius: "4px",
                  padding: "2rem 1.5rem",
                  borderTop: "3px solid var(--blue-deep)",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseOver={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "0 8px 32px rgba(26,58,143,0.12)";
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "none";
                  el.style.transform = "none";
                }}
              >
                <div style={{ fontSize: "1.6rem", color: "var(--blue-mid)", marginBottom: "1rem" }}>
                  {s.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.05rem",
                    marginBottom: "0.75rem",
                    color: "var(--text-dark)",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ color: "var(--gray-mid)", fontSize: "0.85rem", lineHeight: 1.7 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/services"
              style={{
                color: "var(--blue-deep)",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.06em",
                textDecoration: "none",
                borderBottom: "2px solid var(--gold)",
                paddingBottom: "2px",
              }}
            >
              Voir tous nos services →
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
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
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                marginTop: "0.75rem",
                marginBottom: "1.5rem",
                lineHeight: 1.25,
              }}
            >
              Lorem ipsum dolor sit,<br />consectetur adipiscing.
            </h2>
            <p style={{ color: "var(--gray-mid)", lineHeight: 1.8, marginBottom: "2rem" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            {[
              "Lorem ipsum dolor sit amet consectetur",
              "Sed do eiusmod tempor incididunt labore",
              "Ut enim ad minim veniam quis nostrud",
              "Duis aute irure dolor reprehenderit",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 mb-3">
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--blue-pale)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "var(--blue-deep)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
                <span style={{ fontSize: "0.9rem", color: "var(--text-dark)" }}>{item}</span>
              </div>
            ))}
            <Link
              to="/about"
              style={{
                display: "inline-block",
                marginTop: "1.5rem",
                background: "var(--blue-deep)",
                color: "white",
                padding: "12px 28px",
                borderRadius: "2px",
                fontWeight: 600,
                fontSize: "0.82rem",
                letterSpacing: "0.06em",
                textDecoration: "none",
              }}
            >
              À propos de nous
            </Link>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, var(--blue-pale) 0%, #ddeaff 100%)",
              borderRadius: "4px",
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {[
              { label: "Lorem ipsum dolor", val: 98 },
              { label: "Consectetur adipiscing", val: 94 },
              { label: "Sed do eiusmod tempor", val: 96 },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex justify-between mb-1">
                  <span style={{ fontSize: "0.82rem", fontWeight: 500 }}>{b.label}</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--blue-mid)", fontWeight: 700 }}>
                    {b.val}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "rgba(26,58,143,0.1)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${b.val}%`,
                      background: "linear-gradient(90deg, var(--blue-deep), var(--blue-light))",
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
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
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.author}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "4px",
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    color: "var(--gold)",
                    lineHeight: 1,
                    marginBottom: "1rem",
                    fontFamily: "serif",
                  }}
                >
                  "
                </div>
                <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.75, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                  {t.quote}
                </p>
                <div>
                  <div style={{ color: "white", fontWeight: 600, fontSize: "0.85rem" }}>
                    {t.author}
                  </div>
                  <div style={{ color: "var(--gold)", fontSize: "0.75rem", marginTop: "2px" }}>
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div className="max-w-2xl mx-auto">
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              marginBottom: "1rem",
            }}
          >
            Lorem ipsum dolor sit amet consectetur ?
          </h2>
          <p style={{ color: "var(--gray-mid)", lineHeight: 1.8, marginBottom: "2rem" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <Link
            to="/contact"
            style={{
              background: "var(--blue-deep)",
              color: "white",
              padding: "16px 40px",
              fontWeight: 600,
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}
