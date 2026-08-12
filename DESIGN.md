---
name: M.D.N Tech
description: Cosmic dark marketing site — content orbits the blackhole, light bends toward action
colors:
  void-black: "#030014"
  deep-space: "#050518"
  nebula-violet: "#7042f8"
  photon-purple: "#a855f7"
  ion-cyan: "#06b6d4"
  aurora-pink: "#e59cff"
  starlight: "#ffffff"
  dust-gray: "#d1d5db"
  faint-gray: "#9ca3af"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
rounded:
  md: "8px"
  lg: "12px"
  pill: "32px"
spacing:
  card: "32px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "rgba(113, 47, 255, 0.12)"
    textColor: "{colors.starlight}"
    rounded: "{rounded.md}"
    padding: "12px 32px"
  button-secondary:
    backgroundColor: "rgba(112, 66, 248, 0.08)"
    textColor: "{colors.starlight}"
    rounded: "{rounded.md}"
    padding: "12px 32px"
  card:
    backgroundColor: "rgba(112, 66, 248, 0.08)"
    textColor: "{colors.dust-gray}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card}"
  chip-stat:
    backgroundColor: "rgba(6, 182, 212, 0.10)"
    textColor: "{colors.ion-cyan}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
---

# Design System: M.D.N Tech

## 1. Overview

**Creative North Star: "The Event Horizon"**

Everything on the site orbits the blackhole — the literal signature asset (the
`blackhole.webm` accretion disc that opens the page and bookends the footer) and the
organizing metaphor. Content sits in calm, near-black space (`#030014`); mass is violet
(structure — borders, surfaces, buttons); light is cyan, and light bends toward what
matters (links, hover states, live-product CTAs). Visual hierarchy is gravity: the
closer an element is to conversion, the more light it gathers.

The system explicitly rejects the generic AI-SaaS template feel — the interchangeable
gradient-hero page — and empty spectacle. The cosmos frames content; it never substitutes
for it. Density is low: one dominant idea per fold, generous vertical rhythm (80px+
sections), copy that shows receipts (numbers, licenses, named features) rather than
adjectives.

**Key Characteristics:**
- Near-black indigo void as the universal canvas; starfield + blackhole video as fixed scenery
- Violet glass surfaces (8% alpha fills, 55% alpha borders) with inset glow, never drop shadows
- Gradient-crowned headings (purple→cyan) over solid, highly legible body text
- Cyan reserved for interaction and proof (links, stats chips, hover accents)
- Motion is slow drift and brightening — nothing bounces, nothing spins

## 2. Colors

A committed dark cosmic palette: one violet mass, one cyan light, on a void that is
never pure black.

