import { useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { useGetAllUsers } from "../hooks/userHooks/useGetAllUsers";
import SocketContext, { SocketContextType } from "../context/SocketContext";


const Home = () => {

    const isLogged = useSelector((state:any) => state.auth.isLoggedIn)
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

        <div className="flex gap-2">

          {/* FRIENDSLIST */}
          <div className="border-2 border-black p-2 min-h-96 w-2/6">
            <p>FRIENDLIST</p>
            <p>REQUEST SENT</p>
            <p>REQUEST RECEIVED</p>
          </div>

          {/* CHAT COMPONENT */}
          <div className="border-2 border-black p-2 min-h-96 w-4/6">
            CHAT
          </div>

        </div>
        
      </div>

    )
}

export default Home