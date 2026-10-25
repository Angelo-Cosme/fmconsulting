import type { ImageRef } from "@/lib/news";
import { photo, video, type VideoRef } from "./media";
import { ACCENT_HELP, area, image, link, list, section, text, videoField, type Field, type Link, type PageDef } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Contenu par défaut du site et champs modifiables depuis le dashboard (/admin).
// Les textes ci-dessous sont provisoires : ils seront remplacés par le contenu
// définitif du cabinet, directement depuis le dashboard.
// ─────────────────────────────────────────────────────────────────────────────

export const ICON_OPTIONS = [
  { value: "handshake", label: "Poignée de main" },
  { value: "community", label: "Communauté" },
  { value: "culture", label: "Culture" },
  { value: "education", label: "Éducation" },
  { value: "institution", label: "Institution" },
  { value: "globe", label: "Monde" },
  { value: "compass", label: "Boussole" },
  { value: "chart", label: "Suivi / résultats" },
  { value: "heart", label: "Engagement" },
  { value: "leaf", label: "Durable" },
  { value: "target", label: "Objectif" },
  { value: "people", label: "Équipe" },
];

const TONE_OPTIONS = [
  { value: "clay", label: "Terre cuite" },
  { value: "brand", label: "Bleu FM" },
  { value: "mist", label: "Gris clair" },
];

const icon = (key = "icon", label = "Icône"): Field => ({ type: "select", key, label, options: ICON_OPTIONS });
const tone: Field = { type: "select", key: "tone", label: "Couleur de la carte", options: TONE_OPTIONS };
const title = (key = "title", label = "Titre") => text(key, label, ACCENT_HELP);
const eyebrow = text("eyebrow", "Petit intitulé", "Affiché au-dessus du titre, dans une pastille.");

type Img = ImageRef | null;
type Vid = VideoRef | null;

// ─── Paramètres généraux ─────────────────────────────────────────────────────
const settings = {
  title: "Paramètres généraux",
  path: null,
  help: "Coordonnées, réseaux sociaux et pied de page : repris sur toutes les pages du site.",
  sections: {
    contact: section({
      label: "Coordonnées",
      help: "Affichées dans l'en-tête, le pied de page et la page Contact.",
      fields: [
        text("phone", "Téléphone principal", "Ex. +229 01 23 45 67 89"),
        text("phone2", "Téléphone secondaire", "Facultatif"),
        text("whatsapp", "Numéro WhatsApp", "Facultatif. Format international, ex. +229 01 23 45 67 89"),
        text("email", "Adresse email"),
        area("hours", "Horaires", undefined, 2),
        list("addresses", "Adresses", "une adresse", [text("label", "Intitulé", "Ex. Siège, Bureau Europe"), area("text", "Adresse", undefined, 3)], { summary: "label" }),
      ],
      defaults: {
        phone: "+229 01 23 45 67 89",
        phone2: "",
        whatsapp: "",
        email: "contact@fmconsultingplus.com",
        hours: "Du lundi au vendredi\n8h30 – 18h00",
        addresses: [
          { label: "Bénin", text: "Cotonou, Bénin" },
          { label: "France", text: "Paris, France" },
        ] as { label: string; text: string }[],
      },
    }),
    social: section({
      label: "Réseaux sociaux",
      help: "Collez l'adresse complète de chaque page. Laissez vide pour masquer l'icône.",
      fields: [
        text("facebook", "Facebook"),
        text("linkedin", "LinkedIn"),
        text("instagram", "Instagram"),
        text("youtube", "YouTube"),
        text("x", "X (Twitter)"),
        text("tiktok", "TikTok"),
      ],
      defaults: { facebook: "", linkedin: "", instagram: "", youtube: "", x: "", tiktok: "" },
    }),
    cta: section({
      label: "Bandeau d'appel à l'action",
      help: "Grand bandeau en bas des pages, juste avant le pied de page.",
      hideable: true,
      fields: [title(), area("text", "Texte"), link("link", "Bouton"), image("image", "Image de fond")],
      defaults: {
        title: "Un projet pour votre *territoire* ?",
        text: "Collectivités, institutions, associations : parlons de vos ambitions et construisons ensemble une démarche adaptée.",
        link: { label: "Prendre contact", href: "/contact" } as Link,
        image: photo("signature-accords-cooperation-2025", "Signature d'accords de coopération") as Img,
      },
    }),
    footer: section({
      label: "Pied de page",
      fields: [
        text("title", "Titre"),
        area("about", "Présentation courte du cabinet"),
        text("copyright", "Mention de copyright", "L'année est ajoutée automatiquement."),
      ],
      defaults: {
        title: "Une question ?",
        about: "Cabinet de conseil spécialisé dans les projets de développement communautaire, sociaux et culturels, entre l'Afrique, les Caraïbes et l'Europe.",
        copyright: "FM Consulting. Tous droits réservés.",
      },
    }),
  },
} satisfies PageDef;

