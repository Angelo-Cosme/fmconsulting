import { useParams, Link } from "react-router";
import { posts } from "@/data/news";

export function NewsPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div style={{ textAlign: "center", padding: "8rem 2rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", marginBottom: "1rem" }}>
          Article introuvable
        </h2>
        <Link to="/news" style={{ color: "var(--blue-deep)", fontWeight: 600 }}>
          ← Retour aux actualités
        </Link>
      </div>
    );
  }

  const others = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div>
      {/* Hero image */}
      <div style={{ position: "relative", height: "420px", overflow: "hidden" }}>
        <img
          src={post.photo}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(15,28,63,0.7) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "800px",
            padding: "0 24px",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              style={{
                background: "var(--gold)",
                color: "white",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "3px 12px",
                borderRadius: "2px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {post.category}
            </span>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem" }}>{post.date}</span>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              color: "white",
              lineHeight: 1.25,
            }}
          >
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 24px" }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: "2rem", fontSize: "0.78rem", color: "var(--gray-mid)" }}>
          <Link to="/" style={{ color: "var(--blue-mid)", textDecoration: "none" }}>
            Accueil
          </Link>
          {" / "}
          <Link to="/news" style={{ color: "var(--blue-mid)", textDecoration: "none" }}>
            Actualités
          </Link>
          {" / "}
          <span style={{ color: "var(--text-dark)" }}>{post.category}</span>
        </nav>

        {/* Author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem 1.5rem",
            background: "var(--gray-light)",
            borderRadius: "4px",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--blue-deep)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            {post.author.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-dark)" }}>
              {post.author}
            </div>
            <div style={{ color: "var(--gray-mid)", fontSize: "0.75rem" }}>
              Consultant FM Consulting · {post.date}
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.15rem",
            lineHeight: 1.7,
            color: "var(--text-dark)",
            borderLeft: "3px solid var(--gold)",
            paddingLeft: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {post.excerpt}
        </p>

        {/* Body paragraphs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {post.content.map((para, i) => (
            <p
              key={i}
              style={{ color: "var(--gray-mid)", lineHeight: 1.85, fontSize: "0.95rem" }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Tags / Share */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            marginTop: "3rem",
            paddingTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <Link
            to="/news"
            style={{
              color: "var(--blue-deep)",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            ← Retour aux actualités
          </Link>
          <Link
            to="/contact"
            style={{
              background: "var(--blue-deep)",
              color: "white",
              padding: "10px 22px",
              borderRadius: "2px",
              fontWeight: 600,
              fontSize: "0.8rem",
              letterSpacing: "0.06em",
              textDecoration: "none",
            }}
          >
            Discutons-en →
          </Link>
        </div>
      </div>

      {/* Related articles */}
      {others.length > 0 && (
        <section style={{ background: "var(--gray-light)", padding: "60px 24px" }}>
          <div className="max-w-7xl mx-auto">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              À lire également
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  to={`/news/${p.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "white",
                      borderRadius: "4px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      transition: "box-shadow 0.2s",
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 6px 24px rgba(26,58,143,0.10)";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    <img
                      src={p.photo}
                      alt={p.title}
                      style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ padding: "1.25rem" }}>
                      <span
                        style={{
                          color: "var(--blue-mid)",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {p.category}
                      </span>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "0.95rem",
                          lineHeight: 1.35,
                          marginTop: "0.4rem",
                          color: "var(--text-dark)",
                        }}
                      >
                        {p.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
