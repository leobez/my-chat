import { createContext, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
const SOCKET_URL = "http://localhost:3000"

export interface SocketContextType {
    socket: Socket;
    newMessageFromWS: any;
    updateIsTalkingTo:(id:string)=>void;
    connect:(email:string)=>void;
    disconnect:()=>void;
    sendMessage:(message:string)=>void;
}

const SocketContext = createContext<SocketContextType|undefined>(undefined)

interface SocketContextProps {
    children: ReactNode
}

export function SocketContextProvider({children}:SocketContextProps) {

    const [socket] = useState<Socket>( () => io(SOCKET_URL, {autoConnect: false, transports: ['websocket']}) )
    const isLogged = useSelector((state:any) => state.auth.isLoggedIn)
    const [isTalkingTo, setIsTalkingTo] = useState<string>('')
    const [newMessageFromWS, setNewMessageFromWS] = useState<any>(null)

    useEffect(() => {

        console.log('Socket: ', socket)
        console.log('isLogged: ', isLogged)
        console.log('isTalkingTo: ', isTalkingTo)

        if (!isLogged) return;

        // Update when user receives message
        socket.on('private message', (message) => {
            console.log('Received message: ', message)
            if (message.from_user === isTalkingTo) {
                setNewMessageFromWS(message)
            }
        })

        // When an error occurs
        socket.on('connect_error', (err:any) => {
            console.log(err.message)
            console.log(err.data)
        })

        return () => {
            socket.off('private message')
            socket.off('connect_error')
        }

    }, [socket, isLogged, isTalkingTo])

    const connect = (userId:string) => {   
        socket.auth = {userId}
        socket.connect()
    }

    const disconnect = () => {
        socket.disconnect()
    }

    const sendMessage = (message:any) => {
        
        console.log('Sending via WS: ', message)

        socket.emit("private message", {
            message: message,
        })

    }

    const updateIsTalkingTo = (id:string) => {
        setIsTalkingTo(id)
    }


    return (
        <SocketContext.Provider value={{
            socket,
            updateIsTalkingTo,
            connect,
            disconnect,
            newMessageFromWS,
            sendMessage
        }}>

            {children}

        </SocketContext.Provider>
    )
}

export default SocketContext