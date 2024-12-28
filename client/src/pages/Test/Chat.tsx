import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { History, Message } from '../../slices/messageSlice'
import { useSelector } from 'react-redux'
import { useGetHistory } from '../../hooks/messageHooks/useGetHistory'

const Chat = () => {

    const params = useParams()
    const friendId:number = Number(params.id)

    const userId = useSelector((state:any) => state.auth.userId)
    const allHistories = useSelector((state:any) => state.message.completeHistory)

    const [messages, setMessages] = useState<Message[]>([])

    const {getHistoryWithUser} = useGetHistory()

    useEffect(() => {
        console.log('messages: ', messages)
    }, [messages])

    useEffect(() => {
        console.log('allHistories: ', allHistories)
        const filteredHistory = allHistories.filter((history:History) => history.userId === friendId);
        const relevantHistory = filteredHistory[0].history

        setMessages(relevantHistory)

    }, [allHistories, messages])

    useEffect(() => {
        getHistoryWithUser(friendId)
    }, [params])

    return (
        <div className='flex items-center justify-center p-4'>

            <div className='h-[450px] w-[450px] border-2 border-black'>

                {/* message field */}
                <div className='h-5/6 bg-red-200'>
                    {messages.map((message:Message) => (
                        <div key={message.messageId}>
                            {message.from_user === friendId}
                            {}
                        </div>
                    ))}
                </div>

                {/* form */}
                <div className='h-1/6'>

                </div>

            </div>

        </div>
    )
}

export default Chat