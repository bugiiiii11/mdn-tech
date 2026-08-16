// Slovak landing page (/sk) content — single source of truth for copy + data.
// Pure-data module (no JSX): section components resolve `icon` string keys to
// react-icons components locally, so this file is safe to import from the
// server component at app/(marketing)/sk/page.tsx (metadata + JSON-LD).

import type { FaqEntry } from "@/components/product-pages/faq";

// --- Brand / SEO ---------------------------------------------------------

export const SK_SITE = {
  baseUrl: "https://mdntech.org",
  path: "/sk",
  url: "https://mdntech.org/sk",
  // Brand suffix is appended by the root metadata title template (`%s | M.D.N Tech`),
  // so it is intentionally omitted here to avoid a doubled suffix in <title>.
  title: "Tvorba webu, CRM systémov a AI chatbotov pre firmy",
  description:
    "Tvorba webov, CRM systémov na mieru a AI chatbotov pre slovenské firmy. Bezplatná biznis analýza, dodanie v rekordnom čase, živé referencie ako royalstroje.sk.",
  keywords: [
    "tvorba webu Slovensko",
    "tvorba web stránok",
    "web na mieru",
    "CRM systém na mieru",
    "tvorba CRM",
    "CRM pre malé firmy",
    "AI chatbot pre firmy",
    "chatbot na webstránku",
    "systém pre požičovňu",
    "evidencia zákaziek",
    "SEO Slovensko",
    "SEO optimalizácia",
    "biznis analýza",
    "automatizácia procesov",
    "digitálna agentúra Slovensko",
    "web pre firmy",
    "klientsky portál",
    "rezervačný systém",
    "Google Moja Firma",
    "lokálne SEO",
  ],
} as const;

// --- NAP / contact -------------------------------------------------------

export const SK_NAP = {
  brand: "M.D.N Tech",
  areaServed: "Slovensko",
  phoneDisplay: "0904 904 091",
  phoneIntl: "+421904904091",
  phoneHref: "tel:+421904904091",
  whatsappDisplay: "+971 58 228 3256",
  whatsappHref: "https://wa.me/971582283256",
  email: "contact@mdntech.org",
  emailHref: "mailto:contact@mdntech.org",
} as const;

// --- Section anchors -----------------------------------------------------

export const SK_NAV_LINKS = [
  { title: "Služby", link: "/sk#sluzby" },
  { title: "CRM", link: "/sk#crm" },
  { title: "Referencie", link: "/sk#realizacie" },
  { title: "Kto sme", link: "/sk#kto-sme" },
  { title: "FAQ", link: "/sk#faq" },
  { title: "Kontakt", link: "/sk#kontakt" },
] as const;

// --- Hero ----------------------------------------------------------------

export const SK_HERO = {
  titleLine1: "Expandujte",
  titleLine2: "svoj biznis online.",
  subtitle:
    "Web · CRM systémy · AI chatboty · SEO — digitálne riešenia pre slovenské firmy.",
  ctaPrimary: { label: "Nezáväzná konzultácia zdarma", href: "#kontakt" },
  ctaSecondary: { label: "Pozrite realizácie", href: "#realizacie" },
} as const;

// --- Pre koho ------------------------------------------------------------

export const SK_FOR_WHOM = [
  {
    icon: "rocket",
    title: "Začínate?",
    description:
      "Postavíme vám kompletný digitálny základ: profesionálny web, vizuálnu identitu a základnú viditeľnosť na Googli. Pevný štart pre váš biznis.",
  },
  {
    icon: "trending",
    title: "Už podnikáte?",
    description:
      "Posunieme vás vyššie: biznis analýza odhalí páky rastu, SEO vás dostane pred konkurenciu a automatizácia procesov vám ušetrí čas aj náklady.",
  },
] as const;

// --- Čo robíme — value ladder -------------------------------------------

