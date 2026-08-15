import { FaqSection, type FaqEntry } from "@/components/product-pages/faq";
import { TOOLKIT_REPO } from "@/lib/marketing/links";
import { APP_LIVE, APP_URL } from "@/lib/marketing/products";
import { FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

import { LISTED_COUNT, MDN_COUNT, MDN_SKILLS, numberWord } from "./catalogue";

// The directory `git clone` creates — derived from the same URL the install
// section uses, so this answer cannot disagree with the actual commands.
const CLONE_DIR = TOOLKIT_REPO.split("/").pop() ?? "handoff";

// FAQ for /toolkit. The accordion, the FAQPage JSON-LD and the anti-drift
// contract (schema text = exactly the rendered answer + link label) all come
// from the shared machinery in components/product-pages/faq — this file only
// owns the questions.
//
// DISJOINT BY DESIGN: none of these questions appears in the landing FAQ, and
// the landing page's one ToolKit question ("Is ToolKit actually free, or is it
// a trial?") is deliberately not re-asked here — the cost section carries that
// fact at a different depth.
//
// HONESTY CONSTRAINT (do not regress): Claude Code itself requires a paid plan
// (Pro, Max, Team, Enterprise) or an API account — Anthropic's docs say the
// free Claude.ai plan does not include it. Never claim skills "work on
// free-tier Claude Code"; the true claim is that skills add no cost on top of
// whatever plan you already have. This answer feeds the FAQPage JSON-LD, so a
// false version here becomes a machine-readable false claim.
//
// The trial figure comes from lib/portal/plans.ts; the skill counts and
// directory names come from `listed`. No digit below is typed by hand except
// the auto-wrap thresholds, which live in shell defaults and are documented as
// prose in the auto-wrap section.

const FAQS: FaqEntry[] = [
  {
    question: "Where do Claude Code skills live on my machine?",
    answer:
      "Personal skills live in ~/.claude/skills/<name>/SKILL.md and are available in every project you open. Project skills live in the repository's own .claude/skills/ directory and travel with the codebase, so everyone who clones it gets them. Claude Code reads both.",
  },
  {
    question:
      "What is the difference between a Claude Code skill and an MCP server?",
    answer:
      "A skill is a local Markdown file that adds a slash command and tells Claude how to do something. An MCP server is a running service Claude connects to over a transport so it can reach a system it otherwise cannot — your issue tracker, a browser, a database. Skills need no network and no credentials; MCP servers are network services and usually need both.",
  },
  {
    question: "Do I need a paid Claude plan or an API key?",
    answer:
      "The skills add nothing on top of whatever you already pay for Claude Code — they are files it reads, not a subscription feature. Claude Code itself does require a Pro, Max, Team or Enterprise plan, or an API (Console) account; the free Claude.ai plan does not include it. Individual entries can have their own requirements — Firecrawl needs a Firecrawl API key, and every MCP server authenticates to its own service — but that is the third party's requirement, not ours.",
  },
  {
    question: "Can I install one skill instead of the whole directory?",
    answer: `Yes, and it is the only option. There is no command that installs the catalogue. Ours copies the ${numberWord(
      MDN_COUNT
    )} M.D.N Tech skills out of one repository; each of the other ${
      LISTED_COUNT - MDN_COUNT
    } entries installs from its own author's repository, under that author's instructions.`,
    link: {
      href: TOOLKIT_REPO,
      label: "Browse the M.D.N Tech skills on GitHub",
      external: true,
    },
  },
  {
    question:
      "What exactly does the install command write, and how do I undo it?",
    answer: `A git clone of the repository in your current directory, plus one directory per skill under ~/.claude/skills/, each containing a single SKILL.md — nothing else. Back up first with cp -r ~/.claude/skills ~/.claude/skills.bak, because same-named directories are replaced without prompting. Undoing it means removing both: rm -rf ${MDN_SKILLS.map(
      (skill) => `~/.claude/skills/${skill.id}`
    ).join(
      " "
    )} for the skills and rm -rf ${CLONE_DIR} for the clone — or Remove-Item -Recurse -Force on Windows.`,
  },
  {
    question: "How do I check a skill is safe before I run it?",
    answer:
      "Clone the repository and read the SKILL.md. It is plain Markdown with no build step and no hidden code, so reviewing a skill takes about as long as reading a page of documentation. The manual install path is documented above precisely so you never have to run a script you have not read — and that applies to third-party skills too, where the author's code is the thing you are reviewing.",
  },
  {
    question: "Are these skills licensed for commercial use?",
    answer:
      "The M.D.N Tech skills are MIT, so yes for those. For every other entry we hold no licence data at all — the catalogue has no licence field — so check the author's repository before you ship with one. We would rather say we do not know than guess on your behalf.",
    link: {
      href: `${TOOLKIT_REPO}/blob/main/LICENSE`,
      label: "Read the MIT LICENSE",
      external: true,
    },
  },
  {
    question: "Why do the auto-wrap hooks nudge at 15% of the context window?",
    answer:
      "To keep the session under Claude's long-context premium rate. Wrapping early costs a commit; wrapping late costs every subsequent request. The soft threshold, the hard threshold and the assumed window size are all environment variables, so if your model or your budget is different you can move all three.",
  },
  {
    question: "Do these work on Windows?",
    answer:
      "The skills do, and the install section has a PowerShell variant of every command. The optional auto-wrap hooks are shell scripts, so they additionally need bash and jq — Git Bash covers both. Nothing else on the page is platform-specific.",
  },
  {
    question: "Does M.D.N Tech track who installs these skills?",
    answer:
      "No. There is no telemetry in the skills, no analytics script on this site, no install counter and no account involved in getting them. That is also why we publish no adoption numbers anywhere on this page — we do not have any.",
    link: { href: "/privacy", label: "Read our privacy policy" },
  },
  {
    question: "How do I turn my codebase into a chatbot knowledge base?",
    answer: `Install Build KB and run it. It reads the user-facing content already in your repository and writes one knowledge-base.md organised into fixed sections, skipping any section the repo has no source for rather than inventing one. Paste the result into any chatbot you like, including ChatKit, where a new chatbot gets ${FREE_TRIAL_MESSAGES} free messages and asks for no card.`,
    // No link at all while the portal is closed (APP_LIVE) — faqAnswerText()
    // folds the label into the FAQPage schema, so a dead link here would put a
    // dead invitation in the structured data too.
    link: APP_LIVE
      ? { href: `${APP_URL}/signup`, label: "Create an account", external: true }
      : undefined,
  },
];

export const ToolkitFaq = () => (
  <FaqSection
    id="faq"
    title="Claude Code skills: the questions we actually get"
    intro="Everything below is answered somewhere in the sections above, in more detail. This is the version for people who arrived with one specific question."
    faqs={FAQS}
  />
);
