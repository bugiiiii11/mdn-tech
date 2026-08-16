// Case study copy for /sk/referencie/* — pure data, same contract as
// constants/sk.ts (no JSX, safe to import from server components for
// metadata + JSON-LD).
//
// HONESTY GATE (rework plan v1.0, SK-B): the "Výsledky" (measurable numbers)
// and founder-quote sections are deliberately ABSENT until the Royal Stroje
// founder supplies real figures, a quote, and approval — nothing invented
// ships to the campaign audience. When they arrive, add `results` and `quote`
// fields here and render them on the page; the layout already reads cleanly
// without them.

export const SK_CS_ROYAL_STROJE = {
  slug: "royal-stroje",
  path: "/sk/referencie/royal-stroje",
  url: "https://mdntech.org/sk/referencie/royal-stroje",
  // Root metadata template appends "| M.D.N Tech".
  metaTitle: "Prípadová štúdia: Royal Stroje — web, CRM a chatbot",
  metaDescription:
    "Ako sme požičovni náradia a stavebnej techniky v Senci postavili web s katalógom strojov, CRM na mieru a AI chatbota, ktorý odpovedá 24/7.",
  datePublished: "2026-08-16",

  hero: {
    title: "Royal Stroje: web, CRM a AI chatbot pre požičovňu stavebných strojov",
    lede: "Jedna firma, jeden dodávateľ, jeden systém: web s katalógom strojov, CRM presne podľa procesov požičovne a chatbot, ktorý odpovedá aj mimo otváracích hodín.",
    image: "/portfolio/royalstroje.jpg",
    imageAlt: "Náhľad webu royalstroje.sk",
    ctaPrimary: { label: "Nezáväzná konzultácia zdarma", href: "/sk#kontakt" },
    ctaSecondary: {
      label: "Pozrieť royalstroje.sk naživo",
      href: "https://royalstroje.sk",
      external: true,
    },
  },

  client: {
    title: "Klient",
    body: "Royal Stroje je požičovňa náradia a stavebnej techniky v Senci. Firma rastie — a s ňou aj počet strojov, zákaziek a zákazníkov, ktoré treba mať pod kontrolou.",
  },

  brief: {
    title: "Zadanie",
    body: "Dostať celú ponuku strojov online tak, aby si ju zákazník prezrel sám, a nahradiť ručnú evidenciu systémom, ktorý drží poriadok v strojoch, zákazkách aj zákazníkoch — a rastie spolu s firmou.",
  },

  solution: {
    title: "Riešenie",
    intro:
      "Tri časti, ktoré do seba zapadajú — web privádza dopyty, CRM drží poriadok v operatíve a chatbot odbavuje otázky, aj keď má požičovňa zatvorené.",
    blocks: [
      {
        icon: "globe",
        title: "Web royalstroje.sk",
        description:
          "Prehľadný katalóg náradia a techniky s jasným kontaktom na jeden klik, postavený na lokálne SEO — aby požičovňu našli zákazníci zo Senca a okolia.",
      },
      {
        icon: "database",
        title: "CRM na mieru",
        description:
          "Evidencia strojov, zákaziek a zákazníkov na jednom mieste, podklady k fakturácii a prehľady na jeden klik — cez admin portál prístupný z kancelárie aj z mobilu.",
      },
      {
        icon: "chat",
        title: "AI chatbot",
        description:
          "Vyškolený na obsahu webu, odpovedá návštevníkom na otázky o strojoch a požičaní 24/7 — aj mimo otváracích hodín.",
      },
    ],
  },

  cta: {
    title: "Riešite niečo podobné?",
    body: "Prvá biznis analýza je zdarma — pochopíme vašu firmu a navrhneme, čo má zmysel. Žiadne zdĺhavé procesy, len priamy rozhovor.",
    primary: { label: "Nezáväzná konzultácia zdarma", href: "/sk#kontakt" },
    secondary: { label: "Ako funguje fakturácia?", href: "/sk#faq" },
  },

  breadcrumb: [
    { name: "M.D.N Tech Slovensko", href: "/sk" },
    { name: "Referencie", href: "/sk#realizacie" },
    { name: "Royal Stroje", href: "/sk/referencie/royal-stroje" },
  ],
} as const;
