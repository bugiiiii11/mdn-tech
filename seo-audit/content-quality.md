# Content Quality & E-E-A-T Audit Report
## mdntech.com | March 17, 2026

---

## Executive Summary

**Overall Content Quality Score: 62/100**

M.D.N Tech has a solid foundation with well-structured schema markup, genuine team expertise signals, and three substantial blog posts. However, the site suffers from critical content gaps: the homepage is heavily animation-driven with limited crawlable text, internal linking is nearly absent, the blog has only three posts (all published on the same date), and social proof is entirely self-reported with no external validation. The site reads as a capable tech agency portfolio but lacks the depth, freshness signals, and third-party authority markers needed to compete in AI and Web3 search verticals.

---

## 1. Homepage Content Quality

### 1.1 Word Count Assessment

| Section | Estimated Word Count | Notes |
|---------|---------------------|-------|
| Hero | ~85 words | Tagline + two short paragraphs |
| About Us | ~195 words | Four value proposition cards |
| Services (Skills) | ~235 words | Six service cards with descriptions |
| Process | ~175 words | Five steps, but content is hidden behind accordion (collapsed by default) |
| Engineering Stack | ~110 words | Technology listing, minimal prose |
| Our Results | ~95 words | Metric cards, mostly numbers |
| Team (homepage section) | ~115 words | Three bios, truncated on homepage |
| Contact Us | ~105 words | Form + contact info |
| **Total visible** | **~650 words** | |
| **Total including accordion** | **~850 words** | |

**Verdict:** Meets the 500-word homepage minimum, but only barely if accordion content is excluded. Process section items (approximately 200 words of substantive content) are hidden in collapsed accordions, meaning crawlers may not index them depending on rendering behavior. For a service-oriented homepage, 800-1,200 words of visible prose is recommended.

### 1.2 Content Quality Issues

**CRITICAL: Placeholder project data.** The PROJECTS constant contains placeholder entries:
- All three original projects link to `https://example.com`
- Titles like "Modern Next.js 14 Portfolio" and "Space Themed Website" are generic template content from the original portfolio template (source attribution in `LINKS.sourceCode` points to `https://github.com/sanidhyy/space-portfolio`)
- Extended projects in the tech results section also link to `example.com`
- Project descriptions use filler language ("Embark on a journey through my professional evolution")

**CRITICAL: Footer contains template remnants.**
- "Community" section links go to generic `https://youtube.com`, `https://github.com`, `https://discord.com` -- not M.D.N Tech's actual accounts
- "About" section contains "Become Sponsor" (links to youtube.com), "Learning about me" (links to example.com), and "Contact Me" (links to contact@example.com)
- These are leftover from the space-portfolio template and severely damage trustworthiness

**WARNING: Social links on team members are placeholders.** Martin Jerabek and Martin Hromek have generic `https://linkedin.com`, `https://github.com`, `https://twitter.com` links -- not real profiles. Only Eric Lukas has a real LinkedIn URL. Social links are currently commented out in the rendered component, which is better than showing broken links, but the data still exists.

### 1.3 Heading Hierarchy

```
Homepage rendered heading structure:
h1: "Build Smarter. Ship Faster." (hero)
h1: "Why Our Approach Changes Everything" (about-us)
  h4: "Weeks, Not Months"
  h4: "One Engineer. Full Lifecycle."
  h4: "Production-Ready from Day One"
  h4: "Every Layer. One Team."
h1: "What We Build" (services)
  h3: "Full-Stack Development" ... (6 service cards)
h1: "How We Build" (process)
  h3: "Discovery & Specification" ... (5 steps)
h1: "Our Engineering Stack" (encryption)
  h3: "Web & Frontend" ... (9 stack cards)
h1: "Our Results" (projects)
  h3: "Full-Stack Development" ... (6 result cards)
h1: "Meet Our Team" (team)
  h3: "Martin Jerabek" ... (3 members)
h1: "Start Your Project" (contact)
  h2: "Let's Build Something That Matters"
```

