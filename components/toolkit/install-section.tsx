"use client";

import { Fragment, useEffect, useState } from "react";

import { GlassCard, Section } from "@/components/product-pages/primitives";
import { TOOLKIT_REPO } from "@/lib/marketing/links";

import { MDN_SKILLS } from "./catalogue";
import { CodeBlock } from "./code-block";
import { Code } from "./inline-code";

// The install section — the page's conversion event is a paste, not a signup.
//
// Order is deliberate: the generic pattern first (that is what the keyword
// actually asks), then our one-liner. The overwrite warning sits ABOVE the
// command, because a warning underneath an install button is decoration.
//
// HONESTY CONSTRAINTS (do not regress):
//  - The "writes nothing else on disk" promise is scoped to the M.D.N Tech
//    skills. It is not a property of the catalogue, and it is not true of the
//    optional hooks (see the auto-wrap section) or of third-party skills.
//  - Never "installs the directory" or "installs N skills": this command copies
//    one repo's skills/ directory, nothing more.
//  - No timing claim. It is one paste, not a measured 30 seconds.
//
// The two directory names below are derived from the catalogue (the M.D.N Tech
// entries that carry a source link), so the copy tracks the data rather than a
// memory of what the repo contained.

type Shell = "unix" | "windows";

const CLONE_URL = `${TOOLKIT_REPO}.git`;

const installCommands: Record<Shell, string> = {
  unix: `git clone ${CLONE_URL} && \\
  mkdir -p ~/.claude/skills && \\
  cp -r handoff/skills/* ~/.claude/skills/`,
  windows: `git clone ${CLONE_URL}
New-Item -ItemType Directory -Force -Path "$HOME\\.claude\\skills" | Out-Null
Copy-Item -Recurse -Force handoff\\skills\\* "$HOME\\.claude\\skills\\"`,
};

const backupCommands: Record<Shell, string> = {
  unix: "cp -r ~/.claude/skills ~/.claude/skills.bak",
  windows: `Copy-Item -Recurse -Force "$HOME\\.claude\\skills" "$HOME\\.claude\\skills.bak"`,
};

const updateCommands: Record<Shell, string> = {
  unix: "cd handoff && git pull && cp -r skills/* ~/.claude/skills/",
  windows: `cd handoff; git pull; Copy-Item -Recurse -Force skills\\* "$HOME\\.claude\\skills\\"`,
};

const uninstallCommands: Record<Shell, string> = {
  unix: "rm -rf ~/.claude/skills/handoff",
  windows: `Remove-Item -Recurse -Force "$HOME\\.claude\\skills\\handoff"`,
};

const genericCommands: Record<Shell, string> = {
  unix: "mkdir -p ~/.claude/skills/my-skill",
  windows: `New-Item -ItemType Directory -Force -Path "$HOME\\.claude\\skills\\my-skill"`,
};

const shellLabels: Record<Shell, string> = {
  unix: "bash / zsh",
  windows: "PowerShell",
};

const tabs: { id: Shell; label: string }[] = [
  { id: "unix", label: "macOS / Linux" },
  { id: "windows", label: "Windows" },
];

function detectShell(): Shell {
  if (typeof navigator === "undefined") return "unix";
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const platform =
    nav.userAgentData?.platform || navigator.platform || navigator.userAgent || "";
  return /win/i.test(platform) ? "windows" : "unix";
}

