import { generatePlaceholderCard } from '../utils/formatters.js'

export const mapUser = (user) => user ? {
  _id: user.id, email: user.email, displayName: user.email?.split('@')[0] || 'User'
} : null
export const mapCard = (card, boardId) => ({
  _id: card.id, columnId: card.column_id, boardId, title: card.title, description: card.description || ''
})
export const mapColumn = (column) => ({
  _id: column.id, boardId: column.board_id, title: column.title, cardOrderIds: column.card_order_ids || [], cards: []
})
export const mapBoard = (board) => ({
  _id: board.id, title: board.title, description: board.description || '', type: 'private',
  ownerIds: [board.user_id], columnOrderIds: board.column_order_ids || [],
  theme: board.theme || { id: 0, type: 'default', value: 'default' }
})
const ordered = (items, ids) => {
  const byId = new Map(items.map(item => [item._id, item]))
  return [...ids.map(id => byId.get(id)).filter(Boolean), ...items.filter(item => !ids.includes(item._id))]
}
export const withPlaceholder = (column) => {
  if (column.cards.length) return column
  const placeholder = generatePlaceholderCard(column)
  return { ...column, cards: [placeholder], cardOrderIds: [placeholder._id] }
}
// Preserve the existing Dnd Kit UI shape while storing relational Postgres data.
export const assembleBoard = (row) => ({
  ...mapBoard(row),
  columns: ordered((row.board_columns || []).map(column => {
    const mapped = mapColumn(column)
    mapped.cards = ordered((column.cards || []).map(card => mapCard(card, row.id)), mapped.cardOrderIds)
    return withPlaceholder(mapped)
  }), row.column_order_ids || [])
})
export const realIds = (ids = []) => ids.filter(id => !id.endsWith('-placeholder-card'))
