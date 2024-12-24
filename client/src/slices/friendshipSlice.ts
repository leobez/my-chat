import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Friend {
    userId: number
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
        addFriend: (state, action:PayloadAction<Friend>) => {

        },
        removeFriend: (state, action:PayloadAction<Friend>) => {

        },
        addReceivedRequest: (state, action:PayloadAction<ReceivedRequest>) => {

        },
        removeReceivedRequest: (state, action:PayloadAction<ReceivedRequest>) => {

        },
        addSentRequest: (state, action:PayloadAction<SentRequest>) => {

        },
        removeSentRequest: (state, action:PayloadAction<SentRequest>) => {

        },
    } 
})

export const {
    addFriend, 
    removeFriend,
    addReceivedRequest,
    removeReceivedRequest,
    addSentRequest,
    removeSentRequest} = friendshipSlice.actions

export const selectFriendshipState = (state:Friendships) => state

export default friendshipSlice.reducer