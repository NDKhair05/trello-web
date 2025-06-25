import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Button, Tooltip } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      borderBottom: '1px solid white'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="NguyenDacKhai MERN stack Board"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private WorkSpace"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            ':hover': { borderColor: 'white' }
          }}
        >Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none'
            }
          }}
        >
          <Tooltip title= "Nguyễn Đắc Khải">
            <Avatar
              alt="Nguyễn Đắc Khải"
              src="https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-1/495859421_1257431382407709_1028444624137258226_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=CBRIt8uq2-sQ7kNvwEOGE_L&_nc_oc=AdlxMj2hkPo0pYj9QehPzsHC0r24S4FiXxfB-bwSjIY-KfiJzfXfJHvqhTF1ujNEMKpOhrG5Vuzc6-ZDIpjCj3W4&_nc_zt=24&_nc_ht=scontent-hkg4-1.xx&_nc_gid=6EPsDk4na8JYtfrQ59dhkw&oh=00_AfO_EZgDawf2Sabnevrm9JEHZaStTxUqD019F4qAPkJrDQ&oe=685B7939"
            />
          </Tooltip>
          <Tooltip title= "Nguyễn Thị Nguyệt An">
            <Avatar
              alt="Nguyễn Thị Nguyệt An"
              src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-1/481986619_2089976368143359_2545968373547731710_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeGVglj_OLvZ786WENTuHVEp7xeNnjXPY3_vF42eNc9jf00flcEOqe5UGRVq_XEph0SJusDsH6t2eDVG4q25E1_7&_nc_ohc=XJ-678wKjCkQ7kNvwGyILBI&_nc_oc=AdmQpkl_nHQnRKKhzBuyPHik74WocYLcwl7VRkohqDTJqU6ar8nP8vUCUyK_iL406EaLEYijr5VOXSm86pD3SnJ1&_nc_zt=24&_nc_ht=scontent.fdad3-5.fna&_nc_gid=R_jedWY4Xy9s49GotoCy0w&oh=00_AfMSaOIU8gvyhfkDO1-ubyY70G4qSJDNaTpLPVUAQR7yug&oe=685DEDC0"
            />
          </Tooltip>
          <Tooltip title= "Trần Ngọc Anh Huy">
            <Avatar
              alt="Trần Ngọc Anh Huy"
              src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-1/506151906_1296206338590911_4584634224180546269_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeGibH719vbfgyTX8FN5weelWXgyTJQfSP9ZeDJMlB9I_4iACm__fOqW80GkDwVijxsgqwImJReLn-XUiTF1hGDL&_nc_ohc=WxT7Zk2URcYQ7kNvwGvON8T&_nc_oc=Adk6znQQRzUwIuIotrRJ43xpABfrlh6TS1_jZOH4oeVQrONV03xGVuGt_AtM3oPcE7z7rBjK5__jegKMzNU4hEJG&_nc_zt=24&_nc_ht=scontent.fdad3-5.fna&_nc_gid=7VqrnxB_HiPYTPDEWnSnTw&oh=00_AfPG-1UeW-X6TsjeaCWCtfNk76qQlKOhLiuXwZ8AL40iEA&oe=685E00F1"
            />
          </Tooltip>
          <Tooltip title= "Nguyễn Hữu Quốc">
            <Avatar
              alt="Nguyễn Hữu Quốc"
              src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-1/483100905_2025810544594531_4465492028689865996_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFD9HHwldBoIw1VtfLXsoUcPIOKTBOX3-E8g4pME5ff4arfs1qZNF5s6E9lkfDFAnUJmT-U5_4rfsPtWbGZXS_L&_nc_ohc=ct1PZwpw380Q7kNvwEk8czZ&_nc_oc=Adkril2Nm-R4R0JP7NKQBCK51tjau2527XBsaBbRlf8fPCJcucPtNIPqvhWTKEVrQ8x7Pu676QDfSd9c9Pa0Xi2Y&_nc_zt=24&_nc_ht=scontent.fdad3-5.fna&_nc_gid=hS2T5aesi-M6_EglpiEb6Q&oh=00_AfOzrQZ3DqT4_dkR30eX-mRcXEmpqQpOd0sTeZ449eeGKg&oe=685E0A9F"
            />
          </Tooltip>
          <Tooltip title= "Nguyễn Văn Khanh">
            <Avatar
              alt="Nguyễn Văn Khanh"
              src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-1/283663327_1196201331213807_48474573773401443_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHCoqijdNLyGQ0dl3NELvu13TuXnwNxASHdO5efA3EBIeqLmMsnz58fWnzQJ-0catUnMm6u3Q-S36zheoI5jbuP&_nc_ohc=drpw8cS8DAMQ7kNvwGpnn1F&_nc_oc=Adk1Nefv0OYCT4KifQyw3Ju2LiT60mc_AZUOqSHMWYOsR7e45uz9FU_eQomhf7A_zfIzpFLnSxGxNEcxzmC3-eSE&_nc_zt=24&_nc_ht=scontent.fdad3-5.fna&_nc_gid=3PpdoQJhGEOE2jUE9mtCRA&oh=00_AfOXxYFIAF3tsnXvNGKAIhbtis-v1dkKldIaVvjPrZKEbA&oe=685DFDE7"
            />
          </Tooltip>
          <Tooltip title= "Nguyễn Văn Hoàng">
            <Avatar
              alt="Nguyễn Văn Hoàng"
              src="https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/481457766_1169632857969875_643001931072875836_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeG-zscUBr9in8W2XQSZnUH2QryNmUWBb6BCvI2ZRYFvoHvFu9gEa_olSQiDyhBvYVAKjOTdXNELyKT8cLtUezUT&_nc_ohc=KIHfIwL1vQ8Q7kNvwGtX1D8&_nc_oc=AdknGscnMkyTLvwZbF3ZoGRI3KJzu6qo8y7n0C2C-fDw6x_zIvmm6-Z6thyEHY16deR7gcB1ZQQdr5EZhBIhcCWf&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=gF7O2avulAXOuj_pM6csUQ&oh=00_AfPlmLfFWkCLLke8iAg0QRaXaUktXfbgIsh1otmfqjitBA&oe=685E1F6A"
            />
          </Tooltip>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
