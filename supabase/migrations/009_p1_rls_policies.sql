-- 009_p1_rls_policies.sql
-- Write policies and storage rules for P1 controlled pilot.

-- Helper: business user check
create or replace function public.is_business_user()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and 'business_user'::public.portal_role = any(portal_roles)
  );
$$;

create or replace function public.user_company_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select company_id from public.company_users where user_id = auth.uid();
$$;

-- Profiles: admins update any; users update own (already exists for update)
create policy "Admins update profiles"
  on public.profiles for update
  using (public.is_admin());

-- Investor profiles: admins review/update
create policy "Admins manage investor profiles"
  on public.investor_profiles for all
  using (public.is_admin());

-- Companies: members update own company
create policy "Company members update own company"
  on public.companies for update
  using (id in (select public.user_company_ids()));

create policy "Business users insert company"
  on public.companies for insert
  with check (public.is_business_user());

create policy "Admins manage companies"
  on public.companies for all
  using (public.is_admin());

-- Company users
create policy "Business users link self to company"
  on public.company_users for insert
  with check (user_id = auth.uid() and public.is_business_user());

create policy "Admins manage company users"
  on public.company_users for all
  using (public.is_admin());

-- Directors & beneficial owners
create policy "Company members manage directors"
  on public.directors for all
  using (company_id in (select public.user_company_ids()));

create policy "Company members manage beneficial owners"
  on public.beneficial_owners for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins read directors"
  on public.directors for select using (public.is_admin());

create policy "Admins read beneficial owners"
  on public.beneficial_owners for select using (public.is_admin());

-- Raise applications
create policy "Company members manage raise applications"
  on public.raise_applications for all
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage raise applications"
  on public.raise_applications for all
  using (public.is_admin());

-- Funding readiness
create policy "Company members read funding readiness"
  on public.funding_readiness_scores for select
  using (company_id in (select public.user_company_ids()));

create policy "Admins manage funding readiness"
  on public.funding_readiness_scores for all
  using (public.is_admin());

-- Documents
create policy "Owners read own documents"
  on public.documents for select
  using (
    (owner_type = 'investor' and owner_id = auth.uid())
    or (owner_type = 'company' and owner_id in (select public.user_company_ids()))
    or (owner_type = 'opportunity' and exists (
      select 1 from public.opportunities o
      where o.id = documents.owner_id
      and o.status in ('coming_soon', 'open', 'closing_soon', 'fully_subscribed', 'closed', 'reporting', 'repaid')
    ))
    or public.is_admin()
  );

create policy "Users insert own documents"
  on public.documents for insert
  with check (
    uploaded_by = auth.uid()
    and (
      (owner_type = 'investor' and owner_id = auth.uid())
      or (owner_type = 'company' and owner_id in (select public.user_company_ids()))
    )
  );

create policy "Users update own draft documents"
  on public.documents for update
  using (
    uploaded_by = auth.uid()
    and status in ('draft', 'uploaded')
  );

create policy "Admins manage documents"
  on public.documents for all
  using (public.is_admin());

-- Opportunities
create policy "Admins manage opportunities"
  on public.opportunities for all
  using (public.is_admin());

create policy "Admins manage opportunity documents"
  on public.opportunity_documents for all
  using (public.is_admin());

-- Support tickets: users create
create policy "Users create support tickets"
  on public.support_tickets for insert
  with check (auth.uid() = user_id);

create policy "Admins manage support tickets"
  on public.support_tickets for all
  using (public.is_admin());

-- Audit: authenticated users can append via RPC (function is security definer)
grant execute on function public.log_audit_event(uuid, text, uuid, text, jsonb, jsonb, text) to authenticated;

create unique index if not exists suitability_responses_investor_question_idx
  on public.suitability_responses (investor_id, question_key);

create unique index if not exists risk_acknowledgements_investor_key_idx
  on public.risk_acknowledgements (investor_id, acknowledgement_key);

-- Storage policies for documents bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  52428800,
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
)
on conflict (id) do nothing;

create policy "Authenticated upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users read own storage objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

create policy "Users update own storage objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Admins full storage access"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'documents' and public.is_admin());
