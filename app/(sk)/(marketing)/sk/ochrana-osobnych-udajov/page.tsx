import type { Metadata } from "next";
import Link from "next/link";

import {
  L,
  LegalBox,
  LegalFooterNote,
  LegalList,
  LegalPage,
  LegalSection,
  LegalSub,
  LegalText,
} from "@/components/legal/legal-primitives";

// Slovak translation of app/(marketing)/privacy/page.tsx.
//
// KEEP THE TWO IN SYNC. This is a translation, not a separate policy -- the
// English version prevails in any discrepancy (stated at the foot of both
// pages), so editing one without the other creates exactly the discrepancy
// that clause exists to resolve. Section numbering matches 1:1 so the two can
// be diffed side by side.
//
export const metadata: Metadata = {
  title: "Ochrana osobných údajov",
  description:
    "Ako M.D.N Tech FZE spracúva osobné údaje: aké údaje zbierame, na čo ich používame, ako dlho ich uchovávame a aké práva máte podľa GDPR.",
  alternates: {
    canonical: "/sk/ochrana-osobnych-udajov",
    // Reciprocal of app/(marketing)/privacy/layout.tsx — the EN side exports
    // metadata from a server layout, so both directions are declared and the
    // pair counts. x-default is the English original (prevails on
    // discrepancy).
    languages: {
      en: "/privacy",
      sk: "/sk/ochrana-osobnych-udajov",
      "x-default": "/privacy",
    },
  },
  // A page-level openGraph/twitter object REPLACES the root one wholesale
  // (shallow merge) — without this block the page inherited the English
  // homepage card (en_US locale, og:url pointing at /).
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://mdntech.org/sk/ochrana-osobnych-udajov",
    siteName: "M.D.N Tech",
    title: "Ochrana osobných údajov | M.D.N Tech",
    description: "Ako M.D.N Tech FZE spracúva a chráni vaše osobné údaje.",
    images: [
      {
        url: "/og-image-sk.png",
        width: 1200,
        height: 630,
        alt: "M.D.N Tech — digitálny partner pre slovenské firmy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ochrana osobných údajov | M.D.N Tech",
    description: "Ako M.D.N Tech FZE spracúva a chráni vaše osobné údaje.",
    images: ["/og-image-sk.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SkPrivacyPage() {
  return (
    <LegalPage
      title="Ochrana osobných údajov"
      lastUpdated="Naposledy aktualizované: 16. augusta 2026"
      intro={
        <>
          Toto je slovenský preklad našich zásad ochrany osobných údajov. V
          prípade rozporu medzi jazykovými verziami je rozhodujúca{" "}
          <Link
            href="/privacy"
            hrefLang="en"
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            anglická verzia
          </Link>
          .
        </>
      }
    >
      <LegalSection title="1. Úvod">
        <LegalText>
          Spoločnosť M.D.N Tech FZE („my“, „naša spoločnosť“) chráni vaše
          súkromie a osobné údaje. Tieto zásady vysvetľujú, aké informácie
          zbierame, ako ich používame, komu ich sprístupňujeme a ako ich
          chránime, keď navštívite našu webovú stránku mdntech.org alebo
          využívate naše služby.
        </LegalText>
        <LegalBox title="Údaje o spoločnosti:">
          <ul className="list-none space-y-2 text-gray-300">
            <li>
              <span className="text-purple-400">Obchodné meno:</span> M.D.N Tech
              FZE
            </li>
            <li>
              <span className="text-purple-400">Registrácia:</span> UAQ Free
              Trade Zone, Spojené arabské emiráty
            </li>
            <li>
              <span className="text-purple-400">Adresa:</span> Al Shmookh
              Business Center M 1003, One UAQ, UAQ Free Trade Zone, Umm Al
              Quwain, S.A.E.
            </li>
            <li>
              <span className="text-purple-400">Kontakt:</span>{" "}
              contact@mdntech.org
            </li>
            <li>
              <span className="text-purple-400">
                Kontakt pre ochranu údajov:
              </span>{" "}
              Martin Jeřábek (contact@mdntech.org)
            </li>
          </ul>
        </LegalBox>
        <LegalText>
          Tieto zásady sa vzťahujú na všetkých používateľov vrátane osôb v
          Európskej únii (súlad s GDPR) a v Spojených arabských emirátoch.
        </LegalText>
      </LegalSection>

      <LegalSection title="2. Aké údaje zbierame">
        <LegalSub title="2.1 Údaje, ktoré nám poskytnete priamo">
          <LegalText>Pri kontakte s našimi službami môžeme zbierať:</LegalText>
          <LegalList
            items={[
              <>
                <L>Kontaktné údaje:</L> meno, e-mailová adresa, telefónne číslo,
                názov firmy
              </>,
              <>
                <L>Údaje z komunikácie:</L> informácie, ktoré uvediete pri
                dohodnutí hovoru, vrátane preferovaného termínu a dôvodu
                kontaktu
              </>,
              <>
                <L>Informácie o projekte:</L> požiadavky, technické špecifikácie
                a biznisové ciele
              </>,
              <>
                <L>Údaje o účte:</L> používateľské meno, heslo a nastavenia, ak
                si vytvoríte klientsky účet
              </>,
              <>
                <L>Obchodné dokumenty:</L> zmluvy, dohody, faktúry a ďalšia
                zákonom vyžadovaná dokumentácia
              </>,
            ]}
          />
        </LegalSub>
        <LegalSub title="2.2 Údaje zbierané automaticky">
          <LegalText>
            Pri návšteve našej webovej stránky môžeme automaticky zbierať:
          </LegalText>
          <LegalList
            items={[
              <>
                <L>Technické údaje:</L> IP adresa, typ prehliadača, informácie o
                zariadení, operačný systém
              </>,
              <>
                <L>Údaje o používaní:</L> navštívené stránky, čas strávený na
                stránkach, spôsob navigácie, zdroj návštevy
              </>,
              <>
                <L>Analytické údaje:</L> prostredníctvom Google Analytics (ak sú
                nasadené), vrátane dĺžky návštevy a interakcií
              </>,
              <>
                <L>Cookies:</L> podľa časti o cookies nižšie
              </>,
            ]}
          />
        </LegalSub>
        <LegalSub title="2.3 Údaje od tretích strán">
          <LegalText>Údaje môžeme dostať od:</LegalText>
          <LegalList
            items={[
              <>
                <L>Poskytovateľov hostingu:</L> Vercel (hosting) a Supabase
                (databáza a autentifikácia)
              </>,
              <>
                <L>Komunikačných nástrojov:</L> poskytovatelia e-mailových
                služieb
              </>,
              <>
                <L>Obchodných partnerov:</L> partneri alebo spolupracovníci, s
                vaším súhlasom
              </>,
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="3. ChatKit — AI chatbot na webe">
        <LegalSub title="3.1 Čo je ChatKit">
          <LegalText>
            ChatKit je náš vkladateľný AI chatovací widget, ktorý si firmy
            inštalujú na svoje weby, aby odpovedal na otázky návštevníkov. Keď
            komunikujete s widgetom ChatKit — či už na našom webe, alebo na webe
            nášho zákazníka — konverzácia sa spracúva a ukladá na našej
            infraštruktúre spôsobom popísaným nižšie.
          </LegalText>
        </LegalSub>
        <LegalSub title="3.2 Aké údaje sa pri chate zbierajú">
          <LegalList
            items={[
              <>
                <L>Prepis konverzácie:</L> celý obsah rozhovoru vrátane každej
                vašej správy a každej odpovede AI
              </>,
              <>
                <L>Identifikátor návštevníka:</L> náhodne vygenerované ID
                uložené v úložisku vášho prehliadača, aby konverzácia
                pokračovala aj po načítaní ďalšej stránky. Nie je previazané s
                vašou totožnosťou a nepoužíva sa na sledovanie naprieč webmi
              </>,
              <>
                <L>IP adresa:</L> na predchádzanie zneužitiu a obmedzovanie
                počtu požiadaviek
              </>,
              <>
                <L>URL stránky:</L> adresa stránky, na ktorej ste widget otvorili
              </>,
              <>
                <L>Spätná väzba:</L> voliteľné hodnotenie odpovedí AI
              </>,
            ]}
          />
          <LegalText>
            Prosíme, nezdieľajte v chate citlivé osobné údaje (napríklad údaje o
            zdraví, financiách alebo doklady totožnosti).
          </LegalText>
        </LegalSub>
        <LegalSub title="3.3 Ako sa údaje z chatu používajú">
          <LegalList
            items={[
              <>
                <L>Generovanie odpovedí:</L> vaše správy sa odosielajú
                spoločnosti Anthropic PBC (Claude API), ktorá vygeneruje
                odpoveď. Anthropic tieto dáta nepoužíva na trénovanie svojich
                modelov
              </>,
              <>
                <L>Prístup prevádzkovateľa webu:</L> firma, ktorá si widget
                nainštalovala, vidí a môže exportovať konverzácie vedené s jej
                vlastným chatbotom a dostáva súhrnné štatistiky používania
              </>,
              <>
                <L>Zlepšovanie služby:</L> konverzácie a hodnotenia môžu byť
                posúdené s cieľom zlepšiť odpovede konkrétneho chatbota
              </>,
              <>
                <L>Predchádzanie zneužitiu:</L> obmedzovanie podľa IP adresy
                používa krátkodobé počítadlá, ktoré expirujú do 24 hodín
              </>,
            ]}
          />
        </LegalSub>
        <LegalSub title="3.4 Kto zodpovedá za vaše údaje z chatu">
          <LegalText>
            Keď komunikujete s widgetom ChatKit na webe nášho zákazníka, táto
            firma je prevádzkovateľom údajov a my konverzáciu spracúvame v jej
            mene ako sprostredkovateľ. Žiadosti týkajúce sa takejto konverzácie
            adresujte prevádzkovateľovi webu, na ktorom ste chatovali; my mu s
            ich vybavením pomôžeme. Keď komunikujete s widgetom na našom
            vlastnom webe, prevádzkovateľom sme my a môžete nás kontaktovať
            priamo podľa časti 7.
          </LegalText>
        </LegalSub>
        <LegalSub title="3.5 Uchovávanie údajov z chatu">
          <LegalText>
            Prepisy konverzácií a súvisiace údaje o návštevníkovi sa uchovávajú
            počas trvania služby: sú uložené, kým chatbot existuje, a mažú sa,
            keď prevádzkovateľ webu vymaže konverzáciu alebo chatbota, prípadne
            keď sa zruší príslušný zákaznícky účet.
          </LegalText>
        </LegalSub>
      </LegalSection>

      <LegalSection title="4. Na aké účely údaje používame">
        <LegalText>Osobné údaje spracúvame na tieto účely:</LegalText>
        <LegalSub title="4.1 Poskytovanie služieb">
          <LegalList
            items={[
              "Poskytovanie IT služieb vrátane vývoja AI/ML riešení, blockchainu, full-stack vývoja, mobilných aplikácií, UI/UX dizajnu a vývoja hier",
              "Správa klientskych účtov a projektových portálov",
              "Prevádzka vývojových prostredí a sprístupnenie rozpracovaných projektov",
              "Ukladanie a správa projektových súborov, zdrojového kódu a výstupov",
            ]}
          />
        </LegalSub>
        <LegalSub title="4.2 Prevádzka firmy">
          <LegalList
            items={[
              "Spracovanie faktúr a správa platieb",
              "Komunikácia o projektoch, aktualizáciách a servisných záležitostiach",
              "Dohadovanie konzultácií a klientskych hovorov",
              "Vedenie obchodnej evidencie a dokumentácie podľa práva SAE",
            ]}
          />
        </LegalSub>
        <LegalSub title="4.3 Plnenie právnych povinností">
          <LegalList
            items={[
              "Dodržiavanie právnych povinností v SAE a predpisov UAQ Free Zone",
              "Vedenie evidencie na daňové a účtovné účely",
              "Reagovanie na právne žiadosti a predchádzanie podvodom",
              "Vymáhanie našich obchodných podmienok",
            ]}
          />
        </LegalSub>
        <LegalSub title="4.4 Zlepšovanie služieb">
          <LegalList
            items={[
              "Analýza používania webu s cieľom zlepšiť používateľský zážitok",
              "Pochopenie potrieb a preferencií klientov",
              "Vývoj nových služieb a funkcií",
              "Testovanie a optimalizácia výkonu našej platformy",
            ]}
          />
        </LegalSub>
        <LegalSub title="4.5 Marketing (s vaším súhlasom)">
          <LegalList
            items={[
              "Zasielanie newslettera o našich službách a novinkách z odvetvia",
              "Informovanie o nových ponukách",
              "Zdieľanie prípadových štúdií a noviniek z projektov (so súhlasom klienta)",
            ]}
          />
        </LegalSub>
        <LegalBox title="Právny základ spracúvania (GDPR):">
          <LegalList
            items={[
              <>
                <L>Plnenie zmluvy:</L> aby sme vám mohli poskytnúť dohodnuté
                služby
              </>,
              <>
                <L>Oprávnený záujem:</L> zlepšovanie služieb a udržiavanie
                bezpečnosti
              </>,
              <>
                <L>Zákonná povinnosť:</L> dodržiavanie práva SAE a
                medzinárodných predpisov
              </>,
              <>
                <L>Súhlas:</L> pri marketingovej komunikácii a nepovinných
                cookies
              </>,
            ]}
          />
        </LegalBox>
      </LegalSection>

      <LegalSection title="5. Ukladanie a bezpečnosť údajov">
        <LegalSub title="5.1 Kde údaje ukladáme">
          <LegalText>
            Vaše údaje sú uložené na zabezpečených serveroch:
          </LegalText>
          <LegalList
            items={[
              <>
                <L>Hosting frontendu:</L> globálna infraštruktúra Vercel
              </>,
              <>
                <L>Databáza a autentifikácia:</L> zabezpečené cloudové
                prostredie Supabase
              </>,
              <>
                <L>Vývojové prostredia:</L> zabezpečené izolované inštancie pre
                aktívne projekty
              </>,
              <>
                <L>Úložisko dokumentov:</L> šifrované cloudové úložisko pre
                obchodné dokumenty
              </>,
            ]}
          />
          <LegalText>
            Zabezpečujeme, aby všetky prenosy údajov spĺňali príslušné predpisy o
            ochrane údajov vrátane požiadaviek GDPR na medzinárodné prenosy.
          </LegalText>
        </LegalSub>
        <LegalSub title="5.2 Bezpečnostné opatrenia">
          <LegalText>
            Uplatňujeme bezpečnostné opatrenia na úrovni odvetvového štandardu:
          </LegalText>
          <LegalList
            items={[
              <>
                <L>Šifrovanie:</L> údaje šifrované pri prenose (TLS/SSL) aj v
                pokoji
              </>,
              <>
                <L>Riadenie prístupu:</L> prístup podľa rolí so silnou
                autentifikáciou
              </>,
              <>
                <L>Monitoring 24/7:</L> nepretržité bezpečnostné monitorovanie
                vývojových prostredí
              </>,
              <>
                <L>Pravidelné zálohy:</L> automatizované zálohovanie proti
                strate údajov
              </>,
              <>
                <L>Bezpečný vývoj:</L> dodržiavanie bezpečných postupov
                programovania a pravidelné audity
              </>,
              <>
                <L>Mlčanlivosť:</L> všetci členovia tímu sú viazaní prísnou
                povinnosťou mlčanlivosti
              </>,
            ]}
          />
        </LegalSub>
        <LegalSub title="5.3 Doba uchovávania">
          <LegalText>
            Osobné údaje uchovávame len tak dlho, ako je to potrebné:
          </LegalText>
          <LegalList
            items={[
              <>
                <L>Aktívne projekty:</L> počas trvania projektu a 2 roky po ňom
                na účely záruky a podpory
              </>,
              <>
                <L>Obchodná evidencia:</L> 7 rokov, ako vyžaduje obchodné právo
                SAE
              </>,
              <>
                <L>Marketingové údaje:</L> do odvolania súhlasu alebo žiadosti o
                vymazanie
              </>,
              <>
                <L>Webová analytika:</L> anonymizované po 26 mesiacoch
                (predvolené nastavenie Google Analytics)
              </>,
              <>
                <L>Konverzácie ChatKit:</L> počas trvania služby (pozri časť 3.5)
              </>,
            ]}
          />
          <LegalText>
            Keď údaje už nie sú potrebné, bezpečne ich vymažeme alebo
            anonymizujeme.
          </LegalText>
        </LegalSub>
      </LegalSection>

      <LegalSection title="6. Komu údaje sprístupňujeme">
        <LegalText>
          Vaše osobné údaje nepredávame, neprenajímame ani s nimi neobchodujeme.
          Sprístupniť ich môžeme len v týchto prípadoch:
        </LegalText>
        <LegalSub title="6.1 Poskytovatelia služieb">
          <LegalText>
            Údaje môžeme zdieľať s dôveryhodnými tretími stranami, ktoré
            zabezpečujú:
          </LegalText>
          <LegalList
            items={[
              <>
                <L>Hosting a databázu:</L> Vercel a Supabase
              </>,
              <>
                <L>Spracovanie AI:</L> Anthropic PBC (Claude API) na generovanie
                odpovedí chatbotov ChatKit
              </>,
              <>
                <L>Komunikáciu:</L> Resend a ďalší poskytovatelia e-mailových
                služieb pre obchodnú korešpondenciu a reporty
              </>,
              <>
                <L>Spracovanie platieb:</L> platobné brány pri úhrade faktúr (po
                nasadení)
              </>,
            ]}
          />
          <LegalText>
            Všetci poskytovatelia sú zmluvne zaviazaní chrániť vaše údaje a
            používať ich výhradne na určený účel.
          </LegalText>
        </LegalSub>
        <LegalSub title="6.2 Zákonné požiadavky">
          <LegalText>Údaje môžeme poskytnúť, ak to vyžaduje:</LegalText>
          <LegalList
            items={[
              "právo SAE alebo predpisy UAQ Free Trade Zone",
              "súdny príkaz, právny proces alebo žiadosť orgánu verejnej moci",
              "ochrana našich právnych nárokov alebo bezpečnosti iných osôb",
              "vyšetrovanie podvodu alebo bezpečnostného incidentu",
            ]}
          />
        </LegalSub>
        <LegalSub title="6.3 Prevod podniku">
          <LegalText>
            V prípade zlúčenia, akvizície alebo predaja majetku môžu byť vaše
            údaje prevedené na nadobúdateľa, a to za rovnakých podmienok ochrany
            súkromia.
          </LegalText>
        </LegalSub>
        <LegalSub title="6.4 S vaším súhlasom">
          <LegalText>
            Na účely, ktoré tu nie sú uvedené, zdieľame údaje len s vaším
            výslovným súhlasom.
          </LegalText>
        </LegalSub>
      </LegalSection>

      <LegalSection title="7. Vaše práva">
        <LegalSub title="7.1 Práva podľa GDPR (pre používateľov z EÚ/EHP)">
          <LegalText>Máte právo na:</LegalText>
          <LegalList
            items={[
              <>
                <L>Prístup:</L> vyžiadať si kópiu svojich osobných údajov
              </>,
              <>
                <L>Opravu:</L> opraviť nesprávne alebo neúplné údaje
              </>,
              <>
                <L>Vymazanie:</L> požiadať o vymazanie údajov („právo na
                zabudnutie“)
              </>,
              <>
                <L>Obmedzenie:</L> obmedziť rozsah spracúvania
              </>,
              <>
                <L>Prenosnosť:</L> získať údaje v štruktúrovanom, strojovo
                čitateľnom formáte
              </>,
              <>
                <L>Namietať:</L> namietať proti spracúvaniu založenému na
                oprávnenom záujme
              </>,
              <>
                <L>Odvolať súhlas:</L> kedykoľvek odvolať súhlas s marketingom
                alebo cookies
              </>,
              <>
                <L>Podať sťažnosť:</L> obrátiť sa na dozorný orgán (na Slovensku
                Úrad na ochranu osobných údajov SR)
              </>,
            ]}
          />
        </LegalSub>
        <LegalSub title="7.2 Práva podľa práva SAE">
          <LegalText>
            Podľa predpisov SAE o ochrane údajov máte právo:
          </LegalText>
          <LegalList
            items={[
              "získať prístup k svojim osobným údajom",
              "požiadať o opravu nesprávnych údajov",
              "požiadať o vymazanie údajov, ak to zákon umožňuje",
              "namietať proti spracúvaniu na marketingové účely",
            ]}
          />
        </LegalSub>
        <LegalSub title="7.3 Ako si práva uplatniť">
          <LegalText>
            Ktorékoľvek z týchto práv si uplatníte na kontakte:
          </LegalText>
          <LegalBox>
            <p className="mb-1 text-gray-300">
              <span className="font-semibold text-white">E-mail:</span>{" "}
              contact@mdntech.org
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-white">Na vybavenie:</span>{" "}
              Martin Jeřábek, kontakt pre ochranu údajov
            </p>
          </LegalBox>
          <LegalText>
            Na žiadosť odpovieme do 30 dní (alebo v lehote podľa príslušného
            právneho predpisu).
          </LegalText>
        </LegalSub>
      </LegalSection>

      <LegalSection title="8. Cookies a sledovacie technológie">
        <LegalSub title="8.1 Čo sú cookies">
          <LegalText>
            Cookies sú malé textové súbory uložené vo vašom zariadení, ktoré nám
            pomáhajú poskytovať a zlepšovať naše služby.
          </LegalText>
        </LegalSub>
        <LegalSub title="8.2 Aké cookies používame">
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-semibold text-cyan-400">
                Nevyhnutné cookies (vždy aktívne):
              </p>
              <LegalList
                items={[
                  "správa prihlásenia pre klientske účty",
                  "bezpečnosť a autentifikácia",
                  "vyrovnávanie záťaže a výkon",
                ]}
              />
            </div>
            <div>
              <p className="mb-2 font-semibold text-cyan-400">
                Analytické cookies (po nasadení):
              </p>
              <LegalList
                items={[
                  "Google Analytics pre štatistiky návštevnosti",
                  "pomáhajú nám pochopiť, ako návštevníci web používajú",
                ]}
              />
            </div>
            <div>
              <p className="mb-2 font-semibold text-cyan-400">
                Lokálne úložisko (widget ChatKit):
              </p>
              <LegalList
                items={[
                  "náhodne vygenerované ID návštevníka a ID konverzácie, ktoré udržia chat plynulý naprieč načítaniami stránky",
                  "nepoužíva sa na reklamu ani sledovanie naprieč webmi; zmaže sa vymazaním údajov prehliadača",
                ]}
              />
            </div>
            <div>
              <p className="mb-2 font-semibold text-cyan-400">
                Údaje o zdroji návštevy (stránky /sk):
              </p>
              <LegalList
                items={[
                  "pri príchode z kampane si v pamäti relácie (sessionStorage) uchovávame zdroj návštevy, aby sme vedeli, odkiaľ dopyt prišiel",
                  "nejde o cookie, neopúšťa vaše zariadenie inak než ako súčasť odoslaného formulára a zmaže sa zatvorením karty",
                ]}
              />
            </div>
            <div>
              <p className="mb-2 font-semibold text-cyan-400">
                Cookies v budúcnosti:
              </p>
              <LegalText>
                S pribúdajúcimi funkciami môžeme používať:
              </LegalText>
              <LegalList
                items={[
                  "marketingové cookies (s vaším súhlasom)",
                  "cookies na uloženie používateľských nastavení",
                ]}
              />
            </div>
          </div>
        </LegalSub>
        <LegalSub title="8.3 Správa cookies">
          <LegalText>
            Cookies viete ovládať v nastaveniach svojho prehliadača. Vypnutie
            nevyhnutných cookies môže obmedziť funkčnosť webu.
          </LegalText>
          <LegalText>
            Odhlásenie z Google Analytics:{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline hover:text-cyan-300"
            >
              https://tools.google.com/dlpage/gaoptout
            </a>
          </LegalText>
        </LegalSub>
      </LegalSection>

      <LegalSection title="9. Medzinárodné prenosy údajov">
        <LegalText>
          Keďže poskytujeme služby klientom v zahraničí vrátane Európskej únie,
          vaše údaje môžu byť prenášané cez hranice. Zabezpečujeme, aby takéto
          prenosy spĺňali:
        </LegalText>
        <LegalList
          items={[
            <>
              <L>Štandardné zmluvné doložky GDPR:</L> pri prenosoch údajov z EÚ
            </>,
            <>
              <L>Rozhodnutia o primeranosti:</L> prenos do krajín s primeranou
              úrovňou ochrany
            </>,
            <>
              <L>Váš súhlas:</L> ak to vyžaduje zákon
            </>,
          ]}
        />
        <LegalText>
          Pri všetkých medzinárodných prenosoch zachovávame rovnakú úroveň
          ochrany, aká je zaručená v SAE a EÚ.
        </LegalText>
      </LegalSection>

      <LegalSection title="10. Súkromie detí">
        <LegalText>
          Naše služby nie sú určené osobám mladším ako 18 rokov. Vedome
          nezbierame osobné údaje detí. Ak sa domnievate, že sme získali údaje
          neplnoletej osoby, bezodkladne nás kontaktujte.
        </LegalText>
      </LegalSection>

      <LegalSection title="11. Odkazy na weby tretích strán">
        <LegalText>
          Náš web môže obsahovať odkazy na weby tretích strán. Za ich postupy pri
          ochrane súkromia nezodpovedáme a odporúčame prečítať si ich vlastné
          zásady.
        </LegalText>
      </LegalSection>

      <LegalSection title="12. Oznámenie o porušení ochrany údajov">
        <LegalText>
          V nepravdepodobnom prípade porušenia ochrany údajov, ktoré predstavuje
          riziko pre vaše práva a slobody:
        </LegalText>
        <LegalList
          items={[
            "informujeme dotknuté osoby do 72 hodín (podľa požiadavky GDPR)",
            "informujeme príslušné dozorné orgány",
            "poskytneme informácie o incidente a prijatých opatreniach",
            "bezodkladne podnikneme kroky na zmiernenie rizík",
          ]}
        />
      </LegalSection>

      <LegalSection title="13. Zmeny týchto zásad">
        <LegalText>
          Tieto zásady môžeme priebežne aktualizovať, aby odrážali zmeny v našich
          postupoch, nové právne požiadavky alebo nové funkcie služieb.
        </LegalText>
        <LegalBox title="Oznamovanie zmien:">
          <LegalList
            items={[
              "aktualizované znenie zverejníme na mdntech.org s novým dátumom poslednej aktualizácie",
              "pri podstatných zmenách vás upozorníme e-mailom alebo viditeľným oznamom na webe",
              "pokračovaním v používaní našich služieb po zmene vyjadrujete súhlas s novým znením",
            ]}
          />
        </LegalBox>
      </LegalSection>

      <LegalSection title="14. Kontakt">
        <LegalText>
          S otázkami, pripomienkami alebo žiadosťami k týmto zásadám alebo k
          vašim osobným údajom sa obráťte na:
        </LegalText>
        <LegalBox title="M.D.N Tech FZE">
          <p className="mb-1 text-gray-300">Al Shmookh Business Center M 1003</p>
          <p className="mb-1 text-gray-300">One UAQ, UAQ Free Trade Zone</p>
          <p className="mb-1 text-gray-300">
            Umm Al Quwain, Spojené arabské emiráty
          </p>
          <p className="mb-1 text-gray-300">E-mail: contact@mdntech.org</p>
          <p className="mb-1 text-gray-300">
            Kontakt pre ochranu údajov: Martin Jeřábek
          </p>
          <p className="text-gray-300">Web: mdntech.org</p>
        </LegalBox>
      </LegalSection>

      <LegalSection title="15. Dozorný orgán">
        <div className="space-y-4">
          <div>
            <p className="mb-2 font-semibold text-cyan-400">
              Pre používateľov z EÚ/EHP:
            </p>
            <LegalText>
              Ak sa domnievate, že boli porušené vaše práva na ochranu údajov,
              máte právo podať sťažnosť miestnemu dozornému orgánu — na Slovensku
              je ním Úrad na ochranu osobných údajov Slovenskej republiky.
            </LegalText>
          </div>
          <div>
            <p className="mb-2 font-semibold text-cyan-400">
              Pre používateľov zo SAE:
            </p>
            <LegalText>
              Vo veciach ochrany údajov sa môžete obrátiť na Telecommunications
              and Digital Government Regulatory Authority (TDRA) alebo na
              príslušné orgány UAQ Free Trade Zone.
            </LegalText>
          </div>
        </div>
      </LegalSection>

      <LegalFooterNote>
        <p className="mb-2 text-sm text-gray-400">
          <span className="font-semibold text-white">Rozhodné právo:</span> Tieto
          zásady sa riadia právom Spojených arabských emirátov a predpismi UAQ
          Free Trade Zone.
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-white">Jazyk:</span> V prípade
          rozporu medzi jazykovými verziami týchto zásad je rozhodujúce anglické
          znenie.
        </p>
      </LegalFooterNote>
    </LegalPage>
  );
}
