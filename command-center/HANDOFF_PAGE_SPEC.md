# Handoff Skills Page — Build Brief for Claude Code

**Audience:** Claude Code, building this page inside the mdntech repo.
**Stack already in use:** React 19, Vite, Tailwind 3, react-router-dom v7, framer-motion, react-icons.
**Design tokens to reuse:** see [tailwind.config.js](tailwind.config.js) — primary `#3B82F6`, dark `#0f1419` / `#1a1f26` / `#242b33`, fonts Inter (primary) / Space Grotesk (secondary) / JetBrains Mono (code), existing `fade-in-up` animation.
**Live skills repo (source of truth for content):** https://github.com/bugiiiii11/handoff
**Local source for skill bodies:** [../handoff/skills/](../handoff/skills/) — read these files when you need accurate skill content.

---

## 1. Goal

Ship a dedicated route on `app.mdntech.org` that serves three jobs, in priority order:

1. **Make the 4 free Handoff skills (`/start`, `/wrap`, `/save`, `/doc-update`) trivially installable.** The page is the canonical install destination linked from dev.to, Reddit, X, and the GitHub README.
2. **Explain what Handoff is** to a Claude Code user who has never heard of it — in under 30 seconds of scanning.
3. **Reserve a slot for PlanKit** (the upcoming paid product) so the same page evolves into the product family hub. PlanKit is teased as "Coming soon — get notified" with a placeholder card that becomes a real card on launch.

Non-goals for v1: no auth, no payments, no email capture form (use GitHub Watch + a mailto fallback), no blog, no docs site.

---

## 2. Information Architecture

### New route
- Path: `/handoff`
- Title: `Handoff — Claude Code workflow skills | M.D.N Tech`
- Meta description: `Four free skills that make Claude Code remember your project across sessions. One-line install, MIT licensed.`

### Homepage touchpoint
Add a single card to the existing [src/components/sections/Project.jsx](src/components/sections/Project.jsx) (or a new "Tools" section if Project feels overloaded) that links to `/handoff` with copy: *"Handoff — open-source Claude Code skills. PlanKit (paid product) coming soon."* No additional homepage real estate.

### Header nav
Add a single nav item `Tools` → `/handoff` in [src/components/layout/Header.jsx](src/components/layout/Header.jsx). Keep the existing in-page anchor links intact for the homepage.

### Future-proofing for PlanKit
Structure the page so PlanKit becomes a sibling section, not a rewrite:
- `src/pages/Handoff.jsx` is the route component.
- Compose it from section subcomponents: `<HandoffHero />`, `<WhatIsIt />`, `<InstallBlock />`, `<SkillCards />`, `<PlanKitTeaser />`, `<FAQ />`.
- When PlanKit ships, either (a) add a `/plankit` route reusing the same section components, or (b) rename this route to `/products` and turn `<HandoffHero />` + `<PlanKitHero />` into tabs. Don't lock in either choice now — just keep the section components self-contained so either refactor is cheap.

---

## 3. Page Structure (top → bottom)

### 3.1 Hero — `<HandoffHero />`
- Eyebrow: `Open source · MIT`
- H1 (font-secondary, font-hero): **"Make Claude Code remember your project."**
- Subhead (font-body-lg, gray-400, max-w-2xl): "Four free skills — `/start`, `/wrap`, `/save`, `/doc-update` — that turn every Claude Code session into the next one's starting point. No vendor lock-in. Install in one line."
- Primary CTA: `Install →` (smooth-scroll to `#install`)
- Secondary CTA: `View on GitHub` → external link, opens new tab, has `<HiOutlineExternalLink />` icon
- Trust strip below CTAs: small monospace row `MIT licensed · 0 dependencies · Works on Windows / macOS / Linux`

### 3.2 What Is It — `<WhatIsIt />`
Three-column grid (collapses to single column under `md`). Each column is a problem → solution pair, framed as the "before / after" of using Handoff. Use `<HiOutlineLightningBolt />`-style icons from react-icons.

| Problem | Solution |
|---|---|
| "I waste 10 minutes re-explaining context every session." | `/start` reads your handoff file and briefs Claude on the repo state in one command. |
| "I lose track of what I tried and why." | `/wrap` writes a session summary, commits, and pushes — every time. |
| "Context window dies mid-task." | `/save` dumps an emergency snapshot you can resume from in a fresh session. |

(Fourth skill `/doc-update` is shown in the SkillCards section — keep this triad to three for visual weight.)

### 3.3 Install Block — `<InstallBlock />` (anchor `#install`)

This is the most important block on the page. Treat install UX as the primary feature, not a footnote.

**Default tab: macOS / Linux (bash)**
```bash
git clone https://github.com/bugiiiii11/handoff.git && \
  mkdir -p ~/.claude/skills && \
  cp -r handoff/skills/* ~/.claude/skills/ && \
  echo "✓ Installed. Run /start in Claude Code to verify."
```

