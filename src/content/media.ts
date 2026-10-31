import type { ImageRef } from "@/lib/news";

// Photos et vidéos fournies avec le site (dossier public/media), optimisées pour le web.
// Elles servent de contenu par défaut : chaque image ou vidéo peut être remplacée depuis le dashboard.

const PHOTOS = {
  "sg-mae": [640, 427],
  "cabinet-delegation": [1080, 603],
  "afrodescendants-ouidah-save": [1280, 960],
  "fanou-ministre-mesrs": [1080, 1034],
  "fanou-directeur-associe": [720, 1080],
  "directeur-adjoint-case-pilote": [616, 1080],
  "fanou-cabinet": [482, 640],
  "seance-travail-mesrs": [1080, 720],
  "delegation-martinique-mae-2024": [640, 427],
  "echanges-mairie-ouidah": [1080, 720],
  "ministre-ladekan-case-pilote": [1080, 611],
  "signature-accords-cooperation-2025": [1280, 960],
  "marechal-afoukou-mae": [1080, 1005],
  "marechal-ladekan-mesrs-2024": [1028, 1080],
  "fondation-clement-fort-de-france": [640, 480],
  "delegation-case-pilote-ouidah": [1080, 720],
  "fanou-directeur-associe-2026": [864, 1080],
  // Portraits de l'équipe : détourés et recadrés sur un fond commun (800 × 1000).
  "equipe-endurance-martial-fanou-2026": [800, 1000],
  "equipe-romain-da-costa": [800, 1000],
  "equipe-brice-crinot": [800, 1000],
  "equipe-jean-benoit-alokpon": [800, 1000],
  "equipe-patrick-voglozin-fond": [800, 1000],
} as const;

const VIDEOS = {
  "reception-bernard-hayot": [480, 800],
  "seance-travail-mae": [480, 848],
  "gala-save-martinique": [480, 848],
  "yekeyeke-grand-popo-2025": [540, 960],
  "delegation-martinique-ouidah": [480, 848],
  "delegation-martinique-save": [480, 848],
  "case-pilote-centre-eya": [540, 960],
  "ministre-mesrs-hommes-affaires-martiniquais": [480, 854],
  "ancb-smcl-2026": [480, 854],
} as const;

export type PhotoName = keyof typeof PHOTOS;
export type VideoName = keyof typeof VIDEOS;

/**
 * Vidéo : fichier (fourni avec le site ou envoyé dans Supabase Storage, `path` renseigné)
 * ou lien YouTube. `poster` : image affichée avant la lecture.
 */
export type VideoRef = {
  src: string;
  path?: string;
  poster?: ImageRef | null;
  width?: number;
  height?: number;
};

export function photo(name: PhotoName, alt: string): ImageRef {
  const [width, height] = PHOTOS[name];
  return {
    url: `media/photos/${name}.webp`,
    ...(width > 640 ? { small: `media/photos/${name}-640.webp` } : {}),
    width,
    height,
    alt,
  };
}

export function video(name: VideoName, alt: string): VideoRef {
  const [width, height] = VIDEOS[name];
  return {
    src: `media/videos/${name}.mp4`,
    poster: { url: `media/videos/${name}.webp`, width, height, alt },
    width,
    height,
  };
}
