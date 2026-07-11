# Intelligence Layer

## Messy input the owner provides
- A date + time (sometimes ambiguous — lunar vs solar, local timezone)
- A free-text purpose ("明天能出行吗？")

## Auto-structure schema (produced by the calculation engine)
```json
{
  "chart_id": "uuid",
  "chart_datetime": "2025-06-01T12:00:00+08:00",
  "palaces": [
    {
      "position": 1,
      "direction": "坎",
      "heavenly_stem": "戊",
      "eight_gate": "休门",
      "eight_deity": "值符",
      "eight_star": "天蓬",
      "is_void": false
    }
  ]
}
```

## Events tracked
- Chart created (who, when, purpose)
- Forecast note created / edited / published
- AI suggestion requested, accepted, or rejected

## Scoring rules (rule-based first, no AI required)
- **Auspicious score 0–10:** count favourable gate/deity combos in duty-chief palace; add +1 per star not in void
- **Purpose tag:** keyword-match purpose text → tag (事业/出行/感情/财运/其他)

## v1 vs later
| v1 | Later |
|---|---|
| Rule-based auspicious score displayed on chart | OpenAI reads palace JSON, drafts a forecast paragraph |
| Purpose keyword tag | Cross-chart pattern: "开门 + 生门 in adjacent palaces historically correlated with X" |