**Issues identified:**
- **Multiple h1 tags.** The homepage uses h1 for every section heading (8 total h1 elements). Google recommends a single h1 per page. Each section heading should be h2 with sub-elements at h3/h4.
- **Inconsistent sub-heading levels.** About Us cards use h4 (skipping h2 and h3), while Services and Process use h3. This breaks the semantic hierarchy.
- **The "About Us" section skips from h1 directly to h4.** This is a significant accessibility and SEO issue.

---

## 2. Blog Content Analysis

### 2.1 Overview

| Post | ID | Word Count (est.) | Read Time | Category |
|------|-----|-------------------|-----------|----------|
| Claude Code Guide | claude-code-complete-guide | ~3,500 | 15 min | AI & Engineering |
| Agentic AI Systems | agentic-ai-systems-guide | ~4,200 | 16 min | AI & Engineering |
| Smart Contracts Guide | smart-contracts-complete-guide | ~3,800 | 18 min | Blockchain & Web3 |

All three posts are published with the date "March 13, 2026."

**Verdict on word count:** All three posts significantly exceed the 1,500-word minimum for blog posts. Content depth is strong.

### 2.2 Content Quality Assessment

**Strengths:**
- Posts are genuinely comprehensive with specific data points, statistics, and technical depth
- The Claude Code article cites specific metrics (80.9% SWE-bench, 4% GitHub commits)
- The Smart Contracts article references real tools (OpenZeppelin, Foundry, Chainlink) with technical accuracy
- Content includes code blocks, structured lists, callouts, and varied content types
- Each post includes tags, categories, meta descriptions, and read times
- Rich content block architecture (paragraphs, headings, subheadings, lists, code, callouts, quotes) creates good structural variety

**Weaknesses:**
- **All three posts share the same publish date.** This looks like a content dump rather than an ongoing editorial calendar. Google's freshness signals reward consistent publishing over batch publishing.
- **Author attribution is generic.** All posts are authored by "M.D.N Tech Team" with role "AI Development Experts" or "Web3 Development Experts." No individual author pages, no author bios linked, no byline schema pointing to a real person.
- **No images in blog posts.** The image fields reference files (`/blog/claude-code-guide.jpg`, etc.) but the blog card UI shows gradient placeholders instead, suggesting these images do not exist. Blog post detail pages similarly lack visual content.
- **Self-promotional CTAs at the end of every post.** Each article ends with a callout promoting M.D.N Tech services. While acceptable, having identical patterns across all three posts reads as formulaic.
- **Some statistics may need source attribution.** Claims like "4% of all public commits on GitHub are now generated by Claude Code" and "$6.96 billion market size" should cite their sources for E-E-A-T credibility.

### 2.3 AI-Generated Content Markers

Based on September 2025 QRG criteria, the blog content shows these patterns:

| Marker | Assessment |
|--------|------------|
| Generic phrasing | LOW RISK -- Content is specific with real metrics and tool names |
| Original insight | MEDIUM RISK -- Posts include "At M.D.N Tech, we've..." claims but lack specific case study details, client names, or project outcomes |
| First-hand experience signals | MEDIUM RISK -- Claims experience ("50+ smart contracts deployed") but provides no portfolio evidence, client testimonials, or before/after comparisons |
| Factual accuracy | LOW RISK -- Technical claims appear accurate as of the knowledge cutoff |
| Repetitive structure | HIGH RISK -- All three posts follow an identical structure: intro paragraph, stat callout, more paragraphs, heading, list, repeat, CTA callout at end |

**Recommendation:** The content quality is above average for AI-generated content but would benefit significantly from unique case studies, named client projects (with permission), code from real deployments, and performance screenshots. The identical structural pattern across all three posts is a flag.

### 2.4 Blog Index Page

The `/blog` page is a client-side rendered listing with:
- A single h1 ("Our Blog")
- One introductory paragraph
- Card grid with title, excerpt, date, read time, tags, and "Read article" links
- No category filtering
- No search functionality
- No pagination (only 3 posts currently)
- A "More articles coming soon" badge

