# Content Quality & E-E-A-T Audit — mdntech.org

**Audit date:** 2026-08-19
**Scope:** 14 live pages (rendered HTML fetched 2026-08-19), Google September 2025 Quality Rater Guidelines
**Site model:** Hybrid — EN side is B2B AI products (ChatKit "AI chatbot for website" SaaS, ToolKit "Claude Code skills" directory); /sk side is a Slovak web/CRM/AI-chatbot agency for SMEs.

This report replaces the March 2026 audit in full. Almost none of that audit's findings still apply: the template remnants, example.com placeholders, multiple-H1 sections, missing nav links and batch-dated blog posts are all gone. The site has been rebuilt around a product-first EN funnel and an honest, keyword-aligned /sk agency page.

---

## Executive Summary

**Content Quality Score: 74/100** (up from 62 in March)

The two money pages — /chatkit (4,700+ words) and /toolkit (5,600+ words) — are among the best-executed SaaS content pages this auditor has scored: exhaustive topical coverage, "honest limits" sections that competitors do not publish, FAQPage/SoftwareApplication/ItemList schema, and copy written demonstrably from the product code rather than from marketing abstractions. The /sk agency page carries its head keywords in the title, H1 and services H2 (deliberately, post-rewrite — these are correct and should not be touched), names its founder with a verifiable career history, publishes prices, and answers the awkward UAE-seat and VAT questions directly in an FAQ. Server-side rendering is complete — every word is in the raw HTML — and robots.txt explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, CCBot and peers.

Three things hold the score down:

1. **The EN /about page still carries the old unverifiable numbers block** ("Smart Contracts Deployed 50+", "Web3 Partnerships 100+", "Years Delivering For Corporates 30+", "Community members 100k+") — the exact class of claim the /sk honesty pass removed. The site now contradicts its own trust standard depending on language.
2. **The blog is stale**: newest post March 13, 2026 (5+ months), titles promise "in 2026" completeness, one post contains a "Latest Features (March 2026)" section, and "More articles coming soon" has sat unfulfilled since launch.
3. **Authority rests on one named human.** Martin Jeřábek is the only named person on the entire site; blog authorship is a generic Organization ("M.D.N Tech Team"); there is no external validation of any kind (reviews, mentions, press, named clients on the EN side).

---

## Per-Page Table

Word counts are full rendered body text including nav/footer chrome (footer ≈ 150–200 words).

| Page | Title (len) | Meta description (len) | H1 | Words | Verdict |
|---|---|---|---|---|---|
| / | M.D.N Tech \| AI Chatbot for Your Website & Free AI Tools (56) | Good, keyword-led (128) | "Grow Your Business with AI." | 1,724 | **Good.** Title carries the keyword; H1 is brand-generic (Low finding). FAQPage schema, 10 FAQs, honest product-status copy. |
| /about | About Us \| The Team Behind the Tools — M.D.N Tech (49) | Slightly long (168) | "The Team Behind the Tools" | 1,536 | **Mixed.** Solid process/stack content, but the "Our Results" unverifiable numbers block and agency-era positioning contradict the product-first EN site (High finding). |
| /chatkit | ChatKit: AI Chatbot for Your Website, No Developer Needed (57) | Excellent (146) | "An AI Chatbot for Your Website That Answers Only From Your Content" | 4,714 | **Excellent.** Head keyword in title + H1 + H2s, 12-question FAQ, FAQPage + SoftwareApplication schema, "Honest limits" section. Best page on the site. |
| /toolkit | Claude Code Skills: Curated Directory, Free, No Account (55) | Excellent (151) | "Claude Code Skills: What They Are and Which Ones to Install" | 5,598 | **Excellent.** Definitional copy built for extraction, 11-question FAQ, ItemList schema, 23 attributed external author links, self-interrogating objections section. |
| /sk | Tvorba webu, CRM systémov a AI chatbotov pre firmy \| M.D.N Tech (63) | Good (159) | "Web, CRM a AI chatboty pre rast vášho biznisu." | 1,599 | **Very good.** H1 and the "Čo pre vás urobíme — web, SEO, CRM a AI chatboty" H2 carry the head keywords as intended — correct, leave as-is. Founder named with ČSOB history, prices published, UAE/VAT FAQ, ProfessionalService + FAQPage schema. One bug: `<html lang="en">` (High finding). |
| /sk/referencie/royal-stroje | Prípadová štúdia: Royal Stroje — web, CRM a chatbot (64) | Good (151) | "Royal Stroje: web, CRM a AI chatbot pre požičovňu stavebných strojov" | 563 | **Good, slightly thin.** Honest by design — rankings deliberately not claimed and the page says so explicitly; that stance is correct and must stay. Article + BreadcrumbList schema, fresh (2026-08-16). Could grow with real evidence only (client quote, timeline, screenshots). |
| /blog | Blog \| M.D.N Tech (17) | Fine (109) | "AI Engineering, In Practice" | 288 | **Adequate.** Functional index for 3 posts; title tag is a wasted keyword slot; "More articles coming soon" badge is now 5 months old. |
| /blog/claude-code-complete-guide | 83 chars, keyword-strong | Good (159) | Matches title | 2,033 | **Good content, aging fast.** "Latest Features (March 2026)" section and "in 2026" framing decay monthly. No named author, zero external source links. |
| /blog/agentic-ai-systems-guide | 96 chars (long) | Long (192) | Matches title | 2,190 | **Good.** Deep, structured, accurate. Same author/citation/freshness gaps. |
| /blog/smart-contracts-complete-guide | 88 chars | Long (178); claims "lessons from 50+ deployments" | Matches title | 2,099 | **Good.** Technically strong. Meta desc repeats an unverifiable claim; no Related Articles block (other two posts have one). |
| /privacy | Privacy Policy \| M.D.N Tech (27) | Fine (133) | "Privacy Policy" | 2,129 | **Fine.** Thorough, includes a dedicated ChatKit data section — genuinely product-specific, not boilerplate. |
| /terms | Terms & Conditions \| M.D.N Tech (31) | Fine (145) | "Terms & Conditions" | 2,732 | **Fine.** Complete, well-structured. |
| /sk/ochrana-osobnych-udajov | 36 chars | Fine (135) | "Ochrana osobných údajov" | 1,995 | **Fine.** True Slovak counterpart of /privacy incl. ChatKit section; cross-links /privacy. `lang="en"` bug applies. |
| /sk/obchodne-podmienky | 31 chars | Fine (136) | "Obchodné podmienky" | 2,677 | **Fine.** Cross-links /terms. `lang="en"` bug applies. |

