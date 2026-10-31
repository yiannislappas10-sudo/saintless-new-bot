-- ECHO private messaging and announcement receipt repair
-- Run once in Supabase SQL Editor. Safe to rerun.
-- Keeps private messages restricted to the sender and recipient, and to
-- professor <-> student conversations.

alter table public.private_messages enable row level security;

drop policy if exists "ECHO users can read their own private messages" on public.private_messages;
create policy "ECHO users can read their own private messages"
on public.private_messages
for select to authenticated
using (sender_id = auth.uid() or recipient_id = auth.uid());

drop policy if exists "ECHO users can message their professor or students" on public.private_messages;
create policy "ECHO users can message their professor or students"
on public.private_messages
for insert to authenticated
with check (
  sender_id = auth.uid()
  and recipient_id <> auth.uid()
  and (
    (public.is_echo_professor(auth.uid()) and not public.is_echo_professor(recipient_id))
    or
    (not public.is_echo_professor(auth.uid()) and public.is_echo_professor(recipient_id))
  )
);

drop policy if exists "ECHO recipients mark incoming messages as read" on public.private_messages;
create policy "ECHO recipients mark incoming messages as read"
on public.private_messages
for update to authenticated
using (recipient_id = auth.uid())
with check (recipient_id = auth.uid());

grant select, insert on public.private_messages to authenticated;
grant update(read_at) on public.private_messages to authenticated;

create table if not exists public.announcement_reads (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (announcement_id,user_id)
);
alter table public.announcement_reads enable row level security;

drop policy if exists "ECHO users read their own announcement receipts" on public.announcement_reads;
create policy "ECHO users read their own announcement receipts"
on public.announcement_reads
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "ECHO users mark visible announcements as read" on public.announcement_reads;
create policy "ECHO users mark visible announcements as read"
on public.announcement_reads
for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.announcements a
    where a.id = announcement_id and a.published = true
  )
);

grant select, insert on public.announcement_reads to authenticated;
