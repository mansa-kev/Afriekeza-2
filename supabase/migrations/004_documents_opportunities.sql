-- 004_documents_opportunities.sql

create type public.document_status as enum (
  'draft', 'uploaded', 'under_review', 'approved', 'rejected', 'expired'
);

create type public.opportunity_status as enum (
  'draft', 'internal_review', 'issuer_approval', 'approved', 'coming_soon',
  'open', 'closing_soon', 'fully_subscribed', 'closed', 'reporting', 'repaid', 'delayed', 'defaulted'
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('investor', 'company', 'opportunity', 'platform')),
  owner_id uuid not null,
  category text not null,
  file_name text not null,
  storage_path text,
  version int not null default 1,
  status public.document_status not null default 'draft',
  uploaded_by uuid references public.profiles(id),
  reviewed_by uuid references public.profiles(id),
  expiry_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete restrict,
  raise_application_id uuid references public.raise_applications(id),
  slug text not null unique,
  title text not null,
  instrument text not null,
  status public.opportunity_status not null default 'draft',
  target_raise_kes numeric(18,2) not null,
  minimum_investment_kes numeric(18,2) not null,
  tenor_months int,
  target_return_pct numeric(6,3),
  repayment_frequency text,
  risk_label text,
  suitability_level text,
  sector text,
  location text,
  plain_summary text,
  what_you_own text,
  closing_date date,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.opportunity_documents (
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  primary key (opportunity_id, document_id)
);

create trigger documents_updated_at
  before update on public.documents
  for each row execute function public.handle_updated_at();

create trigger opportunities_updated_at
  before update on public.opportunities
  for each row execute function public.handle_updated_at();

alter table public.documents enable row level security;
alter table public.opportunities enable row level security;
alter table public.opportunity_documents enable row level security;

create policy "Published opportunities visible to authenticated users"
  on public.opportunities for select
  to authenticated
  using (status in ('coming_soon', 'open', 'closing_soon', 'fully_subscribed', 'closed', 'reporting', 'repaid'));
