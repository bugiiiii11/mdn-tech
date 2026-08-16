# M.D.N Tech — /sk Rework Plan (Trust + CRM + Campaign Landing)

> **Version:** 1.0
> **Date:** August 16, 2026
> **Scope:** `/sk` Slovak landing + new `/sk/referencie/royal-stroje` case study page. EN landing untouched (that is `mdntech-website-rebuild.md` v2.0 — its "DO NOT TOUCH /sk" note is superseded by this plan for /sk only).
> **Why:** (1) /sk lacks WHO WE ARE — no founder, no company identity, no invoicing clarity → low trust for SK SMEs. (2) CRM must become the flagship service (strong reference: royalstroje.sk). (3) Royal Stroje partner email campaign (~150 warm contacts, early September) lands on this page — it must convert.
> **Strategy context (Mind Palace):** positioning = "slovenský founder, medzinárodná firma" — UAE entity is transparent but not the headline. Invoicing FAQ = trust weapon, not fine print.

---

## Current state (audited 2026-08-16)

- `app/(marketing)/sk/page.tsx` — 7 sections: Hero, ForWhom, ValueLadder, WhyUs, Portfolio, Process, Contact. Copy lives in `constants/sk.ts` (pure data module). hreflang sk/en/x-default OK, ProfessionalService JSON-LD OK.
- Missing: About/founder section, FAQ (+ FAQPage schema), CRM emphasis (CRM appears only inside ValueLadder step 04 "Automatizácia a systémy na mieru"), case study page, chatbot widget.
- `SK_SITE.keywords` — no CRM terms.
- Schema `sameAs` references `https://www.linkedin.com/company/mdntech/` — slug NOT yet claimed (page is `/company/111977261`). Claim custom URL first or update the constant (see Open items).

## Target section order on /sk

```
SkHero (updated subtitle + CTA)
SkForWhom (unchanged)
SkValueLadder (CRM elevated, see A2)
SkCrm (NEW — flagship CRM section)          #crm
SkPortfolio (RS as flagship + case study link)
SkWhyUs (unchanged or founder line added)
SkAbout (NEW — Kto sme / founder)           #kto-sme
SkProcess (unchanged)
SkFaq (NEW + FAQPage JSON-LD)               #faq
SkContact (unchanged + UTM capture)
```

Nav update (`SK_NAV_LINKS`): Služby · CRM · Referencie · Kto sme · FAQ · Kontakt.

---

## Phase SK-A — Content additions on /sk

### A1. `SkAbout` — "Kto sme" (NEW component)

Founder-forward trust section. Photo of Martin (professional, reuse LinkedIn asset), text:

> **Kto stojí za M.D.N Tech**
>
> M.D.N Tech založil **Martin Jerabek**, slovenský developer a projektový manažér. Predtým viedol v **ČSOB banke** projekt **Smart Drobné** v rámci mobilného bankovníctva. Dnes s tímom dodáva weby, CRM systémy a AI chatboty pre firmy na Slovensku aj v zahraničí.
>
> Sídlo máme v Spojených arabských emirátoch, vývoj a komunikácia prebieha v slovenčine. Medzinárodná štruktúra nám umožňuje dodávať klientom po celom svete — pre vás sa nič nekomplikuje: slovenský kontakt, slovenská podpora, zmluva a faktúra bez prekvapení (podrobnosti vo FAQ nižšie).
>
> [odkaz: LinkedIn profil Martina] · [odkaz: LinkedIn M.D.N Tech]

Design: keep space theme; single card, photo left / text right, LinkedIn icons. No team-grid theatre — one real person beats fake team photos.

### A2. CRM elevation

1. `SK_VALUE_LADDER` step 04 retitle → **"CRM a systémy na mieru"**, description mentions "evidencia zákaziek, stroje/inventár, faktúry, prehľady" (equipment-rental vocabulary — campaign audience is construction/rental SMEs).
2. NEW `SkCrm` section (anchor `#crm`) — flagship:

> **CRM systém presne pre vašu firmu**
>
> Excel a papierové zošity fungujú — kým firma nerastie. Postavíme vám CRM presne podľa vašich procesov: evidencia zákazníkov a zákaziek, správa strojov či inventára, automatické podklady k fakturácii, prehľady na jeden klik.
>
> - Na mieru vašim procesom — žiadne ohýbanie firmy podľa softvéru
> - Prístup z mobilu aj z kancelárie
> - Napojenie na web, e-mail a chatbota
> - Odovzdanie so zaškolením, podpora po spustení
>
> **Referencia: royalstroje.sk** — web, CRM na správu požičovne a AI chatbot pre jedného klienta. [→ Pozrite si prípadovú štúdiu](/sk/referencie/royal-stroje)
>
> CTA: "Chcem nezáväznú konzultáciu k CRM" → #kontakt

