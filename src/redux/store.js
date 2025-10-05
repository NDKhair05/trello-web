import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { activeCardReducer } from './acitveCard/activeCardSlice'
import { notificationReducer } from './notifications/notificationsSlice'

import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' //default is storage

//Cấu hình persist
const rootPersistConfig = {
  key: 'root', // Key của persist do ta định nghĩa, để mặc định là root
  storage: storage, // Lưu vào biến storage ở trên
  whitelist: ['user'] //định nghĩa các slice dữ liệu ĐƯỢC PHÉP duy trì sau mỗi lần F5 trình duyệt
  //blacklist: ['user'] //định nghĩa các slice dữ liệu KHÔNG ĐƯỢC PHÉP duy trì sau mỗi lần F5 trình duyệt
}

//Combine các reducers trong dự án của ta ở đây
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationReducer
})

//Thực hiện persist reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
