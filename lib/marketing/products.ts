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
  href: string; // app.mdntech.org target (live products only)
  cta: string; // "Try Free", "Browse Skills" — never payment language
  status: Record<LandingMode, ProductStatus>;
}

export const APP_URL = "https://app.mdntech.org";

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
    tagline: "Claude Code superpowers. Free forever.",
    description:
      "Production-tested Claude Code skills and safety hooks — session continuity (/start, /wrap), guarded automation, one-line install. MIT licensed.",
    icon: "wrench",
    href: `${APP_URL}/toolkit`,
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
