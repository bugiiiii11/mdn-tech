import { FaqSection } from "@/components/product-pages/faq";
import { PROSE_LINK_CLASS } from "@/components/product-pages/primitives";
import { SK_FAQ } from "@/constants/sk";

// FAQ on the shared accordion + FAQPage schema (components/product-pages/faq
// is the ONE FAQ system — see its anti-drift contract). Copy in SK_FAQ; the
// invoicing entry is the page's trust weapon, kept near the contact section
// so a warmed-up visitor lands on the form right after reading it.
export const SkFaq = () => (
  <FaqSection
    id="faq"
    title="Časté otázky"
    intro="Kto sme, ako funguje fakturácia zo zahraničia a ako prebieha spolupráca — všetko, čo firmy zaujíma pred prvým projektom."
    faqs={SK_FAQ}
  >
    <p className="mt-10 text-sm text-gray-400 text-center">
      Nenašli ste odpoveď?{" "}
      <a href="#kontakt" className={PROSE_LINK_CLASS}>
        Napíšte nám
      </a>
      .
    </p>
  </FaqSection>
);
