// Description des champs modifiables depuis le dashboard.
// Chaque page est découpée en sections ; chaque section liste ses champs et son contenu par défaut.

type Base = { key: string; label: string; help?: string };

export type Field =
  | (Base & { type: "text"; placeholder?: string })
  | (Base & { type: "textarea"; rows?: number })
  | (Base & { type: "image" })
  | (Base & { type: "video" })
  | (Base & { type: "link" })
  | (Base & { type: "select"; options: { value: string; label: string }[] })
  | (Base & {
      type: "list";
      /** Nom d'un élément (« une carte », « une question »…) pour le bouton d'ajout. */
      item: string;
      fields: Field[];
      /** Champ utilisé comme titre de l'élément replié. */
      summary?: string;
      max?: number;
    });

export type Link = { label: string; href: string };

export type SectionDef<D extends Record<string, unknown> = Record<string, unknown>> = {
  label: string;
  help?: string;
  /** La section peut être masquée sur le site (interrupteur « Afficher cette section »). */
  hideable?: boolean;
  /** Masquée par défaut (ex. témoignages en attente de contenu). */
  hiddenByDefault?: boolean;
  fields: Field[];
  defaults: D;
};

export type PageDef = {
  title: string;
  /** Adresse de la page sur le site (null pour les paramètres généraux). */
  path: string | null;
  help: string;
  sections: Record<string, SectionDef>;
};

export const section = <D extends Record<string, unknown>>(def: SectionDef<D>) => def;

// Raccourcis de déclaration des champs.
export const text = (key: string, label: string, help?: string): Field => ({ type: "text", key, label, help });
export const area = (key: string, label: string, help?: string, rows = 4): Field => ({ type: "textarea", key, label, help, rows });
export const image = (key: string, label: string, help?: string): Field => ({ type: "image", key, label, help });
export const videoField = (key: string, label: string, help?: string): Field => ({ type: "video", key, label, help });
export const link = (key: string, label: string, help?: string): Field => ({ type: "link", key, label, help });
export const list = (key: string, label: string, item: string, fields: Field[], opts: { summary?: string; help?: string; max?: number } = {}): Field => ({
  type: "list",
  key,
  label,
  item,
  fields,
  ...opts,
});

export const ACCENT_HELP = "Entourez un mot d'astérisques pour le mettre en italique élégant : Nos *réalisations*.";
