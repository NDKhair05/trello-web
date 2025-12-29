import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT, NOTIFICATION_TYPES } from '~/utils/constants'

//Boards
//Moved to Redux
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
//   //Lưu ý: authorizedAxiosInstance sẽ trả kết quả về qua property của nó là data
//   return response.data
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  //Lưu ý: authorizedAxiosInstance sẽ trả kết quả về qua property của nó là data
  return response.data
}

export const deleteBoardDetailsAPI = async (boardId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/boards/${boardId}`)
  //Lưu ý: authorizedAxiosInstance sẽ trả kết quả về qua property của nó là data
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving-card`, updateData)
  //Lưu ý: authorizedAxiosInstance sẽ trả kết quả về qua property của nó là data
  return response.data
}

//Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  //Lưu ý: authorizedAxiosInstance sẽ trả kết quả về qua property của nó là data
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  //Lưu ý: authorizedAxiosInstance sẽ trả kết quả về qua property của nó là data
  return response.data
}

//Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}

export const deleteCardDetailsAPI = async (cardId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/cards/${cardId}`)
  //Lưu ý: authorizedAxiosInstance sẽ trả kết quả về qua property của nó là data
  return response.data
}

//Users
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Account created successfully!', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our service! Have a good day!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards${searchPath}`)
  return response.data
}

export const createNewBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/boards`, data)
  toast.success('Board created successfully')
  return response.data
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}`, updateData)
  return response.data
}

// Notifications
export const inviteUserToBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/invitations/board`, data)
  toast.success('User invited to board successfully')
  return response.data
}

export const leaveFromBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/boards/leave`, data)
  return response.data
}

export const addNotificationAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/notifications`, data)
  return response.data
}

export const deleteNotificationAPI = async (notificationId, type) => {
  if (type === NOTIFICATION_TYPES.BOARD_INVITATION) {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/invitations/${notificationId}`)
    return response.data
  } else if (type === NOTIFICATION_TYPES.RESPOND_INVITATION) {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/notifications/${notificationId}`)
    return response.data
  }
}
