-- 012_payments_p3.sql
-- Unified payment intents (M-Pesa, card, crypto) + P3 scale tables.

create type public.payment_provider as enum ('mpesa', 'card', 'crypto', 'wallet');

create type public.payment_purpose as enum ('wallet_deposit', 'commitment_payment');

create type public.payment_intent_status as enum (
  'created', 'pending', 'processing', 'requires_action',
  'succeeded', 'failed', 'cancelled', 'refunded'
);

create table public.payment_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  purpose public.payment_purpose not null,
  provider public.payment_provider not null,
  amount_kes numeric(18,2) not null,
  amount_usd numeric(18,2),
  currency text not null default 'KES',
  status public.payment_intent_status not null default 'created',
  external_id text,
  idempotency_key text unique,
  commitment_id uuid references public.commitments(id) on delete set null,
  wallet_transaction_id uuid references public.wallet_transactions(id) on delete set null,
  payment_data jsonb not null default '{}',
  provider_response jsonb,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider public.payment_provider not null,
  external_event_id text not null,
  payload jsonb not null,
  payment_intent_id uuid references public.payment_intents(id) on delete set null,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, external_event_id)
);

create trigger payment_intents_updated_at
  before update on public.payment_intents
  for each row execute function public.handle_updated_at();

-- Auto-settle succeeded payment intents
create or replace function public.settle_payment_intent(p_intent_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_intent record;
  v_wallet_id uuid;
begin
  select * into v_intent
  from public.payment_intents
  where id = p_intent_id
  for update;

  if v_intent.id is null then
    raise exception 'payment intent not found';
  end if;

  if v_intent.status = 'succeeded' then
    return;
  end if;

  update public.payment_intents
  set status = 'succeeded', completed_at = now()
  where id = p_intent_id;

  if v_intent.purpose = 'wallet_deposit' then
    select id into v_wallet_id
    from public.wallet_accounts
    where user_id = v_intent.user_id;

    if v_wallet_id is null then
      insert into public.wallet_accounts (user_id)
      values (v_intent.user_id)
      returning id into v_wallet_id;
    end if;

    if v_intent.wallet_transaction_id is null then
      insert into public.wallet_transactions (
        wallet_id, type, amount_kes, reference, status, metadata
      ) values (
        v_wallet_id, 'deposit', v_intent.amount_kes,
        coalesce(v_intent.external_id, v_intent.id::text),
        'completed',
        jsonb_build_object('payment_intent_id', v_intent.id, 'provider', v_intent.provider)
      )
      returning id into v_intent.wallet_transaction_id;

      update public.payment_intents
      set wallet_transaction_id = v_intent.wallet_transaction_id
      where id = p_intent_id;
    else
      update public.wallet_transactions
      set status = 'completed',
          reference = coalesce(v_intent.external_id, reference)
      where id = v_intent.wallet_transaction_id;
    end if;

    update public.wallet_accounts
    set available_balance_kes = available_balance_kes + v_intent.amount_kes
    where id = v_wallet_id;

    perform public.send_notification(
      v_intent.user_id,
      'Deposit confirmed',
      'KES ' || v_intent.amount_kes::text || ' has been credited to your wallet.',
      '/investor/wallet'
    );

  elsif v_intent.purpose = 'commitment_payment' and v_intent.commitment_id is not null then
    update public.commitments
    set status = 'paid',
        payment_reference = coalesce(v_intent.external_id, 'pi:' || v_intent.id::text)
    where id = v_intent.commitment_id
    and status = 'pending_payment';

    perform public.send_notification(
      v_intent.user_id,
      'Payment confirmed',
      'Your commitment payment was received and is ready for allocation.',
      '/investor/portfolio'
    );
  end if;
end;
$$;

grant execute on function public.settle_payment_intent(uuid) to service_role;

-- P3: tax statements
create table public.tax_statements (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.investor_profiles(id) on delete cascade,
  tax_year int not null,
  currency text not null default 'KES',
  total_income_kes numeric(18,2) not null default 0,
  total_withholding_kes numeric(18,2) not null default 0,
  summary text,
  document_id uuid references public.documents(id),
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (investor_id, tax_year, currency)
);

-- P3: secondary market
create table public.secondary_market_listings (
  id uuid primary key default gen_random_uuid(),
  position_id uuid not null references public.portfolio_positions(id) on delete restrict,
  seller_investor_id uuid not null references public.investor_profiles(id) on delete restrict,
  asking_amount_kes numeric(18,2) not null,
  status text not null default 'draft',
  window_opens_at timestamptz,
  window_closes_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger secondary_market_listings_updated_at
  before update on public.secondary_market_listings
  for each row execute function public.handle_updated_at();

-- P3: group investing
create table public.investment_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  leader_user_id uuid not null references public.profiles(id) on delete restrict,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  target_amount_kes numeric(18,2) not null,
  status text not null default 'forming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.investment_group_members (
  group_id uuid not null references public.investment_groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  pledged_amount_kes numeric(18,2) not null default 0,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create trigger investment_groups_updated_at
  before update on public.investment_groups
  for each row execute function public.handle_updated_at();

-- RLS
alter table public.payment_intents enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.tax_statements enable row level security;
alter table public.secondary_market_listings enable row level security;
alter table public.investment_groups enable row level security;
alter table public.investment_group_members enable row level security;

create policy "Users view own payment intents"
  on public.payment_intents for select
  using (auth.uid() = user_id);

create policy "Users create own payment intents"
  on public.payment_intents for insert
  with check (auth.uid() = user_id);

create policy "Users update own payment intents"
  on public.payment_intents for update
  using (auth.uid() = user_id);

create policy "Admins manage payment intents"
  on public.payment_intents for all
  using (public.is_admin());

create policy "Admins read webhook events"
  on public.payment_webhook_events for select
  using (public.is_admin());

create policy "Investors view own tax statements"
  on public.tax_statements for select
  using (
    investor_id in (select id from public.investor_profiles where user_id = auth.uid())
  );

create policy "Admins manage tax statements"
  on public.tax_statements for all
  using (public.is_admin());

create policy "Investors view secondary listings"
  on public.secondary_market_listings for select
  to authenticated
  using (status in ('open', 'matched', 'closed'));

create policy "Sellers manage own listings"
  on public.secondary_market_listings for all
  using (
    seller_investor_id in (select id from public.investor_profiles where user_id = auth.uid())
  );

create policy "Admins manage secondary listings"
  on public.secondary_market_listings for all
  using (public.is_admin());

create policy "Members view investment groups"
  on public.investment_groups for select
  to authenticated
  using (true);

create policy "Leaders manage own groups"
  on public.investment_groups for all
  using (leader_user_id = auth.uid());

create policy "Admins manage investment groups"
  on public.investment_groups for all
  using (public.is_admin());

create policy "Group members view membership"
  on public.investment_group_members for select
  to authenticated
  using (true);

create policy "Users join groups"
  on public.investment_group_members for insert
  with check (auth.uid() = user_id);

create policy "Users update own pledge"
  on public.investment_group_members for update
  using (auth.uid() = user_id);

create policy "Admins manage group members"
  on public.investment_group_members for all
  using (public.is_admin());
