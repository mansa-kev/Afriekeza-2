-- 010_p1_commitments_support.sql
-- Write policies for commitments, portfolio, wallet, repayments.

create policy "Investors create commitments"
  on public.commitments for insert
  with check (
    investor_id in (select id from public.investor_profiles where user_id = auth.uid())
  );

create policy "Investors update own commitments"
  on public.commitments for update
  using (
    investor_id in (select id from public.investor_profiles where user_id = auth.uid())
  );

create policy "Admins manage commitments"
  on public.commitments for all
  using (public.is_admin());

create policy "Admins manage portfolio positions"
  on public.portfolio_positions for all
  using (public.is_admin());

create policy "Investors create wallet"
  on public.wallet_accounts for insert
  with check (auth.uid() = user_id);

create policy "Admins read wallets"
  on public.wallet_accounts for select
  using (public.is_admin());

create policy "Investors view own transactions"
  on public.wallet_transactions for select
  using (
    wallet_id in (select id from public.wallet_accounts where user_id = auth.uid())
  );

create policy "Admins read wallet transactions"
  on public.wallet_transactions for select
  using (public.is_admin());

create policy "Investors view own repayments"
  on public.repayments for select
  using (
    position_id in (
      select id from public.portfolio_positions
      where investor_id in (
        select id from public.investor_profiles where user_id = auth.uid()
      )
    )
  );

create policy "Admins manage repayments"
  on public.repayments for all
  using (public.is_admin());

create policy "Users update own tickets"
  on public.support_tickets for update
  using (auth.uid() = user_id);
