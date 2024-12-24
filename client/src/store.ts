import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../src/slices/authSlice'
import friendshipReducer from '../src/slices/friendshipSlice'

export default configureStore({
    reducer: {
        auth: authReducer,
        friendship: friendshipReducer,
    }
})