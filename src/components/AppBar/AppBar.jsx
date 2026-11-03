import { Box, Button, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { Link } from 'react-router-dom'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import Profiles from './Menus/Profiles'

function AppBar() {
  return (
    <Box sx={{ height: theme => theme.trello.appBarHeight, px: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'primary.dark', color: 'white' }}>
      <Button component={Link} to='/boards' color='inherit' startIcon={<DashboardIcon />}><Typography fontWeight='bold'>Trello Cloud</Typography></Button>
      <Box sx={{ flexGrow: 1 }} />
      <ModeSelect />
      <Profiles />
    </Box>
  )
}
export default AppBar
