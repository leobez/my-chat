import { useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { useGetAllUsers } from "../hooks/userHooks/useGetAllUsers";
import SocketContext, { SocketContextType } from "../context/SocketContext";
import Chat from "../components/Home/Chat";
import Selection from "../components/Home/Selection";


const Home = () => {

    const isLogged = useSelector((state:any) => state.auth.isLoggedIn)
    const userId = useSelector((state:any) => state.auth.userId)

    /* const {connect} = useContext(SocketContext) as SocketContextType */

    useEffect(() => {

      // User somehow got here wihout being logged
      if (!isLogged) return;

      // Get all users from DB
      /* getAllUsers() */

      // Initiate connection via websocket
      /* connect(userId) */

    }, [isLogged, userId])

    return (
      
      <div className="flex flex-col justify-center">

        <div className="flex gap-2">
          <Selection/>
          <Chat/>          
        </div>
        
      </div>

    )
}

export default Home