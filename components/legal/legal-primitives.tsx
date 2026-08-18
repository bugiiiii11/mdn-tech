import type { ReactNode } from "react";

// Presentational shell for long-form legal pages.
//
// Server components on purpose. The English /privacy and /terms are
// "use client" with framer-motion entrance animations, which costs them a
// `metadata` export -- a client component cannot have one. Legal text gains
// nothing from an animation and loses real SEO by shipping without a title or
// canonical, so the Slovak pages are static and export metadata normally.
//
// The class names below are copied from the English pages deliberately: the
// two languages must look identical, and a visitor switching between them
// should not be able to tell which one was built second.

const HEADING_CLASS =
  "text-3xl font-semibold text-white mb-6 border-b border-purple-500/30 pb-3";
const SUBHEADING_CLASS = "text-xl font-semibold text-purple-400 mb-3";
const BOX_CLASS =
  "bg-[#7042f810] p-6 rounded-lg border border-purple-500/20";

export const LegalPage = ({
  title,
  lastUpdated,
  intro,
  children,
}: {
  title: string;
  lastUpdated: string;
  intro?: ReactNode;
  children: ReactNode;
}) => (
  <main lang="sk" className="min-h-screen w-full pt-20">
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-20 md:px-8 lg:px-20">
      <div className="relative z-10 mx-auto mb-16 max-w-4xl text-center">
        <h1 className="mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
          {title}
        </h1>
        <p className="text-lg text-gray-400">{lastUpdated}</p>
        {intro ? (
          <p className="mt-6 text-sm leading-relaxed text-gray-400">{intro}</p>
        ) : null}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="rounded-xl border border-[#7042f88b] bg-[#0c0424]/80 p-8 leading-relaxed text-gray-300 md:p-12">
            {children}
          </div>
        </div>
      </div>
    </section>
  </main>
);

export const LegalSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="mb-12">
    <h2 className={HEADING_CLASS}>{title}</h2>
    <div className="space-y-6">{children}</div>
  </section>
);

export const LegalSub = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div>
    <h3 className={SUBHEADING_CLASS}>{title}</h3>
    {children}
  </div>
);

export const LegalText = ({ children }: { children: ReactNode }) => (
  <p className="mb-2 text-gray-300">{children}</p>
);

export const LegalList = ({
  items,
  ordered = false,
}: {
  items: ReactNode[];
  ordered?: boolean;
}) => {
  const className = `${
    ordered ? "list-decimal" : "list-disc"
  } ml-4 list-inside space-y-1 text-gray-300`;
  return ordered ? (
    <ol className={className}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  ) : (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

/** Bold lead-in used throughout the lists, e.g. "Kontakt: ...". */
export const L = ({ children }: { children: ReactNode }) => (
  <span className="font-semibold">{children}</span>
);

export const LegalBox = ({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) => (
  <div className={BOX_CLASS}>
    {title ? <p className="mb-3 font-semibold text-white">{title}</p> : null}
    {children}
  </div>
);

export const LegalFooterNote = ({ children }: { children: ReactNode }) => (
  <div className="mt-12 border-t border-purple-500/30 pt-8">{children}</div>
);
