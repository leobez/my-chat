import { createContext, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import SocketService from "../services/SocketService";

const SOCKET_URL = "http://localhost:3000"

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

    const [socket] = useState<Socket>(() => io(SOCKET_URL, {autoConnect: true, transports: ['websocket']}))
    const userId = useSelector((state:any) => state.auth.userId)

    // Listen to ws events
    useEffect(() => {

        console.log('Socket: ', socket)
        if (!userId) return;

        // Listen ws events
        socket.on('friends online status', SocketService.friendOnlineStatus)
        // socket.on('friendship', SocketService)

        return () => {
            socket.off('friends online status')
            socket.off('friendship')
        }

    }, [socket, userId])

    // Trigger ws events
    const connect = () => {  
        console.log('connecting ws') 
        socket.connect()
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