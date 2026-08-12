import { GlassCard, Section } from "@/components/product-pages/primitives";

import {
  ANTHROPIC_COUNT,
  AUTHOR_COUNT,
  LISTED_COUNT,
  MDN_COUNT,
  SKILL_GROUPS,
  THIRD_PARTY_AUTHORS,
  joinWithAnd,
} from "./catalogue";

// The directory itself, enumerated in crawlable HTML — the substance the
// homepage section only counts.
//
// RENDER RULE: every card comes from SKILL_GROUPS, which is built from `listed`
// (entries with a source link). Hero chips, this intro and the FAQ all read the
// same constant, so a visitor who counts the cards gets the number the copy
// claims. Nothing here is typed by hand, including the author roll-call.
//
// HONESTY CONSTRAINTS (do not regress):
//  - Curated directory, not our library. Only the M.D.N Tech entries are ours.
//  - We hold no licence data: ToolkitSkill has no licence field, so this page
//    states terms for nobody else's work.
//  - Descriptions are rendered verbatim from the catalogue, and some of them
//    quote the author's own numbers. The attribution note below says so; never
//    restate one of those figures as something we measured.
//
// No verification badge is rendered. The catalogue's `verified` flag is true on
// every entry and drives nothing but an icon, so a badge here would imply a
// process that does not exist — see the objections section.

const OTHER_AUTHORS = THIRD_PARTY_AUTHORS.filter(
  (author) => author !== "Anthropic"
);
const OTHER_COUNT = LISTED_COUNT - MDN_COUNT - ANTHROPIC_COUNT;

const statements = [
  {
    title: "Every entry links out to the author",
    body: "We do not host, mirror, re-license or install third-party skills. You install from the author, under the author's terms, from the author's repository.",
  },
  {
    title: "We carry no licence data",
    body: "There is no licence field in this catalogue, so we will not tell you a third-party skill's terms — read the repo. MIT applies to the M.D.N Tech skills only, and that LICENSE is linked.",
  },
  {
    title: "Third-party claims are attributed, never adopted",
    body: "Where a description quotes a figure — a token reduction, a palette count, a number of rules — that is the author reporting on their own work. We did not measure it and do not restate it as ours.",
  },
];

export const Directory = () => (
  <Section
    id="directory"
    wide
    title="Inside the directory: every skill, its author, and where it comes from"
    intro={`A curated directory, not our library. ${LISTED_COUNT} entries from ${AUTHOR_COUNT} authors: ${ANTHROPIC_COUNT} are Anthropic's, ${MDN_COUNT} are written by M.D.N Tech, and the remaining ${OTHER_COUNT} come from ${joinWithAnd(OTHER_AUTHORS)}.`}
  >
    <div className="flex w-full flex-col gap-12">
      <GlassCard className="p-8">
        <h3 className="text-lg font-semibold text-white mb-5">
          What this list is, and what it is not
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {statements.map((statement) => (
            <div key={statement.title}>
              <h4 className="text-base font-semibold text-white mb-1.5">
                {statement.title}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {statement.body}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {SKILL_GROUPS.map((group) => (
        <div key={group.category}>
          <div className="mb-5 flex items-baseline gap-3 border-b border-white/[0.06] pb-3">
            <h3 className="text-lg font-semibold text-white">{group.label}</h3>
            <span className="text-sm text-gray-400">
              {group.skills.length}{" "}
              {group.skills.length === 1 ? "skill" : "skills"}
            </span>
          </div>

          <ul className="grid grid-cols-1 gap-5 list-none sm:grid-cols-2 lg:grid-cols-3">
            {group.skills.map((skill) => (
              <li key={skill.id} className="h-full">
                <GlassCard className="flex h-full flex-col">
                  <h4 className="text-base font-semibold text-white">
                    {skill.name}
                  </h4>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                    {skill.description}
                  </p>

                  {skill.useCases.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5 list-none">
                      {skill.useCases.slice(0, 3).map((useCase) => (
                        <li
                          key={useCase}
                          className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-gray-400"
                        >
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4 text-xs">
                    <span className="text-gray-400">by {skill.author}</span>
                    <a
                      href={skill.installationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                    >
                      Source ↗
                    </a>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Section>
);
