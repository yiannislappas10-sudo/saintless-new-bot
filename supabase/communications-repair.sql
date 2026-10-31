-- ECHO communications + owner access repair
-- Run this ENTIRE file in Supabase SQL Editor.
-- Safe to rerun. Does not delete classes, messages, announcements, or profiles.

begin;

-- Ensure both designated owner accounts are recognised by database permissions.
create or replace function public.is_echo_owner()
returns boolean
language sql
stable
security definer
set search_path = auth, public, pg_temp
as $echo_owner$
  select exists (
    select 1 from auth.users u
    where u.id = auth.uid()
      and lower(coalesce(u.email,'')) in (
        'yiannislappas8@gmail.com',
        'yiannislappas10@gmail.com'
      )
  );
$echo_owner$;

create or replace function public.is_echo_professor(target_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $echo_professor$
  select exists (
    select 1
    from auth.users u
    left join public.profiles p on p.id=u.id
    where u.id=target_id
      and (
        p.role='professor'
        or lower(coalesce(u.email,'')) in (
          'yiannislappas8@gmail.com',
          'yiannislappas10@gmail.com'
        )
      )
  );
$echo_professor$;

-- Owner role-management RPCs used by the Owner tab.
create or replace function public.get_echo_role_candidates()
returns table(user_id uuid, display_name text, email text, role text)
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $echo_candidates$
begin
  if not public.is_echo_owner() then
    raise exception 'Only an ECHO owner can view role management.';
  end if;

  return query
  select p.id, p.display_name, u.email::text, p.role
  from public.profiles p
  join auth.users u on u.id=p.id
  order by lower(coalesce(u.email,''));
end;
$echo_candidates$;

create or replace function public.set_echo_professor(target_user_id uuid, make_professor boolean)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $echo_set_professor$
begin
  if not public.is_echo_owner() then
    raise exception 'Only an ECHO owner can change professor permissions.';
  end if;
  if target_user_id is null then
    raise exception 'Select an account first.';
  end if;
  if exists (
    select 1 from auth.users u
    where u.id=target_user_id
      and lower(coalesce(u.email,'')) in (
        'yiannislappas8@gmail.com',
        'yiannislappas10@gmail.com'
      )
  ) then
    raise exception 'An ECHO owner account cannot be changed here.';
  end if;

  update public.profiles
  set role=case when make_professor then 'professor' else 'student' end
  where id=target_user_id;

  if not found then
    raise exception 'Account profile not found. Ask that account to sign in to ECHO once.';
  end if;
end;
$echo_set_professor$;

alter table public.profiles enable row level security;
drop policy if exists "ECHO profiles are visible to their owner and teaching staff" on public.profiles;
create policy "ECHO profiles are visible to their owner and teaching staff"
on public.profiles for select to authenticated
using (
  id=auth.uid()
  or public.is_echo_professor(id)
  or public.is_echo_professor()
  or public.is_echo_owner()
);

grant select on public.profiles to authenticated;
revoke all on function public.is_echo_owner() from public;
revoke all on function public.is_echo_professor(uuid) from public;
revoke all on function public.get_echo_role_candidates() from public;
revoke all on function public.set_echo_professor(uuid,boolean) from public;
grant execute on function public.is_echo_owner() to authenticated;
grant execute on function public.is_echo_professor(uuid) to authenticated;
grant execute on function public.get_echo_role_candidates() to authenticated;
grant execute on function public.set_echo_professor(uuid,boolean) to authenticated;

-- Message receipts must exist before the browser queries read_at.
alter table public.private_messages
  add column if not exists read_at timestamptz;

alter table public.private_messages enable row level security;
drop policy if exists "ECHO users can read their own private messages" on public.private_messages;
create policy "ECHO users can read their own private messages"
on public.private_messages for select to authenticated
using (sender_id=auth.uid() or recipient_id=auth.uid());

drop policy if exists "ECHO users can message their professor or students" on public.private_messages;
create policy "ECHO users can message their professor or students"
on public.private_messages for insert to authenticated
with check (
  sender_id=auth.uid()
  and recipient_id<>auth.uid()
  and (
    (public.is_echo_professor(auth.uid()) and not public.is_echo_professor(recipient_id))
    or
    (not public.is_echo_professor(auth.uid()) and public.is_echo_professor(recipient_id))
  )
);

drop policy if exists "ECHO recipients mark incoming messages as read" on public.private_messages;
create policy "ECHO recipients mark incoming messages as read"
on public.private_messages for update to authenticated
using (recipient_id=auth.uid())
with check (recipient_id=auth.uid());

grant select,insert on public.private_messages to authenticated;
grant update(read_at) on public.private_messages to authenticated;

-- Announcement UI columns and selected-recipient mapping.
alter table public.announcements
  add column if not exists pinned boolean not null default false;
alter table public.announcements
  add column if not exists audience text not null default 'everyone'
  check (audience in ('everyone','selected'));

create table if not exists public.announcement_recipients (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  primary key (announcement_id,student_id)
);
alter table public.announcement_recipients enable row level security;

drop policy if exists "ECHO announcement audience visibility" on public.announcements;
drop policy if exists "ECHO users can read published announcements" on public.announcements;
create policy "ECHO announcement audience visibility"
on public.announcements for select to authenticated
using (
  public.is_echo_professor()
  or (
    published=true
    and (
      audience='everyone'
      or exists (
        select 1 from public.announcement_recipients ar
        where ar.announcement_id=announcements.id and ar.student_id=auth.uid()
      )
    )
  )
);

drop policy if exists "ECHO professors can publish announcements" on public.announcements;
create policy "ECHO professors can publish announcements"
on public.announcements for insert to authenticated
with check (public.is_echo_professor() and created_by=auth.uid());

drop policy if exists "ECHO professors can edit announcements" on public.announcements;
create policy "ECHO professors can edit announcements"
on public.announcements for update to authenticated
using (public.is_echo_professor())
with check (public.is_echo_professor());

drop policy if exists "ECHO professors can delete announcements" on public.announcements;
create policy "ECHO professors can delete announcements"
on public.announcements for delete to authenticated
using (public.is_echo_professor());

drop policy if exists "ECHO announcement recipient visibility" on public.announcement_recipients;
create policy "ECHO announcement recipient visibility"
on public.announcement_recipients for select to authenticated
using (student_id=auth.uid() or public.is_echo_professor() or public.is_echo_owner());

drop policy if exists "ECHO professors manage announcement recipients" on public.announcement_recipients;
create policy "ECHO professors manage announcement recipients"
on public.announcement_recipients for all to authenticated
using (public.is_echo_professor() or public.is_echo_owner())
with check (public.is_echo_professor() or public.is_echo_owner());

grant select,insert,update,delete on public.announcements to authenticated;
grant select,insert,delete on public.announcement_recipients to authenticated;

-- Atomic announcement publish/edit RPC used by the browser.
create or replace function public.save_echo_announcement(
  announcement_title text,
  announcement_body text,
  announcement_pinned boolean,
  announcement_audience text,
  recipient_ids uuid[],
  target_announcement_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $echo_save_announcement$
declare
  saved_id uuid;
  recipients uuid[] := coalesce(recipient_ids,array[]::uuid[]);
begin
  if auth.uid() is null or not public.is_echo_professor() then
    raise exception 'Only professors can publish announcements.';
  end if;
  if char_length(trim(coalesce(announcement_title,''))) not between 1 and 120 then
    raise exception 'Announcement title must contain 1 to 120 characters.';
  end if;
  if char_length(trim(coalesce(announcement_body,''))) not between 1 and 6000 then
    raise exception 'Announcement message must contain 1 to 6000 characters.';
  end if;
  if announcement_audience not in ('everyone','selected') then
    raise exception 'Choose a valid announcement audience.';
  end if;
  if announcement_audience='selected' and cardinality(recipients)=0 then
    raise exception 'Select at least one student.';
  end if;
  if exists (
    select 1
    from unnest(recipients) as chosen(student_id)
    left join public.profiles p on p.id=chosen.student_id
    where p.id is null or p.role<>'student'
  ) then
    raise exception 'Every announcement recipient must be a student account.';
  end if;

  if target_announcement_id is null then
    insert into public.announcements(title,body,published,created_by,pinned,audience)
    values(trim(announcement_title),trim(announcement_body),true,auth.uid(),
      coalesce(announcement_pinned,false),announcement_audience)
    returning id into saved_id;
  else
    update public.announcements a
    set title=trim(announcement_title),
        body=trim(announcement_body),
        pinned=coalesce(announcement_pinned,false),
        audience=announcement_audience
    where a.id=target_announcement_id
    returning a.id into saved_id;
    if not found then
      raise exception 'Announcement not found.';
    end if;
    delete from public.announcement_recipients ar where ar.announcement_id=saved_id;
  end if;

  if announcement_audience='selected' then
    insert into public.announcement_recipients(announcement_id,student_id)
    select saved_id,chosen.student_id
    from (select distinct unnest(recipients) as student_id) chosen;
  end if;
  return saved_id;
end;
$echo_save_announcement$;

revoke all on function public.save_echo_announcement(text,text,boolean,text,uuid[],uuid) from public;
grant execute on function public.save_echo_announcement(text,text,boolean,text,uuid[],uuid) to authenticated;

-- Read receipts for announcements.
create table if not exists public.announcement_reads (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (announcement_id,user_id)
);
alter table public.announcement_reads enable row level security;
drop policy if exists "ECHO users read their own announcement receipts" on public.announcement_reads;
create policy "ECHO users read their own announcement receipts"
on public.announcement_reads for select to authenticated
using (user_id=auth.uid());

drop policy if exists "ECHO users mark visible announcements as read" on public.announcement_reads;
create policy "ECHO users mark visible announcements as read"
on public.announcement_reads for insert to authenticated
with check (
  user_id=auth.uid()
  and exists (
    select 1 from public.announcements a
    where a.id=announcement_id and a.published=true
  )
);
grant select,insert on public.announcement_reads to authenticated;

-- Personal pins for announcements and incoming private messages.
create table if not exists public.notification_pins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  announcement_id uuid references public.announcements(id) on delete cascade,
  message_id uuid references public.private_messages(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint notification_pins_one_target check (
    (announcement_id is not null and message_id is null)
    or
    (announcement_id is null and message_id is not null)
  )
);
create unique index if not exists notification_pins_user_announcement_idx
  on public.notification_pins(user_id,announcement_id) where announcement_id is not null;
create unique index if not exists notification_pins_user_message_idx
  on public.notification_pins(user_id,message_id) where message_id is not null;
alter table public.notification_pins enable row level security;

drop policy if exists "ECHO users read their own notification pins" on public.notification_pins;
create policy "ECHO users read their own notification pins"
on public.notification_pins for select to authenticated
using (user_id=auth.uid());

drop policy if exists "ECHO users pin their own notifications" on public.notification_pins;
create policy "ECHO users pin their own notifications"
on public.notification_pins for insert to authenticated
with check (
  user_id=auth.uid()
  and (
    (announcement_id is not null and exists (
      select 1 from public.announcements a
      where a.id=announcement_id and a.published=true
    ))
    or
    (message_id is not null and exists (
      select 1 from public.private_messages m
      where m.id=message_id and m.recipient_id=auth.uid()
    ))
  )
);

drop policy if exists "ECHO users unpin their own notifications" on public.notification_pins;
create policy "ECHO users unpin their own notifications"
on public.notification_pins for delete to authenticated
using (user_id=auth.uid());

grant select,insert,delete on public.notification_pins to authenticated;

commit;
