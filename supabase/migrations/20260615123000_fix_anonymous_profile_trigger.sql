create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    insert into public.profiles(id, display_name)
    values (new.id, '我')
    on conflict (id) do nothing;
  exception when others then
    -- Do not let a legacy profiles constraint block anonymous sign-in.
    null;
  end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
