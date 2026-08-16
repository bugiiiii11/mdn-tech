/**
 * Campaign attribution for the marketing contact forms (rework plan C3).
 *
 * FIRST-TOUCH, not last-touch: the UTM set captured on the visitor's FIRST
 * page of the session wins and is never overwritten. A prospect who arrives
 * from the partner email (?utm_campaign=partneri-2026-09), reads /sk, clicks
 * through to the Royal Stroje case study and only then submits the form must
 * still be attributed to that email — last-touch would credit the internal
 * link and the campaign would look like it converted nobody.
 *
 * Storage is sessionStorage, deliberately: it needs no cookie banner (it is
 * not a cookie and does not persist past the tab), which matters because
 * /privacy currently claims no marketing cookies. Do NOT move this to
 * localStorage or a cookie without updating the policy first.
 */

export const ATTRIBUTION_STORAGE_KEY = "mdn-attribution";

/** The UTM keys we read off the query string, in the order they are reported. */
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

export type Attribution = {
  [K in UtmKey]: string;
} & {
  /** Where the visitor came from, when the browser tells us. */
  referrer: string;
  /** The first path of this session — the page the campaign link pointed at. */
  landing_page: string;
  /** Human-readable one-liner for the email body. Never empty. */
  attribution: string;
};

const EMPTY: Attribution = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
  referrer: "",
  landing_page: "",
  attribution: "",
};

/** Trim, cap length and strip control characters — this text ends up in an email. */
function clean(value: string | null): string {
  if (!value) return "";
  // Codepoint filter rather than a control-character regex: escapes in such
  // a regex are a standing trip hazard for tooling that rewrites this file,
  // and this reads just as clearly.
  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code >= 0x20 && code !== 0x7f) out += char;
  }
  return out.trim().slice(0, 200);
}

/**
 * Collapse an attribution into the single line that goes into the EmailJS
 * template. Falls back through UTM -> referrer -> direct so the sales inbox
 * always sees a provenance line rather than a blank field.
 */
export function formatAttribution(data: Omit<Attribution, "attribution">): string {
  const utm = UTM_KEYS.filter((key) => data[key]).map(
    (key) => `${key.replace("utm_", "")}=${data[key]}`
  );

  const parts: string[] = [];
  if (utm.length > 0) {
    parts.push(utm.join(" / "));
  } else if (data.referrer) {
    parts.push(`referrer: ${data.referrer}`);
  } else {
    parts.push("direct");
  }
  if (data.landing_page) parts.push(`landed on ${data.landing_page}`);

  return parts.join(" — ");
}

/**
 * Read the stored first-touch attribution, capturing it from the current URL
 * on the first call of the session. Client-only; returns empties on the
 * server or when storage is unavailable (private mode, blocked storage).
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;

  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<Attribution>;
      // Merge over EMPTY so a stored blob written by an older build (or a
      // hand-edited one) can never produce undefined form values.
      return { ...EMPTY, ...parsed };
    }
  } catch {
    // Unreadable or blocked storage — fall through and capture fresh.
  }

  const params = new URLSearchParams(window.location.search);
  const base = {
    ...EMPTY,
    referrer: clean(document.referrer),
    landing_page: clean(window.location.pathname + window.location.search),
  };
  for (const key of UTM_KEYS) {
    base[key] = clean(params.get(key));
  }

  const captured: Attribution = {
    ...base,
    attribution: formatAttribution(base),
  };

  try {
    window.sessionStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(captured)
    );
  } catch {
    // Storage blocked — the value is still correct for this page view, it
    // just will not survive a navigation. Better than dropping it.
  }

  return captured;
}
