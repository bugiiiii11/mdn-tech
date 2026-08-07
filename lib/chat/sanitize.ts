// Prompt-injection defences for the auto-learning loop.
//
// The threat: auto-learning reads visitor questions and the bot's answers,
// asks Claude to draft knowledge-base entries from them, and an accepted draft
// becomes part of that bot's permanent system prompt (lib/chat/prompt.ts). So
// an anonymous visitor gets text in front of a model whose output the owner is
// invited to install. Ratings are owner-only, which is a real gate -- the
// owner has to thumbs-down the reply first -- but "the bot said something
// weird, thumbs-down" is exactly what an injection attempt produces.
//
// Three layers, none of which replaces owner review:
//   1. neutralize()  -- strip the control characters and delimiter lookalikes
//                       that let text escape its block in the prompt.
//   2. The prompt wraps untrusted text in explicit data tags (learning/run).
//   3. scoreInjection() -- flag drafts whose sources or output look like an
//                       instruction-override attempt, so the portal warns the
//                       owner instead of offering a one-click accept.

// Zero-width, soft-hyphen and bidi-override characters plus the C0/C1
// control range. Built from code points rather than written literally so the
// source file stays plain ASCII and greppable.
const INVISIBLE_RANGES = [
  [0x00ad, 0x00ad], [0x200b, 0x200f], [0x202a, 0x202e],
  [0x2060, 0x2064], [0x206a, 0x206f], [0xfeff, 0xfeff],
]
// C0/C1 controls, keeping tab (0x09) and newline (0x0a) usable.
const CONTROL_RANGES = [[0x00, 0x08], [0x0b, 0x1f], [0x7f, 0x9f]]

function charClass(ranges: number[][], flags = 'g'): RegExp {
  const body = ranges
    .map(([lo, hi]) =>
      lo === hi
        ? String.fromCodePoint(lo)
        : `${String.fromCodePoint(lo)}-${String.fromCodePoint(hi)}`
    )
    .join('')
  return new RegExp(`[${body}]`, flags)
}

const INVISIBLE = charClass(INVISIBLE_RANGES)
const CONTROL = charClass(CONTROL_RANGES)
// Separate non-global copy: RegExp.test() on a /g regex advances lastIndex,
// so reusing INVISIBLE for detection would return alternating results.
const INVISIBLE_TEST = charClass(INVISIBLE_RANGES, '')

/** Makes a visitor-supplied string safe to embed inside a prompt block: no
 *  control/invisible characters, no closing tag that could end the block
 *  early, and hard-bounded length. */
export function neutralize(input: string, maxChars = 500): string {
  return input
    .replace(INVISIBLE, '')
    .replace(CONTROL, ' ')
    .replace(/<\/?(untrusted_[a-z_]*|system|assistant|human)>/gi, '[tag]')
    .replace(/[ \t]{3,}/g, '  ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxChars)
}

const INJECTION_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\b(ignore|disregard|forget)\b[^.\n]{0,40}\b(previous|prior|above|earlier|all)\b[^.\n]{0,20}\b(instruction|prompt|rule|direction)/i, label: 'instruction override' },
  { re: /\b(system|developer)\s+(prompt|message|instruction)/i, label: 'references the system prompt' },
  { re: /\byou\s+are\s+now\b|\bfrom\s+now\s+on\s+you\b|\bact\s+as\s+(a|an|the)\b/i, label: 'role reassignment' },
  { re: /\b(reveal|print|repeat|output|show)\b[^.\n]{0,30}\b(prompt|instructions|api\s*key|secret|credentials)/i, label: 'asks for hidden context' },
  { re: /\b(jailbreak|DAN mode|developer mode|no restrictions|without any restrictions)\b/i, label: 'jailbreak phrasing' },
  { re: /<\/?(system|assistant|human|untrusted_[a-z_]*)>/i, label: 'prompt delimiter injection' },
  { re: /\b(always|never)\b[^.\n]{0,30}\b(tell|recommend|say)\b[^.\n]{0,40}\b(visitor|customer|user|everyone)\b/i, label: 'implanted standing instruction' },
  { re: INVISIBLE_TEST, label: 'hidden invisible characters' },
]

// Only flagged in generated drafts: a link the owner never wrote is how an
// injected entry turns into phishing once it is in the bot's answers.
const URL_RE = /\bhttps?:\/\/[^\s)]+/i

export type InjectionScore = {
  flagged: boolean
  /** Human-readable, shown to the owner in the review UI. */
  reason: string | null
}

function match(text: string): string[] {
  return INJECTION_PATTERNS.filter((p) => p.re.test(text)).map((p) => p.label)
}

/** Scans the untrusted source text (visitor question + bot answer). */
export function scoreSources(texts: string[]): string[] {
  return Array.from(new Set(texts.flatMap(match)))
}

/**
 * Final verdict for one drafted suggestion: anything suspicious in the
 * exchanges it came from, plus anything suspicious in the draft itself.
 * A URL only counts when the draft is already suspicious for another reason,
 * otherwise every legitimate "here's our pricing page" entry would be flagged.
 */
export function scoreSuggestion(draftText: string, sourceLabels: string[]): InjectionScore {
  const labels = new Set([...sourceLabels, ...match(draftText)])
  if (labels.size > 0 && URL_RE.test(draftText)) {
    labels.add('contains a link')
  }

  if (labels.size === 0) return { flagged: false, reason: null }

  return {
    flagged: true,
    reason: `Possible prompt injection from visitor text: ${Array.from(labels).join(', ')}. Read the full draft before accepting.`,
  }
}
