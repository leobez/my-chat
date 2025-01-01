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
      
      <div className="flex-grow flex gap-1 items-center">
        <Selection/>
        <Chat/>          
      </div>

    )
}

export default Home