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
        <div className='border-2 border-black '>
            
            {/* FORM TO FIND */}
            <div className='p-2 grid place-items-center'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-80 py-3'>
                
                <div className='border-b-2 border-black p-2'>
                    <p>Add a friend</p>
                </div>

                <div className='flex gap-1 flex-col'>
                    <label htmlFor="email" className='flex justify-start'>Enter user Id:</label>
                    <input 
                        type="number" 
                        name="userIdToAdd" 
                        id="userIdToAdd" 
                        onChange={(e) => setUserIdToAdd(Number(e.target.value))}
                        value={userIdToAdd}
                        className='border-2 border-black w-full p-2'
                    /> 
                </div>

                <div className='flex gap-2 justify-center'>
                    <input type="submit" value="Send request" className='border-2 border-black px-3 py-2 w-fit cursor-pointer hover:bg-black hover:text-white duration-200'/>
                </div>

                </form>
            </div>
        </div>
    )
}

export default AddFriend