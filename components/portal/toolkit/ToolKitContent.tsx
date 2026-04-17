'use client'

import { useState } from 'react'
import { toolkitSkills, toolkitMCPs, type ToolkitSkill, type ToolkitMCP } from '@/lib/portal/toolkit-skills'
import { Copy, CheckCircle, Zap } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  'session-management': 'Session Management',
  'marketing': 'Marketing',
  'testing': 'Testing & QA',
  'safety': 'Safety & Validation',
  'design': 'Design',
  'seo': 'SEO',
  'infrastructure': 'Infrastructure',
}

export function ToolKitContent({
  skills,
  mcps,
  categoryLabels: labels,
}: {
  skills: ToolkitSkill[]
  mcps: ToolkitMCP[]
  categoryLabels: Record<string, string>
}) {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2">ToolKit</h1>
        <p className="text-gray-400">
          Production-ready skills and integrations for Claude Code. Build faster, ship smarter.
        </p>
        <p className="text-sm text-gray-500 mt-3">
          From idea to production-ready systems — faster, smarter, secure
        </p>
      </div>

      {/* Skills Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Claude Code Skills</h2>
        <p className="text-gray-400 text-sm mb-6">
          Verified skills we use in production. Each skill is tested and documented.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} categoryLabels={labels} />
          ))}
        </div>
      </div>

      {/* MCP Servers Section */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">MCP Integrations</h2>
        <p className="text-gray-400 text-sm mb-6">
          Model Context Protocol servers connecting Claude Code to external services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mcps.map((mcp) => (
            <MCPCard key={mcp.id} mcp={mcp} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Ready to build your first project?
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Combine these skills with ChatKit and SignaKit to ship production apps faster than ever.
          </p>
          <a
            href="/portal/chatkit"
            className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Create Your First Chatbot
          </a>
        </div>
      </div>
    </div>
  )
}

function SkillCard({
  skill,
  categoryLabels: labels,
}: {
  skill: ToolkitSkill
  categoryLabels: Record<string, string>
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = `Claude Code Skill: ${skill.name}\n\nDescription: ${skill.description}\n\nInstall: Check ToolKit section in app.mdntech.org`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const categoryLabel = labels[skill.category]

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-purple-500/50 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-white">{skill.name}</h3>
            {skill.verified && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
          <p className="text-xs font-medium text-purple-400 uppercase">{categoryLabel}</p>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded hover:bg-white/10 transition-colors"
          title="Copy skill info"
        >
          {copied ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
          )}
        </button>
      </div>

      <p className="text-sm text-gray-400 mb-4">{skill.description}</p>

      <div className="space-y-3 text-xs">
        <div>
          <p className="text-gray-500 mb-1">Use cases:</p>
          <ul className="flex flex-wrap gap-2">
            {skill.useCases.map((useCase) => (
              <li key={useCase} className="bg-white/5 px-2 py-1 rounded text-gray-300">
                {useCase}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-gray-500">
          <span className="text-gray-400 font-medium">By:</span> {skill.author}
        </p>
      </div>
    </div>
  )
}

function MCPCard({ mcp }: { mcp: ToolkitMCP }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-cyan-500/50 transition-all">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-cyan-400" />
        <h3 className="font-semibold text-white">{mcp.name}</h3>
      </div>

      <p className="text-sm text-gray-400 mb-4">{mcp.description}</p>

      <div className="space-y-3 text-xs">
        <div>
          <p className="text-gray-500 mb-2">Connected services:</p>
          <ul className="space-y-1">
            {mcp.connectedServices.map((service) => (
              <li key={service} className="flex items-center gap-2 text-gray-300">
                <span className="w-1 h-1 rounded-full bg-cyan-400" />
                {service}
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-3 border-t border-white/5">
          <p className="text-gray-500 mb-2">Setup:</p>
          <p className="text-gray-400 leading-relaxed">{mcp.setupGuide}</p>
        </div>
      </div>
    </div>
  )
}
