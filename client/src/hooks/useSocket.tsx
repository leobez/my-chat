import { useContext, useEffect } from "react"
import { useDispatch } from "react-redux"
import SocketContext, { OnlineStatus, SocketContextType } from "../context/SocketContext"
import { updateOnlineStatus } from "../slices/friendshipSlice"

export const useSocket = () => {

    const dispatch = useDispatch()
    const {socket} = useContext(SocketContext) as SocketContextType

    useEffect(() => {

        // if (!socket.connected) return

        console.log('socket hook')

        socket.on('friends online status', (onlineStatus:OnlineStatus) => dispatch(updateOnlineStatus(onlineStatus)))

        return  () => {
            socket.off('friends online status')
        }

    }, [socket])
}