-- ECHO classroom management migration
-- Run after supabase/schema.sql. Safe to run more than once.
-- All scheduled timestamps are stored as timestamptz; the interface uses Europe/Athens.

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 140),
  subject text not null check (char_length(trim(subject)) between 1 and 100),
  description text not null default '' check (char_length(description) <= 5000),
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Europe/Athens',
  status text not null default 'scheduled' check (status in ('scheduled','cancelled')),
  allow_unassigned boolean not null default false,
  is_demo boolean not null default false,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_valid_time check (ends_at > starts_at)
);

create index if not exists classes_starts_at_idx on public.classes(starts_at);
create index if not exists classes_created_by_idx on public.classes(created_by);

create table if not exists public.class_enrollments (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid not null references public.profiles(id) on delete restrict,
  assigned_at timestamptz not null default now(),
  is_demo boolean not null default false,
  primary key (class_id, student_id)
);
create index if not exists class_enrollments_student_idx on public.class_enrollments(student_id);

create table if not exists public.class_materials (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 2000),
  resource_url text not null check (char_length(trim(resource_url)) between 1 and 2048),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.class_attendance (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  source text not null default 'classroom' check (source in ('classroom','demo')),
  constraint class_attendance_valid_time check (left_at is null or left_at >= joined_at)
);
create index if not exists class_attendance_class_idx on public.class_attendance(class_id, joined_at desc);
create index if not exists class_attendance_student_idx on public.class_attendance(student_id, joined_at desc);

alter table public.announcements
  add column if not exists pinned boolean not null default false,
  add column if not exists audience text not null default 'everyone'
    check (audience in ('everyone','selected')),
  add column if not exists class_id uuid references public.classes(id) on delete set null;

create table if not exists public.announcement_recipients (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  primary key (announcement_id, student_id)
);

alter table public.classes enable row level security;
alter table public.class_enrollments enable row level security;
alter table public.class_materials enable row level security;
alter table public.class_attendance enable row level security;
alter table public.announcement_recipients enable row level security;

drop policy if exists "ECHO class visibility" on public.classes;
create policy "ECHO class visibility" on public.classes
for select to authenticated
using (
  public.is_echo_owner()
  or (not is_demo and (
    public.is_echo_professor()
    or allow_unassigned
    or exists (
      select 1 from public.class_enrollments ce
      where ce.class_id = classes.id and ce.student_id = auth.uid() and not ce.is_demo
    )
  ))
);

drop policy if exists "ECHO professors create classes" on public.classes;
create policy "ECHO professors create classes" on public.classes
for insert to authenticated
with check (public.is_echo_professor() and created_by = auth.uid());

drop policy if exists "ECHO professors update classes" on public.classes;
create policy "ECHO professors update classes" on public.classes
for update to authenticated
using (public.is_echo_professor() or public.is_echo_owner())
with check (public.is_echo_professor() or public.is_echo_owner());

drop policy if exists "ECHO professors delete classes" on public.classes;
create policy "ECHO professors delete classes" on public.classes
for delete to authenticated
using (public.is_echo_professor() or public.is_echo_owner());

drop policy if exists "ECHO class roster visibility" on public.class_enrollments;
create policy "ECHO class roster visibility" on public.class_enrollments
for select to authenticated
using (
  public.is_echo_owner()
  or (not is_demo and (
    public.is_echo_professor()
    or student_id = auth.uid()
  ))
);

drop policy if exists "ECHO professors assign students" on public.class_enrollments;
create policy "ECHO professors assign students" on public.class_enrollments
for insert to authenticated
with check (
  (public.is_echo_professor() or public.is_echo_owner())
  and exists (select 1 from public.classes c where c.id = class_id)
  and exists (select 1 from public.profiles p where p.id = student_id and p.role = 'student')
);

drop policy if exists "ECHO professors remove assignments" on public.class_enrollments;
create policy "ECHO professors remove assignments" on public.class_enrollments
for delete to authenticated
using (public.is_echo_professor() or public.is_echo_owner());

drop policy if exists "ECHO class materials visibility" on public.class_materials;
create policy "ECHO class materials visibility" on public.class_materials
for select to authenticated
using (
  public.is_echo_owner()
  or public.is_echo_professor()
  or exists (
    select 1 from public.classes c
    where c.id = class_materials.class_id and c.allow_unassigned and not c.is_demo
  )
  or exists (
    select 1 from public.class_enrollments ce
    where ce.class_id = class_materials.class_id
      and ce.student_id = auth.uid() and not ce.is_demo
  )
);

