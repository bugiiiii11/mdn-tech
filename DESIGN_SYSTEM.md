# M.D.N Tech - Design System Documentation

> Complete design specification for the M.D.N Tech space-themed website

**Last Updated:** 2026-03-11
**Version:** 3.0
**Status:** Production Ready

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Animations](#animations)
7. [Background Effects](#background-effects)
8. [Custom CSS Classes](#custom-css-classes)
9. [Motion Variants Library](#motion-variants-library)
10. [Implementation Guidelines](#implementation-guidelines)

---

## Design Philosophy

### Theme: Space & Technology
The M.D.N Tech website uses a **space-themed aesthetic** with:
- Dark cosmic background with animated WebGL stars
- Purple-cyan gradient accents
- Glassmorphism effects
- Futuristic HUD-style elements
- Smooth Framer Motion animations
- 3D tilt card interactions

### Design Principles
1. **Consistency First** - Standardized patterns across all sections
2. **Purposeful Animation** - Every animation serves a user experience goal
3. **Visual Hierarchy** - Clear information architecture
4. **Interactive Delight** - Engaging hover effects and micro-interactions
5. **Performance** - Optimized videos, GPU-accelerated animations

---

## Color System

### Primary Colors

```css
/* Background */
--bg-primary: #030014        /* Main dark background */
--bg-secondary: #050518      /* Footer background */
--bg-navbar: rgba(3, 0, 20, 0.15)  /* Navbar transparent bg - #03001427 */

/* Accent Colors */
--purple-500: #7042f8        /* Primary brand purple */
--purple-400: #a855f7        /* Lighter purple for gradients */
--cyan-500: #22d3ee          /* Secondary brand cyan */
--cyan-400: #22d3ee          /* Cyan for accents/highlights */

/* Gradients */
--gradient-primary: linear-gradient(to right, #7042f8, #22d3ee)
--gradient-reverse: linear-gradient(to right, #22d3ee, #7042f8)
--gradient-purple-400-cyan-500: linear-gradient(to right, #a855f7, #06b6d4)
```

### Text Colors

```css
/* Text Hierarchy */
--text-white: #ffffff        /* Headings and important text */
--text-gray-200: #e5e7eb     /* Hover state for body text */
--text-gray-300: #d1d5db     /* Body text (hover state) */
--text-gray-400: #9ca3af     /* Body text (default) */
--text-gray-500: #6b7280     /* Secondary text, footer text */
--text-gray-600: #4b5563     /* Tertiary text, placeholders */
--text-purple-400: #c084fc   /* Role labels, accent text */
--text-cyan-400: #22d3ee     /* Hover accents, icons */
```

### Border Colors

```css
/* Borders */
--border-purple: rgba(112, 66, 248, 0.55)     /* Card borders - #7042f88b */
--border-purple-light: rgba(112, 66, 248, 0.30)  /* Subtle borders */
--border-purple-nav: rgba(112, 66, 248, 0.38) /* Navigation border */
--border-white-10: rgba(255, 255, 255, 0.10)  /* Form inputs, light cards */
--border-white-06: rgba(255, 255, 255, 0.06)  /* Footer dividers */
--border-purple-500-30: rgba(168, 85, 247, 0.30) /* Avatar/icon borders */
```

### Background Overlays

```css
/* Glassmorphism */
--glass-bg: rgba(112, 66, 248, 0.08)          /* Card background - #7042f815 */
--glass-hover: rgba(112, 66, 248, 0.15)       /* Card hover state - #7042f825 */
--glass-nav: rgba(3, 0, 20, 0.37)             /* Nav pill background */

/* White Overlays */
--white-5: rgba(255, 255, 255, 0.05)          /* Light card bg, form inputs */
--white-10: rgba(255, 255, 255, 0.10)         /* Hover states */
--white-20: rgba(255, 255, 255, 0.20)         /* Avatar shine effect */

/* Effects */
--glow-purple: rgba(112, 66, 248, 0.4)        /* Purple glow */
--glow-cyan: rgba(34, 211, 238, 0.4)          /* Cyan glow */
--glow-cyan-10: rgba(34, 211, 238, 0.10)      /* Subtle cyan glow */

/* Shadows */
--shadow-navbar: rgba(42, 14, 97, 0.5)        /* #2A0E61/50 */
--shadow-button: rgba(191, 151, 255, 0.24)    /* Button inset glow */
```

### State Colors

```css
/* Success States */
--success-bg: rgba(34, 197, 94, 0.20)         /* green-500/20 */
--success-border: rgba(34, 197, 94, 0.50)     /* green-500/50 */
--success-text: #4ade80                        /* green-400 */
```

---

## Typography

### Font Families

```css
/* Primary Font */
font-family: var(--font-geist-sans), system-ui, -apple-system, sans-serif;

/* Decorative/Cursive Font */
font-family: "Cedarville Cursive", cursive;
/* Import: @import url("https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap"); */
```

### Type Scale

#### H1 - Section Titles
```tsx
className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
```
- **Size:** 30px mobile (text-3xl), 36px desktop (text-4xl)
- **Weight:** 600 (semibold)
- **Style:** Gradient text (purple to cyan)
- **Usage:** All major section headings

#### Hero Title
```tsx
className="text-4xl md:text-6xl lg:text-7xl text-bold text-white"
```
- **Size:** 36px mobile, 60px tablet, 72px desktop
- **Weight:** 700 (bold)
- **Style:** Gradient text with line breaks
- **Usage:** Main hero headline

#### H2 - Subsection Headers
```tsx
className="text-2xl font-bold text-white mb-6"
```
- **Size:** 24px (1.5rem)
- **Weight:** 700 (bold)
- **Color:** White
- **Usage:** Subsection titles, contact heading

#### H3 - Card Titles
```tsx
className="text-xl font-semibold text-white mb-3"
```
- **Size:** 20px (1.25rem)
- **Weight:** 600 (semibold)
- **Color:** White
- **Usage:** All card titles (Skills, Process, Team, etc.)

#### H4 - Small Card Titles
```tsx
className="text-lg font-semibold text-white mb-2"
```
- **Size:** 18px (1.125rem)
- **Weight:** 600 (semibold)
- **Color:** White
- **Usage:** Stack/technology card titles

#### Body Large - Hero Subtitle
```tsx
className="text-xl md:text-2xl text-gray-300 my-5 max-w-[700px] text-center font-medium"
```
- **Size:** 20px mobile, 24px desktop
- **Color:** Gray 300
- **Weight:** 500 (medium)
- **Usage:** Hero subtitle

#### Body Regular - Section Descriptions
```tsx
className="text-lg text-gray-400 leading-relaxed"
```
- **Size:** 18px (1.125rem)
- **Color:** Gray 400
- **Line Height:** relaxed (1.625)
- **Usage:** Section introductions

#### Body Small - Card Descriptions
```tsx
className="text-sm text-gray-400 leading-relaxed"
```
- **Size:** 14px (0.875rem)
- **Color:** Gray 400
- **Line Height:** relaxed (1.625)
- **Usage:** Card content, descriptions

#### Label Text
```tsx
className="text-sm font-medium text-gray-300 mb-2"
```
- **Size:** 14px
- **Weight:** 500 (medium)
- **Color:** Gray 300
- **Usage:** Form labels

#### Small Text
```tsx
className="text-xs text-gray-600"
```
- **Size:** 12px (0.75rem)
- **Color:** Gray 600
- **Usage:** Footer text, labels

### Typography States

```css
/* Hover States */
.card-title:hover {
  color: #22d3ee; /* Cyan 400 */
}

.body-text:hover {
  color: #e5e7eb; /* Gray 200 */
}

/* Gradient Hover for Mobile Nav */
.nav-link:hover {
  background: linear-gradient(to right, #a855f7, #22d3ee);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

---

## Spacing & Layout

### Section Padding

```tsx
/* Standard section padding */
className="py-20 px-4 md:px-20"

/* Hero section */
className="h-[650px] px-3 md:px-20 mt-40"

/* Footer */
className="pt-6 pb-4 px-4 md:px-8"

/* Min-height sections (Encryption, Contact) */
className="min-h-screen py-20 px-4 md:px-20"
```

### Container Max Widths

```tsx
/* Standard content width */
max-w-6xl              /* 72rem / 1152px */

/* Narrower content (Process) */
max-w-4xl              /* 56rem / 896px */

/* Hero text content */
max-w-[700px]          /* 700px */

/* Footer content */
max-w-5xl              /* 64rem / 1024px */

/* Full width */
w-full max-w-full
```

### Grid Systems

#### 3-Column Grid (Skills, Results, Team, Stack)
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

#### 2-Column Grid (Footer, Contact, About)
```tsx
className="grid grid-cols-1 md:grid-cols-2 gap-6"
/* or with larger gap */
className="grid grid-cols-1 lg:grid-cols-2 gap-12"
```

#### Team Grid (Larger gap)
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
```

#### Skills Grid (No Gap - borders create lines)
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Spacing Scale

```css
/* Gap tokens */
gap-0:   0px       /* Skills grid only */
gap-1:   4px       /* Social icons */
gap-2:   8px       /* Form elements, buttons */
gap-3:   12px      /* Small groups */
gap-4:   16px      /* Button groups, flex items */
gap-5:   20px      /* Hero content gap */
gap-6:   24px      /* Card grids (standard) */
gap-8:   32px      /* Team grid, process timeline */
gap-12:  48px      /* Contact sections, footer MD gap */

/* Margin bottom */
mb-1:    4px       /* Tight spacing */
mb-2:    8px       /* Label spacing */
mb-3:    12px      /* Card title margin */
mb-4:    16px      /* Element spacing */
mb-6:    24px      /* Section spacing */
mb-8:    32px      /* Large spacing */
mb-12:   48px      /* Section dividers */
mb-16:   64px      /* Major sections */

/* Padding */
p-2:     8px       /* Icon buttons */
p-3:     12px      /* Small buttons */
p-4:     16px      /* Contact cards */
p-6:     24px      /* Standard cards */
p-8:     32px      /* Form container */

py-2:    8px       /* Welcome box */
py-3:    12px      /* Buttons */
py-10:   40px      /* Section title spacing */
py-20:   80px      /* Section vertical padding */

px-3:    12px      /* Mobile padding */
px-4:    16px      /* Mobile horizontal */
px-6:    24px      /* CTA buttons */
px-8:    32px      /* Primary buttons */
px-20:   80px      /* Desktop horizontal */
```

---

## Components

### Navbar Component

#### Fixed Header
```tsx
<div className="w-full h-[65px] fixed top-0 left-0 right-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001427] backdrop-blur-md z-50">
```

**Features:**
- Height: 65px
- Position: Fixed, full width
- Background: Semi-transparent dark purple with backdrop blur
- Shadow: Purple-tinted shadow
- Z-index: 50 (top layer)

#### Navigation Pill
```tsx
<div className="flex items-center justify-between w-full h-auto border border-[rgba(112,66,248,0.38)] bg-[rgba(3,0,20,0.37)] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200">
```

**Features:**
- Rounded pill shape (rounded-full)
- Semi-transparent background
- Purple border
- Contains navigation links

#### Mobile Menu
```tsx
<div className="absolute top-[65px] left-0 right-0 bg-gradient-to-b from-[#030014] to-[#0a0118] backdrop-blur-lg border-t border-[#7042f861] shadow-2xl">
```

**Features:**
- Gradient background (darker to lighter purple-black)
- Backdrop blur
- Border top with purple accent
- Full-width dropdown

### Card Component Variants

#### Variant A: HUD Style Card (Skills Section)

```tsx
<motion.div
  whileHover={{ y: -4 }}
  className="relative p-6 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm group overflow-hidden transition-all duration-300"
>
  {/* Glass morphism background on hover */}
  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

  {/* HUD Border Effects - animated lines, corners, scanning effects */}
  {/* Animated border lines (top, bottom, left, right) */}
  {/* Corner brackets with scale animation */}
  {/* Scanning line effect */}
  {/* Pulsing border glow */}
  {/* Corner glow animations */}
</motion.div>
```

**Features:**
- Animated HUD border lines (scaleX/scaleY animation)
- Corner brackets: 6x6 size, 2px border, cyan color
- Scanning line: horizontal gradient sweep
- Pulsing border glow: opacity [0.3, 0.6, 0.3]
- Corner glow: boxShadow animation with 0.5s stagger
- Y-lift on hover: -4px

**HUD Border Animation Timings:**
- Top border: delay 0s
- Bottom border: delay 0.2s
- Left border: delay 0.4s
- Right border: delay 0.6s
- Corner brackets: delay 0.3s-0.6s (staggered)
- Scanning line: 2s duration, infinite loop

**Usage:** Skills/Services section only

#### Variant B: 3D Tilt Card (Process, Team, Projects, About)

```tsx
<motion.div
  ref={ref}
  onMouseMove={handleMouseMove}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={handleMouseLeave}
  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
  className="relative p-6 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm overflow-hidden transform-gpu group perspective-1000"
>
  {/* Mouse-following glow */}
  <motion.div
    className="absolute w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-60"
    style={{
      x: useTransform(mouseXSpring, [-0.5, 0.5], ["-50%", "50%"]),
      y: useTransform(mouseYSpring, [-0.5, 0.5], ["-50%", "50%"])
    }}
  />

  {/* Floating particles */}
  {[...Array(6)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-cyan-400 rounded-full"
      style={{ left: `${20 + i * 15}%`, top: `${10 + (i % 3) * 30}%` }}
      animate={{
        y: isHovered ? [0, -20, 0] : 0,
        x: isHovered ? [0, 10, 0] : 0,
        opacity: isHovered ? [0, 1, 0] : 0,
        scale: isHovered ? [0, 1.5, 0] : 0,
      }}
      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
    />
  ))}

  {/* Shine sweep effect */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
    animate={{ x: isHovered ? "100%" : "-100%" }}
    transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, repeatDelay: 2 }}
  />
</motion.div>
```

**Features:**
- 3D tilt: max ±7.5deg rotation
- Spring physics: stiffness 500, damping 100
- Mouse-following glow: 8rem diameter, cyan/10
- Floating particles: 6 count, cyan-400
- Shine sweep: 1.5s duration, 2s delay between repeats
- Transform-gpu for hardware acceleration

**Usage:** Process, Team, Projects, About sections

#### Variant C: Light Card (Stack/Encryption Section)

```tsx
<motion.div
  variants={slideInFromLeft(delay)}
  className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
>
```

**Features:**
- Lighter appearance (white/5 bg, white/10 border)
- Simpler hover state (bg-white/10)
- No 3D effects
- Slide-in animation from left

**Usage:** Technology stack cards in Encryption section

#### Variant D: Contact Info Card

```tsx
<motion.a
  whileHover={{ scale: 1.02, x: 5 }}
  className="flex items-center p-4 rounded-lg border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm hover:bg-[#7042f825] transition-all duration-300 group"
>
```

**Features:**
- Subtle scale (1.02) and x-shift (5px) on hover
- Icon with scale animation on group hover
- Link functionality built-in

**Usage:** Contact information cards

### Base Card Styling (Universal)

All cards share these base styles:

```tsx
className="rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm"
```

- **Border Radius:** 12px (rounded-xl) or 8px (rounded-lg)
- **Border:** 1px solid rgba(112, 66, 248, 0.55)
- **Background:** rgba(112, 66, 248, 0.08) with backdrop blur
- **Backdrop Filter:** blur(sm) - 8px blur

### Button Components

#### Primary Button (Gradient Glass)
```tsx
<motion.a
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold"
>
```

**CSS Class (.button-primary):**
```css
.button-primary {
  background: linear-gradient(
      180deg,
      rgba(60, 8, 126, 0) 0%,
      rgba(60, 8, 126, 0.32) 100%
    ),
    rgba(113, 47, 255, 0.12);
  box-shadow: inset 0 0 12px #bf97ff3d;
}
.button-primary:hover {
  background: linear-gradient(
      180deg,
      rgba(60, 8, 126, 0) 0%,
      rgba(60, 8, 126, 0.42) 100%
    ),
    rgba(113, 47, 255, 0.24);
  box-shadow: inset 0 0 12px #bf97ff70;
}
```

#### Submit Button (Full Gradient)
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300"
>
```

**Features:**
- Full gradient background (purple to cyan)
- Darker gradient on hover
- Gradient sweep animation on hover

#### Icon Button (Social Links)
```tsx
<Link
  className="p-2 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-white/5 transition-colors"
>
```

### Form Components

#### Text Input
```tsx
<input
  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
/>
```

#### Newsletter Input
```tsx
<input
  className="flex-1 min-w-0 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/40"
/>
```

#### Textarea
```tsx
<textarea
  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
/>
```

### Icon Container
```tsx
<motion.div
  className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center"
  whileHover={{ rotate: 360, scale: 1.1 }}
  transition={{ duration: 0.6 }}
>
  <Icon className="w-6 h-6 text-cyan-400" />
</motion.div>
```

### Process Timeline

#### Timeline Connector
```tsx
<div className="hidden md:block absolute left-6 top-20 w-0.5 h-[calc(100%+3rem)] bg-gradient-to-b from-purple-500/50 via-cyan-500/50 to-transparent" />
```

#### Step Number Circle
```tsx
<motion.div
  className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 border-4 border-[#030014] flex items-center justify-center shadow-lg"
>
  <span className="text-white font-bold text-lg">{index + 1}</span>
</motion.div>
```

### Avatar Component (Team)
```tsx
<motion.div
  className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-purple-500/30"
  whileHover={{ scale: 1.05 }}
>
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20" />

  {/* Avatar image */}
  <Image className="w-full h-full object-cover relative z-10" />

  {/* Shine effect on hover */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"
    animate={{ x: isHovered ? "100%" : "-100%" }}
    transition={{ duration: 1, repeat: isHovered ? Infinity : 0, repeatDelay: 1.5 }}
  />
</motion.div>
```

### Welcome Box (Hero Badge)
```tsx
<motion.div className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]">
  <h1 className="Welcome-text text-[13px]">Badge Text</h1>
</motion.div>
```

---

## Animations

### Scroll-Triggered Entry Animations

#### Section Title Animation
```tsx
variants={{
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}}
```

#### Section Description Animation
```tsx
variants={{
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2 }
  }
}}
```

#### Simple Card Entry
```tsx
variants={{
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.5,
      ease: "easeOut"
    }
  }
}}
```

#### 3D Card Entry
```tsx
variants={{
  hidden: { y: 50, opacity: 0, scale: 0.9, rotateX: -15 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]  // Custom ease
    }
  }
}}
```

### Hover Animations

#### Simple Y-Lift
```tsx
whileHover={{ y: -4 }}
```

#### 3D Tilt Effect
```tsx
const x = useMotionValue(0);
const y = useMotionValue(0);
const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
```

#### Button Hover
```tsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