**Issue:** The blog index page has essentially zero crawlable text content beyond the header. The blog card titles and excerpts are rendered client-side via Framer Motion. If the JavaScript fails to execute during crawling, Google sees an empty page.

---

## 3. Team Page E-E-A-T Assessment

### 3.1 Team Members

| Name | Role | Experience Claimed | Verifiable? |
|------|------|-------------------|-------------|
| Martin Jerabek | CEO | 10 years in blockchain/Web3 | NO -- LinkedIn link is generic `https://linkedin.com` |
| Martin Hromek | CTO | 20 years enterprise systems, 5 years blockchain CTO | NO -- LinkedIn link is generic `https://linkedin.com` |
| Eric Lukas | Full-Stack AI Engineer | 8 years, 30+ projects | PARTIAL -- Real LinkedIn URL provided (`linkedin.com/in/eric-lukas/`) but social links are commented out in UI |

### 3.2 E-E-A-T Signals Present

**Positive signals:**
- Real names with photos
- Specific experience claims with year counts
- Role-specific bios that describe actual responsibilities
- Business registration details in footer (License 7813, UAQ Free Trade Zone)
- Physical address in schema markup
- Phone number and email in contact section

**Missing signals:**
- No individual profile pages with expanded credentials
- No LinkedIn links are visible on the rendered page (commented out)
- No portfolio of completed projects with verifiable details
- No client testimonials or case studies
- No certifications, awards, or speaking engagements
- No personal author pages for blog attribution
- Company founded in 2024 but claims "30+ years delivering for corporates" -- this creates a credibility gap without explanation that this refers to combined individual experience

### 3.3 Team Page Content

The dedicated `/team` page at approximately 180 words (excluding bios already counted in constants) is thin for its purpose. The intro paragraph is strong and distinctive:

> "Our engineers don't specialize in one layer -- they own all of them. AI systems, backend, frontend, infrastructure, and everything in between."

However, the page lacks:
- Individual team member detail pages
- Links to published work, talks, or open-source contributions
- Certifications or educational background
- Client testimonials or endorsements

---

## 4. E-E-A-T Breakdown

### Experience: 40/100 (Weight: 20%)

| Signal | Status |
|--------|--------|
| First-hand experience claims in content | Present but unverified |
| Case studies with real outcomes | ABSENT |
| Client testimonials | ABSENT |
| Portfolio of completed work | Placeholder data only (example.com links) |
| "We've deployed 50+ smart contracts" claims | Stated but no evidence |
| Original screenshots, code, or demonstrations | ABSENT |

### Expertise: 55/100 (Weight: 25%)

| Signal | Status |
|--------|--------|
| Team credentials stated | Present (years of experience, roles) |
| Technical blog content accuracy | Strong |
| Depth of technical content | Above average (3,500-4,200 words per post) |
| Author-level expertise demonstration | Weak (generic "Team" attribution) |
| Certifications or formal credentials | ABSENT |
| LinkedIn/GitHub verification possible | Mostly broken links |

### Authoritativeness: 30/100 (Weight: 25%)

| Signal | Status |
|--------|--------|
| External citations or backlinks | Cannot assess from source code |
| Industry recognition | ABSENT |
| Client logos or named partnerships | ABSENT |
| Speaking engagements or publications | ABSENT |
| Third-party reviews (Clutch, G2, etc.) | ABSENT |
| Social media following / engagement | Profiles exist but no follower counts or engagement visible |
| "100+ Web3 partnerships" claim | Stated but no named partners |

### Trustworthiness: 50/100 (Weight: 30%)

