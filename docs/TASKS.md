# Tasks

## Gantt overview
```
Sprint 1 — DB + engine:   [===]
Sprint 2 — UI (no auth):       [===]
Sprint 3 — Auth + RLS:              [===]  ← v1 functional milestone
Sprint 4 — AI assistant:                  [===]
```

---

## Sprint 1 — DB schema + chart calculation engine
**Goal:** Qimen Dunjia chart can be computed and stored; seed data renders.

- [ ] Run `migration_sql` against Supabase project; confirm 3 seed charts + 27 palace rows exist
- [ ] Implement `computeChart(datetime)` in `lib/qimen.ts` — returns 9 palace objects with correct stems, gates, deities, stars (use established 年家/月家/日家/时家 rules)
- [ ] Unit-test `computeChart` against at least 2 known reference charts
- [ ] `POST /api/charts` — validates input, calls `computeChart`, inserts `charts` + `palaces` rows atomically
- [ ] `GET /api/charts` — returns list; `GET /api/charts/[id]` — returns chart + palaces
- [ ] Confirm no secrets in any API response

**Definition of Done:** `POST /api/charts` with a known datetime returns HTTP 201; querying `GET /api/charts/[id]` returns all 9 palaces with correct values matching the reference chart; seed rows readable without auth.

---

## Sprint 2 — Chart display UI (anonymous-viewable)
**Goal:** Site is demoable — anyone can see charts and plot new ones.

- [ ] `/` homepage: lists recent charts (title, date, purpose); shows empty state if no charts
- [ ] `/charts/[id]` page: renders 3×3 palace grid; each cell shows 方位, 天干, 八门, 八神, 八星; highlights duty-chief palace
- [ ] New-chart form on homepage (date picker + hour selector + purpose input) → calls `POST /api/charts` → redirects to chart detail
- [ ] Forecast note panel on chart detail: displays published notes; owner text area (unsecured in this sprint)
- [ ] All pages handle: loading skeleton, empty state copy, error banner, partial data (missing palace fields), ready state
- [ ] Auspicious score (0–10) displayed on chart detail

**Definition of Done:** An anonymous visitor loads `/`, sees 3 demo charts, clicks one, sees the 9-palace grid with all fields, can plot a new chart from the form, and the new chart persists after page refresh.

---

## Sprint 3 — Owner auth + RLS lock-down ← v1 functional milestone
**Goal:** Only the owner can create/edit/delete; anonymous visitors can only read published content.

- [ ] Enable Supabase Auth; create the single owner account
- [ ] Add `user_id` population on all inserts (set to `auth.uid()` when logged in)
- [ ] Replace permissive RLS policies on `charts`, `palaces`, `forecast_notes` with owner-scoped write policies
- [ ] Keep select-all read policy for published content
- [ ] Hide create/edit/delete UI for unauthenticated visitors
- [ ] `/login` page with email/password form; redirect to `/` after sign-in
- [ ] Smoke-test: anonymous tab cannot POST; owner tab can CRUD; no 401 leaks data

**Definition of Done:** Anonymous visitor: can view charts and published notes; form/edit buttons hidden. Owner: logs in, plots a chart, edits a note, publishes it. Anonymous tab refreshes and sees the published note. Supabase logs show correct auth.uid() on write rows.

---

## Sprint 4 — AI forecast assistant
**Goal:** Owner can request an AI-drafted forecast; reviews before publishing.

- [ ] "Suggest forecast" button on chart detail (owner only)
- [ ] `POST /api/forecast-notes/suggest` — sends palace JSON to OpenAI, stores result with `source='ai'`, `confidence` (from response), `review_status='unreviewed'`, `published=false`
- [ ] Inline review UI: owner sees AI draft, can edit, then clicks Publish
- [ ] Publish action sets `review_status='approved'`, `published=true`, writes audit log
- [ ] Rejected drafts set `review_status='rejected'`; not shown to visitors
- [ ] `OPENAI_API_KEY` accessed only in server route; never in client bundle

**Definition of Done:** Owner clicks "Suggest forecast", sees a draft appear in the note panel, edits it, publishes it. Anonymous visitor sees the published note. Audit log has entries for `note.ai_suggest` and `note.publish`. Network tab shows no API key.
