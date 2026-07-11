# Security

## Secret handling
- `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` live in Vercel environment variables only
- Next.js server routes (`/api/*`) are the only callers — never exposed to the browser
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is anon-safe; used client-side only for reads

## Permission model
- **v1 (demo):** permissive RLS — anyone can read, anyone can write (seed data visible without login)
- **Sprint 3 lock-down:** writes require `auth.uid() = user_id`; reads remain open for published content
- Owner is the sole Supabase Auth user; no team/member tables needed

## Approved-tools rule
- Agent actions must call named server-side tools (listed in AGENTIC_LAYER.md) only
- No `eval`, no `run_any`, no raw SQL from the client
- Every tool call that mutates data writes an `audit_logs` row

## Audit principle
- Every create / update / delete / publish / AI-suggest action is logged with `user_id`, `action`, entity reference, and a before/after payload snapshot
- Logs are append-only; no delete policy on `audit_logs`

## Honest caveats
- Until Sprint 3 is merged, **do not store sensitive personal data** — the DB is effectively public
- If deploying to a public domain before Sprint 3, add a Vercel password protection layer as a stopgap
