# M.D.N Tech - Design System Documentation

> Complete design specification for the M.D.N Tech space-themed website

**Last Updated:** 2026-03-01
**Version:** 2.0
**Status:** ✅ Production Ready

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Animations](#animations)
7. [Background Effects](#background-effects)
8. [Implementation Guidelines](#implementation-guidelines)

---

## Design Philosophy

### Theme: Space & Technology
The M.D.N Tech website uses a **space-themed aesthetic** with:
- Dark cosmic background with animated stars
- Purple-cyan gradient accents
- Glassmorphism effects
- Futuristic HUD-style elements
- Smooth Framer Motion animations

### Design Principles
1. **Consistency First** - Standardized patterns across all sections
2. **Purposeful Animation** - Every animation serves a user experience goal
3. **Visual Hierarchy** - Clear information architecture
4. **Interactive Delight** - Engaging hover effects and micro-interactions
5. **Performance** - Optimized videos and animations

---

## Color System

### Primary Colors

```css
/* Background */
--bg-primary: #030014        /* Main dark background */
--bg-secondary: #050518      /* Footer background */

/* Accent Colors */
--purple-500: #7042f8        /* Primary brand purple */
--cyan-500: #22d3ee          /* Secondary brand cyan */

/* Gradients */
--gradient-primary: linear-gradient(to right, #7042f8, #22d3ee)
--gradient-reverse: linear-gradient(to right, #22d3ee, #7042f8)
```

### Text Colors

```css
/* Text Hierarchy */
--text-white: #ffffff        /* Headings and important text */
--text-gray-300: #d1d5db     /* Body text (hover state) */
--text-gray-400: #9ca3af     /* Body text (default) */
--text-gray-500: #6b7280     /* Secondary text */
--text-gray-600: #4b5563     /* Tertiary text */
```

### Border Colors

```css
/* Borders */
--border-purple: rgba(112, 66, 248, 0.55)     /* Card borders - #7042f88b */
--border-purple-light: rgba(112, 66, 248, 0.30)  /* Subtle borders */
--border-white: rgba(255, 255, 255, 0.06)     /* Footer dividers */
```

### Background Overlays

```css
/* Glassmorphism */
--glass-bg: rgba(112, 66, 248, 0.08)          /* Card background - #7042f815 */
--glass-hover: rgba(112, 66, 248, 0.15)       /* Card hover state */

/* Effects */
--glow-purple: rgba(112, 66, 248, 0.4)        /* Purple glow */
--glow-cyan: rgba(34, 211, 238, 0.4)          /* Cyan glow */
```

---

## Typography

### Font Family

```css
font-family: var(--font-geist-sans), system-ui, -apple-system, sans-serif;
```

### Type Scale

#### H1 - Section Titles
```tsx
className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 text-center"
```
- **Size:** 40px
- **Weight:** 600 (semibold)
- **Style:** Gradient text (purple to cyan)
- **Usage:** All major section headings

#### H2 - Subsection Headers
```tsx
className="text-3xl md:text-4xl font-bold text-white mb-6"
```
- **Size:** 30px mobile, 36px desktop
- **Weight:** 700 (bold)
- **Color:** White
- **Usage:** Subsection titles

#### H3 - Card Titles
```tsx
className="text-xl font-semibold text-white mb-3"
```
- **Size:** 20px (1.25rem)
- **Weight:** 600 (semibold)
- **Color:** White
- **Usage:** All card titles (Skills, Process, Team, etc.)

#### Body Large - Section Descriptions
```tsx
className="text-lg text-gray-400 leading-relaxed"
```
- **Size:** 18px (1.125rem)
- **Color:** Gray 400
- **Line Height:** relaxed (1.625)
- **Usage:** Section introductions

#### Body Regular - Card Descriptions
```tsx
className="text-sm text-gray-400 leading-relaxed"
```
- **Size:** 14px (0.875rem)
- **Color:** Gray 400
- **Line Height:** relaxed (1.625)
- **Usage:** Card content, descriptions

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
  color: #d1d5db; /* Gray 300 */
}
```

---

## Spacing & Layout

### Section Padding

```tsx
/* Standard section padding */
className="py-20 px-4 md:px-20"

/* Hero section (custom) */
className="h-[650px] px-4 md:px-20 mt-40"

/* Footer */
className="py-20 px-4 md:px-8"
```

### Container Max Widths

```tsx
/* Standard content width */
max-w-6xl

/* Hero text content (narrower for readability) */
max-w-[700px]

/* Full page width */
w-full
```

### Grid Systems

#### 3-Column Grid (Services, Results, Team)
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

#### 2-Column Grid (Footer, Contact)
```tsx
className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
```

#### Team Grid (Special)
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
/* Note: Larger gap (gap-8) for visual breathing room */
```

#### Skills Grid (Unique - No Gap)
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
/* No gap because card borders create visual grid lines */
```

### Spacing Scale

```css
/* Consistent spacing tokens */
gap-0:   0px       /* Skills grid only */
gap-2:   8px       /* Form elements */
gap-3:   12px      /* Social links, small groups */
gap-4:   16px      /* Button groups, flex items */
gap-6:   24px      /* Card grids (standard) */
gap-8:   32px      /* Team grid, larger groups */
gap-12:  48px      /* Footer sections */
gap-16:  64px      /* Footer sections (desktop) */

mb-3:    12px      /* Card title margin */
mb-4:    16px      /* Element spacing */
mb-6:    24px      /* Section spacing */
mb-12:   48px      /* Large section spacing */
```

---

## Components

### Card Component Variants

#### Variant A: HUD Style Card (Skills Section Only)

```tsx
<motion.div
  whileHover={{ y: -4 }}
  className="relative p-6 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm group overflow-hidden transition-all duration-300"
>
  {/* Glass morphism background on hover */}
  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

  {/* HUD Border Effects - animated lines, corners, scanning effects */}
  {/* See Skills component for full implementation */}

  {/* Content */}
  <div className="relative z-10">
    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
      {description}
    </p>
  </div>
</motion.div>
```

**Features:**
- Animated HUD border lines (top, bottom, left, right)
- Corner brackets with pulse animation
- Scanning line effect
- Pulsing border glow
- Corner glow animations
- Glass morphism overlay

**Usage:** Skills/Services section only (premium feel)

#### Variant B: 3D Tilt Card (Process, Team, Projects)

```tsx
<motion.div
  ref={ref}
  onMouseMove={handleMouseMove}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={handleMouseLeave}
  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
  className="relative p-6 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm overflow-hidden transform-gpu"
>
  {/* Mouse-following glow */}
  <motion.div
    className="absolute w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
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
      animate={{
        y: isHovered ? [0, -20, 0] : 0,
        opacity: isHovered ? [0, 1, 0] : 0,
      }}
      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
    />
  ))}

  {/* Shine sweep effect */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
    animate={{ x: isHovered ? "100%" : "-100%" }}
    transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, repeatDelay: 2 }}
  />

  {/* Content */}
  <div className="relative z-10">{children}</div>
