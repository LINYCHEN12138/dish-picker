-- The original tables used profile_name and single-item fields. The current
-- app scopes data by auth.uid() through user_id and stores richer snapshots.
-- Keep legacy columns and rows, but stop requiring them for new writes.

alter table public.favorites
  drop constraint if exists favorites_profile_name_fkey;
alter table public.favorites
  alter column profile_name drop default,
  alter column profile_name drop not null;

alter table public.menu_history
  drop constraint if exists menu_history_profile_name_fkey;
alter table public.menu_history
  alter column profile_name drop default,
  alter column profile_name drop not null,
  alter column dish_id drop not null;

alter table public.shopping_list
  drop constraint if exists shopping_list_profile_name_fkey;
alter table public.shopping_list
  alter column profile_name drop default,
  alter column profile_name drop not null,
  alter column ingredient_name drop not null;

notify pgrst, 'reload schema';
