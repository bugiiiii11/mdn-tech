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
    "Ako sme požičovni náradia a stavebnej techniky v Senci postavili web s katalógom strojov, lokálne SEO, CRM na mieru a AI chatbota, ktorý odpovedá 24/7.",
  datePublished: "2026-08-16",

  hero: {
    title: "Royal Stroje: web, CRM a AI chatbot pre požičovňu stavebných strojov",
    lede: "Jedna firma, jeden dodávateľ, jeden systém: web s katalógom strojov postavený na lokálne vyhľadávanie, CRM presne podľa procesov požičovne a chatbot, ktorý odpovedá aj mimo otváracích hodín.",
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
          "Prehľadný katalóg náradia a techniky s jasným kontaktom na jeden klik — zákazník si ponuku prezrie sám, bez telefonátu.",
      },
      {
        icon: "search",
        title: "Lokálne SEO",
        description:
          "Web stavaný na to, aby požičovňu našli ľudia zo Senca a okolia — štruktúrované dáta o firme, obsah na lokálne dopyty a jednotné kontaktné údaje.",
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

  // Local SEO gets its own section because it is the part of the work a
  // prospect cannot see by visiting the site -- every item below is verifiable
  // in the page source of royalstroje.sk today.
  //
  // HONESTY GATE applies here too: this describes what was BUILT, never where
  // the site ranks. Positions move week to week and we have no Search Console
  // export to stand behind, so the closing note says so plainly rather than
  // reaching for "popredné pozície".
  localSeo: {
    title: "Lokálne SEO: aby firmu našli ľudia zo Senca",
    intro:
      "Požičovňu si nikto nevyberá podľa toho, kto má najkrajší web — ale podľa toho, kto sa zobrazí, keď v Senci niekto hľadá „požičovňa náradia“. Web sme preto od začiatku stavali na lokálne vyhľadávanie, nie až dodatočne.",
    items: [
      {
        icon: "map",
        title: "Štruktúrované dáta o firme",
        description:
          "Adresa, GPS súradnice a otváracie hodiny sú v kóde webu v strojovo čitateľnej podobe (LocalBusiness). Google ich nemusí hádať z textu a vie firmu spoľahlivo priradiť ku konkrétnemu mestu.",
      },
      {
        icon: "search",
        title: "Obsah stavaný na lokálne dopyty",
        description:
          "Titulok, popis aj texty pracujú s tým, ako ľudia naozaj hľadajú — „požičovňa náradia Senec“, nie všeobecné frázy bez mesta, o ktoré súperí celé Slovensko.",
      },
      {
        icon: "faq",
        title: "Časté otázky vo výsledkoch vyhľadávania",
        description:
          "Sekcia s otázkami je označená markupom FAQPage, takže odpovede o cenách, dovoze či dostupnosti sa môžu zobraziť priamo vo vyhľadávaní — ešte pred klikom na web.",
      },
      {
        icon: "phone",
        title: "Jednotné kontaktné údaje",
        description:
          "Názov, adresa a telefón sú naprieč webom v jednom presnom tvare. Rozhádzané údaje sú jeden z najčastejších dôvodov, prečo sa firme lokálne výsledky nehnú.",
      },
    ],
    note: "Konkrétne pozície vo vyhľadávaní sem doplníme, až keď ich budeme vedieť doložiť dátami — rovnako ako čísla v sekcii výsledkov.",
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
