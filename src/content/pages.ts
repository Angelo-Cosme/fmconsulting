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
    current: section({
      label: "Activité en cours",
      hideable: true,
      fields: [
        eyebrow,
        title(),
        area("text", "Texte", undefined, 4),
        videoField("video", "Vidéo"),
        list("facts", "Repères", "un repère", [text("label", "Intitulé"), text("value", "Valeur")], { summary: "label", max: 4 }),
        link("link", "Bouton"),
      ],
      defaults: {
        eyebrow: "Activité en cours",
        title: "Cap sur le *SMCL 2026*.",
        text: "Le cabinet FM Consulting prépare le Salon des Maires et des Collectivités Locales (SMCL), du 24 au 26 novembre 2026.\n\nLa communication a été lancée lors de l'Assemblée générale de l'Association nationale des communes du Bénin (ANCB) en août 2026.",
        video: video("ancb-smcl-2026", "Communication de FM Consulting à l'Assemblée générale de l'ANCB, août 2026") as Vid,
        facts: [
          { label: "Événement", value: "Salon des Maires et des Collectivités Locales" },
          { label: "Dates", value: "24 – 26 novembre 2026" },
          { label: "Lieu", value: "Paris" },
        ] as { label: string; value: string }[],
        link: { label: "Découvrir la mission", href: "/smcl-2026" } as Link,
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
            role: "Directeur associé, Manager général, Consultant senior",
            image: photo("equipe-endurance-martial-fanou-2026", "Endurance Martial B. Fanou, Directeur associé du cabinet FM Consulting"),
          },
          {
            name: "Romain Da Costa",
            role: "Expert-consultant en diplomatie territoriale et coopération décentralisée",
            image: photo("equipe-romain-da-costa", "Romain Da Costa, expert-consultant du cabinet FM Consulting"),
          },
          {
            name: "Brice Crinot",
            role: "Expert-consultant formateur en transformation des organisations et pilotage de performance",
            image: photo("equipe-brice-crinot", "Brice Crinot, expert-consultant formateur du cabinet FM Consulting"),
          },
          {
            name: "Dr Patrick Voglozin",
            role: "Consultant-expert, économiste financier agréé près de la BOAD, du FSA, etc. Spécialiste en montage financier et recherche d'investisseurs",
            image: photo("equipe-patrick-voglozin-fond", "Dr Patrick Voglozin, consultant-expert du cabinet FM Consulting"),
          },
          {
            name: "Pr Jean Benoît Alokpo",
            role: "Consultant formateur, expert en communication diplomatique",
            image: photo("equipe-jean-benoit-alokpo", "Pr Jean Benoît Alokpo, consultant formateur du cabinet FM Consulting"),
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
        list("items", "Vidéos", "une vidéo", [text("title", "Titre"), videoField("video", "Vidéo")], { summary: "title", help: "Défilent horizontalement sur la page d'accueil, dans cet ordre." }),
        link("link", "Lien vers la médiathèque"),
      ],
      defaults: {
        eyebrow: "En images",
        title: "Nos missions *sur le terrain*.",
        text: "Délégations, rencontres institutionnelles et temps forts culturels : revivez quelques-unes de nos actions.",
        items: [
          { title: "En cours : préparation du SMCL 2026, communication à l'Assemblée générale de l'ANCB", video: video("ancb-smcl-2026", "Communication de FM Consulting à l'Assemblée générale de l'ANCB, août 2026") },
          { title: "Hommes d'affaires martiniquais reçus par la Ministre de l'Enseignement supérieur", video: video("ministre-mesrs-hommes-affaires-martiniquais", "Rencontre des hommes d'affaires martiniquais avec la Ministre de l'Enseignement supérieur") },
          { title: "Délégation de Martinique à la mairie de Ouidah", video: video("delegation-martinique-ouidah", "Délégation de Martinique à la mairie de Ouidah") },
          { title: "Délégation de Martinique à la mairie de Savè", video: video("delegation-martinique-save", "Délégation de Martinique à la mairie de Savè") },
          { title: "Séance de travail au Ministère des Affaires étrangères", video: video("seance-travail-mae", "Séance de travail au Ministère des Affaires étrangères") },
          { title: "Visite au Centre EYA de Cotonou", video: video("case-pilote-centre-eya", "Centre communautaire EYA de Cotonou") },
          { title: "Soirée de gala pour la délégation de Savè en Martinique", video: video("gala-save-martinique", "Soirée de gala en Martinique") },
          { title: "Réception organisée par Bernard Hayot", video: video("reception-bernard-hayot", "Réception organisée par Bernard Hayot") },
          { title: "YèkèYèkè 2025 : accompagnement du maire de Grand-Popo dans les activités culturelles et cultuelles", video: video("yekeyeke-grand-popo-2025", "Fête YèkèYèkè 2025 à Grand-Popo") },
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
        image: photo("fanou-directeur-associe-2026", "Endurance Martial B. Fanou, Directeur associé du cabinet FM Consulting") as Img,
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
      fields: [
        eyebrow,
        title(),
        list("items", "Institutions", "une institution", [text("name", "Nom"), text("detail", "Interlocuteur et années", "Facultatif. Ex. Secrétaire général · 2024, 2026")], { summary: "name" }),
      ],
      defaults: {
        eyebrow: "Nos interlocuteurs",
        title: "Institutions *rencontrées*.",
        items: [
          { name: "Ministère des Affaires étrangères", detail: "Secrétaire général · 2024, 2026" },
          { name: "Ministère de l'Enseignement supérieur et de la Recherche scientifique", detail: "Audiences avec la Ministre · 2024, 2025" },
          { name: "Ministère du Commerce", detail: "Directeur de cabinet · 2023, 2024" },
          { name: "ATDA, Ministère de l'Agriculture", detail: "Directeur général · 2024" },
          { name: "APIEX", detail: "Directeur des études et investissements, aujourd'hui DG · 2023, 2024" },
          { name: "Chambre d'Agriculture du Bénin", detail: "Président · 2025" },
          { name: "Chambre des métiers de l'Artisanat", detail: "Vice-présidente · 2024, 2025" },
          { name: "Projet Songhaï", detail: "Directeur exécutif, en vue de partenariats · 2025" },
          { name: "Mairies de Savè, Ouidah, Tori, Porto-Novo et Grand-Popo", detail: "Séances d'échanges avec les maires" },
          { name: "Ville de Case-Pilote (Martinique)", detail: "Jumelage avec Savè" },
        ] as { name: string; detail: string }[],
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
              "Recherche de partenariats avec des entités footballistiques et une académie de football parisienne\nDemande de jumelage d'universités d'Outre-Mer avec celles du Bénin (rencontre d'échanges avec le DAC du MESRS)\nBourses d'études pour les étudiants africains, notamment en filières scientifiques, et partenariat de l'Université de Zielona Góra (Pologne) avec celle d'Abomey-Calavi, sous la tutelle de la mairie d'Abomey-Calavi\nCoopération entre la mairie de Grand-Popo, Agoué et deux collectivités de Martinique\nParticipation au programme PartiCiP au DEL avec des investisseurs afrodescendants (décembre 2024)",
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
          { title: "Nos activités en cours : communication en préparation du Salon des Maires et des Collectivités Locales (SMCL, 24 au 26 novembre 2026) lors de l'Assemblée générale de l'ANCB en août 2026", video: video("ancb-smcl-2026", "Communication de FM Consulting à l'Assemblée générale de l'ANCB, août 2026") },
          { title: "Visite des hommes d'affaires martiniquais : rencontre avec la Ministre de l'Enseignement supérieur du Bénin", video: video("ministre-mesrs-hommes-affaires-martiniquais", "Rencontre des hommes d'affaires martiniquais avec la Ministre de l'Enseignement supérieur") },
          { title: "Visite de la délégation de Martinique à la mairie de Ouidah", video: video("delegation-martinique-ouidah", "Délégation de Martinique à la mairie de Ouidah") },
          { title: "Visite de la délégation de Martinique à la mairie de Savè", video: video("delegation-martinique-save", "Délégation de Martinique à la mairie de Savè") },
          { title: "Visite du 1er adjoint au maire de Case-Pilote au Centre EYA de Cotonou", video: video("case-pilote-centre-eya", "Centre communautaire EYA de Cotonou") },
          { title: "Séance de travail au Ministère des Affaires étrangères", video: video("seance-travail-mae", "Séance de travail au Ministère des Affaires étrangères") },
          { title: "Soirée de gala pour la délégation de la mairie de Savè en Martinique", video: video("gala-save-martinique", "Soirée de gala en Martinique") },
          { title: "Réception organisée par Bernard Hayot au restaurant du chef étoilé Bredas", video: video("reception-bernard-hayot", "Réception organisée par Bernard Hayot") },
          { title: "YèkèYèkè 2025 : accompagnement du maire de Grand-Popo dans les activités culturelles et cultuelles", video: video("yekeyeke-grand-popo-2025", "Fête YèkèYèkè 2025 à Grand-Popo") },
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

// ─── Mission SMCL Paris 2026 (activité en cours) ─────────────────────────────
// Textes tirés de la « Fiche signalétique du SMCL 2026 » et de la feuille de route
// « Coopération décentralisée & diplomatie territoriale » (AG de l'ANCB, 18 août 2026).
const SMCL_SIGNUP = "https://smcl.beninois-du-monde.com/inscription";

const smcl = {
  title: "Mission SMCL 2026",
  path: "/smcl-2026",
  help: "Page dédiée à l'activité en cours : la mission des communes du Bénin au Salon des Maires de Paris (novembre 2026).",
  sections: {
    header: section({
      label: "En-tête de page",
      fields: [
        eyebrow,
        area("title", "Titre", ACCENT_HELP, 2),
        area("text", "Texte d'introduction", undefined, 3),
        videoField("video", "Vidéo"),
        list("facts", "Repères", "un repère", [text("label", "Intitulé"), text("value", "Valeur")], { summary: "label", max: 4 }),
        text("countdown", "Date d'ouverture du salon", "Format AAAA-MM-JJ. Affiche le compte à rebours « J-… ». Laissez vide pour le masquer."),
        link("cta", "Bouton principal"),
        link("secondary", "Bouton secondaire"),
      ],
      defaults: {
        eyebrow: "Activité en cours · ANCB × FM Consulting",
        title: "SMCL Paris 2026 : le *tremplin international* des communes du Bénin.",
        text: "Sous la tutelle de l'ANCB, le cabinet FM Consulting invite les élus locaux du Bénin au Salon des Maires et des Collectivités Locales, à Paris, pour une diplomatie territoriale incisive et offensive.",
        video: video("ancb-smcl-2026", "Communication de FM Consulting à l'Assemblée générale de l'ANCB, août 2026") as Vid,
        facts: [
          { label: "Dates", value: "24 – 26 novembre 2026" },
          { label: "Lieu", value: "Paris Expo, Porte de Versailles" },
          { label: "Communes concernées", value: "Les 77 communes du Bénin" },
        ] as { label: string; value: string }[],
        countdown: "2026-11-24",
        cta: { label: "Inscrire ma commune", href: SMCL_SIGNUP } as Link,
        secondary: { label: "Nous contacter", href: "/contact" } as Link,
      },
    }),
    why: section({
      label: "Pourquoi aujourd'hui",
      hideable: true,
      fields: [eyebrow, title(), area("text", "Texte", "Laissez une ligne vide entre deux paragraphes.", 6), area("quote", "Encadré « engagement »", undefined, 3), text("quoteAuthor", "Auteur de l'encadré")],
      defaults: {
        eyebrow: "Pourquoi aujourd'hui ?",
        title: "L'action internationale n'est plus un luxe : *c'est un levier*.",
        text: "Vos territoires regorgent d'opportunités. Pour libérer leur plein potentiel, l'action internationale est devenue un levier stratégique de développement local, de financement et d'attractivité.\n\nÀ l'heure où les 77 communes du Bénin renouvellent la gouvernance de leur association faîtière, l'ANCB, le renforcement de l'action extérieure des collectivités locales est un levier déterminant d'attractivité, de transfert de compétences et de financement du développement local.\n\nLe Salon des Maires et des Collectivités Locales est le plus grand rassemblement d'élus territoriaux d'Europe. Notre ambition est simple : faire de cet événement le grand tremplin international du municipalisme béninois.",
        quote: "Mettre à disposition des maires béninois plus de 30 ans d'expérience au cœur des collectivités territoriales françaises, un accès direct aux réseaux d'élus en France et une maîtrise des dispositifs d'appui institutionnels et financiers (MEAE, AFD, Union européenne).",
        quoteAuthor: "L'expert-conseil de FM Consulting, cadre dirigeant retraité de la fonction publique territoriale française",
      },
    }),
    ambition: section({
      label: "Ce que nous allons construire",
      hideable: true,
      fields: [eyebrow, title(), list("items", "Engagements", "un engagement", [icon(), text("title", "Titre"), area("text", "Texte", undefined, 4)], { summary: "title" })],
      defaults: {
        eyebrow: "Concrètement",
        title: "Ce que nous allons *construire ensemble*.",
        items: [
          { icon: "institution", title: "Vous positionner au plus haut niveau", text: "Des rencontres exclusives avec l'Association des Maires de France (AMF), Cités Unies France et de nombreuses collectivités territoriales françaises en quête de nouveaux partenariats." },
          { icon: "chart", title: "Mobiliser les financements publics", text: "Une séance de travail de haut niveau entre l'ANCB, l'Ambassade du Bénin en France et la Direction de la coopération décentralisée du ministère français des Affaires étrangères, pour débloquer des guichets comme le FICOL de l'AFD." },
          { icon: "target", title: "Sécuriser l'ingénierie", text: "Pas un simple voyage, mais une méthodologie rigoureuse de bout en bout : de la formulation de vos fiches-projets avant le départ jusqu'à la signature de conventions et leur suivi opérationnel en 2027." },
        ] as { icon: string; title: string; text: string }[],
      },
    }),
    salon: section({
      label: "Au salon",
      hideable: true,
      fields: [
        eyebrow,
        title(),
        area("text", "Texte", undefined, 3),
        text("leftTitle", "Titre de la colonne de gauche"),
        list("positioning", "Positionnement au salon", "un point", [text("title", "Titre"), area("text", "Texte", undefined, 2)], { summary: "title" }),
        text("rightTitle", "Titre de la colonne de droite"),
        list("networks", "Réseaux d'acteurs", "un réseau", [text("title", "Titre"), area("text", "Texte", undefined, 2)], { summary: "title" }),
      ],
      defaults: {
        eyebrow: "Au SMCL",
        title: "Une vitrine *d'exception* pour les communes béninoises.",
        text: "Le salon offre une vitrine unique pour valoriser les potentialités des communes du Bénin et nouer des partenariats concrets avec les collectivités françaises.",
        leftTitle: "Positionnement au salon",
        positioning: [
          { title: "Stand institutionnel ANCB", text: "Vitrine de l'intercommunalité et du dynamisme territorial béninois." },
          { title: "Sessions B2B", text: "Mises en relation ciblées entre maires béninois et maires français." },
          { title: "Ateliers thématiques", text: "Transition écologique, gestion des déchets, numérisation et eau potable." },
        ] as { title: string; text: string }[],
        rightTitle: "Réseaux d'acteurs clés",
        networks: [
          { title: "Association des Maires de France (AMF)", text: "Rencontre officielle avec la présidence pour relancer les jumelages." },
          { title: "Cités Unies France (CUF)", text: "Mobilisation du « Groupe Pays Bénin » et partage d'expériences." },
          { title: "Réseaux régionaux multi-acteurs (RRMA)", text: "Synergies avec les associations régionales de coopération." },
        ] as { title: string; text: string }[],
      },
    }),
    tripartite: section({
      label: "Séance de travail tripartite",
      hideable: true,
      fields: [
        eyebrow,
        title(),
        area("text", "Texte", undefined, 3),
        area("participants", "Participants", "Un participant par ligne.", 3),
        area("axes", "Axes de discussion", "Un axe par ligne.", 3),
        list("funds", "Mécanismes financiers", "un mécanisme", [text("title", "Nom"), area("text", "Description", undefined, 2)], { summary: "title" }),
      ],
      defaults: {
        eyebrow: "En marge du salon",
        title: "Une séquence institutionnelle *de haut niveau*.",
        text: "Une journée dédiée au cadrage institutionnel et à la mobilisation des financements publics pour soutenir les projets de développement municipal.",
        participants: "Les maires du Bénin (ANCB)\nL'Ambassade du Bénin en France\nLa Direction de la coopération décentralisée (DAECT / MEAE)",
        axes: "Alignement entre la politique étrangère du Bénin et l'action extérieure des collectivités.\nArticulation des priorités locales avec les orientations de la diplomatie française.",
        funds: [
          { title: "FICOL (AFD)", text: "Financement des projets portés par des collectivités, de 200 000 € à 1 M€." },
          { title: "Fonds d'appui DAECT", text: "Cofinancement annuel des partenariats de coopération décentralisée." },
        ] as { title: string; text: string }[],
      },
    }),
    pillars: section({
      label: "Dispositif en trois piliers",
      hideable: true,
      fields: [eyebrow, title(), list("items", "Piliers", "un pilier", [text("title", "Titre"), area("text", "Texte", undefined, 3)], { summary: "title" })],
      defaults: {
        eyebrow: "Notre accompagnement",
        title: "Un dispositif global *en trois piliers*.",
        items: [
          { title: "Préparation et ingénierie", text: "Diagnostic des besoins des communes, élaboration des fiches de projets de coopération et constitution des dossiers de partenariat." },
          { title: "Diplomatie et réseaux", text: "Facilitation des accès auprès du MEAE, de l'Ambassade du Bénin à Paris, de l'AMF et des conseils régionaux et départementaux français." },
          { title: "Suivi et pérennisation", text: "Formalisation des conventions de partenariat, montage des requêtes de cofinancement (FICOL, DAECT) et suivi après le salon." },
        ] as { title: string; text: string }[],
      },
    }),
    timeline: section({
      label: "Calendrier de la mission",
      hideable: true,
      fields: [
        eyebrow,
        title(),
        list("items", "Étapes", "une étape", [text("period", "Période"), area("action", "Actions clés", undefined, 2), area("result", "Livrables et résultats attendus", undefined, 2)], { summary: "period" }),
      ],
      defaults: {
        eyebrow: "Août – décembre 2026",
        title: "Le calendrier *de la mission*.",
        items: [
          { period: "18 – 31 août 2026", action: "Restitution après l'AG de l'ANCB et cartographie des besoins des 77 communes.", result: "Relevé des intentions de coopération et constitution du groupe de travail ANCB." },
          { period: "Septembre 2026", action: "Cadrage technique des projets ; contacts avec l'AMF, Cités Unies France et le MEAE.", result: "Catalogue officiel des projets de coopération des communes béninoises." },
          { period: "Octobre 2026", action: "Organisation logistique et calage de l'agenda institutionnel à Paris.", result: "Planning officiel des rendez-vous B2B et confirmation de la session DAECT / Ambassade." },
          { period: "Novembre 2026", action: "Déploiement de la délégation à Paris (SMCL) et rencontres au MEAE.", result: "Signatures de déclarations d'intention et d'accords d'engagement partenarial." },
          { period: "Décembre 2026", action: "Bilan stratégique, contractualisation et dépôt des dossiers de cofinancement.", result: "Feuille de route 2027 de la coopération décentralisée Bénin – France." },
        ] as { period: string; action: string; result: string }[],
      },
    }),
    recommendations: section({
      label: "Recommandations à l'ANCB",
      hideable: true,
      fields: [eyebrow, title(), list("items", "Recommandations", "une recommandation", [text("title", "Titre"), area("text", "Texte", undefined, 2)], { summary: "title" })],
      defaults: {
        eyebrow: "Gouvernance de l'ANCB",
        title: "Nos *recommandations*.",
        items: [
          { title: "Une commission permanente « Coopération décentralisée & Attractivité »", text: "Créée au sein de l'ANCB pour assurer le suivi technique des partenariats." },
          { title: "Le SMCL 2026 à l'agenda prioritaire des maires", text: "Inscrire le déplacement dès le renouvellement du bureau du 18 août." },
          { title: "Une approche par pôles territoriaux", text: "Mutualiser, par pôles ou intercommunalités, les projets présentés aux partenaires français et internationaux." },
        ] as { title: string; text: string }[],
      },
    }),
    join: section({
      label: "Appel à l'inscription",
      fields: [title(), area("text", "Texte", undefined, 3), link("cta", "Bouton principal"), link("secondary", "Bouton secondaire")],
      defaults: {
        title: "Donnons ensemble à vos mandats une *dimension internationale*.",
        text: "La coopération décentralisée ne doit plus être réservée à quelques communes privilégiées : elle doit bénéficier aux 77 territoires du Bénin, urbains comme ruraux. L'ANCB et notre réseau d'experts sont à votre disposition pour vous accompagner.",
        cta: { label: "Inscrire ma commune", href: SMCL_SIGNUP } as Link,
        secondary: { label: "Programme détaillé", href: "https://smcl.beninois-du-monde.com/programme" } as Link,
      },
    }),
  },
} satisfies PageDef;

export const pages = { home, about, services, smcl, media, news, contact, settings };

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
