import type { ImageRef } from "@/lib/news";
import { photo, video, type VideoRef } from "./media";
import { ACCENT_HELP, area, image, link, list, section, text, videoField, type Field, type Link, type PageDef } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Contenu par défaut du site et champs modifiables depuis le dashboard (/admin).
// Textes établis à partir de la « Note synthétique des projets et activités du
// cabinet FM Consulting » (juin 2026). Ils restent modifiables depuis le dashboard.
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
        text("phone", "Téléphone principal (Bénin)", "Affiché dans l'en-tête. Ex. +229 01 97 50 69 64"),
        text("phone2", "Téléphone secondaire (France)", "Facultatif"),
        text("whatsapp", "Numéro WhatsApp", "Facultatif. Format international, ex. +229 01 23 45 67 89"),
        text("email", "Adresse email"),
        area("hours", "Horaires", undefined, 2),
        list("addresses", "Adresses", "une adresse", [text("label", "Intitulé", "Ex. Siège, Bureau Europe"), area("text", "Adresse", undefined, 3)], { summary: "label" }),
      ],
      defaults: {
        phone: "+229 01 97 50 69 64",
        phone2: "+33 6 63 96 76 47",
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
        title: "Un projet au *Bénin* ?",
        text: "Collectivités, institutions, investisseurs : parlons de vos ambitions et construisons ensemble une démarche adaptée.",
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
        about: "Cabinet de conseil stratégique en coopération internationale, investissement, développement économique, formation et représentation institutionnelle, au service du Bénin et de ses partenaires.",
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
        title: "Coopérer.\nInvestir.\n*Développer.*",
        text: "Cabinet de conseil stratégique en coopération internationale, investissement et développement économique, au service du Bénin et de ses partenaires.",
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
            text: "Conseil stratégique en coopération internationale, investissement, développement économique, formation et représentation institutionnelle.",
            link: { label: "Nos expertises", href: "/expertises" },
            image: photo("echanges-mairie-ouidah", "Séance d'échanges à la mairie de Ouidah"),
            tone: "clay",
          },
          {
            title: "Notre mission",
            text: "Renforcer les relations institutionnelles et promouvoir un développement économique durable, notamment au profit de la République du Bénin.",
            link: { label: "Le cabinet", href: "/cabinet" },
            image: photo("cabinet-delegation", "L'équipe du cabinet FM Consulting avec une délégation"),
            tone: "brand",
          },
          {
            title: "Notre réseau",
            text: "Ministères, chambres consulaires, communes et investisseurs : du Bénin à la Martinique, d'Haïti à l'Europe.",
            link: { label: "Nos actualités", href: "/actualites" },
            image: photo("afrodescendants-ouidah-save", "Des afrodescendants reçus par les maires de Ouidah et de Savè"),
            tone: "mist",
          },
        ] as { title: string; text: string; link: Link; image: Img; tone: string }[],
      },
    }),
    stats: section({
      label: "Chiffres clés",
      help: "Chiffres tirés de la note de synthèse du cabinet (juin 2026).",
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
          { value: "6", suffix: "+", label: "Communes béninoises mobilisées" },
          { value: "8", suffix: "+", label: "Institutions nationales rencontrées" },
          { value: "7", suffix: "", label: "Projets d'investissement et de développement" },
          { value: "6", suffix: "", label: "Pays et territoires d'intervention" },
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
        title: "Un cabinet de conseil *stratégique*.",
        text: "FM Consulting est une structure de conseil stratégique composée d'experts et de consultants, intervenant dans les domaines de la coopération internationale, de l'investissement, du développement économique, de la formation et de la représentation institutionnelle.\n\nDans l'accomplissement de ses missions, le cabinet contribue au renforcement des relations institutionnelles et à la promotion du développement économique durable, notamment au profit de la République du Bénin.",
        image: photo("fanou-ministre-mesrs", "Endurance Martial B. Fanou, Directeur associé du cabinet FM Consulting, avec Madame la Ministre (MESRS)") as Img,
        badgeLabel: "Délégations accueillies depuis",
        badgeValue: "2022",
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
            title: "Coopération internationale",
            text: "Jumelage entre la commune de Savè (Bénin) et la ville de Case-Pilote (Martinique), jusqu'à la signature d'accords de coopération en août 2025.",
            image: photo("signature-accords-cooperation-2025", "Signature des accords de coopération, août 2025"),
            link: { label: "Lire l'article", href: "/actualites/signature-accords-cooperation-aout-2025" },
          },
          {
            title: "Représentation institutionnelle",
            text: "Audiences avec les ministères, chambres consulaires et agences publiques pour les délégations accueillies depuis 2022.",
            image: photo("marechal-afoukou-mae", "Thierry Maréchal et M. Afoukou, Secrétaire général du Ministère des Affaires étrangères"),
            link: { label: "Lire l'article", href: "/actualites/delegation-martinique-ministere-affaires-etrangeres-2024" },
          },
          {
            title: "Investissements",
            text: "Conseil et facilitation de projets d'implantation industrielle au Bénin : rhumerie, filiale de rhum haïtien, unité pharmaceutique.",
            image: photo("echanges-mairie-ouidah", "Séance d'échanges à la mairie de Ouidah"),
            link: { label: "Nos expertises", href: "/expertises" },
          },
          {
            title: "Formation & compétences",
            text: "Transfert de savoir-faire entre la Martinique et le Bénin (aviculture, poterie) et coopération universitaire.",
            image: photo("seance-travail-mesrs", "Séance de travail au MESRS"),
            link: { label: "Nos expertises", href: "/expertises" },
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
        title: "Des experts et des consultants *engagés*.",
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
          { text: "Investissement" },
          { text: "Développement" },
          { text: "Formation" },
          { text: "Partenariats" },
          { text: "Bénin" },
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
        title: "Un réseau institutionnel *qui agit*.",
        image: photo("delegation-case-pilote-ouidah", "Visite d'une délégation de Case-Pilote au maire de Ouidah") as Img,
        items: [
          { icon: "institution", title: "Réseau institutionnel", text: "Un dialogue établi avec les ministères, les chambres consulaires, les agences publiques et les communes du Bénin." },
          { icon: "globe", title: "Un pont entre les continents", text: "Des relations suivies avec la Martinique, Haïti, l'Europe et les États-Unis." },
          { icon: "compass", title: "Connaissance du terrain", text: "Des délégations accueillies et accompagnées depuis 2022, de la préparation aux rencontres officielles." },
          { icon: "handshake", title: "Respect des cadres", text: "Des actions menées dans le respect des cadres institutionnels et diplomatiques." },
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
            answer: "Collectivités territoriales, institutions, investisseurs, entreprises, universités et organisations de la diaspora qui portent un projet au Bénin ou avec le Bénin.",
          },
          {
            question: "Où intervenez-vous ?",
            answer: "Principalement au Bénin, en lien avec la Martinique, Haïti, l'Europe (France, Pologne, Espagne) et les États-Unis.",
          },
          {
            question: "Accompagnez-vous les investisseurs qui souhaitent s'implanter au Bénin ?",
            answer: "Oui. Nous intervenons en qualité de conseil et de facilitateur : mise en relation avec les autorités et les communes, préparation et suivi des négociations.",
          },
          {
            question: "Pouvez-vous organiser l'accueil d'une délégation ?",
            answer: "Oui. Depuis 2022, nous organisons des rencontres officielles pour les délégations : audiences auprès des ministères, des chambres consulaires, des agences publiques et des communes.",
          },
          {
            question: "Proposez-vous des actions de formation ?",
            answer: "Oui : transfert de compétences et professionnalisation, par exemple en aviculture et en poterie, ainsi que des projets de coopération universitaire.",
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
        title: "Un cabinet de conseil *stratégique*.",
        text: "Experts et consultants au service de la coopération internationale, de l'investissement et du développement économique du Bénin.",
        image: photo("cabinet-delegation", "L'équipe du cabinet FM Consulting avec une délégation") as Img,
      },
    }),
    intro: section({
      label: "Qui sommes-nous",
      fields: [eyebrow, title(), area("text", "Texte", "Laissez une ligne vide entre deux paragraphes.", 8), image("image", "Image")],
      defaults: {
        eyebrow: "Qui sommes-nous",
        title: "Des experts au service de la *coopération*.",
        text: "Le cabinet FM Consulting est une structure de conseil stratégique composée d'experts et de consultants, intervenant dans les domaines de la coopération internationale, de l'investissement, du développement économique, de la formation et de la représentation institutionnelle.\n\nDans l'accomplissement des missions qu'il s'est assignées, le cabinet contribue au renforcement des relations institutionnelles et à la promotion du développement économique durable, notamment au profit de la République du Bénin.\n\nDepuis 2022, il accueille et accompagne des délégations institutionnelles martiniquaises et haïtiennes, et facilite des projets d'investissement structurants pour le pays.",
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
          { icon: "target", title: "Notre mission", text: "Contribuer au renforcement des relations institutionnelles et à la promotion du développement économique durable, notamment au profit de la République du Bénin." },
          { icon: "compass", title: "Notre ambition", text: "Renforcer la coopération des communes à l'international, l'attractivité économique et le développement durable du Bénin." },
          { icon: "heart", title: "Notre engagement", text: "Agir dans le respect des cadres institutionnels et diplomatiques, avec constance et rigueur." },
        ],
      },
    }),
    director: section({
      label: "Mot du directeur",
      hideable: true,
      fields: [eyebrow, area("quote", "Citation", undefined, 4), area("text", "Texte", undefined, 4), text("name", "Nom"), text("role", "Fonction"), image("image", "Photo")],
      defaults: {
        eyebrow: "Le mot du directeur",
        quote: "L'ensemble de nos actions témoigne de l'engagement constant du cabinet dans l'accompagnement du renforcement de la coopération des communes à l'international, de l'attractivité économique et du développement durable du Bénin.",
        text: "",
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
          { name: "Bénin", detail: "Cotonou, Savè, Ouidah, Tori, Porto-Novo, Grand-Popo, Abomey-Calavi…" },
          { name: "Martinique", detail: "Case-Pilote, Fort-de-France…" },
          { name: "Haïti", detail: "Délégations et investisseurs" },
          { name: "Europe & États-Unis", detail: "France, Pologne, Espagne, Maryland" },
        ],
      },
    }),
    partners: section({
      label: "Institutions et territoires",
      help: "Liste des institutions affichée sous forme de bandeau.",
      hideable: true,
      fields: [eyebrow, title(), list("items", "Institutions", "une institution", [text("name", "Nom")], { summary: "name" })],
      defaults: {
        eyebrow: "Nos interlocuteurs",
        title: "Institutions *rencontrées*.",
        items: [
          { name: "Ministère des Affaires étrangères" },
          { name: "Ministère de l'Enseignement supérieur et de la Recherche scientifique" },
          { name: "Ministère du Commerce" },
          { name: "ATDA, Ministère de l'Agriculture" },
          { name: "APIEX" },
          { name: "Chambre d'Agriculture du Bénin" },
          { name: "Chambre des métiers de l'Artisanat" },
          { name: "Projet Songhaï" },
          { name: "Mairies de Savè, Ouidah, Tori, Porto-Novo et Grand-Popo" },
          { name: "Ville de Case-Pilote (Martinique)" },
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
        title: "Six domaines, *une même ambition*.",
        text: "Coopération internationale, investissements, développement économique, formation, partenariats et représentation institutionnelle, au service du Bénin.",
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
            icon: "globe",
            title: "Coopération internationale",
            text: "Conception, coordination et accompagnement d'actions de coopération décentralisée entre les communes du Bénin et leurs partenaires étrangers.",
            points:
              "Jumelage entre la commune de Savè (Bénin) et la ville de Case-Pilote (Martinique)\nVisite officielle du maire de Savè en Martinique (mai 2024)\nPréparation et signature d'accords de coopération (août 2025)\nAccueil et encadrement de délégations institutionnelles martiniquaises et haïtiennes depuis 2022",
            image: photo("signature-accords-cooperation-2025", "Signature des accords de coopération, août 2025"),
          },
          {
            icon: "chart",
            title: "Investissements",
            text: "Conseil et facilitation de projets d'investissement structurants pour le Bénin.",
            points:
              "Négociations entre le maire de Savè et la direction générale de la rhumerie Neisson pour l'implantation d'une unité de production à Savè\nPourparlers avec la direction générale des rhums Barbancourt (Haïti) pour l'ouverture d'une filiale au Bénin\nÉchanges avec un laboratoire de produits de santé bio pour l'installation d'une unité de production pharmaceutique",
            image: photo("echanges-mairie-ouidah", "Séance d'échanges à la mairie de Ouidah"),
          },
          {
            icon: "leaf",
            title: "Développement économique",
            text: "Accompagnement de projets de diversification et de valorisation de l'économie locale.",
            points:
              "Mise en place d'unités de production de biochar\nÉtudes pour la création d'une usine de production de bois composé\nImplantation d'une unité de maroquinerie haut de gamme\nStructuration d'une filière d'exportation de beurre de karité vers une chaîne agroalimentaire",
            image: photo("afrodescendants-ouidah-save", "Rencontre avec les maires de Ouidah et de Savè"),
          },
          {
            icon: "education",
            title: "Formation et renforcement des capacités",
            text: "Actions de formation et de transfert de compétences entre le Bénin et ses partenaires.",
            points:
              "Unité avicole et formation d'étudiants aux techniques avicoles modernes par des investisseurs martiniquais, à Savè\nFormation et professionnalisation des potiers du Bénin par des potiers martiniquais\nCoopération entre l'Université d'Abomey-Calavi et l'Université de Zielona Góra (Pologne)",
            image: photo("marechal-ladekan-mesrs-2024", "Rencontre au Ministère de l'Enseignement supérieur et de la Recherche scientifique"),
          },
          {
            icon: "handshake",
            title: "Partenariats institutionnels et sectoriels",
            text: "Établissement et développement de partenariats structurants.",
            points:
              "Recherche de partenariats avec des entités footballistiques et une académie de football parisienne\nDemande de jumelage d'universités d'Outre-Mer avec celles du Bénin\nBourses d'études pour les étudiants africains, notamment en filières scientifiques\nCoopération entre la mairie de Grand-Popo, Agoué et deux collectivités de Martinique\nParticipation au programme PartiCiP au DEL avec des investisseurs afrodescendants (décembre 2024)",
            image: photo("seance-travail-mesrs", "Séance de travail au MESRS"),
          },
          {
            icon: "institution",
            title: "Représentation institutionnelle",
            text: "Missions de représentation, d'appui institutionnel et de promotion internationale du Bénin.",
            points:
              "Dépôt et suivi de candidatures aux fonctions de consul du Bénin (Haïti, Martinique)\nPromotion du Bénin auprès d'investisseurs internationaux, dont un événement panafricain d'investisseurs dans le Maryland (États-Unis), reporté à 2026\nProjet de vernissage d'œuvres du Bénin à Sitges (Espagne)",
            image: photo("marechal-afoukou-mae", "Au Ministère des Affaires étrangères"),
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
          { label: "Coopération internationale" },
          { label: "Investissement au Bénin" },
          { label: "Développement économique" },
          { label: "Formation" },
          { label: "Partenariat" },
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
