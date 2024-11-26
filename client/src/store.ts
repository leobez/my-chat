import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../src/slices/authSlice'

export default configureStore({
    reducer: {
        auth: authReducer
    }
})