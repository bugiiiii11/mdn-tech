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
    "Postavíme a posunieme tvoj biznis online. Web, SEO, biznis analýza a automatizácia procesov pre slovenské firmy — moderné digitálne riešenia od jedného partnera. Web do týždňa, bezplatná biznis analýza.",
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
  eyebrow: "Digitálny partner pre slovenské firmy",
  titleLine1: "Postavíme a posunieme",
  titleLine2: "tvoj biznis online.",
  subtitle:
    "Web · SEO · biznis analýza · automatizácia procesov — moderné digitálne riešenia pre slovenské firmy, od jedného partnera.",
  description:
    "Chceš posunúť svoj biznis na vyššiu úroveň? Najprv pochopíme, ako funguješ, a potom postavíme riešenie, ktoré ti reálne nosí zákazníkov a šetrí čas.",
  trustBadges: [
    "Web do týždňa",
    "Klientsky portál do mesiaca",
    "3 živé weby, nie mockupy",
  ],
  ctaPrimary: { label: "Nezáväzná konzultácia zdarma", href: "#kontakt" },
  ctaSecondary: { label: "Pozri realizácie", href: "#realizacie" },
} as const;

// --- Pre koho ------------------------------------------------------------

export const SK_FOR_WHOM = [
  {
    icon: "rocket",
    title: "Začínaš?",
    description:
      "Postavíme ti kompletný digitálny základ: profesionálny web, vizuálnu identitu, chatbota a základnú viditeľnosť na Googli. Pevný štart, na ktorom sa dá rásť.",
  },
  {
    icon: "trending",
    title: "Už podnikáš?",
    description:
      "Posunieme ťa vyššie: biznis analýza odhalí páky rastu, SEO ťa dostane pred konkurenciu a automatizácia procesov ti šetrí čas aj náklady.",
  },
] as const;

export const SK_FOR_WHOM_NOTE =
  "Jeden rebrík služieb — líši sa len to, kde nastúpiš. Vždy ideme smerom nahor.";

// --- Čo robíme — value ladder -------------------------------------------

export const SK_VALUE_LADDER = [
  {
    icon: "search",
    step: "01",
    title: "Biznis analýza (AI)",
    description:
      "Najprv pochopíme tvoj biznis a nájdeme páky rastu. Odhalíme, kde ti vieme pomôcť ešte — admin systém, chatbot, automatizácia.",
    price: "Zdarma ku webu",
    highlight: true,
  },
  {
    icon: "globe",
    step: "02",
    title: "Web na mieru",
    description:
      "Profesionálny a rýchly web, ktorý ti nosí zákazníkov z Googlu. Dôkaz sú naše živé weby, nie mockupy.",
    price: "od 1 000 €",
    highlight: false,
  },
  {
    icon: "seo",
    step: "03",
    title: "SEO + viditeľnosť",
    description:
      "Aby ťa zákazníci našli skôr ako konkurenciu. Lokálne Google leady, Google Moja Firma, technické a obsahové SEO.",
    price: "od 500 €",
    highlight: false,
  },
  {
    icon: "automation",
    step: "04",
    title: "Automatizácia a systémy na mieru",
    description:
      "Rezervačný a objednávkový systém, klientsky portál, databázy, chatbot 24/7, automatické notifikácie — operatíva, ktorá beží za teba.",
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
      "Web aj klientsky portál do jedného mesiaca, expresný web do týždňa — pri kompletnom zadaní a materiáloch, vždy v požadovanej kvalite.",
  },
  {
    icon: "gift",
    title: "Bezplatná biznis analýza",
    description:
      "Pridaná hodnota navyše ku webu, ktorá odhalí, kde ti vieme pomôcť ešte. Žiadny freelancer ti to nedá.",
  },
  {
    icon: "layers",
    title: "Všetko z jednej ruky",
    description:
      "Web, SEO, analýza aj automatizácia u jedného dodávateľa — nie tri rôzne firmy, ktoré sa medzi sebou nedohodnú.",
  },
  {
    icon: "cpu",
    title: "AI = rýchlejšie a modernejšie",
    description:
      "Pracujeme s najnovšími AI nástrojmi, takže dodáme špičkový výsledok za rozumnú cenu — oproti klasickej agentúre rýchlejšie.",
  },
  {
    icon: "check",
    title: "Reálne výsledky",
    description:
      "Máme za sebou tri živé weby pre slovenské firmy. Nie ukážky a sľuby, ale fungujúce projekty, ktoré si vieš pozrieť.",
  },
  {
    icon: "users",
    title: "Senior tím + lokálny SK partner",
    description:
      "10+ rokov skúseností a partner, ktorý rozumie slovenskému trhu, Google Moja Firma aj SK SEO.",
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
      "Web pre požičovňu náradia a stavebnej techniky v Senci — moderný vzhľad a jasná cesta k dopytu.",
    tags: ["Web", "Lokálne SEO", "Katalóg"],
  },
  {
    name: "Good Hair by Zane",
    domain: "goodhairbyzane.com",
    href: "https://goodhairbyzane.com",
    image: "/portfolio/goodhairbyzane.jpg",
    description:
      "Web pre kadernícky salón špecializovaný na predlžovanie vlasov — elegantný, rýchly a plný atmosféry.",
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
      "Krátky rozhovor o tvojich cieľoch a o tom, čo potrebuješ. Bez záväzkov a bez tlaku.",
  },
  {
    icon: "search",
    step: "02",
    title: "Biznis analýza",
    description:
      "Pochopíme tvoj biznis, nájdeme páky rastu a navrhneme riešenie na mieru s jasnou cenou.",
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
      "SEO, vylepšenia a podpora po spustení podľa potreby — aby projekt rástol spolu s tebou.",
  },
] as const;

// --- Cenník (indikatívne kotvy) -----------------------------------------

export const SK_PRICING = {
  items: [
    { service: "Biznis analýza", price: "zdarma ku webu" },
    { service: "Web / landing (vrátane analýzy)", price: "od 1 000 €" },
    { service: "SEO", price: "od 500 €" },
    { service: "Systém / automatizácia / portál na mieru", price: "od 3 000 €" },
    { service: "Podpora po spustení", price: "dohodou, cca 30 €/h" },
  ],
  note: "Finálna cena vždy po nezáväznej konzultácii. Pri väčšej objednávke zľava.",
} as const;
