// Case study copy for /sk/referencie/* — pure data, same contract as
// constants/sk.ts (no JSX, safe to import from server components for
// metadata + JSON-LD).
//
// HONESTY GATE — SATISFIED 2026-08-19: the founder (Peter Krivosudský)
// supplied a written first-person account of the collaboration, the numbers
// in `results`, and consent for his name, the case study, the build story and
// the CRM screenshot. The quote is his text, lightly edited for length and
// diacritics with his explicit permission ("slová môžme upraviť podľa
// potreby"). Standing rules that survive the gate:
//   - Search RANKINGS appear ONLY inside his attributed quote, never in our
//     own voice (FULL-AUDIT-REPORT guardrail; localSeo.note carries this).
//   - Every number in `results` is his, not ours — `results.note` says so.
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
    note: "Pozície vo vyhľadávaní v našom mene neuvádzame, kým ich nevieme doložiť dátami. To, čo vyhľadávanie firme prinieslo, popisuje majiteľ vlastnými slovami v citáte nižšie.",
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
        period: "Marec 2026",
        title: "Zadanie bez pevných kontúr",
        description:
          "Jednoduchý web, prehľadný katalóg strojov podľa kategórií a čo najlepšia viditeľnosť na Googli. Predstavu o dizajne, štruktúre a textoch klient nemal — návrhy sme pripravili my a doladili ich spolu s majiteľom.",
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
        period: "Po prvej stovke zákazníkov",
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
        period: "August 2026",
        title: "Kalendár a úlohy — systém rastie ďalej",
        description:
          "Zatiaľ posledné rozšírenie Command Centra: úlohy a termíny priamo v systéme. Digitálny produkt sa vyvíja presne podľa potrieb firmy — a neprestáva.",
      },
    ],
  },

  // Every figure below is the FOUNDER'S, from his written account — the note
  // says so on the page. Nothing here comes from our own measurement.
  results: {
    title: "Výsledky",
    stats: [
      {
        value: "Týždeň",
        label:
          "pred otvorením prevádzky bol web naživo — prvé dopyty prišli ešte pred doladením SEO",
      },
      {
        value: "100+",
        label:
          "zákazníkov krátko po spustení — impulz pre CRM a automatizáciu procesov",
      },
      {
        value: "5 mesiacov",
        label:
          "od prvého webu po CRM, blog a AI chatbota — jeden partner, jeden systém",
      },
    ],
    note: "Všetky čísla pochádzajú priamo od majiteľa firmy — z jeho vlastného zhrnutia spolupráce, ktoré citujeme nižšie. Pozície vo vyhľadávaní v našom mene neuvádzame, kým ich nevieme doložiť dátami.",
  },

  quote: {
    title: "Slovami majiteľa",
    text: "Poprosil som Martina, aby mi spravil jednoduchý web s prehľadným katalógom strojov — jasnú predstavu o dizajne, štruktúre či textoch som pritom nemal. Veľmi si vážim jeho trpezlivosť a kreativitu: z veľmi nejasného zadania dokázal vytvoriť skvelý výsledok. Ani som sa nenazdal a už mi začali volať klienti, ešte predtým, než bolo SEO úplne doladené. V nasledujúcich týždňoch Martin vycibril SEO, čo nás dostalo na prvé miesta vo vyhľadávaní prenájmu strojov a náradia v Senci. Pomerne rýchlo sme mali vyše 100 klientov — a tak vzniklo Royal Command Center, v ktorom si dnes spravujem katalóg strojov, ukladám klientov, vytváram faktúry a zapisujem úlohy do kalendára. Jedného dňa som sa zobudil a na webe mi svietil chatbot, ktorý je online nepretržite. Náš digitálny produkt sa vyvíja presne podľa našich potrieb. Služby M.D.N Tech odporúčam všetkými desiatimi.",
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
