import { useContext, useEffect } from "react"
import { useDispatch } from "react-redux"
import SocketContext, { OnlineStatus, SocketContextType } from "../context/SocketContext"
import { addFriend, addReceivedRequest, removeSentRequest, Request, updateOnlineStatus } from "../slices/friendshipSlice"
import { useGetUserById } from "./userHooks/useGetUserById"

export interface FriendshipData {
    type: 'sent'|'accepted'|'denied'|'deleted'
    data: Request
}

export const useSocket = () => {

    const dispatch = useDispatch()
    const {socket} = useContext(SocketContext) as SocketContextType

    const {getUserById} = useGetUserById()

    useEffect(() => {

        // if (!socket.connected) return

        console.log('socket hook')

        socket.on('friends online status', (onlineStatus:OnlineStatus) => dispatch(updateOnlineStatus(onlineStatus)))

        socket.on('friendship', async(data:FriendshipData) => {

            if (data.type === 'sent') {
                console.log('data.data: ', data.data)
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

            // TODO (ON SERVER AS WELL)
            if (data.type === 'deleted') {
                // ...
            }

        })

        return  () => {
            socket.off('friends online status')
        }

    }, [socket])
}