// ─── Accueil ─────────────────────────────────────────────────────────────────
const home = {
  title: "Accueil",
  path: "/",
  help: "La page d'accueil, de haut en bas.",
  sections: {
    hero: section({
      label: "Grand bandeau d'ouverture",
      fields: [
        area("title", "Titre", "Une ligne par retour à la ligne. " + ACCENT_HELP, 3),
        area("text", "Texte d'introduction", undefined, 2),
        link("cta", "Bouton principal"),
        image("image", "Image de fond", "Format paysage, au moins 1600 px de large de préférence."),
        text("badge", "Texte du macaron rond", "Ex. Prendre rendez-vous"),
      ],
      defaults: {
        title: "Coopérer.\nTransmettre.\n*Développer.*",
        text: "Cabinet de conseil en développement communautaire, social et culturel, au service des territoires et de leurs habitants.",
        cta: { label: "Découvrir nos expertises", href: "/expertises" } as Link,
        image: photo("signature-accords-cooperation-2025", "Signature des accords de coopération entre les deux maires, août 2025") as Img,
        badge: "Prendre rendez-vous",
      },
    }),
    pillars: section({
      label: "Trois cartes de présentation",
      hideable: true,
      fields: [
        list("items", "Cartes", "une carte", [title(), area("text", "Texte", undefined, 3), link("link", "Lien"), image("image", "Image"), tone], {
          summary: "title",
          max: 3,
        }),
      ],
      defaults: {
        items: [
          {
            title: "Ce que nous faisons",
            text: "Nous concevons et accompagnons des projets de coopération, de développement local et de valorisation culturelle.",
            link: { label: "Nos expertises", href: "/expertises" },
            image: photo("echanges-mairie-ouidah", "Séance d'échanges à la mairie de Ouidah"),
            tone: "clay",
          },
          {
            title: "Nos valeurs",
            text: "Écoute, respect des cultures, transparence et exigence : des principes qui guident chacune de nos missions.",
            link: { label: "Le cabinet", href: "/cabinet" },
            image: photo("cabinet-delegation", "L'équipe du cabinet FM Consulting avec une délégation"),
            tone: "brand",
          },
          {
            title: "Notre impact",
            text: "Des partenariats concrets entre collectivités, institutions et communautés, de part et d'autre de l'Atlantique.",
            link: { label: "Nos actualités", href: "/actualites" },
            image: photo("afrodescendants-ouidah-save", "Des afrodescendants reçus par les maires de Ouidah et de Savè"),
            tone: "mist",
          },
        ] as { title: string; text: string; link: Link; image: Img; tone: string }[],
      },
    }),
    stats: section({
      label: "Chiffres clés",
      help: "Chiffres provisoires, à vérifier avant la mise en ligne.",
      hideable: true,
      fields: [
        image("image", "Image de fond"),
        list("items", "Chiffres", "un chiffre", [text("value", "Valeur", "Un nombre, ex. 12"), text("suffix", "Suffixe", "Ex. + ou %"), text("label", "Libellé")], {
          summary: "label",
          max: 4,
        }),
      ],
      defaults: {
        image: photo("ministre-ladekan-case-pilote", "Délégation de Case-Pilote avec la Ministre de l'Enseignement supérieur") as Img,
        items: [
          { value: "5", suffix: "+", label: "Communes partenaires" },
          { value: "2", suffix: "", label: "Continents reliés" },
          { value: "8", suffix: "+", label: "Missions et délégations" },
          { value: "5", suffix: "", label: "Domaines d'expertise" },
        ],
      },
    }),
    about: section({
      label: "Présentation du cabinet",
      hideable: true,
      fields: [
        eyebrow,
        title(),
        area("text", "Texte", "Laissez une ligne vide entre deux paragraphes.", 6),
        image("image", "Image principale"),
        text("badgeLabel", "Encadré : petit texte"),
        text("badgeValue", "Encadré : grand texte"),
        text("question", "Phrase d'invitation au contact"),
        link("link", "Bouton"),
      ],
      defaults: {
        eyebrow: "Le cabinet",
        title: "Relier les territoires, servir les *communautés*.",
        text: "FM Consulting accompagne collectivités, institutions et organisations de la société civile dans la conception et la conduite de projets à fort impact humain : coopération décentralisée, développement communautaire, culture et patrimoine, éducation.\n\nNotre force : une connaissance fine des acteurs locaux et un réseau institutionnel qui permet de transformer les intentions en partenariats concrets.",
        image: photo("fanou-ministre-mesrs", "Endurance Martial B. Fanou, Directeur associé du cabinet FM Consulting, avec Madame la Ministre (MESRS)") as Img,
        badgeLabel: "Notre terrain",
        badgeValue: "Afrique · Caraïbes",
        question: "Une question ? Notre équipe vous répond.",
        link: { label: "En savoir plus", href: "/cabinet" } as Link,
      },
    }),
    work: section({
      label: "Réalisations (cartes empilées)",
      help: "Les cartes se superposent au défilement de la page.",
      hideable: true,
      fields: [
        text("watermark", "Grand mot en filigrane"),
        list("items", "Réalisations", "une réalisation", [title(), area("text", "Texte", undefined, 2), image("image", "Image"), link("link", "Lien")], { summary: "title" }),
      ],
      defaults: {
        watermark: "Réalisations",
        items: [
          {
            title: "Coopération décentralisée",
            text: "Accords de coopération entre collectivités du Bénin et de la Martinique.",
            image: photo("signature-accords-cooperation-2025", "Signature des accords de coopération entre les deux maires"),
            link: { label: "Lire l'article", href: "/actualites/signature-accords-cooperation-aout-2025" },
          },
          {
            title: "Diplomatie & institutions",
            text: "Séances de travail avec les ministères et accueil de délégations officielles.",
            image: photo("marechal-afoukou-mae", "Thierry Maréchal et M. Afoukou, Secrétaire général du Ministère des Affaires étrangères"),
            link: { label: "Lire l'article", href: "/actualites/delegation-martinique-ministere-affaires-etrangeres-2024" },
          },
          {
            title: "Culture & mémoire",
            text: "Rencontres entre afrodescendants et autorités locales, à Ouidah et à Savè.",
            image: photo("afrodescendants-ouidah-save", "Des afrodescendants reçus par les maires de Ouidah et de Savè"),
            link: { label: "Lire l'article", href: "/actualites/afrodescendants-recus-maires-ouidah-save" },
          },
          {
            title: "Éducation & recherche",
            text: "Mise en relation avec le Ministère de l'Enseignement supérieur et de la Recherche scientifique.",
            image: photo("seance-travail-mesrs", "Séance de travail au MESRS"),
            link: { label: "Lire l'article", href: "/actualites/case-pilote-ministere-enseignement-superieur-2024" },
          },
        ] as { title: string; text: string; image: Img; link: Link }[],
      },
    }),
    team: section({
      label: "Équipe",
      hideable: true,
      fields: [
        eyebrow,
        title(),
        list("members", "Membres", "un membre", [text("name", "Nom"), text("role", "Fonction"), image("image", "Photo (portrait)")], { summary: "name" }),
      ],
      defaults: {
        eyebrow: "L'équipe",
        title: "Des femmes et des hommes *engagés*.",
        members: [
          {
            name: "Endurance Martial B. Fanou",
            role: "Directeur associé",
            image: photo("fanou-directeur-associe", "Endurance Martial B. Fanou, Directeur associé du cabinet FM Consulting"),
          },
        ] as { name: string; role: string; image: Img }[],
      },
    }),
    testimonials: section({
      label: "Témoignages",
      help: "Masqués tant qu'aucun vrai témoignage n'est saisi : remplacez les exemples puis activez la section.",
      hideable: true,
      hiddenByDefault: true,
      fields: [list("items", "Témoignages", "un témoignage", [area("quote", "Citation", undefined, 4), text("author", "Auteur"), text("role", "Fonction, organisation")], { summary: "author" })],
      defaults: {
        items: [
          { quote: "Exemple de témoignage : remplacez ce texte par les mots d'un partenaire.", author: "Prénom Nom", role: "Fonction, organisation" },
        ],
      },
    }),
    marquee: section({
      label: "Bandeau défilant",
      hideable: true,
      fields: [list("words", "Mots", "un mot", [text("text", "Texte")], { summary: "text" })],
      defaults: {
        words: [
          { text: "Coopération" },
          { text: "Communautés" },
          { text: "Culture" },
          { text: "Patrimoine" },
          { text: "Éducation" },
          { text: "Développement" },
        ],
      },
    }),
    why: section({
      label: "Pourquoi nous choisir",
      hideable: true,
      fields: [
        eyebrow,
        title(),
        image("image", "Image de fond"),
        list("items", "Atouts", "un atout", [icon(), text("title", "Titre"), area("text", "Texte", undefined, 3)], { summary: "title", max: 4 }),
      ],
      defaults: {
        eyebrow: "Pourquoi FM Consulting",
        title: "Une approche humaine, un réseau *qui agit*.",
        image: photo("delegation-case-pilote-ouidah", "Visite d'une délégation de Case-Pilote au maire de Ouidah") as Img,
        items: [
          { icon: "community", title: "Ancrage local", text: "Une connaissance fine des territoires, de leurs acteurs et de leurs codes." },
          { icon: "institution", title: "Réseau institutionnel", text: "Un dialogue établi avec les collectivités, les ministères et les partenaires." },
          { icon: "handshake", title: "Approche participative", text: "Des projets construits avec les communautés, et non pour elles." },
          { icon: "chart", title: "Suivi rigoureux", text: "Un accompagnement de bout en bout, de la conception à l'évaluation." },
        ],
      },
    }),
    videos: section({
      label: "Vidéos",
      hideable: true,
      fields: [
        eyebrow,
        title(),
        area("text", "Texte", undefined, 2),
        list("items", "Vidéos", "une vidéo", [text("title", "Titre"), videoField("video", "Vidéo")], { summary: "title", max: 4 }),
        link("link", "Lien vers la médiathèque"),
      ],
      defaults: {
        eyebrow: "En images",
        title: "Nos missions *sur le terrain*.",
        text: "Délégations, rencontres institutionnelles et temps forts culturels : revivez quelques-unes de nos actions.",
        items: [
          { title: "Fête cultuelle YèkèYèkè 2025 à Grand-Popo", video: video("yekeyeke-grand-popo-2025", "Fête cultuelle YèkèYèkè 2025 à Grand-Popo") },
          { title: "Délégation de Martinique à la mairie de Ouidah", video: video("delegation-martinique-ouidah", "Délégation de Martinique à la mairie de Ouidah") },
          { title: "Soirée de gala pour la délégation de Savè en Martinique", video: video("gala-save-martinique", "Soirée de gala en Martinique") },
          { title: "Visite au Centre EYA de Cotonou", video: video("case-pilote-centre-eya", "Centre communautaire EYA de Cotonou") },
        ] as { title: string; video: Vid }[],
        link: { label: "Toute la médiathèque", href: "/mediatheque" } as Link,
      },
    }),
    faq: section({
      label: "Questions fréquentes",
      hideable: true,
      fields: [
        eyebrow,
        title(),
        link("link", "Bouton"),
        list("items", "Questions", "une question", [text("question", "Question"), area("answer", "Réponse", undefined, 4)], { summary: "question" }),
      ],
      defaults: {
        eyebrow: "Questions fréquentes",
        title: "Vous avez des *questions* ?",
        link: { label: "Nous écrire", href: "/contact" } as Link,
        items: [
          {
            question: "Quels types de structures accompagnez-vous ?",
            answer: "Collectivités territoriales, institutions publiques, associations, fondations et organisations de la diaspora qui portent des projets à dimension communautaire, sociale ou culturelle.",
          },
          {
            question: "Où intervenez-vous ?",
            answer: "Principalement au Bénin et dans les Caraïbes (Martinique), ainsi qu'en France et en Afrique de l'Ouest, selon les besoins des projets.",
          },
          {
            question: "Pouvez-vous organiser l'accueil d'une délégation ?",
            answer: "Oui : programme des rencontres, mise en relation avec les autorités, logistique et accompagnement sur place.",
          },
          {
            question: "Comment se déroule une mission ?",
            answer: "Nous commençons par un temps d'écoute et de diagnostic, puis nous proposons une démarche, la mettons en œuvre avec vous et en assurons le suivi.",
          },
          {
            question: "Aidez-vous à trouver des financements ?",
            answer: "Nous accompagnons le montage des dossiers et l'identification des partenaires techniques et financiers adaptés à votre projet.",
          },
        ],
      },
    }),
    news: section({
      label: "Dernières actualités",
      help: "Les trois derniers articles publiés s'affichent automatiquement.",
      hideable: true,
      fields: [eyebrow, title()],
      defaults: { eyebrow: "Actualités", title: "Nos dernières *activités*." },
    }),
  },
} satisfies PageDef;

