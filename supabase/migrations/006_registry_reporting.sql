-- 006_registry_reporting.sql

create table public.cap_table_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  holder_name text not null,
  share_class text not null,
  units numeric(18,4) not null default 0,
  ownership_pct numeric(7,4),
  source_document_id uuid references public.documents(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.esop_pools (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  pool_name text not null,
  allocated_units numeric(18,4) not null default 0,
  reserved_units numeric(18,4) not null default 0,
  created_at timestamptz not null default now()
);

create table public.issuer_reports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id),
  period_label text not null,
  status text not null default 'draft',
  content jsonb not null default '{}',
  submitted_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.use_of_funds_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id),
  category text not null,
  budget_kes numeric(18,2) not null default 0,
  actual_kes numeric(18,2) not null default 0,
  variance_note text,
  evidence_document_id uuid references public.documents(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger issuer_reports_updated_at
  before update on public.issuer_reports
  for each row execute function public.handle_updated_at();

alter table public.cap_table_entries enable row level security;
alter table public.esop_pools enable row level security;
alter table public.issuer_reports enable row level security;
alter table public.use_of_funds_items enable row level security;
