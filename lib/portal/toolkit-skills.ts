export type SkillCategory =
  | 'session-management'
  | 'marketing'
  | 'testing'
  | 'safety'
  | 'design'
  | 'seo'
  | 'infrastructure'
  | 'development'
  | 'security'
  | 'documents'
  | 'productivity'

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
    id: 'handoff',
    name: 'Handoff',
    category: 'session-management',
    description: 'Full session lifecycle in one skill: /handoff start, wrap, save, docs. Optional auto-wrap hooks included.',
    author: 'M.D.N Tech',
    verified: true,
    installationUrl: 'https://github.com/bugiiiii11/handoff/blob/main/skills/handoff/SKILL.md',
    details:
      'One skill, four subcommands. start reads a hard-capped handoff.md and briefs the session; wrap updates docs, rotates history to an archive, and commits locally (never pushes unasked); save is a fire-exit snapshot before context runs out; docs refreshes documentation without a commit. Ships with optional hooks that measure real context usage from the transcript and nudge a wrap at 15% / 17% of the window.',
    useCases: ['Session briefing', 'Context persistence', 'Auto-wrap before the long-context price cliff'],
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
    id: 'build-kb',
    name: 'Build KB',
    category: 'marketing',
    description: 'Scan your project and generate a chatbot-ready knowledge-base.md in one shot.',
    author: 'M.D.N Tech',
    verified: true,
    installationUrl: 'https://github.com/bugiiiii11/handoff/blob/main/skills/build-kb/SKILL.md',
    details:
      'Reads the user-facing content in your repo (README, marketing pages, docs, pricing, support) and organizes it into eight chatbot-friendly sections: General, About, Products, FAQ, Policies, Tone, Pricing, Support. Skips categories that lack source content -- never invents. Output is one knowledge-base.md ready to paste into ChatKit (or any chatbot) as KB entries.',
    useCases: ['Chatbot knowledge base', 'Content audit', 'ChatKit onboarding'],
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
  {
    id: 'karpathy-claude-md',
    name: 'Karpathy Guidelines',
    category: 'safety',
    description: 'CLAUDE.md guidelines derived from Andrej Karpathy\'s observations on LLM coding pitfalls.',
    author: 'multica-ai',
    verified: true,
    installationUrl: 'https://github.com/multica-ai/andrej-karpathy-skills',
    details:
      'A single CLAUDE.md file with four principles -- Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution -- that directly counter the common LLM failure modes Karpathy flagged: wrong assumptions, bloated abstractions, dead-code accumulation, and orthogonal edits.',
    useCases: ['Reduce overcomplication', 'Prevent dead code', 'Clearer goal scoping'],
  },
  {
    id: 'superpowers',
    name: 'Superpowers',
    category: 'development',
    description: 'Composable dev workflow: brainstorm, plan, subagents, and test-driven development in one framework.',
    author: 'obra',
    verified: true,
    installationUrl: 'https://github.com/obra/superpowers',
    details:
      'The most-adopted community skill library. Wraps a full software methodology -- structured brainstorming, spec and plan writing, subagent orchestration, TDD, and review-before-merge -- into composable skills Claude Code invokes as the work demands. MIT licensed; installs from the official plugin marketplace.',
    useCases: ['End-to-end workflow', 'Subagent orchestration', 'Test-driven development'],
  },
  {
    id: 'code-simplifier',
    name: 'Code Simplifier',
    category: 'development',
    description: 'Cleans up recently changed code for readability without altering behavior.',
    author: 'Anthropic',
    verified: true,
    installationUrl: 'https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-simplifier',
    details:
      'An official Anthropic plugin that takes freshly written or modified code and makes it simpler and clearer -- following your project conventions -- without changing what it does. Install from the official marketplace: /plugin install code-simplifier@claude-plugins-official.',
    useCases: ['Readability cleanup', 'Convention alignment', 'Post-edit polish'],
  },
  {
    id: 'vercel-web-guidelines',
    name: 'Vercel Web Interface Guidelines',
    category: 'design',
    description: 'Audits UI code against 100+ accessibility and UX rules from Vercel.',
    author: 'Vercel Labs',
    verified: true,
    installationUrl: 'https://github.com/vercel-labs/agent-skills/tree/main/web-design-guidelines',
    details:
      'Checks your interface code against Vercel\'s design guidelines -- accessibility, interaction, layout, and UX heuristics -- and returns a specific list of violations to fix. Part of vercel-labs/agent-skills, which also ships React-best-practices and composition-patterns skills.',
    useCases: ['Accessibility audit', 'UX review', 'Interface QA'],
  },
  {
    id: 'webapp-testing',
    name: 'Webapp Testing',
    category: 'testing',
    description: 'Drive a real browser via Playwright to test local web apps end-to-end.',
    author: 'Anthropic',
    verified: true,
    installationUrl: 'https://github.com/anthropics/skills/tree/main/skills/webapp-testing',
    details:
      'An official Anthropic skill that lets Claude Code exercise a running local app in a real browser -- clicking, filling forms, and asserting behavior -- to verify its own UI changes instead of guessing. Pairs naturally with the Playwright MCP.',
    useCases: ['End-to-end testing', 'UI verification', 'Regression checks'],
  },
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    category: 'infrastructure',
    description: 'Web scraping, search, and browser automation for agents at scale.',
    author: 'Firecrawl',
    verified: true,
    installationUrl: 'https://github.com/firecrawl/firecrawl',
    details:
      'Gives Claude Code reliable access to real-time web data -- scrape a page, crawl a site, or search the web and get clean markdown back. Install the skill with the firecrawl-cli, or wire the firecrawl MCP server for universal client support. Needs a Firecrawl API key.',
    useCases: ['Web scraping', 'Site crawling', 'Real-time research'],
  },
  {
    id: 'caveman',
    name: 'Caveman',
    category: 'productivity',
    description: 'Strips narration and filler to cut Claude Code output tokens by ~65%.',
    author: 'Julius Brussee',
    verified: true,
    installationUrl: 'https://github.com/JuliusBrussee/caveman',
    details:
      'Constrains responses to brief, direct language -- dropping pleasantries and narration -- while keeping every technical fact and code block byte-for-byte intact. Cuts output tokens by roughly 65% on average, which lowers cost and speeds up long sessions.',
    useCases: ['Token reduction', 'Cost control', 'Faster iterations'],
  },
  {
    id: 'trailofbits-skills',
    name: 'Trail of Bits Security Skills',
    category: 'security',
    description: 'Professional static analysis and code auditing -- CodeQL, Semgrep, and more.',
    author: 'Trail of Bits',
    verified: true,
    installationUrl: 'https://github.com/trailofbits/skills',
    details:
      'A marketplace of 40+ security skills from the Trail of Bits research team: static and variant analysis, secure-contract review, constant-time and supply-chain auditing, and Semgrep/YARA rule authoring. Battle-tested tooling for taking security seriously.',
    useCases: ['Static analysis', 'Code auditing', 'Vulnerability review'],
  },
  {
    id: 'mcp-builder',
    name: 'MCP Builder',
    category: 'development',
    description: 'Guided workflow for building high-quality MCP servers.',
    author: 'Anthropic',
    verified: true,
    installationUrl: 'https://github.com/anthropics/skills/tree/main/skills/mcp-builder',
    details:
      'An official Anthropic skill that walks Claude Code through designing and implementing a well-structured MCP server -- tool definitions, transports, error handling, and testing -- so you can turn any API or system into an agent-connectable service.',
    useCases: ['MCP server creation', 'Tool integration', 'API wrapping'],
  },
  {
    id: 'office-docs',
    name: 'Office Document Skills',
    category: 'documents',
    description: 'Create, edit, and analyze PDF, Word, Excel, and PowerPoint files programmatically.',
    author: 'Anthropic',
    verified: true,
    installationUrl: 'https://github.com/anthropics/skills/tree/main/skills',
    details:
      'Anthropic\'s official document toolkit -- four skills (pdf, docx, xlsx, pptx) that let Claude generate and manipulate real office files: fill PDFs, format Word docs, build spreadsheets with formulas, and assemble slide decks, all with layout preserved.',
    useCases: ['PDF generation', 'Spreadsheet automation', 'Report building'],
  },
]

