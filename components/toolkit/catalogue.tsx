// Derived catalogue facts for the /toolkit marketing page.
//
// ONE module constant feeds every number on this page: `listed` — the catalogue
// entries that carry a source link. Every section renders from it and every
// count is read off it, so a visitor who counts the cards gets exactly the
// number the copy claims. No digit on this page is typed by hand.
//
// HONESTY CONSTRAINT (do not regress): ToolKit is a CURATED DIRECTORY. Most
// entries are third-party work under each author's own terms, and the data
// model has no licence field at all (ToolkitSkill = id, name, category,
// description, author, verified, installationUrl?, details, useCases). Nothing
// built from this module may call the catalogue "our skills" or state a licence
// for work we did not write.
//
// The portal's live gallery hides four ids behind a module-private
// HIDDEN_SKILL_IDS set that is not exported. This page deliberately does not
// try to mirror that set; it renders "has a source link", which is a property
// of the data itself and therefore cannot drift.

import {
  toolkitMCPs,
  toolkitSkills,
  type SkillCategory,
  type ToolkitSkill,
} from "@/lib/portal/toolkit-skills";

export const MDN_AUTHOR = "M.D.N Tech";

/** An entry a reader can actually obtain: it links to the author's source. */
export type ListedSkill = ToolkitSkill & { installationUrl: string };

/** The single source of truth for every count on the page. */
export const listed: ListedSkill[] = toolkitSkills.filter(
  (skill): skill is ListedSkill => Boolean(skill.installationUrl)
);

export const LISTED_COUNT = listed.length;
export const AUTHOR_COUNT = new Set(listed.map((skill) => skill.author)).size;

export const MDN_SKILLS = listed.filter((skill) => skill.author === MDN_AUTHOR);
export const MDN_COUNT = MDN_SKILLS.length;
export const ANTHROPIC_COUNT = listed.filter(
  (skill) => skill.author === "Anthropic"
).length;

export const MCP_COUNT = toolkitMCPs.length;

/** Third-party authors, in the order they first appear in the catalogue. */
export const THIRD_PARTY_AUTHORS = Array.from(
  new Set(
    listed
      .filter((skill) => skill.author !== MDN_AUTHOR)
      .map((skill) => skill.author)
  )
);

// Display labels for the category union. This duplicates a map that is
// module-private in components/portal/handoff/ThirdPartySkills.tsx; a request
// to lift that map into a shared export is filed rather than editing a file
// this page does not own.
export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  "session-management": "Session management",
  marketing: "Marketing",
  testing: "Testing & QA",
  safety: "Safety & validation",
  design: "Design",
  seo: "SEO",
  infrastructure: "Infrastructure",
  development: "Development",
  security: "Security",
  documents: "Documents",
  productivity: "Productivity",
  creative: "3D & creative",
};

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
