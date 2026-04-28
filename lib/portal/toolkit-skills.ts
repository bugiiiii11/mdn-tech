export type SkillCategory = 'session-management' | 'marketing' | 'testing' | 'safety' | 'design' | 'seo' | 'infrastructure'

export interface ToolkitSkill {
  id: string
  name: string
  category: SkillCategory
  description: string
  author: string
  verified: boolean
  installationUrl?: string
  details: string
  useCases: string[]
}

export interface ToolkitMCP {
  id: string
  name: string
  description: string
  connectedServices: string[]
  setupGuide: string
}

export const toolkitSkills: ToolkitSkill[] = [
  {
    id: 'wrap',
    name: 'Wrap',
    category: 'session-management',
    description: 'Session completion & context saving. Commits changes, updates docs, syncs memory.',
    author: 'M.D.N Tech',
    verified: true,
    details:
      'Essential for long-running projects. Automatically saves session state, commits pending changes, and updates project documentation. Critical for token efficiency — stores context across sessions instead of losing work.',
    useCases: ['End of session cleanup', 'Automatic doc updates', 'Context persistence'],
  },
  {
    id: 'start',
    name: 'Start',
    category: 'session-management',
    description: 'Session initialization & project state review. Reads handoff, checks git status, flags stale items.',
    author: 'M.D.N Tech',
    verified: true,
    details:
      'Kick off any session with full context. Loads project history, displays recent commits, syncs with Mind Palace wiki. Never lose track of where you left off.',
    useCases: ['Session initialization', 'Quick project status', 'Context loading'],
  },
  {
    id: 'cmo',
    name: 'CMO',
    category: 'marketing',
    description: 'Marketing & content strategy. Brand voice, messaging frameworks, campaign planning.',
    author: 'M.D.N Tech',
    verified: true,
    details:
      'Build marketing strategy like a CMO. Handles brand messaging, social content calendars, email campaigns, and competitive positioning. Production-tested across 5+ product launches.',
    useCases: ['Campaign planning', 'Brand messaging', 'Social media strategy'],
  },
  {
    id: 'test',
    name: 'Test',
    category: 'testing',
    description: 'Run lint, type checks, and build verification. Full test suite execution.',
    author: 'M.D.N Tech',
    verified: true,
    details:
      'Comprehensive testing suite. Runs TypeScript type checks, linting, unit tests, and production builds. Catches bugs before deployment.',
    useCases: ['Pre-commit validation', 'CI/CD verification', 'Bug prevention'],
  },
  {
    id: 'security-review',
    name: 'Security Review',
    category: 'safety',
    description: 'Auto-confirmation for safe operations. Prevents destructive changes without approval.',
    author: 'M.D.N Tech',
    verified: true,
    details:
      'Built-in safety gates. Requires explicit confirmation before destructive operations (force push, hard reset, deleting branches). Saves you from accidental data loss.',
    useCases: ['Safe git operations', 'Change validation', 'Destructive operation prevention'],
  },
  {
    id: 'ui-ux-pro-max',
    name: 'UI/UX Pro Max',
    category: 'design',
    description: '50+ design styles, 161 color palettes, component specs. Production-grade UI design.',
    author: 'nextlevelbuilder',
    verified: true,
    installationUrl: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
    details:
      'Complete design system with 161 color palettes, 57 font pairings, and 50+ pre-built component styles. Includes responsive layouts, accessibility guidelines, and design tokens.',
    useCases: ['Component design', 'Design systems', 'UI/UX specification'],
  },
  {
    id: 'seo-audit',
    name: 'SEO Audit',
    category: 'seo',
    description: 'Full website SEO analysis. Crawls pages, detects issues, generates action plan.',
    author: 'AgriciDaniel',
    verified: true,
    installationUrl: 'https://github.com/AgriciDaniel/claude-seo',
    details:
      'Comprehensive SEO evaluation across crawlability, indexability, security, Core Web Vitals, and structured data. Delegates to 6 specialist sub-agents. Generates prioritized action plan.',
    useCases: ['Website optimization', 'Competitive analysis', 'Ranking improvement'],
  },
  {
    id: 'marketing-skills',
    name: 'Marketing Skills',
    category: 'marketing',
    description: 'Marketing skill collection for AI agents — SEO, CRO, copywriting, paid ads, growth.',
    author: 'Corey Haines',
    verified: true,
    installationUrl: 'https://github.com/coreyhaines31/marketingskills',
    details:
      'A library of marketing skills for technical marketers and founders. Includes product-marketing-context, SEO audit, page-CRO, copywriting, paid ads, referral, revops, and growth ideas. MIT licensed.',
    useCases: ['Conversion optimization', 'Copywriting', 'Growth engineering'],
  },
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    category: 'design',
    description: 'Build distinctive web components & pages. Production-grade UI quality.',
    author: 'Anthropic',
    verified: true,
    installationUrl: 'https://github.com/anthropics/skills/tree/main/skills/frontend-design',
    details:
      'Create high-quality frontend interfaces with shadcn/ui components, Tailwind CSS, and custom design patterns. Generates responsive, accessible, production-ready code.',
    useCases: ['Web component building', 'Page layout design', 'UI implementation'],
  },
  {
    id: 'claude-api',
    name: 'Claude API',
    category: 'infrastructure',
    description: 'Build Claude API applications. Prompt caching, tool use, streaming integration.',
    author: 'Anthropic',
    verified: true,
    installationUrl: 'https://github.com/anthropics/skills/tree/main/skills/claude-api',
    details:
      'Complete toolkit for building with Claude API. Includes prompt caching optimization, tool use patterns, model version migration, and streaming setup.',
    useCases: ['API integration', 'AI applications', 'Model optimization'],
  },
]

export const toolkitMCPs: ToolkitMCP[] = [
  {
    id: 'supabase-mcp',
    name: 'Supabase MCP',
    description: 'Database, auth, and real-time integration with Supabase.',
    connectedServices: ['PostgreSQL', 'Authentication', 'Real-time Subscriptions'],
    setupGuide:
      'Add to `.mcp.json`: `{"type": "url", "url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF"}`. OAuth handles authentication.',
  },
  {
    id: 'tradingview-mcp',
    name: 'TradingView MCP',
    description: 'Real-time crypto data, technical indicators, and market analysis.',
    connectedServices: ['BTC/USDT', 'Technical Indicators', 'Market Data'],
    setupGuide:
      'Configure with TradingView API credentials. Provides real-time chart data, EMA/RSI indicators, and volatility metrics.',
  },
  {
    id: 'unity-mcp',
    name: 'Unity MCP',
    description: 'Game development integration for C# scripts and asset management.',
    connectedServices: ['C# Scripting', 'Asset Pipeline', 'Build Automation'],
    setupGuide:
      'Requires Unity 2022+ and Claude Code extension. Enables AI-assisted game development with real-time feedback on scripts and assets.',
  },
]
