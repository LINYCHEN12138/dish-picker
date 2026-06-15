-- Add the fields used by the app without deleting legacy tables or rows.
alter table public.profiles
  add column if not exists display_name text not null default '我',
  add column if not exists avatar_key text,
  add column if not exists theme_id text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.favorites
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists dish_id text,
  add column if not exists created_at timestamptz not null default now();

alter table public.menu_history
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists source text not null default 'manual',
  add column if not exists menu_name text,
  add column if not exists dish_ids text[] not null default '{}',
  add column if not exists dish_snapshots jsonb not null default '[]'::jsonb,
  add column if not exists created_at timestamptz not null default now();

alter table public.shopping_list
  add column if not exists list_id uuid,
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists dish_ids text[] not null default '{}',
  add column if not exists ingredient_id uuid,
  add column if not exists item_name text,
  add column if not exists category text,
  add column if not exists display_amount text,
  add column if not exists checked boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists favorites_user_dish_unique
  on public.favorites(user_id, dish_id)
  where user_id is not null and dish_id is not null;
create index if not exists menu_history_user_created_idx
  on public.menu_history(user_id, created_at desc);
create index if not exists shopping_list_user_created_idx
  on public.shopping_list(user_id, created_at desc);

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
    -- Legacy profile schemas may contain additional required columns.
    -- Personal persistence tables reference auth.users directly, so profile
    -- creation must never block an anonymous sign-in.
    null;
  end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.menu_history enable row level security;
alter table public.shopping_list enable row level security;

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "users manage own favorites" on public.favorites;
create policy "users manage own favorites" on public.favorites
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "users manage own history" on public.menu_history;
create policy "users manage own history" on public.menu_history
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "users manage own shopping list" on public.shopping_list;
create policy "users manage own shopping list" on public.shopping_list
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.favorites, public.menu_history, public.shopping_list to authenticated;

notify pgrst, 'reload schema';
