import type { RichDoc, RichNode } from "@/lib/news";

export const emptyDoc = (): RichDoc => ({ type: "doc", content: [{ type: "paragraph" }] });

/** Vrai si le document ne contient aucun texte ni média. */
export function isEmptyDoc(doc: RichDoc): boolean {
  const hasContent = (n: RichNode): boolean =>
    (n.type === "text" && Boolean(n.text?.trim())) ||
    n.type === "image" ||
    n.type === "youtube" ||
    n.type === "video" ||
    Boolean(n.content?.some(hasContent));
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