**Second tab: Windows (PowerShell)**
```powershell
git clone https://github.com/bugiiiii11/handoff.git; `
  New-Item -ItemType Directory -Force -Path "$HOME\.claude\skills" | Out-Null; `
  Copy-Item -Recurse -Force handoff\skills\* "$HOME\.claude\skills\"; `
  Write-Host "✓ Installed. Run /start in Claude Code to verify."
```

**UX requirements for the install block:**
1. **OS-aware default.** On mount, sniff `navigator.platform` (or `navigator.userAgentData.platform`) and pre-select the matching tab. Fall back to macOS/Linux if undetectable. Don't be clever — a single `useEffect` is enough.
2. **Copy-to-clipboard button** in the top-right of each `<pre>` block. Use `navigator.clipboard.writeText`. Show "Copied ✓" inline for 2s after click. Keyboard accessible (`<button>`, focus ring uses `ring-primary`).
3. **Manual fallback.** Below the command, an `<details>` element titled "Prefer to inspect first? Install manually." that expands to show: (1) `git clone` step, (2) inspect the four `SKILL.md` files, (3) copy them into `~/.claude/skills/<name>/SKILL.md`. Two reasons: trust signal for cautious users, and a path for users who don't want to run a chained command.
4. **Verify step.** Below the command block, a one-line callout: *"Open Claude Code in any project and type `/start`. You'll see the new skill in the menu."*
5. **Uninstall is one line.** Small print under the verify step: `rm -rf ~/.claude/skills/{start,wrap,save,doc-update}` — show users the door so they trust the install.

**Visual pattern for the code block:**
- `bg-dark-elevated` (`#242b33`), 1px `border-gray-600/30`, `rounded-lg`, `p-5`, font `font-mono` `text-small`.
- Tab strip above: pill-style buttons (`bg-dark-card` for inactive, `bg-primary text-white` for active).
- Copy button: absolute top-right, `text-gray-400 hover:text-primary`, no background until hover.

### 3.4 Skill Cards — `<SkillCards />`
2×2 grid (single column under `md`). One card per skill. Card content:

