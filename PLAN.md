# M.D.N Tech -- Plan Pointer

**Authoritative plan:** `MindPalace/Projects/MDN-Tech/development-plan.md` (v2, locked 2026-04-16)

**Last synced:** 2026-04-17

## Active phase

**Phase 2 -- Portal build (`app.mdntech.org`).** Phase 1 (CC stabilization) is complete as of Session 12 (2026-04-17). Now building the customer-facing portal:

- Migration 004 deployed (customers, clients, customer_products, product_usage, owner_id on chatbots, rewritten RLS + handle_new_user)
- Portal scaffold live: login, signup, dashboard, ChatKit listing, SignaKit/TradeKit placeholders, settings
- Next: ChatKit customer CRUD, free-tier caps, auth hardening

Phase 3 (website rebuild) runs in parallel; launches with portal. Phase 1 leftovers (1.2 role cleanup, 1.3 project data entry) are low priority and can slot in anytime.

## Related docs in this repo

- [command-center/MIND-PALACE-BRIEFING.md](command-center/MIND-PALACE-BRIEFING.md) -- the architectural decisions briefing that the Mind Palace v2 plan was built from (locked decisions D1-D6, migration 004 spec, sequencing)
- [command-center/mdntech-website-rebuild.md](command-center/mdntech-website-rebuild.md) -- website rebuild spec (input to Phase 3)
- [command-center/DEVELOPMENT-PLAN.md](command-center/DEVELOPMENT-PLAN.md) -- superseded 2026-04-16; historical reference only
- [handoff.md](handoff.md) -- session-by-session log
