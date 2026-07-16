# M.D.N Tech — Website Rebuild Plan

## Site Structure, Content & Launch Roadmap

> **Version:** 2.0
> **Date:** July 16, 2026 (supersedes v1.0, April 12, 2026)
> **Design System:** Space theme (existing — no visual changes)
> **Tech Stack:** Next.js 14 + TypeScript + Tailwind + Framer Motion + Three.js/R3F
> **Domain:** mdntech.org · **App Portal:** app.mdntech.org
> **Execution:** dev branch only (`feat/landing-rebuild` + Vercel preview) — prod untouched until MVP launch decision

---

## Changelog v1.0 → v2.0

| Area | v1.0 (April) | v2.0 (July) |
|---|---|---|
| Product lineup | SignaKit / ChatKit / TradeKit | **ChatKit + ToolKit live (MVP)**; SignaKit / MarketKit / TechKit coming-soon. TradeKit removed (superseded by ToolKit, repo S20). |
| Versions | one landing | **Two renderable modes from one codebase: MVP + FULL** (config + env var) |
| Pricing | per-card stats lines ("Free up to 1,000 users") | **Credits messaging, no pricing table** — "One account. One credit balance. All products." Prices live in the portal. |
| Subpages | /about (team) + /development (services) | **Single /about page = entire current landing (8 sections, content unmodified)** |
| Animations | "keep everything" | skills-bg.webm moves What We Build → Our Results; **new code-based cosmic animation** for What We Build |
| Payments | not covered | **Network International (N-Genius) universal credits wallet — deliberately the LAST task** (Phase F). Legal OK from Filip. Same model reused for Rahadu portal. |
| Roadmap | none | Phases A–F (landing → ToolKit → ChatKit → MVP launch → post-MVP products → payments) |

**Locked decisions (Martin, 2026-07-16):**
1. MVP mode shows SignaKit, MarketKit **and TechKit** as "Coming Soon" cards (no hidden products); FULL mode = all 5 live.
2. No pricing table on the landing — credits value-prop messaging only; the landing must survive the payments pivot without rework.
3. About Us = one page carrying the whole current landing; no /development split.

---

## Site Map

```
mdntech.org (NEW product landing — MVP or FULL mode)
│
├── /about                   ← ENTIRE current landing moves here (8 sections, unmodified)
├── /blog                    ← existing (unchanged)
│   └── /blog/[slug]
├── /sk                      ← Slovak agency landing (DO NOT TOUCH)
├── /privacy, /terms         ← existing (unchanged)
├── /preview-full            ← optional, noindex — renders FULL mode for side-by-side review (dev only)
│
└── app.mdntech.org          ← customer portal (live)
    ├── /toolkit              ← public, no auth (ToolKit / Handoff skills)
    ├── /chatkit              ← ChatKit (post-auth landing)
    ├── /marketkit            ← enrolment-gated
    └── /settings, /upgrade
```

---

## MVP / FULL Mode Mechanism

**New file `lib/marketing/products.ts`** — single source of truth for the landing product lineup:

```ts
export type LandingMode = 'mvp' | 'full'
export type ProductStatus = 'live' | 'coming-soon' | 'hidden'

export interface MarketingProduct {
  id: 'chatkit' | 'toolkit' | 'signakit' | 'marketkit' | 'techkit'
  name: string
  tagline: string        // gradient one-liner
  description: string
  icon: string
  href: string           // app.mdntech.org target (live products only)
  cta: string            // "Try Free", "Browse Skills" — never payment language
  status: Record<LandingMode, ProductStatus>
}

export function getLandingMode(): LandingMode {
  return process.env.NEXT_PUBLIC_LANDING_MODE === 'full' ? 'full' : 'mvp'
}
```

**Status matrix (locked):**

| Product | MVP | FULL |
|---|---|---|
| ChatKit | live | live |
| ToolKit | live | live |
| SignaKit | coming-soon | live |
| MarketKit | coming-soon | live |
| TechKit | coming-soon | live |

**Why build-time env var:** page stays fully static (SEO/Lighthouse); Vercel scopes `NEXT_PUBLIC_LANDING_MODE=full` to **Preview** environment only; Production has no var → defaults to `mvp` (fail-safe — FULL cannot leak to prod). When all products ship: set the var in Production + redeploy, zero code change.

**Coming-soon card rendering:** same glassmorphism card, "Coming Soon" badge, muted CTA (no link / "Notify me" mailto), description present — pre-markets the roadmap.

**Credits future-proofing (constraint only — no implementation now):** all card copy lives in the config, never hard-coded in JSX; no per-product payment language; a future `credits` field slots into `MarketingProduct` without touching components.

---

## LANDING PAGE — Section by Section