- Title in font-mono: `/start`, `/wrap`, `/save`, `/doc-update`
- One-line purpose (pulled verbatim from each skill's frontmatter `description` field — read [../handoff/skills/start/SKILL.md](../handoff/skills/start/SKILL.md) etc. for accuracy)
- "Use it when..." — one short sentence
- A faded code snippet showing example usage (`> /start` → `Session Briefing...`)
- Bottom-right link: `View source →` linking to the file on GitHub

Card styling: `bg-dark-card`, `border-gray-600/20`, `hover:border-primary/40 transition`, `rounded-xl`, `p-6`. No motion on hover beyond the border tint — this page is dense, keep it calm.

### 3.5 PlanKit Teaser — `<PlanKitTeaser />`
A single full-width card visually distinct from the Skill Cards (use a subtle `bg-gradient-to-br from-dark-card to-primary/10`). Placement: directly after Skill Cards.

Content:
- Eyebrow: `Coming soon · Paid tier`
- H2: **"PlanKit — sprint loop, Telegram nudges, end-of-day shutdown."**
- Subhead: "The same workflow, extended. Daily planning, intent capture, Claude-generated end-of-day summaries, and Telegram notifications when Claude needs you."
- CTA (single, primary): `Watch the GitHub repo to get notified` → external link to https://github.com/bugiiiii11/handoff
- Secondary text: "Or email [chaosgenesisnft@gmail.com](mailto:chaosgenesisnft@gmail.com?subject=PlanKit%20waitlist) to join the waitlist."

Don't invent feature lists, screenshots, or pricing in this teaser. The narrative goal is: *"Free skills work? Paid tier extends them along the same axis."* Keep it short.

### 3.6 FAQ — `<FAQ />`
Five Q&As as `<details>` accordions. Use these exact questions; pull short answers from the GitHub README and the skills' own bodies for accuracy.

1. **What is a Claude Code skill?** — One-line definition, link to Anthropic's docs.
2. **Is this safe to install? What does it touch?** — Only `~/.claude/skills/`. Lists exact files. Nothing else on disk, no network calls, no telemetry.
3. **Do I need a paid Claude plan?** — No. Skills work on any Claude Code installation.
4. **What if I already have skills with the same names?** — Backup advice: `cp -r ~/.claude/skills ~/.claude/skills.bak` before install.
5. **How do I update?** — `cd handoff && git pull && cp -r skills/* ~/.claude/skills/`.

### 3.7 Footer band
Reuse the existing site footer. Optionally add a one-line strip above it linking to: GitHub · Discussions · MIT License · Report an issue.

---

## 4. Component & File Layout

Create a `src/pages/` directory (currently absent). Mirror the existing `components/sections` structure for the new section components.

```
src/
  pages/
    Handoff.jsx                  # composes the sections below
  components/
    handoff/                     # new folder, page-specific components
      HandoffHero.jsx
      WhatIsIt.jsx
      InstallBlock.jsx           # the OS-tabbed install card
      CodeBlock.jsx              # reusable: tab + copy button + <pre>
      SkillCards.jsx
      SkillCard.jsx
      PlanKitTeaser.jsx
      FAQ.jsx
    common/
      CopyButton.jsx             # if not already extracted from CodeBlock
```

Wire the route in [src/App.jsx](src/App.jsx):
```jsx
<Route path="/handoff" element={<HandoffPage />} />
```

Add the nav link in [src/components/layout/Header.jsx](src/components/layout/Header.jsx) — `Tools` → `/handoff`. Use `react-router-dom`'s `<Link>` for in-app nav, plain `<a>` for external GitHub links.

---

## 5. Tech Constraints & Conventions

- **No new dependencies** unless absolutely required. The existing stack (framer-motion for animations, react-icons for icons) covers everything in this brief. Tailwind handles all styling.
- **Animations:** reuse the existing `animate-fade-in-up` Tailwind utility for section reveals. Use framer-motion only for the OS-tab transition and the FAQ accordion if `<details>` doesn't feel right.
- **Accessibility:** all interactive elements keyboard-reachable, visible focus rings (`focus-visible:ring-2 focus-visible:ring-primary`), proper ARIA on tabs (`role="tab"`, `aria-selected`) and accordions.
- **Responsive:** test at `sm` (375px), `md` (768px), `lg` (1024px). The install block is the most fragile — code blocks must scroll horizontally on mobile, not break the layout.
- **No client-side analytics** beyond what mdntech already has. If nothing exists, leave it.
- **SEO basics:** set `<title>` and `<meta name="description">` on the route via a small effect or `react-helmet-async` (only add the dependency if SEO is a hard requirement; otherwise a manual `useEffect` updating `document.title` is fine for SPA + crawler combos that execute JS).

---

## 6. Content Sources (don't paraphrase, read these)

When writing copy for skill descriptions, FAQ answers, or install commands, **read these files first** rather than guessing:

- [../handoff/README.md](../handoff/README.md) — canonical project pitch
- [../handoff/skills/start/SKILL.md](../handoff/skills/start/SKILL.md)
- [../handoff/skills/wrap/SKILL.md](../handoff/skills/wrap/SKILL.md)
- [../handoff/skills/save/SKILL.md](../handoff/skills/save/SKILL.md)
- [../handoff/skills/doc-update/SKILL.md](../handoff/skills/doc-update/SKILL.md)
- [../handoff/examples/handoff-template.md](../handoff/examples/handoff-template.md)
- [../handoff/examples/decisions-template.md](../handoff/examples/decisions-template.md)

If any of these paths fail, fall back to the GitHub repo URL above. Don't invent content.

---

## 7. Acceptance Criteria

The page is shippable when all of these hold:

- [ ] Route `/handoff` renders without console errors.
- [ ] Header nav has a `Tools` link that activates on the new route.
- [ ] Install block detects OS on mount and pre-selects the right tab.
- [ ] Copy button works and shows `Copied ✓` for ~2s; falls back gracefully if `navigator.clipboard` is unavailable.
- [ ] Manual install `<details>` expands and contains the three-step manual path.
- [ ] All four skill cards link to the correct file on the GitHub repo (verify URLs).
- [ ] PlanKit teaser exists and links to the GitHub repo as a placeholder.
- [ ] FAQ has at least the five questions from §3.6.
- [ ] Page is legible at 375px width — no horizontal scroll except inside code blocks.
- [ ] Lighthouse score ≥90 for Performance, ≥95 for Accessibility on the route in production build.
- [ ] `npm run build` passes with no warnings.

---

## 8. Out of Scope (for v1, do not do)

- Email capture forms, newsletter integration, Mailchimp/ConvertKit.
- Authentication or user accounts.
- Stripe / payments — PlanKit pricing is teased only.
- A dedicated docs site or blog. Markdown content stays in the GitHub repo.
- Internationalization. English only for v1.
- Dark/light mode toggle. Site is dark-only by design.
- Telemetry on copy-button clicks. (Can add later if validation phase wants signal.)

---

## 9. After Shipping — Hand Back

When you finish, append a Session entry to [../scheduler/handoff.md](../scheduler/handoff.md) under "What Was Done" with the route URL, the new file paths, and any deviations from this brief. The scheduler project tracks the meta-work; mdntech repo tracks the code.

If you decide a different IA than §2 (e.g., putting the page at `/products` instead of `/handoff`, or skipping the homepage card), document the *why* in the same handoff entry — future sessions will need that context.
