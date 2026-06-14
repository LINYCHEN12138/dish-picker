alter table public.profiles enable row level security;
alter table public.dishes enable row level security;
alter table public.ingredients enable row level security;
alter table public.dish_ingredients enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.favorites enable row level security;
alter table public.menu_history enable row level security;
alter table public.shopping_list enable row level security;

drop policy if exists "public read active dishes" on public.dishes;
create policy "public read active dishes" on public.dishes for select using (active = true);
drop policy if exists "public read ingredients" on public.ingredients;
create policy "public read ingredients" on public.ingredients for select using (true);
drop policy if exists "public read dish ingredients" on public.dish_ingredients;
create policy "public read dish ingredients" on public.dish_ingredients for select using (true);
drop policy if exists "public read recipe steps" on public.recipe_steps;
create policy "public read recipe steps" on public.recipe_steps for select using (true);

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "users manage own favorites" on public.favorites;
create policy "users manage own favorites" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "users manage own history" on public.menu_history;
create policy "users manage own history" on public.menu_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "users manage own shopping list" on public.shopping_list;
create policy "users manage own shopping list" on public.shopping_list for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.dishes, public.ingredients, public.dish_ingredients, public.recipe_steps to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.favorites, public.menu_history, public.shopping_list to authenticated;
