---
description: Session initialization -- read project state, show what's next, flag anything stale or uncommitted
---

Initialize the session by reading project state and presenting a clear starting point.

## Step 1 -- Read project context (do all in parallel)

Read these files (if they exist):
- `handoff.md` (root) -- session history + "What To Do Next"

Note: CLAUDE.md is auto-loaded every message -- do NOT read it again.

Run these commands in parallel:
- `git status -sb` -- current branch and status
- `git log --oneline -5` -- recent commits
- `git rev-list origin/main..HEAD --count 2>/dev/null` -- unpushed commits

Check if emergency snapshot exists:
- `emergency-snapshot.md` (root)
- If it exists, read it and include its contents in the briefing under "Emergency Recovery"
- After presenting the briefing, delete the snapshot file (it's been consumed)

## Step 2 -- Present session briefing

Show a concise briefing:

## Session Briefing

**Last session:** <N> -- <title from handoff, or "No handoff found">

### Repo Status
| Branch | Remote | Status | Unpushed | Last commit |
|--------|--------|--------|----------|-------------|
| <branch> | origin/main | <clean/dirty> | <N or 0> | <hash> <msg> |

### What To Do Next
<Copy the "What To Do Next" table from handoff.md, or "No handoff found -- ask user for priorities">
<Flag any items that appear already done based on git log>

### Emergency Recovery (only if snapshot existed)
<Summary of what was in progress from the snapshot>

### Heads Up
<Any uncommitted work, unpushed commits, or stale handoff items>
<If nothing, say "All clear.">

## Rules

- Do NOT make any changes (except deleting consumed emergency snapshot)
- Keep the briefing short and scannable
- Flag stale items honestly
