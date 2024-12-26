import { createContext, ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { updateOnlineStatus, addReceivedRequest, removeReceivedRequest, addFriend, removeSentRequest } from "../slices/friendshipSlice"

const SOCKET_URL = "http://localhost:3000"

export interface OnlineStatus {
    friendId: number,
    online: boolean
}

export interface SocketContextType {
    socket: Socket;
    connect:()=>void;
    disconnect:()=>void;
}

const SocketContext = createContext<SocketContextType|undefined>(undefined)

interface SocketContextProps {
    children: ReactNode
}

export function SocketContextProvider({children}:SocketContextProps) {

    const [socket] = useState<Socket>(() => io(SOCKET_URL, {autoConnect: false, transports: ['websocket']}))
    const [initConn, setInitConn] = useState<boolean>(false)

    const userId = useSelector((state:any) => state.auth.userId)
    const dispatch = useDispatch()

    // Listen to ws events
    useEffect(() => {

        if (!userId) return;
        if (!socket.connected) return;
        console.log('connected ws: ', socket)

        // Listen ws events
        socket.on('friends online status', (onlineStatus:OnlineStatus) => dispatch(updateOnlineStatus(onlineStatus)))
        
        socket.on('friendship', (friendship:any) => {

            // This event can be used to receive:

            // - Friendship request (accepted == 0, wait == 1)
            if (!friendship.accepted && friendship.wait) {
                return dispatch(addReceivedRequest(friendship))
            } 

            // - Friendship accepted (accepted === 1, wait === 0)
            if (friendship.accepted && !friendship.wait) {
                dispatch(removeReceivedRequest(friendship))
                return dispatch(addFriend(friendship.user))
            } 

            // - Friendship denied (accepted === 0, wait === 0)
            if (!friendship.accepted && !friendship.wait) {
                return dispatch(removeSentRequest(friendship))
            } 
            
        })

        return () => {
            socket.off('friends online status')
            socket.off('friendship')
        }

    }, [initConn, userId])


    // Trigger ws events
    const connect = () => {  
        console.log('connecting ws') 
        socket.connect()
        socket.on('connect', () => {
            setInitConn((prev) => !prev)
        })
    }

    const disconnect = () => {
        socket.disconnect()
    }

    return (
        <SocketContext.Provider value={{
            socket,
            connect,
            disconnect,
        }}>

            {children}

        </SocketContext.Provider>
    )
}

export default SocketContext