import type { ReactNode } from "react";
import type { ImageRef, RichMark, RichNode } from "@/lib/news";
import { parseYouTubeId } from "@/lib/youtube";
import { LiteYouTube, PostImage } from "./news";

// Affiche le contenu de l'éditeur (JSON Tiptap) sans charger Tiptap côté visiteurs.
// Seuls les nœuds et marques connus sont rendus ; le reste est ignoré.

const SAFE_URL = /^(https?:|mailto:|tel:|\/|#)/i;

function safeHref(href: unknown): string | null {
  return typeof href === "string" && SAFE_URL.test(href.trim()) ? href.trim() : null;
}

function applyMark(mark: RichMark, child: ReactNode, key: number): ReactNode {
  switch (mark.type) {
    case "bold":
      return <strong key={key}>{child}</strong>;
    case "italic":
      return <em key={key}>{child}</em>;
    case "underline":
      return <u key={key}>{child}</u>;
    case "strike":
      return <s key={key}>{child}</s>;
    case "code":
      return <code key={key}>{child}</code>;
    case "link": {
      const href = safeHref(mark.attrs?.href);
      if (!href) return child;
      const external = /^https?:/i.test(href);
      return (
        <a key={key} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {child}
        </a>
      );
    }
    default:
      return child;
  }
}

function isImageRef(attrs: Record<string, unknown> | undefined): attrs is ImageRef & Record<string, unknown> {
  return Boolean(attrs && typeof attrs.path === "string" && Array.isArray(attrs.widths) && attrs.widths.length);
}

function renderNode(node: RichNode, key: number, title: string): ReactNode {
  const children = () => node.content?.map((child, i) => renderNode(child, i, title));

  switch (node.type) {
    case "text":
      return (node.marks ?? []).reduce<ReactNode>((acc, mark, i) => applyMark(mark, acc, i), node.text ?? "");
    case "paragraph":
      return node.content?.length ? <p key={key}>{children()}</p> : null;
    case "heading":
      return node.attrs?.level === 3 ? <h3 key={key}>{children()}</h3> : <h2 key={key}>{children()}</h2>;
    case "bulletList":
      return <ul key={key}>{children()}</ul>;
    case "orderedList":
      return <ol key={key} start={typeof node.attrs?.start === "number" ? node.attrs.start : undefined}>{children()}</ol>;
    case "listItem":
      return <li key={key}>{children()}</li>;
    case "blockquote":
      return <blockquote key={key}>{children()}</blockquote>;
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "image":
      return isImageRef(node.attrs) ? (
        <figure key={key}>
          <PostImage image={node.attrs} sizes="(min-width: 816px) 768px, 100vw" className="h-auto w-full rounded-2xl" />
          {node.attrs.alt && <figcaption>{node.attrs.alt}</figcaption>}
        </figure>
      ) : null;
    case "youtube": {
      const id = typeof node.attrs?.src === "string" ? parseYouTubeId(node.attrs.src) : null;
      return id ? (
        <figure key={key}>
          <LiteYouTube videoId={id} title={title} />
        </figure>
      ) : null;
    }
    default:
      return null;
  }
}

export default function RichText({ doc, title }: { doc: RichNode; title: string }) {
  return <div className="rich-text">{doc.content?.map((node, i) => renderNode(node, i, title))}</div>;
}
