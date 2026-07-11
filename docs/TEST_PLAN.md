# Test Plan

## v1 success scenario (manual walkthrough)

### Step 1 — Seed data visible
1. Open site at `/` without logging in
2. **Expect:** 3 chart cards listed (titles contain 午时盘, 子时盘, 卯时盘)
3. Click the first chart → `/charts/[id]`
4. **Expect:** 3×3 grid renders; every cell shows 方位, 天干, 八门, 八神, 八星; no blank cells; auspicious score 0–10 visible

### Step 2 — Plot a new chart
1. On `/`, fill in date = today, hour = 午 (11:00–13:00), purpose = "测试"
2. Click **Plot chart**
3. **Expect:** Redirect to new chart detail page; grid shows correct palace values; page survives hard refresh (data from DB, not memory)

### Step 3 — Forecast note (Sprint 3+ owner auth)
1. Log in as owner at `/login`
2. Navigate to any chart detail
3. Type a note in the forecast panel, click **Save draft**
4. **Expect:** Note saved with `published=false`; not visible in anonymous tab
5. Click **Publish**
6. Open anonymous browser tab → same chart URL
7. **Expect:** Published note visible; Save/Edit controls hidden for anonymous user

## Empty state tests
- Delete all charts → `/` shows "还没有盘，点击下方开始起盘" (no blank page, no JS error)
- Chart with no forecast note → note panel shows "暂无解盘，点击添加"

## Error state tests
- Submit new-chart form with no date → inline validation error, no DB write
- `POST /api/charts` with invalid hour value → 400 response with message; UI shows error banner
- Supabase unreachable (simulate offline) → error banner "数据加载失败，请刷新重试"; no crash

## Security spot-checks
- Open browser DevTools Network tab while using the site → confirm no `SUPABASE_SERVICE_ROLE_KEY` or `OPENAI_API_KEY` in any response
- Anonymous user: try `POST /api/charts` after Sprint 3 lock-down → expect 403
- Audit log: after each write action, query `audit_logs` in Supabase dashboard → confirm row exists with correct `action` and `entity_id`
