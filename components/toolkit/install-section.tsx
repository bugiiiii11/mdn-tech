"use client";

import { Fragment, useEffect, useState } from "react";

import { GlassCard, Section } from "@/components/product-pages/primitives";
import { TOOLKIT_REPO } from "@/lib/marketing/links";

import { MDN_COUNT, MDN_SKILLS, numberWord } from "./catalogue";
import { CodeBlock } from "./code-block";
import { Code } from "./inline-code";

// The install section — the page's conversion event is a paste, not a signup.
//
// Order is deliberate: the generic pattern first (that is what the keyword
// actually asks), then our one-liner. The overwrite warning sits ABOVE the
// command, because a warning underneath an install button is decoration.
//
// HONESTY CONSTRAINTS (do not regress):
//  - The footprint promise is "a git clone in your current directory, plus
//    files under ~/.claude/skills/ — nothing else". Never shrink it back to
//    "only inside ~/.claude/skills/": the install command visibly clones a
//    full repository into the working directory, and the uninstall commands
//    must keep removing BOTH the skill directories and that clone.
//  - The promise is scoped to the M.D.N Tech skills. It is not a property of
//    the catalogue, and it is not true of the optional hooks (see the
//    auto-wrap section) or of third-party skills.
//  - Never "installs the directory" or "installs N skills": this command copies
//    one repo's skills/ directory, nothing more.
//  - No timing claim. It is one paste, not a measured 30 seconds.
//
// The skill directory names and count are derived from the catalogue (the
// M.D.N Tech entries that carry a source link), so the copy and the uninstall
// commands track the data rather than a memory of what the repo contained.

type Shell = "unix" | "windows";

const CLONE_URL = `${TOOLKIT_REPO}.git`;

// The directory `git clone` creates — the repository name, derived from the
// same URL the command uses so the two cannot disagree.
const CLONE_DIR = TOOLKIT_REPO.split("/").pop() ?? "handoff";

const SKILL_DIR_IDS = MDN_SKILLS.map((skill) => skill.id);

const installCommands: Record<Shell, string> = {
  unix: `git clone ${CLONE_URL} && \\
  mkdir -p ~/.claude/skills && \\
  cp -r ${CLONE_DIR}/skills/* ~/.claude/skills/`,
  windows: `git clone ${CLONE_URL}
New-Item -ItemType Directory -Force -Path "$HOME\\.claude\\skills" | Out-Null
Copy-Item -Recurse -Force ${CLONE_DIR}\\skills\\* "$HOME\\.claude\\skills\\"`,
};

const backupCommands: Record<Shell, string> = {
  unix: "cp -r ~/.claude/skills ~/.claude/skills.bak",
  windows: `Copy-Item -Recurse -Force "$HOME\\.claude\\skills" "$HOME\\.claude\\skills.bak"`,
};

const updateCommands: Record<Shell, string> = {
  unix: `cd ${CLONE_DIR} && git pull && cp -r skills/* ~/.claude/skills/`,
  windows: `cd ${CLONE_DIR}; git pull; Copy-Item -Recurse -Force skills\\* "$HOME\\.claude\\skills\\"`,
};

