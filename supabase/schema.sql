-- ECHO collaboration setup
-- Run this entire file once in Supabase Dashboard > SQL Editor.
-- After the professor signs in to ECHO at least once, replace the email below
-- with the professor's login email and run the final UPDATE statement.

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

-- Backfill users who signed in before this setup was installed.
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

create or replace function public.is_echo_professor(target_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = target_id and p.role = 'professor'
  );
$$;

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

grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.announcements to authenticated;
grant select, insert on public.private_messages to authenticated;
grant execute on function public.is_echo_professor(uuid) to authenticated;

-- IMPORTANT: Run this after the professor has logged in once.
-- Replace the sample email with the professor's exact ECHO login email.
-- update public.profiles
-- set role = 'professor'
-- where id = (select id from auth.users where lower(email) = lower('PROFESSOR_EMAIL_HERE'));
