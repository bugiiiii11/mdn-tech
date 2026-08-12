import Link from "next/link";
import type { ReactNode } from "react";

import { Section } from "./primitives";

// ONE FAQ accordion and ONE FAQPage schema builder for every product page.
// Before this module the same <details> markup, the same plus-icon path and the
// same mainEntity map existed three times (landing, /chatkit, /toolkit) and had
// already started to drift.
//
// Native <details>/<summary>: keyboard-operable, readable with JS disabled, and
// every answer is in the HTML for a crawler.
//
// ANTI-DRIFT CONTRACT: the schema text is produced by faqAnswerText(), which
// concatenates exactly the answer string and the link label that are rendered.
// The JSON-LD therefore cannot say something the page does not. If you add a
// field to FaqEntry that renders visible text, add it to faqAnswerText() too.
//
// No directive here on purpose — the accordion is static markup, so it stays a
// server component; only the <Section> wrapper it renders into is a client
// boundary.

export type FaqLink = {
  href: string;
  label: string;
  /** External links open in a new tab and use <a>; internal ones use next/link. */
  external?: boolean;
};

export type FaqEntry = {
  question: string;
  answer: string;
  /**
   * Optional trailing link, rendered as a sentence after the answer and
   * folded into the schema text by faqAnswerText(). Pages without per-entry
   * links simply omit it.
   */
  link?: FaqLink;
};

/** Exactly the text a visitor reads, so the schema cannot drift from the page. */
export const faqAnswerText = (entry: FaqEntry): string =>
  entry.link ? `${entry.answer} ${entry.link.label}.` : entry.answer;

/** FAQPage JSON-LD for a list of entries. Stringify it into a ld+json script. */
export const faqPageSchema = (faqs: readonly FaqEntry[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: { "@type": "Answer", text: faqAnswerText(entry) },
  })),
});

const AnswerLink = ({ link }: { link: FaqLink }) =>
  link.external ? (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-400 transition-colors duration-300 hover:text-cyan-300"
    >
      {link.label}
    </a>
  ) : (
    <Link
      href={link.href}
      className="text-cyan-400 transition-colors duration-300 hover:text-cyan-300"
    >
      {link.label}
    </Link>
  );

/** The accordion on its own — use it when the page owns its section wrapper. */
export const FaqAccordion = ({ faqs }: { faqs: readonly FaqEntry[] }) => (
  <div className="flex w-full max-w-3xl flex-col divide-y divide-white/[0.06] border-y border-white/[0.06]">
    {faqs.map((entry) => (
      <details key={entry.question} className="group py-5">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-white transition-colors duration-200 hover:text-cyan-400 [&::-webkit-details-marker]:hidden">
          <h3 className="text-base md:text-lg font-medium">{entry.question}</h3>
          <span
            aria-hidden="true"
            className="mt-1 flex-shrink-0 text-cyan-400 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </span>
        </summary>
        {/* An answer is the body of a titled item, so gray-300 (the Legibility
            Floor Rule) — it is not a subordinate caption. */}
        <p className="mt-3 pr-11 text-sm md:text-base text-gray-300 leading-relaxed">
          {entry.answer}
          {entry.link ? (
            <>
              {" "}
              <AnswerLink link={entry.link} />.
            </>
          ) : null}
        </p>
      </details>
    ))}
  </div>
);

type FaqSectionProps = {
  title: string;
  faqs: readonly FaqEntry[];
  intro?: string;
  /** Defaults to "faq" — the anchor both product pages already link to. */
  id?: string;
  /**
   * Emits the FAQPage JSON-LD next to the accordion. Set false only if the
   * page folds the same faqPageSchema(faqs) into a larger @graph itself.
   */
  emitSchema?: boolean;
  /** Rendered under the accordion — e.g. a closing CTA line. */
  children?: ReactNode;
};

/** Section heading + intro + accordion + FAQPage schema, in one call. */
export const FaqSection = ({
  title,
  faqs,
  intro,
  id = "faq",
  emitSchema = true,
  children,
}: FaqSectionProps) => (
  <Section id={id} title={title} intro={intro}>
    {emitSchema ? (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema(faqs)),
        }}
      />
    ) : null}

    <FaqAccordion faqs={faqs} />

    {children}
  </Section>
);
