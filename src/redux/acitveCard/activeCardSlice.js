import { createSlice } from '@reduxjs/toolkit'

//Khởi tạo giá trị của một Slice trong Redux
const initialState = {
  currentActiveCard: null
}

//Khởi tạo một slice trong kho lưu trữ - Redus Store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  //Reducer: Nơi xử lí dữ liệu đồng bộ
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },

    updateCurrentAcitveCard: (state, action) => {
      const fullCard = action.payload


      state.currentActiveCard = fullCard
    }
  },

  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => {}
})

export const { clearCurrentActiveCard, updateCurrentAcitveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const activeCardReducer = activeCardSlice.reducer
