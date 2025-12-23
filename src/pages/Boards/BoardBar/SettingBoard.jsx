import * as React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import InfoIcon from '@mui/icons-material/Info'
import ShareIcon from '@mui/icons-material/Share'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import SettingsIcon from '@mui/icons-material/Settings'
import { Drawer, ListItem, ListItemButton } from '@mui/material'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import AddchartIcon from '@mui/icons-material/Addchart'
import ListIcon from '@mui/icons-material/List'
import InventoryIcon from '@mui/icons-material/Inventory'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import RemoveIcon from '@mui/icons-material/Remove'
import ThemeSetting from './SettingBoardComponents/ThemeSetting'
import { deleteBoardDetailsAPI } from '~/apis'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function SettingBoard({ board }) {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  const toggleDrawer = (newOpen) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setOpen(newOpen)
  }
  const confirmDeleteBoard = useConfirm()
  const handleClickDeleteBoard = () => {
    const boardId = board._id
    confirmDeleteBoard({
      title: 'Delete this Board?',
      description: 'This action will delete permanently your Board and its Columns. Are you sure?',
      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // cancellationButtonProps: { color:'inherit' },
      // confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      deleteBoardDetailsAPI(boardId)
        .then(res => {
          toast.success(res?.deleteResult)
          navigate('/boards')
        })
    })
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onKeyDown={toggleDrawer(false)}>
      <List sx={{ py: 0 }}>
        {/* Section 1 */}
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <PersonAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Invite</ListItemText>
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InfoIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Description</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Print, export and share</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <StarOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Star</ListItemText>
          </ListItemButton>
        </ListItem>

        <Divider />

        {/* Section 2 */}
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButton>
        </ListItem>

        <ThemeSetting board={board} />

        <Divider />

        {/* Section 3 */}
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ElectricBoltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Automation</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <RocketLaunchIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Power-Ups</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <LocalOfferIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Labels</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <StickyNote2Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Stickers</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AddchartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Make template</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ListIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Activity</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InventoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Archived items</ListItemText>
          </ListItemButton>
        </ListItem>

        <Divider />

        {/* Section 4 */}
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <RemoveRedEyeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Watch</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Copy board</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <MailOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Email-to-board settings</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={handleClickDeleteBoard} >
            <ListItemIcon>
              <RemoveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete board</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )
  return (

    <div>
      <Button
        sx={{ color: 'white' }}
        id="basic-button-workspaces"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={toggleDrawer(true)}
      >
        <MoreHorizIcon/>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
        {DrawerList}
      </Drawer>
    </div>
  )
}

export default SettingBoard