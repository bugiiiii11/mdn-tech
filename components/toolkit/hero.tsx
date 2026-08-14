import { PageHero } from "@/components/product-pages/primitives";
import { TOOLKIT_REPO } from "@/lib/marketing/links";

import { MDN_COUNT, numberWord } from "./catalogue";

// Above-the-fold block for /toolkit: the page's only h1, the lede and both
// CTAs, in the shared full-viewport hero shell (see PageHero).
//
// The subtitle carries this page's unique angle — the enumerated catalogue,
// per-author sourcing, the one-command install. "Evaluated and would use
// ourselves" belongs to the homepage ToolKit section; do not restate it here
// or the two indexable surfaces compete on the same string.
//
// The eyebrow pill, visible breadcrumb, "nothing signs you up" note and the
// four count chips were removed on 2026-08-14 for a cleaner fold. The counts
// still render — derived from the same catalogue array — as the directory
// section's own heading and cards, which is where a visitor can verify them.

export const ToolkitHero = () => (
  <PageHero
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
  />
);
