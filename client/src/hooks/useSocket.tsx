import { useContext, useEffect } from "react"
import { useDispatch } from "react-redux"
import SocketContext, { OnlineStatus, SocketContextType } from "../context/SocketContext"
import { addFriend, addReceivedRequest, removeSentRequest, Request, updateOnlineStatus, removeReceivedRequest, removeFriend, updateHasNewMessagesWs } from "../slices/friendshipSlice"
import { useGetUserById } from "./userHooks/useGetUserById"
import { addMessage, Message } from "../slices/messageSlice"
import ChatContext, { ChatContextType } from "../context/ChatContext"


export interface FriendshipData {
    type: 'sent'|'accepted'|'denied'|'deleted'
    data: Request
}

export const useSocket = () => {

    const dispatch = useDispatch()
    const {socket} = useContext(SocketContext) as SocketContextType

    const {chatting, updateChatting} = useContext(ChatContext) as ChatContextType

    const {getUserById} = useGetUserById()

    useEffect(() => {

        // if (!socket.connected) return
        console.log('socket hook')

        socket.on('friends online status', (onlineStatus:OnlineStatus) => dispatch(updateOnlineStatus(onlineStatus)))

        socket.on('friendship', async(data:FriendshipData) => {

            if (data.type === 'sent') {
                //console.log('data.data: ', data.data)
                return dispatch(addReceivedRequest(data.data))
            } 

            if (data.type === 'accepted') {
                dispatch(removeSentRequest(data.data.friendshipId))
                const user = await getUserById(data.data.to_user)
                return dispatch(addFriend(user))
            } 

            if (data.type === 'denied') {
                return dispatch(removeSentRequest(data.data.friendshipId))
            } 

            if (data.type === 'deleted') {
                console.log('deleted', chatting?.id, data.data.from_user)
                if (chatting?.id === data.data.from_user || chatting?.id === data.data.to_user) updateChatting(null)
                dispatch(removeFriend(data.data.from_user))
                dispatch(removeFriend(data.data.to_user))
                dispatch(removeSentRequest(data.data.friendshipId))   
                return dispatch(removeReceivedRequest(data.data.friendshipId))   
            }

        })

        socket.on('private message', (message:Message) => {
            dispatch(addMessage(message))
            dispatch(updateHasNewMessagesWs(message.from_user))
        })

        return  () => {
            socket.off('friends online status')
            socket.off('friendship')
            socket.off('private message')
        }

    }, [socket])
}