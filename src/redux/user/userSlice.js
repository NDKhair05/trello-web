import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

//Khởi tạo giá trị State của một cái Slice trong redux
const initialState = {
  currentUser: null
}

//Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    //Lưu ý: authorizedAxiosInstance sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully!')
    }
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    return response.data
  }
)

//Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  //Reducers: Nơi xử lí dữ liệu đồng bộ
  reducers: {},
  //ExtraReducers: Nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      //action.payload ở đây chính là response.data ở trên trả về
      let user = action.payload
      //Update lại dữ liệu của cái currentActiveBoard
      state.currentUser = user
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      //API gọi thành công thì cập nhật lại state user hiện tại là null, sau đó ProtectedRoute sẽ tự động chuyển đến trang login
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// export const { updateCurrentActiveBoard } = activeBoardSlice.actions

//Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer
