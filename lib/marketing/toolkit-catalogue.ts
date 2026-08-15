// The single definition of "a skill in the ToolKit directory", shared by every
// public surface: the homepage ToolKit section, the homepage FAQ, and /toolkit.
//
// WHY LISTED_COUNT IS SMALLER THAN toolkitSkills.length — DO NOT "FIX" IT BACK.
// The raw array in lib/portal/toolkit-skills.ts holds every entry we have ever
// catalogued, including a few with no installationUrl: work that exists only in
// this repository, or that we have not published. A reader cannot obtain those,
// so counting them inflates the directory. `listed` is therefore the entries
// that carry a source link — the ones a visitor can actually go and install —
// and every count below is read off it.
//
// This module exists because the two surfaces used to count differently: the
// homepage said 21 skills / 5 ours (toolkitSkills.length) while /toolkit said
// 18 / 2 (obtainable only), and BOTH numbers were asserted inside structured
// data. One definition, one import, one number.
//
// HONESTY CONSTRAINTS (do not regress):
//   * ToolKit is a CURATED DIRECTORY. Only author === MDN_AUTHOR entries are
//     ours; everything else is third-party work under its author's own terms.
//   * ToolkitSkill has NO licence field. MIT may be claimed for the M.D.N Tech
//     skills that are published in our repo (MDN_SKILLS) and for nothing else —
//     not for the unpublished M.D.N Tech entries, and not for third parties.
//
// The portal's live gallery hides a few ids behind a module-private
// HIDDEN_SKILL_IDS set that is not exported. This module deliberately does not
// mirror that set: "has a source link" is a property of the data itself and
// therefore cannot drift.

import {
  CATEGORY_LABELS,
  toolkitMCPs,
  toolkitSkills,
  type SkillCategory,
  type ToolkitSkill,
} from "@/lib/portal/toolkit-skills";

export { CATEGORY_LABELS };
export type { SkillCategory, ToolkitSkill };

/** The author string that marks an entry as ours. */
export const MDN_AUTHOR = "M.D.N Tech";

/** An entry a reader can actually obtain: it links to the author's source. */
export type ListedSkill = ToolkitSkill & { installationUrl: string };

/** The single source of truth for every skill count the site publishes. */
export const listed: ListedSkill[] = toolkitSkills.filter(
  (skill): skill is ListedSkill => Boolean(skill.installationUrl)
);

export const LISTED_COUNT = listed.length;
export const AUTHOR_COUNT = new Set(listed.map((skill) => skill.author)).size;

/** Our own obtainable skills — the only ones we may describe as MIT. */
export const MDN_SKILLS = listed.filter((skill) => skill.author === MDN_AUTHOR);
export const MDN_COUNT = MDN_SKILLS.length;

/** Third-party entries, i.e. everything we curated but did not write. */
export const THIRD_PARTY_SKILLS = listed.filter(
  (skill) => skill.author !== MDN_AUTHOR
);
export const THIRD_PARTY_COUNT = THIRD_PARTY_SKILLS.length;

export const ANTHROPIC_COUNT = listed.filter(
  (skill) => skill.author === "Anthropic"
).length;

export const MCP_COUNT = toolkitMCPs.length;

/** Third-party authors, in the order they first appear in the catalogue. */
export const THIRD_PARTY_AUTHORS = Array.from(
  new Set(THIRD_PARTY_SKILLS.map((skill) => skill.author))
);

export type SkillGroup = {
  category: SkillCategory;
  label: string;
  skills: ListedSkill[];
};

/** Grouped by category, groups ordered by first appearance in the catalogue. */
export const SKILL_GROUPS: SkillGroup[] = listed.reduce<SkillGroup[]>(
  (groups, skill) => {
    const existing = groups.find((group) => group.category === skill.category);
    if (existing) {
      existing.skills.push(skill);
      return groups;
    }
    groups.push({
      category: skill.category,
      label: CATEGORY_LABELS[skill.category],
      skills: [skill],
    });
    return groups;
  },
  []
);

export const CATEGORY_COUNT = SKILL_GROUPS.length;

// Render order of the directory grid. The ItemList schema is built from this
// same array, so the structured data cannot fall out of order with the page.
export const orderedListed: ListedSkill[] = SKILL_GROUPS.flatMap(
  (group) => group.skills
);

/** Spells small derived counts so headings read as prose, not as a data dump. */
export function numberWord(count: number): string {
  const words = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];
  return words[count] ?? String(count);
}

/** "a, b and c" — used so the author roll-call is derived, never retyped. */
export function joinWithAnd(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Skill names, derived, for prose that points at specific entries. */
export function skillName(id: string): string {
  return listed.find((skill) => skill.id === id)?.name ?? id;
}
