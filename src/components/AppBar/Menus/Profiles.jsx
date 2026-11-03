import { useState } from 'react'
import { Avatar, Button, Menu, MenuItem, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'

function Profiles() {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [anchor, setAnchor] = useState(null)
  const [busy, setBusy] = useState(false)
  const logout = async () => {
    setBusy(true)
    try { await dispatch(logoutUserAPI()).unwrap() }
    catch (error) { toast.error(error.message || 'Logout failed.') }
    finally { setBusy(false); setAnchor(null) }
  }
  return <>
    <Button color='inherit' aria-label='Account menu' onClick={event => setAnchor(event.currentTarget)}><Avatar sx={{ width: 32, height: 32 }}>{user?.email?.[0]?.toUpperCase()}</Avatar></Button>
    <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
      <Typography sx={{ px: 2, py: 1 }}>{user?.email}</Typography>
      <MenuItem disabled={busy} onClick={logout}>{busy ? 'Logging out...' : 'Logout'}</MenuItem>
    </Menu>
  </>
}
export default Profiles
