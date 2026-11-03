import { useState } from 'react'
import { Box, Button, IconButton, TextField, Tooltip } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { fetchBoardDetailsAPI, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import ListCards from './ListCards/ListCards'

function Column({ column }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const confirm = useConfirm()
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column._id, data: { ...column } })
  const mutate = async operation => {
    if (busy) return
    setBusy(true)
    try { await operation(); await dispatch(fetchBoardDetailsAPI(board._id)).unwrap() }
    catch (error) { toast.error(error.message) }
    finally { setBusy(false) }
  }
  const addCard = async event => {
    event.preventDefault()
    if (!title.trim()) return
    await mutate(async () => {
      await createNewCardAPI({ boardId: board._id, columnId: column._id, title })
      setTitle('')
      setAdding(false)
    })
  }
  const remove = async () => {
    try { await confirm({ title: 'Delete column?', description: 'All cards in this column will also be deleted.' }) }
    catch { return }
    await mutate(() => deleteColumnDetailsAPI(column._id))
  }
  return <Box ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }} {...attributes}
    sx={{ minWidth: 300, maxWidth: 300, ml: 2, borderRadius: 2, bgcolor: theme => theme.palette.mode === 'dark' ? '#333643' : '#ebecf0', height: 'fit-content', maxHeight: theme => `calc(${theme.trello.boardContentHeight} - 32px)`, pointerEvents: busy ? 'none' : 'auto' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, gap: 0.5 }}>
      <Tooltip title='Drag column'><IconButton size='small' aria-label='Drag column' {...listeners}><DragIndicatorIcon fontSize='small' /></IconButton></Tooltip>
      <ToggleFocusInput value={column.title} inputProps={{ maxLength: 50, 'aria-label': 'Column title' }} onChangedValue={value => mutate(() => updateColumnDetailsAPI(column._id, { title: value }))} />
      <Tooltip title='Delete column'><IconButton size='small' aria-label='Delete column' disabled={busy} onClick={remove}><DeleteOutlineIcon fontSize='small' /></IconButton></Tooltip>
    </Box>
    <ListCards cards={column.cards} />
    <Box sx={{ p: 1 }}>
      {!adding ? <Button disabled={busy} fullWidth onClick={() => setAdding(true)}>Add new card</Button> : <Box component='form' onSubmit={addCard}>
        <TextField autoFocus required fullWidth label='Card title' size='small' inputProps={{ maxLength: 50 }} value={title} onChange={event => setTitle(event.target.value)} />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}><Button type='submit' disabled={busy || !title.trim()} variant='contained'>Add</Button><Button disabled={busy} onClick={() => setAdding(false)}>Cancel</Button></Box>
      </Box>}
    </Box>
  </Box>
}
export default Column
