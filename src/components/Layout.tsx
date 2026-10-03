import { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useLocation, ScrollRestoration } from "react-router";
import logoSrc from "@/imports/logo-fm-consulting.png";
import { Arrow, SocialIcon, socialLinks } from "./ui";

const links = [
  { to: "/", label: "Accueil", end: true },
  { to: "/about", label: "À propos" },
  { to: "/services", label: "Services" },
  { to: "/news", label: "Actualités" },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration />

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "border-b border-line bg-canvas/85 backdrop-blur-xl"
            : "border-b border-transparent bg-canvas"
        }`}
      >
        <div className="container-site flex h-18 items-center justify-between">
          <Link to="/" className="shrink-0" aria-label="FM Consulting — accueil">
            <img src={logoSrc} alt="FM Consulting" className="h-10 w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm transition-colors ${
                    isActive ? "bg-white text-ink shadow-sm ring-1 ring-line" : "text-muted hover:text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/contact" className="btn btn-primary hidden !py-2.5 md:inline-flex">
            Nous contacter
          </Link>

          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                menuOpen ? "rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                menuOpen ? "-rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </div>

      </header>

      {menuOpen && (
        <div className="fixed inset-x-0 top-18 bottom-0 z-40 overflow-y-auto bg-canvas md:hidden">
          <nav className="container-site flex flex-col pt-6">
            {[...links, { to: "/contact", label: "Nous contacter", end: false }].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex items-center justify-between border-b border-line py-5 font-display text-2xl font-semibold ${
                    isActive ? "text-brand-600" : "text-ink"
                  }`
                }
              >
                {l.label}
                <Arrow className="text-muted" />
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-white">
        <div className="container-site grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <img src={logoSrc} alt="FM Consulting" className="h-10 w-auto object-contain" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              Cabinet de conseil expert en stratégie, organisation et transformation
              d'entreprise. Votre partenaire de confiance pour réussir.
            </p>
            <div className="mt-8 flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  title={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink"
                >
                  <SocialIcon path={s.path} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Navigation</h4>
            <nav className="mt-5 flex flex-col gap-3">
              {[...links, { to: "/contact", label: "Contact" }].map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Contact</h4>
            <div className="mt-5 flex flex-col gap-3 text-sm text-ink-soft">
              <p>Cotonou, Bénin</p>
              <p>75008 Paris, France</p>
              <a href="tel:+2290123456789" className="hover:text-brand-600">
                +229 (0)1 23 45 67 89
              </a>
              <a href="mailto:contact@fmconsultingplus.com" className="hover:text-brand-600">
                contact@fmconsultingplus.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-line">
          <div className="container-site flex flex-col gap-2 py-6 text-xs text-muted md:flex-row md:justify-between">
            <p>© {new Date().getFullYear()} FM Consulting. Tous droits réservés.</p>
            <p>Cotonou · Paris</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