// ─── Le cabinet ──────────────────────────────────────────────────────────────
const about = {
  title: "Le cabinet",
  path: "/cabinet",
  help: "Présentation du cabinet, de ses valeurs et de son équipe dirigeante.",
  sections: {
    header: section({
      label: "En-tête de page",
      fields: [eyebrow, title(), area("text", "Texte", undefined, 2), image("image", "Image")],
      defaults: {
        eyebrow: "Le cabinet",
        title: "Au service des territoires et de *leurs habitants*.",
        text: "FM Consulting est un cabinet de conseil dédié aux projets de développement communautaire, sociaux et culturels.",
        image: photo("cabinet-delegation", "L'équipe du cabinet FM Consulting avec une délégation") as Img,
      },
    }),
    intro: section({
      label: "Qui sommes-nous",
      fields: [eyebrow, title(), area("text", "Texte", "Laissez une ligne vide entre deux paragraphes.", 8), image("image", "Image")],
      defaults: {
        eyebrow: "Qui sommes-nous",
        title: "Un cabinet de *conseil et de terrain*.",
        text: "Né de la conviction que le développement passe par la rencontre, FM Consulting accompagne les acteurs publics et associatifs dans leurs projets de coopération, de développement local et de valorisation culturelle.\n\nDu diagnostic à l'évaluation, nous mobilisons notre connaissance des territoires et notre réseau pour créer des liens durables entre collectivités, institutions et communautés.\n\nTexte provisoire : la présentation détaillée du cabinet sera ajoutée prochainement.",
        image: photo("echanges-mairie-ouidah", "Séance d'échanges à la mairie de Ouidah") as Img,
      },
    }),
    values: section({
      label: "Mission, vision, valeurs",
      hideable: true,
      fields: [eyebrow, title(), list("items", "Cartes", "une carte", [icon(), text("title", "Titre"), area("text", "Texte", undefined, 3)], { summary: "title" })],
      defaults: {
        eyebrow: "Nos engagements",
        title: "Ce qui nous *anime*.",
        items: [
          { icon: "target", title: "Notre mission", text: "Accompagner les territoires et les communautés dans la réalisation de projets utiles, inclusifs et durables." },
          { icon: "compass", title: "Notre vision", text: "Des coopérations fondées sur la confiance, qui relient l'Afrique, les Caraïbes et l'Europe." },
          { icon: "heart", title: "Nos valeurs", text: "Écoute, respect des cultures, transparence, exigence et sens de l'intérêt général." },
        ],
      },
    }),
    director: section({
      label: "Mot du directeur",
      hideable: true,
      fields: [eyebrow, area("quote", "Citation", undefined, 4), area("text", "Texte", undefined, 4), text("name", "Nom"), text("role", "Fonction"), image("image", "Photo")],
      defaults: {
        eyebrow: "Le mot du directeur",
        quote: "Chaque projet est d'abord une rencontre : entre des territoires, des institutions et des femmes et des hommes qui veulent agir ensemble.",
        text: "Texte provisoire : le mot du directeur sera ajouté prochainement.",
        name: "Endurance Martial B. Fanou",
        role: "Directeur associé, FM Consulting",
        image: photo("fanou-directeur-associe", "Endurance Martial B. Fanou, Directeur associé du cabinet FM Consulting") as Img,
      },
    }),
    territories: section({
      label: "Zones d'intervention",
      hideable: true,
      fields: [eyebrow, title(), list("items", "Zones", "une zone", [text("name", "Nom"), text("detail", "Précision")], { summary: "name" })],
      defaults: {
        eyebrow: "Zones d'intervention",
        title: "D'une rive à *l'autre*.",
        items: [
          { name: "Bénin", detail: "Cotonou, Ouidah, Savè, Grand-Popo…" },
          { name: "Martinique", detail: "Case-Pilote, Fort-de-France…" },
          { name: "France", detail: "Collectivités et diaspora" },
          { name: "Afrique de l'Ouest", detail: "Selon les projets" },
        ],
      },
    }),
    partners: section({
      label: "Institutions et territoires",
      help: "Liste des institutions affichée sous forme de bandeau.",
      hideable: true,
      fields: [eyebrow, title(), list("items", "Institutions", "une institution", [text("name", "Nom")], { summary: "name" })],
      defaults: {
        eyebrow: "Ils ont travaillé avec nous",
        title: "Institutions et *territoires*.",
        items: [
          { name: "Mairie de Ouidah" },
          { name: "Mairie de Savè" },
          { name: "Mairie de Grand-Popo" },
          { name: "Ville de Case-Pilote" },
          { name: "Ville de Fort-de-France" },
          { name: "Ministère des Affaires étrangères" },
          { name: "Ministère de l'Enseignement supérieur" },
          { name: "Fondation Clément" },
          { name: "Centre communautaire EYA" },
        ],
      },
    }),
  },
} satisfies PageDef;

