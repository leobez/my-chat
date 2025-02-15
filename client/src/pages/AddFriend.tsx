import { useState } from 'react'
import { useSendFriendRequest } from '../hooks/friendshipHooks/useSendFriendRequest'

const AddFriend = () => {

    const [userIdToAdd, setUserIdToAdd] = useState<number>(0)

    const {sendFriendRequest} = useSendFriendRequest()

    const handleSubmit = (e:any) => {
        e.preventDefault()
        sendFriendRequest(userIdToAdd)
    }

    return (
        <div className='h-full bg-blue-600 rounded-lg text-white'>
            
            {/* FORM TO FIND */}
            <div className='p-2 grid place-items-center'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-80 py-3'>
                
                <div className='border-b-2 p-2'>
                    <p className='font-bold'>Adicione um amigo</p>
                </div>

                <div className='flex gap-1 flex-col'>
                    <label htmlFor="userIdToAdd" className='flex justify-start'>ID:</label>
                    <input 
                        type="number" 
                        name="userIdToAdd" 
                        id="userIdToAdd" 
                        onChange={(e) => setUserIdToAdd(Number(e.target.value))}
                        value={userIdToAdd}
                        className='text-black w-full p-2 border-none outline-none'
                    /> 
                </div>

                <div className='flex gap-2 justify-center'>
                    <input type="submit" value="Send request" className='bg-blue-800 hover:bg-blue-950 px-3 py-2 w-fit cursor-pointer text-white duration-300'/>
                </div>

                </form>
            </div>
        </div>
    )
}

export default AddFriend