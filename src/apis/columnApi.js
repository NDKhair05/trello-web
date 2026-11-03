import { getSupabase, unwrap } from '../lib/supabase.js'
import { boardOperation } from './boardApi.js'
import { mapColumn, realIds } from './mappers.js'

const getColumn = async (id) => unwrap(await getSupabase().from('board_columns').select().eq('id', id).single())
export const createNewColumnAPI = async ({ boardId, title }) => mapColumn(
  await boardOperation(boardId, 'create_column', { title: title.trim() })
)
export const updateColumnDetailsAPI = async (id, data) => {
  if (data.cardOrderIds) {
    const column = await getColumn(id)
    await boardOperation(column.board_id, 'reorder_cards', { column_id: id, ids: realIds(data.cardOrderIds) })
    return mapColumn(await getColumn(id))
  }
  return mapColumn(unwrap(await getSupabase().from('board_columns').update({ title: data.title.trim() }).eq('id', id).select().single()))
}
export const deleteColumnDetailsAPI = async (id) => {
  const column = await getColumn(id)
  await boardOperation(column.board_id, 'delete_column', { column_id: id })
  return { deleteResult: 'Column deleted.' }
}
