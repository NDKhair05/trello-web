import { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Column from './Column/Column'
import { createNewColumnAPI } from '~/apis'
import { fetchBoardDetailsAPI, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

function ListColumns({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const add = async event => {
    event.preventDefault()
    if (!title.trim() || busy) return
    setBusy(true)
    try {
      await createNewColumnAPI({ boardId: board._id, title })
      setTitle('')
      setOpen(false)
      await dispatch(fetchBoardDetailsAPI(board._id)).unwrap()
    } catch (err) { toast.error(err.message) }
    finally { setBusy(false) }
  }
  return <SortableContext items={columns.map(c => c._id)} strategy={horizontalListSortingStrategy}>
    <Box sx={{ width: '100%', height: '100%', display: 'flex', overflowX: 'auto', overflowY: 'hidden', pb: 2 }}>
      {columns.map(column => <Column key={column._id} column={column} />)}
      <Box sx={{ minWidth: 280, mx: 2, height: 'fit-content', p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
        {!open ? <Button fullWidth onClick={() => setOpen(true)}>Add new column</Button> : <Box component='form' onSubmit={add}>
          <TextField autoFocus required fullWidth size='small' label='Column title' inputProps={{ maxLength: 50 }} value={title} onChange={event => setTitle(event.target.value)} />
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}><Button type='submit' disabled={busy || !title.trim()} variant='contained'>Add column</Button><Button disabled={busy} onClick={() => setOpen(false)}>Cancel</Button></Box>
        </Box>}
      </Box>
    </Box>
  </SortableContext>
}
export default ListColumns
