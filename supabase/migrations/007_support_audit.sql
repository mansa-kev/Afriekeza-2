-- 007_support_audit.sql

create type public.ticket_status as enum (
  'open', 'in_progress', 'waiting_on_user', 'resolved', 'closed'
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  portal text not null,
  category text not null,
  subject text not null,
  body text not null,
  status public.ticket_status not null default 'open',
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Append-only audit log
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  previous_state jsonb,
  new_state jsonb,
  note text,
  ip_address inet,
  created_at timestamptz not null default now()
);

create or replace function public.prevent_audit_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'audit_events is append-only';
end;
$$;

create trigger audit_events_no_update
  before update or delete on public.audit_events
  for each row execute function public.prevent_audit_mutation();

create or replace function public.log_audit_event(
  p_actor_id uuid,
  p_entity_type text,
  p_entity_id uuid,
  p_action text,
  p_previous_state jsonb default null,
  p_new_state jsonb default null,
  p_note text default null
) returns uuid language plpgsql security definer as $$
declare
  v_id uuid;
begin
  insert into public.audit_events (
    actor_id, entity_type, entity_id, action, previous_state, new_state, note
  ) values (
    p_actor_id, p_entity_type, p_entity_id, p_action, p_previous_state, p_new_state, p_note
  ) returning id into v_id;
  return v_id;
end;
$$;

alter table public.support_tickets enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_events enable row level security;

create policy "Users view own tickets"
  on public.support_tickets for select
  using (auth.uid() = user_id);

create policy "Users view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);
