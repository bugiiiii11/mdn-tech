import type { ReactNode } from "react";

import { Section } from "@/components/product-pages/primitives";
import { TOOLKIT_REPO } from "@/lib/marketing/links";

import { MDN_COUNT, numberWord } from "./catalogue";
import { Code } from "./inline-code";

// Objection handling written as self-interrogation. These are argued, which is
// why they are prose blocks rather than the accordion below — an accordion is
// for looking something up, and none of this is something a visitor would think
// to search for.
//
// Each answer is an admission checkable in code:
//  - `verified` is true on every catalogue entry and drives one icon, so it
//    cannot mean a verification process.
//  - There is no analytics script, no install counter and no stats fetch
//    anywhere in this codebase, so no adoption number can ever be quoted.
//  - ToolkitSkill has no licence field, so third-party terms are unknown to us.
// Do not soften any of these into a claim.

const objections: { question: string; answer: ReactNode }[] = [
  {
    question: "This is a lead magnet.",
    answer: (
      <>
        It is a page that costs us hosting and earns nothing directly, so the
        suspicion is reasonable. What it is not is a gate: no account, no email
        capture, no modal, no interstitial, nothing to dismiss before you read.
        Every mention of the paid product on this page is a plain text link you
        can ignore, and the skills work identically whether you click one or
        not. If that ever changes — a signup wall, an email-for-download step —
        the page stops being what it says it is, and the copy above stops being
        true.
      </>
    ),
  },
  {
    question: "What does the green check on a card mean?",
    answer: (
      <>
        On the live directory in the portal, each card carries a green check. It
        means editorial selection: a skill we read, evaluated and would use. It
        is not a verification pipeline — there is no test run, no timestamp, no
        published criteria, and the flag is set on every entry in the catalogue
        without exception. A badge that is true of everything tells you nothing,
        which is why this page does not render it at all. The selection is the
        signal; the icon was decoration.
      </>
    ),
  },
  {
    question: "How many people use these?",
    answer: (
      <>
        We do not know. There is no telemetry in the skills, no analytics script
        on this site, no install counter and no GitHub-stats fetch anywhere in
        the codebase — so there is no number for us to quote, and inventing one
        would be trivial and undetectable. That cuts both ways: it is also why
        we cannot show you social proof. Any directory that does publish install
        counts should be asked where the figure came from and what it counts.
      </>
    ),
  },
  {
    question: "Is it MIT?",
    answer: (
      <>
        The M.D.N Tech skills are, and the{" "}
        <a
          href={`${TOOLKIT_REPO}/blob/main/LICENSE`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 transition-colors hover:text-cyan-300"
        >
          LICENSE is in the repo
        </a>{" "}
        where you can read it. For everything else we hold no licence data at
        all: the catalogue has no licence field, so we will not tell you a
        third-party skill&apos;s terms — open the author&apos;s repository and
        check. That is the honest answer and it is also the directory&apos;s
        biggest current gap.
      </>
    ),
  },
  {
    question: "What does it do to my machine?",
    answer: (
      <>
        Our install writes only into <Code>~/.claude/skills/</Code>. It
        overwrites same-named directories without asking, which is why the
        backup command sits above the install command rather than below it.
        There is no daemon, no telemetry and no network call after the{" "}
        <Code>git clone</Code>, and uninstalling is one line. All of that is
        scoped to our {numberWord(MDN_COUNT)} skills: a third-party skill is the
        author&apos;s code and runs under your review, not ours.
      </>
    ),
  },
  {
    question: "Will you keep adding to it?",
    answer: (
      <>
        No cadence is promised. The catalogue is a hand-edited array in the
        codebase — no CMS, no feed, no scheduled job — and it changes when we
        find something we would actually use. We are not going to claim weekly
        updates to look alive: a directory that grows on a schedule is
        optimising for looking maintained rather than for staying short.
      </>
    ),
  },
  {
    question: "Why does a chatbot company publish free developer tools?",
    answer: (
      <>
        The straight answer: Build KB turns a repository into a knowledge base,
        and ChatKit is where some readers will want to paste one. That is the
        whole commercial logic. The skills work fine if you never do — there is
        no upsell inside them, no prompt to sign up, and nothing in the code
        checks whether you have an account. A tool that nags is a tool people
        uninstall.
      </>
    ),
  },
];

export const Objections = () => (
  <Section
    id="objections"
    title="The objections a sceptical developer should raise"
    intro="Written as self-interrogation, because a marketing-allergic audience is right to assume the page is arguing for something. Each of these is answered against the code rather than around it."
  >
    <div className="flex w-full flex-col divide-y divide-white/[0.06] border-y border-white/[0.06]">
      {objections.map((objection) => (
        <div key={objection.question} className="py-7">
          <h3 className="text-lg font-semibold text-white mb-2">
            {objection.question}
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            {objection.answer}
          </p>
        </div>
      ))}
    </div>
  </Section>
);
