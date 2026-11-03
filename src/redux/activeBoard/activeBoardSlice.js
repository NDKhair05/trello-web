import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchBoardDetails } from '~/apis/boardApi'

export const fetchBoardDetailsAPI = createAsyncThunk('activeBoard/fetch', fetchBoardDetails)
const slice = createSlice({
  name: 'activeBoard',
  initialState: { currentActiveBoard: null, loading: false, error: null, requestId: null },
  reducers: {
    updateCurrentActiveBoard: (state, { payload }) => { state.currentActiveBoard = payload },
    updateCardInBoard: (state, { payload }) => {
      const column = state.currentActiveBoard?.columns.find(c => c._id === payload.columnId)
      const card = column?.cards.find(c => c._id === payload._id)
      if (card) Object.assign(card, payload)
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchBoardDetailsAPI.pending, (state, action) => {
      state.loading = true
      state.error = null
      state.requestId = action.meta.requestId
      if (state.currentActiveBoard?._id !== action.meta.arg) state.currentActiveBoard = null
    })
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return
      state.currentActiveBoard = action.payload
      state.loading = false
    })
    builder.addCase(fetchBoardDetailsAPI.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return
      state.loading = false
      state.error = action.error.message
    })
  }
})
export const { updateCurrentActiveBoard, updateCardInBoard } = slice.actions
export const selectCurrentActiveBoard = state => state.activeBoard.currentActiveBoard
export const activeBoardReducer = slice.reducer
