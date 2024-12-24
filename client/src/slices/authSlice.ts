import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Auth {
    userId:number|undefined
    email:string|undefined
    username:string|undefined
}

const initialState: Auth = {
    userId: undefined,
    email: undefined,
    username: undefined,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, action:PayloadAction<Auth>) => {
                state.userId = action.payload.userId
                state.email = action.payload.email
                state.username = action.payload.username
        },
        logoutUser: (state) => {
            state.userId = undefined
            state.email = undefined
            state.username = undefined
        }
    } 
})

export const {loginUser, logoutUser} = authSlice.actions
export const selectAuthState = (state:Auth) => state
export default authSlice.reducer