-- ECHO owner account recognition.
-- Run the complete file in the Supabase SQL Editor.
-- This updates permission checks only; it does not change profile roles or class data.

begin;

create or replace function public.is_echo_owner()
returns boolean
language sql
stable
security definer
set search_path = auth, public, pg_temp
as $echo_owner$
  select exists (
    select 1
    from auth.users u
    where u.id = auth.uid()
      and lower(coalesce(u.email, '')) in (
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
$echo_professor$;

revoke all on function public.is_echo_owner() from public;
revoke all on function public.is_echo_professor(uuid) from public;
grant execute on function public.is_echo_owner() to authenticated;
grant execute on function public.is_echo_professor(uuid) to authenticated;

commit;
