import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
const SOCKET_URL = "http://localhost:3000"

export interface SocketContextType {
    socket: Socket
    connect:(email:string)=>void;
    disconnect:()=>void;
}

const SocketContext = createContext<SocketContextType|undefined>(undefined)

interface SocketContextProps {
    children: ReactNode
}

export function SocketContextProvider({children}:SocketContextProps) {

    const [socket] = useState<Socket>( () => io(SOCKET_URL, {autoConnect: false, transports: ['websocket']}) )

    useEffect(() => {
        console.log('SOCKET: ', socket)
    }, [socket])

    const connect = (email:string) => {
        socket.auth = {email}
        socket.connect()
    }

    const disconnect = () => {
        socket.disconnect()
    }

    // Use in home component
    const getAllConnectedUsers = () => {
    }

    // Use in chat component
    const sendPrivateMessage = () => {
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