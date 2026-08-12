"use client";

import { useState } from "react";

// Copy-to-clipboard command block for /toolkit. The portal has its own
// CodeBlock; this one is a marketing-tree twin restyled to the Event Horizon
// grammar (violet hairline, no drop shadow) so the page does not import across
// the portal boundary.
//
// The copy control is cyan because it is interactive (Bent Light Rule); the
// command text itself stays gray-200 and the label gray-400 — the legibility
// floor, since the label carries meaning (which shell this is for).
//
// Long commands scroll inside the <pre>, never the page body.

type CodeBlockProps = {
  code: string;
  label?: string;
};

export const CodeBlock = ({ code, label }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (insecure context, denied permission) — the text
      // is still selectable, so there is nothing to recover from.
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#7042f88b] bg-[#030014]/70 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2">
        <span className="font-mono text-xs text-gray-400">
          {label ?? "terminal"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded px-2 py-1 -my-1 text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          {copied ? "Copied" : "Copy"}
          <span className="sr-only"> command to clipboard</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-xs sm:text-sm leading-relaxed text-gray-200">
          {code}
        </code>
      </pre>
    </div>
  );
};
