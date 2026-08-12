import Link from "next/link";

import { Section } from "@/components/product-pages/primitives";
import { TOOLKIT_REPO } from "@/lib/marketing/links";
import { APP_URL } from "@/lib/marketing/products";
import { FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

import { LISTED_COUNT, MDN_COUNT, numberWord } from "./catalogue";

// FAQ + FAQPage structured data, generated from ONE array — the same
// anti-drift pattern as components/landing/faq.tsx. The schema text is built by
// answerText(), which concatenates exactly the answer string and the link label
// that are rendered, so the JSON-LD can never say something the page does not.
//
// Native <details>/<summary>: keyboard-operable and readable with JS disabled,
// which also means every answer is in the HTML for a crawler.
//
// DISJOINT BY DESIGN: none of these eleven questions appears in the landing
// FAQ, and the landing page's one ToolKit question ("Is ToolKit actually free,
// or is it a trial?") is deliberately not re-asked here — the cost section
// carries that fact at a different depth.
//
// The trial figure comes from lib/portal/plans.ts; the skill counts come from
// `listed`. No digit below is typed by hand except the auto-wrap thresholds,
// which live in shell defaults and are documented as prose in the auto-wrap
// section.

type FaqLink = { href: string; label: string; external?: boolean };
type FaqEntry = { question: string; answer: string; link?: FaqLink };

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
      "Not for skills. They are files Claude Code reads, so they work on free-tier accounts with no separate subscription. Individual entries can have their own requirements — Firecrawl needs a Firecrawl API key, and every MCP server authenticates to its own service — but that is the third party's requirement, not ours.",
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
    answer:
      "It writes only into ~/.claude/skills/, one directory per skill, each containing a single SKILL.md. Back up first with cp -r ~/.claude/skills ~/.claude/skills.bak, because same-named directories are replaced without prompting. Removing a skill is one line: rm -rf ~/.claude/skills/handoff, or Remove-Item -Recurse -Force on Windows.",
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
    link: { href: `${APP_URL}/signup`, label: "Create an account", external: true },
  },
];

/** Exactly the text a visitor reads, so the schema cannot drift from the page. */
const answerText = (entry: FaqEntry) =>
  entry.link ? `${entry.answer} ${entry.link.label}.` : entry.answer;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: { "@type": "Answer", text: answerText(entry) },
  })),
};

const AnswerLink = ({ link }: { link: FaqLink }) =>
  link.external ? (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-400 transition-colors hover:text-cyan-300"
    >
      {link.label}
    </a>
  ) : (
    <Link
      href={link.href}
      className="text-cyan-400 transition-colors hover:text-cyan-300"
    >
      {link.label}
    </Link>
  );

export const ToolkitFaq = () => (
  <Section
    id="faq"
    title="Claude Code skills: the questions we actually get"
    intro="Everything below is answered somewhere in the sections above, in more detail. This is the version for people who arrived with one specific question."
  >
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />

    <div className="flex w-full max-w-3xl flex-col divide-y divide-white/[0.06] border-y border-white/[0.06]">
      {FAQS.map((entry) => (
        <details key={entry.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-white transition-colors duration-200 hover:text-cyan-400 [&::-webkit-details-marker]:hidden">
            <h3 className="text-base md:text-lg font-medium">
              {entry.question}
            </h3>
            <span
              aria-hidden="true"
              className="mt-1 flex-shrink-0 text-cyan-400 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
          </summary>
          <p className="mt-3 pr-11 text-sm md:text-base text-gray-400 leading-relaxed">
            {entry.answer}
            {entry.link ? (
              <>
                {" "}
                <AnswerLink link={entry.link} />.
              </>
            ) : null}
          </p>
        </details>
      ))}
    </div>
  </Section>
);
