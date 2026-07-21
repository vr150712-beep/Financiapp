-- Financiapp — Supabase schema
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run

create table if not exists profiles (
  id text primary key check (id in ('victor', 'partner')),
  name text not null,
  savings numeric not null default 0,
  color text not null,
  updated_at timestamptz not null default now()
);

insert into profiles (id, name, savings, color) values
  ('victor', 'Víctor', 0, '#38BDF8'),
  ('partner', 'Camila', 0, '#D4537E')
on conflict (id) do nothing;

create table if not exists income_sources (
  id uuid primary key default gen_random_uuid(),
  profile_id text not null references profiles(id) on delete cascade,
  name text not null,
  amount numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null references profiles(id),
  label text not null,
  amount numeric not null,
  category text not null,
  shared boolean not null default false,
  my_part numeric not null default 0,
  other_part numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  amount numeric not null,
  months integer not null,
  note text,
  created_at timestamptz not null default now()
);

-- Row Level Security: enabled, but permissive. Access to the app itself is
-- gated client-side by a shared PIN (see src/components/PinGate.tsx) — the
-- anon/publishable key used by the client has no per-user identity to scope
-- policies against, so these policies just allow the app to function.
alter table profiles enable row level security;
alter table income_sources enable row level security;
alter table expenses enable row level security;
alter table projects enable row level security;

create policy "public read/write profiles" on profiles for all using (true) with check (true);
create policy "public read/write income_sources" on income_sources for all using (true) with check (true);
create policy "public read/write expenses" on expenses for all using (true) with check (true);
create policy "public read/write projects" on projects for all using (true) with check (true);
