import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router";
import type { Link as LinkValue } from "@/content/schema";
import type { PageContent } from "@/content/pages";
import { usePage } from "@/content/SiteContent";
import { PostImage } from "./news";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={`arrow h-4 w-4 ${className}`}>
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

export function PhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.8 2 2 0 0 1 3.1 1.6h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.1 9.4a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Réseaux sociaux ─────────────────────────────────────────────────────────
const SOCIAL_PATHS = {
  facebook: { name: "Facebook", path: "M13.5 22v-8h2.7l.4-3h-3.1V7.5c0-.9.3-1.5 1.6-1.5H17V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.3v8h3.2Z" },
  linkedin: {
    name: "LinkedIn",
    path: "M6.94 8.86a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88ZM5.36 9.9h3.15v9.7H5.36V9.9Zm5.1 0h3.02v1.33h.04c.42-.8 1.45-1.65 2.99-1.65 3.2 0 3.78 2.1 3.78 4.83v5.19h-3.15v-4.86c0-1.16-.02-2.66-1.62-2.66-1.63 0-1.88 1.27-1.88 2.58v4.94h-3.15V9.9Z",
  },
  instagram: {
    name: "Instagram",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A5.8 5.8 0 1 1 6.2 13 5.8 5.8 0 0 1 12 7.2Zm0 2A3.8 3.8 0 1 0 15.8 13 3.8 3.8 0 0 0 12 9.2Zm5.3-3.1a1.3 1.3 0 1 1-1.3-1.3 1.3 1.3 0 0 1 1.3 1.3Z",
  },
  youtube: {
    name: "YouTube",
    path: "M23.5 6.5c-.3-1.2-1.3-2.2-2.5-2.5C19.1 3.5 12 3.5 12 3.5s-7.1 0-9 .5c-1.2.3-2.2 1.3-2.5 2.5C0 8.4 0 12 0 12s0 3.6.5 5.5c.3 1.2 1.3 2.2 2.5 2.5 1.9.5 9 .5 9 .5s7.1 0 9-.5c1.2-.3 2.2-1.3 2.5-2.5.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5ZM9.75 15.5v-7l6.25 3.5-6.25 3.5Z",
  },
  x: { name: "X", path: "M18.2 2.25h3.3l-7.2 8.26 8.5 11.24h-6.6l-5.2-6.8-6 6.8H1.7l7.7-8.8L1.25 2.25H8.1l4.7 6.2 5.4-6.2Zm-1.2 17.5h1.8L7.1 4.1H5.1l11.9 15.65Z" },
  tiktok: {
    name: "TikTok",
    path: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z",
  },
} as const;

export const SHARE_ICONS = { facebook: SOCIAL_PATHS.facebook.path, linkedin: SOCIAL_PATHS.linkedin.path };

/** Réseaux renseignés dans « Paramètres généraux ». */
export function useSocialLinks() {
  const { social } = usePage("settings");
  return (Object.keys(SOCIAL_PATHS) as (keyof typeof SOCIAL_PATHS)[])
    .filter((key) => social[key]?.trim())
    .map((key) => ({ key, href: social[key].trim(), ...SOCIAL_PATHS[key] }));
}

