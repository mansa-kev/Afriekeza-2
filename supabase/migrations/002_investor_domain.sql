-- 002_investor_domain.sql

create type public.kyc_status as enum (
  'not_started', 'in_progress', 'submitted', 'under_review',
  'approved', 'action_required', 'rejected', 'expired'
);

create type public.suitability_status as enum (
  'not_started', 'in_progress', 'submitted', 'under_review',
  'approved', 'restricted', 'rejected'
);

create type public.investor_classification as enum (
  'beginner', 'retail', 'experienced', 'sophisticated', 'diaspora', 'institutional'
);

create table public.investor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  classification public.investor_classification,
  kyc_status public.kyc_status not null default 'not_started',
  suitability_status public.suitability_status not null default 'not_started',
  employment_status text,
  source_of_funds text,
  investment_experience text,
  investment_goals text,
  expected_ticket_size_kes numeric(18,2),
  liquidity_need text,
  kra_pin text,
  date_of_birth date,
  address_line text,
  city text,
  country_of_residence text default 'KE',
  risk_profile_label text,
  onboarding_step int not null default 0,
  terms_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.suitability_responses (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.investor_profiles(id) on delete cascade,
  question_key text not null,
  response_value text not null,
  created_at timestamptz not null default now()
);

create table public.risk_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.investor_profiles(id) on delete cascade,
  acknowledgement_key text not null,
  accepted_at timestamptz not null default now(),
  version text not null default '1.0'
);

create trigger investor_profiles_updated_at
  before update on public.investor_profiles
  for each row execute function public.handle_updated_at();

alter table public.investor_profiles enable row level security;
alter table public.suitability_responses enable row level security;
alter table public.risk_acknowledgements enable row level security;

create policy "Investors manage own profile"
  on public.investor_profiles for all
  using (auth.uid() = user_id);

create policy "Investors manage own suitability"
  on public.suitability_responses for all
  using (
    investor_id in (select id from public.investor_profiles where user_id = auth.uid())
  );

create policy "Investors manage own acknowledgements"
  on public.risk_acknowledgements for all
  using (
    investor_id in (select id from public.investor_profiles where user_id = auth.uid())
  );
