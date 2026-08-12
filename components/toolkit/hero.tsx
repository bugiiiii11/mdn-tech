import Link from "next/link";

import { PageHero, StatChip } from "@/components/product-pages/primitives";
import { APP_URL } from "@/lib/marketing/products";
import { TOOLKIT_REPO } from "@/lib/marketing/links";

import {
  AUTHOR_COUNT,
  LISTED_COUNT,
  MCP_COUNT,
  MDN_COUNT,
} from "./catalogue";

// Above-the-fold block for /toolkit: visible breadcrumb, the page's only h1,
// the lede, both CTAs, and the proof chips.
//
// The breadcrumb is rendered, not just emitted as schema — BreadcrumbList is
// only honest if a visitor can see the trail. PageHero owns the mt-40 that
// clears the fixed navbar, so the breadcrumb takes that clearance instead and
// the child-selector below pulls the hero back up under it.
//
// Every chip is derived from `listed` (catalogue.tsx), the same array the
// directory section renders, so the counts and the card count cannot disagree.

export const ToolkitHero = () => (
  <div className="relative z-[20] w-full">
    <nav
      aria-label="Breadcrumb"
      className="mt-36 flex w-full justify-center px-4 md:px-20"
    >
      <ol className="flex items-center gap-2 text-sm text-gray-400">
        <li>
          <Link
            href="/"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            M.D.N Tech
          </Link>
        </li>
        <li aria-hidden="true" className="text-gray-500">
          /
        </li>
        <li aria-current="page">ToolKit</li>
      </ol>
    </nav>

    {/* Child selector beats PageHero's own mt-40 without !important, so the
        hero sits under the breadcrumb instead of below a second 10rem gap. */}
    <div className="[&>section]:mt-6">
      <PageHero
        eyebrow="ToolKit — free, no account"
        title="Claude Code Skills: What They Are and Which Ones to Install"
        subtitle="A directory of Claude Code skills we evaluated and would use ourselves — every entry links to the author's own source. Free, no account, nothing to cancel."
        primaryCta={{ href: `${APP_URL}/toolkit`, label: "Browse the live directory →" }}
        secondaryCta={{
          href: TOOLKIT_REPO,
          label: "The skills on GitHub",
          external: true,
        }}
        note="Skills are files on your machine. Nothing here signs you up for anything."
      >
        <ul className="flex flex-wrap items-center justify-center gap-3 list-none">
          <li>
            {/* "below", not "in the directory": this page renders every entry
                that has a source link, which is not the same set the portal's
                gallery shows. The chip describes what a visitor can count. */}
            <StatChip>{LISTED_COUNT} skills below</StatChip>
          </li>
          <li>
            <StatChip>{AUTHOR_COUNT} authors</StatChip>
          </li>
          <li>
            <StatChip>{MDN_COUNT} written by M.D.N Tech</StatChip>
          </li>
          <li>
            <StatChip>{MCP_COUNT} MCP servers</StatChip>
          </li>
        </ul>
      </PageHero>
    </div>
  </div>
);
