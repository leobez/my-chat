import { createContext, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"

export interface OnlineStatus {
    userId: number,
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

    // Listen to ws events
    useEffect(() => {

        if (!userId) return;
        if (!socket.connected) return;
        console.log('connected ws: ', socket)

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