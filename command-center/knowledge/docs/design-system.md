---
title: "M.D.N Tech Design System"
category: doc
tags: [design, brand, colors, fonts, ui]
updated: 2026-03-21
---

# M.D.N Tech Design System

Unified reference for colors, typography, effects, and UI patterns used across all M.D.N Tech projects.

---

## Colors

### Brand Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background deep | `#030014` | Marketing site background |
| Background CC | `#0a0a1a` | Command Center background |
| Background card | `#0d0d20` | Cards, panels |
| Border subtle | `rgba(255,255,255,0.05)` | Card borders |
| Border active | `rgba(168,85,247,0.2)` | Hover/focus borders |

### Gradient Accents

```
Cyan → Purple → Magenta
#06b6d4 → #a855f7 → #ec4899
```

Apply as: `bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500`

### Status Colors

| Status | Color |
|--------|-------|
| Success / On track | `text-green-400` / `bg-green-500/10` |
| Warning / At risk | `text-yellow-400` / `bg-yellow-500/10` |
| Critical / Overdue | `text-red-400` / `bg-red-500/10` |
| Info | `text-blue-400` / `bg-blue-500/10` |
| Neutral | `text-gray-400` / `bg-white/5` |

---

## Typography

### Fonts

- **Primary:** Inter (all body text, UI)
- **Accent:** Cedarville Cursive (marketing logo/brand moments only)

### Scale

| Element | Class |
|---------|-------|
| Page title | `text-xl font-semibold text-white` |
| Section heading | `text-sm font-medium text-white` |
| Label | `text-xs text-gray-400` |
| Body | `text-sm text-gray-300` |
| Caption | `text-xs text-gray-500` |
| Mono (IDs, code) | `text-xs font-mono text-gray-300` |

---

## UI Components

### Cards / Panels

```jsx
<div className="bg-[#0d0d20] border border-white/5 rounded-xl p-5">
```

Hover state: `hover:border-purple-500/20 transition-colors`

### Buttons

**Primary (gradient):**
```jsx
<button className="px-4 py-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity">
```

**Secondary (ghost):**
```jsx
<button className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
```

**Outline:**
```jsx
<button className="px-3 py-1.5 text-xs text-gray-400 border border-white/10 hover:border-white/20 hover:text-white rounded-lg transition-colors">
```

### Status Badges

```jsx
<span className="px-2 py-0.5 rounded-full text-[11px] font-medium border bg-purple-500/10 text-purple-400 border-purple-500/20">
  Label
</span>
```

### Form Inputs

```jsx
<input className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
```

---

## Effects

### Glassmorphism (marketing site)

```css
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.08);
```

### Glow (CTAs, hero elements)

```css
box-shadow: 0 0 40px rgba(168, 85, 247, 0.15);
```

### Stars Background

`<StarsCanvas />` component from `components/main/star-background`. Marketing site only -- not used in Command Center.

---

## Layout

### Marketing Site

- Full-width sections, centered content max `max-w-7xl mx-auto px-6`
- Consistent section padding: `py-20` or `py-16`

### Command Center

- Sidebar: `w-56` fixed left
- Content area: `flex-1 overflow-y-auto`
- Content padding: `p-6`
- Max content width: `max-w-4xl` for detail pages

---

## Stack Reference

All projects use the same base stack:

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui (when needed)
- **Database:** Supabase (PostgreSQL + Auth + Realtime)
- **Deployment:** Vercel (frontend) + Railway (backend services)
- **Icons:** Lucide React
- **Animations:** Framer Motion (marketing), CSS transitions (Command Center)
