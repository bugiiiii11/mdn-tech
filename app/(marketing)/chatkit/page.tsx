import type { Metadata } from "next";

import { AnswerBehaviour } from "@/components/chatkit/answer-behaviour";
import { ChatKitBreadcrumb } from "@/components/chatkit/chatkit-breadcrumb";
import { ChatKitFaq } from "@/components/chatkit/chatkit-faq";
import { ChatKitHero } from "@/components/chatkit/chatkit-hero";
import { Control } from "@/components/chatkit/control";
import { IncludedAndUnlocks } from "@/components/chatkit/included-and-unlocks";
import { KnowledgeBase } from "@/components/chatkit/knowledge-base";
import { Limits } from "@/components/chatkit/limits";
import { Pricing } from "@/components/chatkit/pricing";
import { SetupSteps } from "@/components/chatkit/setup-steps";
import { UseCases } from "@/components/chatkit/use-cases";
import { WidgetAnatomy } from "@/components/chatkit/widget-anatomy";
import { APP_URL } from "@/lib/marketing/products";
import { FEATURES, FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

// /chatkit — the ChatKit product page. Targets the "AI chatbot for website"
// cluster at a depth the homepage's ChatKit section deliberately does not:
// the homepage summarises a capability in a sentence, this page names the
// field, the number, the mechanism or the boundary behind it.
//
// Section order: setup -> knowledge-base -> widget -> answers -> use-cases ->
// included-vs-addons -> pricing -> control -> limits -> faq. The FAQ close
// carries the final CTA, so there is no separate closing CTA band.
//
// Layout note: Navbar, Footer, StarsCanvas and ReducedMotionProvider all come
// from app/(marketing)/layout.tsx — nothing here re-adds them.

const PAGE_URL = "https://mdntech.org/chatkit";

const META_DESCRIPTION = `Add an AI chatbot to your website with one line of code. It answers only from your content, in your visitor's language. ${FREE_TRIAL_MESSAGES} free messages, no card.`;

export const metadata: Metadata = {
  // `absolute` so the root template does not append a second brand suffix.
  title: { absolute: "ChatKit: AI Chatbot for Your Website, No Code" },
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
  openGraph: {
    url: PAGE_URL,
    title: "ChatKit: AI Chatbot for Your Website, No Code",
    description: META_DESCRIPTION,
    type: "website",
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
//  - Organization / WebSite — already emitted globally from app/layout.tsx.
//    Referenced by name and url here, never redeclared.
//
// featureList mixes the hand-written capability list with FEATURES.map(name)
// from lib/portal/plans.ts, so the paid unlocks in the schema cannot drift
// from the ones the portal actually sells.
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
  softwareHelp: `${APP_URL}/chatkit`,
  author: {
    "@type": "Organization",
    name: "M.D.N Tech FZE",
    url: "https://mdntech.org",
  },
  publisher: {
    "@type": "Organization",
    name: "M.D.N Tech FZE",
    url: "https://mdntech.org",
  },
  featureList: [
    "Answers only from your own knowledge base",
    "Replies in the visitor's language",
    "One-line script tag embed",
    "Shadow DOM isolation from the host site's CSS",
    "Per-chatbot domain allow-list",
    "Token-by-token streaming replies",
    "Conversation, message and fallback-rate analytics",
    "Markdown export of the knowledge base",
    ...FEATURES.map((feature) => feature.name),
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: `${FREE_TRIAL_MESSAGES} free messages per chatbot, no credit card required`,
    availability: "https://schema.org/InStock",
  },
};

// Matches the visible <ChatKitBreadcrumb /> at the top of the page.
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://mdntech.org",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ChatKit",
      item: PAGE_URL,
    },
  ],
};

// Connective only — adds no claim that could be false.
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: "ChatKit: AI Chatbot for Your Website, No Code",
  description: META_DESCRIPTION,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: "M.D.N Tech", url: "https://mdntech.org" },
  about: { "@id": `${PAGE_URL}#software` },
};

export default function ChatKitPage() {
  return (
    <main className="h-full w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="flex flex-col gap-10 max-w-full">
        <ChatKitBreadcrumb />
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
      </div>
    </main>
  );
}