### Section 1: Hero
- **Background:** black hole video (`/videos/blackhole.webm`) + global starfield — identical block copied from `components/main/hero.tsx`.
- **Badge:** `✦ AI-Powered Developer Tools`
- **Headline (gradient):** `Your Tools. Your Rules.`
- **Subtitle:** `Production-ready AI, Web3, and automation tools — built by engineers, ready to deploy.`
- **Body:** `M.D.N Tech builds self-service developer tools that solve real problems. No sales calls, no onboarding meetings. Sign up, configure, and ship.`
- **CTAs:** primary `Open the App` → app.mdntech.org · secondary `Explore Products` → `#products`
- Keeps `id="home"` (footer logo links to `/#home`).

### Section 2: Products (`id="products"`)
- **Header:** `What We Build` · subtitle adapts to mode — MVP: `Two tools live today. Three more on the way. One account.` / FULL: `Five tools. One account. One credit balance.`
- **5 cards from `lib/marketing/products.ts`** (glassmorphism shell cloned from `skills.tsx` ServiceCard + HUD borders):

| Product | Tagline | Description core | CTA (live) |
|---|---|---|---|
| **ChatKit** | Your knowledge. Your chatbot. One line of code. | Turn any knowledge base into a branded AI chatbot. Paste content, pick tone, embed with a single tag. 30 free trial messages. | `Try Free →` app.mdntech.org/chatkit |
| **ToolKit** | Claude Code superpowers. Free forever. | Production-tested Claude Code skills and safety hooks — session continuity (/start, /wrap), guarded automation, one-line install. MIT licensed. | `Browse Skills →` app.mdntech.org/toolkit |
| **SignaKit** | Authentication that feels invisible. | Drop-in login and crypto wallet for any app. Google, Apple, email, or Web3 wallet. One line to integrate. | coming-soon (MVP) |
| **MarketKit** | Your AI go-to-market copilot. | Scan your product, generate a launch kit, run weekly growth sprints with tracked metrics — marketing that ships itself. | coming-soon (MVP) |
| **TechKit** | Ops visibility on autopilot. | Uptime, deploys, provider health, AI cost tracking, and a weekly AI ops digest — your stack, monitored. | coming-soon (MVP) |

### Section 3: Free Tools (`id="free-tools"`)
No account required. Two cards:
- **Claude Code Skills (ToolKit)** — live skill count imported from `lib/portal/toolkit-skills.ts` → `Browse Skills →` app.mdntech.org/toolkit
- **Try ChatKit Free** — trial messages count imported from `lib/portal/plans.ts` (`FREE` tier) so copy never drifts → `Start Free →` app.mdntech.org/chatkit

### Section 4: Credits Value-Prop Strip
Thin glassmorphism strip (NOT a pricing table):
```
One account. One credit balance. All products.
Buy credits once, spend them across every M.D.N Tech tool. No per-product subscriptions to juggle.
```
No prices, no packages, no gateway mention. CTA: `Open the App →`. (Concrete packages + checkout arrive in Phase F.)

### Section 5: Trust Bar
3 circular avatars (from `TEAM_MEMBERS` in `constants/index.ts`) + `Built by 3 senior engineers · 30+ years combined experience · Based in UAE` → links to `/about`. Subtext: `Full-stack AI · Blockchain · Enterprise systems`. Plus custom-dev line: `Need custom development? We take on select projects → /about`.

### Section 6: Blog Preview (`id="blog"`)
`From the Lab` — existing 3-card grid, `View All Posts →` /blog. Server component using `getAllPosts()` from `data/blog-posts.ts`.

### Footer (multi-column, EN branch only — `isSk` branch byte-identical)
- **Brand:** logo · `AI-powered tools for modern builders.` · © 2026 · UAE
- **Products:** generated from `visibleProducts(getLandingMode())`
- **Resources:** Blog · Claude Code Skills · Documentation
- **Company:** About Us (/about) · Contact · Privacy · Terms
- **Connect:** contact@mdntech.org · +971 58 228 3256 · GitHub · X
- Black hole bookend video stays.

### Navbar (`components/main/navbar.tsx` + `constants/index.ts`)
`NAV_LINKS` → Products `/#products` · Free Tools `/#free-tools` · About `/about` · Blog `/blog`. Right side: **"Open App" gradient CTA → app.mdntech.org** (this closes old backlog priority 6 — Login/Portal CTA re-enable). `SK_NAV_LINKS` untouched.

---

## /about — Migration of the Current Landing