// ─── Expertises ──────────────────────────────────────────────────────────────
const services = {
  title: "Expertises",
  path: "/expertises",
  help: "Les domaines d'intervention du cabinet et sa méthode de travail.",
  sections: {
    header: section({
      label: "En-tête de page",
      fields: [eyebrow, title(), area("text", "Texte", undefined, 2), image("image", "Image")],
      defaults: {
        eyebrow: "Nos expertises",
        title: "Des projets qui ont *du sens*.",
        text: "Coopération, développement communautaire, culture, éducation : nous accompagnons les projets qui renforcent le lien entre les territoires et leurs habitants.",
        image: photo("seance-travail-mesrs", "Séance de travail au MESRS") as Img,
      },
    }),
    list: section({
      label: "Domaines d'expertise",
      fields: [
        eyebrow,
        title(),
        list(
          "items",
          "Expertises",
          "une expertise",
          [icon(), text("title", "Titre"), area("text", "Description", undefined, 3), area("points", "Points clés", "Un point par ligne.", 4), image("image", "Image")],
          { summary: "title" },
        ),
      ],
      defaults: {
        eyebrow: "Domaines d'intervention",
        title: "Ce que nous *faisons*.",
        items: [
          {
            icon: "handshake",
            title: "Coopération décentralisée",
            text: "Nous rapprochons les collectivités d'Afrique, des Caraïbes et d'Europe autour de partenariats concrets.",
            points: "Identification des partenaires\nAccords et conventions de coopération\nOrganisation de missions et de délégations",
            image: photo("signature-accords-cooperation-2025", "Signature des accords de coopération"),
          },
          {
            icon: "community",
            title: "Développement communautaire",
            text: "Nous aidons les communautés et les associations à concevoir et porter des projets au service de leur territoire.",
            points: "Diagnostic participatif\nAppui aux centres communautaires et associations\nConception et suivi de projets locaux",
            image: photo("afrodescendants-ouidah-save", "Rencontre à Ouidah et Savè"),
          },
          {
            icon: "culture",
            title: "Culture & patrimoine",
            text: "Nous valorisons le patrimoine matériel et immatériel, la mémoire et les liens avec la diaspora.",
            points: "Événements culturels et cultuels\nMémoire et diaspora afrodescendante\nÉchanges entre institutions culturelles",
            image: photo("fondation-clement-fort-de-france", "Visite de la Fondation Clément"),
          },
          {
            icon: "education",
            title: "Éducation & projets sociaux",
            text: "Nous favorisons les partenariats éducatifs et les initiatives sociales à destination de la jeunesse.",
            points: "Partenariats universitaires\nJeunesse et formation\nInclusion sociale",
            image: photo("marechal-ladekan-mesrs-2024", "Rencontre au Ministère de l'Enseignement supérieur"),
          },
          {
            icon: "institution",
            title: "Relations institutionnelles",
            text: "Nous facilitons le dialogue avec les autorités et organisons des rencontres de haut niveau.",
            points: "Mise en relation avec les ministères et collectivités\nProtocole et préparation des rencontres\nAccompagnement sur place",
            image: photo("marechal-afoukou-mae", "Au Ministère des Affaires étrangères"),
          },
          {
            icon: "chart",
            title: "Ingénierie de projet",
            text: "Nous structurons vos projets, de l'idée au financement, et en suivons l'exécution.",
            points: "Montage de projets et de dossiers\nRecherche de partenaires techniques et financiers\nSuivi et évaluation",
            image: photo("echanges-mairie-ouidah", "Séance de travail à la mairie de Ouidah"),
          },
        ] as { icon: string; title: string; text: string; points: string; image: Img }[],
      },
    }),
    process: section({
      label: "Notre méthode",
      hideable: true,
      fields: [eyebrow, title(), list("items", "Étapes", "une étape", [text("title", "Titre"), area("text", "Texte", undefined, 3)], { summary: "title" })],
      defaults: {
        eyebrow: "Notre méthode",
        title: "Une démarche en *quatre temps*.",
        items: [
          { title: "Écoute & diagnostic", text: "Comprendre le contexte, les acteurs et les attentes du territoire." },
          { title: "Conception", text: "Construire une démarche et un plan d'action partagés." },
          { title: "Mise en relation", text: "Mobiliser les bons partenaires, institutions et financements." },
          { title: "Mise en œuvre & suivi", text: "Accompagner l'exécution et mesurer les résultats." },
        ],
      },
    }),
  },
} satisfies PageDef;

