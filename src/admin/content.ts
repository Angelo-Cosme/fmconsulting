import type { ImageRef, Post, RichDoc, RichNode } from "@/lib/news";

export const emptyDoc = (): RichDoc => ({ type: "doc", content: [{ type: "paragraph" }] });

function collectImages(node: RichNode, out: ImageRef[]) {
  const attrs = node.attrs as (ImageRef & Record<string, unknown>) | undefined;
  if (node.type === "image" && attrs?.path && Array.isArray(attrs.widths)) {
    out.push({ path: attrs.path, width: attrs.width, height: attrs.height, alt: attrs.alt ?? "", widths: attrs.widths, ext: attrs.ext });
  }
  node.content?.forEach((child) => collectImages(child, out));
}

/** Toutes les images d'un article (couverture + images du contenu), pour le nettoyage du stockage. */
export function postImages(post: Pick<Post, "cover" | "content">): ImageRef[] {
  const images: ImageRef[] = post.cover ? [post.cover] : [];
  if (post.content) collectImages(post.content, images);
  return images;
}

/** Vrai si le document ne contient aucun texte ni média. */
export function isEmptyDoc(doc: RichDoc): boolean {
  const hasContent = (n: RichNode): boolean =>
    (n.type === "text" && Boolean(n.text?.trim())) || n.type === "image" || n.type === "youtube" || Boolean(n.content?.some(hasContent));
  return !hasContent(doc);
}

export function slugify(value: string): string {
  return (
    value
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "article"
  );
}
