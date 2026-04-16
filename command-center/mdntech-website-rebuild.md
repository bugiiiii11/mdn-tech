# M.D.N Tech — Website Rebuild Plan

## Site Structure & Content

> **Version:** 1.0
> **Date:** April 12, 2026
> **Design System:** Space theme (existing — no visual changes)
> **Tech Stack:** Next.js 14 + TypeScript + Tailwind + Framer Motion + Three.js
> **Domain:** mdntech.org
> **App Portal:** app.mdntech.org

---

## Site Map

```
mdntech.org (Landing Page)
│
├── /blog                    ← Blog listing + individual posts
│   └── /blog/[slug]         ← Individual blog post
│
├── /about                   ← Team + company story (footer link)
├── /development             ← Custom development services (footer link)
├── /privacy                 ← Privacy policy (footer link)
├── /terms                   ← Terms of service (footer link)
│
└── app.mdntech.org          ← Product portal (separate app)
    ├── /dashboard            ← User home after login
    ├── /signakit             ← SignaKit product
    ├── /chatkit              ← ChatKit product
    ├── /tradekit             ← TradeKit product
    ├── /tools                ← Free tools & Claude Code skills
    └── /settings             ← Account settings
```

---

## Navigation Bar

**Layout:** Glassmorphism nav bar (same style as current site)

**Left:** M.D.N Tech logo + wordmark

**Center links:**
- Products (scrolls to products section)
- Free Tools (scrolls to free tools section)
- Blog (links to /blog)

**Right:**
- Sign In (ghost button → app.mdntech.org/login)
- Open App (primary gradient button → app.mdntech.org)

---

## LANDING PAGE — Section by Section

---

### Section 1: Hero

**Background:** Keep the black hole video + star field (identical to current)

**Welcome badge** (pill component above title):
```
✦ AI-Powered Developer Tools
```

**Headline** (gradient text, purple → cyan):
```
Your Tools.
Your Rules.
```

**Subtitle** (gray-300, medium weight):
```
Production-ready AI, Web3, and automation tools —
built by engineers, ready to deploy.
```

**Body text** (gray-400, base size):
```
M.D.N Tech builds self-service developer tools that solve
real problems. No sales calls, no onboarding meetings.
Sign up, configure, and ship.
```

**CTAs:**
- **Primary:** `Open the App` → app.mdntech.org (gradient button, same style as current "Start Your Project")
- **Secondary:** `Explore Products` → scrolls to products section (outlined button, same style as current "See How We Build")

---

### Section 2: Products

**Section header** (gradient text):
```
What We Build
```

**Section subtitle** (gray-300):
```
Three tools. Three problems solved. One account.
```

**Three product cards** — use the same glassmorphism card style as the current "What We Build" service cards, but with these differences: each card gets a small product icon, a product name, a one-line tagline, a 2-3 sentence description, and a CTA button.

---

#### Card 1: SignaKit

**Icon:** Key/lock icon (similar style to current site icons)

**Product name:** SignaKit

**Tagline** (gradient text, small):
```
Authentication that feels invisible.
```

**Description** (gray-400):
```
Drop-in login and crypto wallet for any app. Google, Apple,
email, or Web3 wallet — your users pick how they sign in.
20ms signing, fully customizable UI, one line to integrate.
```

**CTA button:**
```
Get Started → (links to app.mdntech.org/signakit)
```

**Small stats line** (gray-500, below description):
```
Free up to 1,000 users · SDK for React, Next.js, Vue
```

---

#### Card 2: ChatKit

**Icon:** Chat bubble icon

**Product name:** ChatKit

**Tagline** (gradient text, small):
```
Your knowledge. Your chatbot. One line of code.
```

**Description** (gray-400):
```
Turn any knowledge base into a branded AI chatbot. Paste your
content, pick a tone and style, embed with a single HTML tag.
No training, no pipelines, no complexity.
```

**CTA button:**
```
Try Free → (links to app.mdntech.org/chatkit)
```

**Small stats line** (gray-500):
```
20 free messages to test · Embed anywhere with one <script> tag
```

---

#### Card 3: TradeKit

**Icon:** Chart/candlestick icon

**Product name:** TradeKit

**Tagline** (gradient text, small):
```
Crypto analytics without the noise.
```

**Description** (gray-400):
```
Real-time BTC analytics powered by professional-grade
indicators. EMA trends, RSI momentum, volatility scoring —
read from TradingView, delivered clean.
```

**CTA button:**
```
View Analytics → (links to app.mdntech.org/tradekit)
```

**Small stats line** (gray-500):
```
Free analytics dashboard · Premium signals coming soon
```

---

### Section 3: Free Tools & Community

**Section header** (gradient text):
```
Free Tools
```

**Section subtitle** (gray-300):
```
Open resources for developers and builders. No account required.
```

**Three smaller cards** — more compact than the product cards. Use the same card styling but slightly smaller.

