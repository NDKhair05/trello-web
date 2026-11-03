-- Each RPC is one transaction; locking the board serializes its mutations.
-- SECURITY INVOKER keeps normal RLS checks in force.
create function public.mvp_board_operation(p_board_id uuid, p_action text, p_payload jsonb default '{}')
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_board public.boards;
  v_column public.board_columns;
  v_card public.cards;
  v_ids uuid[];
  v_expected uuid[];
  v_source uuid;
  v_target uuid;
  v_source_ids uuid[];
  v_target_ids uuid[];
begin
  select * into v_board from public.boards
  where id = p_board_id and user_id = auth.uid() for update;
  if not found then raise exception 'Board not found or access denied.'; end if;
  case p_action
  when 'create_column' then
    insert into public.board_columns(board_id, title)
    values(p_board_id, btrim(p_payload->>'title')) returning * into v_column;
    update public.boards set column_order_ids = array_append(column_order_ids, v_column.id) where id = p_board_id;
    return to_jsonb(v_column);
  when 'delete_column' then
    delete from public.board_columns where id = (p_payload->>'column_id')::uuid and board_id = p_board_id returning * into v_column;
    if not found then raise exception 'Column not found.'; end if;
    update public.boards set column_order_ids = array_remove(column_order_ids, v_column.id) where id = p_board_id;
  when 'create_card' then
    select * into v_column from public.board_columns where id = (p_payload->>'column_id')::uuid and board_id = p_board_id;
    if not found then raise exception 'Column not found.'; end if;
    insert into public.cards(column_id, title) values(v_column.id, btrim(p_payload->>'title')) returning * into v_card;
    update public.board_columns set card_order_ids = array_append(card_order_ids, v_card.id) where id = v_column.id;
    return to_jsonb(v_card);
  when 'delete_card' then
    delete from public.cards where id = (p_payload->>'card_id')::uuid
    and column_id in (select id from public.board_columns where board_id = p_board_id) returning * into v_card;
    if not found then raise exception 'Card not found.'; end if;
    update public.board_columns set card_order_ids = array_remove(card_order_ids, v_card.id) where id = v_card.column_id;
  when 'reorder_columns' then
    select coalesce(array_agg(value::uuid), '{}') into v_ids from jsonb_array_elements_text(p_payload->'ids');
    select coalesce(array_agg(id order by id), '{}') into v_expected from public.board_columns where board_id = p_board_id;
    if (select coalesce(array_agg(x order by x), '{}') from unnest(v_ids) x) <> v_expected then
      raise exception 'Invalid column order. Reload the board and try again.';
    end if;
    update public.boards set column_order_ids = v_ids where id = p_board_id;
  when 'reorder_cards' then
    select * into v_column from public.board_columns where id = (p_payload->>'column_id')::uuid and board_id = p_board_id;
    if not found then raise exception 'Column not found.'; end if;
    select coalesce(array_agg(value::uuid), '{}') into v_ids from jsonb_array_elements_text(p_payload->'ids');
    select coalesce(array_agg(id order by id), '{}') into v_expected from public.cards where column_id = v_column.id;
    if (select coalesce(array_agg(x order by x), '{}') from unnest(v_ids) x) <> v_expected then
      raise exception 'Invalid card order. Reload the board and try again.';
    end if;
    update public.board_columns set card_order_ids = v_ids where id = v_column.id;
  when 'move_card' then
    v_source := (p_payload->>'source_id')::uuid;
    v_target := (p_payload->>'target_id')::uuid;
    if v_source = v_target or (select count(*) from public.board_columns where id in (v_source, v_target) and board_id = p_board_id) <> 2 then
      raise exception 'Both columns must belong to this board.';
    end if;
    select * into v_card from public.cards where id = (p_payload->>'card_id')::uuid and column_id = v_source;
    if not found then raise exception 'Card not found in source column. Reload the board.'; end if;
    select coalesce(array_agg(value::uuid), '{}') into v_source_ids from jsonb_array_elements_text(p_payload->'source_ids');
    select coalesce(array_agg(value::uuid), '{}') into v_target_ids from jsonb_array_elements_text(p_payload->'target_ids');
    select coalesce(array_agg(id order by id), '{}') into v_expected from public.cards where column_id = v_source and id <> v_card.id;
    if (select coalesce(array_agg(x order by x), '{}') from unnest(v_source_ids) x) <> v_expected then
      raise exception 'Invalid source order. Reload the board.';
    end if;
    select array_agg(id order by id) into v_expected from (
      select id from public.cards where column_id = v_target union all select v_card.id
    ) ids;
    if (select coalesce(array_agg(x order by x), '{}') from unnest(v_target_ids) x) <> v_expected then
      raise exception 'Invalid target order. Reload the board.';
    end if;
    update public.cards set column_id = v_target where id = v_card.id;
    update public.board_columns set card_order_ids = v_source_ids where id = v_source;
    update public.board_columns set card_order_ids = v_target_ids where id = v_target;
  else raise exception 'Unknown operation.';
  end case;
  return jsonb_build_object('success', true);
end;
$$;
revoke execute on function public.mvp_board_operation(uuid, text, jsonb) from public, anon;
grant execute on function public.mvp_board_operation(uuid, text, jsonb) to authenticated;
