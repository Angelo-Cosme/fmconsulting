import { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router";
import logoSrc from "@/imports/logo-fm-consulting.png";

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { to: "/", label: "Accueil", end: true },
    { to: "/about", label: "À propos" },
    { to: "/services", label: "Services" },
    { to: "/news", label: "Actualités" },
  ];

  return (
    <div className="min-h-full flex flex-col">
      {/* NAV */}
      <header
        style={{
          background: scrolled ? "rgba(255,255,255,0.97)" : "white",
          borderBottom: `1px solid var(--border)`,
          boxShadow: scrolled ? "0 2px 16px rgba(26,58,143,0.08)" : "none",
          transition: "box-shadow 0.3s, background 0.3s",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <img
              src={logoSrc}
              alt="FM Consulting"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `nav-link text-sm font-medium tracking-wide transition-colors ${isActive ? "active" : ""}`
                }
                style={({ isActive }) => ({
                  color: isActive ? "var(--blue-deep)" : "var(--gray-mid)",
                })}
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              style={{
                background: "var(--blue-deep)",
                color: "white",
                borderRadius: "2px",
                padding: "8px 20px",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLElement).style.background = "var(--blue-mid)")
              }
              onMouseOut={(e) =>
                ((e.target as HTMLElement).style.background = "var(--blue-deep)")
              }
            >
              Nous contacter
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "var(--blue-deep)",
                transition: "transform 0.3s",
                transform: menuOpen ? "rotate(45deg) translate(4px,4px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "var(--blue-deep)",
                opacity: menuOpen ? 0 : 1,
                transition: "opacity 0.2s",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "var(--blue-deep)",
                transition: "transform 0.3s",
                transform: menuOpen ? "rotate(-45deg) translate(4px,-4px)" : "none",
              }}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{ borderTop: "1px solid var(--border)", background: "white" }}
            className="md:hidden px-6 pb-6 pt-4 flex flex-col gap-4"
          >
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className="text-sm font-medium"
                style={({ isActive }) => ({
                  color: isActive ? "var(--blue-deep)" : "var(--gray-mid)",
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer style={{ background: "var(--text-dark)", color: "white" }}>
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
          <div>
            <img
              src={logoSrc}
              alt="FM Consulting"
              className="h-12 w-auto object-contain mb-4"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", lineHeight: 1.7 }}>
              Cabinet de conseil expert en stratégie, organisation et transformation
              d'entreprise. Votre partenaire de confiance pour réussir.
            </p>
          </div>
          <div>
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                marginBottom: "1rem",
                color: "var(--gold)",
              }}
            >
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", transition: "color 0.2s" }}
                  onMouseOver={(e) => ((e.target as HTMLElement).style.color = "white")}
                  onMouseOut={(e) =>
                    ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)")
                  }
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                marginBottom: "1rem",
                color: "var(--gold)",
              }}
            >
              Contact
            </h4>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", lineHeight: 2 }}>
              <p>Cotonou - Bénin</p>
              <p>75008 Paris, France</p>
              <p>+229 (0)1 23 45 67 89</p>
              <p>contact@fmconsultingplus.com</p>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "1.2rem 1.5rem",
            textAlign: "center",
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.75rem",
          }}
        >
          © {new Date().getFullYear()} FM Consulting. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
