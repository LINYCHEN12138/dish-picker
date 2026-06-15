-- Legacy personal-data tables require profile_name. Keep them compatible
-- with anonymous auth writes from the current app.
alter table public.favorites
  alter column profile_name set default '我';

alter table public.menu_history
  alter column profile_name set default '我';

alter table public.shopping_list
  alter column profile_name set default '我';

notify pgrst, 'reload schema';