export const SK_VALUE_LADDER = [
  {
    icon: "search",
    step: "01",
    title: "Biznis analýza (AI)",
    description:
      "Najprv pochopíme váš biznis, prescanujeme konkurenciu a nájdeme možnosti rastu. Odhalíme, čo váš biznis potrebuje — webová stránka, mobilná aplikácia, admin portál, či CRM systém.",
    price: "Zdarma k webu",
    highlight: true,
  },
  {
    icon: "globe",
    step: "02",
    title: "Web na mieru",
    description:
      "Profesionálny a rýchly web, ktorý zviditeľňuje vašu značku a prináša nových zákazníkov.",
    price: "od 1 000 €",
    highlight: false,
  },
  {
    icon: "seo",
    step: "03",
    title: "SEO + viditeľnosť",
    description:
      "Aby vás zákazníci našli skôr ako konkurenciu. Lokálne Google leady, vyhľadávanie cez AI, technické a obsahové SEO.",
    price: "od 500 €",
    highlight: false,
  },
  {
    icon: "automation",
    step: "04",
    title: "CRM a systémy na mieru",
    description:
      "Evidencia zákazníkov a zákaziek, správa strojov či inventára, automatické podklady k fakturácii a prehľady na jeden klik. K tomu objednávkové systémy, chatbot 24/7 a klientske či admin portály — operatíva, ktorá šetrí čas a peniaze.",
    price: "od 3 000 € · cena na mieru",
    highlight: false,
  },
] as const;

// --- Prečo my ------------------------------------------------------------

export const SK_WHY_US = [
  {
    icon: "clock",
    title: "Rekordný čas dodania",
    description:
      "Webovú stránku dodávame zvyčajne do jedného týždňa, komplexné systémy do jedného mesiaca. Expresný čas dodania bez kompromisov v kvalite je naším štandardom.",
  },
  {
    icon: "gift",
    title: "Bezplatná biznis analýza",
    description:
      "Ku každému webu pridávame biznis analýzu, ktorá odhalí príležitosti rastu vášho podnikaniana a eliminuje slabé stránky.",
  },
  {
    icon: "layers",
    title: "Všetko z jednej ruky",
    description:
      "Dôkladná analýza, technická dokumentácia, tvorba webu, branding, texty, SEO, automatizácia procesov — všetko na mieru od jedného partnera.",
  },
  {
    icon: "cpu",
    title: "AI = rýchlejšie a modernejšie",
    description:
      "Pracujeme s najnovšími AI nástrojmi a systémami, takže dodávame špičkový výsledok za rozumnú cenu a výrazne rýchlejšie ako konkurenčné IT firmy.",
  },
  {
    icon: "check",
    title: "Reálne výsledky",
    description:
      "Živé weby, ktoré sme vytvorili pre slovenských podnikateľov. Reálne referencie, ktoré si viete pozrieť.",
  },
  {
    icon: "users",
    title: "Skúsený tím",
    description:
      "Naši programátori majú dlhoročné skúsenosti s tvorbou komplexných aplikácií, portálov, AI systémov, či blockchainu. Kladieme dôraz na projektový manažment a prácu s najnovšími technológiami.",
  },
] as const;

// --- Realizácie ----------------------------------------------------------

export const SK_PORTFOLIO = [
  {
    name: "Royal Stroje",
    domain: "royalstroje.sk",
    href: "https://royalstroje.sk",
    image: "/portfolio/royalstroje.jpg",
    description:
      "Web, CRM na mieru a AI chatbot pre požičovňu náradia a stavebnej techniky v Senci — katalóg strojov, evidencia zákaziek a asistent, ktorý odpovedá 24/7.",
    tags: ["Web", "CRM", "AI chatbot"],
    // Flagship reference: the card links to the case study instead of the
    // live site (the live-site link moves into the case study itself).
    caseStudyHref: "/sk/referencie/royal-stroje",
  },
  {
    name: "Royal Works",
    domain: "royalworks.sk",
    href: "https://royalworks.sk",
    image: "/portfolio/royalworks.jpg",
    description:
      "Web pre firmu na údržbu pozemkov, výrub stromov a opravy kanalizácie v Bratislave a okolí — osem oblastí služieb prehľadne na jednom mieste.",
    tags: ["Web", "Lokálne SEO", "Dizajn na mieru"],
  },
  {
    name: "Good Hair by Zane",
    domain: "goodhairbyzane.com",
    href: "https://goodhairbyzane.com",
    image: "/portfolio/goodhairbyzane.jpg",
    description:
      "Web pre kadernícky salón špecializovaný na predlžovanie vlasov a regeneračné kúry — elegantný, rýchly a plný atmosféry.",
    tags: ["Web", "SEO", "Dizajn na mieru"],
  },
  {
    name: "Kúrenie Turiec",
    domain: "kurenieturiec.sk",
    href: "https://kurenieturiec.sk",
    image: "/portfolio/kurenieturiec.jpg",
    description:
      "Web a lokálne SEO pre kúrenársku a inštalatérsku firmu z regiónu Turiec — pripravený nosiť zákazníkov z Googlu.",
    tags: ["Web", "Lokálne SEO", "Biznis analýza"],
  },
] as const;

