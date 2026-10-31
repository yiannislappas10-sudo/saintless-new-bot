-- Add the second ECHO Primary Owner account.
-- Run this migration once in the Supabase SQL Editor for the existing project.

create or replace function public.is_echo_owner()
returns boolean
language sql
stable
security definer
set search_path = auth, public, pg_temp
as $$
  select exists (
    select 1
    from auth.users u
    where u.id = auth.uid()
      and lower(coalesce(u.email, '')) in (
        'yiannislappas8@gmail.com',
        'yiannislappas10@gmail.com'
      )
  );
$$;

create or replace function public.is_echo_professor(target_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
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
$$;

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

revoke all on function public.is_echo_owner() from public;
revoke all on function public.is_echo_professor(uuid) from public;
revoke all on function public.set_echo_professor(uuid, boolean) from public;

grant execute on function public.is_echo_owner() to authenticated;
grant execute on function public.is_echo_professor(uuid) to authenticated;
grant execute on function public.set_echo_professor(uuid, boolean) to authenticated;
