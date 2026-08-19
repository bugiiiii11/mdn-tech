// Case study copy for /sk/referencie/* — pure data, same contract as
// constants/sk.ts (no JSX, safe to import from server components for
// metadata + JSON-LD).
//
// HONESTY GATE — SATISFIED 2026-08-19: the founder (Peter Krivosudský)
// supplied a written first-person account of the collaboration and consent
// for his name, the case study, the build story and the CRM screenshot. The
// quote is his text, lightly edited for length, diacritics and one softened
// figure ("vyše 100 klientov" -> "množstvo stálych klientov") with his
// explicit permission ("slová môžme upraviť podľa potreby"). Standing rules
// that survive the gate:
//   - Search RANKINGS appear ONLY inside his attributed quote, never in our
//     own voice (FULL-AUDIT-REPORT guardrail).
//   - `results` is deliberately QUALITATIVE (user decision 2026-08-20):
//     no client counts or timings in our voice anywhere on the page.
//   - No Review/aggregateRating schema: first-party testimonials on the
//     provider's own site are self-serving per Google's guidelines, and the
//     audit guardrail bans fabricated review markup outright.

export const SK_CS_ROYAL_STROJE = {
  slug: "royal-stroje",
  path: "/sk/referencie/royal-stroje",
  url: "https://mdntech.org/sk/referencie/royal-stroje",
  // Root metadata template appends "| M.D.N Tech".
  metaTitle: "Prípadová štúdia: Royal Stroje — web, CRM a chatbot",
  metaDescription:
    "Ako sme požičovni náradia a stavebnej techniky v Senci postavili web s katalógom strojov, lokálne SEO, CRM na mieru a AI chatbota, ktorý odpovedá 24/7.",
  datePublished: "2026-08-16",
  // Bumped when the page content materially changes (schema dateModified +
  // sitemap lastmod read this). 2026-08-19: story/results/quote sections.
  dateModified: "2026-08-19",

  hero: {
    title: "Royal Stroje: web, CRM a AI chatbot pre požičovňu stavebných strojov",
    lede: "Web s katalógom strojov postavený na lokálne vyhľadávanie, CRM presne podľa procesov požičovne a chatbot, ktorý odpovedá aj mimo otváracích hodín.",
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
      "Požičovňu si nikto nevyberá podľa toho, kto má najkrajší web — ale podľa toho, kto sa zobrazí, keď v Senci niekto hľadá „požičovňa náradia“. Web sme preto na lokálne vyhľadávanie stavali od prvého dňa.",
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
          "Sekcia s otázkami je označená markupom FAQPage, takže odpovede o cenách, dovoze či podmienkach požičania sa môžu zobraziť priamo vo vyhľadávaní — ešte pred klikom na web.",
      },
      {
        icon: "phone",
        title: "Jednotné kontaktné údaje",
        description:
          "Názov, adresa a telefón sú naprieč webom v jednom presnom tvare. Konzistentné údaje pomáhajú Googlu firmu jednoznačne rozpoznať a posilňujú jej dôveryhodnosť v lokálnych výsledkoch.",
      },
    ],
  },

  // The founder's narrative, retold in our voice — the facts and their order
  // come from his written account (see `quote`). Rankings deliberately do NOT
  // appear here; they live only inside his attributed words.
  story: {
    title: "Ako spolupráca prebiehala",
    intro:
      "Od nejasného zadania po systém, ktorý firma používa každý deň — spolupráca rástla krok za krokom, presne tak, ako rástla samotná požičovňa.",
    milestones: [
      {
        period: "Začiatok spolupráce",
        title: "Zadanie bez pevných kontúr",
        description:
          "Jednoduchý web, prehľadný katalóg strojov podľa kategórií a čo najlepšia viditeľnosť na Googli. Klient nemal jasnú predstavu o dizajne, štruktúre ani textoch — skúšali sme rôzne návrhy a v spoločnej diskusii sa postupne dopracovali ku konečnému výsledku.",
      },
      {
        period: "Týždeň pred otvorením prevádzky",
        title: "Web naživo na royalstroje.sk",
        description:
          "Katalóg šiel online ešte predtým, než požičovňa vôbec otvorila. Prvé telefonáty od zákazníkov prišli skôr, než bolo SEO úplne doladené — web začal pracovať od prvého dňa.",
      },
      {
        period: "Prvé týždne",
        title: "Doladenie lokálneho SEO",
        description:
          "Štruktúrované dáta, obsah na lokálne dopyty a jednotné kontaktné údaje — presne tá práca, ktorú popisuje sekcia vyššie. Dopyty začali prichádzať priamo z vyhľadávania.",
      },
      {
        period: "Automatizácia procesov",
        title: "Royal Command Center — CRM na mieru",
        description:
          "Rast priniesol novú potrebu: poriadok v operatíve. Vznikol systém, v ktorom si majiteľ spravuje katalóg strojov, databázu klientov, faktúry a prehľady o prevádzke — z kancelárie aj z mobilu.",
      },
      {
        period: "Priebežne",
        title: "Blog a AI chatbot",
        description:
          "Články na témy, ktoré si majiteľ vybral sám, a chatbot vyškolený na obsahu webu, ktorý odpovedá 24/7 — aj keď má požičovňa zatvorené.",
      },
      {
        period: "Dnes",
        title: "Kalendár a úlohy — systém rastie ďalej",
        description:
          "Zatiaľ posledné rozšírenie Command Centra: úlohy a termíny priamo v systéme. Digitálny produkt sa vyvíja presne podľa potrieb firmy — a rastie naďalej.",
      },
    ],
  },

  // Qualitative outcomes, no figures (user decision 2026-08-20): concrete
  // numbers repeated the timeline above and the quote below, so the section
  // now states what the work DELIVERS. Icons resolve via SOLUTION_ICONS on
  // the page.
  results: {
    title: "Výsledky",
    items: [
      {
        icon: "globe",
        title: "Funkčný a prehľadný web",
        description:
          "Rýchla a kvalitná vizitka firmy — katalóg strojov, ktorý si zákazník prezrie sám, s jasným kontaktom na jeden klik.",
      },
      {
        icon: "search",
        title: "SEO, ktoré privádza dopyty",
        description:
          "Kvalitne nastavené lokálne vyhľadávanie zvyšuje počet dopytov a otvára firme možnosti ďalšieho rastu.",
      },
      {
        icon: "database",
        title: "CRM systém na mieru",
        description:
          "Prehľady, databáza klientov a automatizácia procesov posúvajú fungovanie firmy na vyššiu úroveň.",
      },
    ],
  },

  quote: {
    title: "Slovami majiteľa",
    text: "Poprosil som Martina, aby mi spravil jednoduchý web s prehľadným katalógom strojov — jasnú predstavu o dizajne, štruktúre či textoch som pritom nemal. Veľmi si vážim jeho trpezlivosť a kreativitu: z veľmi nejasného zadania dokázal vytvoriť skvelý výsledok. Ani som sa nenazdal a už mi začali volať klienti, ešte predtým, než bolo SEO úplne doladené. V nasledujúcich týždňoch Martin vycibril SEO, čo nás dostalo na prvé miesta vo vyhľadávaní prenájmu strojov a náradia v Senci. Pomerne rýchlo sme mali množstvo stálych klientov — a tak vzniklo Royal Command Center, v ktorom si dnes spravujem katalóg strojov, ukladám klientov, vytváram faktúry a zapisujem úlohy do kalendára. Jedného dňa som sa zobudil a na webe mi svietil chatbot, ktorý je online nepretržite. Náš digitálny produkt sa vyvíja presne podľa našich potrieb. Služby M.D.N Tech odporúčam všetkými desiatimi.",
    author: "Peter Krivosudský",
    role: "majiteľ, Royal Stroje",
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
