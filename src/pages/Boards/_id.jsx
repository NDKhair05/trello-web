import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, Box, Button, Container, LinearProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'
import AppBar from '~/components/AppBar/AppBar'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { moveCardToDifferentColumnAPI, updateBoardDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { realIds } from '~/apis/mappers'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { clearAndHideCurrentActiveCard } from '~/redux/acitveCard/activeCardSlice'

function Board() {
  const { boardId } = useParams()
  const dispatch = useDispatch()
  const { currentActiveBoard: board, loading, error } = useSelector(state => state.activeBoard)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [revision, setRevision] = useState(0)
  const savingRef = useRef(false)
  const routeRef = useRef(boardId)
  routeRef.current = boardId
  useEffect(() => {
    setSaveError('')
    dispatch(clearAndHideCurrentActiveCard())
    const request = dispatch(fetchBoardDetailsAPI(boardId))
    return () => request.abort()
  }, [dispatch, boardId])
  const saveOrder = async (nextBoard, operation) => {
    if (savingRef.current) return
    savingRef.current = true
    const previous = cloneDeep(board)
    const savingBoardId = boardId
    setSaving(true)
    setSaveError('')
    dispatch(updateCurrentActiveBoard(nextBoard))
    try {
      await operation()
    } catch (err) {
      if (routeRef.current === savingBoardId) {
        setSaveError(err.message)
        dispatch(updateCurrentActiveBoard(previous))
        setRevision(value => value + 1)
        // Recover if another tab changed the board or the write reached the server before a network error.
        await dispatch(fetchBoardDetailsAPI(savingBoardId))
      }
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }
  const moveColumn = columns => saveOrder({ ...board, columns, columnOrderIds: columns.map(c => c._id) },
    () => updateBoardDetailsAPI(board._id, { columnOrderIds: columns.map(c => c._id) }))
  const moveCardInTheSameColumn = (cards, ids, columnId) => {
    const next = cloneDeep(board)
    const column = next.columns.find(c => c._id === columnId)
    column.cards = cards
    column.cardOrderIds = ids
    return saveOrder(next, () => updateColumnDetailsAPI(columnId, { cardOrderIds: realIds(ids) }))
  }
  const moveCardToDifferentColumn = (cardId, sourceId, targetId, columns) => saveOrder({ ...board, columns },
    () => moveCardToDifferentColumnAPI({
      boardId: board._id, currentCardId: cardId, prevColumnId: sourceId, nextColumnId: targetId,
      prevCardOrderIds: columns.find(c => c._id === sourceId)?.cardOrderIds || [],
      nextCardOrderIds: columns.find(c => c._id === targetId)?.cardOrderIds || []
    }))
  if (!board || board._id !== boardId) return <><AppBar />{loading ? <PageLoadingSpinner caption='Loading board...' /> : <Box sx={{ p: 4 }}><Alert severity='error'>{error || 'Board not found or access denied.'}</Alert><Button component={Link} to='/boards'>Back to boards</Button></Box>}</>
  return <Container disableGutters maxWidth={false} sx={{ height: '100vh', bgcolor: 'primary.dark' }}>
    <AppBar />
    <Box sx={{ pointerEvents: saving ? 'none' : 'auto' }}>
      <BoardBar board={board} />
      {saving && <LinearProgress sx={{ position: 'absolute', width: '100%', zIndex: 10 }} />}
      {(saveError || error) && <Alert severity='error' onClose={() => setSaveError('')}>{saveError || error}</Alert>}
      <BoardContent key={`${boardId}-${revision}`} board={board} moveColumn={moveColumn} moveCardInTheSameColumn={moveCardInTheSameColumn} moveCardToDifferentColumn={moveCardToDifferentColumn} />
      <ActiveCard />
    </Box>
  </Container>
}
export default Board
