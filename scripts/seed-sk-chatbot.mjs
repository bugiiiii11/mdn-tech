/**
 * Seeds M.D.N Tech's OWN Slovak sales chatbot — the one that renders on /sk
 * (rework plan C2). Run it, read the bot's answers in the Command Center,
 * then flip NEXT_PUBLIC_SK_CHATBOT_ID to switch the widget on.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seed-sk-chatbot.mjs
 *
 * ANTI-DRIFT: every knowledge entry is BUILT from constants/sk.ts and
 * constants/sk-case-studies.ts — the same modules the page renders. Nothing
 * here restates copy by hand, so re-running after a copy change re-syncs the
 * bot instead of leaving it quietly a version behind. If you find yourself
 * typing a fact into this file, it belongs in constants/sk.ts instead.
 *
 * Idempotent: matches the bot by name, updates it in place, and replaces its
 * knowledge entries wholesale. Safe to re-run.
 */

import { createClient } from "@supabase/supabase-js";

const BOT_NAME = "M.D.N Tech (SK)";

/**
 * OWNER-LESS BY DESIGN — do not "fix" this by attaching a customer.
 *
 * `owner_id: null` is what the chat route calls an internal bot: it is not
 * metered against a credit balance (we would be selling credits to
 * ourselves), and is instead capped by INTERNAL_BOT_DAILY_RULE. The safety
 * catch is that an owner-less bot with an EMPTY allow-list is refused
 * outright — see app/api/chat/[chatbotId]/message/route.ts. So the domain
 * list below is not decoration; it is the only thing keeping this bot from
 * being unmetered Claude access for anyone who reads the page source.
 */
const ALLOWED_DOMAINS = ["mdntech.org", "www.mdntech.org"];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Pass --env-file=.env.local");
  process.exit(1);
}

const {
  SK_SITE,
  SK_NAP,
  SK_HERO,
  SK_FOR_WHOM,
  SK_VALUE_LADDER,
  SK_WHY_US,
  SK_PORTFOLIO,
  SK_PROCESS,
  SK_PRICING,
  SK_CRM,
  SK_ABOUT,
  SK_FAQ,
} = await import("../constants/sk.ts");
const { SK_CS_ROYAL_STROJE: CS } = await import("../constants/sk-case-studies.ts");

/** Render whatever shape a section uses into flat markdown bullets. */
const bullets = (items) => items.map((item) => `- ${item}`).join("\n");
const titled = (items, titleKey, bodyKey) =>
  items.map((item) => `- **${item[titleKey]}** — ${item[bodyKey]}`).join("\n");

const entries = [
  {
    title: "O firme M.D.N Tech",
    category: "company",
    content: [
      `# O firme M.D.N Tech`,
      ``,
      SK_SITE.description,
      ``,
      `## ${SK_ABOUT.title}`,
      `${SK_ABOUT.founder.name} — ${SK_ABOUT.founder.role}`,
      ``,
      SK_ABOUT.paragraphs.join("\n\n"),
      ``,
      `## Kontakt`,
      `- Email: ${SK_NAP.email}`,
      `- Telefón: ${SK_NAP.phoneDisplay} (${SK_NAP.phoneIntl})`,
      `- WhatsApp: ${SK_NAP.whatsappDisplay}`,
      `- Web: ${SK_SITE.url}`,
      ``,
      `Pôsobíme po celom Slovensku. Konzultácia je nezáväzná a zdarma.`,
    ].join("\n"),
  },
  {
    title: "Pre koho pracujeme a čo ponúkame",
    category: "services",
    content: [
      `# Služby`,
      ``,
      SK_HERO.subtitle,
      ``,
      `## Pre koho`,
      titled(SK_FOR_WHOM, "title", "description"),
      ``,
      `## Čo dodávame`,
      titled(SK_VALUE_LADDER, "title", "description"),
      ``,
      `## Prečo my`,
      titled(SK_WHY_US, "title", "description"),
    ].join("\n"),
  },
  {
    title: "CRM systémy na mieru",
    category: "services",
    content: [
      `# ${SK_CRM.title}`,
      ``,
      SK_CRM.intro,
      ``,
      `## Čo z toho firma má`,
      bullets(SK_CRM.benefits),
      ``,
      `## Referencia`,
      `${SK_CRM.reference.name} — ${SK_CRM.reference.description}`,
      `Prípadová štúdia: ${SK_CRM.reference.caseStudy.href}`,
    ].join("\n"),
  },
  {
    title: "Ako prebieha spolupráca",
    category: "process",
    content: [
      `# Postup spolupráce`,
      ``,
      titled(SK_PROCESS, "title", "description"),
      ``,
      `## Cenové kotvy (indikatívne)`,
      SK_PRICING.items.map((item) => `- ${item.service}: ${item.price}`).join("\n"),
      ``,
      SK_PRICING.note,
    ].join("\n"),
  },
  {
    title: "Referencie a prípadová štúdia",
    category: "references",
    content: [
      `# Realizácie`,
      ``,
      titled(SK_PORTFOLIO, "name", "description"),
      ``,
      `## Prípadová štúdia: Royal Stroje`,
      CS.hero.lede,
      ``,
      `**${CS.client.title}:** ${CS.client.body}`,
      `**${CS.brief.title}:** ${CS.brief.body}`,
      `**${CS.solution.title}:** ${CS.solution.intro}`,
      titled(CS.solution.blocks, "title", "description"),
      ``,
      `Celá štúdia: ${CS.url}`,
      ``,
      // The results section is deliberately absent from the page until the
      // client confirms numbers — the bot must not invent them either.
      `Konkrétne merateľné výsledky zatiaľ nezverejňujeme — dopĺňame ich po`,
      `potvrdení klientom. Ak sa na ne niekto pýta, povedz to takto otvorene.`,
    ].join("\n"),
  },
  {
    title: "Časté otázky",
    category: "faq",
    content: [
      `# Časté otázky`,
      ``,
      SK_FAQ.map((entry) => {
        const extra = Array.isArray(entry.bullets) && entry.bullets.length
          ? `\n${bullets(entry.bullets)}`
          : "";
        return `## ${entry.question}\n${entry.answer}${extra}`;
      }).join("\n\n"),
    ].join("\n"),
  },
];

