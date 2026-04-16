---
name: doc-update
description: Update project documentation (handoff.md and other docs) based on this session's work
---

Check whether documentation needs updating based on this session's work, then update only what's actually missing or stale.

## Step 1 -- Smart assessment (minimize reads)

Before reading any files, think about what actually changed this session:
- Did we do ANY work? -> always check `handoff.md`
- Did we make strategic decisions? -> check if decisions.md needs an entry
- Did we create new files or features? -> check relevant docs
- Otherwise -> skip ("no changes in that area")

Only read files that might need updating. Skip the rest.

Then report a brief assessment:

```
Documentation check:
- handoff.md: <needs update / up to date>
- decisions.md: <N decisions to log / skipped>
- Other docs: <status or "skipped -- no relevant changes">

Proceed with updates? (N files need changes)
```

If everything is already up to date, say so clearly and stop.

## Step 2 -- Update only what needs it

### handoff.md (always check)

Add a new session section BEFORE "What To Do Next":

```markdown
## What Was Done (Session N) -- <short title>
Date: YYYY-MM-DD

1. **<What was built or changed>** -- <concise description>. Files: <list>. Committed: <hash>.
```

Then update:
- "What To Do Next" table to reflect current priorities
- "Key Files" table if new files were added
- Session Summary Table (add row for this session with date)

**Trimming:** If handoff has more than ~3 session sections, move the oldest to an archive or delete if trivial.

### decisions.md (if decisions were flagged)

Append decision entries. Create the file from template if it doesn't exist.

### Project-specific docs

- Only update docs that were affected by this session's work
- Create new docs only if a significant new feature was added
- Docs in dev repos arrive in production through promotes

## Style rules

- No emojis in docs
- Tables for structured data
- Concise summaries in handoff -- don't paste code
- Always include date on session entries
- If nothing needs updating, say so and stop
