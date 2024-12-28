import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../src/slices/authSlice'
import friendshipReducer from '../src/slices/friendshipSlice'
import messageReducer from './slices/messageSlice'

export default configureStore({
    reducer: {
        auth: authReducer,
        friendship: friendshipReducer,
        message: messageReducer
    }
})