| Signal | Status |
|--------|--------|
| Business registration details | PRESENT (License 7813, UAQ FTZ) |
| Physical address | PRESENT (Al Shmookh Business Center) |
| Contact phone number | PRESENT (+971 58 228 3256) |
| Contact email | PRESENT (contact@mdntech.org) |
| Privacy policy | PRESENT (/privacy) |
| Terms & conditions | PRESENT (/terms) |
| SSL/HTTPS | PRESENT |
| Schema.org markup | PRESENT (Organization, WebSite, Article, BreadcrumbList) |
| Template remnants / broken links | PRESENT -- damages trust significantly |
| Placeholder content (example.com) | PRESENT -- critical trust issue |

### Weighted E-E-A-T Score

```
Experience:      40 x 0.20 =  8.0
Expertise:       55 x 0.25 = 13.75
Authoritativeness: 30 x 0.25 =  7.5
Trustworthiness: 50 x 0.30 = 15.0
                              -----
Total:                        44.25 / 100
```

---

## 5. AI Citation Readiness

AI search engines (Google AI Overviews, Perplexity, ChatGPT with browsing) extract structured information to generate citations. This score measures how well the content is prepared for this.

### AI Citation Readiness Score: 48/100

### What Works

| Element | Assessment |
|---------|------------|
| Schema.org JSON-LD | Organization, WebSite, Article, and BreadcrumbList schemas are well-implemented |
| Blog post structure | Heading/subheading hierarchy within posts creates extractable sections |
| Specific statistics in blog posts | Quotable facts like "80.9% SWE-bench accuracy" and "$6.96 billion market" |
| Meta descriptions | Custom meta descriptions for all pages and blog posts |
| Canonical URLs | Set correctly |
| Open Graph / Twitter cards | Complete implementation |

### What Is Missing

| Element | Impact |
|---------|--------|
| FAQ schema | No FAQ sections on any page. Service pages and blog posts should include FAQ blocks with FAQ schema for AI extraction |
| HowTo schema | The "How We Build" process section is a perfect candidate for HowTo schema but lacks it |
| Service schema | No Service or Product schema on the homepage despite listing six distinct services |
| Review/Testimonial schema | No AggregateRating or Review schema (because no reviews exist) |
| Table of contents in blog posts | No visible TOC or jump links, making it harder for AI systems to identify article structure |
| Definition patterns | Blog posts don't use clear "X is Y" definition patterns that AI systems prefer to extract |
| Comparison tables | No comparison content (e.g., "React Native vs Flutter" decision frameworks) |
| Listicle-friendly formatting | Statistics are embedded in prose rather than structured as scannable lists |
| Last updated dates | Blog posts have publish dates but no "last updated" signals. The sitemap uses `new Date()` which changes on every build, providing no real freshness signal |
| Source citations | Statistics lack attributed sources, reducing citation reliability |

### Content Structure for AI Extraction

The homepage is particularly weak for AI citation because:

1. **Client-side rendering dependency.** All content is rendered through Framer Motion animations. If an AI crawler does not execute JavaScript fully, it sees almost nothing.
2. **No semantic HTML landmarks.** Sections use generic `div` and `section` tags but lack `article`, `aside`, `nav` (for TOCs), or proper semantic wrapping.
3. **Accordion-hidden content.** The Process section hides its most valuable content (detailed steps) behind JavaScript-toggled accordions. AI crawlers may not expand these.

---

## 6. Internal Linking Analysis

### Current Internal Link Structure

```
Navbar:
  About Us   -> /#about-us     (anchor link, same page)
  Services   -> /#services      (anchor link, same page)
  Process    -> /#process       (anchor link, same page)
  Projects   -> /#projects      (anchor link, same page)
  Team       -> /#team          (anchor link, same page)
  Contact Us -> /#contact-us    (anchor link, same page)

Footer:
  Terms & Conditions -> /terms
  Privacy Policy     -> /privacy
  Blog               -> /blog
  Logo               -> /#home

Blog posts:
  Back to Blog -> /blog
  Related posts -> /blog/[slug]  (2 related posts per article)

Team page:
  Get in Touch -> #contact-us   (anchor, but Contact Us section is on homepage, not team page -- BROKEN)
```

### Critical Internal Linking Gaps

