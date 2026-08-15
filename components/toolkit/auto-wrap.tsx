import { GlassCard, Section } from "@/components/product-pages/primitives";

import { CodeBlock } from "./code-block";
import { Code } from "./inline-code";

// The auto-wrap hooks — the most technically differentiated thing on the page.
//
// NUMBERS ARE PROSE ON PURPOSE. The 15% soft threshold, the 17% hard threshold
// and the 1,000,000-token default window are shell defaults in
// .claude/hooks/auto-wrap.sh (AUTOWRAP_SOFT_PCT / AUTOWRAP_HARD_PCT /
// AUTOWRAP_WINDOW). There is no TypeScript constant to import, so a future edit
// must not manufacture one — change these strings only when the shell defaults
// change.
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
    intro="Past a certain prompt size, requests bill at Claude's long-context premium rate. Wrapping the session before that line is the cheapest optimisation available to a long-running project — and these two optional hooks decide when by measuring, not estimating."
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
          A soft nudge fires at 15% of the window and a hard stop at 17%. The
          assumed window defaults to 1,000,000 tokens, and all three values are
          environment variables:{" "}
          <Code>AUTOWRAP_WINDOW</Code>, <Code>AUTOWRAP_SOFT_PCT</Code> and{" "}
          <Code>AUTOWRAP_HARD_PCT</Code>. Each threshold fires at most once per
          session, so a hook can nudge you but cannot trap you in a loop.
        </p>
      </GlassCard>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <GlassCard className="p-8">
          <h3 className="text-lg font-semibold text-white mb-2">
            What it buys you
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            A session that ends deliberately instead of degrading. The wrap
            writes the state file and commits locally before the context gets
            expensive, so the next session starts small and the premium rate
            never gets a chance to apply. The thresholds are low on purpose:
            they are set to the point where wrapping is still cheap, not the
            point where the window is full.
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
