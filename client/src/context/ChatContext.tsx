import { createContext, ReactNode, useState } from "react";

export interface Chatting {
    type: 'friend' | 'group',
    id: number
}

export interface ChatContextType {
    chatting: Chatting|null
    updateChatting:(newChatting:Chatting)=>void
}

const ChatContext = createContext<ChatContextType|undefined>(undefined)

interface ChatContextProps {
    children: ReactNode
}

export function ChatContextProvider({children}:ChatContextProps) {

    const [chatting, setChatting] = useState<Chatting|null>(null)

    const updateChatting = (newChatting:Chatting) => {
        //console.log('newChatting: ',newChatting)
        if (!newChatting) return;
        setChatting(newChatting)
    }

    return (
        <ChatContext.Provider value={{
            chatting,
            updateChatting
        }}>

            {children}

        </ChatContext.Provider>
    )
}

export default ChatContext