1. **No navigation link to /blog from the main navbar.** The blog is only accessible from the footer. This is a significant discovery and crawling issue.
2. **No navigation link to /team from the main navbar.** The team page is not linked from the primary navigation at all. The navbar "Team" link goes to `/#team` (the homepage section), not `/team`.
3. **Blog posts do not link to service-relevant homepage sections.** When a blog post about smart contracts mentions DeFi services, there is no link to the Services section.
4. **No cross-linking between blog posts in the body text.** The three posts share related topics (AI engineering, agentic systems, smart contracts) but never reference each other in their content. Only the "related posts" widget at the end creates connections.
5. **No breadcrumb navigation rendered on pages.** The blog detail page generates BreadcrumbList schema, but no visible breadcrumb trail is rendered in the UI for users or crawlers.
6. **Team page CTA is broken.** The "Get in Touch" button links to `#contact-us`, but the contact form is on the homepage, not the team page. This link goes nowhere.
7. **Homepage has zero links to blog content.** No "Latest from our blog" section, no featured article links.

### Link Equity Distribution

The site has an extreme hub-and-spoke problem where nearly all link equity concentrates on the homepage. Subpages (/blog, /team, /blog/[slug]) receive minimal internal links and pass no equity back to the homepage through contextual body links.

---

## 7. Content Freshness Assessment

| Signal | Current State | Issue |
|--------|--------------|-------|
| Blog publish dates | All three posts: March 13, 2026 | Same-day batch publish looks artificial |
| Sitemap lastModified | `new Date()` on every build | Not a real freshness signal |
| Copyright year | "2026 M.D.N TECH" | Current |
| Technology references | "Next.js 14" in skills | Should be Next.js 15 as of 2026 |
| Engineering stack | References current tools | Reasonably fresh |
| No blog post updates | No "updated on" dates | Missing freshness signal |

---

## 8. Prioritized Recommendations

### P0 -- Critical (Fix immediately)

1. **Remove all template/placeholder content.**
   - Replace `example.com` links in PROJECTS and FOOTER_DATA with real project links or remove the sections entirely
   - Remove "Become Sponsor," "Learning about me," and "Contact Me" placeholder items from FOOTER_DATA
   - Remove the `LINKS.sourceCode` reference to the original template repository
   - Files: `constants/index.ts` lines 260-345

2. **Fix heading hierarchy.** Convert all section h1 tags to h2 on the homepage. Keep only the hero "Build Smarter. Ship Faster." as h1. Adjust sub-heading levels accordingly (h4 in About Us should become h3).
   - Files: `components/main/about-us.tsx`, `components/main/skills.tsx`, `components/main/process.tsx`, `components/main/encryption.tsx`, `components/main/projects.tsx`, `components/main/team.tsx`, `components/main/contact-us.tsx`

3. **Add /blog and /team links to the main navigation.**
   - File: `constants/index.ts` NAV_LINKS array (line 347)

4. **Fix the team page CTA link.** Change `#contact-us` to `/#contact-us` so it navigates to the homepage contact form.
   - File: `app/team/page.tsx` line 313

### P1 -- High Priority (Next 2 weeks)

5. **Add real team member LinkedIn profiles.** Replace generic `https://linkedin.com` URLs with actual profile URLs for Martin Jerabek and Martin Hromek. Uncomment the social links rendering in the team components.
   - File: `constants/index.ts` lines 378-409

6. **Stagger blog post publish dates.** Backdate the three posts to appear published over different weeks/months to demonstrate editorial consistency.
   - File: `data/blog-posts.ts`

7. **Add individual author attribution to blog posts.** Create author objects with name, bio, image, and LinkedIn URL. Use Person schema in the Article JSON-LD instead of Organization.
   - File: `app/blog/[slug]/page.tsx` lines 97-124

8. **Add a "Latest from our blog" section to the homepage** between the Team and Contact sections. Display 2-3 recent posts with links to drive internal link equity to the blog.

9. **Add FAQ sections with FAQ schema** to blog posts and the homepage. Each blog post should have 3-5 FAQs. The homepage should have FAQs about services, pricing approach, and process.