### Primary
- **Nebula Violet** (#7042f8): The structural color. Card borders at 55% alpha
  (`#7042f88b`), surface fills at 8% (`#7042f815`), button glass, scrollbar. Violet is
  mass — it defines where things are, not where to go.
- **Photon Purple** (#a855f7): Gradient partner for headings and the hero; the warm end
  of the heading gradient.

### Secondary
- **Ion Cyan** (#06b6d4): The action color. Inline links, hover states, stat chips,
  section CTAs ("Browse Skills →"). Cyan is light bending toward action — if it is cyan,
  it is clickable or it is proof.
- **Aurora Pink** (#e59cff): Badge gradient stop (the `Welcome-text` treatment) — rare,
  hero-badge only.

### Neutral
- **Void Black** (#030014): Body background everywhere. Indigo-tinted, never pure #000.
- **Deep Space** (#050518): Footer and elevated dark surfaces.
- **Starlight** (#ffffff): Headings and button labels.
- **Dust Gray** (#d1d5db, gray-300): Default body copy on void — holds ≥4.5:1.
- **Faint Gray** (#9ca3af, gray-400): Secondary text, captions. The legibility floor —
  nothing dimmer may carry meaning.

### Named Rules
**The Bent Light Rule.** Violet is structure; cyan is action. A cyan element must be
interactive or evidentiary (stat, count). A violet element never needs to be clicked to
be understood.

**The Legibility Floor Rule.** On #030014, body copy is gray-300; gray-400 is the
absolute floor for secondary text; gray-500 and below is decoration only. If a paragraph
matters, it is not muted.

## 3. Typography

**Display Font:** Inter (next/font, with system-ui fallback)
**Body Font:** Inter — same family, weight-differentiated

**Character:** One family, hard weight contrast — bold 700 display against regular 400
body. The voice of a confident engineer: no decorative faces, hierarchy carried by size,
weight, and the gradient crown.

### Hierarchy
- **Display** (700, clamp 2.25–4.5rem, lh 1.1): Hero h1 only. Gradient-crowned.
- **Headline** (600, 1.875–2.25rem, lh 1.2): Section h2s. Gradient-crowned, centered.
- **Title** (600, 1.25rem, lh 1.4): Card headings, solid white, hover→cyan.
- **Body** (400, 1rem–1.125rem, lh 1.625): Dust Gray, max-width ~65ch (`max-w-3xl`).
- **Label** (500, 0.75rem): Stat chips and "SOON" tags; the only uppercase allowed.

### Named Rules
**The Gradient Crown Rule.** The purple→cyan `bg-clip-text` gradient is the committed
brand idiom for h1/h2 headings — and for nothing else. Body text, labels, buttons, and
links are always solid. No new gradient-text elements beyond page and section headings.

## 4. Elevation

No drop shadows anywhere. Depth is conveyed by glow and layering: inset violet glows on
buttons (`inset 0 0 12px #bf97ff3d`), backdrop blur on floating chrome (navbar, badge
pill), and content layered over the fixed starfield/blackhole scenery. Surfaces read as
dark glass edged in violet light.

### Named Rules
**The Glow-Not-Shadow Rule.** Elements never cast darkness; they emit or contain light.
Hover intensifies the inset glow (`#bf97ff3d → #bf97ff70`) — it never adds a drop shadow
or scales layout.

## 5. Components

### Buttons
- **Shape:** Gently rounded (8px, `rounded-lg`)
- **Primary** (`.button-primary`): violet glass — layered gradient
  `rgba(60,8,126,0→0.32)` over `rgba(113,47,255,0.12)`, inset glow `#bf97ff3d`, white
  600 label, `py-3 px-8`.
- **Hover / Focus:** glow deepens to `#bf97ff70`, fill to 0.24 alpha; framer
  `whileHover scale 1.05`, `whileTap 0.95`.
- **Secondary:** 1px `#7042f88b` border, `#7042f815` fill, same geometry — quieter mass,
  no glow.

### Chips
- **Style:** Stat chips — cyan text on `cyan-500/10` fill, 1px `cyan-500/30` border,
  pill radius, `px-3 py-1`, 12px medium. Used for proof: "21 production-tested skills".
- **State:** "SOON" tag variant — 10px uppercase tracked, `purple-400/70`, inline after
  product names.

### Cards / Containers
- **Corner Style:** 12px (`rounded-xl`)
- **Background:** `#7042f815` violet glass + `backdrop-blur-sm`
- **Shadow Strategy:** none — border + glow per Elevation
- **Border:** 1px `#7042f88b`
- **Internal Padding:** 32px (`p-8`)
- **Hover:** lifts 4px (`whileHover y: -4`), a cyan-to-purple gradient wash fades in at
  10% opacity, title shifts to cyan.

### Inputs / Fields
- **Style:** 1px `#7042f88b` border, transparent or `#7042f815` fill, 8px radius, white
  text, gray-400 placeholder (floor).
- **Focus:** border brightens toward cyan; no outline ring beyond the border shift.

### Navigation
- Floating pill navbar, backdrop-blurred dark glass, centered links (white → cyan on
  hover/active), brand left, primary button right. Mobile: hamburger to full-width sheet.

### Signature: The Blackhole Bookends
The rotated accretion-disc video crowns the hero (rotated 180°, top of page) and rises
again above the footer. It is scenery, not content — always `pointer-events-none`,
`-z-10`, and paused/postered under reduced motion.

## 6. Do's and Don'ts

### Do:
- **Do** keep body copy at gray-300 on #030014; gray-400 only for secondary lines (the
  Legibility Floor Rule).
- **Do** reserve cyan for interactive or evidentiary elements (the Bent Light Rule).
- **Do** show receipts in copy: counts, licenses, named features — "specifics are the
  brand" (PRODUCT.md).
- **Do** keep sections one-idea-per-fold with ≥80px vertical padding.
- **Do** give every reveal a `prefers-reduced-motion` fallback and every video a pause
  path.

### Don't:
- **Don't** produce the "generic AI-SaaS template feel" PRODUCT.md bans — if a section
  could be pasted into any AI startup's page, rewrite it around a specific claim.
- **Don't** add new gradient-text elements beyond h1/h2 (the Gradient Crown Rule).
- **Don't** use drop shadows, side-stripe borders, or nested cards — glass cards carry
  a full 1px violet border or nothing.
- **Don't** let the cosmos wash out content: no text over the accretion disc without a
  solid content layer beneath ("the cosmos is the stage, not the show").
- **Don't** ship a second h1, a skipped heading level, or a "free" label on anything
  that is a trial — misleading claims are a named anti-reference.