// ─── Médiathèque ─────────────────────────────────────────────────────────────
const media = {
  title: "Médiathèque",
  path: "/mediatheque",
  help: "Photos et vidéos des activités du cabinet.",
  sections: {
    header: section({
      label: "En-tête de page",
      fields: [eyebrow, title(), area("text", "Texte", undefined, 2)],
      defaults: {
        eyebrow: "Médiathèque",
        title: "Nos activités *en images*.",
        text: "Photos et vidéos de nos missions, rencontres institutionnelles et temps forts culturels.",
      },
    }),
    videos: section({
      label: "Vidéos",
      hideable: true,
      fields: [eyebrow, title(), list("items", "Vidéos", "une vidéo", [text("title", "Titre"), videoField("video", "Vidéo")], { summary: "title" })],
      defaults: {
        eyebrow: "Vidéos",
        title: "Sur le *terrain*.",
        items: [
          { title: "Soutien à la mairie de Grand-Popo, fête cultuelle YèkèYèkè 2025", video: video("yekeyeke-grand-popo-2025", "Fête cultuelle YèkèYèkè 2025 à Grand-Popo") },
          { title: "Visite de la délégation de Martinique à la mairie de Ouidah", video: video("delegation-martinique-ouidah", "Délégation de Martinique à la mairie de Ouidah") },
          { title: "Visite de la délégation de Martinique à la mairie de Savè", video: video("delegation-martinique-save", "Délégation de Martinique à la mairie de Savè") },
          { title: "Visite du 1er adjoint au maire de Case-Pilote au Centre EYA de Cotonou", video: video("case-pilote-centre-eya", "Centre communautaire EYA de Cotonou") },
          { title: "Séance de travail au Ministère des Affaires étrangères", video: video("seance-travail-mae", "Séance de travail au Ministère des Affaires étrangères") },
          { title: "Soirée de gala pour la délégation de la mairie de Savè en Martinique", video: video("gala-save-martinique", "Soirée de gala en Martinique") },
          { title: "Réception organisée par Bernard Hayot au restaurant du chef étoilé Bredas", video: video("reception-bernard-hayot", "Réception organisée par Bernard Hayot") },
        ] as { title: string; video: Vid }[],
      },
    }),
    photos: section({
      label: "Photos",
      hideable: true,
      fields: [eyebrow, title(), list("items", "Photos", "une photo", [image("image", "Photo"), text("caption", "Légende")], { summary: "caption" })],
      defaults: {
        eyebrow: "Photos",
        title: "Moments *partagés*.",
        items: (
          [
            ["signature-accords-cooperation-2025", "Signature des accords de coopération entre les deux maires, août 2025"],
            ["afrodescendants-ouidah-save", "Des afrodescendants reçus conjointement par les maires de Ouidah et de Savè"],
            ["delegation-case-pilote-ouidah", "Visite d'une délégation conduite par l'adjoint au maire de Case-Pilote (Martinique) au maire de Ouidah"],
            ["echanges-mairie-ouidah", "Séance d'échanges à la mairie de Ouidah"],
            ["delegation-martinique-mae-2024", "Séance de travail de la délégation de Martinique au Ministère des Affaires étrangères, 2024"],
            ["marechal-afoukou-mae", "Thierry Maréchal, 1er adjoint au maire de Case-Pilote, et M. Afoukou, Secrétaire général du Ministère des Affaires étrangères"],
            ["sg-mae", "Avec le Secrétaire général du Ministère des Affaires étrangères"],
            ["marechal-ladekan-mesrs-2024", "Thierry Maréchal et Mme Eléonore Ladékan Yayi, Ministre de l'Enseignement supérieur et de la Recherche scientifique, 2024"],
            ["ministre-ladekan-case-pilote", "Séance photo avec la Ministre Ladékan Yayi et une délégation de Case-Pilote (Martinique)"],
            ["seance-travail-mesrs", "Séance de travail au MESRS"],
            ["fanou-ministre-mesrs", "Endurance Martial B. Fanou, Directeur associé du cabinet, avec Madame la Ministre (MESRS)"],
            ["fondation-clement-fort-de-france", "Visite de la délégation béninoise à la Fondation Clément, avec Bernard Hayot et le maire de Fort-de-France"],
            ["cabinet-delegation", "Le cabinet FM Consulting avec une délégation"],
            ["directeur-adjoint-case-pilote", "Le Directeur du cabinet et l'adjoint au maire de Case-Pilote (Martinique)"],
            ["fanou-directeur-associe", "Endurance Martial B. Fanou, Directeur associé du cabinet FM Consulting"],
            ["fanou-cabinet", "M. Fanou, cabinet FM Consulting"],
          ] as const
        ).map(([name, caption]) => ({ image: photo(name, caption) as Img, caption: caption as string })),
      },
    }),
  },
} satisfies PageDef;

