import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import SocketContext, { OnlineStatus, SocketContextType } from "../context/SocketContext"
import { updateOnlineStatus } from "../slices/friendshipSlice"

export const useSocket = () => {

    const dispatch = useDispatch()
    const {socket} = useContext(SocketContext) as SocketContextType

    useEffect(() => {

        // if (!socket.connected) return

        console.log('socket hook')

        const handleOnlineStatus = (onlineStatus:OnlineStatus) => {
            dispatch(updateOnlineStatus(onlineStatus))
        }

        socket.on('friends online status', handleOnlineStatus)

        return  () => {
            socket.off('friends online status')
        }

    }, [dispatch, socket])
}