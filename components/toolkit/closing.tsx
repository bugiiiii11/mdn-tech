import Link from "next/link";

import { CtaBand, PROSE_LINK_CLASS } from "@/components/product-pages/primitives";
import { TOOLKIT_REPO } from "@/lib/marketing/links";
import { APP_URL } from "@/lib/marketing/products";

import { LISTED_COUNT } from "./catalogue";

// Closing band. Two CTAs that both lead to the free thing, and one quiet text
// link to the paid one.
//
// No urgency, no scarcity, no email capture — the objections section commits to
// exactly that, and a countdown here would make the page a liar. The ChatKit
// link is deliberately text, never a button competing with the ToolKit CTA.
//
// The entry count is derived from `listed`, the same constant the directory
// renders, so this band cannot promise a different number of skills than the
// page shows.

export const ToolkitClosing = () => (
  <div className="flex w-full flex-col items-center">
    <CtaBand
      title="Take what is useful, ignore the rest"
      body={`${LISTED_COUNT} skills listed on this page, each linking to the author who wrote it. Nothing to sign up for, nothing to cancel, and no command that makes you take the whole list.`}
      primary={{ href: `${APP_URL}/toolkit`, label: "Browse the live directory →" }}
      secondary={{
        href: TOOLKIT_REPO,
        label: "The skills on GitHub",
        external: true,
      }}
    />

    <p className="-mt-10 px-4 pb-16 text-center text-sm text-gray-400">
      Built a knowledge base with Build KB?{" "}
      <a href={`${APP_URL}/chatkit`} className={PROSE_LINK_CLASS}>
        Start a chatbot free
      </a>
      . Otherwise, there is{" "}
      <Link href="/blog" className={PROSE_LINK_CLASS}>
        more engineering writing
      </Link>{" "}
      where this came from.
    </p>
  </div>
);
