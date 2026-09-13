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
    { to: "/contact", label: "Nous contacter" },
  ];

  const socialLinks = [
    {
      name: "YouTube",
      href: "https://www.youtube.com/",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 18, height: 18, fill: "currentColor" }}>
          <path d="M23.5 6.5c-.3-1.2-1.3-2.2-2.5-2.5C19.1 3.5 12 3.5 12 3.5s-7.1 0-9 .5c-1.2.3-2.2 1.3-2.5 2.5C0 8.4 0 12 0 12s0 3.6.5 5.5c.3 1.2 1.3 2.2 2.5 2.5 1.9.5 9 .5 9 .5s7.1 0 9-.5c1.2-.3 2.2-1.3 2.5-2.5.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5ZM9.75 15.5v-7l6.25 3.5-6.25 3.5Z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 18, height: 18, fill: "currentColor" }}>
          <path d="M13.5 22v-8h2.7l.4-3h-3.1V7.5c0-.9.3-1.5 1.6-1.5H17V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.3v8h3.2Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 18, height: 18, fill: "currentColor" }}>
          <path d="M6.94 8.86a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88ZM5.36 9.9h3.15v9.7H5.36V9.9Zm5.1 0h3.02v1.33h.04c.42-.8 1.45-1.65 2.99-1.65 3.2 0 3.78 2.1 3.78 4.83v5.19h-3.15v-4.86c0-1.16-.02-2.66-1.62-2.66-1.63 0-1.88 1.27-1.88 2.58v4.94h-3.15V9.9Z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 18, height: 18, fill: "currentColor" }}>
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A5.8 5.8 0 1 1 6.2 13 5.8 5.8 0 0 1 12 7.2Zm0 2A3.8 3.8 0 1 0 15.8 13 3.8 3.8 0 0 0 12 9.2Zm5.3-3.1a1.3 1.3 0 1 1-1.3-1.3 1.3 1.3 0 0 1 1.3 1.3Z" />
        </svg>
      ),
    },
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
            <NavLink
              to="/contact"
              className="text-sm font-medium"
              style={({ isActive }) => ({
                color: isActive ? "var(--blue-deep)" : "var(--gray-mid)",
              })}
            >
              Nous contacter
            </NavLink>
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

            <div style={{ marginTop: "1.5rem" }}>
              <h4
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1rem",
                  marginBottom: "0.8rem",
                  color: "var(--gold)",
                }}
              >
                Réseaux sociaux
              </h4>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    style={{
                      width: 34,
                      height: 34,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.08)",
                      color: "white",
                      transition: "background 0.2s, transform 0.2s",
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--gold)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                      (e.currentTarget as HTMLElement).style.transform = "none";
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
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
