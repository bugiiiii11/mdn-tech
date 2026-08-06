import { ChevronDown } from 'lucide-react'
import type { ToolkitMCP } from '@/lib/portal/toolkit-skills'
import { Reveal } from './Reveal'
import { CodeBlock } from './CodeBlock'

interface Props {
  mcps: ToolkitMCP[]
}

export function ThirdPartyMCPs({ mcps }: Props) {
  if (mcps.length === 0) return null

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-400/80 mb-3">
              MCP servers
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              Wire in your stack.
            </h2>
            <p className="mt-4 text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Skills teach Claude how to work; MCP servers give it live access to your tools. These are
              the ones we reach for first — copy the command, paste it into Claude Code.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mcps.map((mcp, i) => (
            <Reveal key={mcp.id} delay={0.05 + i * 0.06}>
              <article className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-colors h-full flex flex-col">
                <div className="mb-3">
                  <p className="font-mono text-[11px] text-purple-400/80 uppercase tracking-wider mb-1.5">
                    MCP Server
                  </p>
                  <h3 className="text-lg font-semibold text-white">{mcp.name}</h3>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {mcp.description}
                </p>

                {mcp.connectedServices.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 mb-4">
                    {mcp.connectedServices.map((service) => (
                      <li
                        key={service}
                        className="text-[11px] text-gray-400 bg-white/5 border border-white/5 rounded-full px-2.5 py-0.5"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                )}

                <details className="mt-auto pt-4 border-t border-white/5">
                  <summary className="flex items-center gap-1.5 cursor-pointer select-none list-none text-xs text-purple-400 hover:text-purple-300 [&::-webkit-details-marker]:hidden">
                    <ChevronDown className="w-3.5 h-3.5" />
                    Setup command
                  </summary>
                  <div className="mt-3">
                    <CodeBlock code={mcp.setupGuide} />
                  </div>
                </details>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
