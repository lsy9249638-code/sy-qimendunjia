# Agentic Layer

## Risk levels & actions

| Risk | Action | Trigger | Approval |
|---|---|---|---|
| Low (auto) | Tag purpose from free text | Chart created | None — runs immediately |
| Low (auto) | Compute auspicious score | Chart created | None |
| Medium (light approval) | Draft forecast note via AI | Owner clicks "Suggest forecast" | Owner must review + publish |
| High (always approval) | Publish forecast note | Owner clicks Publish | Owner confirm dialog |
| Critical (human-only) | Delete a chart + all palaces | Owner clicks Delete | Owner types chart title to confirm |

## Named tools (server-side only)
- `tool.computeChart(datetime)` → returns palace JSON
- `tool.scoreChart(palaces)` → returns auspicious score 0–10
- `tool.draftForecast(chartId)` → calls OpenAI, stores result as `review_status='unreviewed'`
- `tool.publishNote(noteId)` → sets published=true, writes audit log
- `tool.deleteChart(chartId)` → cascades palaces, writes audit log

## Audit log fields written per action
`action`, `entity_type`, `entity_id`, `user_id`, `payload` (before/after), `created_at`

## v1 vs later
- **v1:** computeChart + scoreChart (deterministic, no AI)
- **Sprint 4:** draftForecast with owner review gate
- **Later:** proactive suggestions ("You haven't charted this week's important dates")
