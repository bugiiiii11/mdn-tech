---
title: "/start Skill"
category: skill
tags: [session, initialization, git]
updated: 2026-03-21
---

# /start Skill

Session initialization skill. Run at the start of every Claude Code session.

## What It Does

1. Checks git status (`git status -sb`, `git log --oneline -5`)
2. Reads `handoff.md` -- shows what was done last session and what's next
3. Flags uncommitted changes, stale docs, or anything that needs attention
4. Gives a clear "ready to work" summary

## When To Use

- First message of every session
- `/start` -- Claude Code recognizes this as a slash command

## File Location

`.claude/skills/start/SKILL.md`

## Output Format

```
## Session Start

**Branch:** main | **Uncommitted:** clean | **Last commit:** abc1234

### What was done last session
[summary from handoff.md]

### What to do next
[priority table from handoff.md]

### Flags
- [any issues found]
```
