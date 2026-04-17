-- Find and remove duplicate projects, keeping only one of each
-- Run this in Supabase SQL Editor: https://ijfgwzacaabzeknlpaff.supabase.co/sql

-- First, see what duplicates exist
SELECT name, COUNT(*) as count
FROM projects
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Delete duplicates using window functions, keeping the first (oldest) created_at for each name
DELETE FROM projects
WHERE id IN (
  SELECT id FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at ASC) as rn
    FROM projects
  ) t
  WHERE rn > 1
);

-- Verify cleanup - should show each project once
SELECT name, status, COUNT(*) as count
FROM projects
GROUP BY name, status
ORDER BY name;
