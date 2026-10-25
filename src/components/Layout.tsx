import { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useLocation, ScrollRestoration } from "react-router";
import logoSrc from "@/imports/logo-fm-consulting.png";
import { SiteContentProvider, usePage, useSiteReady } from "@/content/SiteContent";
import { Arrow, PhoneIcon, phoneHref, SocialLinks } from "./ui";

export const NAV_LINKS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/cabinet", label: "Le cabinet" },
  { to: "/expertises", label: "Expertises" },
  { to: "/mediatheque", label: "Médiathèque" },
  { to: "/actualites", label: "Actualités" },
];

export function Layout() {
  return (
    <SiteContentProvider>
      <Shell />
    </SiteContentProvider>
  );
}

function Shell() {
  const ready = useSiteReady();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { contact } = usePage("settings");

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  // Le contenu modifié dans le dashboard est chargé avant l'affichage (4 s au plus).
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <img src={logoSrc} alt="FM Consulting" className="h-12 w-auto animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration />

      {/* Barre d'informations */}
      <div className="container-site hidden pt-4 lg:block">
        <div className="flex items-center justify-between rounded-full border border-line px-7 py-2.5 text-sm text-muted">
          <div className="flex gap-8">
            {contact.phone && (
              <span>
                Appelez-nous :{" "}
                <a href={phoneHref(contact.phone)} className="text-ink hover:text-brand-600">
                  {contact.phone}
                </a>
              </span>
            )}
            {contact.email && (
              <span>
                Écrivez-nous :{" "}
                <a href={`mailto:${contact.email}`} className="text-ink hover:text-brand-600">
                  {contact.email}
                </a>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <SocialLinks itemClassName="text-ink-soft transition-colors hover:text-brand-600" className="gap-3" />
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen ? "bg-white/90 shadow-[0_8px_30px_-12px_rgba(10,22,48,0.18)] backdrop-blur-xl" : "bg-canvas"
        }`}
      >
        <div className="container-site flex h-20 items-center justify-between gap-6 lg:h-24">
          <Link to="/" className="shrink-0" aria-label="FM Consulting, accueil">
            <img src={logoSrc} alt="FM Consulting" className="h-11 w-auto object-contain lg:h-12" />
          </Link>

          <nav className="hidden items-center rounded-full bg-mist p-1.5 lg:flex" aria-label="Navigation principale">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors ${isActive ? "bg-white text-brand-600 shadow-sm" : "text-ink hover:text-brand-600"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            {contact.phone && (
              <a href={phoneHref(contact.phone)} className="group hidden items-center gap-3 xl:flex">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white transition-colors group-hover:bg-brand-600">
                  <PhoneIcon />
                </span>
                <span className="font-semibold">{contact.phone}</span>
              </a>
            )}
            <Link to="/contact" className="btn btn-outline">
              Nous contacter
              <span className="dot" aria-hidden="true" />
            </Link>
          </div>

          <button
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-mist lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            <span className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-300 ${menuOpen ? "rotate-45" : "-translate-y-1"}`} />
            <span className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-300 ${menuOpen ? "-rotate-45" : "translate-y-1"}`} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto bg-white lg:hidden">
          <nav className="container-site flex flex-col pt-4 pb-10" aria-label="Navigation mobile">
            {[...NAV_LINKS, { to: "/contact", label: "Contact", end: false }].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex items-center justify-between border-b border-line py-5 font-display text-2xl font-semibold tracking-tight ${isActive ? "text-brand-600" : "text-ink"}`
                }
              >
                {l.label}
                <Arrow className="text-muted" />
              </NavLink>
            ))}
            <div className="mt-8 space-y-2 text-ink-soft">
              {contact.phone && (
                <a href={phoneHref(contact.phone)} className="block font-semibold text-ink">
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="block">
                  {contact.email}
                </a>
              )}
            </div>
            <SocialLinks
              className="mt-6"
              itemClassName="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft hover:border-ink hover:text-ink"
            />
          </nav>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  const { contact, footer } = usePage("settings");
  const { list: expertises } = usePage("services");

  return (
    <footer className="block-wide relative mt-6 mb-2 overflow-hidden bg-ink text-white md:mb-4">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-brand-600/40 blur-[120px]" />
      <div className="container-site relative grid gap-12 pt-20 pb-12 md:grid-cols-12 md:pt-24">
        <div className="md:col-span-5">
          <h2 className="text-4xl text-white md:text-5xl">{footer.title}</h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-white/65">
            {contact.email && (
              <>
                Écrivez-nous à{" "}
                <a href={`mailto:${contact.email}`} className="text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                  {contact.email}
                </a>{" "}
                ou via notre{" "}
              </>
            )}
            <Link to="/contact" className="text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
              formulaire de contact
            </Link>
            .
          </p>
          <SocialLinks
            className="mt-8"
            itemClassName="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Le site</h3>
          <nav className="mt-5 flex flex-col gap-3">
            {[...NAV_LINKS, { to: "/contact", label: "Contact" }].map((l) => (
              <Link key={l.to} to={l.to} className="text-[15px] text-white/85 transition-colors hover:text-sun">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Expertises</h3>
          <nav className="mt-5 flex flex-col gap-3">
            {expertises.items.slice(0, 6).map((item) => (
              <Link key={item.title} to="/expertises" className="text-[15px] text-white/85 transition-colors hover:text-sun">
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Contact</h3>
          <div className="mt-5 flex flex-col gap-3 text-[15px] text-white/85">
            {contact.addresses.map((a) => (
              <p key={a.label + a.text} className="whitespace-pre-line">
                {a.text}
              </p>
            ))}
            {contact.phone && (
              <a href={phoneHref(contact.phone)} className="hover:text-sun">
                {contact.phone}
              </a>
            )}
            {contact.phone2 && (
              <a href={phoneHref(contact.phone2)} className="hover:text-sun">
                {contact.phone2}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="container-site relative">
        <div className="flex justify-center border-t border-white/10 pt-14 pb-10">
          <img src={logoSrc} alt="FM Consulting" className="h-16 w-auto brightness-0 invert md:h-24" />
        </div>
        {footer.about && <p className="mx-auto max-w-2xl pb-10 text-center text-sm leading-relaxed text-white/55">{footer.about}</p>}
        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/50 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {footer.copyright}
          </p>
          <Link to="/admin" className="hover:text-white" rel="nofollow">
            Espace administration
          </Link>
        </div>
      </div>
    </footer>
  );
}
