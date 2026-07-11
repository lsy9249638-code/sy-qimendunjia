# Architecture

## Stack
- **Frontend:** Next.js 14 (App Router) on Vercel
- **Database + Auth:** Supabase (Postgres + RLS + Auth)
- **Styling:** Tailwind CSS
- **AI (Sprint 4):** OpenAI API via server-side route only

## Now vs Later
| Now | Later |
|---|---|
| Chart engine + 9-palace grid | AI forecast suggestions |
| Owner auth + RLS lock-down | Shareable permalink slugs |
| Forecast notes (manual) | Pattern-match across charts |
| Seed demo data | Batch date-range generation |

## Key action flow — "Plot a chart"
1. Owner selects date + hour in the form and submits
2. `POST /api/charts` receives params, runs Qimen Dunjia calculation (pure TypeScript), returns 9 palace objects
3. Server inserts one `charts` row + nine `palaces` rows in a single Supabase transaction
4. Response redirects to `/charts/[id]`
5. Page fetches chart + palaces from Supabase and renders the 3×3 grid
6. Owner writes a forecast note → `POST /api/forecast-notes` → stored with `published=false`
7. Owner publishes → `PATCH /api/forecast-notes/:id` sets `published=true` + writes audit log

## Layer order
1. **DB schema + seed** (truth lives in Postgres)
2. **Calculation engine** (deterministic TypeScript, no AI dependency)
3. **CRUD API routes** (server-side, validated)
4. **UI** (reads server-derived state only)
5. **AI layer** (Sprint 4, additive — core works without it)