</motion.div>
```

**Features:**
- 3D tilt effect (7.5deg rotation max)
- Mouse position tracking
- Spring physics (stiffness: 500, damping: 100)
- Floating particles (6 particles)
- Mouse-following glow
- Shine sweep animation

**Usage:** Process, Team, Projects sections

#### Variant C: Simple Card (Results, Contact Info)

```tsx
<motion.div
  variants={{
    hidden: { y: 50, opacity: 0, scale: 0.9, rotateX: -15 },
    visible: {
      y: 0, opacity: 1, scale: 1, rotateX: 0,
      transition: { delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  }}
  className="relative p-6 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm"
>
  {/* Content only - minimal effects */}
</motion.div>
```

**Features:**
- Entry animation only
- No complex hover effects
- Cleaner appearance for content-heavy cards

**Usage:** Results metrics, Contact information cards

### Base Card Styling (Universal)

All cards share these base styles:

```tsx
className="rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm"
```

- **Border Radius:** 12px (rounded-xl)
- **Border:** 1px solid rgba(112, 66, 248, 0.55)
- **Background:** rgba(112, 66, 248, 0.08) with backdrop blur
- **Backdrop Filter:** blur(sm) - 8px blur

### Button Component

#### Primary Button
```tsx
<motion.a
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="py-3 px-8 border border-[#7042f88b] text-center text-white cursor-pointer rounded-lg font-semibold hover:bg-[#7042f815] transition-all duration-300"
>
  {text}
</motion.a>
```

#### Secondary Button (Form Submit)
```tsx
<button
  type="submit"
  className="shrink-0 px-4 py-2.5 rounded-md bg-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/30 transition-colors"
>
  {text}
</button>
```

---

## Animations

### Scroll-Triggered Animations

#### Section Title Animation
```tsx
<motion.h1
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }}
>
```

**Parameters:**
- Initial Y offset: -20px
- Duration: 500ms
- Direction: Slide from top
- Triggers: Once on scroll into view

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

**Parameters:**
- Initial Y offset: -20px
- Duration: 500ms
- Delay: 200ms (after title)
- Direction: Slide from top

#### Simple Card Entry Animation
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

**Parameters:**
- Initial Y offset: 20px
- Duration: 500ms
- Stagger: 80ms per card (Skills section)
- Easing: easeOut

#### 3D Card Entry Animation
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
      ease: [0.16, 1, 0.3, 1]
    }
  }
}}
```