**Word-count minimums:** every page clears its floor (homepage 500, service/product 800, blog 1,500). The only pages under 800 are the blog index (288 — an index, exempt) and the Royal Stroje case study (563 — above the 500 floor, below its potential).

**Heading hierarchy:** exactly one H1 per page, sitewide. Logical H2 → H3 → H4 nesting on all 14 pages. The March audit's 8-H1 homepage is fully fixed. No issues found.

**Keyword alignment vs target clusters (given):**
- /chatkit = "AI chatbot for website": in title, H1, first H2 ("Add an AI chatbot to your website in four steps"), section H2s ("What an AI chatbot costs…", "AI customer support for small businesses"), and FAQ phrasing ("add an AI chatbot to my website"). **Fully aligned.**
- /toolkit = "Claude Code skills": in title, H1, and six H2s ("What a Claude Code skill actually is", "How to install a Claude Code skill in one command", "Claude Code MCP servers…", "Claude Code skills: the questions we actually get"). **Fully aligned.**
- /sk = "tvorba webstránok / CRM systém / AI chatbot": title leads with "Tvorba webu, CRM systémov a AI chatbotov"; H1 and the services H2 carry the head terms; the dedicated "CRM systém presne pre vašu firmu" H2 targets the CRM cluster on its own. **Fully aligned — evaluated as correct per the deliberate rewrite; no further changes recommended.**

---

## Findings

### Critical

