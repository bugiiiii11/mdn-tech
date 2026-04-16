# M.D.N Tech -- Plan Pointer

**Authoritative plan:** `MindPalace/Projects/MDN-Tech/development-plan.md` (v2, locked 2026-04-16)

**Last synced:** 2026-04-16

## Active phase

**Phase 1 -- CC stabilization.** Small prep work before the portal build:

- 1.1 Move CC from `mdntech.org/command-center` to `admin.mdntech.org` (Vercel domain + DNS CNAME + middleware host-branching)
- 1.2 Role simplification cleanup -- CC only ever has 2 founders (admins); engineer/viewer roles in schema go unused
- 1.3 Enter the remaining 6 internal projects into CC (Royal Stroje already entered)
- 1.4 Minor cleanup: delete `/api/chat/test`, fix knowledge page date format

After Phase 1, work begins on Phase 2 (portal build at `app.mdntech.org`) and Phase 3 (website rebuild, parallel track, launches with portal).

## Related docs in this repo

- [command-center/MIND-PALACE-BRIEFING.md](command-center/MIND-PALACE-BRIEFING.md) -- the architectural decisions briefing that the Mind Palace v2 plan was built from (locked decisions D1-D6, migration 004 spec, sequencing)
- [command-center/mdntech-website-rebuild.md](command-center/mdntech-website-rebuild.md) -- website rebuild spec (input to Phase 3)
- [command-center/DEVELOPMENT-PLAN.md](command-center/DEVELOPMENT-PLAN.md) -- superseded 2026-04-16; historical reference only
- [handoff.md](handoff.md) -- session-by-session log