#### Icon Rotation
```tsx
whileHover={{ rotate: 360, scale: 1.1 }}
transition={{ duration: 0.6 }}
```

#### Contact Card Hover
```tsx
whileHover={{ scale: 1.02, x: 5 }}
```

### Continuous Animations

#### HUD Scanning Line
```tsx
<motion.div
  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
  animate={{ top: ["0%", "100%"] }}
  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
/>
```

#### Pulsing Border Glow
```tsx
<motion.div
  className="absolute inset-0 border-[1px] border-cyan-400/30"
  animate={{ opacity: [0.3, 0.6, 0.3] }}
  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
/>
```

#### Corner Glow
```tsx
animate={{
  boxShadow: [
    "0 0 0px rgba(34, 211, 238, 0), inset 0 0 0px rgba(34, 211, 238, 0)",
    "0 0 15px rgba(34, 211, 238, 0.9), inset 0 0 10px rgba(34, 211, 238, 0.3)",
    "0 0 0px rgba(34, 211, 238, 0), inset 0 0 0px rgba(34, 211, 238, 0)",
  ]
}}
transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
```

#### Shine Sweep Effect
```tsx
<motion.div
  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
  initial={{ x: "-100%" }}
  animate={{ x: isHovered ? "100%" : "-100%" }}
  transition={{
    duration: 1.5,
    repeat: isHovered ? Infinity : 0,
    repeatDelay: 2,
    ease: "easeInOut"
  }}
/>
```

