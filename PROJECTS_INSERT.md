# Insert Projects to Command Center

Copy and paste this SQL into your Supabase console (ijfgwzacaabzeknlpaff):
https://ijfgwzacaabzeknlpaff.supabase.co → SQL Editor

---

## Add new columns (if not exists)

```sql
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';
```

---

## Insert MDN-Tech

```sql
INSERT INTO projects (
  name, status, start_date, description,
  tech_stack, repository_url, production_url,
  supabase_project_ref, metadata
) VALUES (
  'M.D.N Tech', 
  'development', 
  '2026-03-21',
  'Internal company portal + Command Center dashboard with project management, team ops, infrastructure monitoring, and AI chatbot service',
  ARRAY['Next.js', 'React', 'Tailwind CSS', 'Supabase', 'Three.js', 'Anthropic API', 'Vercel'],
  'https://github.com/bugiiiii11/M.D.N-Tech-main',
  'https://mdntech.io',
  'ijfgwzacaabzeknlpaff',
  jsonb_build_object(
    'phase', 'development',
    'current_focus', 'Phase 2: Portal build (app.mdntech.org)',
    'products', ARRAY['ChatKit', 'SignaKit', 'TradeKit']
  )
);
```

---

## Insert SignaKit (AuthVault)

```sql
INSERT INTO projects (
  name, status, start_date, description,
  tech_stack, repository_url, production_url,
  supabase_project_ref, railway_project_id, metadata
) VALUES (
  'SignaKit (AuthVault)', 
  'development', 
  '2026-03-25',
  'Web3Auth replacement for Swarm Resistance. SaaS authentication product for app.mdntech.org offering MetaMask, Google, and Email auth with transaction signing.',
  ARRAY['TypeScript', 'React', 'Vite', 'Hono', 'Supabase', 'Turborepo', 'Railway'],
  'https://github.com/bugiiiii11/AuthVault',
  'https://auth-vault-demo.vercel.app',
  'hldkdiibvsdtgxnqaaxq',
  'authvaultbackend-production.up.railway.app',
  jsonb_build_object(
    'phase', 'development',
    'current_focus', 'WalletConnect relay fix',
    'product_type', 'saas',
    'portal_product', true
  )
);
```

---

## Insert TradeKit

```sql
INSERT INTO projects (
  name, status, start_date, description,
  tech_stack, repository_url, production_url,
  supabase_project_ref, metadata
) VALUES (
  'TradeKit', 
  'development', 
  '2026-03-01',
  'BTC perpetual futures trading bot on Hyperliquid mainnet. Reads indicators from TradingView via MCP, evaluates 3 strategies with multi-timeframe confluence, executes trades. SaaS product for app.mdntech.org.',
  ARRAY['TypeScript', 'Node.js', 'Next.js 16', 'Supabase', 'Hyperliquid SDK', 'TradingView MCP', 'Vercel'],
  'https://github.com/bugiiiii11/TradeKit',
  'https://trade-kit.vercel.app',
  'gseztkzguxasfwqnztuo',
  jsonb_build_object(
    'phase', 'development',
    'current_focus', 'Monitor S3 tuning, BBWP<40 + 45min hold',
    'product_type', 'saas',
    'portal_product', true,
    'bankroll_usdc', 500.26
  )
);
```

---

## Insert Good Hair by Zane

```sql
INSERT INTO projects (
  name, client_name, status, start_date, description,
  tech_stack, repository_url, production_url, metadata
) VALUES (
  'Good Hair by Zane', 
  'Good Hair by Zane', 
  'deployed', 
  '2026-03-28',
  'Hair salon website for salon specializing in hair extensions (keratin, micro-ring, nano-ring, mikrokapsule methods). Based in Ivanka pri Dunaji, Slovakia.',
  ARRAY['Next.js 14', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'Vercel'],
  'https://github.com/bugiiiii11/zane_kadernictvo',
  'https://goodhairbyzane.com',
  jsonb_build_object(
    'phase', 'deployed',
    'current_focus', 'Google Search Console + My Business setup',
    'language', 'Slovak',
    'seo_score', '62/100',
    'maintenance_possible', true
  )
);
```

---

## Update Swarm Resistance with dev/prod infrastructure details

This keeps the existing "Swarm Resistance dev" entry but enriches it with dev/prod infrastructure for health monitoring.

```sql
UPDATE projects 
SET metadata = metadata || jsonb_build_object(
  'infrastructure', jsonb_build_object(
    'dev', jsonb_build_object(
      'supabase_ref', 'upeefkqhaxlhqcvoizve',
      'supabase_url', 'https://upeefkqhaxlhqcvoizve.supabase.co',
      'railway_backend', 'swarm-resistance-backend-dev-production.up.railway.app'
    ),
    'prod', jsonb_build_object(
      'supabase_ref', 'yjwminnwcijgfqrwjkfn',
      'supabase_url', 'https://yjwminnwcijgfqrwjkfn.supabase.co',
      'railway_backend', 'swarm-resistance-backend-production.up.railway.app'
    ),
    'auth_service', jsonb_build_object(
      'name', 'SignaKit (AuthVault)',
      'supabase_ref', 'hldkdiibvsdtgxnqaaxq',
      'railway_backend', 'authvaultbackend-production.up.railway.app'
    )
  ),
  'phase', 'testing',
  'current_focus', 'SEO fixes - restore homepage content, fix mobile redirect'
)
WHERE name = 'Swarm Resistance dev';
```
