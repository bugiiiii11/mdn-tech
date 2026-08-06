-- Migration 017: ChatKit credits-only billing + one-time feature unlocks
--
-- Retires the subscription tier model (Migration 008). New model:
--   * Credits fuel messages. Free trial = 30 messages/chatbot, then the owner
--     tops up credits (chatbots.credits_purchased). 1 credit = 1 visitor
--     message (lib/portal/plans.ts CREDITS_PER_MESSAGE).
--   * Premium capabilities are ONE-TIME UNLOCKS, not tiers:
--       - per-chatbot:  conversations, analytics, learning, reports
--       - per-account:  extra_chatbot (additional chatbot slot)
--   * No monthly subscriptions.
--
-- Non-destructive: the subscription_* columns on customers and the
-- subscription_events table from Migration 008 are LEFT IN PLACE but are no
-- longer read or written by the app. Drop them in a later migration once we are
-- certain no historical reporting needs them.

-- ============================================================
-- chatbots: per-chatbot one-time feature unlocks
-- ============================================================
-- jsonb map, e.g. {"conversations": true, "analytics": true}. Absent/false =
-- locked. Keyed by FeatureId in lib/portal/plans.ts.
alter table chatbots
  add column if not exists feature_unlocks jsonb not null default '{}'::jsonb;

-- ============================================================
-- customers: purchased additional chatbot slots (account-scoped)
-- ============================================================
-- Effective chatbot limit = BASE_CHATBOT_LIMIT (1) + extra_chatbot_slots.
alter table customers
  add column if not exists extra_chatbot_slots integer not null default 0;

-- ============================================================
-- chatbot_purchases: extend the audit trail to cover feature unlocks + packs
-- ============================================================
-- kind='credits' rows carry pack_id + credits_added (existing behaviour).
-- kind='feature' rows carry feature_id and credits_added = 0.
alter table chatbot_purchases
  add column if not exists kind text not null default 'credits'
    check (kind in ('credits', 'feature')),
  add column if not exists pack_id text,
  add column if not exists feature_id text;
