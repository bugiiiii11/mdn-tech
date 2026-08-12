import Link from "next/link";

import { GlassCard, Section } from "@/components/product-pages/primitives";

import { Code } from "./inline-code";

// Definitional first fold: owns "what is a Claude Code skill" and gives a
// first-time reader the mental model before anything is pitched.
//
// Every fact here is checkable against the reader's own machine — a skill is a
// file, the directory is ~/.claude/skills/, the command is the directory name.
// The four-way comparison exists because SKILL.md, CLAUDE.md, MCP servers and
// hooks get conflated constantly; each row points at the section that covers it,
// so the page reads as a route rather than a list.

// The four things people conflate. Each maps to a later section id.
const distinctions = [
  {
    term: "SKILL.md",
    body: "A Markdown file of instructions plus the slash command that invokes them. Local, inert until you type the command.",
    href: "#install",
    hrefLabel: "How to install one",
  },
  {
    term: "CLAUDE.md",
    body: "Always-on project context, loaded every session whether you ask for it or not. Not a command — a standing brief.",
    href: "#mdn-skills",
    hrefLabel: "How we use it here",
  },
  {
    term: "MCP server",
    body: "A separate service Claude connects to over a transport so it can reach systems a local file cannot. Usually needs credentials.",
    href: "#mcp-servers",
    hrefLabel: "Setup commands",
  },
  {
    term: "Hooks",
    body: "Shell scripts the harness runs on lifecycle events — session stop, prompt submit — with no model involvement at all.",
    href: "#auto-wrap",
    hrefLabel: "The auto-wrap hooks",
  },
];

export const WhatIsASkill = () => (
  <Section
    id="what-is-a-skill"
    title="What a Claude Code skill actually is"
    intro="A skill is a Markdown file on your machine. That single fact explains most of this page: why there is no registry, no install counter, no account, and why every card in the directory below sends you somewhere else."
  >
    <div className="flex w-full flex-col gap-6">
      <GlassCard className="p-8">
        <h3 className="text-lg font-semibold text-white mb-3">
          A file, and the slash command it registers
        </h3>
        <p className="text-base text-gray-300 leading-relaxed">
          A skill is a <Code>SKILL.md</Code> file living in{" "}
          <Code>~/.claude/skills/&lt;name&gt;/</Code>. Claude Code reads the
          directory, registers a <Code>/name</Code> slash command, and follows
          the instructions in the file when you invoke it. There is no plugin
          runtime, no registry to publish to, no account, and no network call
          involved in using one — the model is reading a file you can open in
          any editor.
        </p>
        <p className="mt-4 text-sm text-gray-400 leading-relaxed">
          Anthropic documents the format in the{" "}
          <a
            href="https://docs.claude.com/en/docs/claude-code/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            Claude Code skills reference
          </a>
          . If you are new to the tool itself, start with{" "}
          <Link
            href="/blog/claude-code-complete-guide"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            our complete guide to Claude Code
          </Link>
          .
        </p>
      </GlassCard>

      <GlassCard className="p-8">
        <h3 className="text-lg font-semibold text-white mb-3">
          Personal scope, project scope
        </h3>
        <p className="text-base text-gray-300 leading-relaxed">
          <Code>~/.claude/skills/</Code> is personal: those skills are available
          in every project on your machine. A repository&apos;s own{" "}
          <Code>.claude/skills/</Code> ships with the codebase, so the skill
          travels with the work and every contributor gets it on clone. This
          site&apos;s repo carries three that way — <Code>handoff</Code>,{" "}
          <Code>build-kb</Code> and <Code>test</Code> — and its{" "}
          <Code>CLAUDE.md</Code> instructs every session to open with{" "}
          <Code>/handoff start</Code>.
        </p>
      </GlassCard>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Four things that get conflated
        </h3>
        <dl className="flex flex-col divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {distinctions.map((item) => (
            <div
              key={item.term}
              className="flex flex-col gap-1.5 py-5 sm:flex-row sm:gap-8"
            >
              <dt className="w-full shrink-0 font-mono text-sm text-purple-200 sm:w-44">
                {item.term}
              </dt>
              <dd className="text-sm md:text-base text-gray-400 leading-relaxed">
                {item.body}{" "}
                <a
                  href={item.href}
                  className="whitespace-nowrap text-cyan-400 transition-colors hover:text-cyan-300"
                >
                  {item.hrefLabel} ↓
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="text-base text-gray-300 leading-relaxed">
        None of this needs a paid Claude plan. Skills work on free-tier Claude
        Code, because they are files the model reads rather than a subscription
        feature someone switches on for you.
      </p>
    </div>
  </Section>
);
