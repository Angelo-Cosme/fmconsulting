import { useState } from "react";
import { Link } from "react-router";
import { posts } from "@/data/news";

const categories = ["Tous", "Stratégie", "Digital", "Ressources humaines", "Finance", "RSE"];

export function News() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filtered =
    activeCategory === "Tous"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const [featured, ...rest] = filtered;

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
          Insights & expertise
        </span>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            color: "white",
            marginTop: "0.75rem",
          }}
        >
          Nos actualités
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "1rem",
            maxWidth: 520,
            margin: "1rem auto 0",
          }}
        >
          Analyses, tendances et retours d'expérience de nos consultants.
        </p>
      </section>

      <section style={{ padding: "60px 24px 80px" }}>
        <div className="max-w-7xl mx-auto">
          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 18px",
                  borderRadius: "2px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  border: "1px solid",
                  transition: "all 0.2s",
                  background: activeCategory === cat ? "var(--blue-deep)" : "white",
                  borderColor: activeCategory === cat ? "var(--blue-deep)" : "var(--border)",
                  color: activeCategory === cat ? "white" : "var(--gray-mid)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured article */}
          {featured && (
            <Link
              to={`/news/${featured.slug}`}
              style={{ textDecoration: "none", display: "block", marginBottom: "3rem" }}
            >
              <div
                style={{
                  borderRadius: "4px",
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  background: "white",
                  border: "1px solid var(--border)",
                  transition: "box-shadow 0.2s",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 40px rgba(26,58,143,0.12)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <img
                  src={featured.photo}
                  alt={featured.title}
                  style={{ width: "100%", height: "360px", objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      style={{
                        background: "var(--blue-pale)",
                        color: "var(--blue-deep)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: "2px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {featured.category}
                    </span>
                    <span style={{ color: "var(--gray-mid)", fontSize: "0.78rem" }}>
                      {featured.date}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.6rem",
                      lineHeight: 1.3,
                      color: "var(--text-dark)",
                      marginBottom: "1rem",
                    }}
                  >
                    {featured.title}
                  </h2>
                  <p style={{ color: "var(--gray-mid)", fontSize: "0.87rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "0.78rem", color: "var(--blue-mid)", fontWeight: 600 }}>
                      Par {featured.author}
                    </span>
                    <span style={{ color: "var(--gold)", fontSize: "0.82rem", fontWeight: 700 }}>→</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {rest.map((post) => (
              <Link
                key={post.slug}
                to={`/news/${post.slug}`}
                style={{ textDecoration: "none" }}
              >
                <article
                  style={{
                    background: "white",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseOver={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "0 8px 32px rgba(26,58,143,0.10)";
                    el.style.transform = "translateY(-3px)";
                  }}
                  onMouseOut={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "none";
                    el.style.transform = "none";
                  }}
                >
                  <img
                    src={post.photo}
                    alt={post.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        style={{
                          background: "var(--blue-pale)",
                          color: "var(--blue-deep)",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "2px",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {post.category}
                      </span>
                      <span style={{ color: "var(--gray-mid)", fontSize: "0.75rem" }}>{post.date}</span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.05rem",
                        lineHeight: 1.35,
                        color: "var(--text-dark)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {post.title}
                    </h3>
                    <p style={{ color: "var(--gray-mid)", fontSize: "0.82rem", lineHeight: 1.7, flex: 1, marginBottom: "1rem" }}>
                      {post.excerpt}
                    </p>
                    <span style={{ color: "var(--blue-mid)", fontSize: "0.8rem", fontWeight: 600 }}>
                      Lire l'article →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray-mid)" }}>
              Aucun article dans cette catégorie.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
