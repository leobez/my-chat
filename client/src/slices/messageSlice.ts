import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
    messageId:number,
    from_user:number,
    from_username:string,
    to_user:number,
    to_username:string,
    content:string,
    created_at:string
}

export interface History {
    userId:number,
    history:Message[]
}

const initialState:{completeHistory:History[]} = {
    completeHistory: []
}

export const messageSlice = createSlice({
    name: 'message',

    initialState,

    reducers: {

        createHistory: (state, action:PayloadAction<History>) => {

            let found = false

            state.completeHistory.forEach((history) => {
                if (history.userId === action.payload.userId) {
                    found = true
                }
            })

            if (!found) state.completeHistory.push(action.payload)
        },
        
        addMessage: (state, action:PayloadAction<Message>) => {
            state.completeHistory.forEach((history) => {
                if (
                    history.userId === action.payload.from_user ||
                    history.userId === action.payload.to_user
                ) {
                    console.log('adding to history: ', history.userId)
                    history.history.push(action.payload)
                }
            })
        },

        // Full reset of state (used after logout)
        resetMessageState: (state) => {
            state.completeHistory = []
        },

    } 
})

export const {createHistory, addMessage, resetMessageState} = messageSlice.actions
export const selectMessageState = (state:{completeHistory:History[]}) => state
export default messageSlice.reducer