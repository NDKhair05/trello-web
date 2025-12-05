import { createSlice } from '@reduxjs/toolkit'

//Khởi tạo giá trị của một Slice trong Redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

//Khởi tạo một slice trong kho lưu trữ - Redus Store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  //Reducer: Nơi xử lí dữ liệu đồng bộ
  reducers: {

    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },

    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },

    updateCurrentAcitveCard: (state, action) => {
      const fullCard = action.payload
      state.currentActiveCard = fullCard
    }
  },

  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => {}
})

export const {
  clearAndHideCurrentActiveCard,
  updateCurrentAcitveCard,
  showModalActiveCard
} = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

export const activeCardReducer = activeCardSlice.reducer
