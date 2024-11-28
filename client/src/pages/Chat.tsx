import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'


const Chat = () => {

    const {id} = useParams()

    const email:string = useSelector((state:any) => state.auth.email)

    const [message, setMessage] = useState<string>('')

    useEffect(() => {

    }, [id, email])

    const handleSubmit = (e:any) => {
        e.preventDefault()

        if (!message.length) return;

        
    }

    return (
        <div className='flex flex-col items-center justify-center gap-3'>

            <div className='border-black border-2 w-64 h-72'>

            </div>

            <form onSubmit={handleSubmit} className='flex gap-2'>
                <textarea name="message" id="message" className='border-2 border-black' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                <input type='submit' value='send' className='border boder-black hover:bg-black hover:text-white px-2 cursor-pointer'/>
            </form>
            
        </div>
    )
}

export default Chat