// ─── Actualités ──────────────────────────────────────────────────────────────
const news = {
  title: "Actualités",
  path: "/actualites",
  help: "En-tête de la page des actualités. Les articles se gèrent dans le menu « Actualités ».",
  sections: {
    header: section({
      label: "En-tête de page",
      fields: [eyebrow, title(), area("text", "Texte", undefined, 2)],
      defaults: {
        eyebrow: "Actualités",
        title: "Nos activités et *nos actualités*.",
        text: "Missions, rencontres institutionnelles, coopérations et temps forts culturels : suivez la vie du cabinet.",
      },
    }),
  },
} satisfies PageDef;

// ─── Contact ─────────────────────────────────────────────────────────────────
const contact = {
  title: "Contact",
  path: "/contact",
  help: "Page Contact. Les coordonnées se modifient dans « Paramètres généraux ».",
  sections: {
    header: section({
      label: "En-tête de page",
      fields: [eyebrow, title(), area("text", "Texte", undefined, 2)],
      defaults: {
        eyebrow: "Contact",
        title: "Parlons de *votre projet*.",
        text: "Une idée, un besoin d'accompagnement, une délégation à accueillir ? Écrivez-nous, nous vous répondons rapidement.",
      },
    }),
    form: section({
      label: "Formulaire",
      help: "Les messages envoyés arrivent dans le menu « Messages » du dashboard.",
      fields: [
        text("title", "Titre du formulaire"),
        text("text", "Sous-titre"),
        list("subjects", "Sujets proposés", "un sujet", [text("label", "Sujet")], { summary: "label" }),
        text("successTitle", "Titre après envoi"),
        area("successText", "Texte après envoi", undefined, 2),
      ],
      defaults: {
        title: "Écrivez-nous",
        text: "Nous vous répondons sous 48 heures ouvrées.",
        subjects: [
          { label: "Coopération décentralisée" },
          { label: "Développement communautaire" },
          { label: "Culture & patrimoine" },
          { label: "Éducation & projets sociaux" },
          { label: "Accueil d'une délégation" },
          { label: "Autre demande" },
        ],
        successTitle: "Message envoyé",
        successText: "Merci pour votre message. Notre équipe vous répondra dans les meilleurs délais.",
      },
    }),
  },
} satisfies PageDef;

