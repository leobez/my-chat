import { createContext, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
const SOCKET_URL = "http://localhost:3000"

export interface SocketContextType {
    socket: Socket
    connect:(email:string)=>void;
    disconnect:()=>void;
    connectedUsers:any[];
    talkTo:(userId:string)=>void;
    userToTalk:string;
    sendMessage:(message:string)=>void;
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

    const [userToTalk, setUserToTalk] = useState<string>('')

    useEffect(() => {

        console.log('SOCKET: ', socket)
        console.log('isLogged: ', isLogged)

        if (!isLogged) return;

        // get all connected_users -> HOME component
        socket.on('connected users', (connectedUsers:any[]) => {
            connectedUsers.forEach(connectedUser => {
                // Add 'self' property to user who is current logged user
                connectedUser.self = connectedUser.userId === socket.id
                connectedUser.messages = []
            });
            setConnectedUsers(connectedUsers);
        })

        // Update all connected_users -> HOME component
        socket.on('user connected',  (user) => {
            user.messages = []
            setConnectedUsers((prev:any) => [...prev, user])
        })

        // Update all connected_users -> HOME component
        socket.on('user disconnected',  (user) => {
            //console.log('USER TO DISCONNECT: ', user)
            setConnectedUsers((prev:any[]) => prev.filter((localUser:any) => localUser.userId !== user.userId))
        })

        // Update when user receives message
        socket.on('private message', ({content, from}) => {
            for (let a=0; a<connectedUsers.length; a++) {
                const user = connectedUsers[a]
                if (user.userId === from) {
                    user.messages.push({
                        content: content,
                        fromSelf: false
                    })
                }
            }
        })

        return () => {
            socket.off('connected users')
            socket.off('user connected')
            socket.off('user disconnected')
            socket.off('private message')
        }

    }, [socket, isLogged])

    const connect = (email:string) => {   
        socket.auth = {email}
        socket.connect()
    }

    const disconnect = () => {
        socket.disconnect()
    }

    const talkTo = (userId:string) => {
        if (userToTalk === userId) {
            setUserToTalk('')
            return;
        }
        console.log('TALK TO: ', userId)
        setUserToTalk(userId)
    }

    const sendMessage = (message:string) => {

        console.log('SENDING: ', {content:message, to:userToTalk})

        socket.emit("private message", {
            content: message,
            to: userToTalk,
        })

/*         setConnectedUsers((prev) => {}prev.map((user:any) => {
            if (user.userId === userToTalk) {
                user.messages.push({
                    content: message,
                    from: socket.id
                })
            }
        })) */

        setConnectedUsers((prev) => {
            console.log('prev: ', prev)
            return prev.map((user:any) => {
                if (user.userId === userToTalk) {
                    user.messages.push({
                        content: message,
                        from: socket.id
                    })
                }
            })
        })

    }

    return (
        <SocketContext.Provider value={{
            socket,
            connect,
            disconnect,
            connectedUsers,
            talkTo,
            userToTalk,
            sendMessage
        }}>

            {children}

        </SocketContext.Provider>
    )
}

export default SocketContext