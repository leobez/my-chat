import { useContext } from 'react';
import FriendChat from './FriendChat'
import ChatContext, { ChatContextType } from '../../context/ChatContext';

const Chat = () => {

    // Get what we are chatting (could be friend or user)
    const {chatting} = useContext(ChatContext) as ChatContextType

    if (!chatting) return;
    
    if (chatting.type === 'friend') {
        return (
            <div className="border-2 border-black h-[450px] w-full">
                <FriendChat userId={chatting.id}/>
            </div>
        )
    }

    if (chatting.type === 'group') {
        return (
            <div className="border-2 border-black h-[450px] w-full">
                GROUP CHAT WITH: {chatting.id}
            </div>
        )  
    }

}

export default Chat