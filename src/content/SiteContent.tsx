import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/news";
import { mergePage, type PageContent, type PageId, type StoredPage } from "./pages";

type Stored = Partial<Record<PageId, StoredPage>>;
type State = { ready: boolean; stored: Stored };

const SiteContentContext = createContext<State>({ ready: true, stored: {} });

/** Au-delà de ce délai, le site s'affiche avec le contenu par défaut. */
const TIMEOUT_MS = 4000;

async function fetchSiteContent(): Promise<Stored> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_content?select=page,data`, {
      headers: { apikey: SUPABASE_ANON_KEY },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    const rows = (await res.json()) as { page: PageId; data: StoredPage }[];
    return Object.fromEntries(rows.map((row) => [row.page, row.data]));
  } finally {
    clearTimeout(timer);
  }
}

/** Charge une seule fois le contenu des pages modifié depuis le dashboard. */
export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ ready: !isConfigured, stored: {} });

  useEffect(() => {
    if (!isConfigured) return;
    fetchSiteContent().then(
      (stored) => setState({ ready: true, stored }),
      (err) => {
        console.warn("Contenu du dashboard indisponible, contenu par défaut affiché.", err);
        setState({ ready: true, stored: {} });
      },
    );
  }, []);

  return <SiteContentContext.Provider value={state}>{children}</SiteContentContext.Provider>;
}

export const useSiteReady = () => useContext(SiteContentContext).ready;

export function usePage<P extends PageId>(id: P): PageContent<P> {
  const { stored } = useContext(SiteContentContext);
  const data = stored[id];
  return useMemo(() => mergePage(id, data), [id, data]);
}
