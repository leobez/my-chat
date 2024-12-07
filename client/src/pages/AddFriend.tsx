import React, { useState } from 'react'
import FeedbackMessage from '../components/FeedbackMessage'

type Props = {}

const AddFriend = (props: Props) => {

    const [usernameToAdd, setUsernameToAdd] = useState<string>('')

    const handleSubmit = (e:any) => {
        e.preventDefault()
    }

    return (
        <div className='border-2 border-black '>
            
            {/* FORM TO FIND */}
            <div className='p-2 grid place-items-center'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-80 py-3'>
                
                <div className='border-b-2 border-black p-2'>
                    <p>ADD A FRIEND</p>
                </div>

                <div className='flex gap-1 flex-col'>
                    <label htmlFor="email" className='flex justify-start'>Username:</label>
                    <input 
                        type="text" 
                        name="usernameToAdd" 
                        id="usernameToAdd" 
                        onChange={(e) => setUsernameToAdd(e.target.value)}
                        value={usernameToAdd}
                        className='border-2 border-black w-full p-2'/>                
                </div>

                <div className='flex gap-2 justify-center'>
                    <input type="submit" value="Send request" className='border-2 border-black px-3 py-2 w-fit cursor-pointer hover:bg-black hover:text-white duration-200'/>
                </div>

                {/* <FeedbackMessage clientSideFeedback={clientSideFeedback}/>
                <FeedbackMessage serverSideFeedback={serverSideFeedback}/> */}

                </form>
            </div>

            {/* SUGGESTIONS */}
            <div className='p-2'>
                SUGGESTIONS
            </div>

        </div>
    )
}

export default AddFriend