// Removes everything the install created: every skill directory AND the
// clone. Dropping either half regresses the "how do I undo it" promise.
const uninstallCommands: Record<Shell, string> = {
  unix: `rm -rf ${SKILL_DIR_IDS.map((id) => `~/.claude/skills/${id}`).join(
    " "
  )} && \\
  rm -rf ${CLONE_DIR}`,
  windows: `Remove-Item -Recurse -Force ${SKILL_DIR_IDS.map(
    (id) => `"$HOME\\.claude\\skills\\${id}"`
  ).join(", ")}
Remove-Item -Recurse -Force ${CLONE_DIR}`,
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
  // True only while the current value came from browser detection — a manual
  // tab click clears it, so the sentence above the command never claims a
  // browser guess the visitor overrode.
  const [detected, setDetected] = useState(false);

  // Server renders the unix variant; detection swaps it after hydration, and
  // the "Showing the … variant" sentence directly above the command block
  // names the result, so the swap explains itself where it happens. The tabs
  // make the choice explicit either way — a wrong guess costs one click and
  // never a wrong command.
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

          <div id="generic-command" className="mt-5">
            <CodeBlock
              code={genericCommands[shell]}
              label={shellLabels[shell]}
            />
          </div>

          <p className="mt-5 text-sm md:text-base text-gray-400 leading-relaxed">
            That is all any Claude Code skill install is. There is no{" "}
            <Code>claude skills install</Code>, no package manager and no
            central registry for bare <Code>SKILL.md</Code> files — a few
            catalogue entries ship as packaged plugins through the official
            marketplace instead — which is why the directory below links out to
            each author&apos;s repository rather than installing anything on
            their behalf.
          </p>
        </div>

        {/* Half 2 — our concrete one-liner. */}
        <div className="border-t border-white/[0.06] pt-10">
          <h3 className="text-lg font-semibold text-white mb-4">
            The one paste for the M.D.N Tech skills
          </h3>

          <div
            role="group"
            aria-label="Shell variant"
            className="mb-4 inline-flex items-center gap-1 rounded-lg border border-[#7042f88b] bg-[#7042f815] p-1"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                // A manual pick clears `detected` so the sentence below stops
                // attributing the choice to browser detection.
                onClick={() => {
                  setShell(tab.id);
                  setDetected(false);
                }}
                aria-pressed={shell === tab.id}
                // Every block the toggle swaps, not just the main install
                // command — otherwise the other four change silently.
                aria-controls="generic-command install-commands backup-command update-command uninstall-command"
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
              the copy step overwrites same-named files inside your existing
              skill directories without prompting — and files an older version
              left behind survive the merge. If you already have skills, back
              them up before you paste.
            </p>
            <div id="backup-command" className="mt-3">
              <CodeBlock
                code={backupCommands[shell]}
                label={`${shellLabels[shell]} — backup`}
              />
            </div>
          </div>

          {/* The live region the toggle buttons point at. The "Showing the …
              variant" sentence sits directly above the command it describes,
              so both the post-hydration detection swap and a toggle click are
              self-explaining in place — and aria-live announces the change
              without renaming the buttons mid-press. */}
          <div id="install-commands" aria-live="polite">
            <p className="mb-3 text-sm md:text-base text-gray-400 leading-relaxed">
              {detected
                ? `Showing the ${shellLabels[shell]} variant, guessed from your browser — switch above if that is wrong.`
                : `Showing the ${shellLabels[shell]} variant.`}
            </p>
            <CodeBlock
              code={installCommands[shell]}
              label={shellLabels[shell]}
            />
          </div>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            Verify by opening Claude Code in any project and typing{" "}
            <Code>/handoff start</Code>.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <GlassCard>
              <h4 className="text-base font-semibold text-white mb-2">
                What it writes
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                A git clone in your current directory, plus files under{" "}
                <Code>~/.claude/skills/</Code> — nothing else. The clone&apos;s{" "}
                <Code>skills/</Code> directory is copied in — that is{" "}
                {/* joinWithAnd() semantics kept in JSX so each id stays a
                    <Code> span: ", " between items, " and " before the last. */}
                {MDN_SKILLS.map((skill, index) => (
                  <Fragment key={skill.id}>
                    {index > 0
                      ? index === MDN_SKILLS.length - 1
                        ? " and "
                        : ", "
                      : ""}
                    <Code>{skill.id}</Code>
                  </Fragment>
                ))}
                , each a single <Code>SKILL.md</Code>. No daemon, no telemetry,
                no network call after the <Code>git clone</Code>. That promise
                covers these {numberWord(MDN_COUNT)} skills — it is not a claim
                about the rest of the catalogue, and the optional hooks are a
                separate story.
              </p>
            </GlassCard>

            <GlassCard>
              <h4 className="text-base font-semibold text-white mb-2">
                Inspect before you run it
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
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
              <p className="text-sm text-gray-300 leading-relaxed">
                Pull the clone and re-copy — the command below does both.
                Re-running the install command only works after you remove the
                old clone: <Code>git clone</Code> refuses to write into a
                directory that already exists.
              </p>
              <div id="update-command" className="mt-3">
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
              <p className="text-sm text-gray-300 leading-relaxed">
                Two removals: the skill directories under{" "}
                <Code>~/.claude/skills/</Code>, and the clone the install step
                left in your working directory. After that there is nothing
                else to unwind.
              </p>
              <div id="uninstall-command" className="mt-3">
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
