import { createBrowserRouter, redirect } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Media } from "./pages/Media";
import { Smcl } from "./pages/Smcl";
import { News } from "./pages/News";
import { NewsPost } from "./pages/NewsPost";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    // Dashboard chargé à la demande : son code (et supabase-js) n'est jamais téléchargé par les visiteurs.
    path: "/admin/*",
    lazy: async () => ({ Component: (await import("./admin/AdminApp")).default }),
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "cabinet", Component: About },
      { path: "expertises", Component: Services },
      { path: "smcl-2026", Component: Smcl },
      { path: "mediatheque", Component: Media },
      { path: "actualites", Component: News },
      { path: "actualites/:slug", Component: NewsPost },
      { path: "contact", Component: Contact },
      // Anciennes adresses
      { path: "about", loader: () => redirect("/cabinet") },
      { path: "services", loader: () => redirect("/expertises") },
      { path: "news", loader: () => redirect("/actualites") },
      { path: "news/:slug", loader: ({ params }) => redirect(`/actualites/${params.slug}`) },
      { path: "*", Component: NotFound },
    ],
  },
]);
