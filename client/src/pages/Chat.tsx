import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import SocketContext, { SocketContextType } from '../context/SocketContext';


const Chat = () => {

    const {userToTalk, sendMessage} = useContext(SocketContext) as SocketContextType

    const {id} = useParams()

    const email:string = useSelector((state:any) => state.auth.email)

    const [message, setMessage] = useState<string>('')

    useEffect(() => {

    }, [id, email])

    const handleSubmit = (e:any) => {
        e.preventDefault()
        if (!message.length) return;
        sendMessage(message)
    }

    return (
        <div className='flex flex-col items-center justify-center gap-2 w-64 h-80 border-2 border-black p-2 self-center'>
            
            <p>TALKING TO: {userToTalk}</p>

            <div className='border-black border-2 w-full h-5/6'>

            </div>

            <form onSubmit={handleSubmit} className='flex gap-2 w-full h-1/6'>
                <textarea name="message" id="message" className='border-2 border-black w-4/6' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                <input type='submit' value='send' className='border boder-black hover:bg-black hover:text-white px-2 cursor-pointer w-2/6'/>
            </form>
            
        </div>
    )
}

export default Chat