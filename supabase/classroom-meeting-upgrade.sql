-- ECHO live classroom interaction and teacher moderation upgrade
-- Run once in Supabase Dashboard > SQL Editor after classroom.sql.

alter table public.class_room_participants
  add column if not exists hand_raised boolean not null default false;
alter table public.class_room_participants
  add column if not exists hand_raised_at timestamptz;

alter table public.class_room_publications
  drop constraint if exists class_room_publications_track_name_check;
alter table public.class_room_publications
  add constraint class_room_publications_track_name_check
  check (track_name in ('audio','video','screen'));

create table if not exists public.class_room_controls (
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  teacher_muted boolean not null default false,
  teacher_camera_off boolean not null default false,
  removed boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (class_id,user_id)
);

alter table public.class_room_controls
  add column if not exists teacher_camera_off boolean not null default false;

alter table public.class_room_controls enable row level security;

drop policy if exists "ECHO class members can read meeting controls" on public.class_room_controls;
create policy "ECHO class members can read meeting controls"
on public.class_room_controls
for select to authenticated
using (public.is_echo_class_member(class_id));

drop policy if exists "ECHO professors manage meeting controls" on public.class_room_controls;
create policy "ECHO professors manage meeting controls"
on public.class_room_controls
for all to authenticated
using (public.is_echo_class_member(class_id) and (public.is_echo_professor() or public.is_echo_owner()))
with check (public.is_echo_class_member(class_id) and (public.is_echo_professor() or public.is_echo_owner()));

grant select,insert,update,delete on public.class_room_controls to authenticated;
grant select,update on public.class_room_participants to authenticated;
grant select,insert,update,delete on public.class_room_publications to authenticated;

create or replace function public.is_echo_class_channel_member(_topic text)
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1
    from public.classes c
    where _topic = 'echo-class:' || c.id::text
      and public.is_echo_class_member(c.id)
  );
$$;

revoke all on function public.is_echo_class_channel_member(text) from public;
grant execute on function public.is_echo_class_channel_member(text) to authenticated;

drop policy if exists "ECHO class members can receive meeting broadcasts" on realtime.messages;
create policy "ECHO class members can receive meeting broadcasts"
on realtime.messages
for select to authenticated
using (
  extension = 'broadcast'
  and public.is_echo_class_channel_member(realtime.topic())
);

drop policy if exists "ECHO class members can send meeting broadcasts" on realtime.messages;
create policy "ECHO class members can send meeting broadcasts"
on realtime.messages
for insert to authenticated
with check (
  extension = 'broadcast'
  and public.is_echo_class_channel_member(realtime.topic())
);
