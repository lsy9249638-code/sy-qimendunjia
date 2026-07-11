# Data Model

## charts
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid | nullable until lock-down |
| title | text | e.g. "2025-06-01 午时盘" |
| chart_datetime | timestamptz | the queried moment |
| purpose | text | e.g. 事业/出行/感情 |
| hour_stem | text | 时干 |
| day_stem | text | 日干 |
| month_stem | text | 月干 |
| year_stem | text | 年干 |
| duty_chief | text | 值符 |
| created_at | timestamptz | default now() |

## palaces
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | nullable |
| chart_id | uuid FK → charts | cascade delete |
| position | smallint | 1–9 (Luoshu order) |
| direction | text | 坎/坤/震/巽/中/乾/兑/艮/离 |
| heavenly_stem | text | 天干 |
| eight_gate | text | 八门 |
| eight_deity | text | 八神 |
| eight_star | text | 八星 |
| is_void | boolean | 空亡 |
| created_at | timestamptz | |

## forecast_notes
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | nullable |
| chart_id | uuid FK → charts | |
| content | text | owner's reading text |
| source | text | 'owner' or 'ai' |
| confidence | numeric | AI fields only; null for owner |
| review_status | text | 'unreviewed'/'approved'/'rejected' |
| published | boolean | visible to anonymous visitors |
| created_at | timestamptz | |

## audit_logs
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | who acted |
| action | text | e.g. 'chart.create', 'note.publish' |
| entity_type | text | 'chart' / 'forecast_note' |
| entity_id | uuid | the affected row |
| payload | jsonb | before/after snapshot |
| created_at | timestamptz | |

## RLS
- All tables: permissive v1 policies (select/all = true) until Sprint 3
- Sprint 3: replace with `auth.uid() = user_id` for writes; reads stay open
