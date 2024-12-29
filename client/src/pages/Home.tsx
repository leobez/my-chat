import { useContext, useEffect, useState } from "react";
import Chat from "../components/Home/Chat";
import Selection from "../components/Home/Selection";
import { useListFriends } from "../hooks/friendshipHooks/useListFriends";
import { useListReceivedRequests } from "../hooks/friendshipHooks/useListReceivedRequests";
import { useListSentRequests } from "../hooks/friendshipHooks/useListSentRequests";
import { useSocket } from "../hooks/useSocket";
import SocketContext, { SocketContextType } from "../context/SocketContext";

export interface ChattingWith {
  type: 'friend' | 'group'
  id: number
}

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

    const [chattingWith, setChattingWith] = useState<ChattingWith|null>(null)
    const updateChattingWith = (chat:ChattingWith) => setChattingWith(chat)
  
    return (
      
      <div className="flex flex-col justify-center">
        <div className="flex gap-2">
          <Selection updateChattingWith={updateChattingWith}/>
          <Chat chattingWith={chattingWith}/>          
        </div>
      </div>

    )
}

export default Home