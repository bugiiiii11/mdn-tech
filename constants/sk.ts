// Slovak landing page (/sk) content — single source of truth for copy + data.
// Pure-data module (no JSX): section components resolve `icon` string keys to
// react-icons components locally, so this file is safe to import from the
// server component at app/(marketing)/sk/page.tsx (metadata + JSON-LD).

// --- Brand / SEO ---------------------------------------------------------

export const SK_SITE = {
  baseUrl: "https://mdntech.org",
  path: "/sk",
  url: "https://mdntech.org/sk",
  // Brand suffix is appended by the root metadata title template (`%s | M.D.N Tech`),
  // so it is intentionally omitted here to avoid a doubled suffix in <title>.
  title: "Tvorba webu, SEO a automatizácia pre slovenské firmy",
  description:
    "Expandujte svoj biznis online. Web, SEO, biznis analýza a automatizácia procesov pre slovenské firmy — moderné digitálne riešenia od jedného partnera. Web do týždňa, bezplatná biznis analýza.",
  keywords: [
    "tvorba webu Slovensko",
    "tvorba web stránok",
    "web na mieru",
    "SEO Slovensko",
    "SEO optimalizácia",
    "biznis analýza",
    "automatizácia procesov",
    "digitálna agentúra Slovensko",
    "web pre firmy",
    "klientsky portál",
    "rezervačný systém",
    "chatbot pre firmy",
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
  { title: "Prečo my", link: "/sk#preco-my" },
  { title: "Realizácie", link: "/sk#realizacie" },
  { title: "Postup", link: "/sk#ako-to-funguje" },
  { title: "Kontakt", link: "/sk#kontakt" },
] as const;

// --- Hero ----------------------------------------------------------------

export const SK_HERO = {
  titleLine1: "Expandujte",
  titleLine2: "svoj biznis online.",
  subtitle:
    "Web · SEO · biznis analýza · automatizácia — digitálne riešenia pre slovenských podnikateľov.",
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
    title: "Automatizácia a systémy na mieru",
    description:
      "Objednávkový systém, tvorba faktúr, databázy, chatbot 24/7, automatické notifikácie, klientský, či admin portál — operatíva, ktorá šetrí čas a peniaze.",
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
    name: "Kúrenie Turiec",
    domain: "kurenieturiec.sk",
    href: "https://kurenieturiec.sk",
    image: "/portfolio/kurenieturiec.jpg",
    description:
      "Web a lokálne SEO pre kúrenársku a inštalatérsku firmu z regiónu Turiec — pripravený nosiť zákazníkov z Googlu.",
    tags: ["Web", "Lokálne SEO", "Biznis analýza"],
  },
  {
    name: "Royal Stroje",
    domain: "royalstroje.sk",
    href: "https://royalstroje.sk",
    image: "/portfolio/royalstroje.jpg",
    description:
      "Web pre požičovňu náradia a stavebnej techniky v Senci — s automatizáciou procesov a prístupom k databáze cez admin portál.",
    tags: ["Web", "Lokálne SEO", "Command Center"],
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
