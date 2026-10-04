import { useEffect, useState, type FormEvent } from "react";
import { Link, Route, Routes } from "react-router";
import type { Session } from "@supabase/supabase-js";
import logoSrc from "@/imports/logo-fm-consulting.png";
import { isConfigured } from "@/lib/news";
import { supabase } from "./supabase";
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

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" aria-label="Dashboard">
              <img src={logoSrc} alt="FM Consulting" className="h-8 w-auto" />
            </Link>
            <span className="hidden rounded-full bg-mist px-3 py-1 text-xs font-medium text-muted sm:inline">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted md:inline">{auth.session.user.email}</span>
            <Link to="/news" className="text-muted hover:text-ink">
              Voir le site
            </Link>
            <button onClick={() => supabase.auth.signOut()} className="cursor-pointer text-muted hover:text-ink">
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      <main className="container-site py-10">
        <Routes>
          <Route index element={<PostList />} />
          <Route path="posts/new" element={<PostEditor />} />
          <Route path="posts/:id" element={<PostEditor />} />
          <Route path="*" element={<PostList />} />
        </Routes>
      </main>
    </div>
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
        <p className="mt-1 text-sm text-muted">Espace de gestion des actualités</p>
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