**Parameters:**
- Initial Y offset: 50px
- Initial scale: 0.9
- Initial rotateX: -15deg
- Duration: 600ms
- Stagger: 100ms per card
- Easing: Custom cubic-bezier [0.16, 1, 0.3, 1]

### Hover Animations

#### Simple Hover (Skills Cards)
```tsx
whileHover={{ y: -4 }}
```

#### 3D Tilt Hover (Process, Team, Projects)
```tsx
// Mouse position tracking
const x = useMotionValue(0);
const y = useMotionValue(0);
const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
```

**Parameters:**
- Max rotation: ±7.5deg
- Spring stiffness: 500
- Spring damping: 100
- Transform style: preserve-3d

#### Button Hover
```tsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### Continuous Animations

#### HUD Scanning Line
```tsx
<motion.div
  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
  initial={{ top: 0 }}
  animate={{ top: ["0%", "100%"] }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }}
/>
```

#### Pulsing Border Glow
```tsx
<motion.div
  className="absolute inset-0 border-[1px] border-cyan-400/30"
  animate={{ opacity: [0.3, 0.6, 0.3] }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

#### Corner Glow
```tsx
<motion.div
  animate={{
    boxShadow: [
      "0 0 0px rgba(34, 211, 238, 0)",
      "0 0 15px rgba(34, 211, 238, 0.9)",
      "0 0 0px rgba(34, 211, 238, 0)"
    ]
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

#### Shine Sweep
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
<motion.div
  className="absolute w-1 h-1 bg-cyan-400 rounded-full"
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
/>
```

**Parameters:**
- Particle count: 6
- Y range: 0 to -20px
- X range: 0 to 10px
- Duration: 2s
- Stagger: 200ms per particle

---

## Background Effects

### Hero Blackhole (Top)

```tsx
<video
  autoPlay
  muted
  loop
  className="rotate-180 absolute top-[-340px] left-0 w-full h-full object-contain -z-20"
>
  <source src="/videos/blackhole.webm" type="video/webm" />
</video>
```

**Configuration:**
- **Rotation:** 180deg (upside down)
- **Position:** top: -340px (partially visible)
- **Size:** Full width, auto height
- **Object Fit:** contain (maintains aspect ratio)
- **Z-index:** -20 (behind all content)
- **Purpose:** Decorative header element

### Footer Blackhole (Bottom)

```tsx
{/* Blackhole effect - clipped to show only top half */}
<div className="relative w-full overflow-hidden" style={{ height: '270px' }}>
  <video
    autoPlay
    muted
    loop
    className="absolute top-0 left-0 w-full pointer-events-none object-contain -z-20"
    style={{ height: '540px' }}
  >
    <source src="/videos/blackhole.webm" type="video/webm" />
  </video>
</div>
```

**Configuration:**
- **Container Height:** 270px (visible area)
- **Video Height:** 540px (actual size)
- **Clipping:** Bottom 270px hidden by overflow
- **Result:** Shows only top glowing half
- **Position:** Stuck to top of footer
- **Z-index:** -20 (behind footer content)
- **Background:** Transparent (shows stars through)

### Section Video Backgrounds

#### Skills Section Background
```tsx
<video
  className="w-full h-auto"
  preload="false"
  playsInline
  loop
  muted
  autoPlay
>
  <source src="/videos/skills-bg.webm" type="video/webm" />
</video>
```

**Container:**
```tsx
<div className="w-full h-full absolute">
  <div className="w-full h-full z-[-10] opacity-30 absolute flex items-center justify-center bg-cover">
    {/* Video here */}
  </div>
</div>
```

**Configuration:**
- **Opacity:** 30%
- **Z-index:** -10
- **Position:** Absolute, full container
- **Purpose:** Subtle animated background

### Star Field Background

```tsx
<StarBackground />
```

**Implementation:** React Three Fiber component
- **Technology:** WebGL via Three.js
- **Effect:** Animated star particles
- **Performance:** GPU-accelerated
- **Coverage:** Full viewport
- **Z-index:** -30 (deepest background layer)

### World Map (Team Section)

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
- **Opacity:** 50%
- **Size:** 1200x800
- **Object Fit:** cover (mobile), contain (desktop)
- **Purpose:** Geographic context for team

---

## Implementation Guidelines

### File Structure

```
components/
├── main/
│   ├── hero.tsx          # Hero with blackhole background
│   ├── skills.tsx        # Services with HUD-style cards
│   ├── process.tsx       # Process with 3D tilt cards
│   ├── projects.tsx      # Results metrics
│   ├── team.tsx          # Team with 3D tilt cards
│   ├── contact.tsx       # Contact form
│   └── footer.tsx        # Footer with blackhole effect
├── sub/
│   ├── hero-content.tsx  # Hero text content
│   └── project-card.tsx  # Project card component
└── layout/
    └── navbar.tsx        # Navigation
```

### Code Patterns

#### 1. Section Wrapper
```tsx
<section
  id="section-id"
  className="flex flex-col items-center justify-center py-20 px-4 md:px-20 relative overflow-hidden"
>
  {/* Background video (if applicable) */}
  {/* Section title */}
  {/* Section description */}
  {/* Content grid */}
</section>
```

#### 2. Card Grid
```tsx
<div className="w-full max-w-6xl">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item, index) => (
      <CardComponent key={index} {...item} index={index} />
    ))}
  </div>
</div>
```

#### 3. Framer Motion Card
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
- Compress videos to reasonable file size
- Use `preload="false"` for below-fold videos
- Add `playsInline` for mobile compatibility

#### Animation Performance
- Use `transform-gpu` class for GPU acceleration
- Keep particle counts reasonable (6 max)
- Use `will-change` sparingly
- Prefer `transform` and `opacity` over other properties

#### Rendering Optimization
- Use `viewport={{ once: true }}` for scroll animations
- Implement lazy loading for images
- Use Next.js Image component
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

- [ ] Uses standardized card base styles
- [ ] Implements appropriate animation variant
- [ ] Includes responsive breakpoints
- [ ] Has proper z-index layering
- [ ] Optimized for performance (GPU acceleration)
- [ ] Includes hover states
- [ ] Has accessibility attributes
- [ ] Mobile-responsive padding
- [ ] Consistent typography scale
- [ ] Proper spacing tokens

---

**Document Version:** 2.0
**Last Updated:** 2026-03-01
**Maintained By:** M.D.N Tech Development Team