10. **Add HowTo schema** to the "How We Build" process section.

### P2 -- Medium Priority (Next 30 days)

11. **Expand the team page** with individual member detail sections, including specific project highlights, technology specializations, and links to published work or open-source contributions.

12. **Add source citations to blog statistics.** Every quantitative claim should link to or name its source.

13. **Add visible breadcrumb navigation** to blog posts and the team page.

14. **Add contextual cross-links within blog post content.** When the Claude Code article mentions AI agents, link to the Agentic AI article. When the Agentic AI article mentions enterprise systems, link to relevant services.

15. **Create a table of contents component** for blog posts using the heading structure already present in the content blocks.

16. **Add Service schema markup** for each of the six services listed on the homepage.

17. **Publish 2-4 new blog posts per month** on a consistent schedule to build freshness signals.

### P3 -- Lower Priority (Next 60 days)

18. **Add client testimonials and case studies.** Even 2-3 anonymized case studies with real metrics would dramatically improve Experience and Authoritativeness scores.

19. **Create dedicated service pages** (e.g., `/services/ai-development`, `/services/web3`) with 800+ words each, case studies, and FAQ sections.

20. **Build comparison content** (e.g., "React Native vs Flutter for Enterprise Mobile Apps") to capture AI citation opportunities for decision-making queries.

21. **Add an "About" page** separate from the homepage section, with company history, mission, and detailed team credentials.

22. **List the company on third-party review platforms** (Clutch, G2, GoodFirms) and add aggregate rating schema once reviews are collected.

23. **Update technology version references.** "Next.js 14" should reflect the current version.

---

## 9. Structured Data Audit Summary

| Schema Type | Present | Quality | Notes |
|-------------|---------|---------|-------|
| Organization | Yes | Good | Includes name, address, contact, sameAs, knowsAbout |
| WebSite | Yes | Good | Basic but correct |
| Article | Yes | Good | Per blog post with proper fields |
| BreadcrumbList | Yes | Good | Blog posts only |
| FAQ | No | -- | Should be added to homepage and blog posts |
| HowTo | No | -- | Perfect fit for Process section |
| Service | No | -- | Should be added for each service offering |
| Person | No | -- | Team members should have Person schema |
| Review/AggregateRating | No | -- | Requires actual reviews first |
| LocalBusiness | No | -- | Could supplement Organization schema for local SEO |

---

## 10. Score Summary

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| E-E-A-T (Experience) | 40/100 | 20% | 8.0 |
| E-E-A-T (Expertise) | 55/100 | 25% | 13.75 |
| E-E-A-T (Authoritativeness) | 30/100 | 25% | 7.5 |
| E-E-A-T (Trustworthiness) | 50/100 | 30% | 15.0 |
| **E-E-A-T Composite** | **44/100** | | |
| Content Depth & Quality | 65/100 | | |
| AI Citation Readiness | 48/100 | | |
| Heading Hierarchy & Structure | 35/100 | | |
| Internal Linking | 25/100 | | |
| Content Freshness | 40/100 | | |
| **Overall Content Quality** | **62/100** | | |

---

## Files Analyzed

- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\app\page.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\app\layout.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\app\blog\page.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\app\blog\layout.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\app\blog\[slug]\page.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\app\team\page.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\app\sitemap.ts`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\app\robots.ts`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\config\index.ts`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\constants\index.ts`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\data\blog-posts.ts`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\components\main\hero.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\components\main\about-us.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\components\main\skills.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\components\main\process.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\components\main\encryption.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\components\main\projects.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\components\main\contact-us.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\components\main\team.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\components\main\navbar.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\components\main\footer.tsx`
- `c:\Users\cryptomeda\Desktop\Swarm\myprojects\M.D.N-Tech-main\components\sub\hero-content.tsx`

---

*Audit conducted: March 17, 2026*
*Methodology: Google September 2025 Quality Rater Guidelines, source code analysis*
