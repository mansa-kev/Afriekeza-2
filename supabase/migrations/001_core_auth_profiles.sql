-- 001_core_auth_profiles.sql
-- Run first. Extends Supabase auth.users with Afriekeza profiles and roles.

create extension if not exists "pgcrypto";

create type public.portal_role as enum (
  'investor',
  'business_user',
  'admin',
  'super_admin',
  'compliance_officer',
  'issuer_analyst',
  'investment_committee',
  'operations_manager',
  'support_agent',
  'content_manager',
  'auditor'
);

create type public.account_status as enum (
  'active',
  'pending',
  'restricted',
  'suspended',
  'closed'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  country_code text default 'KE',
  portal_roles public.portal_role[] not null default '{}',
  account_status public.account_status not null default 'pending',
  preferred_currency text not null default 'KES' check (preferred_currency in ('KES', 'USD')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.platform_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (key, value) values
  ('fx_rates', '{"kes_per_usd": 129}'),
  ('instruments', '["yield","revenue_backed","asset_backed","growth_note","future_equity"]')
on conflict (key) do nothing;

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
