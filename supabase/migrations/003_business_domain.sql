-- 003_business_domain.sql

create type public.company_status as enum (
  'draft', 'submitted', 'under_review', 'more_info_required',
  'ready_for_structuring', 'approved', 'rejected', 'deferred', 'active', 'inactive'
);

create type public.kyb_status as enum (
  'not_started', 'in_progress', 'submitted', 'under_review',
  'approved', 'action_required', 'rejected'
);

create type public.company_user_role as enum (
  'owner', 'finance_lead', 'admin', 'advisor', 'viewer'
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  trading_name text,
  registration_number text,
  kra_pin text,
  entity_type text,
  sector text,
  business_stage text,
  registered_address text,
  operating_locations text[],
  revenue_model text,
  status public.company_status not null default 'draft',
  kyb_status public.kyb_status not null default 'not_started',
  funding_readiness_status text not null default 'not_started',
  funding_readiness_score int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_users (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.company_user_role not null default 'owner',
  invitation_status text not null default 'accepted',
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create table public.directors (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  full_name text not null,
  id_number text,
  role_title text,
  ownership_pct numeric(5,2),
  verification_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.beneficial_owners (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  ownership_pct numeric(5,2),
  verification_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.raise_applications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  instrument text not null,
  amount_requested_kes numeric(18,2) not null,
  preferred_tenor_months int,
  use_of_funds jsonb not null default '[]',
  target_timeline text,
  repayment_notes text,
  status public.company_status not null default 'draft',
  submitted_at timestamptz,
  reviewer_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.funding_readiness_scores (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  category text not null,
  score int,
  status text not null,
  gaps text[],
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create trigger companies_updated_at
  before update on public.companies
  for each row execute function public.handle_updated_at();

create trigger raise_applications_updated_at
  before update on public.raise_applications
  for each row execute function public.handle_updated_at();

alter table public.companies enable row level security;
alter table public.company_users enable row level security;
alter table public.directors enable row level security;
alter table public.beneficial_owners enable row level security;
alter table public.raise_applications enable row level security;
alter table public.funding_readiness_scores enable row level security;

create policy "Company members access own company"
  on public.companies for select
  using (
    id in (select company_id from public.company_users where user_id = auth.uid())
  );

create policy "Company members manage company users"
  on public.company_users for select
  using (user_id = auth.uid() or company_id in (
    select company_id from public.company_users where user_id = auth.uid()
  ));
