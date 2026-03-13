# M.D.N Tech SEO Action Plan

**SEO Health Score:** 38/100
**Target Score:** 75/100
**Priority Focus:** Technical SEO + Schema Implementation

---

## Critical Priority (Fix Immediately)

These issues are blocking indexing or could cause penalties.

### 1. Create robots.txt
**Impact:** Search engines have no crawl guidance
**File:** Create `app/robots.ts`

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: 'https://mdntech.com/sitemap.xml',
  }
}
```

### 2. Create XML Sitemap
**Impact:** Pages may not be discovered or indexed
**File:** Create `app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next'

const BLOG_POSTS = [
  'ai-engineering-2026',
  'web3-enterprise-adoption',
  'full-stack-ownership',
  'production-ready-ai',
  'mobile-web3-integration',
  'scaling-without-rewrites',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const blogUrls = BLOG_POSTS.map((slug) => ({
    url: `https://mdntech.com/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: 'https://mdntech.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://mdntech.com/team',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://mdntech.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
    {
      url: 'https://mdntech.com/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://mdntech.com/terms',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
```

### 3. Fix Homepage H1 Tag
**Impact:** Main heading is hidden from users
**File:** `components/sub/hero-content.tsx`

**Current (Line 22-27):**
```tsx
<div className="Welcome-box ... invisible">
  <h1 className="Welcome-text text-[13px]">
    UAE-Based · AI-Powered Development · Global Delivery
  </h1>
</div>
```

**Fix:** Move H1 to main heading text:
```tsx
<motion.h1
  variants={slideInFromLeft(0.5)}
  className="flex flex-col gap-6 mt-6 text-4xl md:text-6xl lg:text-7xl text-bold text-white w-full max-w-full"
>
  <span className="text-center break-words">
    <span className="text-transparent bg-clip-text font-bold bg-gradient-to-r from-purple-500 to-cyan-500">
      Build Smarter.
    </span>
    <br />
    <span className="text-transparent bg-clip-text font-bold bg-gradient-to-r from-cyan-500 to-purple-500">
      Ship Faster.
    </span>
  </span>
</motion.h1>
```

And remove or make the welcome text a `<p>` tag.

### 4. Update Site Metadata
**Impact:** Poor search appearance and CTR
**File:** `config/index.ts`

```typescript
import type { Metadata } from "next";

const siteUrl = "https://mdntech.com";

export const siteConfig: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "M.D.N Tech | AI & Full-Stack Development Agency | UAE",
    template: "%s | M.D.N Tech",
  },
  description: "Ship production-ready AI systems, Web3 solutions, and full-stack applications faster. UAE-based tech agency with full lifecycle ownership. From idea to deployment in weeks, not months.",
  keywords: [
    "AI development agency",
    "full-stack development UAE",
    "Web3 development",
    "blockchain solutions",
    "AI engineers",
    "production-ready software",
    "mobile app development",
    "React Native development",
    "Next.js agency",
  ],
  authors: [{ name: "M.D.N Tech FZE" }],
  creator: "M.D.N Tech FZE",
  publisher: "M.D.N Tech FZE",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "M.D.N Tech | AI & Full-Stack Development Agency",
    description: "Ship production-ready AI systems and full-stack applications faster. UAE-based tech agency with global delivery.",
    siteName: "M.D.N Tech",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "M.D.N Tech - Build Smarter. Ship Faster.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M.D.N Tech | AI & Full-Stack Development Agency",
    description: "Ship production-ready AI systems and full-stack applications faster.",
    creator: "@MDNTechOrg",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};
```

### 5. Add Organization Schema
**Impact:** Missing rich results and knowledge panel eligibility
**File:** `app/layout.tsx`

Add JSON-LD script in the `<head>`:

```tsx
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "M.D.N Tech FZE",
  "alternateName": "M.D.N Tech",
  "url": "https://mdntech.com",
  "logo": "https://mdntech.com/logo.png",
  "description": "UAE-based tech agency specializing in AI systems, Web3 solutions, and full-stack development with global delivery.",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Al Shmookh Business Center M 1003, One UAQ, UAQ Free Trade Zone",
    "addressLocality": "Umm Al Quwain",
    "addressCountry": "AE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact@mdntech.org",
    "contactType": "sales",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://www.instagram.com/mdntechorg/",
    "https://x.com/MDNTechOrg",
    "https://www.linkedin.com/company/mdntech/"
  ],
  "knowsAbout": [
    "Artificial Intelligence",
    "Machine Learning",
    "Blockchain",
    "Web3",
    "Full-Stack Development",
    "Mobile App Development"
  ]
};

// Add to layout.tsx body:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(organizationSchema),
  }}
/>
```

---

## High Priority (Fix Within 1 Week)

These significantly impact rankings.

### 6. Add Page-Specific Metadata

**Team Page (`app/team/page.tsx`):**
```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the full-stack AI engineers at M.D.N Tech. Our team brings 20+ years combined experience in AI, blockchain, and production-ready software development.",
  openGraph: {
    title: "Our Team | M.D.N Tech",
    description: "Meet the engineers behind M.D.N Tech.",
  },
};
```

**Blog Page (`app/blog/page.tsx`):**
```typescript
export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on AI engineering, Web3 development, and building production-ready systems from the M.D.N Tech team.",
};
```

**Privacy Page (`app/privacy/page.tsx`):**
```typescript
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "M.D.N Tech FZE privacy policy. How we collect, use, and protect your personal data.",
};
```

**Terms Page (`app/terms/page.tsx`):**
```typescript
export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "M.D.N Tech FZE terms and conditions for IT development services.",
};
```

### 7. Add Blog Post Dynamic Metadata

**File:** `app/blog/[slug]/page.tsx`

Change from `"use client"` to Server Component and add:

```typescript
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = BLOG_POSTS[params.slug];

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({
    slug,
  }));
}
```

### 8. Fix Footer Logo Alt Text

**File:** `components/main/footer.tsx` (Line 82)

**Current:**
```tsx
<Image src="/logo.png" alt="" width={32} height={32} />
```

**Fix:**
```tsx
<Image src="/logo.png" alt="M.D.N Tech logo" width={32} height={32} />
```

### 9. Remove Placeholder Blog Content

**Issue:** Blog posts say "Content coming soon..." which is thin content.

**Options:**
1. Write actual content for the 6 blog posts
2. Remove blog section entirely until content is ready
3. Add `noindex` to blog posts until content exists

**Recommended:** Either write 500+ word articles or add noindex:
```typescript
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};
```

### 10. Add Security Headers

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## Medium Priority (Fix Within 1 Month)

Optimization opportunities.

### 11. Add Article Schema to Blog Posts

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Rise of AI Engineering in 2026",
  "description": "How AI-native development practices are reshaping...",
  "author": {
    "@type": "Organization",
    "name": "M.D.N Tech"
  },
  "publisher": {
    "@type": "Organization",
    "name": "M.D.N Tech FZE",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mdntech.com/logo.png"
    }
  },
  "datePublished": "2026-03-05",
  "dateModified": "2026-03-05"
}
```

### 12. Add Person Schema to Team Page

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Martin Jerabek",
  "jobTitle": "CEO",
  "worksFor": {
    "@type": "Organization",
    "name": "M.D.N Tech FZE"
  },
  "description": "CEO of M.D.N Tech with 10 years in blockchain and Web3.",
  "sameAs": ["https://linkedin.com/..."]
}
```

### 13. Add Breadcrumbs to Blog Posts

```tsx
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://mdntech.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://mdntech.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title"
    }
  ]
};
```

### 14. Create Open Graph Image

Create `/public/og-image.png` (1200x630px) with:
- M.D.N Tech logo
- Tagline: "Build Smarter. Ship Faster."
- Brand colors (purple/cyan gradient)

### 15. Add llms.txt for AI Crawlers

**File:** `public/llms.txt`

```
# M.D.N Tech - Company Information for AI Systems

## About
M.D.N Tech FZE is a UAE-based technology agency specializing in AI systems, Web3/blockchain solutions, and full-stack development. We deliver production-ready software with full lifecycle ownership.

## Services
- AI & Machine Learning Development
- Blockchain & Web3 Solutions
- Full-Stack Web Development
- Mobile App Development
- UI/UX Design

## Contact
Email: contact@mdntech.org
Location: Umm Al Quwain, UAE

## Key Facts
- Founded: 2024
- Team: Full-stack AI engineers with 20+ years combined experience
- Delivery: Global
- Approach: Single-engineer ownership, weeks not months
```

---

## Low Priority (Backlog)

Nice to have improvements.

### 16. Convert Images to WebP
Convert PNG images in `/public` to WebP format for smaller file sizes.

### 17. Add Service Detail Pages
Create dedicated pages:
- `/services/ai-development`
- `/services/web3-blockchain`
- `/services/mobile-development`
- `/services/ui-ux-design`

### 18. Add FAQ Section with Schema
Add FAQ to homepage or services with FAQPage schema.

### 19. Create Case Studies
Add `/case-studies` section with real project outcomes and metrics.

### 20. Implement Related Posts
Add "Related Articles" section to blog post pages.

---

## Implementation Checklist

### Week 1 (Critical)
- [ ] Create `app/robots.ts`
- [ ] Create `app/sitemap.ts`
- [ ] Update `config/index.ts` with new metadata
- [ ] Fix H1 tag in `hero-content.tsx`
- [ ] Add Organization JSON-LD to `layout.tsx`

### Week 2 (High)
- [ ] Add metadata to team page
- [ ] Add metadata to blog pages
- [ ] Fix footer logo alt text
- [ ] Add security headers to `next.config.js`
- [ ] Decide on blog content strategy (write or noindex)

### Week 3-4 (Medium)
- [ ] Add Article schema to blog posts
- [ ] Add Person schema to team page
- [ ] Create OG image
- [ ] Add breadcrumb schema
- [ ] Create `llms.txt`

### Month 2+ (Low)
- [ ] Convert images to WebP
- [ ] Create service pages
- [ ] Add FAQ section
- [ ] Create case studies
- [ ] Build out blog content

---

## Expected Score Improvement

| Phase | Estimated Score |
|-------|-----------------|
| Current | 38/100 |
| After Critical fixes | 55/100 |
| After High priority | 68/100 |
| After Medium priority | 75/100 |
| After all fixes | 85/100 |

---

*Action plan generated by Claude Code SEO Audit*
