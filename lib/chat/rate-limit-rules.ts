// The public chat surface's rate-limit figures, split out of rate-limit.ts so
// CLIENT components can read them. The enforcement module imports
// createServiceClient at module scope, which makes it server-only; these two
// objects are plain data, and the /chatkit marketing copy quotes them ("20
// requests a minute from one visitor..."), so they live here where both sides
// can import them and the prose can never drift from what the route enforces.
//
// rate-limit.ts re-exports both, so server callers keep their single import.
// Keep this module dependency-free: no supabase, no next/*, nothing server-only.

// Per-IP stops one visitor hammering; per-bot caps what a leaked chatbot id
// can cost across many IPs (a botnet defeats the IP bucket). Windows are in
// seconds, matching RateLimitRule.
export const CHAT_IP_RULE = { limit: 20, window: 60 }
export const CHAT_BOT_RULE = { limit: 120, window: 60 }
