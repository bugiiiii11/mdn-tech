---
name: doc-update
description: Update project documentation (handoff.md) based on this session's work
---

Check whether documentation needs updating based on this session's work, then update only what's actually missing or stale.

## Step 1 -- Smart assessment

Before reading any files, think about what actually changed this session:
- Did we do ANY work? -> always check `handoff.md`
- Did we make strategic decisions? -> check CLAUDE.md current state

Only read files that might need updating. Skip the rest.

Then report a brief assessment:

```
Documentation check:
- handoff.md: <status>
- CLAUDE.md: <status or "skipped -- no relevant changes">

Proceed with updates? (N files need changes)
```

If everything is already up to date, say so clearly and stop.

## Step 2 -- Update only what needs it

### handoff.md (always check)

If handoff.md doesn't exist, create it with the template below. If it exists, update it.

**Template for new handoff.md:**

```markdown
# M.D.N Tech -- Handoff

## Session Summary Table

| # | Date | Title | Key changes |
|---|------|-------|-------------|
| 1 | <date> | <title> | <summary> |

## What Was Done (Session N) -- <short title>

1. **<What was built or changed>** -- <concise description>. Files: <list>. Committed: <hash>.

## What To Do Next

| Priority | Task | Notes |
|----------|------|-------|
| 1 | <task> | <notes> |

## Key Files

| File | Purpose |
|------|---------|
| <path> | <description> |
```

If updating an existing handoff.md:
- Add a new session section BEFORE "What To Do Next"
- Update "What To Do Next" table to reflect current priorities
- Update "Key Files" table if new files were added
- Update Session Summary Table (add row for this session)

**Trimming:** If handoff has more than ~5 session sections, move the oldest to an archive or delete if trivial.

### CLAUDE.md (rarely -- only for state changes)

- Update "Current State" section if session number or project status changed
- Keep concise

## Style rules

- No emojis in docs
- Tables for structured data
- Concise summaries in handoff -- don't paste code
- If nothing needs updating, say so and stop