#### Floating Particles
```tsx
animate={{
  y: isHovered ? [0, -20, 0] : 0,
  x: isHovered ? [0, 10, 0] : 0,
  opacity: isHovered ? [0, 1, 0] : 0,
  scale: isHovered ? [0, 1.5, 0] : 0
}}
transition={{
  duration: 2,
  repeat: Infinity,
  delay: i * 0.2,
  ease: "easeInOut"
}}
```

**Particle Configuration:**
- Count: 6 particles
- Size: 4px (w-1 h-1)
- Color: cyan-400
- Position: Distributed using formula `left: ${20 + i * 15}%`, `top: ${10 + (i % 3) * 30}%`

#### Accordion Animation
```tsx
animate={{
  height: isExpanded ? "auto" : 0,
  opacity: isExpanded ? 1 : 0,
  marginTop: isExpanded ? 16 : 0,
}}
transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
```

### Animated Counter
```tsx
const AnimatedCounter = ({ value, suffix = "", duration = 2 }) => {
  // Uses requestAnimationFrame with easeOutQuart easing
  const easeOutQuart = 1 - Math.pow(1 - progress, 4);
  // Triggers on scroll into view (useInView with once: true)
}
```

---

## Background Effects

### Star Field Background (WebGL)

```tsx
// Component: StarsCanvas
<div className="w-full h-auto fixed inset-0 -z-10 overflow-hidden">
  <Canvas camera={{ position: [0, 0, 1] }}>
    <Suspense fallback={null}>
      <StarBackground />
    </Suspense>
  </Canvas>
</div>

// Star Configuration
const [sphere] = useState(() =>
  random.inSphere(new Float32Array(5000), { radius: 1.2 })
);

// Animation
useFrame((_state, delta) => {
  ref.current.rotation.x -= delta / 10;
  ref.current.rotation.y -= delta / 15;
});

// Material
<PointMaterial
  transparent
  color="#fff"
  size={0.002}
  sizeAttenuation
  depthWrite={false}
/>
```

