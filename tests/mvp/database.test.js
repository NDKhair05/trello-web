import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'

test('PostgreSQL migrations, ownership, ordering and cascade', async t => {
  const db = new PGlite()
  const a = '11111111-1111-4111-8111-111111111111'
  const b = '22222222-2222-4222-8222-222222222222'
  try {
    // Supabase provides these objects in production. Only emulate them in this local test DB.
    await db.exec(`
      create schema auth;
      create role anon;
      create role authenticated;
      create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth, public to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      insert into auth.users values ('${a}'), ('${b}');
    `)
    for (const file of ['001_schema.sql', '002_rls.sql', '003_board_operations.sql']) {
      await db.exec(await readFile(new URL(`../../supabase/migrations/${file}`, import.meta.url), 'utf8'))
    }
    const asUser = async id => {
      await db.exec('reset role')
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id])
      await db.exec('set role authenticated')
    }
    const one = async (sql, values = []) => (await db.query(sql, values)).rows[0]
    const rpc = async (board, action, payload) => (await one(
      'select public.mvp_board_operation($1, $2, $3::jsonb) as result', [board, action, JSON.stringify(payload)]
    )).result
    await asUser(a)
    const board = await one("insert into public.boards(title) values ('Coursework') returning *")
    const other = await one("insert into public.boards(title) values ('Another board') returning *")
    const c1 = await rpc(board.id, 'create_column', { title: 'Todo' })
    const c2 = await rpc(board.id, 'create_column', { title: 'Done' })
    const foreignColumn = await rpc(other.id, 'create_column', { title: 'Other board column' })
    const card = await rpc(board.id, 'create_card', { column_id: c1.id, title: 'Write report' })
    const second = await rpc(board.id, 'create_card', { column_id: c1.id, title: 'Deploy' })

    await t.test('CRUD keeps order arrays and validates titles', async () => {
      assert.deepEqual((await one('select column_order_ids from public.boards where id = $1', [board.id])).column_order_ids, [c1.id, c2.id])
      assert.deepEqual((await one('select card_order_ids from public.board_columns where id = $1', [c1.id])).card_order_ids, [card.id, second.id])
      await db.query("update public.boards set title = 'Cloud project', description = 'Report' where id = $1", [board.id])
      await db.query("update public.board_columns set title = 'In progress' where id = $1", [c1.id])
      await db.query("update public.cards set title = 'Final report', description = 'Updated' where id = $1", [card.id])
      assert.equal((await one('select description from public.cards where id = $1', [card.id])).description, 'Updated')
      await assert.rejects(() => db.query("update public.cards set title = '   ' where id = $1", [card.id]), /check constraint/)
    })

    await t.test('a second account cannot read, insert, update, delete or invoke RPC on owner data', async () => {
      await asUser(b)
      for (const table of ['boards', 'board_columns', 'cards']) {
        assert.equal((await db.query(`select * from public.${table}`)).rows.length, 0)
        assert.equal((await db.query(`update public.${table} set title = 'Forbidden' returning id`)).rows.length, 0)
        assert.equal((await db.query(`delete from public.${table} returning id`)).rows.length, 0)
      }
      await assert.rejects(() => db.query('insert into public.boards(user_id, title) values ($1, $2)', [a, 'Forged']), /row-level security/)
      await assert.rejects(() => db.query('insert into public.board_columns(board_id, title) values ($1, $2)', [board.id, 'Forged']), /row-level security/)
      await assert.rejects(() => db.query('insert into public.cards(column_id, title) values ($1, $2)', [c1.id, 'Forged']), /row-level security/)
      await assert.rejects(() => rpc(board.id, 'delete_card', { card_id: card.id }), /access denied/)
      await asUser(a)
      await assert.rejects(() => db.query('update public.boards set user_id = $1 where id = $2', [b, board.id]), /row-level security/)
    })

    await t.test('anonymous callers have neither table access nor RPC execution', async () => {
      await db.exec('reset role; set role anon')
      await assert.rejects(() => db.query('select * from public.boards'), /permission denied/)
      await assert.rejects(() => rpc(board.id, 'create_column', { title: 'No' }), /permission denied/)
      await asUser(a)
    })

    await t.test('column/card reorder survives reload and rejects duplicates or missing IDs', async () => {
      await rpc(board.id, 'reorder_columns', { ids: [c2.id, c1.id] })
      await rpc(board.id, 'reorder_cards', { column_id: c1.id, ids: [second.id, card.id] })
      assert.deepEqual((await one('select column_order_ids from public.boards where id = $1', [board.id])).column_order_ids, [c2.id, c1.id])
      await assert.rejects(() => rpc(board.id, 'reorder_columns', { ids: [c1.id, c1.id] }), /Invalid column order/)
      await assert.rejects(() => rpc(board.id, 'reorder_cards', { column_id: c1.id, ids: [card.id] }), /Invalid card order/)
      assert.deepEqual((await one('select card_order_ids from public.board_columns where id = $1', [c1.id])).card_order_ids, [second.id, card.id])
    })

    await t.test('invalid cross-board or incomplete moves do not partially change data', async () => {
      await assert.rejects(() => rpc(board.id, 'move_card', { card_id: card.id, source_id: c1.id, target_id: foreignColumn.id, source_ids: [second.id], target_ids: [card.id] }), /Both columns/)
      await assert.rejects(() => rpc(board.id, 'move_card', { card_id: card.id, source_id: c1.id, target_id: c2.id, source_ids: [], target_ids: [card.id] }), /Invalid source order/)
      await assert.rejects(() => rpc(board.id, 'move_card', { card_id: card.id, source_id: c1.id, target_id: c2.id, source_ids: [second.id], target_ids: [card.id, card.id] }), /Invalid target order/)
      assert.equal((await one('select column_id from public.cards where id = $1', [card.id])).column_id, c1.id)
      assert.deepEqual((await one('select card_order_ids from public.board_columns where id = $1', [c2.id])).card_order_ids, [])
    })

    await t.test('moves into empty columns and moves of the last card update all records', async () => {
      await rpc(board.id, 'move_card', { card_id: card.id, source_id: c1.id, target_id: c2.id, source_ids: [second.id], target_ids: [card.id] })
      await rpc(board.id, 'move_card', { card_id: second.id, source_id: c1.id, target_id: c2.id, source_ids: [], target_ids: [second.id, card.id] })
      assert.equal((await one('select column_id from public.cards where id = $1', [card.id])).column_id, c2.id)
      assert.deepEqual((await one('select card_order_ids from public.board_columns where id = $1', [c1.id])).card_order_ids, [])
      assert.deepEqual((await one('select card_order_ids from public.board_columns where id = $1', [c2.id])).card_order_ids, [second.id, card.id])
    })

    await t.test('deletion removes order references and cascades through board/column/card', async () => {
      await rpc(board.id, 'delete_card', { card_id: second.id })
      assert.deepEqual((await one('select card_order_ids from public.board_columns where id = $1', [c2.id])).card_order_ids, [card.id])
      await rpc(board.id, 'delete_column', { column_id: c2.id })
      assert.deepEqual((await one('select column_order_ids from public.boards where id = $1', [board.id])).column_order_ids, [c1.id])
      assert.equal((await db.query('select * from public.cards where id = $1', [card.id])).rows.length, 0)
      await rpc(board.id, 'create_card', { column_id: c1.id, title: 'Cascade me' })
      await db.query('delete from public.boards where id = $1', [board.id])
      assert.equal((await db.query('select * from public.board_columns where board_id = $1', [board.id])).rows.length, 0)
      assert.equal((await db.query('select * from public.cards')).rows.length, 0)
    })
  } finally { await db.close() }
})
