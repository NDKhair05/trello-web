import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { signIn, signOut } from '~/apis/authApi'

export const loginUserAPI = createAsyncThunk('user/login', signIn)
export const logoutUserAPI = createAsyncThunk('user/logout', signOut)
const slice = createSlice({
  name: 'user',
  initialState: { currentUser: null, initialized: false, error: null },
  reducers: {
    sessionChanged: (state, { payload }) => {
      state.currentUser = payload
      state.initialized = true
      state.error = null
    },
    sessionFailed: (state, { payload }) => {
      state.initialized = true
      state.error = payload
    }
  }
})
export const { sessionChanged, sessionFailed } = slice.actions
export const selectCurrentUser = state => state.user.currentUser
export const userReducer = slice.reducer