**Configuration:**
- Technology: React Three Fiber + @react-three/drei
- Star count: 5000 points
- Distribution: Sphere with radius 1.2
- Rotation: Initial tilt Math.PI / 4
- Animation: Continuous slow rotation
- Z-index: -10 (behind all content)

### Hero Blackhole (Top)

```tsx
<video
  autoPlay
  muted
  loop
  className="rotate-180 absolute top-[-340px] left-0 w-full h-full object-contain -z-20 max-w-full"
>
  <source src="/videos/blackhole.webm" type="video/webm" />
</video>
```

**Configuration:**
- Rotation: 180deg (upside down)
- Position: top: -340px
- Object Fit: contain
- Z-index: -20

### Footer Blackhole (Bottom)

```tsx
<div className="relative w-full max-w-full overflow-hidden" style={{ height: '270px' }}>
  <video
    autoPlay
    muted
    loop
    className="absolute top-0 left-0 w-full max-w-full pointer-events-none object-contain -z-20"
    style={{ height: '540px' }}
  >
    <source src="/videos/blackhole.webm" type="video/webm" />
  </video>
</div>
```

**Configuration:**
- Container Height: 270px (clips bottom half)
- Video Height: 540px
- Shows only top glowing half
- No rotation (normal orientation)

### Section Video Backgrounds

