import { Box, Chip, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import SettingBoard from './SettingBoard'

function BoardBar({ board }) {
  return <Box sx={{ height: theme => theme.trello.boardBarHeight, px: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'primary.main', color: 'white' }}>
    <Typography variant='h6' noWrap sx={{ flexGrow: 1 }}>{board.title}</Typography>
    <Chip size='small' icon={<LockIcon />} label='Private' sx={{ bgcolor: 'background.paper' }} />
    <SettingBoard board={board} />
  </Box>
}
export default BoardBar
