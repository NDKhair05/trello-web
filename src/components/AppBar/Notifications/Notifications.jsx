import { useEffect, useState } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import IconButton from '@mui/material/IconButton'
import HowToReg from '@mui/icons-material/HowToReg'
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled'
import { useDispatch, useSelector } from 'react-redux'
import {
  addNotification,
  fetchAllNotificationsAPI,
  selectCurrentNotifications,
  updateBoardInvitationAPI,
  updateCurrentNotifications
} from '~/redux/notifications/notificationsSlice'
import { socketIoInstance } from '~/sockeClient'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { deleteNotificationAPI, addNotificationAPI } from '~/apis'
import { NOTIFICATION_TYPES } from '~/utils/constants'


const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}


function Notifications() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    setNewNotification(false)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Biến state đơn giản để ktra có thông báo mới không
  const [newNotification, setNewNotification] = useState(false)

  // state để biết item nào đang hover (để show delete icon & dịch chip)
  const [hoveredNotificationId, setHoveredNotificationId] = useState(null)

  // Lấy dữ liệu user từ trong Redux
  const currentUser = useSelector(selectCurrentUser)

  // Lấy dữ liệu notification từ trong Redux
  const notifications = useSelector(selectCurrentNotifications)

  // Fetch danh sách các lời mời invitations
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAllNotificationsAPI())
    // Tạo một cái function xử lý khi nhận được sự kiện real-time
    const onReceiveNewInvitation = (invitation) => {
      if (invitation.invitee._id === currentUser._id) {
        dispatch(addNotification(invitation))
        setNewNotification(true)
      }
    }

    const onReceiveNewNotification = (notification) => {
      if (notification.inviteeId === currentUser._id) {
        dispatch(addNotification(notification))
        setNewNotification(true)
      }
    }
    // Lắng nghe cái sự kiện real-time có tên là 'BE_USER_INVITED_TO_BOARD' từ phía server gửi về
    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    socketIoInstance.on('BE_SEND_NOTIFICATION', onReceiveNewNotification)
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
      socketIoInstance.off('BE_SEND_NOTIFICATION', onReceiveNewNotification)
    }
  }, [dispatch, currentUser._id])

  // Cập nhật trạng thái - status của một cái lời mời join board
  const updateBoardInvitation = (status, invitationId, type) => {
    dispatch(updateBoardInvitationAPI({ status, invitationId }))
      .then(async res => {
        const boardInvitation = res?.payload?.boardInvitation
        if (!boardInvitation) return

        // Thêm thông báo khi chấp nhận hoặc từ chối lời mời
        try {
          const notificationRes = await addNotificationAPI({ invitationId, type })
          socketIoInstance.emit('FE_SEND_NOTIFICATION', notificationRes)
        } catch (error) {
          //
        }

        if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
          socketIoInstance.emit('FE_USER_RESPONDED_NOTIFICATION', res.payload )
          navigate(`/boards/${res.payload.boardInvitation.boardId}`)
        }
      })
  }

  // Xóa notification
  const handleDeleteNotification = (notificationId, type) => {
    const newNotifications = notifications.filter(noti => noti._id !== notificationId)
    dispatch(updateCurrentNotifications(newNotifications))

    //Call API
    dispatch(deleteNotificationAPI(notificationId, type)).catch(() => {})
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          variant= {newNotification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon sx={{
            color: newNotification ? 'yellow' : 'white'
          }} />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {(!notifications || notifications.length === 0) &&
          <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>}
        {notifications?.map((notification) =>
          <Box key={notification._id}>
            { notification.type === NOTIFICATION_TYPES.BOARD_INVITATION &&
                         <MenuItem
                           sx={{
                             minWidth: 200,
                             maxWidth: 360,
                             overflowY: 'auto',
                             // đảm bảo container có relative để vị trí absolute của delete icon dễ canh
                             position: 'relative'
                           }}
                           onMouseEnter={() => setHoveredNotificationId(notification._id)}
                           onMouseLeave={() => setHoveredNotificationId(null)}
                         >
                           <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                             {/* Nội dung của thông báo */}
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <Box><GroupAddIcon fontSize="small" /></Box>
                               <Box><strong>{notification.inviter?.displayName}</strong> had invited you to join the board <strong>{notification.board?.title}</strong></Box>
                             </Box>

                             {/* Khi Status của thông báo này là PENDING thì sẽ hiện 2 Button */}
                             {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING &&
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                  <Button
                                    className="interceptor-loading"
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id, NOTIFICATION_TYPES.RESPOND_INVITATION)}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    className="interceptor-loading"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id, NOTIFICATION_TYPES.RESPOND_INVITATION)}
                                  >
                                    Reject
                                  </Button>
                                </Box>
                             }

                             {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                             {notification.boardInvitation?.status !== BOARD_INVITATION_STATUS.PENDING &&
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'relative' }}>
                                  {/* container cho chip + delete icon */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                    {/* Chip sẽ dịch sang trái 1 chút khi hover item */}
                                    <Box sx={{
                                      transform: hoveredNotificationId === notification._id ? 'translateX(-18px)' : 'translateX(0)',
                                      transition: 'transform 180ms ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      minWidth: 0 // để tránh overflow
                                    }}>
                                      {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                                        <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />
                                      }
                                      {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.REJECTED &&
                                        <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />
                                      }
                                    </Box>

                                    {/* Delete icon — default hidden, xuất hiện khi hover */}
                                    <Box sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      // icon nằm bên phải của chip, xuất hiện với animation
                                      opacity: hoveredNotificationId === notification._id ? 1 : 0,
                                      transform: hoveredNotificationId === notification._id ? 'translateX(0)' : 'translateX(6px)',
                                      transition: 'opacity 160ms ease, transform 160ms ease',
                                      '&:hover': {
                                        color: 'warning.dark',
                                        '& .delete-icon': { color: 'warning.dark' }
                                      }
                                    }}>
                                      <Tooltip>
                                        <IconButton
                                          className='delete-icon'
                                          size="small"
                                          aria-label="delete-notification"
                                          onClick={() => handleDeleteNotification(notification._id, notification.type)}
                                        >
                                          <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </Box>
                                </Box>
                             }

                             {/* Thời gian của thông báo */}
                             <Box sx={{ textAlign: 'right', marginRight: '15px' }}>
                               <Typography variant="span" sx={{ fontSize: '13px' }}>
                                 {moment(notification.createdAt).format('llll')}
                               </Typography>
                             </Box>
                           </Box>
                         </MenuItem>
            }

            { notification.type === NOTIFICATION_TYPES.RESPOND_INVITATION &&
              <MenuItem
                sx={{
                  minWidth: 360,
                  maxWidth: 360,
                  overflowY: 'auto',
                  // đảm bảo container có relative để vị trí absolute của delete icon dễ canh
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredNotificationId(notification._id)}
                onMouseLeave={() => setHoveredNotificationId(null)}
              >
                <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {/* Nội dung của thông báo */}
                  {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <Box><HowToReg fontSize="small" /></Box>
                               <Box><strong>{notification.inviter?.displayName}</strong> became a member of your <strong>{notification.board?.title}</strong></Box>
                             </Box>
                  }
                  {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.REJECTED &&
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <Box><PersonAddDisabledIcon fontSize="small" /></Box>
                               <Box><strong>{notification.inviter?.displayName}</strong> had rejected your invitation to <strong>{notification.board?.title}</strong></Box>
                             </Box>
                  }

                  {/* Delete icon — default hidden, xuất hiện khi hover */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    // icon nằm bên phải của chip, xuất hiện với animation
                    opacity: hoveredNotificationId === notification._id ? 1 : 0,
                    transform: hoveredNotificationId === notification._id ? 'translateX(0)' : 'translateX(6px)',
                    transition: 'opacity 160ms ease, transform 160ms ease'
                  }}>
                    <Tooltip>
                      <IconButton
                        className='delete-icon'
                        size="small"
                        aria-label="delete-notification"
                        onClick={() => handleDeleteNotification(notification._id, notification.type)}
                        sx={{
                          '&:hover': {
                            color: 'warning.dark'
                          }
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Thời gian của thông báo */}
                  <Box sx={{ textAlign: 'right', marginRight: '15px' }}>
                    <Typography variant="span" sx={{ fontSize: '13px' }}>
                      {moment(notification.createdAt).format('llll')}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            }
            {/* Cái đường kẻ Divider sẽ không cho hiện nếu là phần tử cuối */}
            {notification._id !== (notifications?.[notifications.length - 1]?._id) && <Divider />}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