#### Skills Section
```tsx
<div className="w-full h-full z-[-10] opacity-30 absolute flex items-center justify-center bg-cover">
  <video className="w-full h-auto" preload="false" playsInline loop muted autoPlay>
    <source src="/videos/skills-bg.webm" type="video/webm" />
  </video>
</div>
```

#### Encryption Section
```tsx
<video
  loop
  muted
  autoPlay
  playsInline
  preload="false"
  className="w-full max-w-full h-auto opacity-30"
>
  <source src="/videos/encryption-bg.webm" type="video/webm" />
</video>
```

**Configuration:**
- Opacity: 30%
- Z-index: -10
- Preload: false (performance)
- playsInline: mobile compatibility

### World Map Background (Team Section)

```tsx
<div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none">
  <Image
    src="/world-map.svg"
    alt="World Map"
    width={1200}
    height={800}
    className="w-full h-full object-cover md:object-contain"
    priority={false}
  />
</div>
```

**Configuration:**
- Opacity: 50%
- Object Fit: cover (mobile), contain (desktop)
- Non-interactive (pointer-events-none)

---

## Custom CSS Classes

### Global CSS (globals.css)

#### Decorative Text Classes

```css
/* Cursive font for decorative text */
.cursive {
  font-family: "Cedarville Cursive", cursive;
}

/* Gradient text for badges/labels */
.Welcome-text {
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0.4)
    ),
    linear-gradient(90.01deg, #e59cff 0.01%, #ba9cff 50.01%, #9cb2ff 100%);
  background-blend-mode: normal, screen;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glassmorphism badge container */
.Welcome-box {
  isolation: isolate;
  overflow: hidden;
  align-items: center;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  border-radius: 32px;
  box-shadow: inset 0 -7px 11px #a48fff1f;
  display: flex;
  position: relative;
  width: max-content;
  transition: 0.45s cubic-bezier(0.6, 0.6, 0, 1) box-shadow;
}
```

