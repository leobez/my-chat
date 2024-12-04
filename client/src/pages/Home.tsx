import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import SocketContext, { SocketContextType } from "../context/SocketContext";
import Chat from "./Chat";
import { useGetAllUsers } from "../hooks/useGetAllUsers";


const Home = () => {

    const isLogged = useSelector((state:any) => state.auth.isLoggedIn)

    const {usersList, getAllUsers} = useGetAllUsers()

    useEffect(() => {

      // User somehow got here wihout being logged
      if (!isLogged) return;

      // Get all users from DB
      getAllUsers()

    }, [isLogged])

    return (
      
      <div className="flex flex-col justify-center">

        <p>HOME</p>

        <div className="flex gap-2">
          {usersList && usersList.map((user) => (
            <div key={user.userId} className="border-2 border-black p-3">
              <p>{user.username}</p>

              <div className="border-black border-2">
                <Link to={`/chat/${user.userId}`} className="h-full w-full">Talk to user</Link>
              </div>

            </div>
          ))}

        </div>
        
      </div>

    )
}

export default Home