---
name: save
description: Emergency context save -- dump session state before compaction hits
---

Fast emergency save. Use when context is running low (80%+) and you need to preserve what happened this session. No ceremony -- just dump and stop.

## What to write

Run git status checks in parallel (adapt per project):
- `git status -sb` -- for each repo

Then create `emergency-snapshot.md` in the project root with:

```markdown
# Emergency Snapshot -- Session <N>
Date: <today>

## What was done this session
<Bullet list of what was accomplished, decisions made, files changed>

## Uncommitted work
<Per-repo list of modified/new files from git status, or "all clean">

## Key context
<Anything important that would be lost -- root causes found, approaches decided, gotchas discovered>

## Decisions made
<Any key decisions and their reasoning -- these should also go in decisions.md on resume>

## Next step when resuming
<What was in progress or about to start>
```

## Rules

- Minimize tool calls: git status checks (parallel) + write the file
- Do NOT commit, push, or update any other docs
- Do NOT read handoff or other files -- use what you already know from the conversation
- Write fast, move on. This is a fire exit, not a wrap-up.
- If an emergency snapshot already exists, overwrite it (the new one is more current)
- The /start skill will consume and delete this file on next session