**New `app/(marketing)/about/page.tsx`** imports the existing `components/main/*` sections **unmodified**, current order: `Hero, AboutUs, Skills, Process, Encryption, Projects, Team, ContactUs`.
- All hash ids (`#about-us #services #process #security #projects #team #contact-us`) work automatically; internal fragment CTAs in `components/sub/hero-content.tsx` are relative → zero changes.
- **Metadata:** `About Us | The Team Behind the Tools`, agency-flavored description, canonical `/about`, no hreflang cluster.
- **Root metadata:** new product-first title/description in `config/index.ts`, keep transitional agency keywords ("AI developer tools and full-stack development, UAE") + existing sk/en hreflang on root.
- **Legacy hash redirect:** new client component `components/landing/legacy-hash-redirect.tsx` mounted on the new root — on mount, if `window.location.hash` ∈ the 7 legacy ids → `router.replace('/about' + hash)`. (URL fragments never reach the server — `next.config.js` redirects cannot do this.) New landing must NOT reuse those 7 ids (it uses `products` / `free-tools` / `blog` / `home`).
- **Sitemap (`app/sitemap.ts`):** add `/about`, bump root `lastModified`.
- **Sweep:** grep `data/blog-posts.ts` + blog components for `/#` links → rewrite to `/about#...`.

---

## Animations

### 1. Move skills-bg.webm: "What We Build" → "Our Results"
Both sections live on `/about` after migration.
- `components/main/projects.tsx` ("Our Results", `id="projects"`): add `relative` to the section className; insert the bg block from `skills.tsx:370-383` as last child (`div.absolute.-z-10.pointer-events-none` > `.opacity-30` > `<video preload="none" playsInline loop muted autoPlay src="/videos/skills-bg.webm">`).
- `components/main/skills.tsx`: remove the video block.

### 2. New cosmic animation for "What We Build": `components/main/cosmic-nebula.tsx`
R3F **"nebula drift"** (code-based, no video asset) — R3F/drei/maath already load on every marketing page via `StarsCanvas`, so marginal JS ≈ 0:
- One `<Canvas dpr={[1,1.5]} gl={{alpha:true}}>`: 2–3 planes with **procedurally generated** nebula textures (runtime 2D-canvas radial gradients, theme purple `#7042f8` / cyan `#22d3ee`, additive blending), slow rotation + opacity pulse via `useFrame`; plus one drei `Points` field (~400 pts, pattern cloned from `star-background.tsx`) with slight z-drift toward camera (warp feel).
- **Lazy mount** via `useInView` on the section ref; unmount off-screen (GPU cost zero on the rest of /about).
- **`prefers-reduced-motion`** → static CSS fallback (two blurred radial-gradient divs). Mobile < 768px → half particle count.
- Hard cap: **one** extra WebGL context beyond global `StarsCanvas`.

---

## Branch / Deploy Strategy

- **Branch `feat/landing-rebuild`** cut from `main`; all work there; rebase onto `main` after unrelated prod hotfixes (collision surfaces: `navbar.tsx`, `footer.tsx`, `constants/index.ts`).
- **Vercel:** auto preview per push (previews send `X-Robots-Tag: noindex` — nothing leaks to crawlers). Set `NEXT_PUBLIC_LANDING_MODE=full` as Preview-scoped var to review FULL; unset to review MVP.
- **Critical pre-launch check:** one preview build with the var **unset** → verify default renders MVP (prod will have no var).
- **Middleware:** preview hosts (`*.vercel.app`) fall through to the marketing branch of `lib/supabase/middleware.ts`; `/about` needs no middleware change.
- **Launch (Phase D):** single merge → `main` = atomic prod swap (landing + about + sitemap + metadata). Post-launch: GSC re-index `/` + `/about`.

---

## ROADMAP — Phases A–F

