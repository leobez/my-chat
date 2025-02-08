import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Auth {
    userId:number|undefined
    username:string|undefined
}

const initialState: Auth = {
    userId: undefined,
    username: undefined,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, action:PayloadAction<Auth>) => {
                state.userId = action.payload.userId
                state.username = action.payload.username
        },
        logoutUser: (state) => {
            state.userId = undefined
            state.username = undefined
        }
    } 
})

export const {loginUser, logoutUser} = authSlice.actions
export const selectAuthState = (state:Auth) => state
export default authSlice.reducer