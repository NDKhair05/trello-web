import { useState } from 'react'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { createNewBoardAPI } from '~/apis'

function CreateBoard({ afterCreatedNewBoard }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async event => {
    event.preventDefault()
    if (!title.trim()) return
    setBusy(true)
    setError('')
    try {
      await createNewBoardAPI({ title, description })
      setOpen(false)
      setTitle('')
      setDescription('')
      afterCreatedNewBoard()
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  return <>
    <Button variant='contained' onClick={() => { setError(''); setOpen(true) }}>Create a new board</Button>
    <Dialog open={open} onClose={() => { if (!busy) setOpen(false) }} fullWidth maxWidth='sm'>
      <form onSubmit={submit}>
        <DialogTitle>Create a new board</DialogTitle>
        <DialogContent>
          {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
          <TextField autoFocus required fullWidth margin='dense' label='Title' inputProps={{ maxLength: 50 }} value={title} onChange={event => setTitle(event.target.value)} />
          <TextField fullWidth multiline minRows={3} margin='dense' label='Description' inputProps={{ maxLength: 1000 }} value={description} onChange={event => setDescription(event.target.value)} />
        </DialogContent>
        <DialogActions><Button disabled={busy} onClick={() => setOpen(false)}>Cancel</Button><Button type='submit' disabled={busy || !title.trim()} variant='contained'>{busy ? 'Creating...' : 'Create'}</Button></DialogActions>
      </form>
    </Dialog>
  </>
}
export default CreateBoard