export function SocialIcon({ path, className = "h-4 w-4" }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} fill-current`}>
      <path d={path} />
    </svg>
  );
}

export function SocialLinks({ className = "", itemClassName = "" }: { className?: string; itemClassName?: string }) {
  const links = useSocialLinks();
  if (!links.length) return null;
  return (
    <div className={`flex gap-2 ${className}`}>
      {links.map((s) => (
        <a key={s.key} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} title={s.name} className={itemClassName}>
          <SocialIcon path={s.path} />
        </a>
      ))}
    </div>
  );
}

// ─── Textes saisis dans le dashboard ─────────────────────────────────────────

/** Texte d'une ligne ou d'un titre : *mot* → italique élégant, retours à la ligne conservés. */
export function Rich({ text }: { text: string | undefined }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line.split(/(\*[^*]+\*)/g).map((part, j) =>
            part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
              <span key={j} className="accent">
                {part.slice(1, -1)}
              </span>
            ) : (
              part
            ),
          )}
        </Fragment>
      ))}
    </>
  );
}

/** Texte long : une ligne vide sépare deux paragraphes. */
export function Paragraphs({ text, className = "" }: { text: string | undefined; className?: string }) {
  const paragraphs = (text ?? "").split(/\n\s*\n/).filter((p) => p.trim());
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={className}>
          <Rich text={p.trim()} />
        </p>
      ))}
    </>
  );
}

export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Lien interne (/page) ou externe (https://…, mailto:, tel:). */
export function SmartLink({ href, className, children, ...rest }: { href: string; className?: string; children: ReactNode; "aria-label"?: string }) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link to={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/i.test(href);
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>
      {children}
    </a>
  );
}

export function Button({ link, variant = "primary", className = "" }: { link: LinkValue | undefined; variant?: "primary" | "dark" | "outline" | "light" | "sun"; className?: string }) {
  if (!link?.label || !link.href) return null;
  return (
    <SmartLink href={link.href} className={`btn btn-${variant} ${className}`}>
      {link.label}
      <span className="dot" aria-hidden="true" />
    </SmartLink>
  );
}

export function Eyebrow({ children, tone = "default", className = "" }: { children: ReactNode; tone?: "default" | "light" | "solid"; className?: string }) {
  if (!children) return null;
  return <span className={`eyebrow ${tone === "light" ? "eyebrow-light" : tone === "solid" ? "eyebrow-solid" : ""} ${className}`}>{children}</span>;
}

// ─── Animations ──────────────────────────────────────────────────────────────

/** Fait apparaître son contenu en fondu lorsqu'il entre dans l'écran. */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "li" | "article" }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "is-in" : ""} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/** Compteur animé de 0 à la valeur, au premier affichage. */
export function Counter({ value }: { value: string }) {
  const target = Number.parseFloat(value.replace(",", "."));
  const decimals = (value.split(/[.,]/)[1] ?? "").length;
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(Number.isFinite(target) ? 0 : null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setCurrent(target);
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1600);
        setCurrent(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {current === null ? value : current.toFixed(decimals).replace(".", ",")}
    </span>
  );
}

// ─── Blocs communs ───────────────────────────────────────────────────────────

export function SectionTitle({
  eyebrow,
  title,
  center = false,
  light = false,
  className = "",
  children,
}: {
  eyebrow?: string;
  title: string;
  center?: boolean;
  light?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow tone={light ? "light" : "default"}>{eyebrow}</Eyebrow>}
      <h2 className={`mt-5 text-4xl md:text-5xl lg:text-[3.5rem] ${light ? "text-white" : ""}`}>
        <Rich text={title} />
      </h2>
      {children}
    </Reveal>
  );
}

/** En-tête des pages intérieures : grand bloc arrondi avec image et titre. */
export function PageHero({ eyebrow, title, text, image }: { eyebrow?: string; title: string; text?: string; image?: PageContent<"about">["header"]["image"] }) {
  return (
    <section className="block-wide relative overflow-hidden bg-ink">
      {image && <PostImage image={image} eager sizes="100vw" className="absolute inset-0 h-full w-full" />}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/30" />
      <div className="container-site relative pt-28 pb-20 md:pt-40 md:pb-28">
        <div className="fade-up max-w-3xl">
          {eyebrow && <Eyebrow tone="light">{eyebrow}</Eyebrow>}
          <h1 className="mt-6 text-5xl text-white md:text-7xl">
            <Rich text={title} />
          </h1>
          {text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{text}</p>}
        </div>
      </div>
    </section>
  );
}

/** En-tête simple, sans image. */
export function PageHeader({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <section className="container-site pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="fade-up max-w-3xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-6 text-5xl md:text-7xl">
          <Rich text={title} />
        </h1>
        {text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{text}</p>}
      </div>
    </section>
  );
}

/** Bandeau d'appel à l'action (Paramètres généraux > Bandeau d'appel à l'action). */
export function CtaBand() {
  const { cta } = usePage("settings");
  if (!cta.visible) return null;
  return (
    <section className="block-wide relative my-6 overflow-hidden bg-brand md:my-10">
      {cta.image && <PostImage image={cta.image} sizes="100vw" className="absolute inset-0 h-full w-full opacity-25 mix-blend-luminosity" />}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-brand via-brand/90 to-brand/40" />
      <div className="container-site relative flex flex-col gap-10 py-20 md:flex-row md:items-end md:justify-between md:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl text-white md:text-6xl">
            <Rich text={cta.title} />
          </h2>
          {cta.text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{cta.text}</p>}
        </Reveal>
        <Button link={cta.link} variant="sun" className="self-start md:self-auto" />
      </div>
    </section>
  );
}