const systemPrompt = [
  `Si asistent slovenskej pobočky M.D.N Tech. Odpovedáš po slovensky, stručne,`,
  `vecne a bez marketingového balastu — ako konzultant, nie ako predajca.`,
  ``,
  `Pravidlá:`,
  `- Odpovedaj VÝHRADNE z poskytnutej znalostnej bázy. Nič si nevymýšľaj —`,
  `  žiadne ceny, termíny, čísla ani mená klientov, ktoré tam nie sú.`,
  `- Ak odpoveď nepoznáš, povedz to a ponúkni kontakt: ${SK_NAP.email}`,
  `  alebo ${SK_NAP.phoneDisplay}.`,
  `- Konkrétnu cenu projektu nikdy neuvádzaj ako záväznú — cena závisí od`,
  `  rozsahu a určuje sa po nezáväznej konzultácii.`,
  `- Pri otázkach na zmluvy, GDPR alebo fakturáciu použi znenie z FAQ a`,
  `  odporuč konzultáciu; nepodávaj právne poradenstvo.`,
  `- Ak je zjavný záujem o spoluprácu, naveď na formulár na ${SK_SITE.url}#kontakt.`,
].join("\n");

// `--dry` prints exactly what would be written and touches nothing. Use it
// to review the generated Slovak before it reaches a customer-facing bot.
if (process.argv.includes("--dry")) {
  console.log("=== SYSTEM PROMPT ===\n" + systemPrompt + "\n");
  for (const entry of entries) {
    console.log(`=== ${entry.title} [${entry.category}] ===\n${entry.content}\n`);
  }
  process.exit(0);
}

const supabase = createClient(url, serviceKey);

const { data: existing, error: findError } = await supabase
  .from("chatbots")
  .select("id")
  .eq("name", BOT_NAME)
  .maybeSingle();
if (findError) throw findError;

const payload = {
  name: BOT_NAME,
  client_name: "M.D.N Tech",
  description: "Predajný asistent na /sk — vlastný bot M.D.N Tech (rework plan C2).",
  type: "internal",
  status: "active",
  owner_id: null,
  allowed_domains: ALLOWED_DOMAINS,
  widget_config: {
    greeting: "Dobrý deň! Spýtajte sa ma na weby, CRM, chatboty alebo ceny.",
    // Event Horizon branding (DESIGN.md): Nebula Violet -> Ion Cyan gradient
    // on the bubble, white logo mark inside it.
    primary_color: "#7042f8",
    secondary_color: "#06b6d4",
    // Apex, not www: www is a 308 redirect, and this is fetched on every
    // widget render. The config route only accepts https URLs, so it must stay
    // absolute even though the widget now runs same-origin on our own pages.
    launcher_icon: "https://mdntech.org/brand/png/logo-final-white-500.png",
    input_placeholder: "Napíšte správu...",
    system_prompt: systemPrompt,
    fallback_message: `Toto zatiaľ neviem zodpovedať. Napíšte nám na ${SK_NAP.email} a ozveme sa.`,
  },
};

let chatbotId = existing?.id;
if (chatbotId) {
  const { error } = await supabase.from("chatbots").update(payload).eq("id", chatbotId);
  if (error) throw error;
  console.log(`Updated existing chatbot ${chatbotId}`);
} else {
  const { data, error } = await supabase.from("chatbots").insert(payload).select("id").single();
  if (error) throw error;
  chatbotId = data.id;
  console.log(`Created chatbot ${chatbotId}`);
}

// Replace the knowledge base wholesale — a diff-based merge would leave
// orphans behind every time a section is renamed in constants/sk.ts.
const { error: deleteError } = await supabase
  .from("chatbot_kb_entries")
  .delete()
  .eq("chatbot_id", chatbotId);
if (deleteError) throw deleteError;

const rows = entries.map((entry, index) => ({
  chatbot_id: chatbotId,
  title: entry.title,
  content: entry.content,
  category: entry.category,
  sort_order: index,
}));
const { error: insertError } = await supabase.from("chatbot_kb_entries").insert(rows);
if (insertError) throw insertError;

console.log(`Seeded ${rows.length} knowledge entries.`);
console.log(`\nNext: review the answers in the Command Center, then set`);
console.log(`  NEXT_PUBLIC_SK_CHATBOT_ID=${chatbotId}`);
console.log(`in Vercel Production (and .env.local for a local check) and redeploy.`);
