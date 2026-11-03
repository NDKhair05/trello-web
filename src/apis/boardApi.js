import { getSupabase, unwrap } from '../lib/supabase.js'
import { assembleBoard, mapBoard, realIds } from './mappers.js'

export const boardOperation = async (boardId, action, payload = {}) => unwrap(
  await getSupabase().rpc('mvp_board_operation', { p_board_id: boardId, p_action: action, p_payload: payload })
)
export const fetchBoardsAPI = async (searchPath = '') => {
  const params = new URLSearchParams(searchPath)
  const page = Math.max(1, Number(params.get('page')) || 1)
  const limit = 12
  let query = getSupabase().from('boards').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  const title = params.get('q[title]') || params.get('title')
  if (title) query = query.ilike('title', `%${title}%`)
  const result = await query.range((page - 1) * limit, page * limit - 1)
  return { boards: unwrap(result).map(mapBoard), totalBoards: result.count }
}
export const fetchBoardDetails = async (boardId) => assembleBoard(unwrap(
  await getSupabase().from('boards').select('*, board_columns(*, cards(*))').eq('id', boardId).single()
))
export const createNewBoardAPI = async ({ title, description = '', theme }) => {
  const { user } = unwrap(await getSupabase().auth.getUser())
  if (!user) throw new Error('Please sign in again.')
  return mapBoard(unwrap(await getSupabase().from('boards').insert({
    user_id: user.id, title: title.trim(), description: description.trim(), ...(theme ? { theme } : {})
  }).select().single()))
}
export const updateBoardDetailsAPI = async (id, data) => {
  if (data.columnOrderIds) {
    await boardOperation(id, 'reorder_columns', { ids: realIds(data.columnOrderIds) })
    return fetchBoardDetails(id)
  }
  const update = {}
  if (data.title !== undefined) update.title = data.title.trim()
  if (data.description !== undefined) update.description = data.description.trim()
  if (data.theme !== undefined) update.theme = data.theme
  return mapBoard(unwrap(await getSupabase().from('boards').update(update).eq('id', id).select().single()))
}
export const deleteBoardDetailsAPI = async (id) => {
  unwrap(await getSupabase().from('boards').delete().eq('id', id).select('id').single())
  return { deleteResult: 'Board deleted.' }
}
export const moveCardToDifferentColumnAPI = async (data) => boardOperation(data.boardId, 'move_card', {
  card_id: data.currentCardId, source_id: data.prevColumnId, target_id: data.nextColumnId,
  source_ids: realIds(data.prevCardOrderIds), target_ids: realIds(data.nextCardOrderIds)
})
