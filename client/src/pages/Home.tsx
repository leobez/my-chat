import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import SocketContext, { SocketContextType } from "../context/SocketContext";


const Home = () => {

    const email = useSelector((state:any) => state.auth.email)
    const isLogged = useSelector((state:any) => state.auth.isLoggedIn)

    const {connect, disconnect, connectedUsers} = useContext(SocketContext) as SocketContextType

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
            <>
              {connectedUser.self ? (
                <div key={index} className="w-1/12 h-12 border-2 border-green-700">
                  <p>{connectedUser.email}</p>
                </div>
              ) : (
                <div key={index} className="w-1/12 h-12 border-2 border-blue-700">
                  <p>{connectedUser.email}</p>
                </div>
              )}
            </>

          ))}

        </div>

      </div>

    )
}

export default Home