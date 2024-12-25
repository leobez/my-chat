import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Friend {
    userId: number
    socketId: string
    username: string
}

interface ReceivedRequest {
    friendshipId: number,
    from_user: number,
    to_user: number,
    accepted: number,
    wait: number,
    created_at: string
    user_that_sent: Friend
}

interface SentRequest {
    friendshipId: number,
    from_user: number,
    to_user: number,
    accepted: number,
    wait: number,
    created_at: string
    user_that_receive: Friend
}

interface Friendships {
    friends:Friend[]
    receivedRequests:ReceivedRequest[]
    sentRequests:SentRequest[]
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
        removeFriend: (state, action:PayloadAction<Number>) => {
            const newArray = state.friends.filter((friend) => friend.userId !== action.payload)
            state.friends = newArray
        },

        // receivedRequests[]
        setReceivedRequest: (state, action:PayloadAction<ReceivedRequest[]>) => {
            state.receivedRequests = action.payload    
        },
        addReceivedRequest: (state, action:PayloadAction<ReceivedRequest>) => {

        },
        removeReceivedRequest: (state, action:PayloadAction<ReceivedRequest>) => {
            const newArray = state.receivedRequests.filter((requests) => requests.friendshipId !== action.payload.friendshipId)
            state.receivedRequests = newArray
        },

        // sentRequests[]
        setSentRequest: (state, action:PayloadAction<SentRequest[]>) => {
            state.sentRequests = action.payload    
        },
        addSentRequest: (state, action:PayloadAction<SentRequest>) => {
            state.sentRequests.push(action.payload)
        },
        removeSentRequest: (state, action:PayloadAction<SentRequest>) => {
            const newArray = state.sentRequests.filter((requests) => requests.friendshipId !== action.payload.friendshipId)
            state.sentRequests = newArray
        },
    } 
})

export const {
    setFriend,
    addFriend, 
    removeFriend,
    setReceivedRequest,
    addReceivedRequest,
    removeReceivedRequest,
    setSentRequest,
    addSentRequest,
    removeSentRequest} = friendshipSlice.actions

export const selectFriendshipState = (state:Friendships) => state

export default friendshipSlice.reducer