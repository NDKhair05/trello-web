alter table public.boards enable row level security;
alter table public.board_columns enable row level security;
alter table public.cards enable row level security;
revoke all on public.boards, public.board_columns, public.cards from anon, authenticated;
grant select, insert, update, delete on public.boards, public.board_columns, public.cards to authenticated;
create policy boards_owner on public.boards for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy columns_owner on public.board_columns for all to authenticated
using (exists (select 1 from public.boards b where b.id = board_id and b.user_id = (select auth.uid())))
with check (exists (select 1 from public.boards b where b.id = board_id and b.user_id = (select auth.uid())));
create policy cards_owner on public.cards for all to authenticated
using (exists (
  select 1 from public.board_columns c join public.boards b on b.id = c.board_id
  where c.id = column_id and b.user_id = (select auth.uid())
))
with check (exists (
  select 1 from public.board_columns c join public.boards b on b.id = c.board_id
  where c.id = column_id and b.user_id = (select auth.uid())
));
