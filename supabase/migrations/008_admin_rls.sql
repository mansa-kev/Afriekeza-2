-- 008_admin_rls.sql
-- Run after all tables exist. Grants admin roles broad read access.
-- Assign admin roles via: update profiles set portal_roles = array['super_admin']::portal_role[] where email = '...';

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and portal_roles && array[
      'admin'::public.portal_role,
      'super_admin'::public.portal_role,
      'compliance_officer'::public.portal_role,
      'issuer_analyst'::public.portal_role,
      'investment_committee'::public.portal_role,
      'operations_manager'::public.portal_role,
      'support_agent'::public.portal_role,
      'auditor'::public.portal_role
    ]
  );
$$;

-- Admin read policies (extend per table as needed)
create policy "Admins read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins read investor profiles"
  on public.investor_profiles for select
  using (public.is_admin());

create policy "Admins read companies"
  on public.companies for select
  using (public.is_admin());

create policy "Admins read opportunities"
  on public.opportunities for select
  using (public.is_admin());

create policy "Admins read commitments"
  on public.commitments for select
  using (public.is_admin());

create policy "Admins read audit events"
  on public.audit_events for select
  using (public.is_admin());

create policy "Admins read support tickets"
  on public.support_tickets for select
  using (public.is_admin());
