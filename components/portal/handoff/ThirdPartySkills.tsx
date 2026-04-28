import { CheckCircle, ExternalLink } from 'lucide-react'
import type { ToolkitSkill } from '@/lib/portal/toolkit-skills'
import { Reveal } from './Reveal'

const categoryLabels: Record<string, string> = {
  'session-management': 'Session Management',
  marketing: 'Marketing',
  testing: 'Testing & QA',
  safety: 'Safety & Validation',
  design: 'Design',
  seo: 'SEO',
  infrastructure: 'Infrastructure',
}

interface Props {
  skills: ToolkitSkill[]
}

export function ThirdPartySkills({ skills }: Props) {
  if (skills.length === 0) return null

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-3">
              Curated skills
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              Skills we use in production.
            </h2>
            <p className="mt-4 text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Battle-tested skills from Anthropic and the broader Claude Code ecosystem. Each has
              shipped real work for us — no curation theater.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill, i) => (
            <Reveal key={skill.id} delay={0.05 + i * 0.06}>
              <article className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-colors h-full">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-[11px] text-cyan-400/80 uppercase tracking-wider mb-1.5">
                      {categoryLabels[skill.category] || skill.category}
                    </p>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      {skill.name}
                      {skill.verified && <CheckCircle className="w-4 h-4 text-green-400" />}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {skill.description}
                </p>

                {skill.useCases.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 mb-4">
                    {skill.useCases.slice(0, 3).map((useCase) => (
                      <li
                        key={useCase}
                        className="text-[11px] text-gray-400 bg-white/5 border border-white/5 rounded-full px-2.5 py-0.5"
                      >
                        {useCase}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
                  <span className="text-gray-500">By {skill.author}</span>
                  {skill.installationUrl && (
                    <a
                      href={skill.installationUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                    >
                      Source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