### A3. `SkFaq` — FAQ (NEW component + `SK_FAQ` in constants)

Render as accordion; emit **FAQPage JSON-LD** from the same data (single source of truth). Copy (final drafts — placeholders marked):

1. **Kto je M.D.N Tech?**
   Technologická firma založená slovenským developerom Martinom Jerabekom (predtým projektový manažér v ČSOB, projekt Smart Drobné). Dodávame weby, CRM systémy, AI chatboty a automatizáciu pre firmy na Slovensku aj v zahraničí. Komunikácia, dodanie aj podpora prebiehajú v slovenčine.

2. **Prečo má firma sídlo v Spojených arabských emirátoch?**
   Pôsobíme medzinárodne a UAE štruktúra nám umožňuje dodávať klientom po celom svete. Pre vás sa tým nič nemení — kontakt, komunikácia a dodanie sú slovenské a fakturácia je jednoduchá (pozrite nasledujúcu otázku).

3. **Ako funguje fakturácia? Nebude s tým problém v účtovníctve?**
   Faktúru vystavujeme bez DPH a DPH si vysporiadate na Slovensku tzv. samozdanením — štandardný postup pri službách zo zahraničia, ktorý každý účtovník pozná.
   **Ak ste platiteľ DPH:** DPH si priznáte a zároveň odpočítate — výsledný efekt je nulový, žiadny náklad navyše.
   **Ak nie ste platiteľ DPH:** pred prvou faktúrou sa jednorazovo zaregistrujete podľa §7a zákona o DPH (vybavíme spolu, je to formulár) a DPH odvediete — v súčte zaplatíte rovnako, ako keby ste nakúpili od slovenskej agentúry s DPH.
   Do zmluvy aj ponuky vám všetko rozpíšeme vopred.

4. **Kde budú naše dáta a systém?**
   Ostrá prevádzka vášho webu či CRM beží na hostingu **v Európskej únii** (alebo na vašom vlastnom hostingu) — v súlade s GDPR. Vývojové a testovacie prostredie prevádzkujeme na vlastnej infraštruktúre, bez reálnych osobných údajov. Súčasťou zmluvy je aj dohoda o spracúvaní osobných údajov (DPA). `[PENDING-FILIP: potvrdiť formuláciu staging-UAE / produkcia-EÚ]`

5. **Akú zmluvu podpisujeme?**
   Písomnú zmluvu s jasným rozsahom, cenou, termínmi a zárukami. `[PENDING-FILIP: rozhodné právo + vzorová zmluva FZE→SK klient]`

6. **Ako prebieha spolupráca?**
   1) Bezplatná biznis analýza — pochopíme vašu firmu a navrhneme, čo má zmysel. 2) Ponuka s pevnou cenou. 3) Dodanie po etapách, priebežne vidíte výsledok. 4) Odovzdanie so zaškolením a podpora po spustení.

7. **Koľko to stojí?**
   Analýza je zdarma. Web od 1 000 €, SEO od 500 €, CRM a systémy na mieru podľa rozsahu — po analýze dostanete pevnú ponuku. Bez skrytých poplatkov.

8. **Kto bude na projekte reálne pracovať?**
   Projekt vedie priamo Martin. Na väčších dodávkach spolupracujeme s overenými špecialistami pod jeho vedením — zodpovednosť za výsledok nesie vždy M.D.N Tech.

### A4. Hero + SEO metadata updates

- `SK_HERO.subtitle`: doplniť CRM + chatbot — napr. "Web · CRM systémy · AI chatboty · SEO — digitálne riešenia pre slovenské firmy."
- `SK_SITE.title`: **"Tvorba webu, CRM systémov a AI chatbotov pre firmy"** (CRM into the title tag).
- `SK_SITE.description`: rewrite to include CRM na mieru + AI chatbot + referencia.
- `SK_SITE.keywords` add: `CRM systém na mieru`, `tvorba CRM`, `CRM pre malé firmy`, `AI chatbot pre firmy`, `chatbot na webstránku`, `systém pre požičovňu`, `evidencia zákaziek`.
- `serviceType` in ProfessionalService schema: add "CRM systémy na mieru", "AI chatboty".

### A5. Portfolio update

`SkPortfolio`: royalstroje.sk becomes the flagship card — "Web + CRM + AI chatbot" label + link to `/sk/referencie/royal-stroje`. Keep other references as-is.

---

## Phase SK-B — Case study page `/sk/referencie/royal-stroje` (NEW route)

Doubles as the **campaign landing** (150 partner emails link here). Route: `app/(marketing)/sk/referencie/royal-stroje/page.tsx`; copy in `constants/sk-case-studies.ts`.