---

#### Card 1: Claude Code Skills

**Icon:** Terminal/code icon

**Title:** Claude Code Skills

**Description** (gray-400):
```
Production-tested skill files for Claude Code. Document
creation, frontend design, project management — refined
through hundreds of real builds.
```

**CTA:** `Browse Skills →`

---

#### Card 2: ChatKit Playground

**Icon:** Play/test icon

**Title:** Try ChatKit Free

**Description** (gray-400):
```
Test a live AI chatbot with your own content. Paste any text,
get a working chatbot in seconds. 20 messages free, no signup.
```

**CTA:** `Launch Playground →`

---

#### Card 3: Crypto Dashboard

**Icon:** Chart icon

**Title:** Live BTC Analytics

**Description** (gray-400):
```
Free real-time crypto analytics dashboard. Trend direction,
momentum signals, and volatility readings — updated
continuously from TradingView data.
```

**CTA:** `View Dashboard →`

---

### Section 4: Trust Bar

**Layout:** A single compact horizontal strip. Not full cards — just a clean, minimal credibility line.

**Design:** Semi-transparent background strip with a subtle border, same glassmorphism treatment but much thinner than a card section.

**Content — centered, single line with team avatars:**

```
[avatar] [avatar] [avatar]   Built by 3 senior engineers · 30+ years combined experience · Based in UAE
```

The three team member photos appear as small circular avatars (40-48px), followed by the text. The entire line links to /about.

**Below the line, a subtle secondary text:**
```
Full-stack AI · Blockchain · Enterprise systems
```

---

### Section 5: Blog Preview

**Section header** (gradient text):
```
From the Lab
```

**Section subtitle** (gray-300):
```
Engineering insights from the M.D.N Tech team.
```

**Layout:** Same 3-card blog grid as current site. Keep the exact same card design — category tags, featured badges, dates, read times, article previews, tag pills, and "Read article →" links.

**CTA below cards:**
```
View All Posts → (links to /blog)
```

---

### Section 6: Footer

**Layout:** Clean multi-column footer with the space theme background.

**Column 1 — Brand:**
```
M.D.N Tech logo
AI-powered tools for modern builders.

© 2026 M.D.N Tech. All rights reserved.
United Arab Emirates
```

**Column 2 — Products:**
```
Products
─────────
SignaKit
ChatKit
TradeKit
```

**Column 3 — Resources:**
```
Resources
─────────
Blog
Claude Code Skills
Documentation
```

**Column 4 — Company:**
```
Company
─────────
About Us
Custom Development
Contact
Privacy Policy
Terms of Service
```

**Column 5 — Connect:**
```
Connect
─────────
contact@mdntech.org
+971 58 228 3256
GitHub
X (Twitter)
```

---

## SUBPAGES

---

### /about — About Us

**Page title** (gradient text):
```
The Team Behind the Tools
```

**Intro paragraph** (gray-300):
```
M.D.N Tech is a UAE-based technology company founded by three
senior engineers who spent their careers building enterprise
systems, launching Web3 platforms, and shipping production
applications. We came together with a shared conviction:
the best developer tools are built by people who use them.
```

**Team cards** — Use the same team card design from the current site (circular avatar, name, role, bio), but arranged in a full-page layout with more breathing room.

#### Martin Jeřábek — CEO

```
Martin is the first point of contact for every project at
M.D.N Tech — responsible for client relationships, product
strategy, and delivery. With 10 years in the blockchain and
Web3 space, he brings strategic depth to every product we ship.
```

#### Martin Hromek — CTO

```
20 years building enterprise systems. 5 years as a blockchain
CTO. Martin has designed and delivered mission-critical
infrastructure at a scale most engineers never encounter —
and brings that depth to every product at M.D.N Tech.
His focus: architecture that holds, infrastructure that scales.
```

#### Eric Lukas — Full-Stack AI Engineer

```
Eric is a full-stack AI engineer with 8 years of experience
shipping production web apps, mobile applications, and AI
integrations. With over 30 projects delivered across industries
— from healthcare and fintech to enterprise tooling — he leads
frontend, mobile, and AI integration across all M.D.N Tech products.
```

**Bottom section:**

```
Want to work with us directly?
We also take on select custom development projects.
```
**CTA:** `Learn About Custom Development →` (links to /development)

---

### /development — Custom Development

**Page title** (gradient text):
```
Custom Development
```

**Intro paragraph** (gray-300):
```
Beyond our products, M.D.N Tech takes on select custom
development projects. We build production-ready systems
end-to-end — from architecture to deployment — with the
same engineering standards behind our own tools.
```

**What We Build section** — Reuse the 6 service cards from the current site, same design:

1. **Full-Stack Development** — Scalable web platforms, APIs, and microservices built on React, Next.js, TypeScript, Supabase, Railway, and Vercel.

