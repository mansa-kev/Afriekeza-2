-- 013_registry_mvp.sql — Afriekeza Registry checklist, scoring, subscriptions, review

create table public.readiness_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  category text not null,
  title text not null,
  description text,
  required boolean not null default true,
  weight int not null default 5,
  status text not null default 'not_started',
  admin_notes text,
  visible_to_company boolean not null default true,
  due_date date,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.readiness_score_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  overall_score int not null,
  category_scores jsonb not null default '{}',
  readiness_label text not null,
  calculated_at timestamptz not null default now()
);

create table public.reporting_tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  task_type text not null,
  title text not null,
  due_date date not null,
  status text not null default 'pending',
  linked_report_id uuid references public.issuer_reports(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shareholders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  shareholder_type text not null default 'individual',
  email text,
  verification_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.share_classes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  rights_description text,
  created_at timestamptz not null default now()
);

create table public.funding_rounds (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  round_type text not null,
  amount_kes numeric(18,2),
  valuation_kes numeric(18,2),
  closed_on date,
  notes text,
  created_at timestamptz not null default now()
);

create table public.registry_subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  plan_tier text not null default 'starter',
  status text not null default 'trial',
  billing_amount_kes numeric(18,2),
  billing_period text not null default 'monthly',
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id)
);

create table public.registry_admin_reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  reviewer_id uuid references public.profiles(id),
  decision text not null,
  notes text,
  visible_to_company boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.data_room_folders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  folder_type text not null,
  label text not null,
  parent_folder_id uuid references public.data_room_folders(id) on delete set null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (company_id, folder_type)
);

create trigger readiness_items_updated_at
  before update on public.readiness_items
  for each row execute function public.handle_updated_at();

create trigger reporting_tasks_updated_at
  before update on public.reporting_tasks
  for each row execute function public.handle_updated_at();

create trigger registry_subscriptions_updated_at
  before update on public.registry_subscriptions
  for each row execute function public.handle_updated_at();

alter table public.readiness_items enable row level security;
alter table public.readiness_score_snapshots enable row level security;
alter table public.reporting_tasks enable row level security;
alter table public.shareholders enable row level security;
alter table public.share_classes enable row level security;
alter table public.funding_rounds enable row level security;
alter table public.registry_subscriptions enable row level security;
alter table public.registry_admin_reviews enable row level security;
alter table public.data_room_folders enable row level security;

create policy "Company members manage readiness items"
  on public.readiness_items for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage readiness items"
  on public.readiness_items for all
  using (public.is_admin());

create policy "Company members read readiness snapshots"
  on public.readiness_score_snapshots for select
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage readiness snapshots"
  on public.readiness_score_snapshots for all
  using (public.is_admin());

create policy "Company members manage reporting tasks"
  on public.reporting_tasks for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage reporting tasks"
  on public.reporting_tasks for all
  using (public.is_admin());

create policy "Company members manage shareholders"
  on public.shareholders for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage shareholders"
  on public.shareholders for all
  using (public.is_admin());

create policy "Company members manage share classes"
  on public.share_classes for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage share classes"
  on public.share_classes for all
  using (public.is_admin());

create policy "Company members manage funding rounds"
  on public.funding_rounds for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage funding rounds"
  on public.funding_rounds for all
  using (public.is_admin());

create policy "Company members read registry subscriptions"
  on public.registry_subscriptions for select
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage registry subscriptions"
  on public.registry_subscriptions for all
  using (public.is_admin());

create policy "Company members read visible registry reviews"
  on public.registry_admin_reviews for select
  using (
    company_id in (select public.user_company_ids())
    and visible_to_company = true
  );

create policy "Admins manage registry reviews"
  on public.registry_admin_reviews for all
  using (public.is_admin());

create policy "Company members manage data room folders"
  on public.data_room_folders for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage data room folders"
  on public.data_room_folders for all
  using (public.is_admin());

create policy "Company members insert funding readiness"
  on public.funding_readiness_scores for insert
  with check (company_id in (select public.user_company_ids()));

create policy "Company members update funding readiness"
  on public.funding_readiness_scores for update
  using (company_id in (select public.user_company_ids()));
