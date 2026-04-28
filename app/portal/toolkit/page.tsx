export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { PortalShell } from '@/components/portal/PortalShell'
import { HandoffHero } from '@/components/portal/handoff/HandoffHero'
import { WhatIsIt } from '@/components/portal/handoff/WhatIsIt'
import { InstallBlock } from '@/components/portal/handoff/InstallBlock'
import { SkillCards } from '@/components/portal/handoff/SkillCards'
import { PlanKitTeaser } from '@/components/portal/handoff/PlanKitTeaser'
import { ThirdPartySkills } from '@/components/portal/handoff/ThirdPartySkills'
import { FAQ } from '@/components/portal/handoff/FAQ'
import { toolkitSkills } from '@/lib/portal/toolkit-skills'

// MVP: hide M.D.N Tech-only auxiliary skills (CMO, Test, Security Review, plus
// the legacy /start and /wrap entries which the new Handoff card replaces).
// They stay in the data file; only the visible gallery is filtered.
const HIDDEN_SKILL_IDS = new Set([
  'wrap',
  'start',
  'cmo',
  'test',
  'security-review',
])

export const metadata: Metadata = {
  title: 'Handoff — Claude Code workflow skills | M.D.N Tech',
  description:
    'Four free skills that make Claude Code remember your project across sessions. One-line install, MIT licensed.',
}

export default function ToolKitPage() {
  const visibleThirdPartySkills = toolkitSkills.filter(
    (s) => !HIDDEN_SKILL_IDS.has(s.id),
  )

  return (
    <PortalShell variant="marketing">
      <HandoffHero />
      <WhatIsIt />
      <InstallBlock />
      <SkillCards />
      <PlanKitTeaser />
      <ThirdPartySkills skills={visibleThirdPartySkills} />
      <FAQ />

      <footer className="py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            <span className="text-gray-400">M.D.N Tech</span> · Built for Claude Code developers.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/bugiiiii11/handoff"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-purple-300 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/bugiiiii11/handoff/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-purple-300 transition-colors"
            >
              MIT License
            </a>
            <a
              href="https://github.com/bugiiiii11/handoff/issues"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-purple-300 transition-colors"
            >
              Report an issue
            </a>
          </div>
        </div>
      </footer>
    </PortalShell>
  )
}
