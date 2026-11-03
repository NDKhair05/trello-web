-- Run once on a new Supabase project, before 002 and 003.
create table public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 50),
  description text not null default '' check (char_length(description) <= 1000),
  column_order_ids uuid[] not null default '{}',
  theme jsonb not null default '{"id":0,"type":"default","value":"default"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.board_columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 50),
  card_order_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid not null references public.board_columns(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 50),
  description text not null default '' check (char_length(description) <= 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index boards_user_id_idx on public.boards(user_id);
create index board_columns_board_id_idx on public.board_columns(board_id);
create index cards_column_id_idx on public.cards(column_id);
create function public.mvp_touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger boards_updated before update on public.boards
for each row execute function public.mvp_touch_updated_at();
create trigger columns_updated before update on public.board_columns
for each row execute function public.mvp_touch_updated_at();
create trigger cards_updated before update on public.cards
for each row execute function public.mvp_touch_updated_at();
