import { useState } from 'react'
import SelectionFriends from './SelectionFriends'
import SelectionGroups from './SelectionGroups'
import { ChattingWith } from '../../pages/Home'

type Props = {
    updateChattingWith:(chat:ChattingWith)=>void
}

const Selection = ({updateChattingWith}:Props) => {

    const [selection, setSelection] = useState<'friends'|'groups'>("friends")

    return (
        <div className="border-2 border-black p-2 h-[450px] w-3/12 gap-2 flex flex-col">

            <div className="border-2 border-black flex">

                {selection === 'friends' &&
                    <>
                        <button 
                            className="w-1/2 p-2 bg-black text-white" 
                            onClick={() => setSelection('friends')}
                        >
                            Friends
                        </button>

                        <button 
                            className="w-1/2 p-2 hover:bg-gray-300 duration-200" 
                            onClick={() => setSelection('groups')}
                        >
                            Groups
                        </button>
                    </>
                }
                
                {selection === 'groups' &&
                    <>
                        <button 
                            className="w-1/2 p-2 hover:bg-gray-300 duration-200" 
                            onClick={() => setSelection('friends')}
                        >
                            Friends
                        </button>

                        <button 
                            className="w-1/2 p-2 bg-black text-white" 
                            onClick={() => setSelection('groups')}
                        >
                            Groups
                        </button>
                    </>
                }

            </div>
            
            { selection === 'friends' && <SelectionFriends updateChattingWith={updateChattingWith}/>}
            { selection === 'groups' && <SelectionGroups/>}

        </div>
    )
}

export default Selection