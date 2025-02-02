import { useState } from 'react'
import SelectionFriends from './SelectionFriends'
import SelectionGroups from './SelectionGroups'

const Selection = () => {

    const [selection, setSelection] = useState<'friends'|'groups'>("friends")

    return (
        <div className="bg-blue-600 shadow-lg p-3 h-full w-1/3 gap-3 flex flex-col rounded-lg relative self-start">

            <div className="flex gap-3">

                {selection === 'friends' &&
                    <>
                        <button 
                            className="w-full p-3 bg-blue-800 font-bold text-white rounded-lg" 
                            onClick={() => setSelection('friends')}
                        >
                            Amigos
                        </button>

                        {/* <button 
                            className="w-1/2 p-3 bg-blue-700 text-white hover:bg-blue-800 hover:font-bold duration-300 rounded-lg" 
                            onClick={() => setSelection('groups')}
                        >
                            Grupos
                        </button> */}
                    </>
                }
                
                {/* {selection === 'groups' &&
                    <>
                        <button 
                            className="w-1/2 p-3 bg-blue-700 text-white hover:bg-blue-800 hover:font-bold duration-300 rounded-lg"
                            onClick={() => setSelection('friends')}
                        >
                            Amigos
                        </button>

                        <button 
                            className="w-1/2 p-3 bg-blue-800 font-bold text-white rounded-lg" 
                            onClick={() => setSelection('groups')}
                        >
                            Grupos
                        </button>
                    </>
                }
 */}
            </div>
            
            { selection === 'friends' && <SelectionFriends/>}
           {/*  { selection === 'groups' && <SelectionGroups/>} */}

        </div>
    )
}

export default Selection