import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({

    name: 'auth',

    initialState: {
        value: false,
    },

    reducers: {
        login: (state) => {
            console.log('LOGIN REDUCER')
            state.value = true
        },

        logout: (state) => {
            console.log('LOGOUT REDUCER')
            state.value = false
        }
    }
})

export const {login, logout} = authSlice.actions

export const selectAuth = (state:any) => state.counter.value

export default authSlice.reducer