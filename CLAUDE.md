# M.D.N Tech

Next.js 15 site: marketing landing (mdntech.org, /sk agency page), customer portal (app.mdntech.org -- ChatKit, ToolKit, MarketKit), admin Command Center (admin.mdntech.org -- TechKit). Supabase backend, Vercel hosting.

## Session protocol

- Start each session with `/handoff start` (reads `handoff.md`). Other modes: `/handoff wrap`, `/handoff save`, `/handoff docs` -- see `.claude/skills/handoff/SKILL.md`.
- **AUTO-WRAP RULE:** the auto-wrap Stop hook measures REAL context usage from the transcript and fires at 15% of the window (hard nudge at 17%; window default 1M tokens, env-tunable via `AUTOWRAP_WINDOW`/`AUTOWRAP_SOFT_PCT`/`AUTOWRAP_HARD_PCT`). When it fires -- or you independently notice context is getting long -- finish the task at hand, then run the full `/handoff wrap` flow WITHOUT being asked: update `handoff.md` (no confirmation), commit locally (no confirmation), NEVER push without an explicit user request.
- **Handoff extras (wrap):** sync the Mind Palace wiki at `C:\Users\cryptomeda\Desktop\Swarm\myprojects\MindPalace\Projects\MDN-Tech\` -- update frontmatter (`last_session`, `last_session_date`, `current_focus`, `updated`) if the file exists; skip silently if not.
- Safety hooks live in `.claude/hooks/` (wired via `.claude/settings.local.json`). If a hook blocks a legitimate action, do not work around it -- explain what happened and propose a pattern fix for the user to approve.

## Conventions

- Work happens on feature branches (currently `feat/landing-rebuild`); prod deploys from `main` via Vercel.
- `handoff.md` is the live session state (capped ~150 lines for this project); full history in `handoff-archive.md` (never read on start).
- Supabase changes go through numbered `supabase/migrations/` files and the Management API; never run destructive SQL without a migration file.
- No emojis in project docs.
