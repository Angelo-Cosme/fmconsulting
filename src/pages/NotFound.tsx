import { Link } from "react-router";

export function NotFound() {
  return (
    <section className="container-site py-32 text-center md:py-48">
      <p className="font-display text-8xl font-extrabold tracking-tighter text-brand-600/20 md:text-[10rem]">404</p>
      <h1 className="mt-4 text-4xl md:text-5xl">
        Page <span className="accent">introuvable</span>
      </h1>
      <p className="mx-auto mt-4 max-w-md text-muted">La page demandée n'existe pas ou a été déplacée.</p>
      <Link to="/" className="btn btn-primary mt-10">
        Retour à l'accueil
        <span className="dot" aria-hidden="true" />
      </Link>
    </section>
  );
}
