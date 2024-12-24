import { FaUser } from "react-icons/fa";
import { useEffect } from "react"
import { useGetFriends } from "../../hooks/friendshipHooks/useGetFriends"
import { useGetReceivedFriendsRequests } from "../../hooks/friendshipHooks/useGetReceivedFriendRequests";

type Props = {}

const SelectionFriends = (props: Props) => {

    const {getFriends, friendsList} = useGetFriends()
    const {getReceivedFriendsRequests, requests} = useGetReceivedFriendsRequests()

    useEffect(() => {
        getFriends()
        getReceivedFriendsRequests()
    }, [])

    return (
        <div className='h-full overflow-y-auto'>

            <div className="border-2 border-black text-left p-2 my-1">
                <p className="font-bold text-lg">Friends</p>
                <ul className="flex flex-col gap-1">

                    {friendsList.length === 0 && <p>None</p>}

                    {friendsList.map((friend) => (
                        <li key={friend.userId} className="w-full">
                            <button className="p-3 w-full border text-left hover:bg-black hover:text-white duration-200 flex gap-2 items-center">
                                <FaUser size={20}/>
                                {friend.username}
                            </button>
                        </li>
                    ))}

                </ul>
            </div>

            <div className="border-2 border-black text-left p-2 my-1">
                <p className="font-bold text-lg">Request received</p>
                <ul className="flex flex-col gap-1">

                    {requests.length === 0 && <p>None</p>}

                    {requests.map((request) => (
                        <li key={request.friendshipId} className="w-full">
                            <button className="p-3 w-full border text-left hover:bg-black hover:text-white duration-200 flex gap-2 items-center">
                                <FaUser size={20}/>
                                {request.username}
                            </button>
                        </li>
                    ))}

                </ul>
            </div>

            <div className="border-2 border-black text-left p-2 my-1">
                <p className="font-bold text-lg">Requests sent</p>
                <ul>
                    <li>...</li>
                </ul>
            </div>  

        </div>
    )
}

export default SelectionFriends