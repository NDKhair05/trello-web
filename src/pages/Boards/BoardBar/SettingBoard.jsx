import { useState } from 'react'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { deleteBoardDetailsAPI, updateBoardDetailsAPI } from '~/apis'
import { fetchBoardDetailsAPI } from '~/redux/activeBoard/activeBoardSlice'

function SettingBoard({ board }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const save = async event => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await updateBoardDetailsAPI(board._id, { title, description })
      await dispatch(fetchBoardDetailsAPI(board._id)).unwrap()
      setOpen(false)
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  const remove = async () => {
    try { await confirm({ title: 'Delete board?', description: 'All columns and cards will also be deleted.' }) }
    catch { return }
    setBusy(true)
    try { await deleteBoardDetailsAPI(board._id); navigate('/boards') }
    catch (err) { toast.error(err.message) }
    finally { setBusy(false) }
  }
  return <>
    <Button color='inherit' disabled={busy} onClick={() => { setTitle(board.title); setDescription(board.description); setError(''); setOpen(true) }}>Edit board</Button>
    <Button color='inherit' disabled={busy} onClick={remove}>Delete board</Button>
    <Dialog open={open} onClose={() => { if (!busy) setOpen(false) }} fullWidth maxWidth='sm'>
      <form onSubmit={save}><DialogTitle>Edit board</DialogTitle><DialogContent>
        {error && <Alert severity='error'>{error}</Alert>}
        <TextField autoFocus required fullWidth margin='dense' label='Title' inputProps={{ maxLength: 50 }} value={title} onChange={event => setTitle(event.target.value)} />
        <TextField fullWidth multiline minRows={3} margin='dense' label='Description' inputProps={{ maxLength: 1000 }} value={description} onChange={event => setDescription(event.target.value)} />
      </DialogContent><DialogActions><Button disabled={busy} onClick={() => setOpen(false)}>Cancel</Button><Button type='submit' disabled={busy || !title.trim()} variant='contained'>Save</Button></DialogActions></form>
    </Dialog>
  </>
}
export default SettingBoard
