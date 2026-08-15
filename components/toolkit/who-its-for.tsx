import Link from "next/link";
import type { ReactNode } from "react";

import {
  CheckItem,
  PROSE_LINK_CLASS,
  Section,
} from "@/components/product-pages/primitives";

import { skillName } from "./catalogue";
import { Code } from "./inline-code";

// Audience qualification, including the disqualification. Ruling people out is
// what makes the ruling-in credible, so the "skip this" column gets the same
// visual weight as the "this will pay off" column.
//
// HONESTY CONSTRAINTS (do not regress):
//  - Every skill named here is resolved through skillName(), so the page can
//    only reference entries that exist in `listed`. A renamed or removed skill
//    surfaces immediately instead of becoming a phantom recommendation.
//  - Caveman's token reduction is the author's reported figure, written as
//    such. We did not measure it.
//  - No personas, no invented companies, no testimonials.

/** The counterpart to CheckItem for the exclusions — same geometry, no tick. */
const SkipItem = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div>
    <h4 className="mb-1.5 flex items-start gap-2 text-base font-semibold text-white">
      <span
        aria-hidden="true"
        className="mt-2 h-px w-4 flex-shrink-0 bg-gray-500"
      />
      {title}
    </h4>
    <p className="pl-6 text-sm text-gray-400 leading-relaxed">{children}</p>
  </div>
);

export const WhoItsFor = () => (
  <Section
    id="who-its-for"
    title="Who these skills are for — and who they are not for"
    intro="Four situations these actually solve, and three where you should close the tab. If none of the first four is yours, the honest answer is that you do not need any of this."
  >
    <div className="flex w-full flex-col gap-10">
      <div>
        <h3 className="text-lg font-semibold text-white mb-6">
          This will pay off if
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CheckItem title="You lose the thread between sessions">
            Long project, context resets, and every morning starts by
            re-explaining the same architecture. {skillName("handoff")} briefs
            the session from a bounded state file and closes it with a commit it
            will never push, and the auto-wrap hooks decide when to close it for
            you.
          </CheckItem>

          <CheckItem title="You are shipping solo with no reviewer">
            {skillName("vercel-web-guidelines")} audits the interface code you
            just wrote, {skillName("webapp-testing")} drives a real browser
            against it, {skillName("code-simplifier")} cleans up behind the
            edit, and {skillName("trailofbits-skills")} is there for the days
            the stakes justify a security pass.
          </CheckItem>

          <CheckItem title="Your Claude Code bill climbs on long sessions">
            {skillName("caveman")} strips narration and filler from responses —
            the author reports roughly a 65% cut in output tokens — and the
            auto-wrap thresholds keep the prompt side under the long-context
            premium rate. Two different halves of the same bill.
          </CheckItem>

          <CheckItem title="You need a chatbot knowledge base from a codebase">
            {skillName("build-kb")} reads the user-facing content already in
            your repo and writes one <Code>knowledge-base.md</Code>. Paste it
            into{" "}
            <Link href="/chatkit" className={PROSE_LINK_CLASS}>
              ChatKit, our AI chatbot for websites
            </Link>
            , or into anything else that accepts Markdown.
          </CheckItem>
        </div>
      </div>

      <div className="border-t border-white/[0.06] pt-10">
        <h3 className="text-lg font-semibold text-white mb-6">Skip this if</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SkipItem title="You use a different assistant">
            Cursor, Windsurf, Copilot and the rest are out of scope. Everything
            here is Claude Code specific: skills install to{" "}
            <Code>~/.claude/skills/</Code> and MCP setup runs through the{" "}
            <Code>claude mcp add</Code> CLI. There is no adapter and we are not
            writing one.
          </SkipItem>

          <SkipItem title="You want to install the lot at once">
            There is no command that installs the catalogue. Ours copies our own
            skills; every third-party entry installs from its author, on the
            author&apos;s terms.
          </SkipItem>

          <SkipItem title="You pick tools by popularity">
            We publish no install counts, no stars and no ratings, because we do
            not collect any. If that is your selection criterion, this list will
            frustrate you — the objections below explain why we would rather
            frustrate you than invent a number.
          </SkipItem>
        </div>
      </div>

      <p className="text-base text-gray-300 leading-relaxed">
        The whole directory is a list, and a list is only useful if it is short
        and someone stands behind each line.
      </p>
    </div>
  </Section>
);
