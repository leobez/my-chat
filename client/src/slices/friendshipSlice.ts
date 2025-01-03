import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OnlineStatus } from "../context/SocketContext";

export interface Friend {
    userId: number
    friendshipId: number
    username: string
    online?: boolean
    has_new_messages_ws?:boolean
}

export interface Request {
    friendshipId: number,
    from_user: number,
    to_user: number,
    from_username: string,
    to_username: string,
    accepted: number,
    wait: number,
    created_at: string
}

export interface Friendships {
    friends:Friend[]
    receivedRequests:Request[]
    sentRequests:Request[]
}

const initialState: Friendships = {
    friends: [],
    receivedRequests: [],
    sentRequests: [],
}

export const friendshipSlice = createSlice({
    name: 'friendship',
    initialState,
    reducers: {

        // Friends[]
        setFriend: (state, action:PayloadAction<Friend[]>) => {
            state.friends = action.payload    
        },
        addFriend: (state, action:PayloadAction<Friend>) => {
            state.friends.push(action.payload)
        },
        updateOnlineStatus: (state, action:PayloadAction<OnlineStatus>) => {
            /* console.log('updating friend status: ', action.payload) */
            state.friends.forEach((friend) => {
                if (Number(friend.userId) === Number(action.payload.userId)) {
                    friend.online = action.payload.online
                }
            })
        },
        removeFriend: (state, action:PayloadAction<Number>) => {
            const newArray = state.friends.filter((friend) => friend.userId !== action.payload)
            state.friends = newArray
        },
        updateHasNewMessagesWs: (state, action:PayloadAction<Number>) => {
            state.friends.map((friend:Friend) => {
                if (friend.userId === action.payload) {
                    friend.has_new_messages_ws = true
                }
            })
        },
        removeHasNewMessagesWs: (state, action:PayloadAction<Number>) => {
            state.friends.map((friend:Friend) => {
                if (friend.userId === action.payload) {
                    friend.has_new_messages_ws = false
                }
            })
        },
        // receivedRequests[]
        setReceivedRequest: (state, action:PayloadAction<Request[]>) => {
            state.receivedRequests = action.payload    
        },
        addReceivedRequest: (state, action:PayloadAction<Request>) => {
            state.receivedRequests.push(action.payload)
        },
        removeReceivedRequest: (state, action:PayloadAction<Number>) => {
            const newArray = state.receivedRequests.filter((requests) => requests.friendshipId !== action.payload)
            state.receivedRequests = newArray
        },


        // sentRequests[]
        setSentRequest: (state, action:PayloadAction<Request[]>) => {
            state.sentRequests = action.payload    
        },
        addSentRequest: (state, action:PayloadAction<Request>) => {
            state.sentRequests.push(action.payload)
        },
        removeSentRequest: (state, action:PayloadAction<Number>) => {
            const newArray = state.sentRequests.filter((requests) => requests.friendshipId !== action.payload)
            state.sentRequests = newArray
        },

        // Full reset of state (used after logou)
        resetFriendshipState: (state) => {
            state.friends = []
            state.receivedRequests = []
            state.sentRequests = []
        },
        
    } 
})

export const {
    setFriend,
    addFriend, 
    updateOnlineStatus,
    removeFriend,
    updateHasNewMessagesWs,
    removeHasNewMessagesWs,
    setReceivedRequest,
    addReceivedRequest,
    removeReceivedRequest,
    setSentRequest,
    addSentRequest,
    removeSentRequest,
    resetFriendshipState} = friendshipSlice.actions

export const selectFriendshipState = (state:Friendships) => state

export default friendshipSlice.reducer