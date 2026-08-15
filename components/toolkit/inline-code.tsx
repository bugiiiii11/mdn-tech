import type { ReactNode } from "react";

// Inline code span for /toolkit prose (paths, slash commands, env vars).
//
// Violet, not cyan: a path is structure, not an action, and cyan is reserved
// for things that are clickable or evidentiary (Bent Light Rule). purple-200 on
// the violet glass fill clears the contrast floor comfortably, which matters
// because these spans carry meaning — they are the literal thing you type.

export const Code = ({ children }: { children: ReactNode }) => (
  <code className="rounded bg-[#7042f81f] px-1.5 py-0.5 font-mono text-[0.9em] text-purple-200 break-words">
    {children}
  </code>
);
