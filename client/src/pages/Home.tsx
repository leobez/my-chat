import { useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { useGetAllUsers } from "../hooks/userHooks/useGetAllUsers";
import SocketContext, { SocketContextType } from "../context/SocketContext";
import Chat from "../components/Home/Chat";
import Selection from "../components/Home/Selection";


const Home = () => {

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