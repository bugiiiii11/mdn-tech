import { GlassCard, Section } from "@/components/product-pages/primitives";

import { CodeBlock } from "./code-block";
import { Code } from "./inline-code";

// The auto-wrap hooks — the most technically differentiated thing on the page.
//
// NUMBERS ARE PROSE ON PURPOSE. The 20% soft threshold, the 22% hard threshold
// and the 1,000,000-token default window are shell defaults in
// .claude/hooks/auto-wrap.sh (AUTOWRAP_SOFT_PCT / AUTOWRAP_HARD_PCT /
// AUTOWRAP_WINDOW). There is no TypeScript constant to import, so a future edit
// must not manufacture one — change these strings only when the shell defaults
// change.
//
// THE TWO RUNGS ARE NOT THE SAME ACTION (do not flatten): soft = checkpoint,
// `/handoff docs`, no commit, the session keeps going. Hard = the full wrap,
// which ends the session. They were identical until the skill split them,
// because a soft nudge that ends the session mid-task just gets ignored.
//
// HONESTY CONSTRAINT (do not regress): there is NO long-context premium rate on
// current Claude models — Opus 5/4.8/4.7/4.6 bill $5/$25 flat across the whole
// 1M window, Sonnet 5 $3/$15, Fable 5 $10/$50, Haiku 4.5 $1/$5 at 200K. Earlier
// copy on this page claimed wrapping early kept you under such a rate. It does
// not exist. The real reason to wrap early is answer quality at long context —
// never re-frame this section around price.
//
// HONESTY CONSTRAINT (do not regress): "zero dependencies" is true of the
// SKILL.md files and false of the hooks, which need jq and bash. The cost card
// below carries the same visual weight as the benefit card for that reason, and
// nothing is wired up by the skill install.

const hooksCopyCommand =
  "mkdir -p .claude/hooks && cp handoff/hooks/*.sh .claude/hooks/";

const hooksSettingsSnippet = `{
  "hooks": {
    "Stop": [{ "hooks": [{ "type": "command",
      "command": "bash \\"$CLAUDE_PROJECT_DIR/.claude/hooks/auto-wrap.sh\\"", "timeout": 10 }] }],
    "UserPromptSubmit": [{ "hooks": [{ "type": "command",
      "command": "bash \\"$CLAUDE_PROJECT_DIR/.claude/hooks/context-warn.sh\\"", "timeout": 10 }] }]
  }
}`;

export const AutoWrap = () => (
  <Section
    id="auto-wrap"
    title="Auto-wrap hooks: measuring real context instead of guessing"
    intro="A long session does not fail loudly. Recall gets patchier and answers get vaguer as the prompt grows, and the moment you notice is well past the moment it started. These two optional hooks decide when to checkpoint by measuring the real prompt size, not estimating it."
  >
    <div className="flex w-full flex-col gap-8">
      <GlassCard className="p-8">
        <h3 className="text-lg font-semibold text-white mb-3">
          What it reads
        </h3>
        <p className="text-base text-gray-300 leading-relaxed">
          A Stop hook and a <Code>UserPromptSubmit</Code> hook read the session
          transcript and sum <Code>input_tokens</Code>,{" "}
          <Code>cache_creation_input_tokens</Code> and{" "}
          <Code>cache_read_input_tokens</Code> from the last assistant message.
          That total is the exact prompt size of the most recent API call — the
          system prompt, <Code>CLAUDE.md</Code>, every loaded skill, every file
          read this session. Most context warnings guess from message counts or
          transcript byte size, which is meaningless once the window is a
          million tokens wide.
        </p>
        <p className="mt-4 text-base text-gray-300 leading-relaxed">
          The two thresholds ask for different things. At 20% of the window a
          soft nudge asks for a <em>checkpoint</em>: run{" "}
          <Code>/handoff docs</Code>, write the state file, commit nothing, keep
          working. At 22% the hard nudge asks for the full wrap — stop new work
          and end the session. Splitting them is the point: a soft nudge that
          ended the session mid-task only ever got ignored, and a checkpoint
          costs about two tool calls, so it can always be obeyed.
        </p>
        <p className="mt-4 text-base text-gray-300 leading-relaxed">
          The assumed window defaults to 1,000,000 tokens, and all three values
          are environment variables: <Code>AUTOWRAP_WINDOW</Code>,{" "}
          <Code>AUTOWRAP_SOFT_PCT</Code> and <Code>AUTOWRAP_HARD_PCT</Code>.
          Each threshold fires at most once per session, so a hook can nudge you
          but cannot trap you in a loop. A hook cannot compact or discard
          context either — it is an instruction to the model, nothing more, so
          firing one never costs you anything.
        </p>
      </GlassCard>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <GlassCard className="p-8">
          <h3 className="text-lg font-semibold text-white mb-2">
            What it buys you
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            A session that ends deliberately instead of degrading. State reaches
            the file while the model is still sharp enough to summarise it well,
            and unfinished work lands in the next-steps table as something
            resumable rather than a note saying &ldquo;continue this&rdquo;. The
            thresholds are low on purpose: they mark the point where wrapping is
            still cheap, not the point where the window is full.
          </p>
        </GlassCard>

        <GlassCard className="p-8">
          <h3 className="text-lg font-semibold text-white mb-2">
            What it costs you
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Two dependencies and a manual step. The hooks are shell scripts:
            they need <Code>jq</Code> and bash, which on Windows means Git Bash.
            They are opt-in and separate — you copy the <Code>.sh</Code> files
            into your project&apos;s <Code>.claude/hooks/</Code> and register
            them in your own <Code>settings.json</Code>. The skill install wires
            up nothing. &ldquo;No dependencies&rdquo; is true of the{" "}
            <Code>SKILL.md</Code> files and not of these.
          </p>
        </GlassCard>
      </div>

      <div className="flex w-full flex-col gap-4">
        <CodeBlock code={hooksCopyCommand} label="bash — copy the scripts" />
        <CodeBlock
          code={hooksSettingsSnippet}
          label=".claude/settings.json — register them"
        />
      </div>
    </div>
  </Section>
);