#### Button Classes

```css
/* Primary gradient button */
.button-primary {
  background: linear-gradient(
      180deg,
      rgba(60, 8, 126, 0) 0%,
      rgba(60, 8, 126, 0.32) 100%
    ),
    rgba(113, 47, 255, 0.12);
  box-shadow: inset 0 0 12px #bf97ff3d;
}
.button-primary:hover {
  background: linear-gradient(
      180deg,
      rgba(60, 8, 126, 0) 0%,
      rgba(60, 8, 126, 0.42) 100%
    ),
    rgba(113, 47, 255, 0.24);
  box-shadow: inset 0 0 12px #bf97ff70;
}
```

#### Scrollbar Styles

```css
/* Hide scrollbar utility */
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

/* Custom purple scrollbar */
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(112, 66, 248, 0.3);
  border-radius: 6px;
  border: 3px solid transparent;
  background-clip: content-box;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(112, 66, 248, 0.5);
  background-clip: content-box;
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(112, 66, 248, 0.3) transparent;
}
```

#### 3D Transform Utilities

```css
/* 3D perspective container */
.perspective-1000 {
  perspective: 1000px;
}

/* GPU-accelerated transforms */
.transform-gpu {
  transform: translateZ(0);
  will-change: transform;
}
```

#### Animation Keyframes

