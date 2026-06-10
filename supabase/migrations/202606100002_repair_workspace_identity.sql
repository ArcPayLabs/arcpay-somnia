create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'Founder / finance lead',
  notification_email text not null default '',
  wallet_label text not null default 'Somnia operations wallet',
  linked_wallet_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles
  add column if not exists display_name text not null default '',
  add column if not exists role text not null default 'Founder / finance lead',
  add column if not exists notification_email text not null default '',
  add column if not exists wallet_label text not null default 'Somnia operations wallet',
  add column if not exists linked_wallet_address text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.user_workspace_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  workspace_name text not null default 'Somnia agent treasury',
  default_network text not null default 'somnia',
  email_notifications boolean not null default true,
  risk_alerts boolean not null default true,
  auto_yield_sweeps boolean not null default false,
  require_wallet_for_actions boolean not null default true,
  enabled_integrations jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_workspace_settings
  add column if not exists workspace_name text not null default 'Somnia agent treasury',
  add column if not exists default_network text not null default 'somnia',
  add column if not exists email_notifications boolean not null default true,
  add column if not exists risk_alerts boolean not null default true,
  add column if not exists auto_yield_sweeps boolean not null default false,
  add column if not exists require_wallet_for_actions boolean not null default true,
  add column if not exists enabled_integrations jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.user_policy_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_policy_settings
  add column if not exists settings jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists user_profiles_user_id_uidx on public.user_profiles (user_id);
create unique index if not exists user_workspace_settings_user_id_uidx on public.user_workspace_settings (user_id);
create unique index if not exists user_policy_settings_user_id_uidx on public.user_policy_settings (user_id);

alter table public.user_profiles enable row level security;
alter table public.user_workspace_settings enable row level security;
alter table public.user_policy_settings enable row level security;
alter table public.arcpay_workspaces enable row level security;

grant select, insert, update, delete on public.user_profiles to authenticated;
grant select, insert, update, delete on public.user_workspace_settings to authenticated;
grant select, insert, update, delete on public.user_policy_settings to authenticated;
grant select, insert, update, delete on public.arcpay_workspaces to authenticated;

drop policy if exists "Users can manage own profiles" on public.user_profiles;
create policy "Users can manage own profiles"
  on public.user_profiles for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage own workspace settings" on public.user_workspace_settings;
create policy "Users can manage own workspace settings"
  on public.user_workspace_settings for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage own policy settings" on public.user_policy_settings;
create policy "Users can manage own policy settings"
  on public.user_policy_settings for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can read own arcpay workspaces" on public.arcpay_workspaces;
drop policy if exists "Users can insert own arcpay workspaces" on public.arcpay_workspaces;
drop policy if exists "Users can update own arcpay workspaces" on public.arcpay_workspaces;
drop policy if exists "Users can delete own arcpay workspaces" on public.arcpay_workspaces;
drop policy if exists "Users can manage own arcpay workspaces" on public.arcpay_workspaces;

create policy "Users can manage own arcpay workspaces"
  on public.arcpay_workspaces for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
