import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { News } from "./pages/News";
import { NewsPost } from "./pages/NewsPost";
import { Contact } from "./pages/Contact";

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
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "news", Component: News },
      { path: "news/:slug", Component: NewsPost },
      { path: "contact", Component: Contact },
    ],
  },
]);
