-- 011_p2_operational.sql
-- P2 operational platform: wallet ops, registry, reporting, notifications.

create or replace function public.send_notification(
  p_user_id uuid,
  p_title text,
  p_body text,
  p_link text default null
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
begin
  insert into public.notifications (user_id, title, body, link)
  values (p_user_id, p_title, p_body, p_link)
  returning id into v_id;
  return v_id;
end;
$$;

grant execute on function public.send_notification(uuid, text, text, text) to authenticated;

create or replace function public.credit_wallet_from_deposit(
  p_transaction_id uuid
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_tx record;
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  select wt.id, wt.wallet_id, wt.amount_kes, wt.status, wt.type, wa.user_id
  into v_tx
  from public.wallet_transactions wt
  join public.wallet_accounts wa on wa.id = wt.wallet_id
  where wt.id = p_transaction_id
  for update;

  if v_tx.id is null then
    raise exception 'transaction not found';
  end if;

  if v_tx.status <> 'pending' or v_tx.type <> 'deposit' then
    raise exception 'invalid transaction state';
  end if;

  update public.wallet_accounts
  set available_balance_kes = available_balance_kes + v_tx.amount_kes
  where id = v_tx.wallet_id;

  update public.wallet_transactions
  set status = 'completed'
  where id = p_transaction_id;

  perform public.send_notification(
    v_tx.user_id,
    'Deposit confirmed',
    'KES ' || v_tx.amount_kes::text || ' has been credited to your wallet.',
    '/investor/wallet'
  );
end;
$$;

grant execute on function public.credit_wallet_from_deposit(uuid) to authenticated;

create policy "Company members manage cap table"
  on public.cap_table_entries for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage cap table"
  on public.cap_table_entries for all
  using (public.is_admin());

create policy "Company members manage esop pools"
  on public.esop_pools for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage esop pools"
  on public.esop_pools for all
  using (public.is_admin());

create policy "Company members manage use of funds"
  on public.use_of_funds_items for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage use of funds"
  on public.use_of_funds_items for all
  using (public.is_admin());

create policy "Company members manage issuer reports"
  on public.issuer_reports for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage issuer reports"
  on public.issuer_reports for all
  using (public.is_admin());

create policy "Investors read published issuer reports"
  on public.issuer_reports for select
  using (
    published_at is not null
    and (
      opportunity_id is null
      or opportunity_id in (
        select pp.opportunity_id from public.portfolio_positions pp
        join public.investor_profiles ip on ip.id = pp.investor_id
        where ip.user_id = auth.uid()
      )
    )
  );

create policy "Admins manage wallets"
  on public.wallet_accounts for update
  using (public.is_admin());

create policy "Investors update own wallet"
  on public.wallet_accounts for update
  using (auth.uid() = user_id);

create policy "Investors insert own wallet transactions"
  on public.wallet_transactions for insert
  with check (
    wallet_id in (select id from public.wallet_accounts where user_id = auth.uid())
  );

create policy "Admins manage wallet transactions"
  on public.wallet_transactions for all
  using (public.is_admin());

create policy "Users update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Admins update documents for review"
  on public.documents for update
  using (public.is_admin());
