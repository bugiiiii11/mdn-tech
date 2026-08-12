import { GlassCard, Section } from "@/components/product-pages/primitives";
import { toolkitMCPs } from "@/lib/portal/toolkit-skills";

import { CodeBlock } from "./code-block";
import { Code } from "./inline-code";

// MCP servers, with copy-ready commands rather than descriptions of commands.
//
// Every command string is rendered from `setupGuide` in
// lib/portal/toolkit-skills.ts — never retyped here, so the page cannot ship a
// command the catalogue does not actually contain.
//
// HONESTY CONSTRAINTS (do not regress):
//  - None of these servers are ours. They belong to GitHub, Context7,
//    Microsoft, Sentry, Supabase and the Blender community, each under its own
//    terms. Nothing connects through M.D.N Tech and no credential touches our
//    infrastructure.
//  - The catalogue-wide "no network calls" line does not apply in this section.
//    An MCP server is a network service by definition.

// One practical line per server: why it earns a slot, not what it is. Keyed by
// the catalogue id so an entry that disappears from the data disappears here.
const WHY: Record<string, string> = {
  "github-mcp":
    "Claude reads the issue and the PR diff itself, so a review starts from the code rather than from your summary of it.",
  "context7-mcp":
    "Targets the most common failure on a fast-moving dependency: an API that changed after the model's training cutoff.",
  "playwright-mcp":
    "Pairs with the Webapp Testing skill above — the skill knows how to exercise an app, the server gives it a real browser to do it in.",
  "sentry-mcp":
    "Turns a production stack trace into context, so the fix starts from the trace instead of a description of it.",
  "supabase-mcp":
    "The stack this site runs on. The command carries a YOUR_PROJECT_REF placeholder you have to replace with your own.",
  "blender-mcp":
    "Pairs with the Blender skills above: the skills know the bpy API, the server drives the scene that is actually open.",
};

export const McpServers = () => (
  <Section
    id="mcp-servers"
    wide
    title="Claude Code MCP servers, with the exact setup command"
    intro="A skill is a local Markdown file that changes how Claude works. An MCP server is a separate service Claude connects to over a transport so it can reach systems a file cannot — which is why skills need no network and MCP servers usually need credentials."
  >
    <div className="flex w-full flex-col gap-10">
      <ul className="grid grid-cols-1 gap-5 list-none md:grid-cols-2 lg:grid-cols-3">
        {toolkitMCPs.map((mcp) => (
          <li key={mcp.id} className="h-full">
            <GlassCard className="flex h-full flex-col">
              <h3 className="text-base font-semibold text-white">{mcp.name}</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                {mcp.description}
              </p>

              {WHY[mcp.id] && (
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                  {WHY[mcp.id]}
                </p>
              )}

              {mcp.connectedServices.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5 list-none">
                  {mcp.connectedServices.map((service) => (
                    <li
                      key={service}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-gray-400"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              )}

              <details className="group mt-auto border-t border-white/[0.06] pt-4">
                <summary className="cursor-pointer list-none text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300 [&::-webkit-details-marker]:hidden">
                  Setup command
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </summary>
                <div className="mt-3">
                  <CodeBlock code={mcp.setupGuide} label="claude mcp add" />
                </div>
              </details>
            </GlassCard>
          </li>
        ))}
      </ul>

      <GlassCard className="p-8">
        <h3 className="text-lg font-semibold text-white mb-3">
          None of these are ours
        </h3>
        <p className="text-base text-gray-300 leading-relaxed">
          These servers belong to GitHub, Context7, Microsoft, Sentry, Supabase
          and the Blender community, each published under its own terms and
          supported by its own maintainers. Nothing connects through M.D.N Tech:
          the command runs on your machine, the credentials go to the service,
          and no account here is involved at any point.
        </p>
        <p className="mt-4 text-sm md:text-base text-gray-400 leading-relaxed">
          Two things worth knowing before you paste. The Supabase command
          contains a <Code>YOUR_PROJECT_REF</Code> placeholder that must be
          replaced with your own project reference. And Firecrawl, listed in the
          skills directory above, needs its own API key — the &ldquo;no network
          calls&rdquo; property of a local skill stops being true the moment a
          skill or a server reaches the internet on your behalf.
        </p>
      </GlassCard>
    </div>
  </Section>
);
