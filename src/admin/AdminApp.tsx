import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router";
import type { Session } from "@supabase/supabase-js";
import logoSrc from "@/imports/logo-fm-consulting.png";
import { isConfigured } from "@/lib/news";
import { pages } from "@/content/pages";
import { supabase } from "./supabase";
import Dashboard, { EDITABLE_PAGES } from "./Dashboard";
import PageEditor from "./PageEditor";
import Messages from "./Messages";
import PostList from "./PostList";
import PostEditor from "./PostEditor";

type AuthState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "forbidden"; session: Session }
  | { status: "ready"; session: Session };

export default function AdminApp() {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    document.title = "Dashboard — FM Consulting";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);

    async function resolve(session: Session | null) {
      if (!session) return setAuth({ status: "signed-out" });
      // La politique RLS ne laisse lire sa ligne qu'à un administrateur.
      const { data } = await supabase.from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
      setAuth(data ? { status: "ready", session } : { status: "forbidden", session });
    }

    supabase.auth.getSession().then(({ data }) => resolve(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") resolve(session);
    });
    return () => {
      sub.subscription.unsubscribe();
      meta.remove();
    };
  }, []);

  if (!isConfigured) {
    return (
      <Centered>
        <h1 className="text-2xl font-semibold">Supabase n'est pas configuré</h1>
        <p className="mt-3 text-sm text-muted">
          Renseignez <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans le fichier{" "}
          <code>.env</code> (voir <code>.env.example</code>), puis relancez le serveur.
        </p>
      </Centered>
    );
  }

  if (auth.status === "loading") return <Centered><p className="text-sm text-muted">Chargement…</p></Centered>;
  if (auth.status === "signed-out") return <Login />;
  if (auth.status === "forbidden") {
    return (
      <Centered>
        <h1 className="text-2xl font-semibold">Accès non autorisé</h1>
        <p className="mt-3 text-sm text-muted">
          Le compte {auth.session.user.email} n'est pas administrateur du site.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="btn btn-outline mt-6">
          Se déconnecter
        </button>
      </Centered>
    );
  }

  return <Shell session={auth.session} />;
}

function Shell({ session }: { session: Session }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const location = useLocation();

  const refreshUnread = useCallback(() => {
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false)
      .then(({ count }) => setUnread(count ?? 0));
  }, []);

  useEffect(() => refreshUnread(), [refreshUnread]);
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-mist/60">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg hover:bg-mist lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
                <path d={menuOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <Link to="/admin" aria-label="Tableau de bord">
              <img src={logoSrc} alt="FM Consulting" className="h-8 w-auto" />
            </Link>
            <span className="hidden rounded-full bg-mist px-3 py-1 text-xs font-medium text-muted sm:inline">Administration</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted md:inline">{session.user.email}</span>
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline !px-4 !py-2 text-sm">
              Voir le site ↗
            </a>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed inset-y-0 top-16 left-0 z-30 w-72 shrink-0 overflow-y-auto border-r border-line bg-white px-4 py-6 transition-transform lg:sticky lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
            menuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          <nav className="space-y-8" aria-label="Administration">
            <div>
              <SideLink to="/admin" end icon="M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10">
                Tableau de bord
              </SideLink>
            </div>
            <SideGroup title="Pages du site">
              {EDITABLE_PAGES.map((id) => (
                <SideLink key={id} to={`/admin/pages/${id}`} icon="M6 3h9l5 5v13H6zM14 3v6h6">
                  {pages[id].title}
                </SideLink>
              ))}
            </SideGroup>
            <SideGroup title="Contenus">
              <SideLink to="/admin/posts" icon="M4 5h16M4 10h16M4 15h10M4 20h7">
                Articles (actualités)
              </SideLink>
              <SideLink to="/admin/messages" icon="M4 6h16v12H4zM4 7l8 6 8-6" badge={unread}>
                Messages
              </SideLink>
            </SideGroup>
            <SideGroup title="Réglages">
              <SideLink to="/admin/settings" icon="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z">
                Paramètres généraux
              </SideLink>
            </SideGroup>
            <div className="border-t border-line pt-6">
              <button onClick={() => supabase.auth.signOut()} className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-mist hover:text-ink">
                Se déconnecter
              </button>
            </div>
          </nav>
        </aside>
        {menuOpen && <div className="fixed inset-0 top-16 z-20 bg-ink/30 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

        <main className="min-w-0 flex-1 px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto max-w-6xl">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="pages/:pageId" element={<PageEditor />} />
              <Route path="settings" element={<PageEditor id="settings" />} />
              <Route path="posts" element={<PostList />} />
              <Route path="posts/new" element={<PostEditor />} />
              <Route path="posts/:id" element={<PostEditor />} />
              <Route path="messages" element={<Messages onUnreadChange={refreshUnread} />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function SideGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 px-3 text-xs font-semibold tracking-[0.12em] text-muted uppercase">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SideLink({ to, icon, end = false, badge = 0, children }: { to: string; icon: string; end?: boolean; badge?: number; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-brand-50 font-semibold text-brand-600" : "text-ink-soft hover:bg-mist hover:text-ink"}`
      }
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
        <path d={icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="flex-1">{children}</span>
      {badge > 0 && <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">{badge}</span>}
    </NavLink>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-sm text-center">{children}</div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message === "Invalid login credentials" ? "Email ou mot de passe incorrect." : error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <form onSubmit={submit} className="card w-full max-w-sm p-8">
        <img src={logoSrc} alt="FM Consulting" className="h-10 w-auto" />
        <h1 className="mt-8 text-2xl font-semibold">Connexion</h1>
        <p className="mt-1 text-sm text-muted">Espace d'administration du site</p>
        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="field-label">Email</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="password" className="field-label">Mot de passe</label>
            <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field" />
          </div>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full disabled:opacity-60">
          {busy ? "Connexion…" : "Se connecter"}
        </button>
        <Link to="/" className="mt-6 block text-center text-xs text-muted hover:text-ink">
          ← Retour au site
        </Link>
      </form>
    </div>
  );
}