| Phase | Content | Estimate |
|---|---|---|
| **A — Landing rebuild (dev)** | Sessions A1–A3 below | ~2–2.5 sessions |
| **B — ToolKit pre-release** | Analyze + optimize `/start` + `/wrap` skills before release (canonical source: `MindPalace\Resources\Skills\`; sync all copies: vault canonical / vault installed / repo `.claude/skills/` / `github.com/bugiiiii11/handoff` mirror). Package the 5 security hooks (`.claude/hooks/`: block-dangerous, protect-files, block-internal-urls, audit-all, scan-injection) as a **"Hooks bundle"** on the ToolKit page — new entry type in `lib/portal/toolkit-skills.ts` + install flow section on `/portal/toolkit`. | 1 session |
| **C — ChatKit completion** | Wire feature gates in chatbot detail UI (`hasFeature()` exists, UI unconditional — ~30 min); improvement analysis pass (onboarding, widget UX, empty states); auto-learning / weekly reports / voice stay **deferred** (Max-tier, post-MVP). | 1 session |
| **D — MVP LAUNCH** | Merge `feat/landing-rebuild` → main (MVP mode) · GSC re-index · social announcements (ToolKit = install funnel). | 15 min + go decision |
| **E — Post-MVP products** | SignaKit build (from AuthVault base); MarketKit finish (B1 GA4/GSC, B3 Dub go-live, B5 dogfood); TechKit productization (currently internal CC module — customer-facing scope TBD). Flip each product to `live` in `products.ts` as it ships; FULL mode in prod via env var when all 5 live. | multi-session |
| **F — PAYMENTS (deliberately LAST)** | **Network International (N-Genius) universal credits wallet** per `MindPalace\Projects\MDN-Tech\PAYMENT_NETWORK_INTERNATIONAL.md`: HPP flow, `payment_orders` (idempotency) + append-only `end_user_credits_ledger`, webhook-driven business logic, refunds + polling fallback. Replace mock checkout (`app/api/portal/subscription/route.ts`, `.../purchase/route.ts`); reconcile `lib/portal/plans.ts` tiers with the universal credits model. Legal OK (Filip). **Architecture reusable for Rahadu portal.** Start only when product functionality is 100% ready. | dedicated block |

### Phase A session breakdown

**A1 — Foundation + new landing (~1 full session)**
1. Branch `feat/landing-rebuild`
2. `lib/marketing/products.ts` (types, 5 products, mode helper)
3. `components/landing/`: `hero.tsx`, `product-card.tsx`, `products.tsx`, `free-tools.tsx`, `credits-strip.tsx`, `trust-bar.tsx`, `blog-preview.tsx`
4. Rewrite `app/(marketing)/page.tsx` (composition + metadata, hreflang kept)
5. `constants/index.ts` NAV_LINKS + navbar "Open App" CTA
6. QA: `/sk`, `/blog`, both modes via local env var

**A2 — About migration + chrome + SEO plumbing (~half session)**
1. `app/(marketing)/about/page.tsx` + metadata
2. `components/landing/legacy-hash-redirect.tsx` + mount on root
3. Footer multi-column (EN branch only)
4. `app/sitemap.ts` + `config/index.ts` + `app/layout.tsx` JSON-LD text
5. Blog `/#` link sweep
6. QA: full nav, unset-var build = MVP default, `/sk` re-check

**A3 — Animations + perf (~half session)**
1. skills-bg.webm move into `projects.tsx` + removal from `skills.tsx`
2. `components/main/cosmic-nebula.tsx` (R3F nebula, lazy mount, reduced-motion fallback, mobile cap)
3. Lighthouse pass on preview (`/` + `/about`), mobile check
4. Final FULL/MVP preview review → branch ready for launch merge

---

## Risks & Gotchas

| Risk | Mitigation |
|---|---|
| `/sk` breakage (shared navbar/footer branch on `pathname.startsWith("/sk")`) | Touch EN branches only; `SK_NAV_LINKS` + `components/sk/` untouched; explicit `/sk` QA every session |
| SEO ranking loss (root content changes 100%) | Content moved wholesale unedited to `/about`; transitional keywords in root metadata; internal links (nav/trust-bar/footer) to `/about`; GSC re-crawl; accept temporary dip |
| Dead `/#...` inbound anchors | `LegacyHashRedirect` (only mechanism that works for fragments); new landing avoids the 7 legacy ids |
| Footer `logoHref="/#home"` dead-scroll | New hero keeps `id="home"` |
| FULL mode leaking to prod | Default = `mvp` when var unset; verified via unset-var preview build |
| /about perf (8 sections + 3 videos + nebula) | Nebula lazy-mounts; `preload="none"` on moved video; /about isn't the SEO-critical entry |
| Copy drift vs portal reality | Free-tools/product cards import counts from `lib/portal/plans.ts` + `lib/portal/toolkit-skills.ts` |
| Payments pivot invalidating landing | No pricing table anywhere; credits strip is copy-only |

---

## QA / Verification Checklist (per session + pre-launch)

- [ ] `/sk` renders identically (nav, footer, content)
- [ ] `/blog` + blog post pages fine; no `/#` legacy links remain
- [ ] MVP mode = default with NO env var set (prod simulation)
- [ ] FULL mode renders all 5 products live (preview var)
- [ ] Legacy anchors `/#services` etc. land on `/about#...`
- [ ] `id="home"` present on new hero (footer logo link)
- [ ] Lighthouse ≥ current baseline on `/`; `/about` acceptable
- [ ] Reduced-motion → static nebula fallback; mobile particle cap works
- [ ] Sitemap includes `/about`; root metadata has hreflang cluster
- [ ] No portal (`app/portal/*`, `app/command-center/*`) files touched in Phase A

---

*Document v2.0 — July 16, 2026. Supersedes v1.0 (April 12, 2026). Decisions locked with Martin 2026-07-16; execution starts Phase A session A1.*
