import { getSupabase, unwrap } from '../lib/supabase.js'
import { boardOperation } from './boardApi.js'
import { mapCard } from './mappers.js'

export const createNewCardAPI = async ({ boardId, columnId, title }) => mapCard(
  await boardOperation(boardId, 'create_card', { column_id: columnId, title: title.trim() }), boardId
)
export const updateCardDetailsAPI = async (id, data) => {
  const update = {}
  if (data.title !== undefined) update.title = data.title.trim()
  if (data.description !== undefined) update.description = data.description
  return mapCard(unwrap(await getSupabase().from('cards').update(update).eq('id', id).select().single()))
}
export const deleteCardDetailsAPI = async (id, boardId) => {
  await boardOperation(boardId, 'delete_card', { card_id: id })
  return { deleteResult: 'Card deleted.' }
}