```css
/* Animated gradient */
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-x {
  animation: gradient-x 3s ease infinite;
  background-size: 200% 200%;
}
```

#### Swiper Custom Styles

```css
/* Pagination bullets */
.swiper-pagination-bullet-custom {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  opacity: 1;
  transition: all 0.3s ease;
  border-radius: 50%;
  cursor: pointer;
}

.swiper-pagination-bullet-active-custom {
  width: 32px;
  background: linear-gradient(to right, #a855f7, #06b6d4);
  border-radius: 4px;
}

/* Navigation buttons */
.swiper-button-next-custom,
.swiper-button-prev-custom {
  position: static !important;
  margin: 0 !important;
  width: auto !important;
  height: auto !important;
}
.swiper-button-next-custom::after,
.swiper-button-prev-custom::after {
  display: none;
}
```

#### Global Overflow Control

```css
html {
  scroll-behavior: smooth;
  overflow-x: hidden !important;
  width: 100vw;
  max-width: 100vw;
}

body {
  overflow-x: hidden !important;
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

#__next {
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}
```

---

## Motion Variants Library

### lib/motion.ts

```typescript
// Slide in from left
export function slideInFromLeft(delay: number) {
  return {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
}

// Slide in from right
export function slideInFromRight(delay: number) {
  return {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
}

// Slide in from top (constant)
export const slideInFromTop = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.5,
    },
  },
};
```

### Common Inline Variants

