-- ---------------------------------------------------------------------------
-- Vegan Garden Berlin — submissions store
--
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
--
-- One table for all three stores rather than three tables: src/lib/store.ts is
-- generic over the store name, so a `store` column maps to it exactly and
-- there is one migration to maintain instead of three.
--
-- The typed columns are only the ones we sort, filter or update on. Everything
-- else lives in `data`, so adding a field to a reservation or an order is a
-- code change and never a migration.
-- ---------------------------------------------------------------------------

create table if not exists public.submissions (
  store      text        not null check (store in ('reservations', 'orders', 'newsletter')),
  id         text        not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  status     text        not null default 'new',
  data       jsonb       not null default '{}'::jsonb,

  primary key (store, id)
);

-- The admin inbox reads one store at a time, newest first.
create index if not exists submissions_store_created_idx
  on public.submissions (store, created_at desc);

-- ---------------------------------------------------------------------------
-- Access
--
-- RLS is on and **no policy is defined on purpose**. That denies every request
-- made with the anon key, which is the one that could ever reach a browser.
-- The server uses the service-role key, which bypasses RLS.
--
-- This matters: these rows hold guest names, phone numbers, e-mail addresses
-- and delivery addresses. They must never be readable from the client.
-- ---------------------------------------------------------------------------
alter table public.submissions enable row level security;