export const pages = { home, about, services, media, news, contact, settings };

export type PageId = keyof typeof pages;
export const PAGE_IDS = Object.keys(pages) as PageId[];

type Sections<P extends PageId> = (typeof pages)[P]["sections"];
export type PageContent<P extends PageId> = {
  [S in keyof Sections<P>]: Sections<P>[S] extends { defaults: infer D } ? D & { visible: boolean } : never;
};

export type StoredPage = Record<string, Record<string, unknown> | undefined>;

/** Contenu d'une page : valeurs enregistrées dans le dashboard, complétées par le contenu par défaut. */
export function mergePage<P extends PageId>(id: P, stored: StoredPage | undefined): PageContent<P> {
  const def = pages[id] as PageDef;
  const result: Record<string, Record<string, unknown>> = {};
  for (const [key, sectionDef] of Object.entries(def.sections)) {
    const saved = stored?.[key] ?? {};
    const merged: Record<string, unknown> = { visible: !sectionDef.hiddenByDefault };
    for (const field of Object.keys(sectionDef.defaults)) {
      merged[field] = field in saved ? saved[field] : sectionDef.defaults[field];
    }
    if (sectionDef.hideable && typeof saved.visible === "boolean") merged.visible = saved.visible;
    if (!sectionDef.hideable) merged.visible = true;
    result[key] = merged;
  }
  return result as PageContent<P>;
}
