import type { Metadata } from "next";

import { AnswerBehaviour } from "@/components/chatkit/answer-behaviour";
import { ChatKitFaq } from "@/components/chatkit/chatkit-faq";
import { ChatKitHero } from "@/components/chatkit/chatkit-hero";
import { ChatKitClosing } from "@/components/chatkit/closing";
import { Control } from "@/components/chatkit/control";
import { IncludedAndUnlocks } from "@/components/chatkit/included-and-unlocks";
import { KnowledgeBase } from "@/components/chatkit/knowledge-base";
import { Limits } from "@/components/chatkit/limits";
import { Pricing } from "@/components/chatkit/pricing";
import { SetupSteps } from "@/components/chatkit/setup-steps";
import { UseCases } from "@/components/chatkit/use-cases";
import { WidgetAnatomy } from "@/components/chatkit/widget-anatomy";
import {
  organizationRef,
  websiteRef,
} from "@/components/product-pages/schema";
import { APP_URL } from "@/lib/marketing/products";
import { FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

// /chatkit — the ChatKit product page. Targets the "AI chatbot for website"
// cluster at a depth the homepage's ChatKit section deliberately does not:
// the homepage summarises a capability in a sentence, this page names the
// field, the number, the mechanism or the boundary behind it.
//
// Section order: setup -> knowledge-base -> widget -> answers -> use-cases ->
// included-vs-addons -> pricing -> control -> limits -> faq -> closing band.
// The conversion CTA ends the page in the shared CtaBand; the FAQ close keeps
// only navigational links.
//
// Layout note: Navbar, Footer, StarsCanvas and ReducedMotionProvider all come
// from app/(marketing)/layout.tsx — nothing here re-adds them.

const PAGE_URL = "https://mdntech.org/chatkit";

// "No developer needed", not "no code": step 4 of the setup is hand-editing
// your page HTML (a tag manager will not do), so "no code" would be the one
// soft claim on an otherwise literal page.
const PAGE_TITLE =
  "ChatKit: AI Chatbot for Your Website, No Developer Needed";

const META_DESCRIPTION = `Add an AI chatbot to your website with one line of code. It answers only from your content, in your visitor's language. ${FREE_TRIAL_MESSAGES} free messages, no card.`;

export const metadata: Metadata = {
  // `absolute` so the root template does not append a second brand suffix.
  title: { absolute: PAGE_TITLE },
  description: META_DESCRIPTION,
  keywords: [
    "AI chatbot for website",
    "add AI chatbot to website",
    "chatbot without coding",
    "AI chatbot trained on your own content",
    "knowledge base chatbot",
    "AI customer support for small business",
    "embed AI chatbot with one line of code",
    "AI chatbot widget for WordPress, Shopify and Webflow",
    "chatbot that answers from your own documents",
    "AI chatbot pricing per message",
    "no-subscription AI chatbot",
    "multilingual website chatbot",
    "AI chatbot that does not make things up",
  ],
  alternates: {
    // Self-canonical. No hreflang cluster: there is no Slovak twin of this page.
    canonical: "/chatkit",
  },
  // Next REPLACES the root openGraph object rather than deep-merging it, so
  // the inherited image, siteName and locale are restated explicitly here —
  // without them the page ships with no social preview at all.
  openGraph: {
    url: PAGE_URL,
    title: PAGE_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    siteName: "M.D.N Tech",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChatKit — an AI chatbot for your website",
      },
    ],
  },
  // Mirrored by hand: the root layout defines twitter.title/description/images,
  // and Next's auto-fill only copies openGraph values into twitter fields that
  // are ABSENT — so without this block the page shares with the root's card.
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: META_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

// SoftwareApplication + BreadcrumbList + WebPage.
//
// Deliberately NOT emitted, and the reasons are permanent:
//  - aggregateRating / review / ratingValue / reviewCount — there is not one
//    customer rating anywhere in the product. The only rating data that exists
//    is the OWNER's private thumbs-up/down on individual replies, which is
//    neither a review nor public. Fabricating this is structured-data spam.
//  - Offers for the credit packs or the unlocks — no payment processor is
//    integrated (both purchase routes write status 'mock'), so advertising a
//    purchasable price would be a false availability claim. The single free
//    Offer below IS true: the trial costs nothing and needs no card.
//  - HowTo for the four setup steps — truthful, but Google retired HowTo rich
//    results in 2023, so it would only add a second copy of the visible copy
//    to keep in sync.
//  - Product — pulls toward offers and ratings we cannot populate honestly.
//  - Organization / WebSite — already emitted globally from app/layout.tsx
//    with stable @ids. Referenced here via organizationRef()/websiteRef(),
//    never redeclared.
//  - softwareHelp — it takes a CreativeWork, not a bare URL, and it would only
//    duplicate installUrl here anyway.
//
// featureList carries ONLY the genuinely ungated capabilities — the same set
// the visible "Included with every chatbot" list draws. The four paid unlocks
// are deliberately absent: the node's only Offer is price 0, and a paid
// feature listed under a $0 offer is a machine-readable claim that it ships
// with the free trial (honesty constraint #1). They get no Offer nodes of
// their own either, per the second bullet above.
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${PAGE_URL}#software`,
  name: "ChatKit",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Chatbot",
  operatingSystem: "Web browser",
  url: PAGE_URL,
  description: META_DESCRIPTION,
  installUrl: `${APP_URL}/chatkit`,
  author: organizationRef(),
  publisher: organizationRef(),
  featureList: [
    "Answers only from your own knowledge base",
    "Replies in the visitor's language",
    "One-line script tag embed",
    "Shadow DOM isolation from the host site's CSS",
    "Per-chatbot domain allow-list",
    "Token-by-token streaming replies",
    "Conversation, message and fallback-rate analytics",
    "Markdown export of the knowledge base",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: `${FREE_TRIAL_MESSAGES} free messages per chatbot, no credit card required`,
    availability: "https://schema.org/InStock",
  },
};

// No BreadcrumbList node: the hero's visible trail was removed on 2026-08-14,
// and this site only emits breadcrumb schema for a trail a visitor can see.
// Restoring one means restoring the visible breadcrumb with it.

// Connective only — adds no claim that could be false.
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: PAGE_TITLE,
  description: META_DESCRIPTION,
  inLanguage: "en",
  isPartOf: websiteRef(),
  about: { "@id": `${PAGE_URL}#software` },
};

export default function ChatKitPage() {
  return (
    // No overflow-x-hidden (and no h-full) here on purpose: any overflow-x
    // value other than `visible` turns <main> into a scroll container, and
    // position:sticky resolves against its nearest scrollport — which is how
    // the widget mock's lg:sticky went dead. Horizontal clipping still happens
    // one level up in app/(marketing)/layout.tsx, and the hero pill wraps
    // (Welcome-box max-w-full) instead of overflowing.
    <main className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="flex flex-col gap-10 max-w-full">
        <ChatKitHero />
        <SetupSteps />
        <KnowledgeBase />
        <WidgetAnatomy />
        <AnswerBehaviour />
        <UseCases />
        <IncludedAndUnlocks />
        <Pricing />
        <Control />
        <Limits />
        <ChatKitFaq />
        <ChatKitClosing />
      </div>
    </main>
  );
}
