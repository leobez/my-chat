import { createReducer, createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { OnlineStatus } from "../context/SocketContext";

export interface Friend {
    userId: number
    username: string
    online?: boolean
}

export interface Request {
    friendshipId: number,
    from_user: number,
    to_user: number,
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
            console.log('updating friend status: ', action.payload)
            
            return {
                ...state,
                friends: state.friends.map((friend:Friend) => {
                    if (Number(friend.userId) === Number(action.payload.friendId)) {
                        console.log('found: ', friend.userId, action.payload.friendId)
                        return {
                            ...friend,
                            online: action.payload.online
                        }
                    } else {
                        return friend
                    }
                })
            }

            for (let friend of current(state).friends) {
                console.log('aa: ', friend)
                if (Number(friend.userId) === Number(action.payload.friendId)) {
                    console.log('updating friend status')
                    friend.online = action.payload.online
                    console.log('aaa: ', friend.online)
                }
            } 
        },
        removeFriend: (state, action:PayloadAction<Number>) => {
            const newArray = state.friends.filter((friend) => friend.userId !== action.payload)
            state.friends = newArray
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
    } 
})

export const {
    setFriend,
    addFriend, 
    updateOnlineStatus,
    removeFriend,
    setReceivedRequest,
    addReceivedRequest,
    removeReceivedRequest,
    setSentRequest,
    addSentRequest,
    removeSentRequest} = friendshipSlice.actions

export const selectFriendshipState = (state:Friendships) => state

export default friendshipSlice.reducer