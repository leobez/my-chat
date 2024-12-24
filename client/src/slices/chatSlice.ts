import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
    from: string | number
    to:  string | number
    content: string
    created_at: string
}

interface ChatHistory {
    type: 'friend'|'group',
    id: string|number,
    history: Message[] 
}

/* 
    totalChatHistory: 
    Map<string, Message[]>
    string = 'friend_${userId}' | 'group_${groupId}'
*/
interface Chat {
    type_currentChat    : 'friend'|'group'|undefined
    id_currentChat      : string|number|undefined
    totalChatHistory    : Map<string, Message[]>|undefined
}

const initialState: Chat = {
    type_currentChat: undefined,
    id_currentChat: undefined,
    totalChatHistory: new Map()
};

export const chatSlice = createSlice({

    name: 'chat',
    initialState,
    reducers: {

        setCurrentChat: (state, action:PayloadAction<Chat | undefined>) => {
            if (action?.payload) {
                state.type_currentChat = action.payload.type_currentChat
                state.id_currentChat = action.payload.id_currentChat
            }
        }, 

        addToLocalHistory: (state, action:PayloadAction<{type:'friend'|'group', id: string|number, newMessage:any} | undefined>) => {

        }
    }
})

export const {setChat} = chatSlice.actions

export const selectChat = (state:any) => state.chat
export const selectFullHistory = (state:any) => state.chat.chatHistory

export default chatSlice.reducer