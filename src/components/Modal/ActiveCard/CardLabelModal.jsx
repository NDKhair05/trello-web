// import styled from '@emotion/styled'
// import { Box, Button, Checkbox, Grid, Paper, Typography } from '@mui/material'
// import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
// import Modal from '@mui/material/Modal'
// import CancelIcon from '@mui/icons-material/Cancel'
// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { labelColorsDefault } from '~/utils/formatters'
// import { useSelector } from 'react-redux'
// import { selectCurrentActiveCard } from '~/redux/acitveCard/activeCardSlice'


// function CardLabelModal ({ labels = [], onUpdateCardLabels }) {
//   const { handleSubmit } = useForm()
//   const [isOpen, setIsOpen] = useState(false)
//   const handleOpenModal = () => setIsOpen(true)
//   const handleCloseModal = () => {
//     setIsOpen(false)
//   }
//   const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } }
//   const [selectedColorIds, setSelectedColorIds] = useState([])

//   const handleSelectLabel = (colorId) => {
//     // Dùng callback
//     setSelectedColorIds((prev) => {
//       if (prev.includes(colorId)) {
//         return prev.filter(id => id !== colorId)
//       }
//       return [...prev, colorId]
//     })
//   }

//   const submitApplyLabel = (label) => {
//     // const labelInfo =
//     const incomingLabelInfo = {
//       colorId: label.id,
//       colorValue: label.value,
//       text: label?.text || '',
//       action:
//     }

//     onUpdateCardLabels(incomingLabelInfo)
//   }

//   const SidebarItem = styled(Box)(({ theme }) => ({
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: '600',
//     color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
//     backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
//     padding: '10px',
//     borderRadius: '4px',
//     '&:hover': {
//       backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
//       '&.active': {
//         color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
//         backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
//       }
//     }
//   }))

//   const LabelGrid = () => (
//     <Grid container spacing={2} direction="column" >
//       {labelColorsDefault.map(color => (
//         <Grid item key={color.id} >
//           <Box sx={{
//             display: 'flex',
//             flexGrow: 1
//           }}>
//             <Checkbox
//               {...label}
//               checked={ selectedColorIds.includes(color.id) ? true : false }
//               onChange={() => handleSelectLabel(color.id)}
//             />
//             <Paper
//               onClick= {() => handleSelectLabel(color.id)}
//               sx={{
//                 position: 'relative',
//                 mt: '3px',
//                 height: 35,
//                 width: 250,
//                 borderRadius: 1,
//                 cursor: 'pointer',
//                 transition: '0.2s',
//                 background: color.value,
//                 '&:hover': {
//                   opacity: 0.75
//                 }
//               }}
//             />
//           </Box>

//         </Grid>
//       ))}
//     </Grid>
//   )


//   return (
//     <Box>
//       <SidebarItem className='active' onClick={handleOpenModal}><LocalOfferOutlinedIcon fontSize="small" />Labels</SidebarItem>
//       <Modal
//         open={isOpen}
//         // onClose={handleCloseModal} // chỉ sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: 400,
//           bgcolor: 'white',
//           boxShadow: 24,
//           borderRadius: '8px',
//           border: 'none',
//           outline: 0,
//           padding: '20px 30px',
//           backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white'
//         }}>
//           <Box sx={{
//             position: 'absolute',
//             top: '10px',
//             right: '10px',
//             cursor: 'pointer'
//           }}>
//             <CancelIcon
//               color="error"
//               sx={{ '&:hover': { color: 'error.light' } }}
//               onClick={handleCloseModal} />
//           </Box>
//           <Box id="modal-modal-title" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//             <Typography variant="h6" component="h2">Label</Typography>
//             <LocalOfferOutlinedIcon fontSize='medium' sx={{ ml: 1 }}/>
//           </Box>
//           <Box id="modal-modal-description" sx={{ my: 2 }}>
//             <form onSubmit={handleSubmit(submitApplyLabel(selectedColorIds))}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                 <LabelGrid />
//                 <Box sx={{ alignSelf: 'flex-end' }}>
//                   <Button
//                     className="interceptor-loading"
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                   >
//                     Apply
//                   </Button>
//                 </Box>
//               </Box>
//             </form>
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   )
// }

