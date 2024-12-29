import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { History, Message } from '../../slices/messageSlice'
import { useSelector } from 'react-redux'
import { useGetHistory } from '../../hooks/messageHooks/useGetHistory'
import { useSendMessage } from '../../hooks/messageHooks/useSendMessage'
import { useSocket } from '../../hooks/useSocket'

const Chat = () => {

    // Read url params
    const params = useParams()

    // Get friends userId
    const friendId:number = Number(params.id)

    // Get full history with this user and save it on redux
    useEffect(() => {
        getHistoryWithUser(friendId)
    }, [params])

    // ...
    useSocket()

    const allHistories = useSelector((state:any) => state.message.completeHistory)

    const [message, setMessage] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])

    const {getHistoryWithUser} = useGetHistory()
    const {sendMessageTo} = useSendMessage()

    useEffect(() => {
        const filteredHistory = allHistories.filter((history:History) => history.userId === friendId);
        if (!filteredHistory.length) return;
        const relevantHistory = filteredHistory[0].history
        setMessages(relevantHistory)
    }, [allHistories, messages])

    const handleSubmit = (e:any) => {
        e.preventDefault()
        
        // Validate message
        // ...

        sendMessageTo(friendId, message)

    }

    return (
        <div className='flex items-center justify-center p-4'>

            <div className='h-[450px] w-[450px] border-2 border-black'>

                {/* message field */}
                <div className='h-5/6 bg-purple-200 overflow-auto py-3'>
                    {messages.map((message:Message) => (
                        <div key={message.messageId}>
                            { message.from_user === friendId ? 
                                <div className='bg-red-200'>
                                    {message.content}
                                </div> 
                                : 
                                <div className='bg-green-200'>
                                    {message.content}
                                </div>
                            }
                        </div>
                    ))}
                </div>

                {/* form */}
                <div className='h-1/6'>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="message" id="message" onChange={(e) => setMessage(e.target.value) } className='w-5/6 border-2 border-black p-3'/>
                        <input type="submit" value="Enviar" className='p-3' />
                    </form>
                </div>

            </div>

        </div>
    )
}

export default Chat