// --- Ako to funguje ------------------------------------------------------

export const SK_PROCESS = [
  {
    icon: "phone",
    step: "01",
    title: "Nezáväzná konzultácia",
    description:
      "Krátky rozhovor o vašich cieľoch a potrebách. Na základe toho navrhneme optimálne riešenie a cenovú ponuku.",
  },
  {
    icon: "search",
    step: "02",
    title: "Biznis analýza",
    description:
      "Pochopíme váš biznis, nájdeme možnosti rastu a navrhneme riešenie na mieru s jasnou cenou.",
  },
  {
    icon: "code",
    step: "03",
    title: "Postavíme to",
    description:
      "Web alebo systém dodáme v rekordnom čase — otestované, zabezpečené a pripravené na zákazníkov.",
  },
  {
    icon: "trending",
    step: "04",
    title: "Rast a podpora",
    description:
      "SEO, vylepšenia funkcií a podpora po spustení podľa potreby — aby váš biznis rástol a prosperoval.",
  },
] as const;

// --- Cenník (indikatívne kotvy) -----------------------------------------

export const SK_PRICING = {
  items: [
    { service: "Biznis analýza", price: "zdarma k webu" },
    { service: "Web / landing (vrátane analýzy)", price: "od 1 000 €" },
    { service: "SEO", price: "od 500 €" },
    { service: "Systém / automatizácia / portál na mieru", price: "od 3 000 €" },
    { service: "Podpora po spustení", price: "dohodou, cca 30 €/h" },
  ],
  note: "Finálna cena vždy po nezáväznej konzultácii. Pri väčšej objednávke zľava.",
} as const;

// --- CRM (flagship service, anchor #crm) ---------------------------------

export const SK_CRM = {
  title: "CRM systém presne pre vašu firmu",
  intro:
    "Excel a papierové zošity fungujú — kým firma nerastie. Postavíme vám CRM presne podľa vašich procesov: evidencia zákazníkov a zákaziek, správa strojov či inventára, automatické podklady k fakturácii, prehľady na jeden klik.",
  benefits: [
    "Na mieru vašim procesom — žiadne ohýbanie firmy podľa softvéru",
    "Prístup z mobilu aj z kancelárie",
    "Napojenie na web, e-mail a chatbota",
    "Odovzdanie so zaškolením, podpora po spustení",
  ],
  reference: {
    eyebrow: "Referencia",
    name: "royalstroje.sk",
    description:
      "Web, CRM na správu požičovne a AI chatbot pre jedného klienta.",
    image: "/portfolio/royalstroje.jpg",
    caseStudy: {
      label: "Pozrite si prípadovú štúdiu",
      href: "/sk/referencie/royal-stroje",
    },
  },
  cta: { label: "Chcem nezáväznú konzultáciu k CRM", href: "#kontakt" },
} as const;

// --- Kto sme (founder trust section, anchor #kto-sme) --------------------
// Positioning (rework plan v1.0): "slovenský founder, medzinárodná firma" —
// the UAE entity is transparent but never the headline. ČSOB reference only,
// no internal project names (user decision 2026-08-16).

export const SK_ABOUT = {
  title: "Kto stojí za M.D.N Tech",
  founder: {
    name: "Martin Jeřábek",
    role: "Founder & CEO",
    image: "/team/1.jpg",
  },
  paragraphs: [
    "M.D.N Tech založil Martin Jeřábek, slovenský developer a projektový manažér. Predtým pôsobil ako projektový manažér v ČSOB banke v oblasti mobilného bankovníctva. Dnes s tímom dodáva weby, CRM systémy a AI chatboty pre firmy na Slovensku aj v zahraničí.",
    "Sídlo máme v Spojených arabských emirátoch, vývoj a komunikácia prebieha v slovenčine. Medzinárodná štruktúra nám umožňuje dodávať klientom po celom svete — pre vás sa nič nekomplikuje: slovenský kontakt, slovenská podpora, zmluva a faktúra bez prekvapení (podrobnosti vo FAQ nižšie).",
  ],
  companyLinkedIn: {
    label: "M.D.N Tech na LinkedIn",
    // Numeric company URL — the /company/mdntech vanity slug is not claimed
    // yet. Swap once Martin claims it (rework plan C4).
    href: "https://www.linkedin.com/company/111977261",
  },
} as const;

