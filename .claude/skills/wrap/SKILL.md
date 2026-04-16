---
name: wrap
description: Check session state -- commit & push if needed, update docs, sync Mind Palace, log decisions
---

Check the current state of work and wrap up anything that needs it. Safe to call anytime -- mid-session, after a chunk of work, or at session end. If nothing needs doing, say so and stop.

## Step 1 -- Assess current state (do all in parallel)

Run git checks (adapt per project):
- `git status -sb` -- uncommitted changes
- `git diff --stat` -- what changed
- `git rev-list <remote>/<branch>..HEAD --count` -- unpushed commits

Read:
- `handoff.md` -- is the current session documented? Is "What To Do Next" accurate?

## Step 2 -- Report and act

Present a brief status check:

```
## Wrap Check

### Repo Status
| Repo | Branch | Uncommitted | Unpushed | Action needed |
|------|--------|-------------|----------|---------------|
(adapt per project)

**Handoff status:** <up to date / needs session N section / stale>
```

Then handle each issue:

### Code changes (commit & push per repo)
- For each repo with uncommitted changes:
  - Show the changed files
  - Ask: "Want me to commit & push?"
  - If yes, follow standard git commit protocol, then push
- Do NOT auto-commit -- always ask first

### Documentation updates
- If handoff.md needs updating, invoke `/doc-update`
- If this was a discussion/analysis session (no code), still update "What To Do Next" if priorities changed

### Decision check (new)
Ask once at end of wrap:

> Any key decisions this session worth logging? (skip if none)

If yes, append to `decisions.md` in the project folder (or create it from the Decision Log Template). Keep entries concise:
```
### YYYY-MM-DD -- Session N
**Decision:** What was decided
**Why:** Brief reasoning
**Alternatives:** What else was considered
```

### Mind Palace sync (new)
After handoff is updated, also update the project's Mind Palace wiki frontmatter:
- `last_session: N` -- session number
- `last_session_date: YYYY-MM-DD` -- today
- `current_focus: "brief description"` -- from "What To Do Next" priority 1
- `updated: YYYY-MM-DD` -- today

This keeps Mind Palace dashboards current without manual effort.

**Mind Palace path:** `MindPalace/Projects/{project}/{project}.md`

If the Mind Palace vault is not accessible from this project's working directory, skip this step and note it.

### "What To Do Next" check
- Compare "What To Do Next" against what was done this session
- Flag completed items and suggest new ones
- Ask the user before making changes

## Rules

- Always ask before committing, pushing, or modifying docs
- If everything is clean and up to date, just say "All wrapped. Nothing to do." and stop
- Keep it brief
- This skill can be called multiple times safely (idempotent)
- Always include date in session entries
