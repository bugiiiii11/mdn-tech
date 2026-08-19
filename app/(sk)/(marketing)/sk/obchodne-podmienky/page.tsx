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

// Slovak translation of app/(marketing)/terms/page.tsx.
//
// KEEP THE TWO IN SYNC -- same rule as the privacy pages. Section numbering
// matches 1:1 with the English original so the two can be diffed side by side,
// and the English version prevails in any discrepancy (section 15.8).

export const metadata: Metadata = {
  title: "Obchodné podmienky",
  description:
    "Obchodné podmienky M.D.N Tech FZE: rozsah služieb, platobné podmienky, duševné vlastníctvo, mlčanlivosť, zodpovednosť a riešenie sporov.",
  alternates: {
    canonical: "/sk/obchodne-podmienky",
    // Reciprocal of app/(marketing)/terms/layout.tsx — see the note on the SK
    // privacy page: both directions declared, x-default = English original.
    languages: {
      en: "/terms",
      sk: "/sk/obchodne-podmienky",
      "x-default": "/terms",
    },
  },
  // A page-level openGraph/twitter object REPLACES the root one wholesale
  // (shallow merge) — without this block the page inherited the English
  // homepage card (en_US locale, og:url pointing at /).
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://mdntech.org/sk/obchodne-podmienky",
    siteName: "M.D.N Tech",
    title: "Obchodné podmienky | M.D.N Tech",
    description:
      "Rozsah služieb, platobné podmienky, duševné vlastníctvo a riešenie sporov pri spolupráci s M.D.N Tech FZE.",
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
    title: "Obchodné podmienky | M.D.N Tech",
    description:
      "Rozsah služieb, platobné podmienky, duševné vlastníctvo a riešenie sporov pri spolupráci s M.D.N Tech FZE.",
    images: ["/og-image-sk.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SkTermsPage() {
  return (
    <LegalPage
      title="Obchodné podmienky"
      lastUpdated="Naposledy aktualizované: 20. januára 2026"
      intro={
        <>
          Toto je slovenský preklad našich obchodných podmienok. V prípade
          rozporu medzi jazykovými verziami je rozhodujúca{" "}
          <Link
            href="/terms"
            hrefLang="en"
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            anglická verzia
          </Link>
          .
        </>
      }
    >
      <LegalSection title="1. Úvod a súhlas">
        <LegalText>
          Tieto obchodné podmienky („Podmienky“) tvoria právne záväznú dohodu
          medzi spoločnosťou M.D.N Tech FZE („Spoločnosť“, „my“) a vami
          („Klient“, „vy“) a upravujú používanie našej webovej stránky
          mdntech.org a našich IT služieb.
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
              <span className="text-purple-400">Web:</span> mdntech.org
            </li>
          </ul>
        </LegalBox>
        <LegalText>
          Prístupom na náš web, vyžiadaním konzultácie alebo objednaním našich
          služieb potvrdzujete, že ste si tieto Podmienky prečítali, rozumiete im
          a súhlasíte s tým, že sú pre vás záväzné.
        </LegalText>
      </LegalSection>

      <LegalSection title="2. Vymedzenie pojmov">
        <div>
          <p className="mb-2 font-semibold text-cyan-400">
            „Služby“ znamenajú všetky IT služby poskytované Spoločnosťou, najmä:
          </p>
          <LegalList
            items={[
              "vývoj AI a strojového učenia (integrácia LLM, RAG systémy, AI agenti, inteligentná automatizácia)",
              "blockchain a Web3 riešenia (smart kontrakty, DeFi systémy, integrácie peňaženiek, blockchainová analytika)",
              "full-stack vývoj (backend systémy, API, mikroslužby, cloud-native architektúra)",
              "vývoj mobilných aplikácií (iOS a Android s React Native, Flutter, Web3 integrácie)",
              "UI/UX a produktový dizajn (UX výskum, dizajnové systémy, branding, dizajn zameraný na konverzie)",
              "vývoj hier (Unity, Unreal Engine, Web3 hry, multiplayer systémy, AR/VR)",
            ]}
          />
        </div>
        <div>
          <p className="mb-2 font-semibold text-cyan-400">„Dohoda“</p>
          <LegalText>
            znamená zmluvný vzťah medzi Spoločnosťou a Klientom vrátane týchto
            Podmienok, projektových ponúk, zadaní prác a akýchkoľvek ďalších
            dohôd.
          </LegalText>
        </div>
        <div>
          <p className="mb-2 font-semibold text-cyan-400">„Výstupy“</p>
          <LegalText>
            znamenajú všetky pracovné výstupy, kód, dizajny, dokumentáciu a
            materiály vytvorené Spoločnosťou pre Klienta.
          </LegalText>
        </div>
        <div>
          <p className="mb-2 font-semibold text-cyan-400">„Klientsky účet“</p>
          <LegalText>
            znamená zabezpečený portál poskytnutý klientom na prístup k vývojovým
            prostrediam a projektovým materiálom.
          </LegalText>
        </div>
        <div>
          <p className="mb-2 font-semibold text-cyan-400">
            „Dôverné informácie“
          </p>
          <LegalText>
            znamenajú akékoľvek chránené alebo citlivé informácie sprístupnené
            ktoroukoľvek zo strán.
          </LegalText>
        </div>
        <div>
          <p className="mb-2 font-semibold text-cyan-400">
            „Duševné vlastníctvo“
          </p>
          <LegalText>
            znamená všetky patenty, autorské práva, ochranné známky, obchodné
            tajomstvá a ďalšie práva duševného vlastníctva.
          </LegalText>
        </div>
      </LegalSection>

      <LegalSection title="3. Rozsah služieb">
        <LegalSub title="3.1 Popis služieb">
          <LegalText>
            Spoločnosť poskytuje profesionálne IT vývojové a poradenské služby
            prispôsobené potrebám každého Klienta. Konkrétne služby, výstupy,
            termíny a ceny sú definované v jednotlivých projektových ponukách
            alebo zadaniach prác.
          </LegalText>
        </LegalSub>
        <LegalSub title="3.2 Priebeh spolupráce">
          <LegalList
            ordered
            items={[
              <>
                <L>Úvodná konzultácia:</L> Klient si dohodne hovor, na ktorom
                preberieme požiadavky projektu
              </>,
              <>
                <L>Ponuka:</L> Spoločnosť predloží podrobnú ponuku vrátane
                rozsahu, harmonogramu a ceny
              </>,
              <>
                <L>Dohoda:</L> Klient ponuku prijme a podpíše zmluvu
              </>,
              <>
                <L>Vývoj:</L> Spoločnosť realizuje projekt podľa dohodnutej
                špecifikácie
              </>,
              <>
                <L>Odovzdanie:</L> Spoločnosť odovzdá dokončené dielo Klientovi
              </>,
              <>
                <L>Podpora:</L> voliteľná následná údržba a podpora podľa dohody
              </>,
            ]}
          />
        </LegalSub>
        <LegalSub title="3.3 Prístup do klientskeho účtu">
          <LegalText>Po začatí projektu oprávnení klienti získajú:</LegalText>
          <LegalList
            items={[
              "prístup do zabezpečeného klientskeho portálu",
              "priebežný pohľad na vývojové prostredie",
              "možnosť pripomienkovať rozpracované dielo",
              "prístup k projektovej dokumentácii a výstupom",
            ]}
          />
        </LegalSub>
        <LegalSub title="3.4 Vývojové prostredia">
          <LegalText>Pre aktívne projekty Spoločnosť zabezpečuje:</LegalText>
          <LegalList
            items={[
              "vývojové prostredia bežiace 24/7",
              "zabezpečené izolované inštancie pre každý projekt",
              "pravidelné zálohy a správu verzií",
              "testovacie prostredia na kontrolu a schvaľovanie",
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="4. Povinnosti Klienta">
        <LegalSub title="4.1 Informácie a súčinnosť">
          <LegalText>Klient sa zaväzuje:</LegalText>
          <LegalList
            items={[
              "poskytnúť presné a úplné informácie potrebné na realizáciu projektu",
              "reagovať na otázky Spoločnosti bez zbytočného odkladu",
              "určiť osoby oprávnené rozhodovať o projekte",
              "sprístupniť potrebné systémy, dáta alebo zdroje",
              "skontrolovať a schváliť výstupy v dohodnutých lehotách",
            ]}
          />
        </LegalSub>
        <LegalSub title="4.2 Obsah a podklady">
          <LegalText>Klient zodpovedá za:</LegalText>
          <LegalList
            items={[
              "správnosť a zákonnosť všetkého poskytnutého obsahu a podkladov",
              "získanie potrebných práv a licencií k materiálom tretích strán",
              "súlad s príslušnými právnymi predpismi",
              "poskytnutie jasnej špecifikácie a požiadaviek",
            ]}
          />
        </LegalSub>
        <LegalSub title="4.3 Spätná väzba a schvaľovanie">
          <LegalList
            items={[
              "Klient je povinný skontrolovať výstupy v dohodnutých lehotách",
              "neposkytnutie spätnej väzby v stanovenej lehote sa považuje za schválenie",
              "zmeny požadované po schválení môžu byť spoplatnené",
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="5. Platobné podmienky">
        <LegalSub title="5.1 Ceny a fakturácia">
          <LegalList
            items={[
              "cena projektu je uvedená v konkrétnej ponuke alebo zadaní prác",
              "ceny sú uvádzané v dirhamoch SAE (AED) alebo v inej vzájomne dohodnutej mene",
              "Spoločnosť vystavuje faktúry podľa dohodnutého platobného kalendára",
              "faktúry sa spravidla vystavujú po dosiahnutí míľnikov alebo mesačne pri priebežných službách",
            ]}
          />
        </LegalSub>
        <LegalSub title="5.2 Platobný kalendár">
          <LegalText>Ak nie je dohodnuté inak:</LegalText>
          <LegalList
            items={[
              <>
                <L>Úvodná platba:</L> 50 % pri začatí projektu
              </>,
              <>
                <L>Míľnikové platby:</L> podľa projektovej dohody
              </>,
              <>
                <L>Záverečná platba:</L> zvyšok pri dokončení projektu
              </>,
            ]}
          />
        </LegalSub>
        <LegalSub title="5.3 Spôsoby platby">
          <LegalList
            items={[
              "bankový prevod na účet určený Spoločnosťou",
              "platobné údaje sú uvedené na faktúre",
              "online platby cez web môžu byť sprístupnené v budúcnosti",
            ]}
          />
        </LegalSub>
        <LegalSub title="5.4 Omeškanie s platbou">
          <LegalList
            items={[
              "faktúry sú splatné do 14 dní, ak nie je uvedené inak",
              "pri omeškaní môže byť účtovaný úrok 1,5 % mesačne",
              "Spoločnosť môže pri neuhradených faktúrach pozastaviť služby",
              "Klient znáša všetky náklady spojené s vymáhaním pohľadávky",
            ]}
          />
        </LegalSub>
        <LegalSub title="5.5 Dane">
          <LegalText>
            Všetky ceny sú uvedené bez príslušných daní. Klient zodpovedá za daň
            z pridanej hodnoty (DPH), zrážkové dane, dovozné clá a iné poplatky
            uložené orgánmi verejnej moci.
          </LegalText>
        </LegalSub>
      </LegalSection>

      <LegalSection title="6. Práva duševného vlastníctva">
        <LegalSub title="6.1 Vlastníctvo Klienta">
          <LegalText>Po úplnom zaplatení Klient nadobúda vlastníctvo:</LegalText>
          <LegalList
            items={[
              "kódu vytvoreného špecificky pre projekt Klienta",
              "finálnych výstupov vytvorených výhradne pre Klienta",
              "materiálov a obsahu dodaného Klientom",
            ]}
          />
          <LegalText>
            <L>Prevod sa nevzťahuje na:</L>
          </LegalText>
          <LegalList
            items={[
              "už existujúce duševné vlastníctvo Spoločnosti",
              "knižnice, frameworky a nástroje tretích strán",
              "všeobecné metodiky a postupy",
              "šablóny a opakovane použiteľné komponenty",
            ]}
          />
        </LegalSub>
        <LegalSub title="6.2 Vlastníctvo Spoločnosti">
          <LegalText>Spoločnosť si ponecháva vlastníctvo:</LegalText>
          <LegalList
            items={[
              "už existujúcich nástrojov, frameworkov a knižníc kódu",
              "všeobecných vývojových metodík a postupov",
              "získaných znalostí a skúseností",
              "šablón a opakovane použiteľných komponentov",
            ]}
          />
        </LegalSub>
        <LegalSub title="6.3 Komponenty tretích strán">
          <LegalText>Výstupy môžu obsahovať:</LegalText>
          <LegalList
            items={[
              "open-source softvér (podliehajúci príslušným licenciám)",
              "API a služby tretích strán",
              "licencované komponenty a knižnice",
            ]}
          />
          <LegalText>
            Klient zodpovedá za dodržiavanie všetkých licencií tretích strán.
          </LegalText>
        </LegalSub>
        <LegalSub title="6.4 Licencia pre Spoločnosť">
          <LegalText>
            Klient udeľuje Spoločnosti nevýhradnú licenciu na:
          </LegalText>
          <LegalList
            items={[
              "použitie materiálov Klienta výhradne na poskytovanie Služieb",
              "prezentovanie dokončeného diela v portfóliu (so súhlasom Klienta)",
              "uvádzanie Klienta ako zákazníka (so súhlasom)",
            ]}
          />
        </LegalSub>
        <LegalSub title="6.5 Portfólio a marketing">
          <LegalList
            items={[
              "Spoločnosť môže prezentovať dokončené dielo s písomným súhlasom Klienta",
              "Klient môže požiadať o anonymizáciu alebo utajenie",
              "dôverné projekty nezverejníme bez povolenia",
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="7. Mlčanlivosť">
        <LegalSub title="7.1 Dôverné informácie">
          <LegalText>Obe strany sa zaväzujú chrániť:</LegalText>
          <LegalList
            items={[
              "obchodné stratégie a plány",
              "technické špecifikácie a zdrojový kód",
              "finančné informácie",
              "údaje klientov a používateľov",
              "obchodné tajomstvá a chránené informácie",
            ]}
          />
        </LegalSub>
        <LegalSub title="7.2 Povinnosti">
          <LegalText>Každá zo strán sa zaväzuje:</LegalText>
          <LegalList
            items={[
              "zachovávať prísnu mlčanlivosť o informáciách druhej strany",
              "používať dôverné informácie len na povolené účely",
              "prijať primerané bezpečnostné opatrenia",
              "obmedziť prístup len na oprávnené osoby",
            ]}
          />
        </LegalSub>
        <LegalSub title="7.3 Výnimky">
          <LegalText>
            Povinnosť mlčanlivosti sa nevzťahuje na informácie, ktoré:
          </LegalText>
          <LegalList
            items={[
              "sú verejne dostupné bez porušenia tejto dohody",
              "boli oprávnene známe pred ich sprístupnením",
              "boli vyvinuté nezávisle",
              "musia byť zverejnené na základe zákona alebo súdneho rozhodnutia",
            ]}
          />
        </LegalSub>
        <LegalSub title="7.4 Trvanie">
          <LegalText>
            Povinnosť mlčanlivosti trvá 3 roky po dokončení projektu alebo
            ukončení poskytovania služieb.
          </LegalText>
        </LegalSub>
      </LegalSection>

      <LegalSection title="8. Ochrana údajov a súkromia">
        <LegalSub title="8.1 Spracúvanie údajov">
          <LegalList
            items={[
              <>
                Spoločnosť spracúva údaje Klienta v súlade so{" "}
                <Link
                  href="/sk/ochrana-osobnych-udajov"
                  className="text-cyan-400 underline hover:text-cyan-300"
                >
                  zásadami ochrany osobných údajov
                </Link>
              </>,
              "Spoločnosť prijíma primerané technické a organizačné bezpečnostné opatrenia",
              "údaje Klienta sú bezpečne uložené na infraštruktúre Vercel a Supabase",
            ]}
          />
        </LegalSub>
        <LegalSub title="8.2 Bezpečnosť údajov Klienta">
          <LegalText>Spoločnosť sa zaväzuje:</LegalText>
          <LegalList
            items={[
              "šifrovať údaje pri prenose aj v pokoji",
              "uplatňovať riadenie prístupu a autentifikáciu",
              "pravidelne monitorovať bezpečnosť a aktualizovať systémy",
              "zabezpečiť zálohovanie a obnovu po havárii",
              "dodržiavať GDPR pri európskych klientoch",
            ]}
          />
        </LegalSub>
        <LegalSub title="8.3 Oznámenie o porušení ochrany údajov">
          <LegalText>V prípade porušenia ochrany údajov:</LegalText>
          <LegalList
            items={[
              "Spoločnosť informuje Klienta do 72 hodín",
              "Spoločnosť bezodkladne prijme nápravné opatrenia",
              "Spoločnosť poskytne súčinnosť pri oznámeniach dozorným orgánom",
            ]}
          />
        </LegalSub>
        <LegalSub title="8.4 Povinnosti Klienta">
          <LegalText>Klient vyhlasuje, že:</LegalText>
          <LegalList
            items={[
              "je oprávnený poskytnúť údaje Spoločnosti",
              "dodržiava príslušné predpisy o ochrane údajov",
              "získal potrebné súhlasy na spracúvanie údajov",
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="9. Záruky a vyhlásenia">
        <LegalSub title="9.1 Záruky Spoločnosti">
          <LegalText>Spoločnosť vyhlasuje, že:</LegalText>
          <LegalList
            items={[
              "Služby budú poskytnuté s odbornou starostlivosťou",
              "dielo bude v podstatných ohľadoch zodpovedať dohodnutej špecifikácii",
              "Spoločnosť je oprávnená Služby poskytovať",
              "Výstupy vedome neporušia práva tretích strán",
            ]}
          />
        </LegalSub>
        <LegalSub title="9.2 Záruky Klienta">
          <LegalText>Klient vyhlasuje, že:</LegalText>
          <LegalList
            items={[
              "je oprávnený uzavrieť túto Dohodu",
              "všetky poskytnuté informácie sú presné a úplné",
              "materiály dodané Klientom neporušujú práva tretích strán",
              "bude dodržiavať všetky príslušné právne predpisy",
            ]}
          />
        </LegalSub>
        <LegalSub title="9.3 Záručná doba">
          <LegalList
            items={[
              "štandardná záruka: 90 dní od odovzdania na vady vyhotovenia",
              "záruka pokrýva opravy chýb v odovzdanom kóde",
              "záruka sa nevzťahuje na zmeny požiadaviek ani nové funkcie",
              "predĺženú záruku možno dojednať samostatnou zmluvou o podpore",
            ]}
          />
        </LegalSub>
        <LegalSub title="9.4 Vylúčenie záruk">
          <p className="italic text-gray-300">
            OKREM VÝSLOVNE UVEDENÝCH ZÁRUK SÚ SLUŽBY POSKYTOVANÉ „TAK, AKO SÚ“,
            BEZ AKÝCHKOĽVEK ZÁRUK, VÝSLOVNÝCH ALEBO IMPLICITNÝCH, NAJMÄ BEZ ZÁRUK
            OBCHODOVATEĽNOSTI, VHODNOSTI NA KONKRÉTNY ÚČEL ALEBO NEPORUŠENIA PRÁV
            TRETÍCH STRÁN.
          </p>
        </LegalSub>
      </LegalSection>

      <LegalSection title="10. Obmedzenie zodpovednosti">
        <LegalSub title="10.1 Maximálna výška zodpovednosti">
          <p className="mb-2 italic text-gray-300">
            V NAJŠIRŠOM ROZSAHU POVOLENOM PRÁVOM SAE:
          </p>
          <LegalText>
            Celková zodpovednosť Spoločnosti za akékoľvek nároky vyplývajúce zo
            Služieb alebo s nimi súvisiace neprekročí celkovú sumu, ktorú Klient
            uhradil za 12 mesiacov predchádzajúcich vzniku nároku, alebo 50 000
            AED — podľa toho, ktorá suma je nižšia.
          </LegalText>
        </LegalSub>
        <LegalSub title="10.2 Vylúčené škody">
          <p className="mb-2 italic text-gray-300">
            SPOLOČNOSŤ NEZODPOVEDÁ ZA:
          </p>
          <LegalList
            items={[
              "nepriame, náhodné alebo následné škody",
              "ušlý zisk, stratu tržieb alebo obchodných príležitostí",
              "stratu údajov (okrem prípadov hrubej nedbanlivosti Spoločnosti)",
              "náklady na náhradné služby",
              "prerušenie podnikania",
            ]}
          />
        </LegalSub>
        <LegalSub title="10.3 Výnimky">
          <LegalText>Obmedzenia sa nevzťahujú na:</LegalText>
          <LegalList
            items={[
              "hrubú nedbanlivosť alebo úmyselné konanie",
              "porušenie mlčanlivosti",
              "povinnosti z odškodnenia",
              "záležitosti, ktoré podľa práva SAE nemožno obmedziť",
            ]}
          />
        </LegalSub>
        <LegalSub title="10.4 Služby tretích strán">
          <LegalText>Spoločnosť nezodpovedá za:</LegalText>
          <LegalList
            items={[
              "výkon alebo dostupnosť služieb tretích strán",
              "konanie poskytovateľov hostingu (Vercel, Supabase)",
              "výpadky API alebo služieb tretích strán",
              "problémy s infraštruktúrou alebo systémami Klienta",
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="11. Odškodnenie">
        <LegalSub title="11.1 Odškodnenie zo strany Klienta">
          <LegalText>
            Klient odškodní Spoločnosť a zbaví ju zodpovednosti za nároky
            vyplývajúce z:
          </LegalText>
          <LegalList
            items={[
              "obsahu, materiálov alebo údajov dodaných Klientom",
              "porušenia týchto Podmienok Klientom",
              "porušenia právnych predpisov Klientom",
              "porušenia práv tretích strán materiálmi Klienta",
            ]}
          />
        </LegalSub>
        <LegalSub title="11.2 Odškodnenie zo strany Spoločnosti">
          <LegalText>
            Spoločnosť odškodní Klienta za nároky, podľa ktorých Výstupy
            vytvorené výhradne Spoločnosťou porušujú práva duševného vlastníctva
            tretích strán, za predpokladu, že:
          </LegalText>
          <LegalList
            items={[
              "Klient bezodkladne informuje Spoločnosť o nároku",
              "Spoločnosť má výhradnú kontrolu nad obhajobou a vyrovnaním",
              "Klient poskytne primeranú súčinnosť",
              "nárok nevznikol v dôsledku úprav alebo nesprávneho použitia Klientom",
            ]}
          />
        </LegalSub>
        <LegalSub title="11.3 Nápravné opatrenia">
          <LegalText>
            Ak sa zistí, že Výstupy porušujú práva, Spoločnosť môže:
          </LegalText>
          <LegalList
            items={[
              "zabezpečiť Klientovi práva na ďalšie používanie",
              "upraviť Výstupy tak, aby práva neporušovali",
              "nahradiť ich alternatívou, ktorá práva neporušuje",
              "vrátiť poplatky uhradené za dotknuté komponenty",
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="12. Trvanie a ukončenie">
        <LegalSub title="12.1 Trvanie">
          <LegalText>
            Táto Dohoda vzniká prijatím našich Služieb Klientom a trvá do:
          </LegalText>
          <LegalList
            items={[
              "dokončenia projektu a úhrady záverečnej platby",
              "ukončenia ktoroukoľvek zo strán podľa týchto Podmienok",
              "vzájomnej dohody o ukončení",
            ]}
          />
        </LegalSub>
        <LegalSub title="12.2 Ukončenie bez udania dôvodu">
          <LegalText>
            Ktorákoľvek zo strán môže Dohodu ukončiť s 30-dňovou písomnou
            výpovednou lehotou, pričom:
          </LegalText>
          <LegalList
            items={[
              "Klient uhradí prácu vykonanú do dňa ukončenia",
              "obe strany vrátia všetky materiály a dôverné informácie",
              "strany poskytnú primeranú súčinnosť pri odovzdaní",
            ]}
          />
        </LegalSub>
        <LegalSub title="12.3 Ukončenie z dôvodu porušenia">
          <LegalText>
            Ktorákoľvek zo strán môže Dohodu ukončiť okamžite, ak druhá strana:
          </LegalText>
          <LegalList
            items={[
              "podstatne poruší tieto Podmienky a nenapraví to do 14 dní",
              "sa stane platobne neschopnou alebo je voči nej vedené konkurzné konanie",
              "ukončí podnikateľskú činnosť",
              "vykonáva nezákonnú činnosť súvisiacu so Službami",
            ]}
          />
        </LegalSub>
        <LegalSub title="12.4 Dôsledky ukončenia">
          <LegalText>Po ukončení:</LegalText>
          <LegalList
            items={[
              "Klient uhradí všetku vykonanú prácu",
              "Spoločnosť odovzdá rozpracované dielo v aktuálnom stave",
              "obe strany vrátia dôverné informácie",
              "prístup do klientskeho účtu bude zrušený",
              "vývojové prostredia budú vypnuté",
              "licencie udelené podľa týchto Podmienok zanikajú (okrem zaplatených Výstupov)",
            ]}
          />
        </LegalSub>
        <LegalSub title="12.5 Ustanovenia, ktoré pretrvávajú">
          <LegalText>Po ukončení naďalej platia ustanovenia o:</LegalText>
          <LegalList
            items={[
              "platobných povinnostiach",
              "právach duševného vlastníctva",
              "mlčanlivosti",
              "odškodnení",
              "obmedzení zodpovednosti",
              "riešení sporov",
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="13. Vyššia moc">
        <LegalText>
          Žiadna zo strán nezodpovedá za omeškanie alebo nesplnenie povinností v
          dôsledku okolností mimo primeranej kontroly, vrátane prírodných
          katastrof, pandémií a vyššej moci; vojny, terorizmu alebo občianskych
          nepokojov; zásahov alebo predpisov orgánov verejnej moci; výpadkov
          internetu či telekomunikácií; výpadkov poskytovateľov služieb tretích
          strán.
        </LegalText>
        <LegalText>Dotknutá strana je povinná:</LegalText>
        <LegalList
          items={[
            "bezodkladne informovať druhú stranu",
            "vyvinúť primerané úsilie na zmiernenie dopadov",
            "obnoviť plnenie hneď, ako je to prakticky možné",
          ]}
        />
        <LegalText>
          Ak vyššia moc trvá viac ako 60 dní, ktorákoľvek zo strán môže Dohodu
          ukončiť.
        </LegalText>
      </LegalSection>

      <LegalSection title="14. Riešenie sporov">
        <LegalSub title="14.1 Rozhodné právo">
          <LegalText>
            Tieto Podmienky sa riadia právom Spojených arabských emirátov a
            predpismi UAQ Free Trade Zone.
          </LegalText>
        </LegalSub>
        <LegalSub title="14.2 Právomoc súdov">
          <LegalText>
            Na riešenie sporov majú výlučnú právomoc súdy v Umm Al Quwain,
            Spojené arabské emiráty, ak nie je dohodnuté inak.
          </LegalText>
        </LegalSub>
        <LegalSub title="14.3 Rokovanie">
          <LegalText>
            Pred začatím formálneho konania sa strany zaväzujú:
          </LegalText>
          <LegalList
            ordered
            items={[
              "pokúsiť sa o dohodu v dobrej viere počas 30 dní",
              "v prípade potreby postúpiť vec vedeniu oboch strán",
              "zvážiť mediáciu, ak rokovanie zlyhá",
            ]}
          />
        </LegalSub>
        <LegalSub title="14.4 Rozhodcovské konanie (voliteľné)">
          <LegalText>
            Po vzájomnej dohode možno spory riešiť prostredníctvom:
          </LegalText>
          <LegalList
            items={[
              "rozhodcovského konania podľa pravidiel UNCITRAL",
              "miesto konania: Umm Al Quwain, SAE",
              "jazyk konania: angličtina",
              "jeden rozhodca (alebo traja pri nárokoch nad 500 000 AED)",
            ]}
          />
        </LegalSub>
        <LegalSub title="14.5 Predbežné opatrenia">
          <LegalText>
            Nič nebráni ktorejkoľvek zo strán domáhať sa predbežného opatrenia
            pri:
          </LegalText>
          <LegalList
            items={[
              "porušení mlčanlivosti",
              "porušení práv duševného vlastníctva",
              "naliehavých veciach vyžadujúcich okamžitý zásah",
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="15. Všeobecné ustanovenia">
        <LegalSub title="15.1 Úplnosť dohody">
          <LegalText>
            Tieto Podmienky spolu s podpísanými ponukami alebo zadaniami prác
            predstavujú úplnú dohodu strán a nahrádzajú všetky predchádzajúce
            dohody a dojednania.
          </LegalText>
        </LegalSub>
        <LegalSub title="15.2 Zmeny">
          <LegalText>Tieto Podmienky možno meniť len:</LegalText>
          <LegalList
            items={[
              "písomnou dohodou podpísanou oprávnenými zástupcami",
              "zverejnením aktualizovaného znenia na našom webe (pri všeobecných zmenách)",
              "s 30-dňovým predstihom pri podstatných zmenách dotýkajúcich sa prebiehajúcich projektov",
            ]}
          />
        </LegalSub>
        <LegalSub title="15.3 Postúpenie">
          <LegalList
            items={[
              "Klient nesmie postúpiť túto Dohodu bez písomného súhlasu Spoločnosti",
              "Spoločnosť ju môže postúpiť prepojeným osobám alebo v súvislosti so zlúčením či akvizíciou",
              "akékoľvek neoprávnené postúpenie je neplatné",
            ]}
          />
        </LegalSub>
        <LegalSub title="15.4 Nezávislé postavenie strán">
          <LegalText>
            Strany sú nezávislými zmluvnými partnermi. Nič v tejto Dohode
            nezakladá:
          </LegalText>
          <LegalList
            items={[
              "pracovnoprávny vzťah",
              "partnerstvo ani spoločný podnik",
              "zastúpenie ani franšízu",
              "fiduciárnu povinnosť nad rámec toho, čo je tu uvedené",
            ]}
          />
        </LegalSub>
        <LegalSub title="15.5 Oddeliteľnosť ustanovení">
          <LegalText>
            Ak sa niektoré ustanovenie ukáže ako neplatné alebo nevymožiteľné:
          </LegalText>
          <LegalList
            items={[
              "bude upravené v najmenšom potrebnom rozsahu",
              "ostatné ustanovenia zostávajú v plnej platnosti",
              "strany v prípade potreby dojednajú náhradné ustanovenie",
            ]}
          />
        </LegalSub>
        <LegalSub title="15.6 Vzdanie sa práv">
          <LegalList
            items={[
              "neuplatnenie niektorého práva neznamená vzdanie sa tohto práva",
              "vzdanie sa práva je účinné len v písomnej forme",
              "vzdanie sa práva pri jednom porušení sa nevzťahuje na ďalšie porušenia",
            ]}
          />
        </LegalSub>
        <LegalSub title="15.7 Doručovanie">
          <LegalText>
            Všetky oznámenia musia byť písomné a zasielajú sa na:
          </LegalText>
          <LegalBox title="Spoločnosť:">
            <p className="mb-1 text-gray-300">M.D.N Tech FZE</p>
            <p className="mb-1 text-gray-300">
              Al Shmookh Business Center M 1003
            </p>
            <p className="mb-1 text-gray-300">One UAQ, UAQ Free Trade Zone</p>
            <p className="mb-1 text-gray-300">
              Umm Al Quwain, Spojené arabské emiráty
            </p>
            <p className="mb-1 text-gray-300">E-mail: contact@mdntech.org</p>
            <p className="text-gray-300">Na vybavenie: Martin Jeřábek</p>
          </LegalBox>
          <LegalText>
            <L>Klient:</L> na adresu uvedenú v projektovej zmluve alebo v
            klientskom účte.
          </LegalText>
          <LegalText>Oznámenie je účinné:</LegalText>
          <LegalList
            items={[
              "doručením osobne",
              "3 pracovné dni po odoslaní poštou",
              "potvrdením prijatia e-mailu",
            ]}
          />
        </LegalSub>
        <LegalSub title="15.8 Jazyk">
          <LegalText>
            V prípade rozporu medzi jazykovými verziami týchto Podmienok je
            rozhodujúce anglické znenie.
          </LegalText>
        </LegalSub>
        <LegalSub title="15.9 Nadpisy">
          <LegalText>
            Nadpisy častí slúžia len na orientáciu a nemajú vplyv na výklad.
          </LegalText>
        </LegalSub>
        <LegalSub title="15.10 Rovnopisy">
          <LegalText>
            Túto Dohodu možno vyhotoviť vo viacerých rovnopisoch, pričom každý sa
            považuje za originál.
          </LegalText>
        </LegalSub>
      </LegalSection>

      <LegalSection title="16. Pravidlá používania">
        <LegalSub title="16.1 Zakázané použitie">
          <LegalText>
            Klient sa zaväzuje nepoužívať naše Služby na:
          </LegalText>
          <LegalList
            items={[
              "nezákonnú činnosť alebo porušovanie právnych predpisov",
              "porušovanie práv duševného vlastníctva",
              "šírenie škodlivého kódu, vírusov alebo malvéru",
              "obťažovanie, zneužívanie alebo poškodzovanie iných osôb",
              "spam, phishing alebo podvodnú činnosť",
              "neoprávnený prístup k systémom alebo údajom",
              "predstieranie cudzej totožnosti alebo uvádzanie do omylu",
            ]}
          />
        </LegalSub>
        <LegalSub title="16.2 Správanie v klientskom účte">
          <LegalText>Pri používaní klientskeho účtu sa zaväzujete:</LegalText>
          <LegalList
            items={[
              "zachovávať dôvernosť prihlasovacích údajov",
              "nezdieľať prístup s neoprávnenými osobami",
              "bezodkladne nahlásiť Spoločnosti akýkoľvek bezpečnostný incident",
              "používať účet výhradne na povolené projektové účely",
              "nepokúšať sa obchádzať bezpečnostné opatrenia",
            ]}
          />
        </LegalSub>
        <LegalSub title="16.3 Dôsledky porušenia">
          <LegalText>Porušenie pravidiel používania môže viesť k:</LegalText>
          <LegalList
            items={[
              "okamžitému pozastaveniu alebo ukončeniu Služieb",
              "vymazaniu obsahu alebo účtu",
              "právnym krokom a oznámeniu orgánom",
              "zodpovednosti za spôsobenú škodu",
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="17. Podpora a údržba">
        <LegalSub title="17.1 Záručná podpora">
          <LegalText>Počas záručnej doby Spoločnosť poskytuje:</LegalText>
          <LegalList
            items={[
              "opravy chýb v odovzdanom kóde",
              "vysvetlenia a podporu k dokumentácii",
              "riešenie problémov súvisiacich s dohodnutou špecifikáciou",
            ]}
          />
        </LegalSub>
        <LegalSub title="17.2 Podpora po záruke">
          <LegalText>Po uplynutí záruky je podpora dostupná:</LegalText>
          <LegalList
            items={[
              "na základe samostatnej zmluvy o údržbe",
              "podľa skutočne odpracovaného času a materiálu",
              "prostredníctvom balíkov podpory",
            ]}
          />
        </LegalSub>
        <LegalSub title="17.3 Doby odozvy">
          <LegalText>Doby odozvy podpory sú definované v:</LegalText>
          <LegalList
            items={[
              "individuálnych zmluvách o podpore",
              "dohodách o úrovni služieb (SLA), ak sú dojednané",
              "podmienkach konkrétneho projektu",
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="18. Aktualizácie a zmeny">
        <LegalSub title="18.1 Aktualizácie služieb">
          <LegalText>Spoločnosť si vyhradzuje právo:</LegalText>
          <LegalList
            items={[
              "aktualizovať alebo upravovať Služby s cieľom zlepšiť funkčnosť",
              "nasadzovať bezpečnostné záplaty a aktualizácie",
              "modernizovať infraštruktúru a technológie",
              "ukončiť zastarané alebo nepodporované funkcie",
            ]}
          />
        </LegalSub>
        <LegalSub title="18.2 Informovanie Klienta">
          <LegalText>
            Spoločnosť s primeraným predstihom oznámi:
          </LegalText>
          <LegalList
            items={[
              "podstatné zmeny Služieb",
              "plánované odstávky a údržbu",
              "aktualizácie ovplyvňujúce systémy Klienta",
              "zmeny hostingovej infraštruktúry",
            ]}
          />
        </LegalSub>
      </LegalSection>

      <LegalSection title="19. Kontrola vývozu a súlad s predpismi">
        <LegalText>
          Klient berie na vedomie, že Výstupy môžu podliehať predpisom SAE o
          kontrole vývozu, medzinárodným vývozným obmedzeniam, sankciám a
          embargám.
        </LegalText>
        <LegalText>Klient sa zaväzuje:</LegalText>
        <LegalList
          items={[
            "dodržiavať všetky príslušné vývozné predpisy",
            "nevyvážať do zakázaných krajín alebo zakázaným subjektom",
            "zabezpečiť potrebné vývozné povolenia",
            "odškodniť Spoločnosť za prípadné porušenia",
          ]}
        />
      </LegalSection>

      <LegalSection title="20. Kontaktné údaje">
        <LegalText>
          S otázkami k týmto obchodným podmienkam sa obráťte na:
        </LegalText>
        <LegalBox title="M.D.N Tech FZE">
          <p className="mb-1 text-gray-300">Al Shmookh Business Center M 1003</p>
          <p className="mb-1 text-gray-300">One UAQ, UAQ Free Trade Zone</p>
          <p className="mb-1 text-gray-300">
            Umm Al Quwain, Spojené arabské emiráty
          </p>
          <p className="mb-1 text-gray-300">E-mail: contact@mdntech.org</p>
          <p className="mb-1 text-gray-300">Web: mdntech.org</p>
          <p className="text-gray-300">Kontaktná osoba: Martin Jeřábek</p>
        </LegalBox>
      </LegalSection>

      <LegalFooterNote>
        <p className="mb-2 text-sm text-gray-400">
          <span className="font-semibold text-white">Potvrdenie:</span>{" "}
          Používaním našich Služieb potvrdzujete, že ste si tieto Podmienky
          prečítali, rozumiete im a súhlasíte s tým, že sú pre vás záväzné.
        </p>
        <p className="mb-2 text-sm text-gray-400">
          <span className="font-semibold text-white">Účinnosť:</span> Tieto
          Podmienky sú účinné odo dňa, keď prvýkrát navštívite náš web alebo
          objednáte naše Služby.
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-white">Revízia:</span> Odporúčame
          si Podmienky pravidelne prečítať. Pokračovaním v používaní služieb po
          ich aktualizácii vyjadrujete súhlas so zmeneným znením.
        </p>
      </LegalFooterNote>
    </LegalPage>
  );
}
