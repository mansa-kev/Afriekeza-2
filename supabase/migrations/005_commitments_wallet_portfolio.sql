-- 005_commitments_wallet_portfolio.sql

create type public.commitment_status as enum (
  'draft', 'pending_acknowledgement', 'pending_payment', 'paid',
  'allocated', 'cancelled', 'refunded'
);

create type public.transaction_type as enum (
  'deposit', 'withdrawal', 'commitment', 'repayment', 'fee', 'refund', 'adjustment'
);

create table public.wallet_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  available_balance_kes numeric(18,2) not null default 0,
  locked_balance_kes numeric(18,2) not null default 0,
  currency_display text not null default 'KES',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.commitments (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.investor_profiles(id) on delete restrict,
  opportunity_id uuid not null references public.opportunities(id) on delete restrict,
  amount_kes numeric(18,2) not null,
  status public.commitment_status not null default 'draft',
  acknowledgement_complete boolean not null default false,
  payment_reference text,
  allocated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolio_positions (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.investor_profiles(id) on delete restrict,
  opportunity_id uuid not null references public.opportunities(id) on delete restrict,
  commitment_id uuid references public.commitments(id),
  principal_kes numeric(18,2) not null,
  status text not null default 'active',
  allocated_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallet_accounts(id) on delete restrict,
  type public.transaction_type not null,
  amount_kes numeric(18,2) not null,
  reference text,
  status text not null default 'pending',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.repayments (
  id uuid primary key default gen_random_uuid(),
  position_id uuid not null references public.portfolio_positions(id) on delete restrict,
  amount_kes numeric(18,2) not null,
  due_date date,
  paid_at timestamptz,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);

alter table public.wallet_accounts enable row level security;
alter table public.commitments enable row level security;
alter table public.portfolio_positions enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.repayments enable row level security;

create policy "Investors view own wallet"
  on public.wallet_accounts for select
  using (auth.uid() = user_id);

create policy "Investors view own commitments"
  on public.commitments for select
  using (
    investor_id in (select id from public.investor_profiles where user_id = auth.uid())
  );

create policy "Investors view own positions"
  on public.portfolio_positions for select
  using (
    investor_id in (select id from public.investor_profiles where user_id = auth.uid())
  );
