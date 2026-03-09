# Inro Funnel Metrics Integration

**Date:** 2026-03-09
**Status:** Draft
**Scope:** Add Instagram DM automation metrics (via Inro) to the analytics dashboard

## Overview

The analytics dashboard at `/dashboard` currently tracks two metrics per page: views and CTA clicks. This spec adds a third metric, "DMs Sent," by pulling execution data from the Inro API and linking it to guides via scenario IDs stored in the guide JSON files.

## Current State

- **Dashboard UI** (`src/app/dashboard/_components/dashboard-client.tsx`): Three stat cards (Total views, Total clicks, CTR), a composed Recharts chart (views bar, clicks bar, CTR area), and a per-page table with Views/Clicks/CTR columns.
- **Stats API** (`src/app/api/stats/route.ts`): Queries the `PageEvent` Prisma model, groups by page/event, and returns `stats[]`, `daily[]`, and `totals`.
- **Guide schema** (`src/app/guides/_lib/guides.ts`): `Guide` interface with `slug`, `title`, `description`, `date`, `intro`, `sections`, optional `example` and `proTips`.
- **Inro API**: `GET https://api.inro.social/api/v1/scenarios` returns scenario objects with execution metrics. Auth via `Authorization: Bearer <INRO_API_KEY>`.

## Changes

### 1. Guide Interface + JSON Schema

Add an optional field to the `Guide` interface in `src/app/guides/_lib/guides.ts`:

```
inroScenarioIds?: number[]
```

Guide JSON files in `content/guides/*.json` can then include an array of Inro scenario IDs that represent automations driving traffic to that guide. Guides without this field default to 0 DMs.

### 2. Stats API (`src/app/api/stats/route.ts`)

Extend the GET handler to:

1. **Read guide JSON files** using the existing `getAllGuides()` helper to build a map of `page -> inroScenarioIds[]`. The page key should match the pattern used in the existing stats (e.g., `/guides/<slug>`).
2. **Fetch Inro scenarios** with `GET https://api.inro.social/api/v1/scenarios` using `Authorization: Bearer ${process.env.INRO_API_KEY}`. Skip this call if `INRO_API_KEY` is not set (return 0 for all DM counts).
3. **Map scenario metrics to guides.** For each guide with `inroScenarioIds`, find the matching scenarios in the Inro response and sum their execution counts:
   - For `range=7d`: use `executions.last_7_days` from each scenario.
   - For `range=30d` and `range=all`: use `executions.total` (Inro only provides `last_7_days` and `total` windows).
4. **Add `dms` to each stat row** in the response, alongside `views` and `clicks`.
5. **Add `dms` to totals** in the response.
6. **Daily breakdown**: Inro does not provide daily granularity, so the `daily[]` array does not include DMs. DMs only appear in stat cards and the per-page table.

Updated response shape:

```
StatsResponse {
  range: string
  stats: { page, views, clicks, dms, rate }[]
  daily: { date, views, clicks, ctr }[]          // unchanged
  totals: { views, clicks, dms, rate }
}
```

### 3. Dashboard UI (`src/app/dashboard/_components/dashboard-client.tsx`)

**Interfaces**: Add `dms: number` to `PageStat` and to `StatsResponse.totals`.

**Stat cards**: Change the grid from 3 to 4 columns. Add a "DMs sent" card before "Total views" so the order is: DMs Sent, Total Views, Skool Clicks, CTR.

**Chart**: No changes. The composed chart continues to show daily views, clicks, and CTR. DMs are excluded because Inro does not provide daily granularity.

**Table**: Add a "DMs" column between the Page and Views columns. Display `row.dms.toLocaleString()` with the same styling as existing numeric columns.

### 4. Environment Variable

Add `INRO_API_KEY` to the deployment environment. The API route should gracefully handle a missing key by returning 0 for all DM values (no error, no broken dashboard).

## Key Decisions

| Decision | Rationale |
|---|---|
| Fetch Inro data live per dashboard load | Low traffic dashboard, simple implementation, no DB schema changes needed |
| No daily DM chart data | Inro API only provides `last_7_days` and `total` aggregation windows, not per-day breakdowns |
| `last_7_days` for 7d range, `total` for 30d/all | Best available mapping given Inro's two aggregation windows |
| Graceful degradation when INRO_API_KEY is unset | Dashboard should always load; DMs show as 0 if the key is missing |
| `inroScenarioIds` is optional on Guide | Backwards compatible; existing guides without IDs simply show 0 DMs |

## Files Touched

- `src/app/guides/_lib/guides.ts` (interface change)
- `content/guides/*.json` (add `inroScenarioIds` to relevant guides)
- `src/app/api/stats/route.ts` (Inro fetch + response shape)
- `src/app/dashboard/_components/dashboard-client.tsx` (stat card, table column, interfaces)
