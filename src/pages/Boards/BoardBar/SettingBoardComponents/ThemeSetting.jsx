import { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CancelIcon from '@mui/icons-material/Cancel'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import { updateBoardDetailsAPI } from '~/apis'

import { Grid, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material'
import { gradientThemes } from '~/utils/formatters'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch } from 'react-redux'
/**
 * Bản chất của cái component SidebarCreateBoardModal này chúng ta sẽ trả về một cái SidebarItem để hiển thị ở màn Board List cho phù hợp giao diện bên đó, đồng thời nó cũng chứa thêm một cái Modal để xử lý riêng form create board nhé.
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ThemeSetting({ board }) {
  const { handleSubmit, reset } = useForm()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState({})
  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => {
    setIsOpen(false)
    // Reset lại toàn bộ form khi đóng Modal
    reset()
  }


  const submitSelectTheme = () => {
    const newBoard = { ...board }
    newBoard.theme = theme
    // const { title, description, type } = data
    updateBoardDetailsAPI(newBoard._id, { theme: theme }).then(() => {
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  const ThemeSelector = ({ value, onChange }) => (
    <Box sx={{ mb: 1.5 }} >
      <Grid container spacing={{ xs: 2, md: 2.5 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        {gradientThemes.map(theme => (
          <Grid item key={theme.id} size={{ xs: 2, sm: 4, md: 4 }}>
            <Paper
              onClick={() => value.id === theme.id ? onChange({}) : onChange(theme) }
              elevation={value?.id === theme.id ? 6 : 0}
              sx={{
                position: 'relative',
                height: 40,
                width: 60,
                borderRadius: 2,
                cursor: 'pointer',
                transform: value?.id === theme.id ? '5px' : '',
                transition: '0.2s',
                background: 'linear-gradient(135deg, #1976d2 50%, #34495e 50%)',
                backgroundImage: (theme._id === 0 ? 'none' : theme.value),
                /* Zoom nhẹ khi hover */
                '&:hover': {
                  transform: 'scale(1.1)'
                },
                // Lớp phủ overlay
                '&::after': {
                  content: '""',
                  borderRadius: 2,
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: value?.id === theme.id ? 'rgba(0, 0, 0, 0.15)' : 'transparent',
                  transition: '0.25s'
                },
                /* Icon check */
                '&::before': {
                  content: value?.id === theme.id ? '"✔"' : '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#fff',
                  fontSize: 16,
                  opacity: value?.id === theme.id ? 1 : 0,
                  transition: '0.25s',
                  zIndex: 2
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )

  // <>...</> nhắc lại cho bạn anof chưa biết hoặc quên nhé: nó là React Fragment, dùng để bọc các phần tử lại mà không cần chỉ định DOM Node cụ thể nào cả.
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={handleOpenModal}>
          <ListItemIcon>
            <Paper sx={{
              height: 20,
              width: 30,
              borderRadius: 2,
              bgcolor: (theme) => (board?.theme?.type === 'default' ? (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2') : ''),
              backgroundImage: board?.theme?.type === 'gradient' ? board?.theme?.value : ''
            }} />
          </ListItemIcon>
          <ListItemText>Select theme</ListItemText>
        </ListItemButton>
      </ListItem>

      <Modal
        open={isOpen}
        // onClose={handleCloseModal} // chỉ sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '20px 30px',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white'
        }}>
          <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer'
          }}>
            <CancelIcon
              color="error"
              sx={{ '&:hover': { color: 'error.light' } }}
              onClick={handleCloseModal} />
          </Box>
          <Box id="modal-modal-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="h2">Edit theme</Typography>
          </Box>
          <Box id="modal-modal-description" sx={{ my: 2 }}>
            <form onSubmit={handleSubmit(submitSelectTheme)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <ThemeSelector
                  value = {theme}
                  onChange = {setTheme}
                />

                <Box sx={{ alignSelf: 'flex-end' }}>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default ThemeSetting
