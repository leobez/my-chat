import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import SocketContext, { SocketContextType } from '../context/SocketContext';
import { useGetById } from '../hooks/useGetById';


const Chat = () => {

    const {id} = useParams()

    const {userData:userWeAreTalkingTo, getUserById} = useGetById()

    useEffect(() => {
        if (!id) return;
        getUserById(id)
    }, [id])

    const [message, setMessage] = useState<string>('')
    const userId = useSelector((state:any) => state.auth.userId)

    const handleSubmit = (e:any) => {
        e.preventDefault()
        if (!message.length) return;
        console.log(`Sending message from [ ${userId} ] to [ ${userWeAreTalkingTo.userId} ] : `, message)
        //sendMessage(message)
    }

    return (
        <div className='flex flex-col items-center justify-center gap-2 w-64 h-80 border-2 border-black p-2 self-center'>
            
            {userWeAreTalkingTo ? (
                <>
                    <p>Talking to user of Id: {userWeAreTalkingTo.userId}</p>

                    {/* CHAT BOX */}
                    <div className='border-black border-2 w-full h-5/6'>
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