export const InstallSection = () => {
  const [shell, setShell] = useState<Shell>("unix");
  const [detected, setDetected] = useState(false);

  // Server renders the unix variant; the tabs make the choice explicit either
  // way, so a wrong guess costs one click and never a wrong command.
  useEffect(() => {
    setShell(detectShell());
    setDetected(true);
  }, []);

  return (
    <Section
      id="install"
      title="How to install a Claude Code skill in one command"
      intro="There is no package manager for skills. Installing one means putting a Markdown file in a directory — which is exactly why every card in the directory below sends you to the author instead of installing for you."
    >
      <div className="flex w-full flex-col gap-10">
        {/* Half 1 — the generic pattern, which is what the question asks. */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            The pattern, for any skill by any author
          </h3>
          <ol className="flex flex-col gap-4 list-none">
            {[
              <Fragment key="1">
                Make the directory:{" "}
                <Code>mkdir -p ~/.claude/skills/&lt;name&gt;</Code>.
              </Fragment>,
              <Fragment key="2">
                Save the author&apos;s <Code>SKILL.md</Code> inside it. One file
                is a complete skill.
              </Fragment>,
              <Fragment key="3">
                Open Claude Code in any project.
              </Fragment>,
              <Fragment key="4">
                Type <Code>/&lt;name&gt;</Code> to verify it registered.
              </Fragment>,
            ].map((step, index) => (
              <li key={index} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#7042f88b] bg-[#7042f815] text-sm font-semibold text-cyan-400"
                >
                  {index + 1}
                </span>
                <p className="pt-1 text-sm md:text-base text-gray-300 leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-5">
            <CodeBlock
              code={genericCommands[shell]}
              label={shellLabels[shell]}
            />
          </div>

          <p className="mt-5 text-sm md:text-base text-gray-400 leading-relaxed">
            That is all any Claude Code skill install is. There is no{" "}
            <Code>claude skills install</Code>, no package manager and no central
            registry — which is why the directory below links out to each
            author&apos;s repository rather than installing anything on their
            behalf.
          </p>
        </div>

        {/* Half 2 — our concrete one-liner. */}
        <div className="border-t border-white/[0.06] pt-10">
          <h3 className="text-lg font-semibold text-white mb-2">
            The one paste for the M.D.N Tech skills
          </h3>
          <p className="mb-5 text-sm md:text-base text-gray-400 leading-relaxed">
            {detected
              ? `Showing the ${shellLabels[shell]} variant based on your browser — switch if that is wrong.`
              : "Pick your shell."}
          </p>

          <div
            role="group"
            aria-label="Shell variant"
            className="mb-4 inline-flex items-center gap-1 rounded-lg border border-[#7042f88b] bg-[#7042f815] p-1"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setShell(tab.id)}
                aria-pressed={shell === tab.id}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  shell === tab.id
                    ? "bg-[#7042f833] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Warning before the command, not after it. */}
          <div className="mb-4 rounded-lg border border-[#7042f88b] bg-[#7042f815] px-5 py-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="font-semibold text-white">Read this first:</span>{" "}
              the copy step replaces same-named skill directories without
              prompting. If you already have skills, back them up before you
              paste.
            </p>
            <div className="mt-3">
              <CodeBlock
                code={backupCommands[shell]}
                label={`${shellLabels[shell]} — backup`}
              />
            </div>
          </div>

          <CodeBlock code={installCommands[shell]} label={shellLabels[shell]} />

          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            Verify by opening Claude Code in any project and typing{" "}
            <Code>/handoff start</Code>.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <GlassCard>
              <h4 className="text-base font-semibold text-white mb-2">
                What it writes
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Only inside <Code>~/.claude/skills/</Code>. The repository&apos;s{" "}
                <Code>skills/</Code> directory is copied in — that is{" "}
                {MDN_SKILLS.map((skill, index) => (
                  <Fragment key={skill.id}>
                    {index > 0 ? " and " : ""}
                    <Code>{skill.id}</Code>
                  </Fragment>
                ))}
                , each a single <Code>SKILL.md</Code>. Nothing else on disk, no
                daemon, no telemetry, no network call after the{" "}
                <Code>git clone</Code>. That promise covers these two skills — it
                is not a claim about the rest of the catalogue, and the optional
                hooks are a separate story.
              </p>
            </GlassCard>

            <GlassCard>
              <h4 className="text-base font-semibold text-white mb-2">
                Inspect before you run it
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Clone the repo, read{" "}
                <Code>handoff/skills/handoff/SKILL.md</Code> — it is plain
                Markdown, and it is the whole skill — then copy the folder
                yourself. You never have to run a script you have not read.
              </p>
              <div className="mt-3">
                <CodeBlock code={`git clone ${CLONE_URL}`} label="clone only" />
              </div>
            </GlassCard>

            <GlassCard>
              <h4 className="text-base font-semibold text-white mb-2">
                Updating
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Additive and idempotent — re-running the install command works
                just as well.
              </p>
              <div className="mt-3">
                <CodeBlock
                  code={updateCommands[shell]}
                  label={shellLabels[shell]}
                />
              </div>
            </GlassCard>

            <GlassCard>
              <h4 className="text-base font-semibold text-white mb-2">
                Uninstalling
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                One line per skill directory. Nothing else to unwind, because
                nothing else was written.
              </p>
              <div className="mt-3">
                <CodeBlock
                  code={uninstallCommands[shell]}
                  label={shellLabels[shell]}
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </Section>
  );
};
