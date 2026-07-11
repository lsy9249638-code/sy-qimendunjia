create table if not exists charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  chart_datetime timestamptz not null,
  purpose text,
  hour_stem text,
  day_stem text,
  month_stem text,
  year_stem text,
  duty_chief text,
  created_at timestamptz not null default now()
);

alter table charts enable row level security;
drop policy if exists "charts_v1_read" on charts;
create policy "charts_v1_read" on charts for select using (true);
drop policy if exists "charts_v1_write" on charts;
create policy "charts_v1_write" on charts for all using (true) with check (true);

create table if not exists palaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  chart_id uuid not null references charts(id) on delete cascade,
  position smallint not null check (position between 1 and 9),
  direction text,
  heavenly_stem text,
  eight_gate text,
  eight_deity text,
  eight_star text,
  is_void boolean default false,
  created_at timestamptz not null default now()
);

alter table palaces enable row level security;
drop policy if exists "palaces_v1_read" on palaces;
create policy "palaces_v1_read" on palaces for select using (true);
drop policy if exists "palaces_v1_write" on palaces;
create policy "palaces_v1_write" on palaces for all using (true) with check (true);

create table if not exists forecast_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  chart_id uuid not null references charts(id) on delete cascade,
  content text not null,
  source text default 'owner',
  confidence numeric,
  review_status text default 'unreviewed',
  published boolean default false,
  created_at timestamptz not null default now()
);

alter table forecast_notes enable row level security;
drop policy if exists "forecast_notes_v1_read" on forecast_notes;
create policy "forecast_notes_v1_read" on forecast_notes for select using (true);
drop policy if exists "forecast_notes_v1_write" on forecast_notes;
create policy "forecast_notes_v1_write" on forecast_notes for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb,
  created_at timestamptz not null default now()
);

alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into charts (id, title, chart_datetime, purpose, hour_stem, day_stem, month_stem, year_stem, duty_chief) values
  ('a1000000-0000-0000-0000-000000000001', '2025-06-01 午时盘', '2025-06-01 12:00:00+08', '事业决策', '甲', '庚', '壬', '乙', '值符'),
  ('a1000000-0000-0000-0000-000000000002', '2025-05-15 子时盘', '2025-05-15 00:00:00+08', '出行方向', '戊', '丙', '辛', '乙', '腾蛇'),
  ('a1000000-0000-0000-0000-000000000003', '2025-04-20 卯时盘', '2025-04-20 06:00:00+08', '感情测算', '乙', '己', '庚', '甲', '太阴');

insert into palaces (chart_id, position, direction, heavenly_stem, eight_gate, eight_deity, eight_star) values
  ('a1000000-0000-0000-0000-000000000001', 1, '坎', '戊', '休门', '值符', '天蓬'),
  ('a1000000-0000-0000-0000-000000000001', 2, '坤', '己', '死门', '螣蛇', '天芮'),
  ('a1000000-0000-0000-0000-000000000001', 3, '震', '庚', '伤门', '太阴', '天冲'),
  ('a1000000-0000-0000-0000-000000000001', 4, '巽', '辛', '杜门', '六合', '天辅'),
  ('a1000000-0000-0000-0000-000000000001', 5, '中', '戊', '中宫', '勾陈', '天禽'),
  ('a1000000-0000-0000-0000-000000000001', 6, '乾', '壬', '开门', '朱雀', '天心'),
  ('a1000000-0000-0000-0000-000000000001', 7, '兑', '癸', '惊门', '九地', '天柱'),
  ('a1000000-0000-0000-0000-000000000001', 8, '艮', '丙', '生门', '九天', '天任'),
  ('a1000000-0000-0000-0000-000000000001', 9, '离', '丁', '景门', '值使', '天英'),
  ('a1000000-0000-0000-0000-000000000002', 1, '坎', '癸', '死门', '九地', '天芮'),
  ('a1000000-0000-0000-0000-000000000002', 2, '坤', '丁', '惊门', '九天', '天柱'),
  ('a1000000-0000-0000-0000-000000000002', 3, '震', '壬', '开门', '值符', '天心'),
  ('a1000000-0000-0000-0000-000000000002', 4, '巽', '丙', '生门', '螣蛇', '天任'),
  ('a1000000-0000-0000-0000-000000000002', 5, '中', '戊', '中宫', '太阴', '天禽'),
  ('a1000000-0000-0000-0000-000000000002', 6, '乾', '庚', '伤门', '六合', '天冲'),
  ('a1000000-0000-0000-0000-000000000002', 7, '兑', '辛', '杜门', '勾陈', '天辅'),
  ('a1000000-0000-0000-0000-000000000002', 8, '艮', '戊', '休门', '朱雀', '天蓬'),
  ('a1000000-0000-0000-0000-000000000002', 9, '离', '己', '景门', '值使', '天英'),
  ('a1000000-0000-0000-0000-000000000003', 1, '坎', '丙', '生门', '六合', '天任'),
  ('a1000000-0000-0000-0000-000000000003', 2, '坤', '戊', '休门', '勾陈', '天蓬'),
  ('a1000000-0000-0000-0000-000000000003', 3, '震', '己', '死门', '朱雀', '天芮'),
  ('a1000000-0000-0000-0000-000000000003', 4, '巽', '庚', '惊门', '值符', '天柱'),
  ('a1000000-0000-0000-0000-000000000003', 5, '中', '戊', '中宫', '螣蛇', '天禽'),
  ('a1000000-0000-0000-0000-000000000003', 6, '乾', '辛', '开门', '太阴', '天心'),
  ('a1000000-0000-0000-0000-000000000003', 7, '兑', '壬', '景门', '九地', '天英'),
  ('a1000000-0000-0000-0000-000000000003', 8, '艮', '癸', '伤门', '九天', '天冲'),
  ('a1000000-0000-0000-0000-000000000003', 9, '离', '丁', '杜门', '值使', '天辅');

insert into forecast_notes (chart_id, content, source, confidence, review_status, published) values
  ('a1000000-0000-0000-0000-000000000001', '值符临休门，生门出现在艮宫，主事业有贵人相助，宜在午时后行动。', 'owner', null, 'approved', true),
  ('a1000000-0000-0000-0000-000000000002', '开门临震宫，出行宜向东方，忌西南方向，九地临坎有阻隔。', 'owner', null, 'approved', true),
  ('a1000000-0000-0000-0000-000000000003', '六合生门主感情顺利，太阴开门利暗中谋划，感情宜缓不宜急。', 'owner', null, 'approved', true);