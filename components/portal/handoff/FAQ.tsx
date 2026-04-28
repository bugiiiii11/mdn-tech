import Link from 'next/link'
import { Reveal } from './Reveal'

interface QA {
  q: string
  a: React.ReactNode
}

const qas: QA[] = [
  {
    q: 'What is a Claude Code skill?',
    a: (
      <>
        A skill is a Markdown file (
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          SKILL.md
        </code>
        ) that lives in{' '}
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          ~/.claude/skills/&lt;name&gt;/
        </code>{' '}
        and gives Claude Code a slash command (
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          /name
        </code>
        ) plus instructions for what to do when invoked. Skills are local files — no plugins, no
        registries, no network calls. See{' '}
        <a
          href="https://docs.claude.com/en/docs/claude-code/skills"
          target="_blank"
          rel="noreferrer noopener"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
        >
          Anthropic&apos;s skills docs
        </a>
        .
      </>
    ),
  },
  {
    q: 'Is this safe to install? What does it touch?',
    a: (
      <>
        Only{' '}
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          ~/.claude/skills/
        </code>
        . The install command writes four directories there:{' '}
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          start
        </code>
        ,{' '}
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          wrap
        </code>
        ,{' '}
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          save
        </code>
        ,{' '}
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          doc-update
        </code>
        . Each contains a single{' '}
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          SKILL.md
        </code>{' '}
        file. Nothing else on disk, no daemons, no telemetry, no network calls outside of the{' '}
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          git clone
        </code>{' '}
        from GitHub. The skills themselves only run the commands you see in the SKILL.md files.
      </>
    ),
  },
  {
    q: 'Do I need a paid Claude plan?',
    a: 'No. Skills work on any Claude Code installation, including free-tier accounts. They are local files Claude Code reads — no separate subscription, no API charges beyond your normal Claude Code usage.',
  },
  {
    q: 'What if I already have skills with the same names?',
    a: (
      <>
        Back up first:{' '}
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          cp -r ~/.claude/skills ~/.claude/skills.bak
        </code>{' '}
        before running the install command. The install will overwrite same-named directories
        without prompting. Restore from the backup if you change your mind.
      </>
    ),
  },
  {
    q: 'How do I update?',
    a: (
      <>
        From inside the cloned repo:{' '}
        <code className="font-mono text-purple-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">
          cd handoff && git pull && cp -r skills/* ~/.claude/skills/
        </code>
        . Updates are additive and idempotent — re-running the install command also works.
      </>
    ),
  },
]

export function FAQ() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-400/80 mb-3">
              Frequently asked
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              The questions you&apos;ll ask anyway.
            </h2>
          </div>
        </Reveal>

        <div className="space-y-3">
          {qas.map(({ q, a }, i) => (
            <Reveal key={i} delay={0.04 + i * 0.05}>
            <details
              className="group bg-white/[0.02] border border-white/10 rounded-xl px-5 py-4 hover:border-white/20 transition-colors open:border-purple-500/20 open:bg-white/[0.03]"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-white font-medium select-none">
                <span>{q}</span>
                <span className="flex-shrink-0 w-5 h-5 rounded-full border border-white/10 group-open:border-purple-400 group-open:bg-purple-500/20 flex items-center justify-center transition-colors">
                  <svg
                    className="w-3 h-3 text-gray-400 group-open:text-purple-300 group-open:rotate-180 transition-transform"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 pt-3 border-t border-white/5 text-sm text-gray-400 leading-relaxed">
                {a}
              </div>
            </details>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-gray-500">
          Still curious?{' '}
          <a
            href="https://github.com/bugiiiii11/handoff"
            target="_blank"
            rel="noreferrer noopener"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            Read the full README on GitHub
          </a>{' '}
          or{' '}
          <Link
            href="/portal/signup"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            create a free account
          </Link>{' '}
          to access ChatKit.
        </p>
      </div>
    </section>
  )
}
