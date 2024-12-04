import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    userId?:number
    socketId?:string
    email?:string|undefined
    username?:string|undefined
}

export const authSlice = createSlice({

    name: 'auth',

    initialState: {
        isLoggedIn: false,
        userId: -1,
        socketId: "",
        email: "",
        username: "",
    },

    reducers: {

        loginReducer: (state, action:PayloadAction<User | undefined>) => {
            console.log('LOGIN REDUCER')
            state.isLoggedIn = true
            if (action?.payload) {
                if (action.payload.userId) state.userId = action.payload.userId
                if (action.payload.socketId) state.socketId = action.payload.socketId
                if (action.payload.email) state.email = action.payload.email
                if (action.payload.username) state.username = action.payload.username
            }
        },

        logoutReducer: (state) => {
            console.log('LOGOUT REDUCER')
            state.isLoggedIn = false
            state.userId = -1
            state.socketId = ""
            state.email = ""
            state.username = ""
        }
        
    }
})

export const {loginReducer, logoutReducer} = authSlice.actions

export const selectAuth = (state:any) => state.counter.value

export default authSlice.reducer