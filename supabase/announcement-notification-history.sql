-- ECHO: stop historical announcements from resurfacing as new notifications.
-- Existing announcements are marked as historical. New announcements default to notify.
-- Historical announcements remain visible in the Announcements panel and remain pinnable.
begin;

alter table public.announcements
  add column if not exists notify_in_notifications boolean not null default false;

alter table public.announcements
  alter column notify_in_notifications set default true;

insert into public.announcement_reads (announcement_id, user_id)
select a.id, p.id
from public.announcements a
cross join public.profiles p
on conflict (announcement_id, user_id) do nothing;

commit;
