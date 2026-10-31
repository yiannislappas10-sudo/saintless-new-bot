-- ECHO collaboration and access control
-- Run this entire file in Supabase Dashboard > SQL Editor.
-- The account yiannislappas8@gmail.com is the sole ECHO owner.
-- That account alone can grant or revoke professor permissions.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'ECHO user',
  role text not null default 'student' check (role in ('student', 'professor')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_echo_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'ECHO user'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_echo on auth.users;
create trigger on_auth_user_created_echo
after insert on auth.users
for each row execute procedure public.handle_new_echo_user();

insert into public.profiles (id, display_name)
select
  u.id,
  coalesce(
    nullif(u.raw_user_meta_data->>'full_name', ''),
    nullif(u.raw_user_meta_data->>'name', ''),
    nullif(split_part(coalesce(u.email, ''), '@', 1), ''),
    'ECHO user'
  )
from auth.users u
on conflict (id) do nothing;

create or replace function public.is_echo_owner()
returns boolean
language sql
stable
security definer
set search_path = auth, public, pg_temp
as $
  select exists (
    select 1
    from auth.users u
    where u.id = auth.uid()
      and lower(coalesce(u.email, '')) in (
        'yiannislappas8@gmail.com',
        'yiannislappas10@gmail.com'
      )
  );
$;

create or replace function public.is_echo_professor(target_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $
  select exists (
    select 1
    from auth.users u
    left join public.profiles p on p.id = u.id
    where u.id = target_id
      and (
        p.role = 'professor'
        or lower(coalesce(u.email, '')) in (
          'yiannislappas8@gmail.com',
          'yiannislappas10@gmail.com'
        )
      )
  );
$;

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 120),
  body text not null check (char_length(trim(body)) between 1 and 6000),
  published boolean not null default true,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index if not exists announcements_created_at_idx
  on public.announcements (created_at desc);

create table if not exists public.private_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  constraint private_messages_no_self_message check (sender_id <> recipient_id)
);

create index if not exists private_messages_sender_created_idx
  on public.private_messages (sender_id, created_at);
create index if not exists private_messages_recipient_created_idx
  on public.private_messages (recipient_id, created_at);

alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.private_messages enable row level security;

drop policy if exists "ECHO profiles are visible to their owner and teaching staff" on public.profiles;
create policy "ECHO profiles are visible to their owner and teaching staff"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.is_echo_professor(id)
  or public.is_echo_professor()
  or public.is_echo_owner()
);

drop policy if exists "ECHO users can read published announcements" on public.announcements;
create policy "ECHO users can read published announcements"
on public.announcements
for select
to authenticated
using (published = true or public.is_echo_professor());

drop policy if exists "ECHO professors can publish announcements" on public.announcements;
create policy "ECHO professors can publish announcements"
on public.announcements
for insert
to authenticated
with check (
  public.is_echo_professor()
  and created_by = auth.uid()
);

drop policy if exists "ECHO professors can edit announcements" on public.announcements;
create policy "ECHO professors can edit announcements"
on public.announcements
for update
to authenticated
using (public.is_echo_professor())
with check (public.is_echo_professor());

drop policy if exists "ECHO professors can delete announcements" on public.announcements;
create policy "ECHO professors can delete announcements"
on public.announcements
for delete
to authenticated
using (public.is_echo_professor());

drop policy if exists "ECHO users can read their own private messages" on public.private_messages;
create policy "ECHO users can read their own private messages"
on public.private_messages
for select
to authenticated
using (sender_id = auth.uid() or recipient_id = auth.uid());

drop policy if exists "ECHO users can message their professor or students" on public.private_messages;
create policy "ECHO users can message their professor or students"
on public.private_messages
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and (
    (public.is_echo_professor() and not public.is_echo_professor(recipient_id))
    or
    (not public.is_echo_professor() and public.is_echo_professor(recipient_id))
  )
);

-- The owner-only RPC is the only permitted way to change account roles.
create or replace function public.set_echo_professor(target_user_id uuid, make_professor boolean)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.is_echo_owner() then
    raise exception 'Only the ECHO owner can change professor permissions.';
  end if;

  if target_user_id is null then
    raise exception 'A user must be selected.';
  end if;

  if exists (
    select 1 from auth.users u
    where u.id = target_user_id
      and lower(coalesce(u.email, '')) in (
        'yiannislappas8@gmail.com',
        'yiannislappas10@gmail.com'
      )
  ) then
    raise exception 'The ECHO owner account cannot be changed here.';
  end if;

  update public.profiles
  set role = case when make_professor then 'professor' else 'student' end
  where id = target_user_id;

  if not found then
    raise exception 'That ECHO account could not be found.';
  end if;
end;
$$;

-- Email addresses are exposed only through this owner-checked RPC,
-- not through the public profile table.
create or replace function public.get_echo_role_candidates()
returns table(user_id uuid, display_name text, email text, role text)
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.is_echo_owner() then
    raise exception 'Only the ECHO owner can view role management.';
  end if;

  return query
  select p.id, p.display_name, u.email::text, p.role
  from public.profiles p
  join auth.users u on u.id = p.id
  order by lower(coalesce(u.email, ''));
end;
$$;

revoke all on function public.is_echo_owner() from public;
revoke all on function public.is_echo_professor(uuid) from public;
revoke all on function public.set_echo_professor(uuid, boolean) from public;
revoke all on function public.get_echo_role_candidates() from public;

grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.announcements to authenticated;
grant select, insert on public.private_messages to authenticated;
grant execute on function public.is_echo_owner() to authenticated;
grant execute on function public.is_echo_professor(uuid) to authenticated;
grant execute on function public.set_echo_professor(uuid, boolean) to authenticated;
grant execute on function public.get_echo_role_candidates() to authenticated;

