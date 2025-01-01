import { useState } from 'react'
import SelectionFriends from './SelectionFriends'
import SelectionGroups from './SelectionGroups'

const Selection = () => {

    const [selection, setSelection] = useState<'friends'|'groups'>("friends")

    return (
        <div className="border-2 border-black p-2 h-full w-[320px] gap-2 flex flex-col rounded-lg relative self-start">

            <div className="flex">

                {selection === 'friends' &&
                    <>
                        <button 
                            className="w-1/2 p-2 bg-black text-white rounded-l-lg" 
                            onClick={() => setSelection('friends')}
                        >
                            Friends
                        </button>

                        <button 
                            className="w-1/2 p-2 hover:bg-black hover:text-white duration-300 border-b-2 border-black" 
                            onClick={() => setSelection('groups')}
                        >
                            Groups
                        </button>
                    </>
                }
                
                {selection === 'groups' &&
                    <>
                        <button 
                            className="w-1/2 p-2 hover:bg-black hover:text-white duration-300 border-b-2 border-black" 
                            onClick={() => setSelection('friends')}
                        >
                            Friends
                        </button>

                        <button 
                            className="w-1/2 p-2 bg-black text-white rounded-r-lg" 
                            onClick={() => setSelection('groups')}
                        >
                            Groups
                        </button>
                    </>
                }

            </div>
            
            { selection === 'friends' && <SelectionFriends/>}
            { selection === 'groups' && <SelectionGroups/>}

        </div>
    )
}

export default Selection