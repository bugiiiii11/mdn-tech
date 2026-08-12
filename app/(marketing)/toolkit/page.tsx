import type { Metadata } from "next";

import { AutoWrap } from "@/components/toolkit/auto-wrap";
import { orderedListed } from "@/components/toolkit/catalogue";
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

export const metadata: Metadata = {
  title: {
    absolute: "Claude Code Skills: Curated Directory, Free, No Account",
  },
  description:
    "A hand-picked directory of Claude Code skills and MCP servers — what each one does, who wrote it, and where to install it. Free, no account, no upsell.",
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
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Claude Code Skills: Curated Directory, Free, No Account",
    description:
      "A hand-picked directory of Claude Code skills and MCP servers — what each one does, who wrote it, and where to install it. Free, no account, no upsell.",
  },
};

// Matches the breadcrumb rendered above the h1. Emitting BreadcrumbList without
// a visible trail would be a schema/page mismatch, so the two ship together.
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "M.D.N Tech",
      item: "https://mdntech.org/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ToolKit",
      item: PAGE_URL,
    },
  ],
};

// SCOPED TO THE M.D.N TECH SKILL BUNDLE, never to the directory. Describing the
// catalogue as one application would force us to assert offers and licence
// terms over third-party work we do not own and hold no licence data for.
//
// Deliberately absent, and must stay absent: aggregateRating, ratingValue,
// reviewCount and review (no ratings exist); interactionStatistic and
// downloadCount (no telemetry, no install counter, no stats fetch anywhere in
// the codebase); softwareVersion, datePublished and fileSize (not verifiable
// from this repo); screenshot (none is rendered).
//
// The zero-price Offer is defensible because there is no ToolKit price
// constant, credit cost or metering call in lib/portal/plans.ts at all. The
// licence URL is asserted only because the repository is public and its LICENSE
// is MIT — verified before this shipped.
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Handoff — Claude Code skills by M.D.N Tech",
  description:
    "Session-lifecycle and knowledge-base skills for Claude Code: /handoff start, wrap, save and docs, plus build-kb. Plain SKILL.md files installed into ~/.claude/skills/.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Linux, Windows",
  softwareRequirements: "Claude Code",
  url: PAGE_URL,
  installUrl: `${PAGE_URL}#install`,
  downloadUrl: TOOLKIT_REPO,
  codeRepository: TOOLKIT_REPO,
  license: `${TOOLKIT_REPO}/blob/main/LICENSE`,
  featureList: [
    "/handoff start — session briefing from a bounded state file",
    "/handoff wrap — update docs, rotate the archive, commit locally, never push",
    "/handoff save — emergency snapshot before context runs out",
    "/handoff docs — documentation refresh with no commit",
    "build-kb — generate a chatbot-ready knowledge-base.md from a repository",
  ],
  author: {
    "@type": "Organization",
    name: "M.D.N Tech FZE",
    url: "https://mdntech.org",
  },
  publisher: {
    "@type": "Organization",
    name: "M.D.N Tech FZE",
    url: "https://mdntech.org",
  },
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
// offers or license would be fabrication.
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Curated Claude Code skills directory",
  numberOfItems: orderedListed.length,
  itemListElement: orderedListed.map((skill, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: skill.name,
    url: skill.installationUrl,
    item: {
      "@type": "CreativeWork",
      name: skill.name,
      description: skill.description,
      url: skill.installationUrl,
      author: skill.author,
    },
  })),
};

export default function ToolkitPage() {
  return (
    <main className="h-full w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