2. **Mobile Development** — Native-quality iOS and Android apps with React Native and Flutter. Telegram Mini Apps and Web3 wallet support.

3. **Game Development** — Unity and Unreal Engine 5 — from game mechanics and economy design to Web3 integrations and multiplayer systems.

4. **UI/UX & Product Design** — UX research, design systems, and pixel-perfect implementation from Figma designs. Full design-to-code pipeline.

5. **Blockchain & Web3** — Smart contracts, DeFi systems, TGE launches, liquidity creation, and wallet integrations across the full Web3 stack.

6. **AI & Intelligent Systems** — From intelligent automation to AI-native product features. RAG pipelines, AI agents, MCP servers, and production-grade AI engineering.

**How We Work section** — Condensed version of current process:

```
Every project follows a five-phase process: Discovery, Architecture,
Development, Testing, and Deployment. No phase begins until the
previous one is approved — by our engineers and by you.
```

**Contact section:**

```
Let's Build Something That Matters

Whether you're launching your first product or scaling an existing
one, we'd like to hear what you're building.
```

**Contact info:**
```
contact@mdntech.org
+971 58 228 3256
United Arab Emirates
```

**Contact form** — Same design as current site (Name, Email, Message, Send button).

---

### /blog — Blog Listing

**Page title** (gradient text):
```
From the Lab
```

**Subtitle** (gray-300):
```
Engineering insights on AI, Web3, and building production systems.
```

**Layout:** Grid of blog cards (same design as current blog preview section). Filterable by category tags. Paginated.

**Categories:**
- AI & Engineering
- Blockchain & Web3
- Product Updates
- Tutorials

---

## APP PORTAL — app.mdntech.org

This is a separate Next.js application sharing the same design tokens (colors, fonts, gradients) but with a functional dashboard layout rather than a marketing page layout.

### Auth Flow

- Sign up / Sign in via Supabase Auth (email + magic link, Google OAuth)
- Single account across all products
- After auth → redirect to /dashboard

### Dashboard Home

**Layout:** Sidebar navigation + main content area

**Sidebar:**
```
M.D.N Tech (logo)
─────────────────
Dashboard
─────────────────
SignaKit
ChatKit
TradeKit
─────────────────
Free Tools
  Claude Code Skills
  Crypto Analytics
─────────────────
Settings
```

**Main area:**

Welcome message:
```
Welcome back, [name].
```

Product tiles (3 cards):
- SignaKit — status badge (Active/Inactive), quick stats, "Open →"
- ChatKit — status badge, message count, "Open →"
- TradeKit — status badge, latest signal, "Open →"

Quick links:
- Documentation
- Blog
- Contact Support

---

## DESIGN NOTES

### What stays the same:
- All colors, gradients, and CSS variables from the design documentation
- Star field 3D background (Three.js particle system)
- Black hole video in hero
- Glassmorphism card styling with purple borders
- Framer Motion scroll-triggered animations
- Gradient text treatment for section headers
- Welcome badge pill component
- HUD border effects on cards
- 3D tilt hover effects
- Video backgrounds for section transitions

### What changes:
- Navigation links (Products, Free Tools, Blog instead of About Us, Services, Process, Team, Contact Us)
- Navigation CTAs (Sign In + Open App instead of Start Project)
- Hero copy and CTAs (platform-focused instead of consultancy-focused)
- Section content (products + free tools instead of services + process + stack + results)
- Footer structure (multi-column with product/resource/company links)
- Team and consultancy content moved to footer subpages
- Blog stays but gets its own route instead of being a homepage section only

### What gets removed from the landing page:
- "Why Our Approach Changes Everything" (4 value prop cards) → cut
- "How We Build" (5-phase process accordion) → moved to /development
- "Our Engineering Stack" (9 tech category cards) → moved to /development
- "Our Results" (6 stats cards) → cut (credibility handled by trust bar)
- "Meet Our Team" (3 full team cards) → moved to /about, replaced by trust bar
- "Start Your Project" (contact section) → moved to /development

### Estimated sections on landing page:
Current site: ~9 scroll sections
New site: ~5 scroll sections (Hero → Products → Free Tools → Trust Bar → Blog Preview → Footer)

---

## CONTENT SUMMARY — Quick Reference

| Section | Purpose | Primary CTA |
|---------|---------|-------------|
| Hero | Position MDN Tech as a product platform | Open the App |
| Products | Showcase SignaKit, ChatKit, TradeKit | Get Started / Try Free |
| Free Tools | Drive organic traffic, build community | Browse / Launch / View |
| Trust Bar | Credibility without heavy content | Links to /about |
| Blog Preview | SEO + thought leadership | View All Posts |
| Footer | Navigation + contact | Links to subpages |
| /about | Team story + bios | Link to /development |
| /development | Custom dev services + contact | Send Message |
| /blog | All blog content | Read articles |

---

*Document prepared April 12, 2026 — M.D.N Tech Website Rebuild v1.0*
