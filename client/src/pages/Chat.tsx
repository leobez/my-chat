import { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { useGetById } from '../hooks/useGetById';
import { useSendMessage } from '../hooks/useSendMessage';
import { useGetHistory } from '../hooks/useGetHistory';
import SocketContext, { SocketContextType } from '../context/SocketContext';


const Chat = () => {

    const {id} = useParams()

    const {userData:userWeAreTalkingTo, getUserById} = useGetById()
    const {sendMessage} = useSendMessage()
    const {history, getHistoryWithThisUser, addToHistory} = useGetHistory()


    // Auto scroll to bottom
    const endOfChatBoxRef = useRef<any>(null)
    useEffect(() => {
        if (endOfChatBoxRef.current) {
            endOfChatBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history])

    useEffect(() => {
        if (!id) return;
        getUserById(id);
        getHistoryWithThisUser(id);
    }, [id])

    const [message, setMessage] = useState<string>('')
    const userId = useSelector((state:any) => state.auth.userId)

    const {sendMessage:sendMessageWS} = useContext(SocketContext) as SocketContextType

    const handleSubmit = async(e:any) => {
        e.preventDefault()
        if (!message.length) return;
        console.log(`Sending message from [ ${userId} ] to [ ${userWeAreTalkingTo.userId} ] : `, message)

        // Send to API
        const newMessage = await sendMessage(message, userId, userWeAreTalkingTo.userId)

        // Send by websocket
        sendMessageWS(newMessage)

        // Add to local history of messages
        addToHistory(newMessage)
        
        setMessage("")
    }

    return (
        <div className='flex flex-col items-center justify-center gap-2 w-[400px] h-80 border-2 border-black p-2 self-center'>
            
            {userWeAreTalkingTo ? (
                <>
                    <p>Talking to user of Id: {userWeAreTalkingTo.userId}</p>

                    {/* CHAT BOX */}
                    <div className='border-black border-2 w-full h-5/6 flex flex-col gap-5 overflow-y-scroll p-2'>

                        {history && history.map((message:any, index:number) => (

                            <div key={index} className='flex flex-col'>

                                {/* MY MESSAGE */}
                                {message.from_user === userId && 
                                    <div className='rounded-xl bg-green-300 w-1/2 self-start'>
                                        <p className='p-2 w-full h-full'>
                                            {message.content}
                                        </p>
                                    </div>
                                }

                                {/* OTHER PERSON MESSAGE */}
                                {message.from_user === userWeAreTalkingTo.userId && 
                                    <div className='rounded-xl bg-red-300 w-1/2 self-end'>
                                        <p className='p-2 w-full h-full'>
                                            {message.content}
                                        </p>
                                    </div>
                                }

                            </div>
                        ))}

                        <div ref={endOfChatBoxRef}/>

                    </div>

                    {/* MESSAGE AREA */}
                    <form onSubmit={handleSubmit} className='flex gap-2 w-full h-1/6'>
                        <textarea name="message" id="message" className='border-2 border-black w-4/6' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                        <input type='submit' value='send' className='border boder-black hover:bg-black hover:text-white px-2 cursor-pointer w-2/6'/>
                    </form>
                </>
            ) : (
                <>
                    <p>User does not exist</p>
                </>
            )}

            
            
        </div>
    )
}

export default Chat