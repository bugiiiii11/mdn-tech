---
name: start
description: Session initialization -- read project state, check Mind Palace, show what's next, flag stale projects
---

Initialize the session by reading project state and presenting a clear starting point.

## Step 1 -- Read project context (do all in parallel)

Read these files:
- `handoff.md` (root) -- session history + "What To Do Next"

Note: CLAUDE.md is auto-loaded every message -- do NOT read it again.

Run git status checks in parallel (adapt per project -- example below is multi-repo):
- `git status -sb` -- or `git -C <repo> status -sb` for multi-repo projects
- `git log --oneline -3` -- recent commits

Check unpushed commits against remote:
- `git rev-list <remote>/<branch>..HEAD --count`

Check if emergency snapshot exists:
- `emergency-snapshot.md` (root)
- If it exists, read it and include its contents in the briefing under "Emergency Recovery"
- After presenting the briefing, delete the snapshot file (it's been consumed)

## Step 2 -- Check Mind Palace (if accessible)

Read the project's Mind Palace wiki to cross-reference:
- `MindPalace/Projects/{project}/{project}.md` -- check frontmatter for last_session_date, current_focus
- Flag if Mind Palace is stale vs handoff (e.g., handoff says session 15 but wiki says session 12)

Quick scan for other overdue projects (optional, low priority):
- Check Mind Palace `Home.md` Dataview for overdue/at-risk projects
- Mention any that haven't been touched in 14+ days

## Step 3 -- Present session briefing

Show a concise briefing:

```
## Session Briefing

**Last session:** <N> -- <title from handoff> (<date>)
**Days since last session:** <N>

### Repo Status
| Repo | Branch | Status | Unpushed | Last commit |
|------|--------|--------|----------|-------------|
(adapt columns per project)

### What To Do Next
<Copy the "What To Do Next" table from handoff.md>
<Flag any items that appear already done based on git log>

### Emergency Recovery (only if snapshot existed)
<Summary of what was in progress from the snapshot>

### Other Projects (from Mind Palace)
<Any overdue or at-risk projects worth mentioning, or "All on track.">

### Heads Up
<Any uncommitted work, unpushed commits, stale handoff items, or Mind Palace drift>
<If nothing, say "All clear.">
```

## Rules

- Do NOT make any changes (except deleting consumed emergency snapshot)
- Keep the briefing short and scannable
- Flag stale items honestly
- Always include session date for tracking frequency