drop policy if exists "ECHO professors manage class materials" on public.class_materials;
create policy "ECHO professors manage class materials" on public.class_materials
for all to authenticated
using (public.is_echo_professor() or public.is_echo_owner())
with check ((public.is_echo_professor() or public.is_echo_owner()) and created_by = auth.uid());

drop policy if exists "ECHO attendance visibility" on public.class_attendance;
create policy "ECHO attendance visibility" on public.class_attendance
for select to authenticated
using (
  public.is_echo_owner()
  or public.is_echo_professor()
  or (student_id = auth.uid() and source = 'classroom')
);

drop policy if exists "ECHO users can mark their own attendance" on public.class_attendance;
create policy "ECHO users can mark their own attendance" on public.class_attendance
for insert to authenticated
with check (
  student_id = auth.uid()
  and source = 'classroom'
  and exists (
    select 1 from public.class_enrollments ce
    where ce.class_id = class_id and ce.student_id = auth.uid() and not ce.is_demo
  )
);

drop policy if exists "ECHO users can end their own attendance" on public.class_attendance;
create policy "ECHO users can end their own attendance" on public.class_attendance
for update to authenticated
using (student_id = auth.uid() or public.is_echo_professor() or public.is_echo_owner())
with check (student_id = auth.uid() or public.is_echo_professor() or public.is_echo_owner());

drop policy if exists "ECHO announcement audience visibility" on public.announcements;
create policy "ECHO announcement audience visibility" on public.announcements
for select to authenticated
using (
  public.is_echo_professor()
  or (
    published = true
    and (
      audience = 'everyone'
      or exists (
        select 1 from public.announcement_recipients ar
        where ar.announcement_id = announcements.id and ar.student_id = auth.uid()
      )
    )
  )
);

drop policy if exists "ECHO announcement recipient visibility" on public.announcement_recipients;
create policy "ECHO announcement recipient visibility" on public.announcement_recipients
for select to authenticated
using (student_id = auth.uid() or public.is_echo_professor() or public.is_echo_owner());

drop policy if exists "ECHO professors manage announcement recipients" on public.announcement_recipients;
create policy "ECHO professors manage announcement recipients" on public.announcement_recipients
for all to authenticated
using (public.is_echo_professor() or public.is_echo_owner())
with check (public.is_echo_professor() or public.is_echo_owner());