// --- FAQ (anchor #faq, rendered via components/product-pages/faq.tsx) ----
// The invoicing answer (#3) is the trust weapon of the page — reverse-charge
// explained plainly, not hidden in fine print. FAQ #4 (hosting/GDPR) and #5
// (contract) await Filip's confirmation of the exact legal wording — the
// current text is the safe draft from the rework plan.

export const SK_FAQ = [
  {
    question: "Kto je M.D.N Tech?",
    answer:
      "Technologická firma založená slovenským developerom Martinom Jeřábkom, predtým projektovým manažérom v ČSOB banke. Dodávame weby, CRM systémy, AI chatboty a automatizáciu pre firmy na Slovensku aj v zahraničí. Komunikácia, dodanie aj podpora prebiehajú v slovenčine.",
  },
  {
    question: "Prečo má firma sídlo v Spojených arabských emirátoch?",
    answer:
      "Pôsobíme medzinárodne a UAE štruktúra nám umožňuje dodávať klientom po celom svete. Pre vás sa tým nič nemení — kontakt, komunikácia a dodanie sú slovenské a fakturácia je jednoduchá (pozrite nasledujúcu otázku).",
  },
  {
    question: "Ako funguje fakturácia? Nebude s tým problém v účtovníctve?",
    answer:
      "Faktúru vystavujeme bez DPH a DPH si vysporiadate na Slovensku tzv. samozdanením — štandardný postup pri službách zo zahraničia, ktorý každý účtovník pozná. Do zmluvy aj ponuky vám všetko rozpíšeme vopred.",
    bullets: [
      "Ak ste platiteľ DPH: DPH si priznáte a zároveň odpočítate — výsledný efekt je nulový, žiadny náklad navyše.",
      "Ak nie ste platiteľ DPH: pred prvou faktúrou sa jednorazovo zaregistrujete podľa §7a zákona o DPH (vybavíme spolu, je to formulár) a DPH odvediete — v súčte zaplatíte rovnako, ako keby ste nakúpili od slovenskej agentúry s DPH.",
    ],
  },
  {
    question: "Kde budú naše dáta a systém?",
    answer:
      "Ostrá prevádzka vášho webu či CRM beží na hostingu v Európskej únii (alebo na vašom vlastnom hostingu) — v súlade s GDPR. Vývojové a testovacie prostredie prevádzkujeme na vlastnej infraštruktúre, bez reálnych osobných údajov. Súčasťou zmluvy je aj dohoda o spracúvaní osobných údajov (DPA).",
  },
  {
    question: "Akú zmluvu podpisujeme?",
    answer:
      "Na každý projekt podpisujeme písomnú zmluvu s jasným rozsahom prác, pevnou cenou, termínmi a zárukami. Ak systém pracuje s osobnými údajmi, súčasťou je aj dohoda o ich spracúvaní (DPA).",
  },
  {
    question: "Ako prebieha spolupráca?",
    answer:
      "1) Bezplatná biznis analýza — pochopíme vašu firmu a navrhneme, čo má zmysel. 2) Ponuka s pevnou cenou. 3) Dodanie po etapách, priebežne vidíte výsledok. 4) Odovzdanie so zaškolením a podpora po spustení.",
  },
  {
    question: "Koľko to stojí?",
    answer:
      "Analýza je zdarma. Web od 1 000 €, SEO od 500 €, CRM a systémy na mieru podľa rozsahu — po analýze dostanete pevnú ponuku. Bez skrytých poplatkov.",
  },
  {
    question: "Kto bude na projekte reálne pracovať?",
    answer:
      "Projekt vedie priamo Martin. Na väčších dodávkach spolupracujeme s overenými špecialistami pod jeho vedením — zodpovednosť za výsledok nesie vždy M.D.N Tech.",
  },
] as const satisfies readonly FaqEntry[];