-- Private messages are refreshed by the ECHO client; no publication setup is required.

-- ECHO one-to-one audio calling.
-- Call state is changed only through the RPCs below. Audio is exchanged directly
-- between browsers using WebRTC; Supabase Realtime carries private signalling.

create table if not exists public.echo_calls (
  id uuid primary key default gen_random_uuid(),
  caller_id uuid not null references auth.users(id) on delete cascade,
  callee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'ringing'
    check (status in ('ringing', 'accepted', 'rejected', 'ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  ended_at timestamptz,
  constraint echo_calls_no_self_call check (caller_id <> callee_id)
);

create index if not exists echo_calls_callee_status_created_idx
  on public.echo_calls (callee_id, status, created_at desc);
create index if not exists echo_calls_caller_status_created_idx
  on public.echo_calls (caller_id, status, created_at desc);

alter table public.echo_calls enable row level security;

drop policy if exists "ECHO call participants can read calls" on public.echo_calls;
create policy "ECHO call participants can read calls"
on public.echo_calls
for select
to authenticated
using (caller_id = auth.uid() or callee_id = auth.uid());

revoke all on public.echo_calls from anon;
revoke insert, update, delete on public.echo_calls from authenticated;
grant select on public.echo_calls to authenticated;

create or replace function public.create_echo_call(target_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  new_call_id uuid;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to start a call.';
  end if;

  if target_user_id is null or target_user_id = auth.uid() then
    raise exception 'Choose another ECHO user to call.';
  end if;

  if not exists (select 1 from public.profiles p where p.id = target_user_id) then
    raise exception 'That ECHO account could not be found.';
  end if;

  if public.is_echo_professor(auth.uid()) = public.is_echo_professor(target_user_id) then
    raise exception 'Calls are available between a student and a professor.';
  end if;

  -- Serialize new calls for both participants and clear abandoned sessions.
  perform pg_advisory_xact_lock(
    hashtextextended(least(auth.uid()::text, target_user_id::text), 0)
  );
  perform pg_advisory_xact_lock(
    hashtextextended(greatest(auth.uid()::text, target_user_id::text), 0)
  );

  update public.echo_calls
  set status = 'ended', ended_at = now(), updated_at = now()
  where status in ('ringing', 'accepted')
    and (
      (status = 'ringing' and created_at < now() - interval '60 seconds')
      or
      (status = 'accepted' and updated_at < now() - interval '12 hours')
    );

  if exists (
    select 1 from public.echo_calls c
    where c.status in ('ringing', 'accepted')
      and (
        c.caller_id in (auth.uid(), target_user_id)
        or c.callee_id in (auth.uid(), target_user_id)
      )
  ) then
    raise exception 'One of these users is already in a call.';
  end if;

  insert into public.echo_calls (caller_id, callee_id)
  values (auth.uid(), target_user_id)
  returning id into new_call_id;

  return new_call_id;
end;
$$;

create or replace function public.accept_echo_call(target_call_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  update public.echo_calls
  set status = 'accepted', updated_at = now()
  where id = target_call_id
    and callee_id = auth.uid()
    and status = 'ringing'
    and created_at >= now() - interval '60 seconds';

  if not found then
    raise exception 'This incoming call is no longer available.';
  end if;
end;
$$;

create or replace function public.reject_echo_call(target_call_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  update public.echo_calls
  set status = 'rejected', ended_at = now(), updated_at = now()
  where id = target_call_id
    and callee_id = auth.uid()
    and status = 'ringing';

  if not found then
    raise exception 'This incoming call is no longer available.';
  end if;
end;
$$;

create or replace function public.end_echo_call(target_call_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  update public.echo_calls
  set status = 'ended', ended_at = now(), updated_at = now()
  where id = target_call_id
    and (caller_id = auth.uid() or callee_id = auth.uid())
    and status in ('ringing', 'accepted');

  if not found and not exists (
    select 1 from public.echo_calls c
    where c.id = target_call_id
      and (c.caller_id = auth.uid() or c.callee_id = auth.uid())
  ) then
    raise exception 'You are not a participant in this call.';
  end if;
end;
$$;

-- Only the caller and callee may subscribe to or broadcast on this call topic.
create or replace function public.is_echo_call_participant(_topic text)
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1
    from public.echo_calls c
    where _topic = 'echo-call:' || c.id::text
      and auth.uid() in (c.caller_id, c.callee_id)
  );
$$;

revoke all on function public.create_echo_call(uuid) from public;
revoke all on function public.accept_echo_call(uuid) from public;
revoke all on function public.reject_echo_call(uuid) from public;
revoke all on function public.end_echo_call(uuid) from public;
revoke all on function public.is_echo_call_participant(text) from public;

grant execute on function public.create_echo_call(uuid) to authenticated;
grant execute on function public.accept_echo_call(uuid) to authenticated;
grant execute on function public.reject_echo_call(uuid) to authenticated;
grant execute on function public.end_echo_call(uuid) to authenticated;
grant execute on function public.is_echo_call_participant(text) to authenticated;

drop policy if exists "ECHO call participants can receive call signals" on realtime.messages;
create policy "ECHO call participants can receive call signals"
on realtime.messages
for select
to authenticated
using (
  extension = 'broadcast'
  and public.is_echo_call_participant(realtime.topic())
);

drop policy if exists "ECHO call participants can send call signals" on realtime.messages;
create policy "ECHO call participants can send call signals"
on realtime.messages
for insert
to authenticated
with check (
  extension = 'broadcast'
  and public.is_echo_call_participant(realtime.topic())
);
