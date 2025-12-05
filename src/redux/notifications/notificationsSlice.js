import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentNotifications: null
}

export const fetchAllNotificationsAPI = createAsyncThunk(
  'notifications/fetchAllNotificationsAPI',
  async () => {
    const [invRes, notiRes] = await Promise.all([
      authorizedAxiosInstance.get(`${API_ROOT}/v1/invitations`),
      authorizedAxiosInstance.get(`${API_ROOT}/v1/notifications`)
    ])

    const merged = [...invRes.data, ...notiRes.data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    return merged
  }
)

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status })
    return response.data
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    // Thêm mới một bản ghi notification vào trong currentNotifications
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      // unshift: add element to the head of array
      state.currentNotifications.unshift(incomingInvitation)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllNotificationsAPI.fulfilled, (state, action) => {
      state.currentNotifications = action.payload
    })
    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload

      const getInvitation = state.currentNotifications.find((i => i._id === incomingInvitation._id))
      getInvitation.boardInvitation = incomingInvitation.boardInvitation
    })
  }
})


export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification,
  removeNotification
} = notificationsSlice.actions

export const selectCurrentNotifications = state => {
  return state.notifications.currentNotifications
}

export const notificationReducer = notificationsSlice.reducer
