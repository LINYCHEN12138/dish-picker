create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '我',
  avatar_key text,
  theme_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dishes (
  id text primary key,
  slug text not null unique,
  name text not null,
  category text not null,
  tags text[] not null default '{}',
  difficulty text not null,
  cook_minutes integer not null check (cook_minutes > 0),
  servings integer not null check (servings > 0),
  description text not null default '',
  emoji text not null default '',
  tone text not null default 'coral',
  tips text[] not null default '{}',
  video_url text not null default '',
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  default_unit text not null default '',
  created_at timestamptz not null default now(),
  unique(name, category)
);

create table if not exists public.dish_ingredients (
  id uuid primary key default gen_random_uuid(),
  dish_id text not null references public.dishes(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  kind text not null check (kind in ('ingredient', 'seasoning')),
  amount numeric,
  unit text not null default '',
  display_amount text not null,
  optional boolean not null default false,
  sort_order integer not null default 0,
  unique(dish_id, ingredient_id, kind)
);

create table if not exists public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  dish_id text not null references public.dishes(id) on delete cascade,
  step_number integer not null check (step_number > 0),
  title text not null,
  description text not null,
  unique(dish_id, step_number)
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  dish_id text not null references public.dishes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, dish_id)
);

create table if not exists public.menu_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source text not null check (source in ('random', 'manual', 'ai')),
  menu_name text,
  dish_ids text[] not null,
  dish_snapshots jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.shopping_list (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  dish_ids text[] not null,
  ingredient_id uuid references public.ingredients(id) on delete set null,
  item_name text not null,
  category text not null,
  display_amount text not null,
  checked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dishes_active_featured_idx on public.dishes(active, featured);
create index if not exists dish_ingredients_dish_idx on public.dish_ingredients(dish_id, sort_order);
create index if not exists recipe_steps_dish_idx on public.recipe_steps(dish_id, step_number);
create index if not exists favorites_user_idx on public.favorites(user_id);
create index if not exists menu_history_user_created_idx on public.menu_history(user_id, created_at desc);
create index if not exists shopping_list_user_created_idx on public.shopping_list(user_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles for each row execute function public.touch_updated_at();
drop trigger if exists dishes_touch_updated_at on public.dishes;
create trigger dishes_touch_updated_at before update on public.dishes for each row execute function public.touch_updated_at();
drop trigger if exists shopping_list_touch_updated_at on public.shopping_list;
create trigger shopping_list_touch_updated_at before update on public.shopping_list for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles(id, display_name) values(new.id, '我') on conflict (id) do nothing; return new; end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
