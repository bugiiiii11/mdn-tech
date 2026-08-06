'use client'

import { useEffect, useState } from 'react'
import { CodeBlock } from './CodeBlock'
import { Terminal } from 'lucide-react'
import { Reveal } from './Reveal'

type OS = 'unix' | 'windows'

const installCommands: Record<OS, string> = {
  unix: `git clone https://github.com/bugiiiii11/handoff.git && \\
  mkdir -p ~/.claude/skills && \\
  cp -r handoff/skills/* ~/.claude/skills/ && \\
  echo "✓ Installed. Run /handoff start in Claude Code to verify."`,
  windows: `git clone https://github.com/bugiiiii11/handoff.git; \`
  New-Item -ItemType Directory -Force -Path "$HOME\\.claude\\skills" | Out-Null; \`
  Copy-Item -Recurse -Force handoff\\skills\\* "$HOME\\.claude\\skills\\"; \`
  Write-Host "✓ Installed. Run /handoff start in Claude Code to verify."`,
}

const uninstallCommands: Record<OS, string> = {
  unix: 'rm -rf ~/.claude/skills/handoff',
  windows: 'Remove-Item -Recurse -Force "$HOME\\.claude\\skills\\handoff"',
}

const hooksInstallCommands: Record<OS, string> = {
  unix: `mkdir -p .claude/hooks && cp handoff/hooks/*.sh .claude/hooks/`,
  windows: `New-Item -ItemType Directory -Force -Path ".claude\\hooks" | Out-Null; \`
  Copy-Item -Force handoff\\hooks\\*.sh ".claude\\hooks\\"`,
}

const hooksSettingsSnippet = `{
  "hooks": {
    "Stop": [{ "hooks": [{ "type": "command",
      "command": "bash \\"$CLAUDE_PROJECT_DIR/.claude/hooks/auto-wrap.sh\\"", "timeout": 10 }] }],
    "UserPromptSubmit": [{ "hooks": [{ "type": "command",
      "command": "bash \\"$CLAUDE_PROJECT_DIR/.claude/hooks/context-warn.sh\\"", "timeout": 10 }] }]
  }
}`

function detectOS(): OS {
  if (typeof window === 'undefined') return 'unix'
  // userAgentData is the modern, privacy-preserving API; fall back to platform/userAgent
  const navAny = navigator as any
  const platform: string =
    navAny.userAgentData?.platform ||
    navigator.platform ||
    navigator.userAgent ||
    ''
  return /win/i.test(platform) ? 'windows' : 'unix'
}

export function InstallBlock() {
  const [os, setOs] = useState<OS>('unix')
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setOs(detectOS())
    setHasMounted(true)
  }, [])

  return (
    <section id="install" className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-3">
              <Terminal className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
              Install in 30 seconds
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              One command. One skill.
            </h2>
            <p className="text-gray-400 mt-4 text-sm md:text-base">
              Paste into your terminal. We auto-detected{' '}
              <span className="text-purple-300 font-medium">
                {hasMounted ? (os === 'windows' ? 'Windows / PowerShell' : 'macOS / Linux') : 'your shell'}
              </span>{' '}
              — switch tabs if we got it wrong.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
        {/* OS tabs */}
        <div className="inline-flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-lg mb-4">
          <button
            onClick={() => setOs('unix')}
            role="tab"
            aria-selected={os === 'unix'}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
              os === 'unix'
                ? 'bg-purple-500/20 text-white border border-purple-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            macOS / Linux
          </button>
          <button
            onClick={() => setOs('windows')}
            role="tab"
            aria-selected={os === 'windows'}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
              os === 'windows'
                ? 'bg-purple-500/20 text-white border border-purple-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Windows
          </button>
        </div>

        <CodeBlock
          code={installCommands[os]}
          language={os === 'windows' ? 'powershell' : 'bash'}
          label={os === 'windows' ? 'PowerShell' : 'bash / zsh'}
        />

        {/* Verify step */}
        <div className="mt-5 flex items-start gap-3 px-5 py-4 bg-cyan-500/[0.04] border border-cyan-500/20 rounded-lg">
          <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center font-mono">
            ✓
          </span>
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="text-white font-medium">Verify:</span> open Claude Code in any project and type{' '}
            <code className="font-mono text-cyan-300 bg-white/5 px-1.5 py-0.5 rounded text-xs">
              /handoff start
            </code>
            . You&apos;ll see the new skill in the menu.
          </p>
        </div>

        {/* Manual fallback */}
        <details className="mt-5 group">
          <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors py-2 select-none">
            <span className="font-medium">Prefer to inspect first?</span> Install manually →
          </summary>
          <div className="mt-3 px-5 py-4 bg-white/[0.02] border border-white/10 rounded-lg space-y-3 text-sm text-gray-300">
            <p>
              <span className="text-white font-medium">1.</span> Clone the repo:
            </p>
            <CodeBlock code="git clone https://github.com/bugiiiii11/handoff.git" language="bash" />
            <p>
              <span className="text-white font-medium">2.</span> Read the single{' '}
              <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
                SKILL.md
              </code>{' '}
              file at{' '}
              <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
                handoff/skills/handoff/SKILL.md
              </code>
              .
            </p>
            <p>
              <span className="text-white font-medium">3.</span> Copy the skill folder into{' '}
              <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
                ~/.claude/skills/
              </code>{' '}
              (or{' '}
              <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
                $HOME\.claude\skills\
              </code>{' '}
              on Windows).
            </p>
          </div>
        </details>

        {/* Optional: auto-wrap hooks */}
        <details className="mt-3 group">
          <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors py-2 select-none">
            <span className="font-medium">Optional:</span> enable auto-wrap hooks (real context-usage nudges) →
          </summary>
          <div className="mt-3 px-5 py-4 bg-white/[0.02] border border-white/10 rounded-lg space-y-3 text-sm text-gray-300">
            <p>
              Two small bash scripts read the <span className="text-white">real context size</span> from
              the session transcript and nudge a{' '}
              <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
                /handoff wrap
              </code>{' '}
              at 15% of the window (hard nudge at 17%) — before long-context premium pricing kicks in.
              Requires <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">jq</code>{' '}
              and bash (Git Bash on Windows works).
            </p>
            <p>
              <span className="text-white font-medium">1.</span> Copy the hook scripts into your project:
            </p>
            <CodeBlock
              code={hooksInstallCommands[os]}
              language={os === 'windows' ? 'powershell' : 'bash'}
            />
            <p>
              <span className="text-white font-medium">2.</span> Register both hooks in your project&apos;s{' '}
              <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
                .claude/settings.json
              </code>
              :
            </p>
            <CodeBlock code={hooksSettingsSnippet} language="json" />
            <p>
              <span className="text-white font-medium">3.</span> Restart Claude Code — hooks load at
              session start. Tune with{' '}
              <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
                AUTOWRAP_WINDOW / AUTOWRAP_SOFT_PCT / AUTOWRAP_HARD_PCT
              </code>
              .
            </p>
          </div>
        </details>

        {/* Uninstall */}
        <p className="mt-5 text-xs text-gray-500 leading-relaxed">
          <span className="text-gray-400 font-medium">Uninstall in one line:</span>{' '}
          <code className="font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded text-[11px] break-all">
            {uninstallCommands[os]}
          </code>
        </p>
        </Reveal>
      </div>
    </section>
  )
}
