import { useSelector } from 'react-redux'
import FriendChat from './FriendChat'

type Props = {}

const Chat = (props: Props) => {

    // Get what we are chatting (could be friend or user)
    const chattingWith = useSelector((state:any) => state.chat)
    if (!chattingWith) return;
    
    if (chattingWith.type === 'friend') {
        return (
            <div className="border-2 border-black h-[450px] w-9/12">
                <FriendChat userId={chattingWith.id}/>
            </div>
        )
    }

    if (chattingWith.type === 'group') {
        return (
            <div className="border-2 border-black h-[450px] w-9/12">
                GROUP CHAT WITH: {chattingWith.id}
            </div>
        )  
    }

}

export default Chat