import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../src/slices/AuthSlice'

export default configureStore({
    reducer: {
        auth: authReducer
    }
})