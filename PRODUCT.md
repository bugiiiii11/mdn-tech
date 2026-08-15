# Product

## Register

brand

<!-- The marketing site (mdntech.org: landing, /about, /blog, /sk) is the design-critical
surface and carries the default register. The portal (app.mdntech.org) and Command Center
(admin.mdntech.org) are product-register surfaces; override per-task when working there. -->

## Users

- **Primary — business owners and operators** (SMB founders, marketers, e-commerce and
  service businesses). Semi-technical at best. They arrive from a search like "AI chatbot
  for my website" wanting a result, not a technology. Self-serve by preference:
  price-sensitive, allergic to "book a demo" walls, willing to try before paying.
- **Secondary — developers using Claude Code** (ToolKit audience). Highly technical,
  marketing-skeptical. They respond to specifics: MIT license, free forever, no account,
  one-line install. ToolKit is the top-of-funnel gift that earns trust for the paid tools.
- **Tertiary — Slovak SMBs** on /sk (agency services: web, SEO, automation). Separate
  audience, separate language, separate funnel — /sk copy never mixes with the product site.

## Product Purpose

M.D.N Tech is a self-service platform of five AI tools under one account and one credit
balance: ChatKit (embeddable AI chatbot trained on your content — live), ToolKit (free
Claude Code skills — live), SignaKit, MarketKit, TechKit (coming). The marketing site's
job is to (1) rank organically for each product's keyword cluster, (2) explain each
product plainly enough that a visitor can decide alone, and (3) convert to a free trial
with zero human touch. Success = organic signups, not booked calls.

## Brand Personality

**Confident engineer.** Precise, technical substance, no hype. "Built by engineers who
ship." Claims are plain and backed by specifics — numbers, license terms, named features.
Business-first language on the homepage (outcomes over jargon); full technical depth where
the audience is technical (ToolKit, blog). Calm authority, never salesy urgency.

## Anti-references

- **Generic AI-SaaS template feel** — the interchangeable gradient-hero landing page that
  could belong to any of a thousand AI startups. The site's cosmic identity must frame
  real content, not stand in for it.
- **Misleading or inflated claims** — calling a trial "free tools", inflating team size,
  placeholder links (linkedin.com, example.com). The old template shipped these; never again.
- **Corporate enterprise stuffiness** — gated demos, "Book a call", contact-form walls.
  The entire premise is self-service; a human gate anywhere is a brand contradiction.
- **Empty spectacle** — sections that look impressive but say nothing (the pre-rework
  hero's failure: "Your Tools. Your Rules." told a first-time visitor nothing).

## Design Principles

1. **Every section earns its scroll.** Each landing section either explains a product or
   removes a doubt. No decorative filler sections.
2. **Specifics are the brand.** 21 skills, 30 trial messages, MIT licensed, one line of
   code. Numbers and named features over adjectives — a confident engineer shows receipts.
3. **Self-service all the way down.** Every CTA leads to something the visitor can do
   alone, right now. Never a contact gate on the product site.
4. **The cosmos is the stage, not the show.** The blackhole and starfield frame content
   and set mood; they never substitute for substance or wash out legibility.
5. **Write for the buyer, build for the crawler.** One keyword cluster per surface,
   headings that carry meaning, schema wherever it is honest (Organization, FAQPage,
   SoftwareApplication).

## Accessibility & Inclusion

- WCAG 2.1 AA target. On the dark cosmic background the standing risk is muted gray body
  text — body copy must hold ≥4.5:1 against #030014 (gray-400 is the floor; prefer
  gray-300 for paragraphs).
- Reduced-motion alternatives for all framer-motion reveals and background videos
  (`prefers-reduced-motion`: crossfade or instant, videos paused/postered).
- Semantic heading hierarchy: exactly one h1 per page; sections are h2 with meaningful,
  keyword-bearing text.
- English and Slovak surfaces are fully separate hreflang-linked trees; language never
  mixes within a page.
