import Link from "next/link";

import {
  CheckItem,
  GlassCard,
  PROSE_LINK_CLASS,
  Section,
} from "@/components/product-pages/primitives";

import {
  LISTED_COUNT,
  MDN_COUNT,
  MDN_SKILLS,
  joinWithAnd,
  numberWord,
} from "./catalogue";
import { Code } from "./inline-code";

// The authorship section: the dogfooding story, told with detail an aggregator
// cannot copy.
//
// HONESTY CONSTRAINTS (do not regress):
//  - Scope is the M.D.N Tech skills a reader can actually obtain — the ones
//    with a source link. The catalogue also carries M.D.N Tech entries with no
//    source link that are absent from this repo; nothing about them belongs
//    here, including the "production-tested across 5+ product launches" string.
//  - The count and the names are derived from `listed`, so this section can
//    never claim more authorship than the data supports.
//  - handoff.md's line cap is written as "a hard line cap": the skill's
//    SKILL.md and this project's CLAUDE.md set different digits and neither is
//    importable, so picking one would be inventing a fact.

const HANDOFF_MODES = [
  {
    title: "/handoff start",
    body: (
      <>
        Reads <Code>handoff.md</Code> plus <Code>git status</Code>, the last few
        commits and the unpushed count in parallel, then briefs the session.
        Read-only, with exactly one exception: it deletes an emergency snapshot
        after folding it into the briefing. It deliberately never opens the
        archive or <Code>CLAUDE.md</Code> — that is stated token discipline, not
        an oversight.
      </>
    ),
  },
  {
    title: "/handoff wrap",
    body: (
      <>
        Updates the docs, rotates overflow into{" "}
        <Code>handoff-archive.md</Code>, then commits locally. It never pushes,
        and that is enforced in the skill instructions rather than promised in
        marketing copy: <em>&ldquo;Do NOT push.&rdquo;</em>
      </>
    ),
  },
  {
    title: "/handoff save",
    body: (
      <>
        The fire exit, for when context is about to run out: a handful of tool
        calls, no commit, written from what is already in memory. The next{" "}
        <Code>/handoff start</Code> consumes the snapshot and deletes it.
      </>
    ),
  },
  {
    title: "/handoff docs",
    body: (
      <>
        A documentation refresh with no commit — wrap&apos;s update and rotation
        steps, and nothing else.
      </>
    ),
  },
];

export const MdnSkills = () => (
  <Section
    id="mdn-skills"
    // "publish", not "ship in this repo": the site's own .claude/skills/
    // holds three (incl. the unpublished `test`), the public repo holds
    // MDN_COUNT — "this repo" was ambiguous between the two.
    title={`The ${numberWord(MDN_COUNT)} skills we wrote and publish`}
    intro={`${MDN_COUNT} of the ${LISTED_COUNT} entries above are ours, and they are the ones you can obtain: ${joinWithAnd(
      MDN_SKILLS.map((skill) => skill.name)
    )}. They are MIT, they live in this site's own .claude/skills/, and they are what this page was written with.`}
  >
    <div className="flex w-full flex-col gap-10">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Handoff — one skill, {numberWord(HANDOFF_MODES.length)} subcommands
        </h3>
        <p className="mb-6 text-sm md:text-base text-gray-400 leading-relaxed">
          Session continuity, with the guarantee that makes each mode
          trustworthy attached to it.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {HANDOFF_MODES.map((mode) => (
            <CheckItem key={mode.title} title={mode.title}>
              {mode.body}
            </CheckItem>
          ))}
        </div>

        <GlassCard className="mt-8 p-8">
          <h4 className="text-base font-semibold text-white mb-2">
            Why it does not grow unbounded
          </h4>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            <Code>handoff.md</Code> is held to a hard line cap, and overflow
            rotates automatically during wrap: more than two session sections, or
            a file over the cap, moves the oldest sections into{" "}
            <Code>handoff-archive.md</Code>. The archive is append-only and never
            trimmed, so history survives while the file a new session actually
            reads stays small. That is the whole trick — the briefing is cheap
            because the state file is bounded by design.
          </p>
        </GlassCard>
      </div>

      <div className="border-t border-white/[0.06] pt-10">
        <h3 className="text-lg font-semibold text-white mb-2">
          Build KB — a knowledge base out of the repo you already have
        </h3>
        <p className="mb-6 text-sm md:text-base text-gray-400 leading-relaxed">
          It scans the user-facing content already in your repository — README,
          marketing pages, docs, pricing, support — and writes one{" "}
          <Code>knowledge-base.md</Code> organised into fixed sections.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CheckItem title="It never invents content">
            Categories with no source content in the repo are skipped and
            reported as skipped, rather than filled with plausible text. An empty
            section is information; a fabricated one is a liability.
          </CheckItem>
          <CheckItem title="It asks before overwriting your work">
            If <Code>knowledge-base.md</Code> already exists with uncommitted
            changes, it stops and asks first.
          </CheckItem>
        </div>
        <p className="mt-6 text-sm md:text-base text-gray-400 leading-relaxed">
          The output pastes into ChatKit — or into any other chatbot. It is a
          Markdown file, not an export format, and nothing in the skill checks
          whether you have an account here.
        </p>
      </div>

      <GlassCard className="p-8">
        <h3 className="text-lg font-semibold text-white mb-2">
          We run these on this codebase
        </h3>
        <p className="text-sm md:text-base text-gray-300 leading-relaxed">
          Three M.D.N Tech skills sit in this site&apos;s{" "}
          <Code>.claude/skills/</Code>: <Code>handoff</Code>,{" "}
          <Code>build-kb</Code> and <Code>test</Code>. The project&apos;s{" "}
          <Code>CLAUDE.md</Code> opens with an instruction to start every session
          with <Code>/handoff start</Code>. Of those,{" "}
          {numberWord(MDN_COUNT)} are in the public repo; <Code>test</Code> is a
          project runner with no source link, so it
          is described here as proof rather than offered as a download. If you
          want the people behind them,{" "}
          <Link href="/about" className={PROSE_LINK_CLASS}>
            the team that wrote these skills
          </Link>{" "}
          is on the about page.
        </p>
      </GlassCard>
    </div>
  </Section>
);