None. (The March audit's critical items — placeholder projects, template footer links, example.com URLs — are confirmed removed.)

### High

**H-1. All four /sk pages declare `<html lang="en">` while serving Slovak content.**
Evidence: `page_sk.html`, `page_sk_referencie_royal-stroje.html`, `page_sk_ochrana-osobnych-udajov.html`, `page_sk_obchodne-podmienky.html` all open with `<html lang="en">`. The hreflang annotations (head + sitemap) correctly declare `sk`, so the two signals contradict each other.
Impact: weakens language targeting for the exact market /sk was rewritten to win (google.sk queries), mis-cues screen readers and translation tooling, and hands an inconsistency to any quality classifier comparing declared vs detected language.
Fix: set `lang="sk"` on the /sk route layout (in Next.js, the `/sk` segment needs its own `<html>` lang or a lang-swapping mechanism in the root layout). One-line class of fix; highest ratio of impact to effort in this report.

**H-2. /about retains the pre-honesty-pass unverifiable numbers block, contradicting the standard the site itself now sets.**
Evidence: "Our Results" section lists "Smart Contracts Deployed 50+", "Web3 Partnerships 100+", "Community members 100k+", "Years Delivering For Corporates 30+", "Corporate Clients Served 8", "Unity Games Built 5" — with zero named clients, projects, or links. Meanwhile the Royal Stroje case study states, in print: "Konkrétne pozície vo vyhľadávaní sem doplníme, až keď ich budeme vedieť doložiť dátami — rovnako ako čísla v sekcii výsledkov." The Slovak side refuses numbers it cannot prove; the English side publishes a wall of them. Related: the team section claims "five full-stack AI engineers today" but names exactly one person, and the page's middle half (Game Development, Unreal Engine 5, TGE launches, Telegram Mini Apps) still pitches the old custom-dev agency, diluting the product-company identity the homepage establishes.
Impact: this is the single largest E-E-A-T liability on the EN side. Per the Sept 2025 QRG, unsubstantiated experience claims are treated as a trust deduction, not a neutral; and the internal inconsistency is visible to any careful buyer who reads both languages.
Fix: apply the same honesty pass to /about that /sk received — remove or substantiate. Keep only what can be evidenced (e.g., ChatKit/ToolKit themselves, the GitHub repo, the founder's history) and cut or drastically slim the "Our Results" grid and the agency service catalogue that no longer matches the business. Do not replace the numbers with new numbers; the /sk approach ("live sites you can click") is the proven pattern.

**H-3. Blog freshness has expired against its own promises.**
Evidence: newest post 2026-03-13 (5+ months before audit date); all three posts have `dateModified` equal to `datePublished`; the flagship post is titled "…in 2026" and contains a "Latest Features (March 2026)" section that is now two Claude Code release cycles old; the index has displayed "More articles coming soon" since March. Both product pages link these posts as canonical supporting guides ("our complete guide to Claude Code").
Impact: for query spaces that move monthly (Claude Code features, agentic AI), a March snapshot decays visibly — and AI answer engines preferentially cite fresher sources for these topics. A "complete guide" that omits five months of releases becomes quietly inaccurate, which is worse than absent.
Fix (choose one, do it honestly): (a) update the Claude Code guide's features section and bump `dateModified` with a visible "Updated August 2026" line; or (b) retitle away from time-stamped completeness claims. Add a realistic cadence — even one post per quarter tied to actual product work (e.g., "How we built ChatKit's rate limiter" — the /chatkit page proves the material exists) beats aspirational monthly plans. Remove the "coming soon" badge until it is true.

### Medium

**M-1. No human authorship anywhere on the blog.**
Evidence: BlogPosting schema author is `{"@type":"Organization","name":"M.D.N Tech Team"}` on all three posts; no visible byline beyond the org; no author bio, no Person schema, no link from posts to the founder. The site's only named human (Martin Jeřábek, with a checkable ČSOB history and company LinkedIn) is never connected to the content that most needs expertise attribution.
Fix: attribute posts to a named person with a two-line bio and a link to /about (or the LinkedIn company page); switch schema author to Person. This is the cheapest available E-E-A-T uplift on the EN side.

**M-2. Zero external source citations in blog posts.**
Evidence: the only external links in all three post bodies are the footer's own GitHub/LinkedIn/X links. Yet the copy invokes "a 2025 METR study", "SWE-bench Verified", "Early adopters like Block and Apollo", enterprise adoption rates, and security statistics — all unlinked. Contrast: /toolkit links out 23 times to authors and Anthropic docs, which is exactly the right pattern.
Fix: link the named studies and benchmarks at first mention. Uncited statistics are both a QRG trust deduction and a missed AI-citation signal (answer engines favor pages that anchor claims).

**M-3. Product-availability copy contradicts itself between the homepage and /chatkit.**
Evidence: homepage FAQ — "Payment is not live yet — while checkout is being set up, credits are granted from inside the app and no card is charged today." /chatkit — "Neither payment nor the app itself is open yet… when ChatKit opens, sign-up and the free trial will need no card." One page says the app exists and grants credits; the other says it is not open. Both pages' primary CTAs render as "Coming soon" on a page targeting a commercial-intent keyword.
Fix: pick the true sentence and use it in both places; revisit weekly until launch. (The honesty itself is a strength — the inconsistency is the problem.)

**M-4. Royal Stroje case study is the thinnest substantive page (563 words) and carries no client voice.**
Evidence: Klient/Zadanie/Riešenie/Lokálne SEO structure is clean and the no-unproven-rankings stance is explicitly stated and correct — do not add ranking or traffic claims. But the page has no client quote, no delivery timeline, and only 3 images for a project spanning web + CRM + chatbot.
Fix (evidence-only additions, consistent with the honesty pass): a real, attributed one-sentence quote from the client if they will give one; a factual timeline ("brief to launch" dates); screenshots of the catalogue and CRM (one CRM screenshot already exists on /sk — reuse); a link to the live chatbot behavior. Also: three of the four /sk references (Royal Works, Good Hair by Zane, Kúrenie Turiec) have no case-study page — each is a future /sk/referencie/ URL that deepens the "Realizácie" cluster.

**M-5. The smart-contracts post's meta description publishes an unverifiable claim in the SERP itself.**
Evidence: "…and lessons from 50+ deployments." This is the /about numbers problem (H-2) leaking into a search snippet, where it cannot be contextualized at all.
Fix: rewrite the meta description around the post's real, checkable content (ERC standards, CEI pattern, VRF v2.5) when H-2 is addressed.

### Low

**L-1. Meta descriptions exceed the ~160-character display budget on three pages.** /about (168), agentic post (192), smart-contracts post (178). They will truncate mid-sentence; trim to ≤155.

**L-2. Homepage H1 is brand-generic.** "Grow Your Business with AI." carries no query language; the title tag and section H2s do the keyword work, and /chatkit owns the head term, so this is acceptable — noted only so nobody "fixes" the title tag instead.

**L-3. hreflang exists only for the / ↔ /sk pair.** The legal pages are true translations of each other and already cross-link (/privacy ↔ /sk/ochrana-osobnych-udajov, /terms ↔ /sk/obchodne-podmienky) but carry no hreflang annotations. Add the pairs in head + sitemap for completeness.

**L-4. Blog index is a wasted slot.** Title "Blog | M.D.N Tech" spends zero keywords (the H1 "AI Engineering, In Practice" is better than the title); 288 words with no topic/category framing; the smart-contracts post is also the only one without a Related Articles block. Retitle (e.g., "AI Engineering Blog: Claude Code, Agents & Web3 | M.D.N Tech"), add related-articles parity.

**L-5. Mild AI-phrasing markers in blog conclusions.** "isn't just another developer tool — it's a fundamental shift", "game-changer", "The question isn't whether… it's how quickly". Under the Sept 2025 QRG this content still passes — it is specific, discloses its bias ("Full disclosure of our bias: every project we ship — including this website — is built with Claude Code"), and contains genuine first-hand workflow detail — but the closing paragraphs are the weakest, most template-shaped text on the site. Tightening them raises the floor.

---

## E-E-A-T Assessment

### Experience — 72/100 (weight 20%)

The strongest dimension, and the site's genuine differentiator. /chatkit is written from the product's actual field names, pixel sizes, rate-limit numbers and failure modes ("fail open on an infrastructure error", "only the first 5 entries reach the model, each capped at 2,000 characters") — unfakeable first-hand signal. /toolkit documents skills the team demonstrably runs on its own repo ("This site's repo carries three that way… its CLAUDE.md instructs every session to open with /handoff start"). /sk shows four live, clickable client sites plus a case study. Deductions: /about's claimed experience is asserted rather than evidenced (H-2); no client testimonials anywhere; blog experience claims ("How We Use Claude Code") are credible but unillustrated (no screenshots, no real diffs, no repo links from posts).

### Expertise — 70/100 (weight 25%)

Technical accuracy is high across all substantive pages (Shadow DOM isolation, SSE streaming, CEI pattern, VRF v2.5, MCP/A2A — all correct as described). The ToolKit taxonomy ("Four things that get conflated": SKILL.md vs CLAUDE.md vs MCP vs hooks) is the kind of clarifying expertise that earns citations. Deductions: expertise is institutionally anonymous — no named author on any article (M-1), no credentials page, one named person for a claimed five-engineer team; no external sourcing to demonstrate research rigor (M-2).

### Authoritativeness — 45/100 (weight 25%)

The weak leg. No third-party validation exists on-site: no named EN clients, no reviews or ratings platforms, no press, no talks, no external profiles beyond org-level LinkedIn/X/Instagram (all real — an improvement over March's placeholder links). The /sk side is materially stronger here: named founder with verifiable employment history, live client sites with URLs, a case study. The EN side asks to be trusted on internal evidence alone. ToolKit's rigorous attribution of 16 third-party authors is authoritative *behavior* and may earn reciprocal recognition over time, but today outside recognition is absent.

### Trustworthiness — 78/100 (weight 30%)

Well above category norms. Full legal entity disclosure (M.D.N Tech FZE, License 7813, physical address) in every footer; two phone numbers; four thorough legal pages in two languages with a product-specific ChatKit data section; published prices on both sides of the site including per-message math; "Honest limits" sections that enumerate what the products cannot do; explicit non-claims ("No certifications or uptime guarantee to quote", "we do not publish an uptime figure", the Royal Stroje ranking disclaimer); no dark patterns, no fake urgency, no invented social proof — and the site says why ("inventing one would be trivial and undetectable"). Deductions: H-2 (the /about numbers block directly undercuts this carefully built standard), M-3 (availability inconsistency), H-1 (declared/actual language mismatch is a small mechanical trust defect).

### Weighted composite

```
Experience:        72 x 0.20 = 14.4
Expertise:         70 x 0.25 = 17.5
Authoritativeness: 45 x 0.25 = 11.25
Trustworthiness:   78 x 0.30 = 23.4
                              ------
E-E-A-T composite:             66.6 ≈ 66/100
```

---

## AI Citation Readiness — 78/100

**What is working (keep all of it):**
- robots.txt explicitly allows GPTBot, ClaudeBot, Google-Extended, PerplexityBot, Applebot-Extended, CCBot, AmazonBot.
- Full server-side rendering: every audited word exists in raw HTML; no JS execution needed. (The March audit's biggest extraction risk is gone.)
- FAQPage schema on four pages (/, /chatkit, /toolkit, /sk) with genuinely distinct question sets — 45 structured Q&A pairs sitewide.
- SoftwareApplication (/chatkit, /toolkit), ItemList (/toolkit), ProfessionalService (/sk), BlogPosting + BreadcrumbList (posts), Article (case study).
- Definition-pattern copy an LLM can lift verbatim: "A skill is a SKILL.md file living in ~/.claude/skills/<name>/"; "One credit, one reply. Visitor questions cost nothing"; "With ChatKit nothing is trained, indexed or embedded." Each H2 section on the product pages answers one question completely — clean chunk boundaries.
- Concrete, quotable numbers with units on product pages (56px bubble, 380px panel, 20 req/min per IP, 5.8¢–3.0¢ per message, 2,000-char entries).
- Sitemap carries real, differentiated lastmod dates; hreflang correct for the /-/sk pair.

**Per-page lift test (can an LLM extract a clean answer?):**
- /chatkit: yes, for pricing, install, limits, data retention — near-perfect.
- /toolkit: yes, for "what is a Claude Code skill", install commands, skill-vs-MCP — near-perfect.
- /sk: yes, for pricing, process, VAT/UAE questions — strong.
- Blog posts: partially — good H2 chunking, but no FAQ blocks, no TOC/jump links, no cited sources for the statistics an engine would want to attribute (M-2), and staleness (H-3) suppresses selection for fresh-topic queries.
- /, /about, case study, legal: adequate.

**Gaps:** blog posts lack FAQ schema and source anchors; `dateModified` never diverges from `datePublished`, so nothing signals maintenance; /about's extractable "facts" are the unverifiable numbers (an engine quoting "100+ Web3 partnerships" would be repeating an unsupported claim — H-2 again); blog index title is unextractable (L-4).

---

## Score Summary

| Category | Score | Notes |
|---|---|---|
| E-E-A-T composite | 66/100 | Trust and experience strong; authority is the ceiling |
| Content depth & topical coverage | 88/100 | /chatkit and /toolkit are category-leading; /about and case study lag |
| Keyword/title/H1 alignment | 90/100 | All three target clusters fully carried; /sk H1 + services H2 correct as rewritten |
| Heading hierarchy & structure | 95/100 | One H1 per page, clean nesting, sitewide |
| Internal linking | 85/100 | Product ↔ blog ↔ about ↔ directory cross-links are contextual and bidirectional; EN ↔ SK bridges present |
| Readability | 78/100 | Dense, long-sentence prose on product pages, mitigated by tight sectioning and FAQs; Slovak copy notably clear |
| Content freshness | 52/100 | Products/legal fresh (Aug 2026); blog frozen in March with time-stamped claims |
| AI citation readiness | 78/100 | SSR + schema + AI-bot access excellent; blog citation hygiene missing |
| **Overall Content Quality** | **74/100** | |

**Fastest points on the board, in order:** H-1 (`lang="sk"`, one line), M-1 (named author + Person schema), L-1/M-5 (meta description trims), H-3a (update + visibly re-date the Claude Code guide), H-2 (honesty pass on /about — the same treatment /sk already received).

---

*Methodology: static analysis of rendered HTML fetched 2026-08-19 (14 pages + robots.txt + sitemap.xml + response headers); Google September 2025 Quality Rater Guidelines; word counts include nav/footer chrome. Constraint honored: /sk H1, the services H2, and the Royal Stroje no-unproven-claims stance were evaluated as deliberate post-honesty-pass decisions and are marked correct; no rewrites of them are recommended and no removed claims are recommended for reinstatement.*
