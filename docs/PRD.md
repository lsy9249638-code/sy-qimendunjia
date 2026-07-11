# PRD — sy-qimendunjia

## Problem
No off-the-shelf tool plots a Qimen Dunjia hour chart exactly the way the owner needs and lets them annotate + publish forecasts under their own domain.

## Target user
The owner (solo). Anonymous visitors may read published charts and forecast notes.

## Core objects
| Object | Purpose |
|---|---|
| `charts` | One Qimen Dunjia chart per hour/query, with metadata |
| `palaces` | Nine palace cells per chart (stem, gate, deity, star) |
| `forecast_notes` | Owner's reading / AI-assisted suggestion attached to a chart |
| `audit_logs` | Record of every meaningful write action |

## MVP must-haves (v1)
- [ ] Enter a date + hour → compute and store a Qimen Dunjia chart in the DB
- [ ] Display the 9-palace grid (stem, gate, deity, star per cell)
- [ ] Owner can write/edit a forecast note on any chart
- [ ] Published notes visible to anonymous visitors
- [ ] 3 seeded demo charts visible on first load without login
- [ ] Owner login gates all create/edit/delete actions

## Non-goals (v1)
- Multi-user accounts / teams
- Paid access / subscriptions
- Batch chart generation
- AI suggestions (Sprint 4, after auth)
- Mobile app

## Success criterion
Owner opens the site, picks a date and hour, clicks **Plot chart**, sees the 3×3 palace grid populated with the correct stems/gates/deities/stars, writes a forecast note, publishes it, then visits the page as an anonymous browser tab and reads the note — all data persisted in Supabase, no refresh regression.
