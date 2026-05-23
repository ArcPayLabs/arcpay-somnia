alter table if exists public.arcpay_somnia_records
add column if not exists metadata jsonb not null default '{}'::jsonb;

create table if not exists public.arcpay_sui_records (
  id uuid primary key,
  owner text not null,
  type text not null,
  title text not null,
  status text not null,
  amount text,
  tx_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.arcpay_mantle_records (
  id uuid primary key,
  owner text not null,
  type text not null,
  title text not null,
  status text not null,
  amount text,
  tx_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.arcpay_arbitrum_records (
  id uuid primary key,
  owner text not null,
  type text not null,
  title text not null,
  status text not null,
  amount text,
  tx_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists arcpay_sui_records_owner_created_idx
on public.arcpay_sui_records (owner, created_at desc);

create index if not exists arcpay_mantle_records_owner_created_idx
on public.arcpay_mantle_records (owner, created_at desc);

create index if not exists arcpay_arbitrum_records_owner_created_idx
on public.arcpay_arbitrum_records (owner, created_at desc);

alter table public.arcpay_sui_records enable row level security;
alter table public.arcpay_mantle_records enable row level security;
alter table public.arcpay_arbitrum_records enable row level security;

drop policy if exists "Service role manages Sui records" on public.arcpay_sui_records;
drop policy if exists "Service role manages Mantle records" on public.arcpay_mantle_records;
drop policy if exists "Service role manages Arbitrum records" on public.arcpay_arbitrum_records;

create policy "Service role manages Sui records"
on public.arcpay_sui_records
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Service role manages Mantle records"
on public.arcpay_mantle_records
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Service role manages Arbitrum records"
on public.arcpay_arbitrum_records
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
