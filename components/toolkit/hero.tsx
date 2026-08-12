import {
  PageHero,
  StatChip,
  type Crumb,
} from "@/components/product-pages/primitives";
import { TOOLKIT_REPO } from "@/lib/marketing/links";

import {
  AUTHOR_COUNT,
  LISTED_COUNT,
  MCP_COUNT,
  MDN_COUNT,
  numberWord,
} from "./catalogue";

// Above-the-fold block for /toolkit: visible breadcrumb, the page's only h1,
// the lede, both CTAs, and the proof chips.
//
// The trail is exported so the page can build its BreadcrumbList JSON-LD from
// the exact array PageHero renders — BreadcrumbList is only honest if a
// visitor can see the trail, and sharing the array means the two cannot
// disagree. PageHero owns the navbar clearance, so there is no margin hack
// here.
//
// The subtitle carries this page's unique angle — the enumerated catalogue,
// per-author sourcing, the one-command install. "Evaluated and would use
// ourselves" belongs to the homepage ToolKit section; do not restate it here
// or the two indexable surfaces compete on the same string.
//
// Every chip is derived from `listed` (catalogue.tsx), the same array the
// directory section renders, so the counts and the card count cannot disagree.

export const TOOLKIT_TRAIL: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "ToolKit" },
];

export const ToolkitHero = () => (
  <PageHero
    trail={TOOLKIT_TRAIL}
    eyebrow="ToolKit — free, no account"
    title="Claude Code Skills: What They Are and Which Ones to Install"
    subtitle={`Every skill is written out on the page itself — what it does, who wrote it, and the author's own repository to install from — with a one-command install for the ${numberWord(
      MDN_COUNT
    )} we publish ourselves.`}
    primaryCta={{ href: "#directory", label: "Browse the skill directory →" }}
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
);
