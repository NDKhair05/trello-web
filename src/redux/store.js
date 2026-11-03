import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { activeCardReducer } from './acitveCard/activeCardSlice'

const reducer = combineReducers({ activeBoard: activeBoardReducer, user: userReducer, activeCard: activeCardReducer })
export const store = configureStore({
  reducer: (state, action) => {
    // Do not keep a previous user's boards/cards after logout or account changes.
    if (action.type === 'user/sessionChanged' && state?.user.currentUser?._id !== action.payload?._id) state = undefined
    return reducer(state, action)
  }
})
