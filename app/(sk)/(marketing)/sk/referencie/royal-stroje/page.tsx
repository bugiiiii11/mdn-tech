import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiDatabase,
  FiExternalLink,
  FiGlobe,
  FiHelpCircle,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiSearch,
} from "react-icons/fi";

import { CtaBand } from "@/components/product-pages/primitives";
import { organizationRef, SITE_URL } from "@/components/product-pages/schema";
import { SkChatWidget } from "@/components/sk/SkChatWidget";
import { SK_CS_ROYAL_STROJE as CS } from "@/constants/sk-case-studies";

// Case study + campaign landing (rework plan v1.0, SK-B): the Royal Stroje
// partner emails (~150 warm contacts) land here, so the page is a static
// server component — every word reaches the visitor and the crawler without
// JavaScript. The page itself never branches on UTM params and the canonical
// below keeps them out of the index — but they are not lost: a visitor who
// lands here from the campaign carries first-touch attribution through to the
// /sk form via lib/marketing/attribution.ts (rework plan C3). Navbar/footer
// switch to the SK chrome via the pathname.startsWith("/sk") branch in
// components/main.

export const metadata: Metadata = {
  title: CS.metaTitle,
  description: CS.metaDescription,
  alternates: {
    // Slovak-only page — no EN twin, so no hreflang block (the same honesty
    // rule the EN-only product pages follow in app/sitemap.ts).
    canonical: CS.path,
  },
  openGraph: {
    type: "article",
    locale: "sk_SK",
    url: CS.url,
    title: CS.metaTitle,
    description: CS.metaDescription,
    siteName: "M.D.N Tech",
    images: [{ url: CS.hero.image, alt: CS.hero.imageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: CS.metaTitle,
    description: CS.metaDescription,
    images: [CS.hero.image],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Article + BreadcrumbList in one @graph. The breadcrumb items come from the
// SAME array the visible trail renders — per the rule in
// components/product-pages/schema.ts, the schema may only describe navigation
// a visitor can actually see.
const caseStudySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${CS.url}#article`,
      headline: CS.hero.title,
      description: CS.metaDescription,
      image: `${SITE_URL}${CS.hero.image}`,
      inLanguage: "sk",
      datePublished: CS.datePublished,
      dateModified: CS.datePublished,
      author: organizationRef(),
      publisher: organizationRef(),
      mainEntityOfPage: CS.url,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${CS.url}#breadcrumb`,
      itemListElement: CS.breadcrumb.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${SITE_URL}${crumb.href}`,
      })),
    },
  ],
};

const SOLUTION_ICONS: Record<string, IconType> = {
  globe: FiGlobe,
  search: FiSearch,
  database: FiDatabase,
  chat: FiMessageCircle,
};

const LOCAL_SEO_ICONS: Record<string, IconType> = {
  map: FiMapPin,
  search: FiSearch,
  faq: FiHelpCircle,
  phone: FiPhone,
};

const GLASS_CARD_CLASS =
  "rounded-2xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm";

export default function RoyalStrojeCaseStudyPage() {
  return (
    <main lang="sk" className="w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-10 pt-32 md:px-8 md:pt-40">
        {/* Visible breadcrumb — the BreadcrumbList above renders this exact trail. */}
        <nav aria-label="Ste tu" className="mb-8 w-full">
          <ol className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-gray-400">
            {CS.breadcrumb.map((crumb, index) => {
              const isLast = index === CS.breadcrumb.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-gray-600">
                      /
                    </span>
                  ) : null}
                  {isLast ? (
                    <span
                      aria-current="page"
                      className="inline-flex min-h-[24px] items-center text-gray-300"
                    >
                      {crumb.name}
                    </span>
                  ) : (
                    /* min-h-[24px]: text-xs breadcrumbs are a 16px tap target
                       without it, under the audited floor (SEO item 17). */
                    <Link
                      href={crumb.href}
                      className="inline-flex min-h-[24px] items-center transition-colors hover:text-cyan-400"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <h1 className="max-w-3xl break-words bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-center text-3xl font-bold text-transparent md:text-5xl md:leading-tight">
          {CS.hero.title}
        </h1>

        <p className="mt-6 max-w-3xl text-center text-lg leading-relaxed text-gray-300 md:text-xl">
          {CS.hero.lede}
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href={CS.hero.ctaPrimary.href}
            className="button-primary cursor-pointer rounded-lg px-8 py-3 text-center font-semibold text-white"
          >
            {CS.hero.ctaPrimary.label}
          </a>
          <a
            href={CS.hero.ctaSecondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#7042f88b] bg-[#7042f815] px-8 py-3 text-center font-semibold text-white transition-colors hover:bg-[#7042f825]"
          >
            {CS.hero.ctaSecondary.label}
            <FiExternalLink aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>

        {/* Hero shot: the live site is the first receipt. */}
        <div
          className={`relative mt-12 aspect-[16/10] w-full overflow-hidden ${GLASS_CARD_CLASS}`}
        >
          <Image
            src={CS.hero.image}
            alt={CS.hero.imageAlt}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/60 via-transparent to-transparent" />
        </div>
      </div>

      {/* Klient + Zadanie */}
      <section className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-2 md:px-8">
        {[CS.client, CS.brief].map((block) => (
          <div key={block.title} className={`p-6 sm:p-8 ${GLASS_CARD_CLASS}`}>
            <h2 className="mb-3 text-xl font-semibold text-white">
              {block.title}
            </h2>
            <p className="text-sm leading-relaxed text-gray-300 md:text-base">
              {block.body}
            </p>
          </div>
        ))}
      </section>

      {/* Riešenie */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-10 md:px-8">
        <h2 className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text py-6 text-center text-3xl font-semibold text-transparent md:text-4xl">
          {CS.solution.title}
        </h2>
        <p className="mx-auto mb-10 max-w-3xl text-center text-base text-gray-400 md:text-lg">
          {CS.solution.intro}
        </p>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CS.solution.blocks.map((block) => {
            const Icon = SOLUTION_ICONS[block.icon];
            return (
              <div key={block.title} className={`p-6 ${GLASS_CARD_CLASS}`}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                  {Icon ? <Icon className="h-6 w-6 text-cyan-400" /> : null}
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">
                  {block.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {block.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lokálne SEO — the half of the work that is invisible from the front
          end. Every claim here is checkable in the page source of the live
          site; rankings deliberately are not claimed. */}
      <section className="mx-auto flex w-full max-w-4xl flex-col px-4 py-10 md:px-8">
        <h2 className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text py-6 text-center text-3xl font-semibold text-transparent md:text-4xl">
          {CS.localSeo.title}
        </h2>
        <p className="mx-auto mb-10 max-w-3xl text-center text-base text-gray-400 md:text-lg">
          {CS.localSeo.intro}
        </p>

        <ul className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {CS.localSeo.items.map((item) => {
            const Icon = LOCAL_SEO_ICONS[item.icon];
            return (
              <li key={item.title} className={`p-6 ${GLASS_CARD_CLASS}`}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                  {Icon ? (
                    <Icon aria-hidden="true" className="h-6 w-6 text-cyan-400" />
                  ) : null}
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-center text-sm italic leading-relaxed text-gray-500">
          {CS.localSeo.note}
        </p>
      </section>

      {/* Výsledky + founder quote land here once Royal Stroje confirms real
          numbers and wording — see the honesty gate in
          constants/sk-case-studies.ts. Nothing invented ships before that. */}

      <CtaBand
        id="konzultacia"
        title={CS.cta.title}
        body={CS.cta.body}
        primary={CS.cta.primary}
        secondary={CS.cta.secondary}
      />
      <SkChatWidget />
    </main>
  );
}
