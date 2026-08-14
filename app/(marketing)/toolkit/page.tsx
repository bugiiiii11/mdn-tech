import type { Metadata } from "next";

import {
  organizationRef,
  websiteRef,
} from "@/components/product-pages/schema";
import { AutoWrap } from "@/components/toolkit/auto-wrap";
import { ToolkitClosing } from "@/components/toolkit/closing";
import { Cost } from "@/components/toolkit/cost";
import { Directory } from "@/components/toolkit/directory";
import { ToolkitFaq } from "@/components/toolkit/faq";
import { ToolkitHero } from "@/components/toolkit/hero";
import { InstallSection } from "@/components/toolkit/install-section";
import { McpServers } from "@/components/toolkit/mcp-servers";
import { MdnSkills } from "@/components/toolkit/mdn-skills";
import { Objections } from "@/components/toolkit/objections";
import { WhatIsASkill } from "@/components/toolkit/what-is-a-skill";
import { WhoItsFor } from "@/components/toolkit/who-its-for";
import { TOOLKIT_REPO } from "@/lib/marketing/links";
import {
  MDN_SKILLS,
  joinWithAnd,
  orderedListed,
} from "@/lib/marketing/toolkit-catalogue";

// ToolKit product page — the indexable home of the "Claude Code skills"
// keyword cluster. The portal's ToolKit page is noindex, so this is the only
// surface that ranks; every section here is the deep version of something the
// homepage compresses into a bullet.
//
// Section order: hero -> definition -> install -> the directory itself ->
// what we wrote -> the hooks -> MCP servers -> qualification -> pricing ->
// objections -> FAQ -> closing band.
//
// title uses { absolute } so the root layout's "%s | M.D.N Tech" template does
// not double-suffix a title that already reads as a full SERP line.
const PAGE_URL = "https://mdntech.org/toolkit";

const PAGE_TITLE = "Claude Code Skills: Curated Directory, Free, No Account";

const META_DESCRIPTION =
  "A hand-picked directory of Claude Code skills and MCP servers — what each one does, who wrote it, and where to install it. Free, no account, no upsell.";

export const metadata: Metadata = {
  title: {
    absolute: PAGE_TITLE,
  },
  description: META_DESCRIPTION,
  keywords: [
    "Claude Code skills",
    "best Claude Code skills",
    "Claude Code skills directory",
    "how to install a Claude Code skill",
    "what is a Claude Code skill",
    "Claude Code MCP servers",
    "SKILL.md",
    "~/.claude/skills",
    "Claude Code slash commands",
    "Claude Code context management",
    "claude mcp add",
  ],
  alternates: {
    canonical: "/toolkit",
  },
  // Next.js REPLACES the root openGraph object wholesale (no deep merge), so
  // the root's image, siteName and locale must be restated here — otherwise
  // this page ships with no social preview at all.
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "M.D.N Tech",
    locale: "en_US",
    title: PAGE_TITLE,
    description: META_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ToolKit — curated Claude Code skills directory",
      },
    ],
  },
  // Without an explicit twitter block the page inherits the root's
  // ChatKit-flavoured card verbatim — Next only auto-fills twitter fields the
  // root left absent, and the root supplies all of them.
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: META_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

// No BreadcrumbList node: the hero's visible trail was removed on 2026-08-14,
// and this site only emits breadcrumb schema for a trail a visitor can see.
// Restoring one means restoring the visible breadcrumb with it.

// SCOPED TO THE M.D.N TECH SKILLS, never to the directory. Describing the
// catalogue as one application would force us to assert offers and licence
// terms over third-party work we do not own and hold no licence data for.
//
// The name is derived from MDN_SKILLS — the same array the visible copy
// renders ("Handoff and Build KB"), so the schema never carries a bundle label
// that appears nowhere on the page.
//
// Deliberately absent, and must stay absent: aggregateRating, ratingValue,
// reviewCount and review (no ratings exist); interactionStatistic and
// downloadCount (no telemetry, no install counter, no stats fetch anywhere in
// the codebase); softwareVersion, datePublished and fileSize (not verifiable
// from this repo); screenshot (none is rendered); codeRepository (valid on
// SoftwareSourceCode only, and downloadUrl already carries the repo).
//
// The zero-price Offer is defensible because there is no ToolKit price
// constant, credit cost or metering call in lib/portal/plans.ts at all. The
// licence URL is asserted only because the repository is public and its LICENSE
// is MIT — verified before this shipped.
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${PAGE_URL}#software`,
  name: joinWithAnd(MDN_SKILLS.map((skill) => skill.name)),
  description:
    "Session-lifecycle and knowledge-base skills for Claude Code: /handoff start, wrap, save and docs, plus build-kb. Plain SKILL.md files installed into ~/.claude/skills/.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Linux, Windows",
  softwareRequirements: "Claude Code",
  url: PAGE_URL,
  installUrl: `${PAGE_URL}#install`,
  downloadUrl: TOOLKIT_REPO,
  license: `${TOOLKIT_REPO}/blob/main/LICENSE`,
  featureList: [
    "/handoff start — session briefing from a bounded state file",
    "/handoff wrap — update docs, rotate the archive, commit locally, never push",
    "/handoff save — emergency snapshot before context runs out",
    "/handoff docs — documentation refresh with no commit",
    "build-kb — generate a chatbot-ready knowledge-base.md from a repository",
  ],
  // References to the one Organization node app/layout.tsx emits — never a
  // fresh anonymous {name, url} copy of the same company per page.
  author: organizationRef(),
  publisher: organizationRef(),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

// Mirrors the directory grid exactly: same array, same order. Child items are
// plain CreativeWorks with the author as text — we hold no price and no licence
// data for third-party skills, so typing them as SoftwareApplication with
// offers or license would be fabrication. Each ListItem uses the full form
// only (position + item); mixing in the summary form's top-level name/url is
// the both-forms-at-once shape Google's carousel guidance warns against.
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Curated Claude Code skills directory",
  numberOfItems: orderedListed.length,
  itemListElement: orderedListed.map((skill, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "CreativeWork",
      name: skill.name,
      description: skill.description,
      url: skill.installationUrl,
      author: skill.author,
    },
  })),
};

// Connective only — adds no claim that could be false. Mirrors the /chatkit
// page's WebPage node so the two product pages ship the same schema shape.
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: PAGE_TITLE,
  description: META_DESCRIPTION,
  inLanguage: "en",
  isPartOf: websiteRef(),
  about: { "@id": `${PAGE_URL}#software` },
};

export default function ToolkitPage() {
  return (
    <main className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="flex max-w-full flex-col gap-10">
        <ToolkitHero />
        <WhatIsASkill />
        <InstallSection />
        <Directory />
        <MdnSkills />
        <AutoWrap />
        <McpServers />
        <WhoItsFor />
        <Cost />
        <Objections />
        <ToolkitFaq />
        <ToolkitClosing />
      </div>
    </main>
  );
}
