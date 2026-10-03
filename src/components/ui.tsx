import type { ReactNode } from "react";
import { Link } from "react-router";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`arrow h-4 w-4 ${className}`}
    >
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    path: "M6.94 8.86a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88ZM5.36 9.9h3.15v9.7H5.36V9.9Zm5.1 0h3.02v1.33h.04c.42-.8 1.45-1.65 2.99-1.65 3.2 0 3.78 2.1 3.78 4.83v5.19h-3.15v-4.86c0-1.16-.02-2.66-1.62-2.66-1.63 0-1.88 1.27-1.88 2.58v4.94h-3.15V9.9Z",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    path: "M13.5 22v-8h2.7l.4-3h-3.1V7.5c0-.9.3-1.5 1.6-1.5H17V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.3v8h3.2Z",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A5.8 5.8 0 1 1 6.2 13 5.8 5.8 0 0 1 12 7.2Zm0 2A3.8 3.8 0 1 0 15.8 13 3.8 3.8 0 0 0 12 9.2Zm5.3-3.1a1.3 1.3 0 1 1-1.3-1.3 1.3 1.3 0 0 1 1.3 1.3Z",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/",
    path: "M23.5 6.5c-.3-1.2-1.3-2.2-2.5-2.5C19.1 3.5 12 3.5 12 3.5s-7.1 0-9 .5c-1.2.3-2.2 1.3-2.5 2.5C0 8.4 0 12 0 12s0 3.6.5 5.5c.3 1.2 1.3 2.2 2.5 2.5 1.9.5 9 .5 9 .5s7.1 0 9-.5c1.2-.3 2.2-1.3 2.5-2.5.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5ZM9.75 15.5v-7l6.25 3.5-6.25 3.5Z",
  },
];

export function SocialIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d={path} />
    </svg>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <section className="border-b border-line">
      <div className="container-site pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="fade-up max-w-3xl">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-6 text-4xl font-semibold md:text-6xl">{title}</h1>
          {description && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-5 text-3xl font-semibold md:text-5xl">{title}</h2>
        {description && <p className="mt-5 text-base leading-relaxed text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CtaBand({
  title = (
    <>
      Parlons de votre <span className="accent">prochain cap.</span>
    </>
  ),
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
}: {
  title?: ReactNode;
  description?: string;
}) {
  return (
    <section className="container-site py-20 md:py-28">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 md:px-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl"
        />
        <div className="relative flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold text-white md:text-5xl [&_.accent]:text-gold">
              {title}
            </h2>
            <p className="mt-5 leading-relaxed text-white/60">{description}</p>
          </div>
          <Link to="/contact" className="btn btn-light self-start md:self-auto">
            Nous contacter <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