```typescript
// Fade up (section titles)
const fadeUp = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Fade up with delay (descriptions)
const fadeUpDelayed = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2 }
  }
};

// 3D card entry
const card3D = {
  hidden: { y: 50, opacity: 0, scale: 0.9, rotateX: -15 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// Simple card entry
const cardSimple = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Scale in (step circles)
const scaleIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: {
    delay: delay,
    duration: 0.5,
    ease: [0.16, 1, 0.3, 1]
  }
};
```

---

## Implementation Guidelines

### File Structure

```
components/
├── main/
│   ├── hero.tsx          # Hero with blackhole background
│   ├── skills.tsx        # Services with HUD-style cards
│   ├── about-us.tsx      # About with 3D tilt cards
│   ├── process.tsx       # Process timeline with 3D cards
│   ├── encryption.tsx    # Tech stack with light cards
│   ├── projects.tsx      # Results metrics with 3D cards
│   ├── team.tsx          # Team with 3D tilt cards + world map
│   ├── contact-us.tsx    # Contact form
│   ├── footer.tsx        # Footer with blackhole effect
│   ├── navbar.tsx        # Fixed navigation
│   └── star-background.tsx # WebGL star field
├── sub/
│   ├── hero-content.tsx  # Hero text content
│   └── project-card.tsx  # Project card component
└── layout/
app/
├── globals.css           # Custom CSS classes
├── layout.tsx            # Root layout with fonts
└── page.tsx              # Main page composition
lib/
└── motion.ts             # Reusable motion variants
constants/
└── index.ts              # Data constants
```

### Code Patterns

#### Section Wrapper
```tsx
<section
  id="section-id"
  className="flex flex-col items-center justify-center py-20 px-4 md:px-20 relative overflow-hidden w-full max-w-full"
>
  {/* Background (if applicable) */}
  {/* Section title */}
  {/* Section description */}
  {/* Content grid */}
</section>
```

#### Card Grid
```tsx
<div className="w-full max-w-6xl">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item, index) => (
      <CardComponent key={index} {...item} index={index} />
    ))}
  </div>
</div>
```

#### Framer Motion Card
```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={variants}
  className="card-styles"
>
  {/* Card content */}
</motion.div>
```

### Performance Optimization

#### Video Optimization
- Use `.webm` format for best compression
- Set `preload="false"` for below-fold videos
- Add `playsInline` for mobile compatibility
- Use `muted` and `autoPlay` for background videos

#### Animation Performance
- Use `transform-gpu` class for GPU acceleration
- Keep particle counts to 6 maximum
- Use `will-change: transform` sparingly
- Prefer `transform` and `opacity` properties

#### Rendering Optimization
- Use `viewport={{ once: true }}` for scroll animations
- Implement lazy loading for images
- Use Next.js Image component with proper sizing
- Set `priority={false}` for below-fold images

### Accessibility

#### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### ARIA Labels
```tsx
<Link
  href={link}
  aria-label={`Visit our ${name} page`}
  target="_blank"
  rel="noopener noreferrer"
>
```

#### Keyboard Navigation
```tsx
className="focus:outline-none focus:ring-2 focus:ring-purple-500"
```

---

## Component Checklist

When creating new components, ensure:

- [ ] Uses standardized card base styles (`border-[#7042f88b] bg-[#7042f815]`)
- [ ] Implements appropriate animation variant (HUD, 3D tilt, or simple)
- [ ] Includes responsive breakpoints (mobile-first)
- [ ] Has proper z-index layering
- [ ] Uses GPU acceleration where needed (`transform-gpu`)
- [ ] Includes hover states with smooth transitions
- [ ] Has accessibility attributes (aria-labels, focus states)
- [ ] Uses mobile-responsive padding (`px-4 md:px-20`)
- [ ] Follows consistent typography scale
- [ ] Uses proper spacing tokens
- [ ] Prevents horizontal overflow (`max-w-full overflow-hidden`)

---

## Quick Reference

### Border & Background
```tsx
// Standard card
className="border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm rounded-xl"

// Light card
className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg"
```

### Section Title
```tsx
className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
```

### Section Padding
```tsx
className="py-20 px-4 md:px-20"
```

### Card Grid
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

### Primary Button
```tsx
className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold"
```

---

**Document Version:** 3.0
**Last Updated:** 2026-03-11
**Maintained By:** M.D.N Tech Development Team
