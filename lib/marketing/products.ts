// Single source of truth for the landing product lineup (website-rebuild v2.0).
// All card copy lives here — never hard-coded in JSX — so the credits model
// (a future `credits` field) slots in without touching components.

import { FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

export type LandingMode = "mvp" | "full";
export type ProductStatus = "live" | "coming-soon" | "hidden";

export interface MarketingProduct {
  id: "chatkit" | "toolkit" | "signakit" | "marketkit" | "techkit";
  name: string;
  tagline: string; // gradient one-liner
  description: string;
  icon: string; // icon id, rendered by ProductIcon in product-card.tsx
  href: string; // link target — marketing page ("/toolkit") or app.mdntech.org
  cta: string; // "Try Free", "Browse Skills" — never payment language
  status: Record<LandingMode, ProductStatus>;
}

export const APP_URL = "https://app.mdntech.org";

// THE PORTAL GATE (2026-08-15). The customer portal is not open to the public
// yet, so no surface on this site may walk a visitor into it. While APP_LIVE is
// false every CTA that would point at app.mdntech.org renders as an inert
// "Coming soon" control instead of a link, and the prose links that lead there
// either drop or fall back to an internal page.
//
// Same fail-safe shape as getLandingMode(): Production has no var, so the
// default is CLOSED and the portal can only be revealed deliberately. To open
// it, set NEXT_PUBLIC_APP_LIVE=true in Vercel (Production) and redeploy — no
// code change, one flag, every CTA comes back at once.
//
// Consumers: appCta() below, ProductCard, the navbar/footer, the landing hero +
// credits strip, and every /chatkit + /toolkit CTA. Grep APP_LIVE before adding
// a new link to the app.
export const APP_LIVE = process.env.NEXT_PUBLIC_APP_LIVE === "true";

/**
 * A CTA that targets the portal. Returns the real link when the portal is open
 * and a disabled "Coming soon" button otherwise, so call sites carry no
 * conditional of their own. Shape matches CtaLink in
 * components/product-pages/motion-primitives.tsx.
 *
 * No class strings here on purpose — this file lives under lib/, which Tailwind
 * does not scan (see components/main/hero-shell.ts for what that costs).
 */
export function appCta(
  path: string,
  label: string
): { href: string; label: string; disabled?: boolean } {
  return APP_LIVE
    ? { href: `${APP_URL}${path}`, label }
    : { href: "", label: "Coming soon", disabled: true };
}

/** True for a link that would leave the site for the portal. */
export const isAppHref = (href: string): boolean => href.startsWith(APP_URL);

export const MARKETING_PRODUCTS: MarketingProduct[] = [
  {
    id: "chatkit",
    name: "ChatKit",
    tagline: "Your knowledge. Your chatbot. One line of code.",
    description: `Turn any knowledge base into a branded AI chatbot. Paste content, pick tone, embed with a single tag. ${FREE_TRIAL_MESSAGES} free trial messages.`,
    icon: "chat",
    href: `${APP_URL}/chatkit`,
    cta: "Try Free",
    status: { mvp: "live", full: "live" },
  },
  {
    id: "toolkit",
    name: "ToolKit",
    tagline: "Claude Code superpowers. Free today.",
    description:
      "Production-tested Claude Code skills and safety hooks — session continuity (/handoff start, /handoff wrap), guarded automation, a paste-and-go install. The two published skills are MIT licensed.",
    icon: "wrench",
    href: "/toolkit",
    cta: "Browse Skills",
    status: { mvp: "live", full: "live" },
  },
  {
    id: "signakit",
    name: "SignaKit",
    tagline: "Authentication that feels invisible.",
    description:
      "Drop-in login and crypto wallet for any app. Google, Apple, email, or Web3 wallet. One line to integrate.",
    icon: "shield",
    href: APP_URL,
    cta: "Get Started",
    status: { mvp: "coming-soon", full: "live" },
  },
  {
    id: "marketkit",
    name: "MarketKit",
    tagline: "Your AI go-to-market copilot.",
    description:
      "Scan your product, generate a launch kit, run weekly growth sprints with tracked metrics — marketing that ships itself.",
    icon: "rocket",
    href: APP_URL,
    cta: "Start Growing",
    status: { mvp: "coming-soon", full: "live" },
  },
  {
    id: "techkit",
    name: "TechKit",
    tagline: "Ops visibility on autopilot.",
    description:
      "Uptime, deploys, provider health, AI cost tracking, and a weekly AI ops digest — your stack, monitored.",
    icon: "pulse",
    href: APP_URL,
    cta: "Monitor Your Stack",
    status: { mvp: "coming-soon", full: "live" },
  },
];

// Build-time env var: Vercel scopes NEXT_PUBLIC_LANDING_MODE=full to Preview
// only; Production has no var → defaults to 'mvp' (fail-safe — FULL cannot
// leak to prod). When all products ship: set the var in Production + redeploy.
export function getLandingMode(): LandingMode {
  return process.env.NEXT_PUBLIC_LANDING_MODE === "full" ? "full" : "mvp";
}

export function visibleProducts(mode: LandingMode): MarketingProduct[] {
  return MARKETING_PRODUCTS.filter((p) => p.status[mode] !== "hidden");
}

export function liveProducts(mode: LandingMode): MarketingProduct[] {
  return MARKETING_PRODUCTS.filter((p) => p.status[mode] === "live");
}
