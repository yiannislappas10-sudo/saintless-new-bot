-- ECHO profile settings migration
-- Adds a narrowly scoped RPC so signed-in users can change only their own display name.
-- Run once in Supabase Dashboard > SQL Editor.

create or replace function public.update_echo_profile(new_display_name text)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in to update your profile.';
  end if;

  if char_length(trim(coalesce(new_display_name, ''))) not between 2 and 60 then
    raise exception 'Display name must contain 2 to 60 characters.';
  end if;

  update public.profiles
  set display_name = trim(new_display_name)
  where id = auth.uid();

  if not found then
    raise exception 'Your ECHO profile could not be found.';
  end if;
end;
$$;

revoke all on function public.update_echo_profile(text) from public;
grant execute on function public.update_echo_profile(text) to authenticated;
