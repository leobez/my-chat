import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
    messageId:number,
    from_user:number,
    to_user:number,
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
            state.completeHistory.push(action.payload)
        },
        
        addMessage: (state, action:PayloadAction<Message>) => {
            state.completeHistory.forEach((history) => {
                if (
                    history.userId === action.payload.from_user ||
                    history.userId === action.payload.to_user
                ) {
                    history.history.push(action.payload)
                }
            })
        },

    } 
})

export const {createHistory, addMessage} = messageSlice.actions
export const selectMessageState = (state:{completeHistory:History[]}) => state
export default messageSlice.reducer