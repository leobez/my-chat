import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../src/slices/authSlice'
import chatReducer from '../src/slices/chatSlice'

export default configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer
    }
})