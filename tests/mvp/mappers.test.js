import { test } from 'node:test'
import assert from 'node:assert/strict'
import { assembleBoard, realIds, withPlaceholder } from '../../src/apis/mappers.js'

test('nested database rows produce saved drag order, including empty columns', () => {
  const board = assembleBoard({
    id: 'board', user_id: 'user', title: 'Cloud', column_order_ids: ['done', 'todo'],
    board_columns: [
      { id: 'todo', board_id: 'board', title: 'Todo', card_order_ids: ['b', 'a'], cards: [
        { id: 'a', column_id: 'todo', title: 'First' }, { id: 'b', column_id: 'todo', title: 'Second' }
      ] },
      { id: 'done', board_id: 'board', title: 'Done', card_order_ids: [], cards: [] }
    ]
  })
  assert.deepEqual(board.columns.map(c => c._id), ['done', 'todo'])
  assert.deepEqual(board.columns[1].cards.map(c => c._id), ['b', 'a'])
  assert.equal(board.columns[1].cards[0].boardId, 'board')
  assert.equal(board.columns[0].cards[0].FE_PlaceholderCard, true)
  assert.deepEqual(realIds(board.columns[0].cardOrderIds), [])
})

test('deleting the last card leaves a valid empty-column drop target without persisting fake IDs', () => {
  const column = withPlaceholder({ _id: 'column', boardId: 'board', cards: [], cardOrderIds: [] })
  assert.equal(column.cards[0].columnId, 'column')
  assert.deepEqual(realIds(column.cardOrderIds), [])
  assert.deepEqual(realIds(['real-card', ...column.cardOrderIds]), ['real-card'])
})