// export default CardLabelModal


import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { CARD_LABEL_ACTIONS, CARD_MEMBER_ACTIONS } from '~/utils/constants'
import { labelColorsDefault } from '~/utils/formatters'
import { Checkbox, Grid, Paper, Typography } from '@mui/material'
import { selectCurrentActiveCard } from '~/redux/acitveCard/activeCardSlice'

function CardLabel({ labels = [], onUpdateCardLabel }) {
  /**
   * Xử lý Popover để ẩn hoặc hiện toàn bộ user trên một cái popup, tương tự docs để tham khảo ở đây:
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }
  const currentActiveCard = useSelector(selectCurrentActiveCard)

  // const [selectedColorIds, setSelectedColorIds] = useState([])

  // const handleSelectLabel = (colorId) => {
  //   // Dùng callback
  //   setSelectedColorIds((prev) => {
  //     if (prev.includes(colorId)) {
  //       return prev.filter(id => id !== colorId)
  //     }
  //     return [...prev, colorId]
  //   })
  // }

  const selectedLabelIds = labels?.map(label => label.labelId)

  const handleUpdateLabel = (label) => {
    const incomingLabelInfo = {
      labelId: label.id,
      labelValue: label.value,
      action: selectedLabelIds.includes(label.id) ? CARD_LABEL_ACTIONS.REMOVE : CARD_LABEL_ACTIONS.ADD
    }
    onUpdateCardLabel(incomingLabelInfo)
  }

  // Lưu ý ở đây chúng ta không dùng Component AvatarGroup của MUI bởi nó không hỗ trợ tốt trong việc chúng ta cần custom & trigger xử lý phần tử tính toán cuối, đơn giản là cứ dùng Box và CSS - Style đám Avatar cho chuẩn kết hợp tính toán một chút thôi.
  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
      {currentActiveCard?.labels &&
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={{ xs: 0.5, md: 1 }} sx={{ mt: 1 }}>
              {currentActiveCard.labels.map((label, index) => (
                <Grid item key={index} >
                  <Paper
                    sx={{
                      position: 'relative',
                      height: 30,
                      width: 45,
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: '0.2s',
                      background: label.labelValue
                    }}
                  />
                </Grid>
              ))
              }
              <Paper
                aria-describedby={popoverId}
                onClick={handleTogglePopover}
                sx={{
                  mt: 1, ml: 1,
                  width: 45,
                  height: 30,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: 1,
                  color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200],
                  '&:hover': {
                    color: (theme) => theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
                  }
                }}
              >
                <AddIcon fontSize="small" />
              </Paper>
            </Grid>
          </Box>
      }


      {/* Khi Click vào + ở trên thì sẽ mở popover hiện toàn bộ users trong board để người dùng Click chọn thêm vào card  */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{
          width: 2000
        }}
      >
        <Box sx={{ p: 2, maxWidth: '260px', display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {labelColorsDefault?.map((label) => (
            <Grid item key={label.id} >
              <Box sx={{
                display: 'flex',
                flexGrow: 1
              }}>
                <Checkbox
                  checked={ selectedLabelIds.includes(label.id) ? true : false }
                  onChange={() => handleUpdateLabel(label)}
                />
                <Paper
                  onClick= {() => handleUpdateLabel(label)}
                  sx={{
                    mt: 1,
                    position: 'relative',
                    height: 25,
                    width: 170,
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: '0.2s',
                    background: label.value,
                    '&:hover': {
                      opacity: 0.75
                    }
                  }}
                />
              </Box>

            </Grid>
          )

          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default CardLabel