export const toolkitMCPs: ToolkitMCP[] = [
  {
    id: 'github-mcp',
    name: 'GitHub MCP',
    description: 'Let Claude read issues, review PRs, and search across your repos without leaving the terminal.',
    connectedServices: ['Repos & Search', 'Issues & PRs', 'Actions'],
    setupGuide:
      'claude mcp add --transport http github https://api.githubcopilot.com/mcp',
  },
  {
    id: 'context7-mcp',
    name: 'Context7 MCP',
    description: 'Version-aware library docs and API signatures, injected on demand -- fewer wrong-API errors.',
    connectedServices: ['Library Docs', 'API Signatures', 'Version-aware'],
    setupGuide:
      'claude mcp add --transport http context7 https://mcp.context7.com/mcp',
  },
  {
    id: 'playwright-mcp',
    name: 'Playwright MCP',
    description: 'A real browser Claude can drive to verify its own UI changes. Microsoft\'s official server.',
    connectedServices: ['Browser Automation', 'DOM Snapshots', 'E2E Testing'],
    setupGuide:
      'claude mcp add playwright -- npx @playwright/mcp@latest',
  },
  {
    id: 'sentry-mcp',
    name: 'Sentry MCP',
    description: 'Pull production errors, stack traces, and releases straight into Claude\'s context.',
    connectedServices: ['Error Tracking', 'Stack Traces', 'Releases'],
    setupGuide:
      'claude mcp add --transport http sentry https://mcp.sentry.dev/mcp',
  },
  {
    id: 'supabase-mcp',
    name: 'Supabase MCP',
    description: 'Database, auth, and real-time integration with Supabase -- the stack this project runs on.',
    connectedServices: ['PostgreSQL', 'Authentication', 'Real-time Subscriptions'],
    setupGuide:
      'claude mcp add --transport http supabase "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF"',
  },
]
