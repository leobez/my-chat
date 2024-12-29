import { useEffect, useRef, useState } from "react"
import { useGetUserById } from "../../hooks/userHooks/useGetUserById"
import { useGetHistory } from "../../hooks/messageHooks/useGetHistory"
import { useSendMessage } from "../../hooks/messageHooks/useSendMessage"
import { useSelector } from "react-redux"
import { History, Message } from "../../slices/messageSlice"
import { Friend } from "../../slices/friendshipSlice"

type Props = {
    userId: number
}

const FriendChat = (props: Props) => {

    // ids of friends and mine
    const me_id = useSelector((state:any) => state.auth.userId)
    const friend_id = props.userId
    const [friend, setFriend] = useState<any>(null)

    // Hooks
    const {getUserById} = useGetUserById()
    const {getHistoryWithUser} = useGetHistory()

    useEffect(() => {
        const friend = getUserById(friend_id)
        setFriend(friend)
        getHistoryWithUser(friend_id);
    }, [friend_id])

    const allHistories = useSelector((state:any) => state.message.completeHistory)
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const filteredHistory = allHistories.filter((history:History) => history.userId === friend_id);
        if (!filteredHistory.length) return;
        const relevantHistory = filteredHistory[0].history
        setMessages(relevantHistory)
    }, [allHistories, messages])

    // Auto scroll to bottom of chat box when history updates
    const endOfChatBoxRef = useRef<any>(null)
    useEffect(() => {
        if (endOfChatBoxRef.current) {
            endOfChatBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages])


    // Send message function and state
    const {sendMessageTo} = useSendMessage()

    const [message, setMessage] = useState<string>('')

    const handleSubmit = async(e:any) => {

        e.preventDefault()

        if (!message.length) return;
        if (message.length > 150) return;

        await sendMessageTo(friend_id, message)

        setMessage("")
    }

    return (
        <div className="w-full h-full">
           {friend && 
                <div className="flex flex-col h-full">

                    <div className="h-16 bg-black text-white font-bold flex items-center justify-start px-3">
                        <p>{friend.username}</p>
                    </div>
                    
                    {/* CHAT BOX */}
                    <div className='w-full flex-1 flex flex-col gap-4 overflow-y-auto p-2 scrollbar-thin'>

                        {messages && messages.map((message:any) => (

                            <div key={message.messageId} className='flex flex-col'>

                                {/* MY MESSAGE */}
                                {Number(message.from_user) === Number(me_id) && 
                                    <div className='rounded-xl border-2 border-black text-black w-1/2 self-start'>
                                        <p className='p-4 w-full h-full text-left'>
                                            {message.content}
                                        </p>
                                    </div>
                                }

                                {/* OTHER PERSON MESSAGE */}
                                {Number(message.from_user) === Number(friend_id) && 
                                    <div className='rounded-xl border-2 border-black text-white bg-black w-1/2 self-end'>
                                    <p className='p-4 w-full h-full text-left'>
                                        {message.content}
                                    </p>
                                </div>
                                }

                            </div>
                        ))}

                        <div ref={endOfChatBoxRef}/>

                    </div>

                    {/* MESSAGE AREA */}
                    <form onSubmit={handleSubmit} className='flex w-full h-14'>

                        <textarea 
                            name="message" 
                            id="message" 
                            className='border-t-2 border-black w-5/6 resize-none outline-none px-2' 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>

                        <input 
                            type='submit' 
                            value='send' 
                            className='border-t-2 border-l-2 border-black hover:bg-black hover:text-white duration-200 px-2 cursor-pointer w-1/6'
                        />
                    
                    </form>

                </div>
            }
        </div>
    )
}

export default FriendChat