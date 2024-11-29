import { createContext, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
const SOCKET_URL = "http://localhost:3000"

export interface SocketContextType {
    socket: Socket
    connect:(email:string)=>void;
    disconnect:()=>void;
    connectedUsers:any[];
}

const SocketContext = createContext<SocketContextType|undefined>(undefined)

interface SocketContextProps {
    children: ReactNode
}

export function SocketContextProvider({children}:SocketContextProps) {

    const [socket] = useState<Socket>( () => io(SOCKET_URL, {autoConnect: false, transports: ['websocket']}) )

    const isLogged = useSelector((state:any) => state.auth.isLoggedIn)

    // Events from server
    /* 
        connected_users
        ...
    */
    const [connectedUsers, setConnectedUsers] = useState<any[]>([])
    useEffect(() => {
        console.log('connectedUsers: ', connectedUsers)
    }, [connectedUsers])

    useEffect(() => {

        console.log('SOCKET: ', socket)
        console.log('isLogged: ', isLogged)

        if (!isLogged) return;

        // get all connected_users -> HOME component
        socket.on('connected users', (connectedUsers:any[]) => {
            connectedUsers.forEach(connectedUser => {
                // Add 'self' property to user who is current logged user
                connectedUser.self = connectedUser.userId === socket.id
            });
            setConnectedUsers(connectedUsers);
        })

        // Update all connected_users -> HOME component
        socket.on('user connected',  (user) => {
            setConnectedUsers((prev:any) => [...prev, user])
        })

        // Update all connected_users -> HOME component
        socket.on('user disconnected',  (user) => {
            //console.log('USER TO DISCONNECT: ', user)
            setConnectedUsers((prev:any[]) => prev.filter((localUser:any) => localUser.userId !== user.userId))
        })

        return () => {
            socket.off('connected users')
            socket.off('user connected')
            socket.off('user disconnected')
        }

    }, [socket, isLogged])

    const connect = (email:string) => {   
        socket.auth = {email}
        socket.connect()
    }

    const disconnect = () => {
        socket.disconnect()
    }

    // Use in chat component
    const sendPrivateMessage = () => {
    }

    return (
        <SocketContext.Provider value={{
            socket,
            connect,
            disconnect,
            connectedUsers,
        }}>

            {children}

        </SocketContext.Provider>
    )
}

export default SocketContext