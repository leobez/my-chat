import { useContext, useEffect } from "react";
import Chat from "../components/Home/Chat";
import Selection from "../components/Home/Selection";
import { useListFriends } from "../hooks/friendshipHooks/useListFriends";
import { useListReceivedRequests } from "../hooks/friendshipHooks/useListReceivedRequests";
import { useListSentRequests } from "../hooks/friendshipHooks/useListSentRequests";
import { useSocket } from "../hooks/useSocket";
import SocketContext, { SocketContextType } from "../context/SocketContext";


const Home = () => {

    const {listFriends} = useListFriends()
    const {listReceivedRequests} = useListReceivedRequests()
    const {listSentRequests} = useListSentRequests()
    const {connect} = useContext(SocketContext) as SocketContextType
    useSocket()

    useEffect(() => {
      listFriends()
      listReceivedRequests()
      listSentRequests()
      connect()
    }, [])

    return (
      
      <div className="flex flex-col justify-center items-center">
        <div className="flex gap-2 w-full">
          <Selection/>
          <Chat/>          
        </div>
      </div>

    )
}

export default Home