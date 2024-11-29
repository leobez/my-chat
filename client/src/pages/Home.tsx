import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import SocketContext, { SocketContextType } from "../context/SocketContext";
import Chat from "./Chat";


const Home = () => {

    const email = useSelector((state:any) => state.auth.email)
    const isLogged = useSelector((state:any) => state.auth.isLoggedIn)

    const {connect, disconnect, connectedUsers, talkTo, userToTalk} = useContext(SocketContext) as SocketContextType

    useEffect(() => {

      // User somehow got here wihout being logged
      if (!isLogged) return;

      // Connect to server via websockets
      connect(email)

    }, [isLogged])

    return (
      
      <div className="flex flex-col justify-center">
        <p>HOME</p>

        <div className="flex gap-2">

          {connectedUsers && connectedUsers.map((connectedUser:any, index:number) => (
            <div key={index} className="w-fit">
              {connectedUser && <>
                  {connectedUser.self ? (
                  <div key={index} className="w-fit border-2 border-green-700 py-2 px-4">
                    <p>{connectedUser.email}</p>
                  </div>
                ) : (
                  <div key={index} className="w-fit border-2 border-blue-700 py-2 px-4">
                    <p>{connectedUser.email}</p>
                    <button className="p-1 border border-black" onClick={() => talkTo(connectedUser.userId)}>chat</button>
                  </div>
                )}
              </>}
            </div>

          ))}

        </div>
        
        {userToTalk && userToTalk.length > 0 && <Chat/>}

      </div>

    )
}

export default Home