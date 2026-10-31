-- ECHO: stop old announcements from resurfacing as new notifications.
-- Existing announcements become historical; future announcements use the TRUE default.
-- Existing pinned announcements remain visible through the user's personal pin list.
begin;

do $announcement_history$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'announcements'
      and column_name = 'notify_in_notifications'
  ) then
    alter table public.announcements
      add column notify_in_notifications boolean not null default false;
    alter table public.announcements
      alter column notify_in_notifications set default true;
  end if;
end
$announcement_history$;

-- Give every current account a read receipt for all announcements that
-- already existed when this migration was installed. This also removes the
-- misleading "New" badge in the announcements tab for historical posts.
insert into public.announcement_reads (announcement_id, user_id)
select a.id, p.id
from public.announcements a
cross join public.profiles p
on conflict (announcement_id, user_id) do nothing;

commit;