create or replace function public.join_echo_class(target_class_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  attendance_id uuid;
  class_row public.classes%rowtype;
begin
  if auth.uid() is null then raise exception 'Sign in to join this class.'; end if;
  select * into class_row from public.classes c where c.id = target_class_id and not c.is_demo;
  if not found then raise exception 'Class not found.'; end if;
  if class_row.status <> 'scheduled' then raise exception 'This class is cancelled.'; end if;
  if now() < class_row.starts_at - interval '15 minutes' then
    raise exception 'This class is not open yet.';
  end if;
  if now() > class_row.ends_at then raise exception 'This class has already ended.'; end if;
  if not public.is_echo_professor() and not exists (
    select 1 from public.class_live_rooms r
    where r.class_id = target_class_id and r.status = 'live'
  ) then
    raise exception 'The professor has not started this class yet.';
  end if;
  if not public.is_echo_professor() and not exists (
    select 1 from public.class_enrollments ce
    where ce.class_id = target_class_id and ce.student_id = auth.uid() and not ce.is_demo
  ) and not class_row.allow_unassigned then
    raise exception 'You are not assigned to this class.';
  end if;
  select a.id into attendance_id
  from public.class_attendance a
  where a.class_id = target_class_id and a.student_id = auth.uid() and a.left_at is null
  order by a.joined_at desc limit 1;
  if attendance_id is not null then return attendance_id; end if;
  insert into public.class_attendance(class_id, student_id, source)
  values (target_class_id, auth.uid(), 'classroom')
  returning id into attendance_id;
  return attendance_id;
end;
$$;

create or replace function public.leave_echo_class(target_attendance_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  update public.class_attendance
  set left_at = now()
  where id = target_attendance_id
    and student_id = auth.uid()
    and left_at is null;
  if not found and not exists (
    select 1 from public.class_attendance a
    where a.id = target_attendance_id
      and (a.student_id = auth.uid() or public.is_echo_professor() or public.is_echo_owner())
  ) then raise exception 'Attendance record not found.'; end if;
end;
$$;

revoke all on function public.join_echo_class(uuid) from public;
revoke all on function public.leave_echo_class(uuid) from public;
grant execute on function public.join_echo_class(uuid) to authenticated;
grant execute on function public.leave_echo_class(uuid) to authenticated;

grant select, insert, update, delete on public.classes to authenticated;
grant select, insert, delete on public.class_enrollments to authenticated;
grant select, insert, update, delete on public.class_materials to authenticated;
grant select, insert, update on public.class_attendance to authenticated;
grant select, insert, delete on public.announcement_recipients to authenticated;

-- Security corrections and owner-only simulated roster support.
drop policy if exists "ECHO users can read published announcements" on public.announcements;
drop policy if exists "ECHO announcement audience visibility" on public.announcements;
create policy "ECHO announcement audience visibility"
on public.announcements for select to authenticated
using (
  public.is_echo_professor()
  or (
    published = true
    and (
      (class_id is null and audience = 'everyone')
      or exists (
        select 1 from public.announcement_recipients ar
        where ar.announcement_id = announcements.id and ar.student_id = auth.uid()
      )
      or exists (
        select 1 from public.class_enrollments ce
        where ce.class_id = announcements.class_id
          and ce.student_id = auth.uid()
          and not ce.is_demo
      )
    )
  )
);

-- Student-safe class rosters: a student can only request names for a class
-- that is already visible to them. Database UUIDs are never rendered in the UI.
create or replace function public.get_echo_class_rosters(target_class_ids uuid[])
returns table(class_id uuid, student_id uuid, display_name text)
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'Sign in required.'; end if;
  return query
  select ce.class_id, ce.student_id, p.display_name
  from public.class_enrollments ce
  join public.profiles p on p.id = ce.student_id
  join public.classes c on c.id = ce.class_id
  where ce.class_id = any(coalesce(target_class_ids, array[]::uuid[]))
    and not ce.is_demo
    and not c.is_demo
    and (
      public.is_echo_owner()
      or public.is_echo_professor()
      or c.allow_unassigned
      or exists (
        select 1 from public.class_enrollments mine
        where mine.class_id = ce.class_id
          and mine.student_id = auth.uid()
          and not mine.is_demo
      )
    );
end;
$$;
revoke all on function public.get_echo_class_rosters(uuid[]) from public;
grant execute on function public.get_echo_class_rosters(uuid[]) to authenticated;

create table if not exists public.class_demo_participants (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 80),
  created_at timestamptz not null default now()
);
create index if not exists class_demo_participants_class_idx
  on public.class_demo_participants(class_id);
alter table public.class_demo_participants enable row level security;
drop policy if exists "ECHO owner manages isolated demo participants" on public.class_demo_participants;
create policy "ECHO owner manages isolated demo participants"
on public.class_demo_participants for all to authenticated
using (public.is_echo_owner())
with check (public.is_echo_owner());

create or replace function public.get_echo_demo_rosters(target_class_ids uuid[])
returns table(class_id uuid, display_name text)
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.is_echo_owner() then raise exception 'Only the ECHO owner may inspect demo data.'; end if;
  return query
  select d.class_id, d.display_name
  from public.class_demo_participants d
  join public.classes c on c.id = d.class_id
  where d.class_id = any(coalesce(target_class_ids, array[]::uuid[]))
    and c.is_demo;
end;
$$;
revoke all on function public.get_echo_demo_rosters(uuid[]) from public;
grant execute on function public.get_echo_demo_rosters(uuid[]) to authenticated;

create or replace function public.get_echo_class_attendance(target_class_id uuid)
returns table(display_name text, joined_at timestamptz, left_at timestamptz)
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not (public.is_echo_owner() or public.is_echo_professor()) then
    raise exception 'Only teaching staff can view class attendance.';
  end if;
  if not exists (select 1 from public.classes c where c.id = target_class_id) then
    raise exception 'Class not found.';
  end if;
  return query
  select p.display_name, a.joined_at, a.left_at
  from public.class_attendance a
  join public.profiles p on p.id = a.student_id
  where a.class_id = target_class_id
  order by a.joined_at desc;
end;
$$;
revoke all on function public.get_echo_class_attendance(uuid) from public;
grant execute on function public.get_echo_class_attendance(uuid) to authenticated;

-- Attendance mutations happen only through the checked RPC functions above.
drop policy if exists "ECHO users can mark their own attendance" on public.class_attendance;
drop policy if exists "ECHO users can end their own attendance" on public.class_attendance;
revoke insert, update, delete on public.class_attendance from authenticated;
grant select on public.class_attendance to authenticated;
grant select, insert, delete on public.class_demo_participants to authenticated;
create unique index if not exists class_attendance_one_open_session_idx
  on public.class_attendance(class_id, student_id)
  where left_at is null;

-- Prevent arbitrary student-side updates of class records via table grants.
grant select, insert, update, delete on public.classes to authenticated;

-- Live classroom state and private SFU session discovery.
create table if not exists public.class_live_rooms (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  status text not null default 'live' check (status in ('live','ended')),
  started_by uuid not null references public.profiles(id) on delete restrict,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);
create unique index if not exists class_live_rooms_one_active_idx
  on public.class_live_rooms(class_id) where status = 'live';

create or replace function public.is_echo_class_member(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1 from public.classes c
    where c.id = target_class_id
      and not c.is_demo
      and (
        public.is_echo_owner()
        or public.is_echo_professor()
        or c.allow_unassigned
        or exists (
          select 1 from public.class_enrollments ce
          where ce.class_id = c.id and ce.student_id = auth.uid() and not ce.is_demo
        )
      )
  );
$$;
revoke all on function public.is_echo_class_member(uuid) from public;
grant execute on function public.is_echo_class_member(uuid) to authenticated;

create table if not exists public.class_room_participants (
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id text not null unique,
  display_name text not null check (char_length(trim(display_name)) between 1 and 120),
  status text not null default 'joining' check (status in ('joining','active','left')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  primary key (class_id, user_id)
);
create index if not exists class_room_participants_class_status_idx
  on public.class_room_participants(class_id,status);

create table if not exists public.class_room_publications (
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id text not null,
  track_name text not null check (track_name in ('audio','video')),
  created_at timestamptz not null default now(),
  primary key (class_id,user_id,track_name)
);
create index if not exists class_room_publications_class_idx
  on public.class_room_publications(class_id,created_at);

create table if not exists public.class_room_subscriptions (
  class_id uuid not null references public.classes(id) on delete cascade,
  subscriber_id uuid not null references public.profiles(id) on delete cascade,
  publisher_id uuid not null references public.profiles(id) on delete cascade,
  session_id text not null unique,
  status text not null default 'active' check (status in ('active','ended')),
  created_at timestamptz not null default now(),
  primary key (class_id,subscriber_id,publisher_id),
  constraint class_room_subscription_no_self check (subscriber_id <> publisher_id)
);

alter table public.class_live_rooms enable row level security;
alter table public.class_room_participants enable row level security;
alter table public.class_room_publications enable row level security;
alter table public.class_room_subscriptions enable row level security;

drop policy if exists "ECHO class members can read live room status" on public.class_live_rooms;
create policy "ECHO class members can read live room status"
on public.class_live_rooms for select to authenticated
using (public.is_echo_class_member(class_id));

drop policy if exists "ECHO class members can read participants" on public.class_room_participants;
create policy "ECHO class members can read participants"
on public.class_room_participants for select to authenticated
using (public.is_echo_class_member(class_id));

drop policy if exists "ECHO users can create their own room participant" on public.class_room_participants;
create policy "ECHO users can create their own room participant"
on public.class_room_participants for insert to authenticated
with check (
  user_id = auth.uid()
  and public.is_echo_class_member(class_id)
  and exists (select 1 from public.class_live_rooms r where r.class_id = class_room_participants.class_id and r.status = 'live')
);

drop policy if exists "ECHO users and teachers can update room participants" on public.class_room_participants;
create policy "ECHO users and teachers can update room participants"
on public.class_room_participants for update to authenticated
using (user_id = auth.uid() or public.is_echo_professor() or public.is_echo_owner())
with check (
  (user_id = auth.uid() or public.is_echo_professor() or public.is_echo_owner())
  and public.is_echo_class_member(class_id)
);

drop policy if exists "ECHO users and teachers can remove room participants" on public.class_room_participants;
create policy "ECHO users and teachers can remove room participants"
on public.class_room_participants for delete to authenticated
using (user_id = auth.uid() or public.is_echo_professor() or public.is_echo_owner());

drop policy if exists "ECHO class members can read publications" on public.class_room_publications;
create policy "ECHO class members can read publications"
on public.class_room_publications for select to authenticated
using (public.is_echo_class_member(class_id));

drop policy if exists "ECHO active participants can publish their tracks" on public.class_room_publications;
create policy "ECHO active participants can publish their tracks"
on public.class_room_publications for insert to authenticated
with check (
  user_id = auth.uid()
  and public.is_echo_class_member(class_id)
  and exists (
    select 1 from public.class_room_participants p
    where p.class_id = class_room_publications.class_id
      and p.user_id = auth.uid()
      and p.session_id = class_room_publications.session_id
      and p.status in ('joining','active')
  )
);

drop policy if exists "ECHO owners can remove their publications" on public.class_room_publications;
create policy "ECHO owners can remove their publications"
on public.class_room_publications for delete to authenticated
using (user_id = auth.uid() or public.is_echo_professor() or public.is_echo_owner());

drop policy if exists "ECHO participants can read subscriptions" on public.class_room_subscriptions;
create policy "ECHO participants can read subscriptions"
on public.class_room_subscriptions for select to authenticated
using (
  subscriber_id = auth.uid()
  or publisher_id = auth.uid()
  or public.is_echo_professor()
  or public.is_echo_owner()
);

drop policy if exists "ECHO participants can create subscriptions" on public.class_room_subscriptions;
create policy "ECHO participants can create subscriptions"
on public.class_room_subscriptions for insert to authenticated
with check (
  subscriber_id = auth.uid()
  and public.is_echo_class_member(class_id)
  and exists (
    select 1 from public.class_room_participants p
    where p.class_id = class_room_subscriptions.class_id
      and p.user_id = subscriber_id and p.status = 'active'
  )
  and exists (
    select 1 from public.class_room_participants p
    where p.class_id = class_room_subscriptions.class_id
      and p.user_id = publisher_id and p.status = 'active'
  )
);

drop policy if exists "ECHO participants can update subscriptions" on public.class_room_subscriptions;
create policy "ECHO participants can update subscriptions"
on public.class_room_subscriptions for update to authenticated
using (subscriber_id = auth.uid() or public.is_echo_professor() or public.is_echo_owner())
with check (subscriber_id = auth.uid() or public.is_echo_professor() or public.is_echo_owner());

drop policy if exists "ECHO participants can delete subscriptions" on public.class_room_subscriptions;
create policy "ECHO participants can delete subscriptions"
on public.class_room_subscriptions for delete to authenticated
using (subscriber_id = auth.uid() or public.is_echo_professor() or public.is_echo_owner());

create or replace function public.start_echo_classroom(target_class_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  room_id uuid;
  class_row public.classes%rowtype;
begin
  if auth.uid() is null or not (public.is_echo_professor() or public.is_echo_owner()) then
    raise exception 'Only the professor can start this classroom.';
  end if;
  select * into class_row from public.classes c
  where c.id = target_class_id and not c.is_demo;
  if not found then raise exception 'Class not found.'; end if;
  if class_row.status = 'cancelled' then raise exception 'This class was cancelled.'; end if;
  if now() > class_row.ends_at then raise exception 'This class has already ended.'; end if;
  insert into public.class_live_rooms(class_id,status,started_by,started_at,ended_at)
  values(target_class_id,'live',auth.uid(),now(),null)
  on conflict (class_id) where status = 'live'
  do update set started_by = excluded.started_by, started_at = now(), ended_at = null
  returning id into room_id;
  return room_id;
end;
$$;

create or replace function public.end_echo_classroom(target_class_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if auth.uid() is null or not (public.is_echo_professor() or public.is_echo_owner()) then
    raise exception 'Only the professor can end this classroom.';
  end if;
  update public.class_live_rooms
  set status='ended', ended_at=now()
  where class_id=target_class_id and status='live';
  update public.class_room_participants
  set status='left', left_at=coalesce(left_at,now())
  where class_id=target_class_id and status <> 'left';
  update public.class_room_publications
  set created_at=created_at
  where false;
  update public.class_room_subscriptions
  set status='ended'
  where class_id=target_class_id and status='active';
  update public.class_attendance
  set left_at=coalesce(left_at,now())
  where class_id=target_class_id and left_at is null;
end;
$$;

revoke all on function public.start_echo_classroom(uuid) from public;
revoke all on function public.end_echo_classroom(uuid) from public;
grant execute on function public.start_echo_classroom(uuid) to authenticated;
grant execute on function public.end_echo_classroom(uuid) to authenticated;

grant select on public.class_live_rooms to authenticated;
grant select, insert, update, delete on public.class_room_participants to authenticated;
grant select, insert, delete on public.class_room_publications to authenticated;
grant select, insert, update, delete on public.class_room_subscriptions to authenticated;

-- Students may join only after an authorized professor has opened the room.
