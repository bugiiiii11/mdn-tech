import { CtaBand } from "@/components/product-pages/primitives";
import { appCta } from "@/lib/marketing/products";
import { FREE_TRIAL_MESSAGES } from "@/lib/portal/plans";

// Closing band — the page's terminal CTA, in the same shared CtaBand /toolkit
// ends on. The FAQ close above keeps its navigational links (privacy, lineup,
// blog), but the conversion CTA lives here: the page's last and highest-intent
// moment should be its most visible button, not a text link competing with
// three others in one gray paragraph.
//
// No urgency, no scarcity, no email capture. The trial figure is imported from
// lib/portal/plans.ts, and the body claims nothing the trial does not include
// — the paid unlocks are not mentioned, because they are not part of it.

export const ChatKitClosing = () => (
  <CtaBand
    title="Try it on your own content"
    body={`${FREE_TRIAL_MESSAGES} free messages, no card and nothing to cancel — enough to write the knowledge base, style the widget, embed it on your site and watch real answers come back before you spend anything.`}
    primary={appCta("/chatkit", "Create your chatbot free")}
    secondary={{ href: "#pricing", label: "See what it costs" }}
  />
);