Structure + draft copy:

1. **Hero:** "Royal Stroje: web, CRM a AI chatbot pre požičovňu stavebných strojov" + hero screenshot webu.
2. **Klient:** 2–3 vety o Royal Stroje (požičovňa strojov, [región/rok] `[PLACEHOLDER-FOUNDER]`).
3. **Zadanie:** zastaraná/žiadna web-prezentácia, evidencia v exceli, dopyty po telefóne — potreba systému, ktorý rastie s firmou. `[upresniť s founderom]`
4. **Riešenie:** (a) nový web royalstroje.sk — katalóg strojov, SEO základ; (b) CRM na mieru — evidencia strojov, zákaziek a zákazníkov, podklady k fakturácii; (c) AI chatbot — odpovedá na dopyty 24/7. Screenshoty: web + CRM (anonymizované dáta!) + chatbot okno.
5. **Výsledky:** 2–3 merateľné čísla `[PLACEHOLDER-FOUNDER: napr. dopyty/mesiac, ušetrené hodiny/týždeň, pozície na Googli]`.
6. **Citát foundera:** `[PLACEHOLDER-FOUNDER: 2–3 vety + meno + súhlas s fotkou/logom]`.
7. **CTA blok:** "Riešite niečo podobné? Prvá analýza je zdarma." → kontakt formulár alebo #kontakt na /sk. Sekundárne: odkaz na FAQ (fakturácia).

Technical: own metadata (title "Prípadová štúdia: Royal Stroje — web, CRM a chatbot"), OG image (case-study specific), breadcrumb schema, `Article` JSON-LD, add to `sitemap.ts`, canonical, `inLanguage: sk`. Accepts UTM params without breaking (campaign links carry `?utm_source=royalstroje&utm_medium=email&utm_campaign=partneri-2026-09`).

---

## Phase SK-C — Technical / integration

| # | Task | Note |
|---|---|---|
| C1 | FAQPage JSON-LD emitted from `SK_FAQ` | one source of truth with the accordion |
| C2 | ChatKit widget live on /sk | the chatbot IS the demo; gate: ChatKit launch stable (Phase 0–2 of launch plan). If not ready at rework time, ship rework without it and add later — do not block. |
| C3 | Contact form: persist UTM params into lead payload | campaign attribution end-to-end |
| C4 | LinkedIn URLs: claim `/company/mdntech` custom URL, then verify `sameAs` constant matches reality; add Martin's personal LinkedIn to SkAbout | see LinkedIn guide in Mind Palace |
| C5 | `mdntech.sk` domain: purchase + 301 → mdntech.org/sk | closes old task 0c; DNS/redirect outside repo, note only |
| C6 | Run `/seo-audit` on mdntech.org after deploy | fix-list becomes follow-up tasks |
| C7 | Roll out redrawn logo from `public/brand/` (see its README) | replace navbar/footer mark (mono, currentColor), regenerate favicons + apple-icon from `mdn-mark-simple.svg`, OG images from `mdn-mark.svg`; applies site-wide (EN + /sk) |

## Acceptance criteria

- /sk answers within 30 seconds of scrolling: WHO is behind this, WHAT they've built (RS), HOW invoicing works.
- CRM discoverable from nav, hero and value ladder; case study reachable in 1 click.
- FAQPage + Article schema validate (Rich Results Test).
- Lighthouse SEO ≥ 95 on /sk and case study page; no regression on EN landing.
- Case study page renders correctly with UTM params.
- No `[PLACEHOLDER]` text ships to production — placeholders resolve before campaign send (case study can ship after /sk rework if founder input is pending).

## Open items (external to repo)

| Item | Owner | Blocks |
|---|---|---|
| Founder input: quote, numbers, approvals | Martin → founder RS | SK-B ship |
| Filip: staging-UAE/produkcia-EÚ formulation + DPA template | Martin → Filip | FAQ #4 final text |
| Filip: governing law / vzorová zmluva | Martin → Filip | FAQ #5 final text |
| LinkedIn custom URL claim | Martin | C4 |
| mdntech.sk purchase | Martin | C5 |
| ChatKit widget readiness | launch plan Phases 0–2 | C2 only |

## Suggested session breakdown

1. **Session 1 (SK-A):** constants + SkAbout + SkCrm + SkFaq + metadata/keywords + nav + portfolio update.
2. **Session 2 (SK-B):** case study route + copy + schema + sitemap + UTM handling (placeholders allowed on preview, not prod).
3. **Session 3 (SK-C):** chatbot widget + UTM→lead payload + seo-audit fix-list.

Deploy path per repo convention: dev branch + Vercel preview → prod. Campaign gate: everything above live BEFORE the 150 emails go out (early September).
