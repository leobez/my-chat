import { useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { useGetAllUsers } from "../hooks/useGetAllUsers";
import SocketContext, { SocketContextType } from "../context/SocketContext";


const Home = () => {

    const isLogged = useSelector((state:any) => state.auth.isLoggedIn)
    const username = useSelector((state:any) => state.auth.username)
    const userId = useSelector((state:any) => state.auth.userId)

    const {usersList, getAllUsers} = useGetAllUsers()
    const {connect} = useContext(SocketContext) as SocketContextType

    useEffect(() => {

      // User somehow got here wihout being logged
      if (!isLogged) return;

      // Get all users from DB
      getAllUsers()

      // Initiate connection via websocket
      connect(userId)

    }, [isLogged, userId])

    return (
      
      <div className="flex flex-col justify-center">

        <p>HOME: {username}</p>

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