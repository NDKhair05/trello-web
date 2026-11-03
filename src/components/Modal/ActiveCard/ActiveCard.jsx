import { useEffect, useState } from 'react'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useConfirm } from 'material-ui-confirm'
import { clearAndHideCurrentActiveCard, selectCurrentActiveCard, selectIsShowModalActiveCard } from '~/redux/acitveCard/activeCardSlice'
import { fetchBoardDetailsAPI, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { deleteCardDetailsAPI, updateCardDetailsAPI } from '~/apis'

function ActiveCard() {
  const dispatch = useDispatch()
  const confirm = useConfirm()
  const card = useSelector(selectCurrentActiveCard)
  const open = useSelector(selectIsShowModalActiveCard)
  const board = useSelector(selectCurrentActiveBoard)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { setTitle(card?.title || ''); setDescription(card?.description || ''); setError('') }, [card])
  const close = () => dispatch(clearAndHideCurrentActiveCard())
  const save = async event => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await updateCardDetailsAPI(card._id, { title, description })
      await dispatch(fetchBoardDetailsAPI(board._id)).unwrap()
      close()
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  const remove = async () => {
    try { await confirm({ title: 'Delete card?', description: 'This action cannot be undone.' }) }
    catch { return }
    setBusy(true)
    setError('')
    try {
      await deleteCardDetailsAPI(card._id, board._id)
      await dispatch(fetchBoardDetailsAPI(board._id)).unwrap()
      close()
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  return <Dialog open={open && Boolean(card)} onClose={() => { if (!busy) close() }} fullWidth maxWidth='sm'>
    <form onSubmit={save}><DialogTitle>Edit card</DialogTitle><DialogContent>
      {error && <Alert severity='error'>{error}</Alert>}
      <TextField autoFocus required fullWidth margin='dense' label='Title' inputProps={{ maxLength: 50 }} value={title} onChange={event => setTitle(event.target.value)} />
      <TextField fullWidth multiline minRows={5} margin='dense' label='Description' inputProps={{ maxLength: 10000 }} value={description} onChange={event => setDescription(event.target.value)} />
    </DialogContent><DialogActions>
      <Button color='error' disabled={busy} onClick={remove}>Delete card</Button>
      <Button disabled={busy} onClick={close}>Cancel</Button>
      <Button type='submit' disabled={busy || !title.trim()} variant='contained'>Save</Button>
    </DialogActions></form>
  </Dialog>
}
export default ActiveCard
