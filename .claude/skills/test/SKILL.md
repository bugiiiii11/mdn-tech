---
name: test
description: Run available tests -- lint, type checks, and build verification for M.D.N Tech Next.js site
---

Run available tests and report results. This skill runs what exists today without requiring new dependencies.

## Arguments

Parse the user's `/test` arguments:
- `/test` or `/test all` -- run everything
- `/test lint` -- lint only (fast)
- `/test build` -- build check only
- `/test types` -- TypeScript type checking only

## Step 1 -- Run checks (parallelize where possible)

Run in parallel where independent:

- **Lint:** `npm run lint 2>&1 | tail -30`
- **Build:** `npm run build 2>&1 | tail -30`
- **TypeScript:** `npx tsc --noEmit 2>&1 | tail -30`

Capture exit code and last lines of output for each.

If user specified a subset (e.g., `/test lint`), only run that subset.

## Step 2 -- Present results

Show a summary table:

### Test Results

| Check | Result | Details |
|-------|--------|---------|
| ESLint | PASS/FAIL | error count or "clean" |
| Build | PASS/FAIL | build time or error |
| TypeScript | PASS/FAIL | type error count or "clean" |

### Summary
- **X/Y checks passed**
- If any failed, show the relevant error output (full errors only for failures)
- If a check was skipped, note why

## Rules

- Do NOT install new dependencies
- Do NOT modify any source files
- Capture output but keep it concise -- show full errors only for failures
- If a check hangs (>120s), kill it and report as TIMEOUT
- Build artifacts go to `.next/` -- this is fine, it's gitignored
- Run from the project root directory
